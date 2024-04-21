import { atom } from "jotai";
import { type GameMainState } from "~/app/_components/State/useGameInfo";

export const gameInfoAtom = atom<GameMainState>({
  volume: 10,
  songStep: 0,
  gameOver: false,

  gameDate: "",
  gameId: "",
  roundId: "",
  dailyChallenge: false,
  roundInfo: [],
});
