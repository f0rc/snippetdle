"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface roundInfoType {
  songStep: number;
  artistName: string;
  correct: boolean;
  skip: boolean;
}

export type GameMainState = {
  gameId: string;
  sync: boolean;
  gameDate: string;
  volume: number;
  songStep: number;
  gameOver: boolean;
  roundInfo: roundInfoType[];
};

export type GameInfoContext = {
  gameInfo: GameMainState;
  setGameInfo: React.Dispatch<React.SetStateAction<GameMainState>>;
  playIntervals: number[];
  selectAnswer: string;
  setSelectAnswer: (selectAnswer: string) => void;
  loaded: boolean;
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
    sync: false,
    gameDate: "",
    volume: 10,
    songStep: 0,
    gameOver: false,
    roundInfo: [],
  });

  const [selectAnswer, setSelectAnswer] = useState("");

  const playIntervals = [1000, 2000, 3000, 5000, 7000, 10000];

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const gameInfoLocal = localStorage.getItem("gameInfo");

    if (gameInfoLocal) {
      const x = JSON.parse(gameInfoLocal) as GameMainState;
      if (x.roundInfo.length && gameInfo.gameDate === x.gameDate) {
        setGameInfo(x);
      }
    }

    setLoaded(true);
  }, []);

  // save to local storage on roundInfo change
  useEffect(() => {
    if (gameInfo.roundInfo.length) {
      localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
    }
  }, [gameInfo]);

  // useeffect to color in the rounds
  useEffect(() => {
    if (gameInfo.roundInfo.length) {
      gameInfo.roundInfo.forEach((round) => {
        const roundElement = document.getElementById(round.songStep + "round");
        if (roundElement) {
          if (round.correct) {
            roundElement.style.backgroundColor = "#3BB143";
          } else if (round.skip) {
            roundElement.style.backgroundColor = "#808080";
          } else {
            roundElement.style.backgroundColor = "#FF0000";
          }
        }
      });
    }
  }, [gameInfo.roundInfo]);

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
      }}
    >
      {children}
    </GameInfoContext.Provider>
  );
};
