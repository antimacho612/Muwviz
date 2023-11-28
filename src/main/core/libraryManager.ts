import fs from 'fs';
import crypto from 'crypto';
import { albumsStore, artistsStore, lyricsStore, scannedFoldersStore, songsStore } from '..';
import { ParsedSong } from './songFileParser';

export const addParsedSongToLibrary = (scanId: string, parsedSong: ParsedSong) => {
  if (parsedSong.lyrics) {
    lyricsStore.add(parsedSong.id, parsedSong.lyrics);
  }

  let artistId: string;
  const artist = artistsStore.findByName(parsedSong.artist);
  if (artist) {
    artistId = artist.id;
    artist.songCount++;
  } else {
    artistId = crypto.randomUUID();
    artistsStore.add({
      id: artistId,
      name: parsedSong.artist,
      songCount: 1,
    });
  }

  let albumId: string;
  const album = albumsStore.findByName(parsedSong.album);
  if (album) {
    albumId = album.id;
    if (album.artists.every((artist) => artist.id !== artistId)) {
      album.artists.push({ id: artistId, name: parsedSong.artist });
    }
    if (!album.artworkPath && parsedSong.artworkPath) {
      album.artworkPath = parsedSong.artworkPath;
    }
    album.songCount++;
  } else {
    albumId = crypto.randomUUID();
    albumsStore.add({
      id: albumId,
      artists: [{ id: artistId, name: parsedSong.artist }],
      name: parsedSong.album,
      artworkPath: parsedSong.artworkPath,
      songCount: 1,
    });
  }

  songsStore.add({
    id: parsedSong.id,
    filePath: parsedSong.filePath,
    title: parsedSong.title,
    artistId,
    artist: parsedSong.artist,
    albumId,
    album: parsedSong.album,
    diskNo: parsedSong.diskNo,
    trackNo: parsedSong.trackNo,
    year: parsedSong.year,
    genres: parsedSong.genres,
    size: parsedSong.size,
    bitrate: parsedSong.bitrate,
    sampleRate: parsedSong.sampleRate,
    duration: parsedSong.duration,
    artworkPath: parsedSong.artworkPath,
    createdAt: parsedSong.createdAt,
    scanId,
  });
};

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
    scannedFoldersStore.delete(scanId);
    await scannedFoldersStore.save();
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

  // 参照されなくなったアートワークを削除
  if (artworkPaths.size) deleteArtworksIfNoRefered(artworkPaths);

  scannedFoldersStore.delete(scanId);

  await Promise.allSettled([
    songsStore.save(),
    albumsStore.save(),
    artistsStore.save(),
    lyricsStore.save(),
    scannedFoldersStore.save(),
  ]);
};
