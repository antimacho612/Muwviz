import fs from 'fs';
import { albumsStore, artistsStore, lyricsStore, songsStore } from '..';

const deleteArtworksIfNoRefered = (artworkPaths: Set<string>) => {
  const songs = songsStore.getData();
  const albums = albumsStore.getData();

  for (const artworkPath of artworkPaths) {
    if (
      songs?.some((song) => song.artworkPath === artworkPath) ||
      albums?.some((album) => album.artworkPath === artworkPath)
    ) {
      // まだ使用されているため削除しない
      return;
    }

    try {
      if (fs.existsSync(artworkPath)) {
        fs.unlinkSync(artworkPath);
      }
    } catch (e) {
      console.error('Failed to delete artwork', artworkPath, e);
    }
  }
};

export const deleteEntitiesByScanId = async (scanId: string) => {
  const targetSongs = songsStore.getData()?.filter((song) => song.scanId === scanId);
  if (!targetSongs?.length) {
    return;
  }

  const artworkPaths = new Set<string>();

  for (const song of targetSongs) {
    if (song.artworkPath) artworkPaths.add(song.artworkPath);

    const album = albumsStore.findById(song.albumId);
    if (album) {
      if (album.songCount <= 1) {
        albumsStore.delete(album.id);
      } else {
        album.songCount--;
      }

      if (album.artworkPath) artworkPaths.add(album.artworkPath);
    }

    const artist = artistsStore.findById(song.artistId);
    if (artist) {
      if (artist.songCount <= 1) {
        artistsStore.delete(artist.id);
      } else {
        artist.songCount--;
      }
    }

    lyricsStore.delete(song.id);
    songsStore.delete(song.id);
  }

  // 参照されなくなったアートワークを削除する
  if (artworkPaths.size) deleteArtworksIfNoRefered(artworkPaths);
};
