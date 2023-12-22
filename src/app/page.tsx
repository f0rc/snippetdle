import GameMain from "./_components/GameMain";

export default async function Home() {
  // const gameData = api.game.

  return (
    <main className="flex max-w-4xl flex-1 flex-row items-center justify-center gap-4">
      <div>
        <GameMain />
      </div>
      <div className="hidden lg:block">quick playlist</div>
    </main>
  );
}
