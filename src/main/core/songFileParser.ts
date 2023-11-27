import { parseFile as parseMetadata, IPicture } from 'music-metadata';
import { xxHash32 } from 'js-xxhash';
import Jimp from 'jimp';
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Song } from '@shared/types';
import { ensureDirectory } from '@main/utils';
import { ARTWORK_DIR } from './paths';

export type ParsedSong = Omit<Song, 'artistId' | 'albumId' | 'scanId'> & { lyrics?: string };

const storePicture = async (picture: IPicture) => {
  const hashedFileName = xxHash32(picture.data).toString(16);

  const filePath = path.join(ARTWORK_DIR, `${hashedFileName}.png`);
  if (!fs.existsSync(filePath)) {
    console.debug('Saving artwork...', filePath);
    try {
      const image = await Jimp.read(picture.data);
      image.contain(256, 256);
      await image.writeAsync(filePath);
    } catch (e) {
      console.error('Failed to save artwork', e);
    }
  }

  return filePath;
};

export const parseSongFile = async (filePath: string) => {
  await ensureDirectory(ARTWORK_DIR);

  const metadata = await parseMetadata(filePath, {
    duration: true,
  });

  let artworkPath: string | undefined;
  if (metadata.common.picture) {
    artworkPath = await storePicture(metadata.common.picture[0]);
  }

  const fileStat = await fsAsync.stat(filePath);

  const song: ParsedSong = {
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
    bitrate: metadata.format.bitrate ? Math.floor(metadata.format.bitrate / 100) * 100 : undefined,
    sampleRate: metadata.format.sampleRate,
    artworkPath: artworkPath,
    lyrics: metadata.common.lyrics
      ? metadata.common.lyrics.join('\n')
      : metadata.common.lyricist
      ? metadata.common.lyricist.join('\n')
      : undefined,
    createdAt: fileStat.ctime,
  };

  return song;
};
