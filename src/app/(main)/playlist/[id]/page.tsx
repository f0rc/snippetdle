import Image from "next/image";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const playlistData = await api.playlist.getPlaylist.query({ id: params.id });

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="rounded-md bg-neutral-800 p-4 ">
        <h1 className="text-2xl font-semibold text-white self-center text-center p-4">
          {playlistData.playlistName}
        </h1>

        <ul className="flex flex-col items-center justify-center ">
          {playlistData.songs.map((song) => (
            <li key={song.id} className="flex flex-row items-center gap-4 p-4 rounded-md hover:bg-neutral-700">
              <Image
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
      </div>
    </div>
  );
}
