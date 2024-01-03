import React from "react";
import "./thing.css";

const page = () => {
  return (
    // remove this
    <div className="flex flex-1 items-center justify-center">
      <div className="h-[400px] w-[600px]">
        {/* remove end */}
        <div className="relative z-20 flex h-full w-full items-center justify-center rounded-2xl bg-zinc-800">
          <div className="absolute -left-4 bottom-24 h-28 w-10 rounded-3xl bg-zinc-800"></div>
          <div className="absolute -right-4 bottom-24 h-28 w-10 rounded-3xl bg-zinc-800"></div>
          <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-white"></div>
          <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-white"></div>
          <div className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-white"></div>
          <div className="absolute bottom-4 left-4 h-3 w-3 rounded-full bg-white"></div>

          <div className="flex h-4/5 w-4/5 flex-col rounded-2xl bg-zinc-700 p-5">
            {/* first row letter + lines */}
            <div className="flex w-full flex-row items-center justify-center gap-4">
              <div className="bg-black p-4 text-4xl font-bold">S</div>
              <div className="flex h-full w-full flex-col  items-center justify-center gap-y-4">
                {/* make 3 lines  */}
                <div className="h-0.5 w-full bg-black"></div>
                <div className="h-0.5 w-full bg-black"></div>
                <div className="h-0.5 w-full bg-black"></div>
              </div>
            </div>

            {/* cassett circle things that rotate */}

            <div className="flex w-full flex-1 flex-row items-start justify-between px-14 pt-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <div className="items animate-custom-spin-custom-speed relative flex h-4/5 w-4/5 items-center justify-center rounded-full bg-black">
                  <div className="absolute z-0 h-full w-1 origin-center -rotate-[30deg] bg-white"></div>
                  <div className="absolute z-0 h-full w-1 origin-center rotate-[30deg] bg-white"></div>
                  <div className="absolute z-0 h-full w-1 origin-center rotate-[90deg] bg-white"></div>
                  <div className="absolute h-4/5 w-4/5 rounded-full bg-black"></div>
                </div>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <div className="items animate-custom-spin-custom-speed relative flex h-4/5 w-4/5 items-center justify-center rounded-full bg-black ">
                  <div className="absolute z-0 h-full w-1 origin-center -rotate-[30deg] bg-white"></div>
                  <div className="absolute z-0 h-full w-1 origin-center rotate-[30deg] bg-white"></div>
                  <div className="absolute z-0 h-full w-1 origin-center rotate-[90deg] bg-white"></div>
                  <div className="absolute h-4/5 w-4/5 rounded-full bg-black"></div>
                </div>
              </div>
            </div>

            {/* random text */}
            <div className=" flex flex-row justify-between">
              <p className="text-xl font-bold uppercase text-white">
                Daily Challenge Edition
              </p>

              <p className="text-xl font-bold uppercase text-white">
                EC-30 <span className="text-base ">SEC</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
