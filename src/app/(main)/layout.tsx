import React from "react";
import Nav from "../_components/Nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex-grow  flex-wrap overflow-scroll bg-gradient-to-b from-[#050808] to-[#121212] pb-10 text-[#EAF2F5] sm:flex-nowrap">
      <Nav />
      {children}
    </div>
  );
}
