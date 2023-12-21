"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

function CreateGame() {
  const createPlaylist = api.game.createPlaylist.useMutation({
    onSuccess: () => {
      console.log("made playlist");
    },
  });

  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = async () => {
    console.log("submit to db");
    createPlaylist.mutate({
      spotifyPlaylistUrl: spotifyUrl,
      playlistName: playlistName,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        <p>add play list url here</p>
        <input
          type="text"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          className="text-black"
        />

        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="text-black"
        />

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </main>
  );
}

export default CreateGame;