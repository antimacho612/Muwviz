import { computed, readonly, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { shuffleArray } from '@shared/utils';

type SongQueueItem = {
  queueId: string;
  songId: string;
};

const toast = useToast();

const songQueue = () => {
  const items = ref<SongQueueItem[]>([]);
  const currentIndex = ref(-1);

  const length = computed<number>(() => items.value.length);
  const currentItem = computed<SongQueueItem | undefined>(() => items.value[currentIndex.value]);

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

  /**
   * キューを設定する
   * @param songIds セットする曲のID
   * @param shuffle シャッフルするかどうか
   * @param firstSongIndex 最初に再生する曲のキュー内での位置
   */
  const setItems = (songIds: Readonly<string[]>, shuffle: boolean, firstSongIndex: number) => {
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
    if (!all && currentItem.value) {
      items.value = [currentItem.value];
      currentIndex.value = 0;
    } else if (currentIndex.value >= 0) {
      items.value = [];
      currentIndex.value = -1;
    }
  };

  /**
   * キューから指定したIDの要素を削除する
   * @param queueIds 削除する要素のID
   */
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

      toast.info('キューをシャッフルしました。', { id: 'info-shuffled-queue' });
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

export default songQueue;
