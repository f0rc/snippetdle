"use client";

import React, { use, useEffect } from "react";
import CassettePlayer from "../_components/CassettePlayer";
const page = () => {
  const [rewind, setRewind] = React.useState(false);
  const [play, setPlay] = React.useState(false);

  useEffect(() => {
    console.log("rewind", rewind);
    console.log("play", play);
  }, [rewind, play]);

  const [rotation, setRotation] = React.useState(0);

  useEffect(() => {
    if (play) {
      if (rewind) {
        const interval = setInterval(() => {
          setRotation((r) => r - 1);
        }, 10);
        return () => clearInterval(interval);
      } else {
        const interval = setInterval(() => {
          setRotation((r) => r + 1);
        }, 10);
        return () => clearInterval(interval);
      }
    }
  }, [play]);

  // useEffect(() => {
  //   console.log("rotation", rotation);
  // }, [rotation]);
  // if the user clicks rewind then rewind the cassette in 2s and then stop

  return (
    <>
      <CassettePlayer roationAngle={rotation} />
    </>
  );
};

export default page;
