import { app } from 'electron';
import { parseFile as parseMetadata, IPicture } from 'music-metadata';
import { xxHash32 } from 'js-xxhash';
import Jimp from 'jimp';
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Song } from '@shared/types';
import { ensureDirectory } from '@main/utils';

const ARTWORK_DIR = path.join(app.getPath('userData'), 'artworks');

async function storePicture(picture: IPicture) {
  const hashedFileName = xxHash32(picture.data).toString(16);

  const filePath = path.join(ARTWORK_DIR, `${hashedFileName}.png`);
  const filePathSm = path.join(ARTWORK_DIR, `${hashedFileName}_s.png`);
  if (!fs.existsSync(filePath)) {
    console.debug('Saving artwork...', filePath);
    try {
      const image = await Jimp.read(picture.data);
      image.contain(300, 300);
      await image.writeAsync(filePath);

      image.contain(48, 48);
      await image.writeAsync(filePathSm);
    } catch (e) {
      console.error('Failed to save artwork', e);
    }
  }

  return filePath;
}

export async function parseSongFile(filePath: string) {
  await ensureDirectory(ARTWORK_DIR);

  try {
    console.debug('Parsing song...', filePath);

    const metadata = await parseMetadata(filePath, {
      duration: true,
    });

    let artworkPath: string | undefined;
    if (metadata.common.picture) {
      artworkPath = await storePicture(metadata.common.picture[0]);
    }

    const fileStat = await fsAsync.stat(filePath);

    const song: Song = {
      id: crypto.randomUUID(),
      filePath: filePath,
      title: metadata.common.title ?? path.parse(filePath).name,
      artist: metadata.common.artist ?? metadata.common.artists?.[0] ?? '',
      album: metadata.common.album ?? '',
      diskNo: metadata.common.disk.no ?? undefined,
      trackNo: metadata.common.track.no ?? undefined,
      year: metadata.common.year,
      genres: metadata.common.genre,
      duration: metadata.format.duration ? Math.round(metadata.format.duration) : 0,
      size: fileStat.size,
      bitrate: metadata.format.bitrate
        ? Math.floor(metadata.format.bitrate / 100) * 100
        : undefined,
      sampleRate: metadata.format.sampleRate,
      artworkPath: artworkPath,
      createdAt: fileStat.ctime,
      parsedAt: new Date(),
    };

    return song;
  } catch (e) {
    console.error('Failed to parse song', e);
    return null;
  }
}
