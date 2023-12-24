"use client";

import { useState, useRef, useEffect, use } from "react";
import { set } from "zod";
import { api } from "~/trpc/react";
import { dailyChallengeType } from "~/trpc/utils";

const GameMain = () => {
  const gameData = api.game.getDailyChallenge.useQuery();

  const [currentSong, setCurrentSong] = useState(
    gameData.data?.dailyChallenge?.song.preview_url,
  );

  useEffect(() => {
    setCurrentSong(gameData.data?.dailyChallenge?.song.preview_url);
  }, [gameData.data?.dailyChallenge?.song.preview_url]);

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(30);

  useEffect(() => {
    if (audioPlayer.current) {
      console.log("volume", volume);
      audioPlayer.current.volume = volume / 100;

      setVolume(volume);
    }
  }, [volume]);

  const [songStep, setSongStep] = useState(1);

  const handlePlay = async () => {
    if (audioPlayer.current && !isPlaying && songStep < 5) {
      audioPlayer.current.currentTime = 0;

      while (audioPlayer.current.currentTime <= songStep) {
        setIsPlaying(true);
        await audioPlayer.current.play();
      }
      audioPlayer.current.pause();
      setIsPlaying(false);
      setSongStep(songStep + 1);
    } else if (audioPlayer.current && isPlaying) {
      setIsPlaying(false);
      audioPlayer.current.pause();
    } else if (songStep === 5) {
      setHidden(true);
      // play the rest of the song
      if (audioPlayer.current) {
        await audioPlayer.current.play();
        setIsPlaying(true);
      }
    }
  };

  // TODO: add logic to unhide the album cover
  const [hidden, setHidden] = useState(false);

  const [time, setTime] = useState({
    duration: "0:00",
    currentTime: "0:00",
    timeLeft: "0:30",
  });

  function getAudioDuration(audioElement: HTMLAudioElement | null) {
    if (!audioElement) return;

    const duration = audioElement.duration;
    const currentTime = audioElement.currentTime;
    const timeLeft = duration - currentTime;

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);

      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    setTime({
      duration: formatTime(duration),
      currentTime: formatTime(currentTime),
      timeLeft: formatTime(timeLeft),
    });
  }

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center pt-4">
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="flex flex-col items-center justify-center">
          <button
            className="absolute z-10 lg:hidden"
            onClick={handlePlay}
            disabled={isPlaying && songStep < 5}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-10 w-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
          <div
            className="absolute h-40 w-40 rounded-md bg-black"
            style={{
              display: hidden ? "none" : "block",
            }}
          />
          <img
            src={gameData.data?.dailyChallenge?.song.album_image}
            alt=""
            width={160}
            height={160}
            className="h-40 w-40 rounded-md border-none bg-black"
          />
        </div>

        {/* Play button only for lg+ */}
        <button
          className="hidden rounded-full bg-yellow-400 p-4 lg:flex"
          onClick={handlePlay}
          disabled={isPlaying && songStep < 5}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
            />
          </svg>
        </button>

        <div className="w-1/2 gap-4">
          {/* META DATA */}
          <div className="flex flex-col pb-4">
            <p className="text-xl">Song Name</p>
            <p className="text-base">Artist Name</p>
          </div>
          {/* PLAYER */}
          <div className="flex flex-col rounded-full lg:max-w-sm">
            <audio
              ref={audioPlayer}
              src={currentSong}
              preload="true"
              loop
              onTimeUpdate={() => getAudioDuration(audioPlayer.current)}
            />

            {/* two divs with 5 sections, one div is the background and the other is overlay indicating the elapsed time */}
            {/* <div className="absolute z-0 h-4 w-full max-w-sm rounded-full bg-[#16222A]" />
            <div
              className="relative z-10 h-4 w-0 rounded-full bg-[#E2E941]"
              id="progressBar"
            /> */}

            <div className="flex w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  className={`w-1/5 border border-white p-2`}
                  id={i.toString()}
                  onClick={() => {
                    setSongStep(i + 1);
                  }}
                />
              ))}
            </div>

            <div className="flex flex-row justify-between pt-2">
              <p>{time.currentTime}</p>
              <p>0:30</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <input
          type="text"
          className="rounded-md bg-stone-100 p-2 text-base text-black lg:text-xl"
          placeholder="Guess the artist"
        />
        <div className="flex flex-col rounded-md bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              className="rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black hover:bg-stone-200 lg:text-xl"
            >
              Artist
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMain;
