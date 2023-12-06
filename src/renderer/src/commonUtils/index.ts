export const formatArtistName = (name?: string) => name || '不明なアーティスト';
export const formatAlbumTitle = (title?: string) => title || '不明なアルバム';

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

export const formatDiskAndTrackNo = (diskNo?: number, trackNo?: number) => {
  if (trackNo === undefined) {
    return '-';
  }

  const formattedTrackNo = trackNo.toString().padStart(2, '0');
  if (diskNo === undefined) {
    return formattedTrackNo;
  }

  return `${diskNo}-${formattedTrackNo}`;
};

export const toHyphenIfEmpty = (value: string | number | undefined | null) => {
  if (value == null) return '-';
  // string
  if (typeof value === 'string') return value || '-';
  // number
  return Number.isFinite(value) ? value.toString() : '-';
};

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((s) => s + s)
      .join('');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return { r, g, b };
};

export const rgbToHex = (rgb: { r: number; g: number; b: number }) => {
  return (
    `#` +
    rgb.r.toString(16).padStart(2, '0') +
    rgb.g.toString(16).padStart(2, '0') +
    rgb.b.toString(16).padStart(2, '0')
  );
};

export const getNewShade = (baseColorHex: string, luminance: number) => {
  const { r, g, b } = hexToRgb(baseColorHex);

  const newRgb = {
    r: Math.round(Math.min(Math.max(0, r + r * luminance), 255)),
    g: Math.round(Math.min(Math.max(0, g + g * luminance), 255)),
    b: Math.round(Math.min(Math.max(0, b + b * luminance), 255)),
  };

  return newRgb;
};
