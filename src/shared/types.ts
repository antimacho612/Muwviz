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
  title: string;
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

export type PlayerState = 'UnReady' | 'Playing' | 'StandBy' | 'Loading';
export type RepeatState = 'Off' | 'All' | 'Once';

export type Order = 'Asc' | 'Desc';

export type SortOption<T> = {
  key: keyof Partial<T>;
  order?: Order;
};

export type SongsSortKey = 'Artist' | 'Album' | 'Title' | 'TrackNo';
export type AlbumsSortKey = 'Title' | 'SongCount';
export type ArtistsSortKey = 'Name' | 'SongCount';

export type ScannedFolder = {
  id: string;
  path: string;
  scannedSongsCount: number;
  scannedAt: Date;
};

export type Theme = 'Light' | 'Dark';

export type Settings = {
  isFirstLaunch: boolean;
  fontFamily: string;
  theme: Theme;
  primaryColor: string;
  showDesktopNotification: boolean;
  cacheWaveformData: boolean;
  mainWindowState: { width: number; height: number; isMaximized: boolean };
  subWindowState: { width: number; height: number; x?: number; y?: number };
};

export type LibrarySettings = Pick<Settings, 'cacheWaveformData'>;
export type AppearanceSettings = Pick<Settings, 'fontFamily' | 'theme' | 'primaryColor'>;
export type SystemSettings = Pick<Settings, 'showDesktopNotification'>;
export type UpdatableSettings = LibrarySettings & AppearanceSettings & SystemSettings;

export const DEFAULT_SETTINGS: Settings = {
  isFirstLaunch: true,
  fontFamily: 'system-ui',
  primaryColor: '#7c3aed',
  theme: 'Light',
  showDesktopNotification: true,
  cacheWaveformData: true,
  mainWindowState: { width: 960, height: 640, isMaximized: false },
  subWindowState: { width: 400, height: 640 },
};

export type ScanProgress = {
  path: string;
  totalFilesCount: number;
  currentIndex: number;
  scannedFilesCount: number;
  skippedFilesCount: number;
  done: boolean;
};
