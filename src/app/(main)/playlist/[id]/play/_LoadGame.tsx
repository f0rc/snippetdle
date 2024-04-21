import React from "react";
import Game, { type GameType } from "~/app/_components/Game";

export type GameInfo = {
  dailyChallenge: boolean;
  date: string;
  gameId: string;
  playlistId: string;
  roundId: string;
};

export type Song = {
  album_image: string;
  album_name: string;
  album_release_date: string;
  artist_name: string;
  id: string;
  preview_url: string;
};

export type RoundInfo = {
  id: string;
  createdById: string | null;
  createdAt: Date;
  songId: string;
  gameId: string;
  attempts: number;
  guess: string[] | null;
};

const LoadGame = ({
  gameInfo,
  song,
  gameType,
  roundInfo,
}: {
  gameInfo: GameInfo;
  song: Song;
  gameType: GameType;
  roundInfo?: RoundInfo;
}) => {
  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex h-full w-full justify-center">
        <Game
          gameInfo={gameInfo}
          song={song}
          gameType={gameType}
          roundInfo={roundInfo}
        />
      </div>
    </main>
  );
};

export default LoadGame;
