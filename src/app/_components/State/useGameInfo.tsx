"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface roundInfoType {
  artistName: string;
  correct: boolean;
  skip: boolean;
}
export type SongType = {
  id: string;
  preview_url: string;
  album_name: string;
  album_image: string;
  album_release_date: string;
  artist_name: string;
};

export type GameRounds = {
  song: SongType | null;
  rounds: roundInfoType[] | null;
};

export type GameState = {
  roundOver: boolean;
  currentIndex: number | null;
  totalRounds: number | null;
  gameDate: string | null;
  songsPlayed: SongType[];
  roundInfo: roundInfoType[];
  currentSong: SongType | null;

  gameRound: GameRounds[];
  gameOver: boolean;
  totalScore: number;
  totalPossibleScore: number;

  isDaily: boolean;
};

export type GameInfoContext = {
  gameInfo: GameState;
  setGameInfo: React.Dispatch<React.SetStateAction<GameState>>;
  playIntervals: number[];
  selectAnswer: string;
  setSelectAnswer: (selectAnswer: string) => void;
  handleRoundSubmit: (skip: boolean) => void;
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
  const [gameInfo, setGameInfo] = useState<GameState>({
    roundOver: false,
    currentIndex: null,
    totalRounds: null,
    gameDate: null,
    songsPlayed: [],
    roundInfo: [],
    gameRound: [],
    currentSong: null,

    gameOver: false,
    totalPossibleScore: 0,
    totalScore: 0,
    isDaily: false,
  });

  const [selectAnswer, setSelectAnswer] = useState("");

  const playIntervals = [1000, 2000, 3000, 5000, 7000, 10000];

  const handleRoundSubmit = (skip: boolean) => {
    const newRoundInfo = {
      artistName: skip ? "round_skip" : selectAnswer,
      correct: selectAnswer === gameInfo.currentSong?.artist_name && !skip,
      skip: skip,
    };

    const updatedGameInfo = {
      ...gameInfo,
      roundInfo: [...gameInfo.roundInfo, newRoundInfo],
    };

    if (gameInfo.isDaily) {
      // console.log("GOING TO SET ROUND", gameInfo.roundInfo, newRoundInfo);
      localStorage.setItem(
        JSON.stringify(gameInfo.gameDate),
        JSON.stringify(updatedGameInfo),
      );
    }

    if (newRoundInfo.correct || gameInfo.roundInfo.length > 5) {
      updatedGameInfo.roundOver = true;
      if (gameInfo.isDaily) {
        localStorage.setItem(
          JSON.stringify(gameInfo.gameDate),
          JSON.stringify(updatedGameInfo),
        );
      }
    }

    setGameInfo(updatedGameInfo);
  };

  // effect to end round
  useEffect(() => {
    if (gameInfo.roundInfo.length >= 6) {
      setGameInfo((p) => ({ ...p, roundOver: true }));
      if (gameInfo.isDaily) {
        localStorage.setItem(
          JSON.stringify(gameInfo.gameDate),
          JSON.stringify({
            ...gameInfo,
            roundOver: true,
          }),
        );
      }
    }
  }, [gameInfo.roundInfo.length]);

  return (
    <GameInfoContext.Provider
      value={{
        gameInfo,
        setGameInfo,
        playIntervals,
        selectAnswer,
        setSelectAnswer,
        handleRoundSubmit,
      }}
    >
      {children}
    </GameInfoContext.Provider>
  );
};
