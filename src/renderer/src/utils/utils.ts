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

export const formatBytes = (bytes: number, decimals = 2) => {
  const KB = 1024;
  const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

  let unitIndex = 0;

  if (Math.abs(bytes) < KB) {
    return `${bytes} ${UNITS[unitIndex]}`;
  }

  const r = 10 ** decimals;
  let calculated = bytes;
  do {
    calculated /= KB;
    unitIndex++;
  } while (Math.round(Math.abs(calculated) * r) / r >= KB && unitIndex < UNITS.length - 1);

  return `${calculated.toFixed(decimals)} ${UNITS[unitIndex]}`;
};

export const toHyphenIfEmpty = (value: string | number | undefined | null) => {
  if (value == null) return '-';
  // string
  if (typeof value === 'string') return value || '-';
  // number
  return Number.isFinite(value) ? value.toString() : '-';
};
