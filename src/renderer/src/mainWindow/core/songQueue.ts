import { computed, readonly, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { shuffleArray } from '@shared/utils';

type SongQueueItem = {
  queueId: string;
  songId: string;
};

const toast = useToast();

export const useSongQueue = () => {
  const items = ref<SongQueueItem[]>([]);
  const currentIndex = ref(-1);

  const length = computed(() => items.value.length);
  const currentItem = computed(() => items.value[currentIndex.value]);

  const setCurrent = (queueId: string) => {
    currentIndex.value = items.value.findIndex((item) => item.queueId === queueId);
  };

  const hasNext = () => !!length.value && currentIndex.value < length.value - 1;

  const next = (loop = false) => {
    const len = length.value;
    const current = currentIndex.value;

    if (!len) throw new Error('キューに曲がありません。');

    if (current === -1) {
      currentIndex.value = 0;
      return;
    }

    const isLast = len === current + 1;
    if (isLast && !loop) throw new Error('キューに次の曲がありません。');

    currentIndex.value = isLast ? 0 : current + 1;
  };

  const hasPrevious = () => !!length.value && currentIndex.value > 0;

  const previous = (loop = false) => {
    const len = length.value;
    const current = currentIndex.value;

    if (!len) throw new Error('キューに曲がありません。');

    if (current === -1) {
      currentIndex.value = 0;
      return;
    }

    if (current === 0 && !loop) throw new Error('キューに前の曲がありません。');

    currentIndex.value = current === 0 ? len - 1 : current - 1;
  };

  const setItems = (songIds: string[], shuffle: boolean, firstSongIndex: number) => {
    clearItems(true);

    // QueueId用のタイムスタンプ
    const timestamp = Date.now();
    const queueItems = songIds.map((songId, index) => ({
      queueId: `${timestamp}-${index}`,
      songId,
    }));

    if (shuffle) {
      items.value = shuffleArray(queueItems, firstSongIndex);
    } else {
      items.value = queueItems;
    }

    currentIndex.value = shuffle ? 0 : firstSongIndex;
  };

  /**
   * キューから要素を削除する
   * @param all 全要素削除するかどうか。falseを指定すると現在の曲は削除対象から除外する。
   */
  const clearItems = (all = true) => {
    if (!all && currentIndex.value >= 0) {
      items.value = [currentItem.value];
      currentIndex.value = 0;
    } else if (currentIndex.value >= 0) {
      items.value = [];
      currentIndex.value = -1;
    }
  };

  const removeItems = (...queueIds: string[]) => {
    let decrement = 0;

    items.value = items.value.filter((queueItem, index) => {
      // 削除対象外
      if (!queueIds.includes(queueItem.queueId)) return true;

      // 削除対象
      // 現在再生中の曲より前に位置する曲の削除時、再生中の曲のインデックスがずれないように-1する
      if (index < currentIndex.value) decrement++;

      return false;
    });

    // インデックス補正
    currentIndex.value -= decrement;
  };

  const shuffle = () => {
    if (currentIndex.value >= 0) {
      items.value = shuffleArray(items.value, currentIndex.value);
      currentIndex.value = 0;

      toast.info('キューをシャッフルしました。');
    }
  };

  return {
    currentIndex: readonly(currentIndex),
    currentItem,
    allItems: readonly(items),
    length,

    setCurrent,

    hasNext,
    next,
    hasPrevious,
    previous,

    setItems,
    clearItems,
    removeItems,

    shuffle,
  };
};
