import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { gameRouter } from "./routers/dailyChallenge";
import { playlistRouter } from "./routers/playlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  game: gameRouter,
  playlist: playlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
