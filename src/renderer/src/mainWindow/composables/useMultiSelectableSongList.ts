import { Ref, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { Song } from '@shared/types';

export const useMultiSelectableSongList = (songList: Ref<Song[]>) => {
  const selectedSongs = ref(new Map<number, string>());

  const selectAll = () => {
    selectedSongs.value = new Map(songList.value.map((song, index) => [index, song.id]));
  };

  const clearSelection = () => selectedSongs.value.clear();

  let currentIndex = 0;

  const onClickItem = (e: MouseEvent, index: number, id: string) => {
    if (e.ctrlKey) {
      if (selectedSongs.value.has(index)) {
        selectedSongs.value.delete(index);
      } else {
        selectedSongs.value.set(index, id);
      }
      currentIndex = index;
    } else if (e.shiftKey) {
      if (selectedSongs.value.size === 0) {
        selectedSongs.value.set(index, id);
        currentIndex = index;
      } else {
        const from = Math.min(currentIndex, index);
        const to = Math.max(currentIndex, index);
        selectedSongs.value = new Map(
          songList.value.slice(from, to + 1).map((song, index) => [from + index, song.id])
        );
      }
    } else {
      selectedSongs.value = new Map([[index, id]]);
      currentIndex = index;
    }
  };

  const getOrderedSelectedSongIds = () =>
    [...selectedSongs.value].sort((a, b) => a[0] - b[0]).map((i) => i[1]);

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.tagName?.toLocaleLowerCase() === 'input') {
      clearSelection();
      return;
    }

    if (e.ctrlKey && e.key === 'a') {
      selectAll();
      e.preventDefault();
    }
  };

  useEventListener(document, 'keydown', onKeyDown);

  return {
    selectedSongs,
    selectAll,
    clearSelection,
    onClickItem,
    getOrderedSelectedSongIds,
  };
};
