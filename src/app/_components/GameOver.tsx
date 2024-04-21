import Image from "next/image";
import React, { Suspense } from "react";
import { getScoreEmojis } from "./utils/getEmoji";
import { type roundInfoType } from "./State/useGameInfo";

const GameOver = ({
  album_image,
  album_name,
  artist_name,
  roundInfo,
  album_release_date,
}: {
  album_image: string;
  album_name: string;
  artist_name: string;
  roundInfo: roundInfoType[];
  album_release_date: string;
}) => {
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
          src={album_image}
          alt="album cover"
          width={200}
          height={200}
          className={`rounded-md`}
        />
      </Suspense>
      <div>
        <p className="text-2xl">{album_name}</p>
        <p className="text-xl">{artist_name}</p>

        <p className="text-xl">{new Date(album_release_date).getFullYear()}</p>

        <div className="flex gap-1">
          {getScoreEmojis(roundInfo).map((emoji, index) => (
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

export default GameOver;
