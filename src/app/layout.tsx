import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import { GameMetaProvider } from "./_components/State/useGameInfo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Guess the artist",
  description: "SNIPPETDLE | Guess the artist",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-mono ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Toaster />
          <GameMetaProvider>{children}</GameMetaProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
