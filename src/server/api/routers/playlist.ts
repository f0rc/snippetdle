import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Song, playlist } from "~/server/db/schema";

export const playlistRouter = createTRPCRouter({
  getPlaylist: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const playlistInfo = await ctx.db.query.playlist.findFirst({
        where: eq(playlist.id, input.id),
      });

      if (!playlistInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const songsInPlaylist = await ctx.db
        .select()
        .from(Song)
        .where(sql`${input.id} = ANY(${Song.playlistId})`);

      if (!songsInPlaylist || songsInPlaylist.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist is empty",
        });
      }

      const playlistSongs = songsInPlaylist.map(
        ({
          id,
          album_image,
          album_name,
          album_release_date,
          artist_name,
          createdAt,
          isChallengeSong,
          preview_url,
        }) => ({
          id,
          album_image,
          album_name,
          album_release_date,
          artist_name,
          createdAt,
          isChallengeSong,
          preview_url,
        }),
      );

      return {
        playlistId: playlistInfo.id,
        playlistName: playlistInfo.name,
        songs: playlistSongs,
      };
    }),
});

export type getPlaylistSongstype = {
  id: string;
  album_image: string;
  album_name: string;
  album_release_date: string;
  artist_name: string;
  createdAt: Date;
  isChallengeSong: boolean | null;
  preview_url: string;
};
