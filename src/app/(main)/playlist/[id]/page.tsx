import Link from "next/link";
import { api } from "~/trpc/server";
import PlaylistList from "./PlaylistList";

export default async function Page({ params }: { params: { id: string } }) {
  const playlistData = await api.playlist.getPlaylist.query({ id: params.id });

  return (
    <div className="flex w-full items-center justify-center self-center">
      <div className="flex w-full max-w-4xl flex-col items-center  justify-center">
        <div className="flex w-full flex-col rounded-md bg-neutral-800">
          <div className="flex items-center justify-between rounded-t-md bg-neutral-900 p-4 md:p-10">
            <div>
              <h1 className="text-start text-2xl font-semibold text-white">
                {playlistData.playlistName}
              </h1>
              <p className="text-start font-semibold">
                has {playlistData.songs.length} songs
              </p>
            </div>

            <div>
              <Link
                className="self-center rounded-md bg-yellow-400 p-4 px-6 text-center font-semibold text-black transition-colors duration-300 ease-in-out hover:bg-yellow-500"
                href={"/"}
              >
                Play
              </Link>
            </div>
          </div>

          <PlaylistList songs={playlistData.songs} />
        </div>
      </div>
    </div>
  );
}
