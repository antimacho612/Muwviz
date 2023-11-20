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
  parsedAt: Date;
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

export type LyricsMap = {
  [songId: string]: string;
};

export type Order = 'ASC' | 'DESC';

export type SortOption<T> = {
  key: keyof Partial<T>;
  order?: Order;
};

export type SongsSortKey = 'Artist' | 'Album' | 'Title' | 'PlayCount';

export type Theme = 'Light' | 'Dark';
