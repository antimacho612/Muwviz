import { Album, Song } from '@shared/types';
import { Ref, ref } from 'vue';

export const useSelectableList = <T extends Song | Album>(listItems: T[], keyField = 'id') => {
  const selectedItems = ref(new Set<string>());
  const clearSelection = () => selectedItems.value.clear();
  const selectAll = () => {
    selectedItems.value = new Set(listItems.map((item) => item[keyField]));
  };

  let keyPressed: 'Shift' | 'Control' | undefined;
  let currentIndex = 0;

  const onClickRow = (index: number, id: string) => {
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
      } else {
        const from = Math.min(currentIndex, index);
        const to = Math.max(currentIndex, index);
        selectedSongs.value = new Set(props.songs.slice(from, to + 1).map((song) => song.id));
      }
    } else {
      selectedSongs.value = new Set([id]);
      currentIndex = index;
    }
  };

  return {
    selectedItems,
    selectAll,
    clearSelection,
  };
};
