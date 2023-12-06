import { defineStore } from 'pinia';
import { isRejected } from '@shared/utils';
import { Album, Artist, Song } from '@shared/types';

type EntitiesStoreState = {
  songsMap: Map<string, Song>;
  albumsMap: Map<string, Album>;
  artistsMap: Map<string, Artist>;
  playlists: Song[];
};

export const useEntitiesStore = defineStore('entities', {
  state: (): EntitiesStoreState => {
    return {
      songsMap: new Map(),
      albumsMap: new Map(),
      artistsMap: new Map(),
      playlists: [],
    };
  },

  getters: {
    songList: (state) => Array.from(state.songsMap.values()),
    albumList: (state) => Array.from(state.albumsMap.values()),
    artistList: (state) => Array.from(state.artistsMap.values()),
  },

  actions: {
    async fetch() {
      console.debug('Fetching entities...');

      const [songs, albums, artists] = await Promise.all([
        window.electron.invoke.getAllSongs(),
        window.electron.invoke.getAllAlbums(),
        window.electron.invoke.getAllArtists(),
      ]);

      this.songsMap = new Map(songs.map((song) => [song.id, song]));
      this.albumsMap = new Map(albums.map((album) => [album.id, album]));
      this.artistsMap = new Map(artists.map((artist) => [artist.id, artist]));

      console.debug(
        `Fetched entities(${this.songsMap.size} songs, ${this.albumsMap.size} albums, ${this.artistsMap.size} artists)`
      );

      // メイン側のキャッシュクリア
      const results = await Promise.allSettled([
        window.electron.invoke.clearSongsCache(),
        window.electron.invoke.clearAlbumsCache(),
        window.electron.invoke.clearArtistsCache(),
      ]);
      results.filter(isRejected).forEach((result) => console.error(result.reason.toString()));
    },

    getAlbumById(albumId: string) {
      return this.albumsMap.get(albumId);
    },

    getArtistById(artistId: string) {
      return this.artistsMap.get(artistId);
    },

    getAlbumSongs(albumId: string) {
      return this.songList.filter((song) => song.albumId === albumId);
    },

    getArtistSongs(artistId: string) {
      return this.songList.filter((song) => song.artistId === artistId);
    },
  },
});
