"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        {/* MAIN GAME DIV */}
        <div className="flex w-full max-w-4xl flex-row items-center justify-center space-x-4">
          {/* IMAGE */}
          <div className="h-40 w-40 rounded-md bg-black" />
          {/* PLAYER BUTTON */}
          <button
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-[#E2E941] text-black disabled:cursor-not-allowed disabled:bg-gray-400"
            onClick={handlePlay}
            disabled={isPlaying && songStep < 5}
          >
            Play
          </button>

          <div className="flex flex-grow flex-col">
            {/* META DATA */}
            <div className="flex flex-col">
              <p>Try: {songStep}</p>
              <p>Song Name</p>
              <p>Artist Name</p>
            </div>
            {/* PLAYER */}
            <div className="relative flex w-full flex-grow items-center">
              <audio ref={audioPlayer} src={currentSong} preload="true" loop />

              {/* two divs with 5 sections, one div is the background and the other is overlay indicating the elapsed time */}
              <div className="h-2 w-full bg-[#16222A]" />
              <div
                className="absolute h-2 bg-[#E2E941]"
                id="progressBar"
                style={{
                  transition: "all 0.05s ease-in-out", // Adding transition inline
                }}
              />
            </div>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full accent-[#E2E941]"
              id=""
            />
          </div>
        </div>

        {/* SUGGESTION INPUT DIV */}
        <div>
          <input
            type="text"
            placeholder="Suggest a song"
            className="w-full text-black accent-[#E2E941]"
          />
        </div>
      </div>
    </main>
  );
}
