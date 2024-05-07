"use-client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import { useGameInfo } from "./State/useGameInfo";

const ArtistSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const { gameInfo, setSelectAnswer, selectAnswer } = useGameInfo();

  // debounce input effect
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      if (inputValue !== selectAnswer) {
        setDebouncedInputValue(inputValue);
      }
    }, 1000);

    return () => clearTimeout(delayInputTimeoutId);
  }, [inputValue, 1000]);

  // api call for artist search
  const artistSearch = api.game.getArtist.useQuery(
    { artistName: debouncedInputValue },
    {
      enabled:
        debouncedInputValue.length > 2 &&
        selectAnswer !== debouncedInputValue &&
        !gameInfo.roundOver,
    },
  );
  return (
    <div className="flex w-3/5 flex-col">
      <input
        type="text"
        className="h-12 w-full rounded-md bg-stone-100  p-2 text-base text-black lg:text-xl"
        placeholder="Guess the artist"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div
        className={`mt-2 flex w-full flex-col gap-1 rounded-md ${
          gameInfo.roundOver ? " hidden " : ""
        }`}
      >
        {artistSearch.isLoading && artistSearch.fetchStatus !== "idle" ? (
          <div className="rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black hover:bg-stone-200 lg:text-xl">
            loading...
          </div>
        ) : artistSearch.error ? (
          <div className="rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black hover:bg-stone-200 lg:text-xl">
            error
          </div>
        ) : artistSearch.data && inputValue ? (
          artistSearch.data.artistResult.map((artist) => (
            <button
              key={artist.id}
              onClick={() => {
                setSelectAnswer(artist.name);
                setInputValue(artist.name);
              }}
              className="flex w-full items-center justify-start gap-3 rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black ring-blue-600 selection:z-10 selection:ring-2 hover:bg-stone-200 focus:bg-stone-200 focus:ring-4 focus:ring-blue-500 lg:text-xl"
            >
              <Image
                width={40}
                height={40}
                src={artist.imageUrl ?? "/images/artist.png"}
                alt="artist"
                className="h-10  w-10 self-center rounded-full bg-cover text-center text-xs lg:h-14 lg:w-14"
              />
              {artist.name}
            </button>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default ArtistSearch;
