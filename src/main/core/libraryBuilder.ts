import crypto from 'crypto';
import { ParsedSong } from './songFileParser';
import { Album, Artist, LyricsMap, Song, SortOption } from '@shared/types';
import { getSongsSortOptions, sortArrayOfObjects } from '@shared/utils';

export async function buildLibrary(parsedSongs: ParsedSong[]) {
  const songs: Song[] = [];
  const albumsMap: { [name: string]: Album } = {};
  const artistsMap: { [name: string]: Artist } = {};
  const lyricsMap: LyricsMap = {};

  for (const parsedSong of parsedSongs) {
    if (parsedSong.lyrics) {
      lyricsMap[parsedSong.id] = parsedSong.lyrics;
    }

    // アルバム情報構築
    let albumId: string;
    const albumName = parsedSong.album;
    if (!(albumName in albumsMap)) {
      const id = crypto.randomUUID();
      albumsMap[albumName] = {
        id,
        artists: [parsedSong.artist],
        name: albumName,
        artworkPath: parsedSong.artworkPath,
        songCount: 1,
      };

      albumId = id;
    } else {
      const album = albumsMap[albumName];
      if (album.artists.indexOf(parsedSong.artist) === -1) album.artists.push(parsedSong.artist);
      if (!album.artworkPath && parsedSong.artworkPath) album.artworkPath = parsedSong.artworkPath;
      album.songCount += 1;

      albumId = album.id;
    }

    // アーティスト情報構築
    let artistId: string;
    const artistName = parsedSong.artist;
    if (!(artistName in artistsMap)) {
      const id = crypto.randomUUID();
      artistsMap[artistName] = {
        id,
        name: artistName,
        songCount: 1,
      };

      artistId = id;
    } else {
      const artist = artistsMap[artistName];
      artist.songCount += 1;

      artistId = artist.id;
    }

    songs.push({
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
      parsedAt: parsedSong.parsedAt,
    });
  }

  // ソート
  const songsSortOptions = getSongsSortOptions('Artist', 'ASC');
  sortArrayOfObjects(songs, songsSortOptions);

  // アルバム【タイトル(昇), アーティスト名(昇)】
  const albums = Object.values(albumsMap);
  const albumsSortOptions: SortOption<Album>[] = [{ key: 'name' }, { key: 'artists' }];
  sortArrayOfObjects(albums, albumsSortOptions);

  // アーティスト
  const artists = Object.values(artistsMap);
  const artistssSortOptions: SortOption<Artist>[] = [{ key: 'name' }];
  sortArrayOfObjects(artists, artistssSortOptions);

  return {
    songs,
    albums,
    artists,
    lyricsMap,
  };
}
