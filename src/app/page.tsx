import GameMain from "./_components/GameMain";

export default async function Home() {
  // const gameData = api.game.

  return (
    <main className="flex flex-col items-center justify-start gap-12 border">
      <div className="flex w-full items-center justify-center pt-20">
        <GameMain />
      </div>
    </main>
  );
}
