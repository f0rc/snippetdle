import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getSpotifyToken, type SpotifyResponse } from "./spotify/utils";

import {
  Song,
  artist,
  artistSearchQuery,
  dailyChallenge,
  playlist as playlistSchema,
} from "~/server/db/schema";
import { eq, ilike, like, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { dailyChallengeType } from "~/trpc/utils";
import { ArtistAPIType, fakeData } from "./spotify/Artist";
import { dbType } from "~/server/db";

export const gameRouter = createTRPCRouter({
  createPlaylist: publicProcedure
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

      const token = await getSpotifyToken({ db: ctx.db });

      const playlist = await fetch(
        `https://api.spotify.com/v1/playlists/${url}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      ).then((res) => res.json() as Promise<SpotifyResponse>);

      if (!playlist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to playlist from spotify",
        });
      }

      const playListDb = await ctx.db
        .insert(playlistSchema)
        .values({
          id: url,
          name: input.playlistName,
          createdById: "ADMIN",
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
          console.log(e);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Playlist already exists",
          });
        });

      if (!playListDb[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create playlist",
        });
      }

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

      return { success: true };
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

  getDailyChallenge: publicProcedure.query(async ({ ctx }) => {
    // TODO TEST IF THIS ACTUALLY WORKS
    const date = new Date().toLocaleDateString("en-US");

    const dbRes = await ctx.db
      .select()
      .from(dailyChallenge)
      .where(eq(sql`DATE(${dailyChallenge.date})`, date))
      .leftJoin(Song, eq(dailyChallenge.songId, Song.id))
      .limit(1);

    const dailyChallengeRes = dbRes[0];

    if (!dailyChallengeRes) {
      console.log("res not available");
      return {
        dailyChallenge: null,
      };
    }

    if (!dailyChallengeRes.Song) {
      return {
        dailyChallenge: null,
      };
    }

    return {
      dailyChallenge: {
        id: dailyChallengeRes.dailyChallenge.id,
        date: dailyChallengeRes.dailyChallenge.date,
        song: {
          id: dailyChallengeRes.Song.id,
          preview_url: dailyChallengeRes.Song.preview_url,
          album_name: dailyChallengeRes.Song.album_name,
          album_image: dailyChallengeRes.Song.album_image,
          album_release_date: dailyChallengeRes.Song.album_release_date,
          artist_name: dailyChallengeRes.Song.artist_name,
        },
      } as dailyChallengeType,
    };
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

      console.log(getArtistFromDb);

      if (getArtistFromDb.length < 5) {
        console.log("==============================searching spotify");
        const res = await searchArtist(input.artistName, token);

        const artistResult = res.artists.items.map((artist) => {
          const imageUrl =
            artist.images.length > 0 ? artist.images[0]?.url : "";
          return {
            name: artist.name,
            id: artist.id,
            popularity: artist.popularity,
            imageUrl: imageUrl,
            genres: artist.genres,
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

        const newList = artistResult.sort((a, b) => {
          return b.popularity - a.popularity;
        });

        return {
          artistResult: newList.slice(0, 5),
        };
      } else {
        // sort by popularity
        const newList = getArtistFromDb.sort((a, b) => {
          return b.popularity - a.popularity;
        });

        return {
          artistResult: newList.slice(0, 5),
        };
      }
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
