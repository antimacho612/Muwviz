import fsAsync from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { scanProgressReporter } from '@main/utils/scanProgressReporter';
import { getSongsSortOptions } from '@shared/utils';
import { albumsStore, artistsStore, lyricsStore, scannedFoldersStore, songsStore } from '..';
import { ParsedSong, parseSongFile } from './songFileParser';
import { addParsedSongToLibrary } from './libraryManager';
import { sendScannedFoldersToMain } from '@main/ipc';

const getScanningFolder = (folderPath: string) =>
  scannedFoldersStore.findByPath(folderPath) ?? {
    id: crypto.randomUUID(),
    path: folderPath,
    scannedSongsCount: 0,
    scannedAt: new Date(),
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

export const scanFolder = async (folderPath: string, resortLibrary = true) => {
  console.debug(`Searching for song files in "${folderPath}" ...`);

  const progressReporter = scanProgressReporter(folderPath);

  const songFiles = await getSongFilesInFolder(folderPath);
  if (!songFiles.length) {
    progressReporter.report(true);
    return;
  }

  progressReporter.setTotal(songFiles.length);

  let hasAnySongsScanned = false;
  const scanningFolder = getScanningFolder(folderPath);
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

    hasAnySongsScanned = true;
    progressReporter.incrementScanned();
    scanningFolder.scannedSongsCount++;
    progressReporter.report();
  }

  if (hasAnySongsScanned && resortLibrary) {
    console.debug('Resorting library...');

    songsStore.sort(getSongsSortOptions('Artist', 'ASC'));
    // TODO: アルバムソートオプション
    albumsStore.sort([{ key: 'name' }, { key: 'artists' }]);
    // TODO: アーティストソートオプション
    artistsStore.sort([{ key: 'name' }]);
  }

  if (hasAnySongsScanned) {
    scanningFolder.scannedAt = new Date();
    scannedFoldersStore.upsert(scanningFolder);

    console.debug('Saving stores...');

    await Promise.allSettled([
      songsStore.save(),
      albumsStore.save(),
      artistsStore.save(),
      lyricsStore.save(),
      scannedFoldersStore.save(),
    ]);

    sendScannedFoldersToMain();
  }

  progressReporter.report(true);
};
