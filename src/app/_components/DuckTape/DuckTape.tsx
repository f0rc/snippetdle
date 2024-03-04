import React, { useMemo } from "react";
import "./duck.css";
import { tapeText } from "../CassettePlayer";

export const DuckTape = ({
  index,
  tapeText,
}: {
  index: number;
  tapeText: tapeText;
}) => {
  const translateX = useMemo(() => Math.random() * 20 - 10, []); // Memoize random translateX value
  const rotate = useMemo(() => Math.floor(Math.random() * 21) - 10, []); // Memoize random rotate value

  const memoizedComponent = useMemo(
    () => (
      <div
        className={
          `absolute flex w-fit items-center justify-center rounded-md border-2 border-black px-8 py-2 antialiased drop-shadow-lg` +
          (tapeText.state === "red"
            ? " bg-red-500"
            : tapeText.state === "green"
              ? " bg-green-500"
              : " bg-gray-500")
        }
        style={{
          transformOrigin: `center`,
          transform: `translateX(${translateX}px) rotate(${rotate}deg)`,
          zIndex: index + 1,
        }}
      >
        <h1
          className={`max-w-20 md:max-w-40 w-20 truncate text-center font-mono text-base font-semibold text-black md:w-60 md:text-xl`}
          style={{
            zIndex: index + 1,
          }}
        >
          {tapeText.text}
        </h1>
      </div>
    ),
    [index, tapeText, translateX, rotate],
  );

  return memoizedComponent;
};
