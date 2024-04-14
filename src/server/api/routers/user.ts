import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { game } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  createGame: publicProcedure
    .input(
      z.object({
        dailyChallenege: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const createGameDbRes = await ctx.db
        .insert(game)
        .values({
          userAgent: ctx.requestMeta.userAgent ?? "no-user-agent",
          userIp: ctx.requestMeta.ip ?? "no-ip",
          dailyChallenge: input.dailyChallenege,
          createdById: ctx.session?.user.id ?? "no-user",
          attempts: 0,
        })
        .returning();

      if (!createGameDbRes?.[0]) {
        return {
          success: false,
          error: "Failed to create game",
        };
      }

      return {
        gameId: createGameDbRes[0].id,
        success: true,
      };
    }),
});
