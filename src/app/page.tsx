import GameMain from "./_components/GameMain";

export default async function Home() {
  // const gameData = api.game.

  return (
    <main className="flex flex-col items-center justify-start gap-12 border">
      <div className="flex w-full justify-center gap-4">
        <div className="bg-red-400">yo</div>
        <div className="flex w-2/3 items-center justify-center">
          <GameMain />
        </div>

        <div className="hidden w-1/6 flex-col  xl:block">
          <div className="flex w-full flex-col items-center justify-center">
            <h1 className="py-4 text-2xl font-black">Popular Playlists</h1>
            <ul className="flex flex-col gap-4">
              <li className="flex h-40 w-40 items-center justify-center rounded-xl bg-green-800 p-4">
                <p className="font-bol self-end text-xl">2000s Pop</p>
              </li>
              <li className="flex h-40 w-40 items-center justify-center rounded-xl bg-red-500 p-4">
                <p className="font-bol self-end text-xl">2000s Pop</p>
              </li>
              <li className="flex h-40 w-40 items-center justify-center rounded-xl bg-purple-500 p-4">
                <p className="font-bol self-end text-xl">2000s Pop</p>
              </li>
              <li className="flex h-40 w-40 items-center justify-center rounded-xl bg-blue-500 p-4">
                <p className="font-bol self-end text-xl">2000s Pop</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
