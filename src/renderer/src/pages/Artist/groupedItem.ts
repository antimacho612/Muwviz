import { Song } from '@shared/types';

export type GroupedItem = {
  id: string;
  album: string;
  albumId: string;
  artworkPath?: string;
  songs: Song[];
};
