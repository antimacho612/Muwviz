import { readonly, InjectionKey, computed, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useSongQueue } from './songQueue';
import { Song } from '@shared/types';
import { storeToRefs } from 'pinia';
import { useEntitiesStore } from '@renderer/stores/entities';

export type RepeatState = 'OFF' | 'ALL' | 'ONCE';

const toast = useToast();

export const audioPlayer = () => {
  const isPlaying = ref(false);
  const isLoading = ref(false);
  const volume = ref(100);
  const isMuted = ref(false);
  const isShufflOn = ref(false);
  const repeat = ref<RepeatState>('OFF');
  const duration = ref(0);
  const currentTime = ref(0);

  const { songsMap } = storeToRefs(useEntitiesStore());
  const songQueue = useSongQueue();
  const currentSong = ref<Song | undefined>();

  // Audio Elementの初期化
  const audio = new Audio();
  audio.preload = 'auto';
  audio.crossOrigin = 'anonymous';
  audio.volume = 1;

  // ロード開始時
  audio.onloadstart = () => {
    isLoading.value = true;
  };

  // ロード終了時
  audio.onloadeddata = () => {
    isLoading.value = false;
  };

  // エラー時
  audio.onerror = (event, source, lineno, colno, error) => {
    console.error('Audio Error', event, source, lineno, colno, error);
    toast.error('エラーが発生しました。選択された曲を再生できません。');
    isLoading.value = false;
    isPlaying.value = true;
  };

  // 再生開始時
  audio.onplay = () => {
    isPlaying.value = true;
  };

  // ポーズ時
  audio.onpause = () => {
    isPlaying.value = false;
  };

  // 曲の長さ変更時
  audio.ondurationchange = () => {
    duration.value = audio.duration;
  };

  // 再生位置更新時
  audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime;
  };

  // 曲終了時
  audio.onended = async () => {
    if (repeat.value !== 'ONCE') {
      nextSong();
    }
  };

  function resetAudio() {
    audio.removeAttribute('src');
    audio.srcObject = null;
  }

  async function refleshToPlay() {
    resetAudio();

    currentSong.value = songsMap.value.get(songQueue.currentItem.value.songId);

    if (!currentSong.value) {
      console.error('曲が存在しないため再生できません。');
      audio.pause();
      return;
    }

    audio.src = `media://${currentSong.value.filePath}`;
    audio.play();

    // main側に再生状態を伝える ← 必要だったら
    // await window.electronAPI.invoke.updatePlaybackState(playAfterLoad || playerStatus !== 'PAUSED' ? 'PLAYING' : 'PAUSED')
    // 再生回数増やす
    // incrementPlayCount(song.id)
  }

  async function resume() {
    if (currentSong.value) {
      await audio.play();
    }
  }

  function pause() {
    audio.pause();
  }

  async function togglePlay() {
    if (isPlaying.value) {
      audio.pause();
    } else {
      await resume();
    }
  }

  async function playSongInQueue(queueId: string) {
    songQueue.setCurrent(queueId);
    await refleshToPlay();
  }

  async function nextSong() {
    if (!songQueue.length.value) {
      setCurrentTime(0);
      return;
    }

    if (songQueue.hasNext() || repeat.value === 'ALL') {
      songQueue.next(true);
      await refleshToPlay();
    } else {
      toast.warning('キューに次の曲がありません。');
    }
  }

  async function previousSong() {
    if (!songQueue.length) {
      setCurrentTime(0);
      return;
    }

    // 現在の曲の再生位置が3秒より後ろの場合は、現在の曲を頭から再生
    if (currentTime.value > 3) {
      setCurrentTime(0);
      return;
    }

    if (songQueue.hasPrevious() || repeat.value === 'ALL') {
      songQueue.previous(true);
      await refleshToPlay();
    } else {
      toast.warning('キューに前の曲がありません。');
    }
  }

  function setVolume(payload: number) {
    audio.volume = payload / 100;
    volume.value = payload;

    audio.muted = false;
    isMuted.value = false;
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    isMuted.value = audio.muted;

    if (!isMuted.value && volume.value < 10) {
      setVolume(10);
    }
  }

  function setCurrentTime(currentTime: number) {
    audio.currentTime = currentTime;
  }

  function setRepeat(payload: RepeatState) {
    audio.loop = payload === 'ONCE';
    repeat.value = payload;
  }

  async function setQueue(
    songIds: string[],
    options?: {
      autoplay?: boolean;
      shuffle?: boolean;
      firstSongIndex?: number;
    }
  ) {
    const defaultOpts = {
      autoplay: true,
      shuffle: false,
      firstSongIndex: 0,
    };
    const opts = { ...defaultOpts, ...options };

    isLoading.value = true;

    songQueue.setItems(songIds, opts.shuffle, opts.firstSongIndex);

    if (!opts.autoplay) {
      isLoading.value = false;
      return;
    }

    await refleshToPlay();
  }

  function addSongsToQueue(songIds: string[]) {
    //
  }

  function removeSongsFromQueue(...queueIds: string[]) {
    songQueue.removeItems(...queueIds);
  }

  function clearQueue() {
    songQueue.clearItems();
    resetAudio();
  }

  // function toggleShuffle() {
  //   isShufflOn.value = !isShufflOn.value;

  //   if (isShufflOn.value) {
  //     shuffleQueue(songQueue.value, currentSongIndex.value);
  //   } else {
  //     currentSongIndex.value = originalSongQueue.indexOf(currentSongId.value);
  //     songQueue.value = originalSongQueue;
  //     originalSongQueue = [];
  //   }
  // }

  // // TODO: キュー内の曲をシャッフルする関数に変える
  // function shuffleQueue(queue: string[], firstSongIndex = -1) {
  //   originalSongQueue = queue;

  //   if (firstSongIndex >= 0) {
  //     // 指定曲をキューの先頭にもってきて、残りの曲をシャッフル
  //     const tempArray = [...queue];
  //     tempArray.splice(firstSongIndex, 1);
  //     songQueue.value = [queue[firstSongIndex], ...shuffleArray(tempArray)];
  //   } else {
  //     // 全曲シャッフル
  //     songQueue.value = shuffleArray(queue);
  //   }
  // }

  document.addEventListener('keydown', (event) => {
    // TODO: bind evnet
    // console.log(event.code);
  });

  return {
    audio,

    isPlaying: readonly(isPlaying),
    isLoading: readonly(isLoading),
    duration: readonly(duration),
    currentTime: readonly(currentTime),
    volume: readonly(volume),
    isMuted: readonly(isMuted),

    queueItems: songQueue.allItems,
    currentSongIndex: songQueue.currentIndex,
    currentSong,

    resume,
    pause,
    togglePlay,
    nextSong,
    previousSong,

    setVolume,
    toggleMute,
    setCurrentTime,
    setRepeat,

    playSongInQueue,
    setQueue,
    clearQueue,
    removeSongsFromQueue,

    // toggleShuffle,
  };
};

export type AudioPlayer = ReturnType<typeof audioPlayer>;

export const audioPlayerInjectionKey: InjectionKey<AudioPlayer> = Symbol('AudioPlayer');
