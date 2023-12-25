"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

function page() {
  const [songId, setSongId] = useState("");
  const date = new Date();
  console.log(date);
  const [forDate, setForDate] = useState<Date>();

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

      <input
        type="date"
        className="text-black"
        onChange={(e) => {
          e.target.valueAsDate && setForDate(e.target.valueAsDate);
          console.log("HERE", e.target.valueAsDate);
        }}
      />

      <p>{}</p>
      <button
        onClick={async () => {
          if (!forDate) {
            return;
          }
          await submitMutation.mutateAsync({
            songId: songId,
            forDate: forDate,
          });
        }}
      >
        submit
      </button>
    </div>
  );
}

export default page;
