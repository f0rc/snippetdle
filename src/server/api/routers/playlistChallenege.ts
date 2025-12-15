import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Song, game, roundInfo } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, arrayContains, sql } from "drizzle-orm";

export const playlistGame = createTRPCRouter({
  createGame: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const song = await ctx.db
        .select()
        .from(Song)
        .where(and(arrayContains(Song.playlistId, [input.playlistId])))
        .orderBy(sql`random()`)
        .limit(1);

      if (!song[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to get the first song",
        });
      }

      const gameInfoRes = await ctx.db
        .insert(game)
        .values({
          userAgent: ctx.requestMeta.userAgent ?? "unknown",
          userIp: ctx.requestMeta.ip ?? "unknown",
          playlistId: input.playlistId,
          createdById: ctx.session.user.id,
          dailyChallenge: false,
          songPlayed: [song[0].id],
        })
        .returning();

      if (!gameInfoRes[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create game",
        });
      }
      // then call on another api to return the first song

      const gameDate = new Date().toLocaleDateString("en-US");

      const createRound = await ctx.db
        .insert(roundInfo)
        .values({
          game_songId: `${song[0].id}`,
          attempts: 0,
          gameId: gameInfoRes[0].id,
          createdById: ctx.session.user.id,
        })
        .returning();

      if (!createRound[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to get the first song",
        });
      }

      return {
        success: true,
        gameInfo: {
          gameId: gameInfoRes[0].id,
          dailyChallenge: gameInfoRes[0].dailyChallenge,
          playlistId: input.playlistId, // ?? HOW WOULD THIS WORK IN THE DAILY CHALLENGE
          date: gameDate,
          roundId: createRound[0].id,
        },
        song: {
          id: song[0].id,
          preview_url: song[0].preview_url,
          album_name: song[0].album_name,
          album_image: song[0].album_image,
          album_release_date: song[0].album_release_date,
          artist_name: song[0].artist_name,
        },
      };
    }),
});
