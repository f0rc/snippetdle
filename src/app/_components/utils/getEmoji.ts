import { type roundInfoType } from "../State/useGameInfo";

export const getScoreEmojis = (roundInfo: roundInfoType[]) => {
  return roundInfo.map((round) => {
    if (round.skip) {
      return "⬜"; // Gray square for skipped
    } else if (round.correct) {
      return "✅"; // Green checkmark for correct
    } else {
      return "❌"; // Red X for incorrect
    }
  });
};
