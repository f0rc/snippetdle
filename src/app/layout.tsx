import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import Nav from "./_components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Guess the artist",
  description: "Proslusha | Guess the artist",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="h-screen w-full flex-grow  flex-wrap overflow-scroll bg-gradient-to-b from-[#050808] to-[#121212] pb-10 text-[#EAF2F5] sm:flex-nowrap">
            <Nav />
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
