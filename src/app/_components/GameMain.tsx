"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const GameMain = () => {
  const [currentSong] = useState("");

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

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.addEventListener("timeupdate", () => {
        const progressBar = document.getElementById("progressBar");
        if (progressBar && audioPlayer.current) {
          const currentProgress =
            (audioPlayer.current.currentTime / audioPlayer.current.duration) *
            100;

          const width = Math.floor(currentProgress);

          console.log("width", width);

          progressBar.style.width = `${width}%`;
        }
      });
    }
  }, []);

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
      // play the rest of the song
      if (audioPlayer.current) {
        await audioPlayer.current.play();
        setIsPlaying(true);
      }
    }
  };

  const [cells, setCells] = useState(5);

  const [hidden, setHidden] = useState(false);
  return (
    <div className="flex h-full w-full flex-col items-center">
      {/* IMAGE */}
      <div className="flex w-full flex-row items-center justify-center gap-4">
        <div className="">
          <div
            className="absolute h-40 w-40 rounded-md bg-black"
            style={{
              display: hidden ? "none" : "block",
            }}
          />
          <img
            src="https://i.scdn.co/image/ab67616d00001e02f8f2bc4006346cb97bb8b74f"
            alt=""
            width={160}
            height={160}
            className="h-40 w-40 rounded-md border-none bg-black"
          />
        </div>
        {/* PLAYER BUTTON */}
        <button
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16222A]"
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
          <div className="rounded-full">
            <audio ref={audioPlayer} src={currentSong} preload="true" loop />

            {/* two divs with 5 sections, one div is the background and the other is overlay indicating the elapsed time */}
            <div className="h-2 w-full rounded-full bg-[#16222A]" />
            <div
              className="absolute h-2 rounded-full bg-[#E2E941]"
              id="progressBar"
              style={{
                transition: "all 0.05s ease-in-out", // Adding transition inline
              }}
            />

            <div className="flex flex-row justify-between pt-2">
              <p>0:00</p>
              <p>0:30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMain;

{
  /* <div className="flex w-full flex-col items-center justify-center gap-4  pt-10">
<input
  type="text"
  className="w-1/2 rounded-md bg-white p-4 text-xl"
  placeholder="Guess the artist"
/>

{/* <button onClick={() => setCells(cells + 1)}>+1</button> */
}

{
  /* <div className="flex w-1/2 flex-col rounded-md bg-white">
  {Array.from({ length: cells }).map((_, i) => (
    <button
      key={i}
      className="rounded-md border-b bg-white p-4 text-xl text-black hover:bg-gray-200"
    >
      Artist
    </button>
  ))}
</div> */
}
// </div> */}
