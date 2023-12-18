import { parseFile as parseMetadata } from 'music-metadata';
import fsAsync from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Song } from '@shared/types';
import { ensureDirectory } from '@main/utils';
import { ARTWORKS_DIR, WAVEFORMS_DIR } from './paths';
import { saveArtwork } from './artworkManager';
import { saveWaveformData } from './waveformManager';

export type ParsedSong = Omit<Song, 'artistId' | 'albumId' | 'scanId'> & { lyrics?: string };

export const parseSongFile = async (filePath: string) => {
  await ensureDirectory(ARTWORKS_DIR);
  await ensureDirectory(WAVEFORMS_DIR);

  const metadata = await parseMetadata(filePath, {
    duration: true,
  });

  let artworkPath: string | undefined;
  if (metadata.common.picture) {
    artworkPath = await saveArtwork(metadata.common.picture[0]);
  }

  const fileStat = await fsAsync.stat(filePath);

  // 波形データ生成
  const songId = crypto.randomUUID();
  // saveWaveformData(songId, filePath);

  const song: ParsedSong = {
    id: songId,
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
