import { getServerAuthSession } from "~/server/auth";
import CreateGame from "./createGame";
import { redirect } from "next/navigation";

async function page() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/signin");
  }
  return (
    <>
      <CreateGame />
    </>
  );
}

export default page;
