import { getSession } from "next-auth/react";
import CreateGame from "./createGame";
import { redirect } from "next/navigation";

async function page() {
  const session = await getSession();

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
