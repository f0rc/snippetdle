export function getAudioDuration(audioElement: HTMLAudioElement) {
  const duration = audioElement.duration;
  const currentTime = audioElement.currentTime;
  const timeLeft = duration - currentTime;

  const formatTime = (time: number) => {
    const minutes = Math.round(time / 60);
    const seconds = Math.round(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return {
    duration: formatTime(duration),
    currentTime: formatTime(currentTime),
    timeLeft: formatTime(timeLeft),
  };
}
