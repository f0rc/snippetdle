"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import { api } from "~/trpc/react";
import type { dailyChallengeType } from "~/trpc/utils";
import CassettePlayer from "./CassettePlayer";
import { useGameInfo } from "./State/useGameInfo";
import { getScoreEmojis } from "./utils/getEmoji";
import { getAudioDuration } from "./utils/getTimeDuration";
import ArtistSearch from "./ArtistSearch";

type GameMainProps = {
  options: {
    dailyChallenge: dailyChallengeType;
  };
};

const GameMain = (GameMainProps: GameMainProps) => {
  const {
    gameInfo,
    playIntervals,
    setGameInfo,
    selectAnswer,
    setSelectAnswer,
    loaded,
  } = useGameInfo();

  const audioPlayer = useRef<HTMLAudioElement>(null);

  //  MARK: Volume settings
  const [volume, setVolume] = useState(10);
  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = volume / 100;

      setVolume(volume);
    }
  }, [volume]);
  // MARK: *Volume settings end

  const { mutate } = api.user.createGame.useMutation();

  const handleRoundSubmit = (skip: boolean) => {
    const newRoundInfo = {
      songStep: gameInfo.songStep,
      artistName: selectAnswer,
      correct:
        selectAnswer ===
          GameMainProps.options.dailyChallenge.song.artist_name && !skip,
      skip: skip,
    };

    if (gameInfo.roundInfo.length <= 5 && !gameInfo.gameOver) {
      const updatedRouned = [...gameInfo.roundInfo];
      updatedRouned.push(newRoundInfo);
      setGameInfo((prev) => ({ ...prev, roundInfo: updatedRouned }));
      // check if won else move to next round
      if (newRoundInfo.correct) {
        setGameInfo((p) => ({ ...p, gameOver: true }));
      } else {
        setGameInfo((p) => ({ ...p, songStep: p.songStep + 1 }));
      }

      setSelectAnswer("");
    } else {
      setGameInfo((p) => ({ ...p, gameOver: true }));
    }

    if (!gameInfo.gameId) {
      mutate({
        dailyChallenege: true,
      });
    } else {
      // post game attempts
    }
  };

  // MARK: play audio
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
  // logic to play audio
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

  return (
    <div className="flex h-full w-screen max-w-xl flex-col items-center justify-center px-4 pt-4 lg:px-0 lg:pt-0">
      <audio
        ref={audioPlayer}
        src={GameMainProps.options.dailyChallenge.song.preview_url}
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
          {/* two divs with 5 sections, one div is the background and the other is overlay indicating the elapsed time */}
          {/* <div className="absolute z-0 h-4 w-full max-w-sm rounded-full bg-[#16222A]" />
          <div
            className="relative z-10 h-4 w-0 rounded-full bg-[#E2E941]"
            id="progressBar"
          /> */}

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
        {gameInfo.roundInfo.map((round) => (
          <div
            key={round.songStep}
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
          {/* ROUND INFO */}

          {/* INPUT */}

          <div
            className={`flex w-full flex-row justify-center gap-2 ${
              gameInfo.gameOver ? " hidden" : ""
            }`}
          >
            <ArtistSearch />
            <div className="flex h-12 w-1/5 flex-row gap-2">
              <button
                className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
                onClick={() => {
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
                onClick={() => {
                  handleRoundSubmit(true);
                }}
              >
                Skip
              </button>
            </div>
          </div>
          <div
            className={`w-full gap-4 pt-5 ${
              gameInfo.gameOver ? " flex " : " hidden "
            } flex-col  items-center justify-center md:flex-row`}
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
                src={GameMainProps.options.dailyChallenge.song.album_image}
                alt="album cover"
                width={200}
                height={200}
                className={`rounded-md ${gameInfo.gameOver ? "" : " hidden "}`}
              />
            </Suspense>
            <div>
              <p className="text-2xl">
                {GameMainProps.options.dailyChallenge.song.album_name}
              </p>
              <p className="text-xl">
                {GameMainProps.options.dailyChallenge.song.artist_name}
              </p>

              <p className="text-xl">
                {new Date(
                  GameMainProps.options.dailyChallenge.song.album_release_date,
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
          {/* Search results */}
        </div>
      )}
    </div>
  );
};

export default GameMain;
