import Image from "next/image";
import React, { Suspense } from "react";
import { getScoreEmojis } from "./utils/getEmoji";
import { useGameInfo } from "./State/useGameInfo";

const GameOver = () => {
  const { gameInfo } = useGameInfo();

  return (
    <div className={`flex w-full flex-col justify-start  gap-4 px-4 pt-5`}>
      {gameInfo.gameRound.map((game) => {
        return (
          <div className="flex items-start justify-start gap-4">
            <Suspense
              fallback={
                <div
                  style={{ width: 200, height: 200 }}
                  className="animate-pulse bg-black"
                ></div>
              }
            >
              <Image
                src={game.song?.album_image ?? ""}
                alt="album cover"
                width={200}
                height={200}
                className={`rounded-md`}
              />
            </Suspense>
            <div>
              <p className="text-2xl">{game.song?.album_name}</p>
              <p className="text-xl">{game.song?.artist_name}</p>

              <p className="text-xl">
                {new Date(game.song?.album_release_date ?? 0).getFullYear()}
              </p>

              <div className="flex gap-1">
                {getScoreEmojis(game.rounds ?? []).map((emoji, index) => (
                  <span
                    key={index}
                    className={
                      emoji === "⬜"
                        ? "text-gray-500"
                        : emoji === "❌"
                          ? "text-red-500"
                          : "text-green-500"
                    }
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameOver;

export const RoundOver = () => {
  const { gameInfo } = useGameInfo();
  return (
    <div
      className={`flex w-full flex-col items-center justify-center  gap-4 pt-5 md:flex-row`}
    >
      <Suspense
        fallback={
          <div
            style={{ width: 200, height: 200 }}
            className="animate-pulse bg-black"
          ></div>
        }
      >
        <Image
          src={gameInfo.currentSong?.album_image ?? ""}
          alt="album cover"
          width={200}
          height={200}
          className={`rounded-md`}
        />
      </Suspense>
      <div>
        <p className="text-2xl">{gameInfo.currentSong?.album_name}</p>
        <p className="text-xl">{gameInfo.currentSong?.artist_name}</p>

        <p className="text-xl">
          {new Date(
            gameInfo.currentSong?.album_release_date ?? 0,
          ).getFullYear()}
        </p>

        <div className="flex gap-1">
          {getScoreEmojis(gameInfo.roundInfo).map((emoji, index) => (
            <span
              key={index}
              className={
                emoji === "⬜"
                  ? "text-gray-500"
                  : emoji === "❌"
                    ? "text-red-500"
                    : "text-green-500"
              }
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
