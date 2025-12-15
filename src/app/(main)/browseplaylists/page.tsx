import Image from "next/image";
import { api } from "~/trpc/server";

const Page = async () => {
  const offset = 0;

  const playlists = await api.playlist.getPlaylistList.query({
    offset: offset,
    sortType: "newest",
  });

  return (
    <div className="mx-auto grid max-w-4xl gap-6 p-4 py-12 md:grid-cols-3">
      {playlists.map((playlist: any, index: any) => {
        return (
          <div
            className="relative overflow-hidden rounded-xl border border-neutral-700 transition-all duration-300 hover:scale-105"
            key={index}
          >
            <a className="" href={`/playlist/${playlist.id}`}>
              {/* Overlay */}
              <div className="absolute z-10 h-full w-full rounded-xl bg-black/50 text-white">
                <p className="px-2 pt-4 text-2xl font-bold">{playlist.name} </p>
                <p className="px-2">{playlist.playlistDescription}</p>
                {/* <p className="px-2">todo: plays</p>
              <p className="px-2">todo: likes</p> */}
              </div>
              <Image
                className="z-0 overflow-hidden rounded-xl object-cover blur-xl"
                src={playlist.playlistImage ?? "/"}
                width={640}
                height={640}
                alt="playlist Image"
                priority={false}
              />
            </a>
            <a
              className="absolute bottom-4 z-50 mx-4 rounded-xl border border-none border-white bg-white px-5 py-1 text-black hover:bg-black/50 hover:text-white"
              href={`/playlist/${playlist.id}/play`}
            >
              Play
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default Page;
