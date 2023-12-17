import { gt, lt } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { spotifySecret } from "~/server/db/schema";

export const gameRouter = createTRPCRouter({
  createPlaylist: publicProcedure
    .input(z.object({ spotifyPlaylistUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input.spotifyPlaylistUrl);
      const spotifyAccessToken = await ctx.db.query.spotifySecret.findFirst({
        where: gt(spotifySecret.expires_in, new Date().valueOf().toString()),
      });

      let token = spotifyAccessToken?.access_token;

      if (!spotifyAccessToken) {
        console.log("getting new access token");
        const tokenFromApi = await getSpotifyToken();
        const expires = new Date().valueOf() + tokenFromApi.expires_in * 1000;
        await ctx.db.insert(spotifySecret).values({
          access_token: tokenFromApi.access_token,
          expires_in: expires.toString(),
        });

        token = tokenFromApi.access_token;
      }

      console.log(token);
    }),

  getGame: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log("Get game from db?");
    }),
});

const getSpotifyToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", env.spotify_client_id);
  params.append("client_secret", env.spotify_client_secret);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch token");
  }

  const tokenInfo = (await res.json()) as spotifyAccessTokenReturnType;
  return tokenInfo;
};

interface spotifyAccessTokenReturnType {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}
