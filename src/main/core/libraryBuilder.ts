import crypto from 'crypto';
import { Album, Artist, Song, SortOption } from '@shared/types';
import { getSongsSortOptions, sortArrayOfObjects } from '@shared/utils';

export async function buildLibrary(songs: Song[]) {
  const albumsMap: { [name: string]: Album } = {};
  const artistsMap: { [name: string]: Artist } = {};

  for (const song of songs) {
    // アルバム情報構築
    const albumName = song.album;
    if (!(albumName in albumsMap)) {
      const id = crypto.randomUUID();
      albumsMap[albumName] = {
        id,
        artists: [song.artist],
        name: albumName,
        artworkPath: song.artworkPath,
        songCount: 1,
      };

      song.albumId = id;
    } else {
      const album = albumsMap[albumName];
      if (album.artists.indexOf(song.artist) === -1) album.artists.push(song.artist);
      if (!album.artworkPath && song.artworkPath) album.artworkPath = song.artworkPath;
      album.songCount += 1;

      song.albumId = album.id;
    }

    // アーティスト情報構築
    const artistName = song.artist;
    if (!(artistName in artistsMap)) {
      const id = crypto.randomUUID();
      artistsMap[artistName] = {
        id,
        name: artistName,
        songCount: 1,
      };

      song.artistId = id;
    } else {
      const artist = artistsMap[artistName];
      artist.songCount += 1;

      song.artistId = artist.id;
    }
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
  };
}
