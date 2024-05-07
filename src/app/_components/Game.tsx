"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGameInfo } from "./State/useGameInfo";
import { getAudioDuration } from "./utils/getTimeDuration";
import CassettePlayer from "./CassettePlayer";
import ArtistSearch from "./ArtistSearch";
import GameOver, { RoundOver } from "./GameOver";

const Game = () => {
  const { playIntervals, selectAnswer, gameInfo, handleRoundSubmit } =
    useGameInfo();

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
    if (!isPlaying && gameInfo.roundInfo.length < playIntervals.length) {
      if (gameInfo.roundInfo.length <= 5) {
        await playAudio(gameInfo.roundInfo.length);
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

  return (
    <div className="flex h-full w-screen max-w-xl flex-col items-center justify-center px-4 pt-4 lg:px-0 lg:pt-0">
      <audio
        ref={audioPlayer}
        src={gameInfo.currentSong?.preview_url}
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
          dailyChallenge={false}
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
                className={`w-1/5 border border-white p-2 ${
                  gameInfo.roundInfo[i]?.skip
                    ? "bg-gray-500"
                    : gameInfo.roundInfo[i]?.correct
                      ? "bg-green-500"
                      : gameInfo.roundInfo[i]?.correct === false
                        ? "bg-red-500"
                        : "bg-none"
                }`}
                id={i.toString() + "round"}
              >
                {gameInfo.roundInfo[i]?.correct === true}{" "}
              </div>
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

      {audioLoaded && (
        <div className="flex w-full items-start">
          {gameInfo.roundOver ? (
            <div className="flex w-full flex-col justify-between gap-10">
              {gameInfo.currentSong && !gameInfo.gameOver && <RoundOver />}
            </div>
          ) : (
            <div className={`flex w-full flex-row justify-center gap-2`}>
              <ArtistSearch />
              <div className="flex h-12 w-1/5 flex-row gap-2">
                <button
                  className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
                  onClick={async () => {
                    selectAnswer && handleRoundSubmit(false);
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
                    handleRoundSubmit(true);
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
