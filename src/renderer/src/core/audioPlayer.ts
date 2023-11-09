import { readonly, InjectionKey, computed, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useEntitiesStore } from '@renderer/stores/entities';
import { shuffleArray } from '@shared/utils';

export type RepeatState = 'OFF' | 'ALL' | 'ONCE';

const toast = useToast();

export const audioPlayer = () => {
  const entities = useEntitiesStore();

  const isPlaying = ref(false);
  const isLoading = ref(false);
  const volume = ref(100);
  const isMuted = ref(false);
  const isShufflOn = ref(false);
  const repeat = ref<RepeatState>('OFF');
  const duration = ref(0);
  const currentTime = ref(0);

  let originalSongQueue: string[] = [];
  const songQueue = ref<string[]>([]);
  const currentSongIndex = ref(-1);

  const currentSongId = computed(() => songQueue.value[currentSongIndex.value]);
  const currentSong = computed(() => entities.songsMap.get(currentSongId.value));

  // Audio Elementの初期化
  const audio = new Audio();
  audio.src = 'media://D:\\\\Music\\Ado\\クラクラ\\クラクラ instrumental.mp3';
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
    // if (qu) {
    // next()
    // } else {
    // pause();
    // }

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

  async function playSong(index: number) {
    resetAudio();

    currentSongIndex.value = index;
    if (!currentSong.value) {
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

  async function play() {
    if (currentSong.value) {
      await audio.play();
    } else {
      console.error('曲が存在しないため再生できません。');
    }
  }

  function pause() {
    audio.pause();
  }

  async function togglePlay() {
    if (isPlaying.value) {
      audio.pause();
    } else {
      await audio.play();
    }
  }

  async function nextSong() {
    const len = songQueue.value.length;
    if (!len) {
      setCurrentTime(0);
      return;
    }

    if (currentSongIndex.value === -1) {
      await playSong(0);
      return;
    }

    const isLast = len === currentSongIndex.value + 1;
    if (isLast && repeat.value === 'OFF') {
      setCurrentTime(0);
      return;
    }

    const newIndex = isLast ? 0 : currentSongIndex.value + 1;
    await playSong(newIndex);
  }

  async function preveousSong() {
    const len = songQueue.value.length;
    if (!len) {
      setCurrentTime(0);
      return;
    }

    if (currentSongIndex.value === -1) {
      await playSong(0);
      return;
    }

    // 現在の曲の再生位置が3秒より後ろの場合は、現在の曲を頭から再生
    if (currentTime.value > 3) {
      setCurrentTime(0);
      return;
    }

    const newIndex = currentSongIndex.value === 0 ? len - 1 : currentSongIndex.value - 1;
    await playSong(newIndex);
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

  function setQueue(queue: string[], play = true) {
    isLoading.value = true;

    if (isShufflOn.value) {
      shuffleQueue(queue);
    } else {
      originalSongQueue = [];
      songQueue.value = [...queue];
      currentSongIndex.value = -1;
    }

    if (queue.length && play) {
      playSong(0);
    } else {
      isLoading.value = false;
    }
  }

  function addSongsToQueue(songIds: string[]) {
    //
  }

  function removeFromQueue(songIds: string[]) {
    //
  }

  function clearQueue() {
    if (songQueue.value.length) {
      originalSongQueue = [];
      songQueue.value = [];
      currentSongIndex.value = -1;

      resetAudio();
    }
  }

  function toggleShuffle() {
    isShufflOn.value = !isShufflOn.value;

    if (isShufflOn.value) {
      shuffleQueue(songQueue.value, currentSongIndex.value);
    } else {
      currentSongIndex.value = originalSongQueue.indexOf(currentSongId.value);
      songQueue.value = originalSongQueue;
      originalSongQueue = [];
    }
  }

  function shuffleQueue(queue: string[], firstSongIndex = -1) {
    originalSongQueue = queue;

    if (firstSongIndex >= 0) {
      // 指定曲をキューの先頭にもってきて、残りの曲をシャッフル
      const tempArray = [...queue];
      tempArray.splice(firstSongIndex, 1);
      songQueue.value = [queue[firstSongIndex], ...shuffleArray(tempArray)];
    } else {
      // 全曲シャッフル
      songQueue.value = shuffleArray(queue);
    }
    currentSongIndex.value = 0;
  }

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
    currentSong: readonly(currentSong),

    isReady: computed(() => songQueue.value.length),

    play,
    pause,
    togglePlay,
    nextSong,
    preveousSong,

    setVolume,
    toggleMute,
    setCurrentTime,
    setRepeat,

    setQueue,
    clearQueue,
    toggleShuffle,
  };
};

export type AudioPlayer = ReturnType<typeof audioPlayer>;

export const audioPlayerInjectionKey: InjectionKey<AudioPlayer> = Symbol('AudioPlayer');
