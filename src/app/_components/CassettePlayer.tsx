"use client";

import { useEffect, useState } from "react";
import "./thing.css";

export default function CassettePlayer({
  isPlaying,
  handlePlay,
}: {
  isPlaying: boolean;
  handlePlay: () => void;
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      if (false) {
        const interval = setInterval(() => {
          setRotation((r) => r - 1);
        }, 10);
        return () => clearInterval(interval);
      } else {
        const interval = setInterval(() => {
          setRotation((r) => r + 1);
        }, 10);
        return () => clearInterval(interval);
      }
    }
  }, [isPlaying]);

  return (
    <div className="relative z-20 flex w-full items-center justify-center rounded-2xl bg-zinc-800 md:h-[350px]">
      {/* side clips ons */}
      <div className="absolute -left-4 bottom-24 rounded-3xl bg-zinc-800 md:h-28 md:w-10"></div>
      <div className="absolute -right-4 bottom-24 rounded-3xl bg-zinc-800 md:h-28 md:w-10"></div>

      {/* screw holes */}
      <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute bottom-4 left-4 h-3 w-3 rounded-full bg-white"></div>

      <div className="flex h-4/5 w-4/5 flex-col rounded-2xl bg-zinc-700 p-4 pb-10 md:pb-2">
        {/* first row letter + lines */}
        <div className="flex w-full flex-row items-center justify-center gap-2 md:gap-4">
          <div className="bg-black p-2 text-lg font-bold md:p-4 md:text-4xl">
            S
          </div>
          <div className="flex h-full w-full flex-col  items-center justify-center gap-y-4">
            {/* make 3 lines  */}
            <div className="h-0.5 w-full bg-black"></div>
            <div className="h-0.5 w-full bg-black"></div>
            <div className="h-0.5 w-full bg-black"></div>
          </div>
        </div>

        {/* cassett circle things that rotate */}

        <div className="flex w-full flex-1 flex-row items-center justify-between py-4 md:px-14 md:pt-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white md:h-20 md:w-20">
            <div
              className={`relative flex h-4/5 w-4/5 items-center justify-center rounded-full bg-black`}
              style={{
                transformOrigin: `center`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div className="absolute z-0 h-full w-1 origin-center -rotate-[30deg] bg-white"></div>
              <div className="absolute z-0 h-full w-1 origin-center rotate-[30deg] bg-white"></div>
              <div className="absolute z-0 h-full w-1 origin-center rotate-[90deg] bg-white"></div>
              <div className="absolute h-4/5 w-4/5 rounded-full bg-black"></div>
            </div>
          </div>

          <button
            className=" flex items-center justify-center"
            onClick={() => {
              handlePlay();
            }}
          >
            {isPlaying ? (
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
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-10 w-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            )}
          </button>

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white md:h-20 md:w-20">
            <div
              className={`relative flex h-4/5 w-4/5 items-center justify-center rounded-full bg-black`}
              style={{
                transformOrigin: `center`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div className="absolute z-0 h-full w-1 origin-center -rotate-[30deg] bg-white"></div>
              <div className="absolute z-0 h-full w-1 origin-center rotate-[30deg] bg-white"></div>
              <div className="absolute z-0 h-full w-1 origin-center rotate-[90deg] bg-white"></div>
              <div className="absolute h-4/5 w-4/5 rounded-full bg-black"></div>
            </div>
          </div>
        </div>

        {/* random text */}
        <div className=" flex flex-row justify-between ">
          <p className="hidden text-xs font-bold uppercase text-white sm:block md:text-xl">
            Daily Challenge Edition
          </p>

          <p className="hidden text-xs font-bold uppercase text-white sm:block md:text-xl">
            EC-30 <span className="text-xs md:text-base">SEC</span>
          </p>
        </div>
      </div>
    </div>
  );
}
