import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  createPlaylist: publicProcedure
    .input(z.object({ spotifyPlaylistUrl: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log(input.spotifyPlaylistUrl);
      // fetch playlist form spotify and get the info and cachce to db
    }),
});
