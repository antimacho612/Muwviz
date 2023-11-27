export type KeyValue<T> = {
  [K in keyof T]: {
    key: K;
    value: T[K];
  };
}[keyof T];

export type Song = {
  id: string;
  filePath: string;
  title: string;
  artistId: string;
  artist: string;
  albumId: string;
  album: string;
  diskNo?: number;
  trackNo?: number;
  year?: number;
  genres?: string[];
  size: number;
  bitrate?: number;
  sampleRate?: number;
  duration: number;
  artworkPath?: string;
  createdAt: Date;
  scanId: string;
};

export type Album = {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  artworkPath?: string;
  songCount: number;
};

export type Artist = {
  id: string;
  name: string;
  songCount: number;
};

export type Lyrics = {
  [songId: string]: string;
};

export type Order = 'ASC' | 'DESC';

export type SortOption<T> = {
  key: keyof Partial<T>;
  order?: Order;
};

export type SongsSortKey = 'Artist' | 'Album' | 'Title' | 'PlayCount';

export type ScannedFolder = {
  id: string;
  path: string;
  scannedSongsCount: number;
  scannedAt: Date;
};

export type Theme = 'Light' | 'Dark';

export type Settings = {
  fontFamily: string;
  theme: Theme;
  primaryColor: string;
  showDesktopNotification: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  fontFamily: 'system-ui',
  primaryColor: '#7c3aed',
  theme: 'Light',
  showDesktopNotification: true,
};

export type ScanProgress = {
  path: string;
  totalFilesCount: number;
  currentIndex: number;
  scannedFilesCount: number;
  skippedFilesCount: number;
  done: boolean;
};
