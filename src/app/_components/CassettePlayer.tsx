"use client";

import { useEffect, useState } from "react";
import "./thing.css";
import { DuckTape } from "./DuckTape/DuckTape";

export default function CassettePlayer({
  isPlaying,
  handlePlay,
  showPlayButton,
  tapeText,
}: {
  isPlaying: boolean;
  handlePlay: () => void;
  showPlayButton: boolean;
  tapeText: string[];
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
    <div className="relative z-20 flex h-[200px] w-full items-center justify-center rounded-2xl bg-[#1e2121] md:h-[350px]">
      {/* side clips ons */}
      <div className="absolute -left-4 bottom-24 rounded-3xl bg-[#1e2121] md:h-28 md:w-10"></div>
      <div className="absolute -right-4 bottom-24 rounded-3xl bg-[#1e2121] md:h-28 md:w-10"></div>

      {/* screw holes */}
      <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-white"></div>
      <div className="absolute bottom-4 left-4 h-3 w-3 rounded-full bg-white"></div>

      <div className="flex h-4/5 w-4/5 flex-col rounded-2xl bg-[#495360] p-4 pb-10 md:pb-2">
        {/* first row letter + lines */}
        <div className="flex w-full flex-row items-center justify-center gap-2 md:gap-4">
          <div className="bg-black p-2 text-lg font-bold md:p-4 md:text-4xl">
            A
          </div>
          <div className="flex h-full w-full flex-col  items-center justify-center gap-y-4">
            {/* make 3 lines  */}
            {tapeText ? (
              tapeText.map((text, index) => (
                <DuckTape key={index} index={index} tapeText={text} />
              ))
            ) : (
              <></>
            )}

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

          {showPlayButton ? (
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
          ) : (
            <div role="status">
              <svg
                aria-hidden="true"
                className="h-8 w-8 animate-spin fill-yellow-500 text-gray-100 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

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
            EC-30 <span className="text-xs md:text-base">S</span>
          </p>
        </div>
      </div>
    </div>
  );
}
