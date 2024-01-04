"use client";

import React, { useEffect, useState } from "react";
import "./thing.css";

export default function CassettePlayer({
  rewind,
  play,
}: {
  rewind: boolean;
  play: boolean;
}) {
  const [rotationDegree, setRotationDegree] = useState(0);

  // Function to handle the rotation logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (play) {
      intervalId = setInterval(() => {
        setRotationDegree((prevDegree) =>
          rewind ? prevDegree - 1 : prevDegree + 1,
        );
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [play, rewind]);
  return (
    // remove this
    // <div className="flex w-full flex-1 items-center justify-center px-4">
    <div className="h-[30%] w-full md:h-[400px] md:w-[600px]">
      {/* remove end */}
      <div className="relative z-20 flex h-full w-full items-center justify-center rounded-2xl bg-zinc-800">
        {/* side clips ons */}
        <div className="absolute -left-4 bottom-24 rounded-3xl bg-zinc-800 md:h-28 md:w-10"></div>
        <div className="absolute -right-4 bottom-24 rounded-3xl bg-zinc-800 md:h-28 md:w-10"></div>

        {/* screw holes */}
        <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-white"></div>
        <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-white"></div>
        <div className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-white"></div>
        <div className="absolute bottom-4 left-4 h-3 w-3 rounded-full bg-white"></div>

        <div className="flex h-4/5 w-4/5 flex-col rounded-2xl bg-zinc-700 p-5">
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

          <div className="flex w-full flex-1 flex-row items-start justify-between py-4 md:px-14 md:pt-10 ">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white md:h-20 md:w-20">
              <div
                className={`${
                  play
                    ? rewind
                      ? " animate-custom-spin-custom-speed-r "
                      : " animate-custom-spin-custom-speed "
                    : ""
                }" relative flex h-4/5 w-4/5 items-center justify-center rounded-full bg-black`}
                style={{
                  transform: `rotate(${rotationDegree}deg)`,
                }}
              >
                <div className="absolute z-0 h-full w-1 origin-center -rotate-[30deg] bg-white"></div>
                <div className="absolute z-0 h-full w-1 origin-center rotate-[30deg] bg-white"></div>
                <div className="absolute z-0 h-full w-1 origin-center rotate-[90deg] bg-white"></div>
                <div className="absolute h-4/5 w-4/5 rounded-full bg-black"></div>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white md:h-20 md:w-20">
              <div
                className={`${
                  play
                    ? rewind
                      ? " animate-custom-spin-custom-speed-r "
                      : " animate-custom-spin-custom-speed "
                    : ""
                }" relative flex h-4/5 w-4/5 items-center justify-center rounded-full bg-black`}
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
    </div>
    // </div>
  );
}
