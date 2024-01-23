import { getServerAuthSession } from "~/server/auth";
import Nav from "../_components/Nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="h-screen w-full flex-grow  flex-wrap overflow-scroll bg-gradient-to-b from-[#050808] to-[#121212] pb-10 text-[#EAF2F5] sm:flex-nowrap">
      <Nav session={session} />

      <pre>{JSON.stringify(session, null, 2)}</pre>
      {children}
    </div>
  );
}
