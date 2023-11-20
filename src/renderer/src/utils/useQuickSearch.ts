import { Ref, ref } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { Album, Artist, Song } from '@shared/types';

export const useQuickSongsSearch = (songs: Ref<Song[]>) => {
  const searchText = ref('');
  const searchedSongs = ref<Song[]>(songs.value);

  watchDebounced(
    [songs, searchText],
    () => {
      if (searchText.value === '') {
        searchedSongs.value = songs.value;
      } else {
        const searchStr = searchText.value.toLocaleLowerCase();
        searchedSongs.value = songs.value.filter(
          (song) =>
            song.title.toLocaleLowerCase().includes(searchStr) ||
            song.album.toLocaleLowerCase().includes(searchStr) ||
            song.artist.toLocaleLowerCase().includes(searchStr)
        );
      }
    },
    { debounce: 500, maxWait: 1000 }
  );

  return {
    searchText,
    searchedSongs,
  };
};
