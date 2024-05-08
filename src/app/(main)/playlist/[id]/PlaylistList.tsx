"use client";

import Image from "next/image";
import { useState } from "react";
import type { getPlaylistSongstype } from "~/server/api/routers/playlist";

const PlaylistList = ({ songs }: { songs: getPlaylistSongstype[] }) => {
  const [showSongs, setShowSongs] = useState(false);

  return (
    <>
      {showSongs ? (
        <ul className="flex flex-col items-start justify-center ">
          {songs.map((song) => (
            <li
              key={song.id}
              className="flex w-full flex-row items-start gap-4 rounded-md p-4 hover:bg-neutral-700"
            >
              <Image
                className=""
                width={100}
                height={100}
                src={song.album_image}
                alt={song.album_name}
              />
              <div className=" flex flex-col gap-1">
                <p className="text-xl">{song.album_name}</p>

                <p className="text-xl">{song.artist_name}</p>
                <p className="text-sm italic">{song.album_release_date}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <button
          onClick={() => {
            setShowSongs((prev) => !prev);
          }}
          className="rounded-md bg-neutral-600 px-4 py-6 font-semibold uppercase text-white transition-colors duration-300 ease-in-out hover:bg-neutral-700"
        >
          ***SPOILERS*** Show Songs
        </button>
      )}
    </>
  );
};

export default PlaylistList;
