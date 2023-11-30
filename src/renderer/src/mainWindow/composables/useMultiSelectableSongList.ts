import { Ref, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { Song } from '@shared/types';

export const useMultiSelectableSongList = (songList: Ref<Song[]>) => {
  const selectedSongs = ref(new Set<string>());

  const selectAll = () => {
    selectedSongs.value = new Set(songList.value.map((song) => song.id));
  };

  const clearSelection = () => selectedSongs.value.clear();

  let keyPressed: 'Shift' | 'Control' | undefined;
  let currentIndex = 0;

  const onSelectItem = (index: number, id: string) => {
    if (keyPressed === 'Control') {
      if (selectedSongs.value.has(id)) {
        selectedSongs.value.delete(id);
      } else {
        selectedSongs.value.add(id);
      }
      currentIndex = index;
    } else if (keyPressed === 'Shift') {
      if (selectedSongs.value.size === 0) {
        selectedSongs.value.add(id);
        currentIndex = index;
      } else {
        const from = Math.min(currentIndex, index);
        const to = Math.max(currentIndex, index);
        selectedSongs.value = new Set(songList.value.slice(from, to + 1).map((song) => song.id));
      }
    } else {
      selectedSongs.value = new Set([id]);
      currentIndex = index;
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.tagName?.toLocaleLowerCase() === 'input') {
      clearSelection();
      return;
    }

    if (e.shiftKey || e.ctrlKey) {
      keyPressed = e.key as 'Shift' | 'Control';
    }

    if (e.ctrlKey && e.key === 'a') {
      selectAll();
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (
      (e.key === 'Shift' && keyPressed === 'Shift') ||
      (e.key === 'Control' && keyPressed === 'Control')
    ) {
      keyPressed = undefined;
    }
  };

  useEventListener(document, 'keydown', onKeyDown);
  useEventListener(document, 'keyup', onKeyUp);

  return {
    selectedSongs,
    selectAll,
    clearSelection,
    onSelectItem,
  };
};
