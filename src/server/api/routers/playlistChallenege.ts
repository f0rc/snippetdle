import { z } from "zod";
import {
  type TRPCContextType,
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";
import { Song, game, playlist, roundInfo } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import {
  and,
  arrayContains,
  arrayOverlaps,
  count,
  desc,
  eq,
  inArray,
  not,
  notInArray,
  sql,
} from "drizzle-orm";

export const playlistGame = createTRPCRouter({
  // step1 game exits
  gameExits: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const playListLength = await ctx.db
        .select({ count: count() })
        .from(Song)
        .where(sql`${input.playlistId} = ANY(${Song.playlistId})`);

      if (!playListLength[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "FUCKED",
        });
      }

      console.log("SONGS IN PLAYLIST", playListLength[0].count);

      const gameExists = await ctx.db.query.game.findFirst({
        where: (model, { eq, and, lt }) =>
          and(
            lt(
              sql`array_length(${model.songsPlayed}, 1)`,
              playListLength[0]!.count,
            ),
            and(
              eq(model.createdById, ctx.session.user.id),
              eq(model.playlistId, input.playlistId),
            ),
          ),
      });

      if (!gameExists) {
        return {
          success: false,
          message: "No previous game found",
        };
      }

      return {
        success: true,
        message: "Game Found",
        gameId: gameExists.id,
      };
    }),

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

          songsPlayed: [song[0].id],
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
          attempts: 0,
          gameId: gameInfoRes[0].id,
          songId: song[0].id,
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

  getOldGame: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        dailyChallenge: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const gameDate = new Date().toLocaleDateString("en-US");
      const gameExists = await ctx.db.query.game.findFirst({
        where: (model, { eq, and }) =>
          and(
            eq(model.createdById, ctx.session.user.id),
            eq(model.playlistId, input.playlistId),
            not(model.dailyChallenge),
          ),
      });

      if (!gameExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No previous game found",
        });
      }

      const lastAttempt = await ctx.db.query.roundInfo.findFirst({
        where: (model, { eq, and }) =>
          and(eq(model.gameId, gameExists.id), not(model.isOver)),
      });

      // if no last attempt then return a new song if the song list is long enough
      if (!lastAttempt) {
        const playListLength = await ctx.db
          .select({ count: count() })
          .from(Song)
          .where(sql`${input.playlistId} = ANY(${Song.playlistId})`);

        if (!playListLength[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Game is found but no songs from playlist are found",
          });
        }

        // check if the songs in the playlist are more than the songs in the game if so then return a new song that is not been used

        if (playListLength[0].count > gameExists.songsPlayed.length) {
          const newSong = await ctx.db.query.Song.findFirst({
            where: (model) =>
              and(
                sql`${input.playlistId} = ANY(${model.playlistId})`,
                notInArray(model.id, gameExists.songsPlayed),
              ),
          });

          console.log("NEW SONG", newSong?.id);

          if (!newSong) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Game is found playlist is longer but no song found",
            });
          }

          const newAttempt = await ctx.db
            .insert(roundInfo)
            .values({
              attempts: 0,
              gameId: gameExists.id,
              songId: newSong.id,
              createdById: ctx.session.user.id,
            })
            .returning();

          if (!newAttempt[0]) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Game is found playlist is longer and no song found but unable to create attempt",
            });
          }

          console.log("NEW SONG", newSong.id);

          const updateGameWithNewSong = await ctx.db
            .update(game)
            .set({
              songsPlayed: sql`array_append(${game.songsPlayed}, ${newSong.id})`,
            })
            .where(eq(game.id, gameExists.id))
            .returning();

          if (!updateGameWithNewSong[0]) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "238",
            });
          }

          console.log("GOING TO RETURN A NEW SONG AND NEW ATTEMPT");
          return {
            success: true,
            gameInfo: {
              gameId: gameExists.id,
              dailyChallenge: input.dailyChallenge,
              date: gameDate,
              playlistId: input.playlistId,
              roundId: newAttempt[0].id,
            },
            roundInfo: lastAttempt,
            song: {
              id: newSong.id,
              preview_url: newSong.preview_url,
              album_name: newSong.album_name,
              album_image: newSong.album_image,
              album_release_date: newSong.album_release_date,
              artist_name: newSong.artist_name,
            },
          };
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "254",
        });
      }

      // get song from last attempt:
      const song = await ctx.db
        .select()
        .from(Song)
        .where(eq(Song.id, lastAttempt.songId))
        .limit(1);

      if (!song[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to get the first song",
        });
      }

      return {
        success: true,
        gameInfo: {
          gameId: gameExists.id,
          dailyChallenge: input.dailyChallenge,
          date: gameDate,
          playlistId: input.playlistId,
          roundId: lastAttempt.id,
        },
        roundInfo: lastAttempt,
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

  getNextSong: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        pastSongs: z.string().array(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const newSong = await ctx.db.query.Song.findFirst({
        where: (model, { notInArray }) => notInArray(model.id, input.pastSongs),
      });

      if (!newSong) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to find any song",
        });
      }

      const updateGameTable = await ctx.db
        .update(game)
        .set({
          songsPlayed: sql`${game.songsPlayed} || ${newSong.id}`,
        })
        .where(eq(game.id, input.gameId))
        .returning();

      if (!updateGameTable[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to update game",
        });
      }

      return {
        success: true,
        song: {
          id: newSong.id,
          preview_url: newSong.preview_url,
          album_name: newSong.album_name,
          album_image: newSong.album_image,
          album_release_date: newSong.album_release_date,
          artist_name: newSong.artist_name,
        },
      };
    }),

  updateGameAttempt: protectedProcedure
    .input(
      z.object({
        attemptId: z.string(),
        attempts: z.number(),
        gameId: z.string(),
        songId: z.string(),
        userGuess: z.string(),
        isOver: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log("YEHA", input);

      const gameAttemptDbRes = await ctx.db
        .insert(roundInfo)
        .values({
          id: input.attemptId,
          createdById: ctx.session.user.id,
          gameId: input.gameId,
          songId: input.songId,
          attempts: input.attempts,
          isOver: input.isOver,
          guess: [input.userGuess],
        })
        .onConflictDoUpdate({
          target: [roundInfo.id],
          set: {
            // TODO: possible problem
            guess: sql`array_append(${roundInfo.guess}, ${input.userGuess})`,
            attempts: input.attempts,
            isOver: input.isOver,
          },
        })
        .returning();

      if (!gameAttemptDbRes[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to update game round",
        });
      }

      return {
        success: true,
        gameAttempt: gameAttemptDbRes[0],
      };
    }),
});
