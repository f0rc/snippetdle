import GameMain from "./_components/GameMain";

export default async function Home() {
  // const gameData = api.game.

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex h-full w-full justify-center lg:pl-40">
        <GameMain />
      </div>
      <div className="hidden h-full w-1/4 lg:flex">quick playlist</div>
    </main>
  );
}
