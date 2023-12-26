"use client";

import Image from "next/image";
import { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { api } from "~/trpc/react";
import type { dailyChallengeType } from "~/trpc/utils";

type GameMainProps = {
  options: {
    dailyChallenge: dailyChallengeType;
  };
};

const GameMain = (GameMainProps: GameMainProps) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = volume / 100;

      setVolume(volume);
    }
  }, [volume]);

  const [songStep, setSongStep] = useState(0);

  const playIntervals = [1000, 2000, 3000, 5000, 7000, 10000];

  const playAudio = async (index: number) => {
    if (index >= playIntervals.length || !audioPlayer.current) {
      setIsPlaying(false);
      return;
    }

    const interval = playIntervals[index];
    console.log("interval", interval);
    audioPlayer.current.currentTime = 0;

    const playPromise = audioPlayer.current.play();
    const waitPromise = new Promise((resolve) => setTimeout(resolve, interval));
    setIsPlaying(true);

    await Promise.all([playPromise, waitPromise]);

    audioPlayer.current.pause();
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    if (!isPlaying && songStep < playIntervals.length) {
      await playAudio(songStep);
    } else if (isPlaying) {
      setIsPlaying(false);
      audioPlayer.current?.pause();
    }
  };

  // TODO: add logic to unhide the album cover
  const [hidden, setHidden] = useState(false);

  const [time, setTime] = useState({
    duration: "0:00",
    currentTime: "0:00",
    timeLeft: "0:30",
  });

  // fetch artist data
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 300);
    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue, 300]);

  const artistSearch = api.game.getArtist.useQuery(
    { artistName: debouncedInputValue },
    { enabled: debouncedInputValue !== "" && debouncedInputValue.length >= 2 },
  );

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center pt-4">
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="flex flex-col items-center justify-center">
          <button
            className="absolute z-10 lg:hidden"
            onClick={handlePlay}
            disabled={isPlaying && songStep < 5}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            )}
          </button>
          <div
            className="absolute h-40 w-40 rounded-md bg-black"
            style={{
              display: hidden ? "none" : "block",
            }}
          />
          <Image
            src={GameMainProps.options.dailyChallenge.song.album_image}
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
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          )}
        </button>

        <div className="w-4/5 gap-4">
          {/* META DATA */}
          {/* <div className="flex flex-col pb-4">
            <p className="text-xl">Song Name</p>
            <p className="text-base">Artist Name</p>
            <p>{songStep}</p>
          </div> */}
          {/* PLAYER */}
          <div className="flex w-full flex-col rounded-full lg:max-w-sm">
            <audio
              ref={audioPlayer}
              src={GameMainProps.options.dailyChallenge.song.preview_url}
              preload="true"
              loop
              onTimeUpdate={(e) => {
                if (audioPlayer.current) {
                  setTime(getAudioDuration(audioPlayer.current));
                }
              }}
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
      <div className="flex w-full flex-col items-center gap-2 pt-4">
        <div className="flex w-4/5 flex-row justify-center gap-2 lg:w-1/2">
          <input
            type="text"
            className=" w-full rounded-md bg-stone-100 p-2 text-base  text-black lg:text-xl"
            placeholder="Guess the artist"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="flex flex-row gap-2">
            <button className="rounded-lg bg-blue-600 px-4 py-2">{"->"}</button>
            <button className="rounded-lg bg-blue-600 px-2">Skip</button>
          </div>
        </div>
        <div className="flex w-4/5 flex-col rounded-md bg-white lg:w-1/2">
          {artistSearch.isLoading && artistSearch.fetchStatus !== "idle" ? (
            <div className="rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black hover:bg-stone-200 lg:text-xl">
              loading...
            </div>
          ) : artistSearch.error ? (
            <div className="rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black hover:bg-stone-200 lg:text-xl">
              error
            </div>
          ) : artistSearch.data ? (
            artistSearch.data.artistResult.map((artist) => (
              <button
                key={artist.id}
                className="rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black hover:bg-stone-200 lg:text-xl"
              >
                {artist.name}
              </button>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameMain;

function getAudioDuration(audioElement: HTMLAudioElement) {
  const duration = audioElement.duration;
  const currentTime = audioElement.currentTime;
  const timeLeft = duration - currentTime;

  const formatTime = (time: number) => {
    const minutes = Math.round(time / 60);
    const seconds = Math.round(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return {
    duration: formatTime(duration),
    currentTime: formatTime(currentTime),
    timeLeft: formatTime(timeLeft),
  };
}
