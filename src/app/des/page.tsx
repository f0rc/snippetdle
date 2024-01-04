"use client";

import React, { useEffect } from "react";
import CassettePlayer from "../_components/CassettePlayer";
const page = () => {
  const [rewind, setRewind] = React.useState(false);
  const [play, setPlay] = React.useState(false);

  useEffect(() => {
    console.log("rewind", rewind);
    console.log("play", play);
  }, [rewind, play]);

  return (
    <>
      <CassettePlayer rewind={rewind} play={play} />
      <button onClick={() => setPlay((p) => !p)}>Play</button>
      <button onClick={() => setRewind((p) => !p)}>rew</button>
    </>
  );
};

export default page;
