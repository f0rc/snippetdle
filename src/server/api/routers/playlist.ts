import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Song, playlist, users } from "~/server/db/schema";

export const playlistRouter = createTRPCRouter({
  getPlaylist: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const playlistInfo = await ctx.db.query.playlist.findFirst({
        where: eq(playlist.id, input.id),
      });

      const playlistMeta = await ctx.db
        .select()
        .from(playlist)
        .where(sql`${playlist.id} = ${input.id}`)
        .leftJoin(users, sql`${playlist.createdById} = ${users.id}`);

      // console.log(playlistMeta);

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
          created_at,
          isChallengeSong,
          preview_url,
        }) => ({
          id,
          album_image,
          album_name,
          album_release_date,
          artist_name,
          created_at,
          isChallengeSong,
          preview_url,
        }),
      );

      return {
        playlistId: playlistInfo.id,
        playlistName: playlistInfo.name,
        playlistImage: playlistInfo.playlistImage,
        playlistDescription: playlistInfo.playlistDescription,
        songs: playlistSongs,
      };
    }),

  getPlaylistList: publicProcedure
    .input(
      z.object({
        offset: z.number().default(0),
        sortType: z
          .enum(["newest", "oldest", "mostPlayed", "leastPlayed", "mostLiked"])
          .default("newest"),
      }),
    )
    .query(async ({ ctx, input }) => {
      // TODO: Implement sorting

      const playlists = await ctx.db.query.playlist.findMany({
        orderBy: (playlist, { desc }) => [desc(playlist.created_at)],

        limit: 10,
        offset: input.offset,
      });

      return playlists;
    }),
});

export type getPlaylistSongstype = {
  id: string;
  album_image: string;
  album_name: string;
  album_release_date: string;
  artist_name: string;
  created_at: Date;
  isChallengeSong: boolean | null;
  preview_url: string;
};
