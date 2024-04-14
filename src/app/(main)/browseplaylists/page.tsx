import Image from "next/image";
import Link from "next/link";
import React from "react";
import { api } from "~/trpc/server";

const Page = async () => {
  const offset = 0;

  const playlists = await api.playlist.getPlaylistList.query({
    offset: offset,
    sortType: "newest",
  });

  return (
    <div className="mx-auto grid max-w-4xl gap-6 p-4 py-12 md:grid-cols-3">
      {playlists.map((playlist, index) => {
        return (
          <Link
            key={index}
            className="relative rounded-xl transition-all duration-300 hover:scale-105"
            href={`/playlist/${playlist.id}`}
          >
            {/* Overlay */}
            <div className="absolute h-full w-full rounded-xl bg-black/50 text-white">
              <p className="px-2 pt-4 text-2xl font-bold">{playlist.name} </p>
              <p className="px-2">{playlist.playlistDescription}</p>
              <p className="px-2">todo: plays</p>
              <p className="px-2">todo: likes</p>
              <button className="absolute bottom-4 mx-2 rounded-xl border border-none border-white bg-white px-5 py-1 text-black hover:bg-black/50 hover:text-white">
                Play
              </button>
            </div>
            <Image
              className="h-full w-full rounded-xl object-cover"
              src={playlist.playlistImage ?? "/"}
              width={640}
              height={640}
              alt="playlist Image"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Page;
