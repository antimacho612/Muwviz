import { readonly, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import { useSongQueue } from './songQueue';
import { PlayerState, RepeatState, Song } from '@shared/types';

const toast = useToast();

export const audioPlayer = () => {
  const state = ref<PlayerState>('UnReady');
  const volume = ref(100);
  const isMuted = ref(false);
  const repeat = ref<RepeatState>('Off');
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
    state.value = 'Loading';
  };

  // ロード終了時
  audio.onloadeddata = () => {
    state.value = 'StandBy';
  };

  // エラー時
  audio.onerror = (event, source, lineno, colno, error) => {
    console.error('Audio Error', event, source, lineno, colno, error);
    toast.error('エラーが発生しました。選択された曲を再生できません。');
    state.value = 'UnReady';
  };

  // 再生開始時
  audio.onplaying = () => {
    state.value = 'Playing';
  };

  // ポーズ時
  audio.onpause = () => {
    state.value = 'StandBy';
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
    // repeat === 'Once'の場合はaudioにloop = trueが設定してあるため、自動でループ再生される
    if (repeat.value === 'Once') return;

    if (repeat.value === 'All' || songQueue.hasNext()) {
      nextSong(true);
    } else {
      setCurrentTime(0);
      state.value = 'StandBy';
      toast.info('キューの最後の曲の再生が終了しました。');
    }
  };

  document.addEventListener('keydown', (event) => {
    // TODO: bind event
    // console.log(event.code);
  });

  const resetAudio = () => {
    audio.removeAttribute('src');
    audio.srcObject = null;
    state.value = 'UnReady';
    currentSong.value = undefined;
  };

  const loadSong = async (autoPlay = true) => {
    resetAudio();

    currentSong.value = songsMap.value.get(songQueue.currentItem.value.songId);
    if (!currentSong.value) {
      toast.error('曲が存在しません...😢');
      console.error('曲が存在しません...');
      state.value = 'UnReady';
      return;
    }

    audio.src = `media://${currentSong.value.filePath}`;
    state.value = 'StandBy';

    if (autoPlay) {
      await play();
    }
  };

  const play = async () => {
    if (currentSong.value) await audio.play();

    // MEMO: main側に再生状態を伝える ← 必要だったら
    // MEMO: 再生回数増やす ← 必要だったら
  };

  const pause = () => audio.pause();

  const togglePlay = async () => {
    if (state.value === 'StandBy') {
      await play();
    } else if (state.value === 'Playing') {
      audio.pause();
    }
  };

  const playSongInQueue = async (queueId: string) => {
    songQueue.setCurrent(queueId);
    await loadSong();
  };

  const nextSong = async (autoPlay = false) => {
    if (!songQueue.length.value) {
      return;
    }

    if (songQueue.hasNext() || repeat.value === 'All') {
      songQueue.next(true);
      await loadSong(autoPlay);
    } else {
      toast.warning('キューに次の曲がありません。', { id: 'end-of-queue-warning' });
    }
  };

  const previousSong = async () => {
    if (!songQueue.length.value) {
      setCurrentTime(0);
      return;
    }

    // 現在の曲の再生位置が3秒より後ろの場合は、現在の曲を頭から再生
    if (currentTime.value > 3) {
      setCurrentTime(0);
      return;
    }

    if (songQueue.hasPrevious() || repeat.value === 'All') {
      songQueue.previous(true);
      await loadSong(state.value === 'Playing');
    } else {
      toast.warning('キューに前の曲がありません。', { id: 'start-of-queue-warning' });
    }
  };

  const setVolume = (payload: number) => {
    audio.volume = payload / 100;
    volume.value = payload;

    audio.muted = false;
    isMuted.value = false;
  };

  const toggleMute = () => {
    audio.muted = !audio.muted;
    isMuted.value = audio.muted;

    if (!isMuted.value && volume.value < 10) {
      setVolume(10);
    }
  };

  const setCurrentTime = (currentTime: number) => {
    audio.currentTime = currentTime;
  };

  const setRepeat = (payload: RepeatState) => {
    audio.loop = payload === 'Once';
    repeat.value = payload;
  };

  const setQueue = async (
    songIds: string[],
    options?: {
      autoplay?: boolean;
      shuffle?: boolean;
      firstSongIndex?: number;
    }
  ) => {
    const defaultOpts = {
      autoplay: true,
      shuffle: false,
      firstSongIndex: 0,
    };
    const opts = { ...defaultOpts, ...options };

    state.value = 'Loading';
    songQueue.setItems(songIds, opts.shuffle, opts.firstSongIndex);
    state.value = 'StandBy';

    if (!opts.autoplay) {
      return;
    }

    await loadSong();
  };

  const addSongsToQueue = (songIds: string[]) => {
    // TODO: 未実装
  };

  const removeSongsFromQueue = (...queueIds: string[]) => {
    songQueue.removeItems(...queueIds);
  };

  const clearQueue = () => {
    if (songQueue.length.value <= 1) {
      // 全削除
      songQueue.clearItems(true);
      resetAudio();
    } else {
      // 現在の曲以外を削除
      songQueue.clearItems(false);
    }
    toast.info('キューから曲を削除しました。');
  };

  return {
    audio,

    playerState: readonly(state),
    duration: readonly(duration),
    currentTime: readonly(currentTime),
    volume: readonly(volume),
    isMuted: readonly(isMuted),
    repeat: readonly(repeat),

    queueItems: songQueue.allItems,
    currentSongIndex: songQueue.currentIndex,
    currentSong,

    play,
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
    shuffleQueue: songQueue.shuffle,
    clearQueue,
    removeSongsFromQueue,
  };
};

export type AudioPlayer = ReturnType<typeof audioPlayer>;
