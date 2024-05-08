import Link from "next/link";
import { api } from "~/trpc/server";
import PlaylistList from "./PlaylistList";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const playlistData = await api.playlist.getPlaylist.query({ id: params.id });

  return (
    <div className="flex w-full items-center justify-center self-center">
      <div className="flex w-full max-w-4xl flex-col items-center  justify-center">
        <div className="flex w-full flex-col rounded-md bg-neutral-800">
          <div className="flex h-full w-full items-center justify-between rounded-t-md bg-neutral-900 p-4 md:p-10">
            <div className="flex h-full w-full flex-col gap-4 md:flex-row md:items-end">
              <div className="overflow-hidden rounded-md border border-neutral-600 ">
                <Image
                  className="rounded-md"
                  src={playlistData.playlistImage ?? "/playlist.png"}
                  alt="playlist image"
                  width={140}
                  height={140}
                />
              </div>
              <div className="flex h-full flex-col items-start">
                <h1 className="text-start text-2xl font-semibold text-white">
                  {playlistData.playlistName}
                </h1>
                <p className="text-start font-semibold">
                  has {playlistData.songs.length} songs
                </p>
                {/* <p className="text-start font-semibold">by: TODO</p> */}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* <div>Meta data about playlist</div> TOOD: add likes and playlist play count and featuered in daily or notand also maybe other stuff like ranking */}
              <Link
                className="w-full self-center rounded-md bg-yellow-400 py-2 text-center font-semibold text-black transition-colors duration-300 ease-in-out  hover:bg-yellow-500 focus:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                href={{
                  pathname: `/playlist/${params.id}/play`,
                }}
              >
                Play
              </Link>
              <Link
                className="w-full self-center rounded-md bg-neutral-100 px-2 py-2 text-center text-base font-semibold text-black transition-colors duration-300 ease-in-out hover:bg-neutral-300 focus:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50"
                href={"#"}
              >
                Update Playlist
              </Link>
            </div>
          </div>

          <PlaylistList songs={playlistData.songs} />
        </div>
      </div>
    </div>
  );
}
