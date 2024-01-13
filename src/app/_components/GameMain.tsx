"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import { api } from "~/trpc/react";
import type { dailyChallengeType } from "~/trpc/utils";
import CassettePlayer from "./CassettePlayer";

type GameMainProps = {
  options: {
    dailyChallenge: dailyChallengeType;
  };
};

interface roundInfoType {
  songStep: number;
  artistName: string;
  correct: boolean;
  skip: boolean;
}

type GameMainState = {
  gameId: string;
  sync: boolean;
  gameDate: string;
  volume: number;
  songStep: number;
  gameOver: boolean;
  roundInfo: roundInfoType[];
};

const GameMain = (GameMainProps: GameMainProps) => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [gameInfo, setGameInfo] = useState<GameMainState>({
    gameId: "",
    sync: false,
    gameDate: GameMainProps.options.dailyChallenge.date,
    volume: 30,
    songStep: 0,
    gameOver: false,
    roundInfo: [],
  });

  //  MARK: Volume settings
  const [volume, setVolume] = useState(30);
  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = volume / 100;

      setVolume(volume);
    }
  }, [volume]);
  // MARK: *Volume settings end

  const [songStep, setSongStep] = useState(0);

  const playIntervals = [1000, 2000, 3000, 5000, 7000, 10000];

  const handleRoundSubmit = (skip: boolean) => {
    const newRoundInfo = {
      songStep: songStep,
      artistName: selectAnswer,
      correct:
        selectAnswer ===
          GameMainProps.options.dailyChallenge.song.artist_name && !skip,
      skip: skip,
    };

    if (gameInfo.roundInfo.length <= 5 && !gameInfo.gameOver) {
      const updatedRouned = [...gameInfo.roundInfo];
      updatedRouned.push(newRoundInfo);
      setGameInfo((p) => ({ ...p, roundInfo: updatedRouned }));
      // check if won else move to next round
      if (newRoundInfo.correct) {
        setGameInfo((p) => ({ ...p, gameOver: true }));
      } else {
        setSongStep((prev) => prev + 1);
        setGameInfo((p) => ({ ...p, songStep: p.songStep + 1 }));
      }

      setInputValue("");
      setSelectAnswer("");
    } else {
      setGameInfo((p) => ({ ...p, gameOver: true }));
    }
  };

  // MARK: play audio
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState({
    duration: "0:00",
    currentTime: "0:00",
    timeLeft: "0:30",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  // manage the audio player intervals
  const playAudio = async (index: number) => {
    if (index >= playIntervals.length || !audioPlayer.current) {
      setIsPlaying(false);
      return;
    }

    const interval = playIntervals[index];
    // console.log("interval", interval);
    audioPlayer.current.currentTime = 0;

    const playPromise = audioPlayer.current.play();
    const waitPromise = new Promise((resolve) => {
      setTimeoutId(
        setTimeout(() => {
          resolve(console.log("timeout is complete"));
        }, interval),
      );
    });

    setIsPlaying(true);

    await Promise.all([playPromise, waitPromise]);
    audioPlayer.current.pause();
    setIsPlaying(false);
    timeoutId && clearTimeout(timeoutId);
  };
  // logic to play audio
  const handlePlay = async () => {
    if (!isPlaying && songStep < playIntervals.length && !gameInfo.gameOver) {
      if (songStep <= 5) {
        await playAudio(songStep);
      }
    } else if (isPlaying) {
      if (audioPlayer.current) {
        setIsPlaying(false);
        audioPlayer.current.pause();
        if (timeoutId) {
          clearTimeout(timeoutId);
          console.log("timeout cleared");
          setTimeoutId(null);
        }
      }
    } else {
      // Play the song normally without intervals if step > 5
      audioPlayer.current && (await audioPlayer.current.play());
      setIsPlaying(true);
    }
  };
  // MARK: *play audio end

  // MARK: fetch artist data
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const [selectAnswer, setSelectAnswer] = useState("");

  // debounce input useeffect
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
        !gameInfo.gameOver,
    },
  );
  // MARK: *fetch artist data end

  useEffect(() => {
    if (songStep >= 6) {
      setGameInfo((p) => ({ ...p, gameOver: true }));
    }
  }, [songStep]);

  // MARK: game cache logic

  // useeffect to color in the rounds
  useEffect(() => {
    if (gameInfo.roundInfo.length) {
      gameInfo.roundInfo.forEach((round) => {
        const roundElement = document.getElementById(round.songStep + "round");
        if (roundElement) {
          if (round.correct) {
            roundElement.style.backgroundColor = "#3BB143";
          } else if (round.skip) {
            roundElement.style.backgroundColor = "#808080";
          } else {
            roundElement.style.backgroundColor = "#FF0000";
          }
        }
      });
    }
  }, [gameInfo.roundInfo]);

  const [loaded, setLoaded] = useState(false);

  // load from local storage on mount
  useEffect(() => {
    const gameInfoLocal = localStorage.getItem("gameInfo");

    if (gameInfoLocal) {
      const x = JSON.parse(gameInfoLocal) as GameMainState;
      if (x.roundInfo.length) {
        setSongStep(x.songStep);
        setGameInfo(x);
      }
    }

    setLoaded(true);
  }, []);

  // save to local storage on roundInfo change
  useEffect(() => {
    if (gameInfo.roundInfo.length) {
      localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
    }
  }, [gameInfo]);

  console.log(GameMainProps.options.dailyChallenge.song.artist_name);

  return (
    <div className="flex h-full w-full max-w-xl flex-col items-center justify-center px-4 pt-4 lg:px-0 lg:pt-0">
      <audio
        ref={audioPlayer}
        src={GameMainProps.options.dailyChallenge.song.preview_url}
        preload="true"
        loop
        onTimeUpdate={() => {
          if (audioPlayer.current) {
            setTime(getAudioDuration(audioPlayer.current));
          }
        }}
      />

      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <CassettePlayer isPlaying={isPlaying} handlePlay={handlePlay} />

        {/* PLAYER */}
        <div className="flex w-full flex-col rounded-full lg:max-w-sm">
          {/* two divs with 5 sections, one div is the background and the other is overlay indicating the elapsed time */}
          {/* <div className="absolute z-0 h-4 w-full max-w-sm rounded-full bg-[#16222A]" />
            <div
              className="relative z-10 h-4 w-0 rounded-full bg-[#E2E941]"
              id="progressBar"
            /> */}

          <div className="flex w-full">
            {Array.from({ length: playIntervals.length }).map((_, i) => (
              <div
                key={i}
                className={`w-1/5 border border-white p-2`}
                id={i.toString() + "round"}
              />
            ))}
          </div>

          <div className="flex flex-row justify-between pt-2">
            <p>{time.currentTime}</p>
            <p>0:30</p>
          </div>
        </div>
      </div>

      {loaded && (
        <div className="flex w-full flex-col items-center gap-2  pt-4">
          {/* ROUND INFO */}
          <div
            className={`flex flex-row items-center justify-center gap-1 overflow-hidden overscroll-y-auto rounded-md`}
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {gameInfo.roundInfo.map((round) => (
              <div
                key={round.songStep}
                className={`flex flex-row justify-between rounded-lg p-2 text-sm text-black ${
                  round.skip
                    ? "bg-gray-400"
                    : round.correct
                      ? "bg-green-200"
                      : "bg-red-200"
                }`}
              >
                <p>{round.skip ? "Skipped" : round.artistName}</p>
              </div>
            ))}
          </div>
          {/* INPUT */}
          <div
            className={`flex w-4/5 flex-row justify-center gap-2 ${
              gameInfo.gameOver ? " hidden" : ""
            }`}
          >
            <input
              type="text"
              className=" w-4/5 rounded-md bg-stone-100 p-2 text-base  text-black lg:text-xl"
              placeholder="Guess the artist"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex w-1/5 flex-row gap-2">
              <button
                className="rounded-lg bg-blue-600 px-4 py-2"
                onClick={() => {
                  selectAnswer && handleRoundSubmit(false);
                }}
              >
                {"->"}
              </button>
              <button
                className="rounded-lg bg-blue-600 px-2"
                onClick={() => {
                  handleRoundSubmit(true);
                }}
              >
                Skip
              </button>
            </div>
          </div>
          <div
            className={`w-full gap-4 ${
              gameInfo.gameOver ? " flex " : " hidden "
            } flex-col  items-center justify-center md:flex-row`}
          >
            <Suspense
              fallback={
                <div
                  style={{ width: 200, height: 200 }}
                  className="animate-pulse bg-black"
                ></div>
              }
            >
              <Image
                src={GameMainProps.options.dailyChallenge.song.album_image}
                alt="album cover"
                width={200}
                height={200}
                className={`rounded-md ${gameInfo.gameOver ? "" : " hidden "}`}
              />
            </Suspense>
            <div>
              <p className="text-2xl">
                {GameMainProps.options.dailyChallenge.song.album_name}
              </p>
              <p className="text-xl">
                {GameMainProps.options.dailyChallenge.song.artist_name}
              </p>

              <p className="text-xl">release date#TODO</p>

              <p className="text-xl">score in emoji#TODO</p>
            </div>
          </div>
          {/* Search results */}
          <div
            className={`flex w-4/5 flex-col gap-1 rounded-md ${
              gameInfo.gameOver ? " hidden " : ""
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
                  className="w-4/5 rounded-sm border-b border-black bg-stone-100 p-2 text-sm text-black ring-blue-600 selection:z-10 selection:ring-2 hover:bg-stone-200 focus:bg-stone-200 focus:ring-4 focus:ring-blue-500 lg:text-xl"
                >
                  {artist.name}
                </button>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
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
