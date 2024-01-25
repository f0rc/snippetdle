"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { spotifyPlaylistUrlPattern } from "~/utils/spotifyRegex";

function CreateGame() {
  const createPlaylist = api.game.createPlaylist.useMutation({
    onSuccess: () => {
      console.log("made playlist");
    },
  });

  const [form, setForm] = useState({
    spotifyUrl: "",
    playlistName: "",
    spotifyUrlError: "",
    playlistNameError: "",
    formState: "idle",
  });

  const handleSubmit = async () => {
    form.formState === "success" &&
      createPlaylist.mutate({
        spotifyPlaylistUrl: form.spotifyUrl,
        playlistName: form.playlistName,
      });
  };

  const handleValidation = () => {
    if (!form.spotifyUrl) {
      setForm({
        ...form,
        spotifyUrlError: "Please enter a Spotify URL",
        formState: "error",
      });
      return false;
    }

    if (!form.playlistName) {
      setForm({
        ...form,
        playlistNameError: "Please enter a playlist name",
        formState: "error",
      });
      return false;
    }

    if (!form.spotifyUrl.includes("open.spotify.com")) {
      setForm({
        ...form,
        spotifyUrlError: "Please enter a valid Spotify URL",
        formState: "error",
      });
      return false;
    }

    // playlist name must be min 3 chars and max 20 chars
    if (form.playlistName.length < 3 || form.playlistName.length > 30) {
      setForm({
        ...form,
        playlistNameError: "Playlist name must be between 3 and 20 characters",
        formState: "error",
      });
      return false;
    }

    setForm({
      ...form,
      spotifyUrlError: "",
      playlistNameError: "",
      formState: "success",
    });

    return true;
  };

  useEffect(() => {
    if (form.spotifyUrl && form.playlistName) {
      handleValidation();
    }
  }, [form.spotifyUrl, form.playlistName]);

  return (
    <main className="flex h-full">
      <div className="container mx-auto flex max-w-lg flex-col items-center px-4 py-16">
        <h1 className="py-4 text-2xl font-semibold">Add your playlist</h1>

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="spotifyUrl" className="font-semibold uppercase">
              Spotify URL
            </label>
            <input
              type="text"
              value={form.spotifyUrl}
              name="spotifyUrl"
              onChange={(e) => {
                setForm({ ...form, [e.target.name]: e.target.value });
              }}
              className="rounded-md py-2 text-lg text-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="spotifyUrl" className="font-semibold uppercase">
              Playlist Name
            </label>
            <input
              type="text"
              name="playlistName"
              value={form.playlistName}
              onChange={(e) => {
                setForm({ ...form, [e.target.name]: e.target.value });
              }}
              maxLength={30}
              className="rounded-md py-2 text-lg text-black"
            />
          </div>

          <button onClick={handleSubmit}>Submit</button>

          <pre>{JSON.stringify(form, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}

export default CreateGame;
