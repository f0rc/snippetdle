import React from "react";

const Nav = () => {
  return (
    <nav className="mx-auto flex max-w-screen-xl flex-row items-center justify-between bg-none p-4">
      <div className="flex w-full flex-row">
        <a href="/" className="text-4xl font-black">
          Proslusha
        </a>
      </div>
      <div className="flex w-full flex-row justify-end space-x-5">
        <a href="/" className="text-2xl font-medium">
          Custom Game
        </a>
        <a href="/" className="text-2xl font-medium">
          Daily Challenge
        </a>
      </div>
    </nav>
  );
};

export default Nav;
