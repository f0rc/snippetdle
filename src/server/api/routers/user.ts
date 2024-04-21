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
      return {
        success: true,
      };
    }),
});
