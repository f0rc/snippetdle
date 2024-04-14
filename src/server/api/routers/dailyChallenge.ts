import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getSpotifyToken, type SpotifyResponse } from "./spotify/utils";

import {
  Song,
  artist,
  artistSearchQuery,
  dailyChallenge,
  playlist as playlistSchema,
} from "~/server/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { dailyChallengeType } from "~/trpc/utils";
import { type ArtistAPIType } from "./spotify/Artist";

export const gameRouter = createTRPCRouter({
  createPlaylist: protectedProcedure
    .input(
      z.object({ spotifyPlaylistUrl: z.string(), playlistName: z.string() }),
    )
    .mutation(async ({ input, ctx }) => {
      const url = getPlaylistIdFromUrl(input.spotifyPlaylistUrl);

      if (!url) {
        console.log("NO URL");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid playlist url",
        });
      }

      // check if playlist exists
      const playlistExists = await ctx.db
        .select()
        .from(playlistSchema)
        .where(eq(playlistSchema.id, url))
        .then((res) => res[0]);

      if (playlistExists) {
        return { success: true, playlistId: url };
      }
      const token = await getSpotifyToken({ db: ctx.db });

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Spotify Error",
        });
      }

      const getPlaylistFromSpotify: unknown = await fetch(
        `https://api.spotify.com/v1/playlists/${url}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
        .then((res) => res.json())
        .catch((e) => {
          console.log(e);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to fetch playlist from spotify",
          });
        });

      console.log("got playlist from spotify", url);

      const playlist = getPlaylistFromSpotify as SpotifyResponse;

      if (!playlist) {
        await ctx.db.delete(playlistSchema).where(eq(playlistSchema.id, url));
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to playlist from spotify",
        });
      }

      if (playlist.hasOwnProperty("error")) {
        await ctx.db.delete(playlistSchema).where(eq(playlistSchema.id, url));
        console.log("Playlist not found types dont match");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Playlist not found",
        });
      }

      const playListDb = await ctx.db
        .insert(playlistSchema)
        .values({
          id: url,
          name: input.playlistName,
          playlistImage: playlist.images[0]?.url ?? "",
          playlistDescription: playlist.description ?? "",
          createdById: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: playlistSchema.id,
          set: {
            name: input.playlistName,
            updatedAt: new Date(),
          },
        })
        .returning()
        .catch((e) => {
          console.log("UNABLE TO PUT INTO DB", e);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Playlist already exists",
          });
        });

      if (!playListDb[0]) {
        await ctx.db.delete(playlistSchema).where(eq(playlistSchema.id, url));
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create playlist",
        });
      }

      console.log("PLAYLIST DB", playlist.tracks.items);

      const songDataList = [];

      for (const item of playlist.tracks.items) {
        if (item.track.preview_url !== null) {
          const songData: typeof Song.$inferInsert = {
            preview_url: item.track.preview_url,
            album_name: item.track.name,
            album_image: item.track.album.images[0]?.url ?? "",
            album_release_date: item.track.album.release_date,
            artist_name: item.track.artists[0]?.name ?? "Unknown",
            playlistId: [url],

            // TODO: CHANGE IT TO PROTECTED ROUTE TO ADD USER ID
            createdById: "ADMIN",
          };

          songDataList.push(songData);
        }
      }

      if (!songDataList || songDataList.length === 0) {
        // delete the playlist from the db
        await ctx.db.delete(playlistSchema).where(eq(playlistSchema.id, url));

        console.log("NO SONGS WITH PREVIEW URL");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unfortunate Situation",
        });
      }

      await ctx.db
        .insert(Song)
        .values(songDataList)
        .onConflictDoUpdate({
          target: [Song.album_name, Song.artist_name],
          set: {
            ...Object.fromEntries(
              Object.keys(songDataList[0] ?? {}).map((x) => {
                // append to the playlistId array instead of replacing it
                if (x === "playlistId") {
                  console.log(x);
                  return [
                    x,
                    sql.raw(
                      `ARRAY(SELECT DISTINCT UNNEST(ARRAY_APPEND(COALESCE("Song"."playlistId", '{}'), '${url}')))`,
                    ),
                  ];
                } else {
                  return [x, sql.raw(`excluded."${x}"`)];
                }
              }),
            ),
            updatedAt: new Date(),
          },
        })
        .catch((e) => {
          console.log(e);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create songs",
          });
        });

      // now for the songs that don't include a preview url need to use vercel + python + ytdl to get google link and idk how to manage the start time probably use js
      // uploadthing + url

      return { success: true, playlistId: url };
    }),

  getGame: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log("Get game from db?");
    }),

  getAllPlaylists: publicProcedure
    // .input(z.object({}))
    .query(async ({ input, ctx }) => {
      const playlists = await ctx.db
        .select({
          playlist_id: playlistSchema.id,
          playlist_name: playlistSchema.name,
          playlist_songs: {
            id: Song.id,
            preview_url: Song.preview_url,
            album_name: Song.album_name,
            album_image: Song.album_image,
            album_release_date: Song.album_release_date,
            artist_name: Song.artist_name,
          },
        })
        .from(playlistSchema)
        .leftJoin(Song, sql`${playlistSchema.id} = ANY(${Song.playlistId})`);

      // create a new object where the playlist contains all of its songs instead of having 1 playlist per song

      const playlistWithSongs = playlists.reduce(
        (acc, curr) => {
          if (acc[curr.playlist_id]) {
            if (curr.playlist_songs) {
              acc[curr.playlist_id]!.playlist_songs?.push(curr.playlist_songs);
            }
          } else {
            acc[curr.playlist_id] = {
              playlist_id: curr.playlist_id,
              playlist_name: curr.playlist_name,
              playlist_songs: curr.playlist_songs
                ? [curr.playlist_songs]
                : null,
            };
          }

          return acc;
        },
        {} as Record<
          string,
          {
            playlist_id: string;
            playlist_name: string;
            playlist_songs:
              | {
                  id: string;
                  preview_url: string | null;
                  album_name: string;
                  album_image: string | null;
                  album_release_date: string | null;
                  artist_name: string;
                }[]
              | null;
          }
        >,
      );

      return {
        playlistWithSongs,
      };
    }),

  /* 
      try to get a daily challenge from db which has a song and info about the song. 

      uses the current date to get the daily challenge. if it doesn't exist, create a new one and return it
    */
  getDailyChallenge: publicProcedure.query(async ({ ctx }) => {
    // TODO TEST IF THIS ACTUALLY WORKS
    const gameDate = new Date().toLocaleDateString("en-US");

    const dbRes = await ctx.db
      .select()
      .from(dailyChallenge)
      .where(eq(sql`DATE(${dailyChallenge.date})`, gameDate))
      .leftJoin(Song, eq(dailyChallenge.songId, Song.id))
      .limit(1)
      .then((res) => res[0]);

    if (dbRes?.Song) {
      return {
        dailyChallenge: {
          id: dbRes.dailyChallenge.id,
          date: gameDate,
          song: {
            id: dbRes.Song.id,
            preview_url: dbRes.Song.preview_url,
            album_name: dbRes.Song.album_name,
            album_image: dbRes.Song.album_image,
            album_release_date: dbRes.Song.album_release_date,
            artist_name: dbRes.Song.artist_name,
          },
        } as dailyChallengeType,
      };
    } else {
      console.log("Attpemting to create new daily challenge");
      // create a new daily challenge and return it
      const randomSong = await ctx.db
        .select()
        .from(Song)
        .where(eq(Song.isChallengeSong, false))
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .then((res) => res[0]);

      if (!randomSong) {
        console.log("[ERROR]: no songs available");
        return {
          dailyChallenge: null,
        };
      }

      const newDailyChallenge = await ctx.db
        .insert(dailyChallenge)
        .values({
          createdById: "ADMIN",
          date: gameDate,
          songId: randomSong.id,
        })
        .returning();

      // update the song to be a challenge song
      const songUpdate = await ctx.db
        .update(Song)
        .set({
          isChallengeSong: true,
        })
        .where(eq(Song.id, randomSong.id))
        .returning();

      if (!songUpdate[0]) {
        console.log("[ERROR]: failed to update song");
        return {
          dailyChallenge: null,
        };
      }

      if (!newDailyChallenge[0]) {
        console.log("[ERROR]: failed to create daily challenge");
        return {
          dailyChallenge: null,
        };
      }

      return {
        dailyChallenge: {
          id: newDailyChallenge[0].id,
          date: gameDate,
          song: {
            id: randomSong.id,
            preview_url: randomSong.preview_url,
            album_name: randomSong.album_name,
            album_image: randomSong.album_image,
            album_release_date: randomSong.album_release_date,
            artist_name: randomSong.artist_name,
          },
        } as dailyChallengeType,
      };
    }
  }),

  createDailyChallenge: publicProcedure
    .input(z.object({ songId: z.string(), forDate: z.date() }))
    .mutation(async ({ input, ctx }) => {
      const dateOnly = input.forDate.toISOString().split("T")[0];

      if (!dateOnly) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid date",
        });
      }

      await ctx.db
        .insert(dailyChallenge)
        .values({
          createdById: "ADMIN",
          date: dateOnly,
          songId: input.songId,
        })
        .returning();

      return {
        success: true,
      };
    }),

  getArtist: publicProcedure
    .input(z.object({ artistName: z.string() }))
    .query(async ({ input, ctx }) => {
      const token = await getSpotifyToken({ db: ctx.db });

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Spotify Error",
        });
      }

      // insert into db
      await ctx.db
        .insert(artistSearchQuery)
        .values({
          searchParam: input.artistName.toLowerCase(),
        })
        .onConflictDoNothing({ target: artistSearchQuery.searchParam });

      const getArtistFromDb = await ctx.db
        .select()
        .from(artist)
        .where(
          or(
            eq(
              sql.raw(`'${input.artistName.toLowerCase()}'`),
              sql`ANY(${artist.queryparam})`,
            ),
            ilike(artist.name, `%${input.artistName.toLowerCase()}%`),
          ),
        );

      let artistResult: (typeof artist.$inferSelect)[] = [];

      if (getArtistFromDb.length < 5) {
        console.log("==============================searching spotify");
        const res = await searchArtist(input.artistName, token);

        artistResult = res.artists.items.map((artist) => {
          const imageUrl: string | null =
            artist.images.length > 0
              ? artist.images[0]
                ? artist.images[0].url
                : null
              : null;
          return {
            name: artist.name,
            id: artist.id,
            popularity: artist.popularity,
            imageUrl: imageUrl,
            genere: artist.genres,
            queryparam: [input.artistName.toLowerCase()],
          };
        });

        await ctx.db
          .insert(artist)
          .values(artistResult)
          .onConflictDoUpdate({
            target: artist.id,
            set: {
              queryparam: sql.raw(
                `ARRAY(SELECT DISTINCT UNNEST(ARRAY_APPEND(COALESCE("artist"."queryparam", '{}'), '${input.artistName.toLowerCase()}')))`,
              ),
            },
          })
          .returning();
      }

      const allArtists = [...getArtistFromDb, ...artistResult];

      // TOOD: make it so that it would pick the most popular artist
      const uniqueArtists = Array.from(
        new Map(
          allArtists
            .sort((a, b) => {
              if (a.popularity !== b.popularity) {
                return b.popularity - a.popularity;
              } else {
                if (a.imageUrl && !b.imageUrl) {
                  return -1;
                } else if (!a.imageUrl && b.imageUrl) {
                  return 1;
                } else {
                  return 0;
                }
              }
            })
            .map((item) => [item.name, item]),
        ).values(),
      );

      console.log("UNIQUE ARTISTS", uniqueArtists);

      const newList = uniqueArtists.sort((a, b) => {
        const distanceA = levenshteinDistance(
          a.name.toLowerCase(),
          input.artistName.toLowerCase(),
        );
        const distanceB = levenshteinDistance(
          b.name.toLowerCase(),
          input.artistName.toLowerCase(),
        );

        return distanceA - distanceB;
      });

      return {
        artistResult: uniqueArtists.slice(0, 5),
      };
    }),
});

function getPlaylistIdFromUrl(url: string) {
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 1]?.split("?")[0];
  return id;
}

async function searchArtist(artistInput: string, apiToken: string) {
  const url = new URL(`https://api.spotify.com/v1/search`);

  url.searchParams.append("q", artistInput);

  url.searchParams.append("type", "artist");

  const artistSearchResponse = await fetch(url, {
    headers: {
      Authorization: "Bearer " + apiToken,
    },
  }).then((res) => res.json() as Promise<ArtistAPIType>);

  // const artistSearchResponse = fakeData;

  return artistSearchResponse;
}

const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] =
          Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) +
          1;
      }
    }
  }

  return matrix[b.length][a.length];
};
