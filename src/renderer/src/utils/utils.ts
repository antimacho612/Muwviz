export const formatTime = (ms?: number): string => {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) {
    return '--:--';
  }

  const times: string[] = [];

  const hours = Math.floor(ms / 3600);
  if (hours) {
    times.push(hours.toString());
  }

  const minutes = Math.floor((ms % 3600) / 60);
  times.push(minutes.toString().padStart(2, '0'));

  const seconds = Math.floor((ms % 3600) % 60);
  times.push(seconds.toString().padStart(2, '0'));

  return times.join(':');
};
