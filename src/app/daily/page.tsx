"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

function page() {
  const [songId, setSongId] = useState("");
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
          if (e.target.valueAsDate) {
            const selectedDate = e.target.valueAsDate;
            const offsetInMs = selectedDate.getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
            const utcDate = new Date(selectedDate.getTime() + offsetInMs);
            setForDate(utcDate);
          }
        }}
      />

      <p>{forDate?.toISOString()}</p>
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
