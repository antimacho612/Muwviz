import crypto from 'crypto';
import { albumsStore, artistsStore, lyricsStore, scannedFoldersStore, songsStore } from '..';
import { ParsedSong } from './songFileParser';
import { deleteAllArtworks, deleteArtworksIfNoReferred } from './artworkManager';
import { deleteAllWaveformData, deleteWaveformData } from './waveformManager';

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
  const album = albumsStore.findByTitle(parsedSong.album);
  if (album) {
    albumId = album.id;
    if (album.title !== '' && album.artists.every((artist) => artist.id !== artistId)) {
      album.artists.push({ id: artistId, name: parsedSong.artist });
    }
    if (album.title !== '' && !album.artworkPath && parsedSong.artworkPath) {
      album.artworkPath = parsedSong.artworkPath;
    }
    album.songCount++;
  } else {
    albumId = crypto.randomUUID();
    albumsStore.add({
      id: albumId,
      artists: [{ id: artistId, name: parsedSong.artist }],
      title: parsedSong.album,
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

/**
 * ライブラリから指定された楽曲を削除する
 * @param songIds 削除する楽曲のID
 */
export const removeSongsFromLibrary = async (songIds: string[]) => {
  // 削除候補となるアートワークのパス
  const artworkPaths = new Set<string>();

  for (const songId of songIds) {
    const song = songsStore.findById(songId);
    if (!song) continue;

    if (song.artworkPath) artworkPaths.add(song.artworkPath);

    // アルバムの曲数をデクリメント
    const album = albumsStore.findById(song.albumId);
    if (album) {
      if (album.songCount <= 1) {
        // アルバムの曲数が0になる場合はアルバム情報自体を削除
        albumsStore.delete(album.id);
        if (album.artworkPath) artworkPaths.add(album.artworkPath);
      } else {
        album.songCount--;

        // アルバム内に同一アーティストの曲が複数存在しない場合は、アルバムのアーティストから該当のアーティストを削除
        if (
          !songsStore.some(
            (s) => s.id !== song.id && s.albumId === album.id && s.artistId === song.artistId
          )
        ) {
          album.artists = album.artists.filter((artist) => artist.id !== song.artistId);
        }
      }
    }

    // アーティストの曲数をデクリメント
    const artist = artistsStore.findById(song.artistId);
    if (artist) {
      if (artist.songCount <= 1) {
        artistsStore.delete(artist.id);
      } else {
        artist.songCount--;
      }
    }

    // 波形データを削除
    deleteWaveformData(song.id);

    // 歌詞情報を削除
    lyricsStore.delete(song.id);

    // 楽曲情報を削除
    songsStore.delete(song.id);
  }

  // 参照されなくなったアートワークを削除
  if (artworkPaths.size) deleteArtworksIfNoReferred(artworkPaths);

  await Promise.allSettled([
    songsStore.save(),
    albumsStore.save(),
    artistsStore.save(),
    lyricsStore.save(),
    scannedFoldersStore.save(),
  ]);
};

/**
 * ライブラリをクリアする
 */
export const clearLibrary = async () =>
  await Promise.allSettled([
    songsStore.save([]),
    albumsStore.save([]),
    artistsStore.save([]),
    lyricsStore.save({}),
    deleteAllArtworks(),
    deleteAllWaveformData(),
  ]);
