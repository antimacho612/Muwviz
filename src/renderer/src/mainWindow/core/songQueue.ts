import { computed, readonly, ref } from 'vue';
import { shuffleArray } from '@shared/utils';

type SongQueueItem = {
  queueId: string;
  songId: string;
};

export const useSongQueue = () => {
  let originalItems: SongQueueItem[] = [];
  const orderedItems = ref<SongQueueItem[]>([]);
  const currentIndex = ref(-1);

  const length = computed(() => orderedItems.value.length);
  const currentItem = computed(() => orderedItems.value[currentIndex.value]);

  const setCurrent = (queueId: string) => {
    currentIndex.value = orderedItems.value.findIndex((item) => item.queueId === queueId);
  };

  function hasNext() {
    const len = length.value;
    return !!len && currentIndex.value < len;
  }

  function next(loop = false) {
    const len = length.value;
    const current = currentIndex.value;

    if (!len) {
      throw new Error('キューに曲がありません。');
    }

    if (current === -1) {
      currentIndex.value = 0;
      return;
    }

    const isLast = len === current + 1;
    if (isLast && !loop) {
      throw new Error('キューに次の曲がありません。');
    }

    currentIndex.value = isLast ? 0 : current + 1;
  }

  function hasPrevious() {
    return !!length.value && currentIndex.value > 0;
  }

  function previous(loop = false) {
    const len = length.value;
    const current = currentIndex.value;

    if (!len) {
      throw new Error('キューに曲がありません。');
    }

    if (current === -1) {
      currentIndex.value = 0;
      return;
    }

    if (current === 0 && !loop) {
      throw new Error('キューに前の曲がありません。');
    }

    currentIndex.value = current === 0 ? len - 1 : current - 1;
  }

  function setItems(songIds: string[], shuffle: boolean, firstSongIndex: number) {
    clearItems();

    // QueueId用のタイムスタンプ
    const timestamp = Date.now();

    if (shuffle) {
      // シャッフルON時は元の並び順を保持しておく
      originalItems = songIds.map((songId, index) => ({
        queueId: `${timestamp}-${index}`,
        songId,
      }));
      orderedItems.value = shuffleArray(originalItems, firstSongIndex);
    } else {
      orderedItems.value = songIds.map((songId, index) => ({
        queueId: `${timestamp}-${index}`,
        songId,
      }));
    }

    currentIndex.value = shuffle ? 0 : firstSongIndex;
  }

  function clearItems() {
    originalItems = [];
    orderedItems.value = [];
    currentIndex.value = -1;
  }

  function removeItems(...queueIds: string[]) {
    let decrement = 0;

    orderedItems.value = orderedItems.value.filter((queueItem, index) => {
      // 削除対象外
      if (!queueIds.includes(queueItem.queueId)) {
        return true;
      }

      // 削除対象
      if (index < currentIndex.value) {
        // 現在再生中の曲より前に位置する曲の削除時、再生中の曲のインデックスがずれないように-1する
        decrement++;
      }

      return false;
    });

    // キューアイテム、並び変え前のキュー（シャッフルON時）から曲を削除
    originalItems.filter((queueItem) => !queueIds.includes(queueItem.queueId));

    // インデックス補正
    currentIndex.value -= decrement;
  }

  return {
    currentIndex: readonly(currentIndex),
    currentItem,
    allItems: readonly(orderedItems),
    length,

    setCurrent,

    hasNext,
    next,
    hasPrevious,
    previous,

    setItems,
    clearItems,
    removeItems,
  };
};
