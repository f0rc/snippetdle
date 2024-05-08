"use client";

import { type Session } from "next-auth";
import { useState } from "react";
import { SignoutDialog } from "./SignoutBox";

const Nav = ({ session }: { session: Session | null }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="">
        <nav className="z-0 mx-auto flex w-full max-w-screen-2xl p-4">
          <div className="flex w-full flex-row">
            <ul className="">
              <a href="/" className="text-4xl font-black uppercase">
                snippetdle
              </a>
            </ul>

            <ul className="flex-1" />
            <ul className="flex gap-4">
              <li className="hidden items-center justify-end rounded-md p-2 hover:bg-black/20 lg:flex">
                <a href="/customgame" className="text-xl font-semibold">
                  Custom Games
                </a>
              </li>

              <li className="hidden items-center justify-end rounded-md p-2 hover:bg-black/20 lg:flex">
                <a href="/browseplaylists" className="text-xl font-semibold">
                  Browse Playlists
                </a>
              </li>

              {/* <button className="rounded-md p-2 font-semibold hover:bg-black/20">
                Log In
              </button> */}
              {session ? (
                <SignoutDialog />
              ) : (
                <a
                  className="flex items-center rounded-md bg-yellow-400 p-2 text-center font-semibold text-black hover:bg-yellow-300"
                  href={"/signin"}
                >
                  Sign In
                </a>
              )}

              <button
                className="rounded-md p-2 font-semibold hover:bg-black/20 lg:hidden"
                onClick={() => setSidebarOpen((p) => !p)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                  />
                </svg>
              </button>
            </ul>
          </div>
        </nav>
      </div>
      {sidebarOpen && (
        <>
          <div
            className="fixed top-0 z-20 h-full w-full flex-1 bg-black/50 transition-all duration-300 ease-in-out"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed bottom-0 z-20 flex h-1/2 w-full flex-col bg-black/90">
            <div
              className="flex items-end justify-end rounded-md p-2 font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              <button className="rounded-xl p-4 hover:bg-white/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex h-full w-1/2 flex-col">
              <ul className="flex flex-col">
                <li className="px-4 py-2 hover:bg-black/20">Custom Games</li>
                <li className="px-4 py-2 hover:bg-black/20">
                  Browse Playlists
                </li>
                <li className="px-4 py-2 hover:bg-black/20">Sign Up</li>
                <li className="px-4 py-2 hover:bg-black/20">Log In</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Nav;
