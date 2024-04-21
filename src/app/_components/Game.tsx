"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGameInfo } from "./State/useGameInfo";
import { getAudioDuration } from "./utils/getTimeDuration";
import CassettePlayer from "./CassettePlayer";
import ArtistSearch from "./ArtistSearch";
import { api } from "~/trpc/react";
import GameOver from "./GameOver";
import { gameInfoAtom } from "~/State/GameInfo";
import { useAtom } from "jotai";
import { type RoundInfo } from "../(main)/playlist/[id]/play/_LoadGame";

export type GameProps = {
  gameInfo: {
    gameId: string;
    date: string;
    playlistId: string;
    dailyChallenge: boolean;
    roundId: string;
  };
  song: {
    id: string;
    preview_url: string;
    album_name: string;
    album_image: string;
    album_release_date: string;
    artist_name: string;
  };

  gameType: GameType;
  roundInfo: RoundInfo | undefined;
};

export type GameType = "daily" | "playlist";

const Game = (gameProps: GameProps) => {
  const { playIntervals, selectAnswer, loaded, addSong } = useGameInfo();

  const [gameInfo, setGameInfo] = useAtom(gameInfoAtom);

  useEffect(() => {
    if (gameProps.roundInfo) {
      const roundInfoArray = gameProps.roundInfo?.guess?.map((round, index) => {
        return {
          songStep: index,
          artistName: round,
          correct: gameProps.song.artist_name.includes(round),
          skip:
            !gameProps.song.artist_name.includes(round) &&
            round === "round_skip",
        };
      });

      console.log("GOING TO SET STEP TO", gameProps.roundInfo.attempts);

      setGameInfo({
        dailyChallenge: gameProps.gameInfo.dailyChallenge,
        gameDate: gameProps.gameInfo.date,
        gameId: gameProps.gameInfo.gameId,
        songStep: gameProps.roundInfo.attempts,
        gameOver: false,
        roundId: gameProps.gameInfo.roundId,
        roundInfo: roundInfoArray ?? [],
        volume: 30,
      });
    } else {
      console.log("new game");
      setGameInfo({
        dailyChallenge: gameProps.gameInfo.dailyChallenge,
        gameDate: gameProps.gameInfo.date,
        gameId: gameProps.gameInfo.gameId,
        songStep: 0,
        gameOver: false,
        roundId: gameProps.gameInfo.roundId,
        roundInfo: [],
        volume: 30,
      });
    }

    addSong(gameProps.song.id);
  }, []);

  const audioPlayer = useRef<HTMLAudioElement>(null);

  //  MARK: Volume settings
  const [volume, setVolume] = useState(10);
  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = volume / 100;

      setVolume(volume);
    }
  }, [volume]);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState({
    duration: "0:00",
    currentTime: "0:00",
    timeLeft: "0:30",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  // manage the audio player intervals
  const playAudio = async (index: number) => {
    if (index >= playIntervals.length || !audioPlayer.current) {
      setIsPlaying(false);
      return;
    }

    const interval = playIntervals[index];
    audioPlayer.current.currentTime = 0;

    const playPromise = audioPlayer.current.play();
    const waitPromise = new Promise((resolve) => {
      setTimeoutId(
        setTimeout(() => {
          resolve("done");
        }, interval),
      );
    });

    setIsPlaying(true);

    await Promise.all([playPromise, waitPromise]);
    audioPlayer.current.pause();
    setIsPlaying(false);
    timeoutId && clearTimeout(timeoutId);
  };

  const handlePlay = async () => {
    if (
      !isPlaying &&
      gameInfo.songStep < playIntervals.length &&
      !gameInfo.gameOver
    ) {
      if (gameInfo.songStep <= 5) {
        await playAudio(gameInfo.songStep);
      }
    } else if (isPlaying) {
      if (audioPlayer.current) {
        setIsPlaying(false);
        audioPlayer.current.pause();
        if (timeoutId) {
          clearTimeout(timeoutId);
          // console.log("timeout cleared");
          setTimeoutId(null);
        }
      }
    } else {
      // Play the song normally without intervals if step > 5
      audioPlayer.current && (await audioPlayer.current.play());
      setIsPlaying(true);
    }
  };

  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    if (audioPlayer.current) {
      setAudioLoaded(true);
    }
  }, [audioPlayer.current]);

  // update API call when submitting answer

  const updateGameApi = api.playlistGame.updateGameAttempt.useMutation({
    onSuccess: (data) => {
      console.log("Sucess db attempt recorded", data);
    },
  });

  const handleRoundSubmit = async (skip: boolean) => {
    const newRoundInfo = {
      artistName: skip ? "round_skip" : selectAnswer,
      correct: selectAnswer === gameProps.song.artist_name && !skip,
      skip: skip,
    };

    console.log("BEFORE UPDATES", gameInfo);

    setGameInfo((p) => ({
      ...p,
      songStep: p.songStep + 1,
      roundInfo: [...p.roundInfo, newRoundInfo],
    }));

    // update if correct
    if (newRoundInfo.correct) {
      setGameInfo((p) => ({
        ...p,
        gameOver: true,
      }));
    } else if (gameInfo.songStep + 1 > 5) {
      setGameInfo((p) => ({
        ...p,
        gameOver: true,
      }));
    }

    await updateGameApi.mutateAsync({
      attempts: gameInfo.songStep + 1,
      attemptId: gameInfo.roundId,
      gameId: gameInfo.gameId,
      songId: gameProps.song.id,
      userGuess: newRoundInfo.artistName,
      isOver: newRoundInfo.correct || gameInfo.songStep + 1 > 5,
    });
  };

  useEffect(() => {
    if (gameInfo.roundInfo.length) {
      gameInfo.roundInfo.forEach((round, index) => {
        const roundElement = document.getElementById(index + "round");
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

  return (
    <div className="flex h-full w-screen max-w-xl flex-col items-center justify-center px-4 pt-4 lg:px-0 lg:pt-0">
      <audio
        ref={audioPlayer}
        src={gameProps.song.preview_url}
        preload="true"
        loop
        onTimeUpdate={() => {
          if (audioPlayer.current) {
            setTime(getAudioDuration(audioPlayer.current));
          }
        }}
      />

      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <CassettePlayer
          isPlaying={isPlaying}
          handlePlay={handlePlay}
          showPlayButton={audioLoaded}
          dailyChallenge={gameProps.gameInfo.dailyChallenge}
          tapeText={
            gameInfo.roundInfo.length
              ? gameInfo.roundInfo.map((round) => {
                  return {
                    text: round.skip ? "Skip" : round.artistName,
                    state: round.correct
                      ? "green"
                      : round.skip
                        ? "gray"
                        : "red",
                  };
                })
              : []
          }
        />

        {/* PLAYER */}
        <div className="flex w-full flex-col rounded-full lg:max-w-sm">
          <div className="flex w-full">
            {Array.from({ length: playIntervals.length }).map((_, i) => (
              <div
                key={i}
                className={`w-1/5 border border-white p-2`}
                id={i.toString() + "round"}
              />
            ))}
          </div>

          <div className="flex flex-row justify-between pt-2">
            <p>{time.currentTime}</p>
            <p>0:30</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-row items-center justify-start gap-1 rounded-md pb-4 md:justify-center">
        {gameInfo.roundInfo.map((round, index) => (
          <div
            key={index}
            className={`flex w-14 flex-row truncate rounded-md p-2 text-center font-mono text-xs font-semibold text-black md:w-60 md:text-xl ${
              round.skip
                ? "bg-gray-500"
                : round.correct
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          >
            <p className="h-full w-full self-center text-center">
              {round.skip ? "Skip" : round.artistName}
            </p>
          </div>
        ))}
      </div>

      {loaded && audioLoaded && (
        <div className="flex w-full items-start">
          {gameInfo.gameOver ? (
            <div className="flex w-full flex-col justify-between gap-10">
              <GameOver
                album_image={gameProps.song.album_image}
                album_name={gameProps.song.album_name}
                album_release_date={gameProps.song.album_release_date}
                artist_name={gameProps.song.artist_name}
                roundInfo={gameInfo.roundInfo}
              />
              <div className="flex items-center justify-center">
                <button className="flex rounded-md bg-yellow-500 px-4 py-2  font-semibold uppercase text-black transition-colors duration-300 ease-in-out hover:bg-yellow-400 focus:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                  Next Round
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex w-full flex-row justify-center gap-2`}>
              <ArtistSearch />
              <div className="flex h-12 w-1/5 flex-row gap-2">
                <button
                  className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
                  onClick={async () => {
                    selectAnswer && (await handleRoundSubmit(false));
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
                <button
                  className="rounded-lg bg-gray-600 px-2 font-semibold"
                  onClick={async () => {
                    await handleRoundSubmit(true);
                  }}
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
