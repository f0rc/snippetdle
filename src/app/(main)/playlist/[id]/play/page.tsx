"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import LoadGame from "./_LoadGame";
import { useAtom } from "jotai";
import { gameInfoAtom } from "~/State/GameInfo";

const NewGamePage = ({ params }: { params: { id: string } }) => {
  const [gameExitsModal, setGameExitsModal] = useState(true);

  const gameExitsApi = api.playlistGame.gameExits.useQuery({
    playlistId: params.id,
  });

  const [continueGame, setContinueGame] = useState(false);
  const createGameApi = api.playlistGame.createGame.useQuery(
    {
      playlistId: params.id,
    },
    {
      enabled: !gameExitsModal && !continueGame,
      refetchOnWindowFocus: false,
    },
  );

  const continueGameApi = api.playlistGame.getOldGame.useQuery(
    {
      dailyChallenge: false,
      playlistId: params.id,
    },
    {
      enabled: !gameExitsModal && continueGame,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (gameExitsApi.isSuccess && !gameExitsApi.data?.success) {
      setGameExitsModal(false);
    } else if (gameExitsApi.isError) {
      // if there is an error with getting game exits then create new game
      setGameExitsModal(false);
    }
  }, [gameExitsApi]);

  // initalize gameInfo

  const [gameInfo, setGameInfo] = useAtom(gameInfoAtom);

  const [gameInfoReady, setGameInfoReady] = useState(false);

  useEffect(() => {
    if (createGameApi.isSuccess || continueGameApi.isSuccess) {
      if (gameInfo) {
        setGameInfoReady(true);
      }
    }
  }, [createGameApi.isSuccess, continueGameApi.isSuccess, gameInfo]);

  return (
    <div className="relative">
      {gameExitsApi.data?.success && (
        <Dialog defaultOpen open={gameExitsModal}>
          <DialogContent
            onInteractOutside={() => {
              setGameExitsModal(false);
              setContinueGame(false);
            }}
            className="border-neutral-500 bg-neutral-600 text-white sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>Previous Game Exits</DialogTitle>
            </DialogHeader>
            <div>
              <h1>Do you want to continue previous game?</h1>
            </div>
            <DialogFooter className="gap-4">
              <Button
                type="submit"
                className="bg-yellow-500 text-black hover:bg-yellow-400"
                onClick={() => {
                  setGameExitsModal(false);
                  setContinueGame(false);
                }}
              >
                New Game
              </Button>
              <Button
                type="submit"
                className=""
                onClick={() => {
                  setGameExitsModal(false);
                  setContinueGame(true);
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {gameInfoReady && (
        <>
          <div>
            {createGameApi.data?.success && (
              <>
                <p>new game</p>
                <LoadGame
                  gameInfo={createGameApi.data.gameInfo}
                  song={createGameApi.data.song}
                  gameType="playlist"
                />
              </>
            )}
          </div>
          <div>
            {continueGameApi.data?.success && (
              <>
                <p>old game</p>
                <LoadGame
                  gameInfo={continueGameApi.data.gameInfo}
                  song={continueGameApi.data.song}
                  gameType="playlist"
                  roundInfo={continueGameApi.data.roundInfo}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NewGamePage;
