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
  });

  const [selectAnswer, setSelectAnswer] = useState("");

  const playIntervals = [1000, 2000, 3000, 5000, 7000, 10000];

  const handleRoundSubmit = (skip: boolean) => {
    const newRoundInfo = {
      artistName: skip ? "round_skip" : selectAnswer,
      correct: selectAnswer === gameInfo.currentSong?.artist_name && !skip,
      skip: skip,
    };

    setGameInfo((p) => ({
      ...p,
      roundInfo: [...p.roundInfo, newRoundInfo],
    }));

    if (newRoundInfo.correct) {
      setGameInfo((p) => ({
        ...p,
        roundOver: true,
      }));
    } else if (gameInfo.roundInfo.length > 5) {
      setGameInfo((p) => ({
        ...p,
        roundOver: true,
      }));
    }
  };

  // effect to end game
  useEffect(() => {
    if (gameInfo.roundInfo.length >= 6) {
      console.log("WE GOING TO END ROUND");
      setGameInfo((p) => ({ ...p, roundOver: true }));
    }
  }, [gameInfo.roundInfo.length]);

  // useEffect(() => {
  //   if (gameInfo.songsPlayed.length === gameInfo.totalRounds) {
  //     console.log("GAME END");
  //     setGameInfo((p) => ({ ...p, gameOver: true }));
  //   }
  // }, [gameInfo.songsPlayed]);

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
