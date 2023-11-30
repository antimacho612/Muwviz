import { ref, watch } from 'vue';
import { sortArrayOfObjects } from '@shared/utils';
import { Order, Song, SongsSortKey } from '@shared/types';

export const useSongsSort = (songs: Song[]) => {
  const sortedSongs = ref<Song[]>([...songs]);
  const sortKey = ref<SongsSortKey>('Artist');
  const order = ref<Order>('ASC');

  watch([sortKey, order], () => {
    // ソート
    if (sortKey.value === 'Artist' && order.value === 'ASC') {
      sortedSongs.value = [...songs];
    } else {
      sortedSongs.value = sortArrayOfObjects(
        [...songs],
        [
          {
            key: 'title',
            order: 'DESC',
          },
        ]
      );
    }
  });

  return {
    sortKey,
    order,
    sortedSongs,
  };
};
