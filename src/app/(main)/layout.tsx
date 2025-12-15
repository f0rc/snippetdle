import { getSession } from "next-auth/react";
import Nav from "../_components/Nav";
import { auth } from "~/server/auth/index";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-screen w-full flex-grow flex-wrap bg-gradient-to-b from-[#050808] to-[#121212] pb-10 text-[#EAF2F5] sm:flex-nowrap">
      <Nav session={session} />

      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      {children}
    </div>
  );
}
