import { defineStore } from 'pinia';
import { Album, Artist, Song } from '@shared/types';

type EntitiesStoreState = {
  songsMap: Map<string, Song>;
  albumsMap: Map<string, Album>;
  artists: Artist[];
  playlists: Song[];
};

export const useEntitiesStore = defineStore('entities', {
  state: (): EntitiesStoreState => {
    return {
      songsMap: new Map(),
      albumsMap: new Map(),
      artists: [],
      playlists: [],
    };
  },

  getters: {
    songList: (state) => Array.from(state.songsMap.values()),
    albumList: (state) => Array.from(state.albumsMap.values()),
  },

  actions: {
    async fetch() {
      try {
        console.debug('Fetching entities...');

        const [songs, albums, artists] = await Promise.all([
          window.electronAPI.invoke.getAllSongs(),
          window.electronAPI.invoke.getAllAlbums(),
          window.electronAPI.invoke.getAllArtists(),
        ]);

        this.songsMap = new Map(songs.map((song) => [song.id, song]));
        this.albumsMap = new Map(albums.map((album) => [album.id, album]));
        this.artists = artists;

        console.debug(
          `Fetched entities(${songs.length} songs, ${albums.length} albums, ${artists.length} artists)`
        );
      } catch (e) {
        console.error(e);
      }
    },

    getAlbumById(albumId: string) {
      return this.albumsMap.get(albumId);
    },

    getAlbumSongs(albumId: string) {
      return this.songList.filter((song) => song.albumId === albumId);
    },
  },

  // const state = reactive<EntitiesStoreState>({
  //   songs: {},
  //   albums: {},
  //   artists: {},
  //   playlists: {},
  // });

  // const songsCount = computed(() => Object.keys(state.songs).length);

  // async function fetch() {
  //   try {
  //     const songs = await window.electronAPI.invoke.getSongs();
  //     state.songs = songs.reduce((acc, song) => {
  //       acc[song.id] = song;
  //       return acc;
  //     }, {});

  //     console.debug(`Loaded songs data (count: ${songsCount.value})`);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // return {
  //   ...toRefs(readonly<EntitiesStoreState>(state)),

  //   songsCount,

  //   fetch,
  // };
});
