import { Song } from '@shared/types';

export type GroupedItem = {
  id: string;
  album: string;
  albumId: string;
  artworkPath?: string;
  baseIndex: number;
  songs: Song[];
};

export const groupSongs = (songList: Song[]) => {
  let currentKey: string;

  return songList.reduce<GroupedItem[]>((array, song, index) => {
    if (currentKey !== song.albumId) {
      currentKey = song.albumId;

      array.push({
        id: crypto.randomUUID(),
        album: song.album,
        albumId: song.albumId,
        artworkPath: song.artworkPath,
        baseIndex: index,
        songs: [song],
      });
    } else {
      const lastItem = array[array.length - 1];
      lastItem.artworkPath ??= song.artworkPath;
      lastItem.songs.push(song);
    }

    return array;
  }, []);
};
