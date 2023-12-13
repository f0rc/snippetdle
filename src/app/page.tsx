"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [currentSong] = useState(
    "https://p.scdn.co/mp3-preview/023ccc9c406cafc5a3e3b4dd524b9092b45dacbf?cid=68602c7d0a1c4cc3a1a8e0aea88a56d0.mp3",
  );

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [playCount, setPlayCount] = useState(0); // Track play count
  const playDuration = 5; // Duration for each play in seconds
  const maxPlays = 4; // Number of times to play for playDuration
  const [volume, setVolume] = useState(30);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = volume / 100;
    }
  }, [volume]);

  const [stepCount, setStepCount] = useState(0);

  const handlePlay = async () => {
    if (audioPlayer.current) {
      setIsPlaying(true);
      audioPlayer.current.currentTime = 0; // Reset audio to the beginning

      if (stepCount < maxPlays) {
        // For the first 4 clicks, play for playDuration seconds
        await audioPlayer.current.play();
        setTimeout(() => {
          console.log("pause");
          console.log(stepCount);
          audioPlayer.current?.pause();
          setIsPlaying(false);
          setStepCount(stepCount + 1);
        }, playDuration * 1000);
      } else {
        // On the 5th click, play the full song
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
          <div
            className="h-20 w-20 rounded-full bg-[#E2E941]"
            onClick={handlePlay}
          />

          <div className="flex flex-grow flex-col">
            {/* META DATA */}
            <div className="flex flex-col">
              <p>Song Name</p>
              <p>Artist Name</p>
            </div>
            {/* PLAYER */}
            <div className="relative flex w-full flex-grow items-center">
              <audio ref={audioPlayer} src={currentSong} preload="true" loop />
              {/* two divs with 5 sections, one div is the background and the other is overlay indicating the elapsed time */}
              <div className="h-2 w-full bg-[#E2E941]" />
              <div className="absolute h-2 w-[50%] bg-[#16222A]" />
              {/* PLAYER CONTROLS */}
            </div>
          </div>
        </div>

        {/* SUGGESTION INPUT DIV */}
        <div></div>
      </div>
    </main>
  );
}
