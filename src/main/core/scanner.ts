import { sendToRenderer } from '@main/ipc';
import { getSongsSortOptions } from '@shared/utils';
import crypto from 'crypto';
import { BrowserWindow } from 'electron';
import fsAsync from 'fs/promises';
import path from 'path';
import {
  albumsStore,
  artistsStore,
  lyricsStore,
  mainWindow,
  scannedFoldersStore,
  settingsStore,
  songsStore,
} from '..';
import { ParsedSong, parseSongFile } from './songFileParser';

const isAlreadyScannedFolder = (folderPath: string) =>
  scannedFoldersStore
    .getData()
    ?.find((folder) => folder.path.toLocaleLowerCase() === folderPath.toLocaleLowerCase());

const newScanningFolder = (folderPath: string) => {
  const scannedFolder = {
    id: crypto.randomUUID(),
    path: folderPath,
    scannedSongsCount: 0,
    scannedAt: new Date(),
  };

  scannedFoldersStore.add(scannedFolder);
  return scannedFolder;
};

const getSongFilesInFolder = async (folderPath: string) => {
  let files: string[] = [];

  const dirents = await fsAsync.readdir(folderPath, { withFileTypes: true });
  for (const dirent of dirents) {
    if (dirent.isFile() && dirent.name.match(/.(aac|mp3|ogg|wav|flac|webm|m4a)$/)) {
      files.push(path.join(folderPath, dirent.name));
    } else if (dirent.isDirectory()) {
      files = [...files, ...(await getSongFilesInFolder(path.join(folderPath, dirent.name)))];
    }
  }
  return files;
};

const scanProgressReporter = (window: BrowserWindow, path: string) => {
  const progress = {
    path,
    totalFilesCount: 0,
    currentIndex: 0,
    scannedFilesCount: 0,
    skippedFilesCount: 0,
    done: false,
  };

  const setTotal = (total: number) => {
    progress.totalFilesCount = total;
  };

  const incrementScanned = () => {
    progress.currentIndex++;
    progress.scannedFilesCount++;
  };

  const incrementSkipped = () => {
    progress.currentIndex++;
    progress.skippedFilesCount++;
  };

  const report = (done = false) => {
    progress.done = done;
    sendToRenderer(window, 'updateScanProgress', progress);
  };

  return {
    setTotal,
    incrementScanned,
    incrementSkipped,
    report,
  };
};

const addParsedSongToLibrary = (scanId: string, parsedSong: ParsedSong) => {
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

export const scanFolder = async (folderPath: string, resortLibrary = true) => {
  if (isAlreadyScannedFolder(folderPath)) {
    throw new Error(`The folder "${folderPath}" has already been scanned.`);
  }

  const scanningFolder = newScanningFolder(folderPath);
  const progressReporter = scanProgressReporter(mainWindow, folderPath);

  console.debug(`Searching for song files in "${folderPath}" ...`);

  const songFiles = await getSongFilesInFolder(folderPath);

  if (!songFiles.length) {
    progressReporter.report(true);
    return;
  }

  progressReporter.setTotal(songFiles.length);

  const alreadyParsedFiles = songsStore.getData()?.map((song) => song.filePath) ?? [];

  for (const songFile of songFiles) {
    if (alreadyParsedFiles.includes(songFile)) {
      progressReporter.incrementSkipped();
      progressReporter.report();
      continue;
    }

    let parsedSong: ParsedSong;
    try {
      parsedSong = await parseSongFile(songFile);
    } catch (e) {
      console.error('Failed to parse song', e);

      progressReporter.incrementSkipped();
      progressReporter.report();
      continue;
    }

    addParsedSongToLibrary(scanningFolder.id, parsedSong);

    progressReporter.incrementScanned();
    scanningFolder.scannedSongsCount++;
    progressReporter.report();
  }

  if (resortLibrary && scanningFolder.scannedSongsCount) {
    console.debug('Resorting library...');

    songsStore.sort(getSongsSortOptions('Artist', 'ASC'));
    // TODO: アルバムソートオプション
    albumsStore.sort([{ key: 'name' }, { key: 'artists' }]);
    // TODO: アーティストソートオプション
    artistsStore.sort([{ key: 'name' }]);
  }

  console.debug('Saving stores...');

  await Promise.allSettled([
    songsStore.save(),
    albumsStore.save(),
    artistsStore.save(),
    lyricsStore.save(),
    settingsStore.save(),
  ]);

  progressReporter.report(true);
};
