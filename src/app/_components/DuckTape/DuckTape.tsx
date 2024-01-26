import React, { useMemo } from "react";
import "./duck.css";

export const DuckTape = ({
  index,
  tapeText,
}: {
  index: number;
  tapeText: string;
}) => {
  const translateX = useMemo(() => Math.random() * 20 - 10, []); // Memoize random translateX value
  const rotate = useMemo(() => Math.floor(Math.random() * 21) - 10, []); // Memoize random rotate value

  const memoizedComponent = useMemo(
    () => (
      <div
        className={`absolute flex items-center justify-center `}
        style={{
          transformOrigin: `center`,
          transform: `translateX(${translateX}px) rotate(${rotate}deg)`,
          zIndex: index + 1,
        }}
      >
        <h1
          className={`text-base font-semibold text-black md:text-2xl`}
          style={{
            zIndex: index + 1,
          }}
        >
          {tapeText}
        </h1>
        <span className="tape tapPath"></span>
      </div>
    ),
    [index, tapeText, translateX, rotate],
  );

  return memoizedComponent;
};
