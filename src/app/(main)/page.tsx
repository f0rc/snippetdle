import { api } from "~/trpc/server";
import GameMain from "../_components/GameMain";
import { getSession } from "next-auth/react";

export default async function Home() {
  const data = await api.game.getDailyChallenge.query();

  const session = await getSession();

  console.log("session", session);

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex h-full w-full justify-center">
        {!data.dailyChallenge ? (
          <div>Unable to fetch Daily Challenge</div>
        ) : (
          <GameMain options={{ dailyChallenge: data.dailyChallenge }} />
        )}
      </div>
      {/* <div className="hidden h-full w-1/4 lg:flex">quick playlist</div> */}
    </main>
  );
}
