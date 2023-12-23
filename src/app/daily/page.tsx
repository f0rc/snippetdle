"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

function page() {
  const [songId, setSongId] = useState("");

  const submitMutation = api.game.createDailyChallenge.useMutation({
    onSuccess: (data) => {
      console.log("data", data);
    },
  });

  return (
    <div>
      <p>add daily challenge</p>
      <input
        type="text"
        value={songId}
        onChange={(e) => setSongId(e.target.value)}
      />
      <button
        onClick={async () => {
          await submitMutation.mutateAsync({ songId: songId });
        }}
      >
        submit
      </button>
    </div>
  );
}

export default page;
