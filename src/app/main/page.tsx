import { api } from "~/trpc/server";

export default async function PlaylistPage() {
  const getPlaylists = await api.game.getAllPlaylists.query();
  return (
    <div>
      <h1>Playlist Page</h1>

      <pre>
        <code>{JSON.stringify(getPlaylists.playlistWithSongs, null, 2)}</code>
      </pre>
    </div>
  );
}
