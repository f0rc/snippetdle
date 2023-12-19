import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSpotifyToken, type SpotifyResponse } from "./utils";

import { Song } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const gameRouter = createTRPCRouter({
  createPlaylist: publicProcedure
    .input(z.object({ spotifyPlaylistUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const url = getPlaylistIdFromUrl(input.spotifyPlaylistUrl);

      if (!url)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid playlist url",
        });

      const token = await getSpotifyToken({ db: ctx.db });

      const playlist = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((res) => res.json() as Promise<SpotifyResponse>);

      const songDataList = [];

      for (const item of playlist.tracks.items) {
        if (item.track.preview_url !== null) {
          const songData: typeof Song.$inferInsert = {
            preview_url: item.track.preview_url,
            album_name: item.track.name,
            album_image: item.track.album.images[0]?.url ?? "",
            album_release_date: item.track.album.release_date,
            artist_name: item.track.artists[0]?.name ?? "Unknown",
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
                // console.log(x);
                return [x, sql.raw(`excluded."${x}"`)];
              }),
            ),
            updatedAt: new Date(),
          },
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
