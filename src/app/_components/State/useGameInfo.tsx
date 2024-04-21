"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface roundInfoType {
  artistName: string;
  correct: boolean;
  skip: boolean;
}

export type GameMainState = {
  gameId: string;
  gameDate: string;
  dailyChallenge: boolean;
  volume: number;
  songStep: number;
  gameOver: boolean;
  roundInfo: roundInfoType[];
  roundId: string;
};

export type GameInfoContext = {
  gameInfo: GameMainState;
  setGameInfo: React.Dispatch<React.SetStateAction<GameMainState>>;
  playIntervals: number[];
  selectAnswer: string;
  setSelectAnswer: (selectAnswer: string) => void;
  loaded: boolean;
  addSong: (newSong: string) => void;
};

const GameInfoContext = createContext<GameInfoContext | null>(null);
export const useGameInfo = () => {
  const context = useContext(GameInfoContext);

  if (!context) {
    throw new Error("useGameInfo must be used within a GameMetaProvider");
  }

  return context;
};

export const GameMetaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [gameInfo, setGameInfo] = useState<GameMainState>({
    gameId: "",
    dailyChallenge: false,
    gameDate: "",
    volume: 10,
    songStep: 0,
    gameOver: false,
    roundInfo: [],
    roundId: "",
  });

  const [songs, setSongs] = useState<Set<string>>(new Set());

  const addSong = (newSong: string) => {
    setSongs((prevSongs) => {
      const uniqueSongs = new Set(prevSongs);
      uniqueSongs.add(newSong);
      return uniqueSongs;
    });
  };

  useEffect(() => {
    console.log(songs);
  }, [songs]);

  const [selectAnswer, setSelectAnswer] = useState("");

  const playIntervals = [1000, 2000, 3000, 5000, 7000, 10000];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (gameInfo.dailyChallenge) {
      const gameInfoLocal = localStorage.getItem("gameInfo");

      if (gameInfoLocal) {
        const x = JSON.parse(gameInfoLocal) as GameMainState;
        if (x.roundInfo.length && gameInfo.gameDate === x.gameDate) {
          setGameInfo(x);
        }
      }
    }

    setLoaded(true);
  }, []);

  // save to local storage on roundInfo change
  useEffect(() => {
    if (gameInfo.roundInfo.length && gameInfo.dailyChallenge) {
      localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
    }
  }, [gameInfo]);

  // useeffect to color in the rounds

  // effect to end game
  useEffect(() => {
    if (gameInfo.songStep >= 6) {
      setGameInfo((p) => ({ ...p, gameOver: true }));
    }
  }, [gameInfo.songStep]);

  return (
    <GameInfoContext.Provider
      value={{
        loaded,
        gameInfo,
        setGameInfo,
        playIntervals,
        selectAnswer,
        setSelectAnswer,
        addSong,
      }}
    >
      {children}
    </GameInfoContext.Provider>
  );
};
