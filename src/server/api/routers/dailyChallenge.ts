import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSpotifyToken, type SpotifyResponse } from "./utils";

import { Song, playlist as playlistSchema } from "~/server/db/schema";
import { eq, sql, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
});

function getPlaylistIdFromUrl(url: string) {
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 1]?.split("?")[0];
  return id;
}
