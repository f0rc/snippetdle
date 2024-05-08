"use client";
import { api } from "~/trpc/react";
import Game from "../_components/Game";
import { useEffect } from "react";
import { type GameState, useGameInfo } from "../_components/State/useGameInfo";
import { Loader } from "../_components/Loader";

export default function Home() {
  const { data, isSuccess, isLoading } = api.game.getDailyChallenge.useQuery();

  const { setGameInfo } = useGameInfo();

  const fetchDailyLocalStorage = (gameId: string): boolean => {
    // need to get the game from local storage
    // game is not from today ie key = date from server
    const res = localStorage.getItem(JSON.stringify(gameId));

    if (res) {
      const LocalGame = JSON.parse(res) as GameState;

      if (LocalGame) {
        setGameInfo(LocalGame);
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (isSuccess && data?.dailyChallenge?.song) {
      if (!fetchDailyLocalStorage(data.dailyChallenge.date)) {
        setGameInfo({
          currentIndex: 0,
          currentSong: data?.dailyChallenge.song,
          gameDate: data?.dailyChallenge.date,
          totalRounds: 1,
          roundInfo: [],
          songsPlayed: [data?.dailyChallenge.song],
          gameRound: [],
          roundOver: false,
          gameOver: false,

          totalPossibleScore: 1 * 6,
          totalScore: 0,
          isDaily: true,
        });
      }
    }
  }, [isSuccess]);

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex h-full w-full justify-center">
        {isLoading ? (
          <Loader />
        ) : !data?.dailyChallenge ? (
          <div>Unable to fetch Daily Challenge</div>
        ) : (
          <Game />
        )}
      </div>
      {/* <div className="hidden h-full w-1/4 lg:flex">quick playlist</div> */}
    </main>
  );
}
