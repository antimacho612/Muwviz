import { Ref, ref } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { Album, Artist, Song } from '@shared/types';

const useQuickSearch = <T>(
  items: Ref<T[]>,
  filterCallbackFn: (item: T, searchStr: string) => boolean
) => {
  const searchText = ref('');
  const filteredItems = ref<T[]>(items.value) as Ref<T[]>;

  watchDebounced(
    [searchText, items],
    () => {
      if (searchText.value === '') {
        filteredItems.value = items.value;
      } else {
        const searchStr = searchText.value.toLocaleLowerCase();
        filteredItems.value = items.value.filter((item) => filterCallbackFn(item, searchStr));
      }
    },
    { debounce: 500, maxWait: 1000 }
  );

  return { searchText, filteredItems };
};

export const useSongsQuickSearch = (songs: Ref<Song[]>) => {
  const filterCb = (song: Song, searchStr: string) =>
    song.title.toLocaleLowerCase().includes(searchStr) ||
    song.album.toLocaleLowerCase().includes(searchStr) ||
    song.artist.toLocaleLowerCase().includes(searchStr);
  const { searchText, filteredItems } = useQuickSearch<Song>(songs, filterCb);

  return {
    searchText,
    filteredSongs: filteredItems,
  };
};

export const useAlbumsQuickSearch = (albums: Ref<Album[]>) => {
  const filterCb = (album: Album, searchStr: string) =>
    album.name.toLocaleLowerCase().includes(searchStr);
  const { searchText, filteredItems } = useQuickSearch<Album>(albums, filterCb);

  return {
    searchText,
    filteredAlbums: filteredItems,
  };
};

export const useArtistsQuickSearch = (artists: Ref<Artist[]>) => {
  const filterCb = (artist: Artist, searchStr: string) =>
    artist.name.toLocaleLowerCase().includes(searchStr);
  const { searchText, filteredItems } = useQuickSearch<Artist>(artists, filterCb);

  return {
    searchText,
    filteredArtists: filteredItems,
  };
};
