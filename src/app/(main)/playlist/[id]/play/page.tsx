"use client";

import { api } from "~/trpc/react";
import Game from "~/app/_components/Game";
import { useEffect } from "react";
import { useGameInfo } from "~/app/_components/State/useGameInfo";
import GameOver from "~/app/_components/GameOver";
import { Loader } from "~/app/_components/Loader";

const NewGamePage = ({ params }: { params: { id: string } }) => {
  const { setGameInfo, gameInfo, handleRoundSubmit } = useGameInfo();

  const createGameApi = api.playlistGame.createGame.useQuery(
    {
      playlistId: params.id,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const playlistData = api.playlist.getPlaylist.useQuery({ id: params.id });

  useEffect(() => {
    // init game state
    if (createGameApi.data?.success && playlistData.data?.songs) {
      setGameInfo({
        currentIndex: 0,
        currentSong: createGameApi.data.song,
        gameDate: createGameApi.data.gameInfo.date,
        totalRounds: playlistData.data.songs.length,
        roundInfo: [],
        songsPlayed: [createGameApi.data.song],
        gameRound: [],
        roundOver: false,
        gameOver: false,

        totalPossibleScore: playlistData.data.songs.length * 6,
        totalScore: 0,
        isDaily: false,
      });
    }
  }, [createGameApi.isSuccess]);

  const getRandomSongFromPlaylist = () => {
    if (playlistData.data) {
      const playedSongIds = gameInfo.songsPlayed.map((song) => song.id);
      const unplayedSongs = playlistData.data.songs.filter(
        (song: any) => !playedSongIds.includes(song.id),
      );

      // console.log(unplayedSongs);

      if (unplayedSongs.length > 0) {
        // console.log("we here gang", gameInfo.roundInfo);
        const randomSong =
          unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
        if (randomSong) {
          setGameInfo((p) => ({
            ...p,
            gameRound: [
              ...p.gameRound,
              {
                rounds: p.roundInfo,
                song: gameInfo.currentSong,
              },
            ],

            currentIndex: p.currentIndex !== null ? p.currentIndex + 1 : 0,
            currentSong: randomSong,
            roundInfo: [],
            songsPlayed: [...p.songsPlayed, randomSong],
            totalScore: p.totalScore + gameInfo.roundInfo.length,
            roundOver: false,
          }));
        } else {
          // console.log("no random song");
        }

        return;
      } else {
        // console.log("yeah");
        // no songs left game over
        setGameInfo((p) => ({
          ...p,
          gameRound: [
            ...p.gameRound,
            {
              rounds: p.roundInfo,
              song: gameInfo.currentSong,
            },
          ],
          currentIndex: p.currentIndex ? p.currentIndex + 1 : 0,
          totalScore: p.totalScore + gameInfo.roundInfo.length,
          gameOver: true,
        }));
      }
    }
    // no songs left game over

    setGameInfo((p) => ({
      ...p,
      gameOver: true,
    }));
  };

  const nextRoundHanler = async () => {
    // check if round is over then call func
    if (gameInfo.roundOver) {
      getRandomSongFromPlaylist();
    }
    // else fill the reset with skips
    else {
      const roundsLeft = 6 - gameInfo.roundInfo.length;
      console.log("rounds Left", roundsLeft, gameInfo.roundInfo.length);
      for (let i = 0; i < roundsLeft; i++) {
        handleRoundSubmit(true);

        if (i === 5) {
          getRandomSongFromPlaylist();
        }
      }
    }
  };

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex h-full w-full flex-col items-center justify-center gap-10">
        {createGameApi.isLoading ?? <Loader />}
        {createGameApi.isError ?? <div>Something went wrong</div>}
        {createGameApi.data?.success && gameInfo.currentSong && <Game />}

        <div className="flex flex-col items-center justify-center">
          {!gameInfo.gameOver && (
            <button
              onClick={nextRoundHanler}
              className="focus:ring-opacity-50 flex rounded-md bg-yellow-500 px-4 py-2 font-semibold text-black uppercase transition-colors duration-300 ease-in-out hover:bg-yellow-400 focus:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
              {gameInfo.songsPlayed.length < (gameInfo.totalRounds ?? 0)
                ? "Next Round"
                : "End Game"}
            </button>
          )}
          {/* display totals */}
          {gameInfo.gameOver && <GameOver />}
        </div>

        {/* <pre>{JSON.stringify(gameInfo, null, 2)}</pre> */}
      </div>
    </main>
  );
};

export default NewGamePage;
