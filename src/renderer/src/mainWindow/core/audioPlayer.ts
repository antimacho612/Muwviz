import { readonly, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useEntitiesStore } from '@mainWindow/stores/entities';
import songQueue from './songQueue';
import { formatAlbumTitle, formatArtistName } from '@renderer/commonUtils';
import { PlayerState, RepeatState, Song } from '@shared/types';

const toast = useToast();

const audioPlayer = () => {
  const state = ref<PlayerState>('UnReady');
  const volume = ref(100);
  const isMuted = ref(false);
  const repeat = ref<RepeatState>('Off');
  const duration = ref(0);
  const currentTime = ref(0);

  const { songsMap } = storeToRefs(useEntitiesStore());
  const queue = songQueue();
  const currentSong = ref<Song | undefined>();

  // メディアセッション
  const mediaSession = window.navigator.mediaSession;

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
    mediaSession.playbackState = 'playing';
  };

  // ポーズ時
  audio.onpause = () => {
    state.value = 'StandBy';
    mediaSession.playbackState = 'paused';
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

    if (repeat.value === 'All' || queue.hasNext()) {
      nextSong(true);
    } else {
      setCurrentTime(0);
      state.value = 'StandBy';
      toast.info('キューの最後の曲の再生が終了しました。');
    }
  };

  const deactivateAudio = () => {
    audio.removeAttribute('src');
    audio.srcObject = null;
    currentSong.value = undefined;
    state.value = 'UnReady';
    mediaSession.metadata = null;
    mediaSession.playbackState = 'none';
  };

  document.addEventListener('keydown', (_event) => {
    // TODO: bind event
  });

  const loadSong = async (autoPlay = true) => {
    audio.removeAttribute('src');
    audio.srcObject = null;

    currentSong.value = queue.currentItem.value
      ? songsMap.value.get(queue.currentItem.value.songId)
      : undefined;
    if (!currentSong.value) {
      toast.error('曲が存在しません...😢');
      console.error('曲が存在しません...');
      state.value = 'UnReady';
      return;
    }

    audio.src = `media://${currentSong.value.filePath}`;
    state.value = 'StandBy';

    if (autoPlay) await play();
  };

  const play = async () => {
    if (!currentSong.value) return;

    await audio.play();

    // MEMO: main側に再生状態を伝える ← 必要だったら
    // MEMO: 再生回数増やす ← 必要だったら

    // メディアセッションに再生中の曲の情報をセット
    mediaSession.metadata = new MediaMetadata({
      title: currentSong.value.title,
      artist: formatArtistName(currentSong.value.artist),
      album: formatAlbumTitle(currentSong.value.album),
    });

    // デスクトップ通知
    await window.electron.invoke.showDesktopNotification(
      currentSong.value.title,
      `${formatArtistName(currentSong.value.artist)}／${formatAlbumTitle(currentSong.value.album)}`,
      currentSong.value.artworkPath
    );
  };

  const pause = () => audio.pause();

  const togglePlay = async () => {
    if (state.value === 'StandBy') await play();
    else if (state.value === 'Playing') pause();
  };

  const playSongInQueue = async (queueId: string) => {
    queue.setCurrent(queueId);
    await loadSong();
  };

  const nextSong = async (autoPlay = false) => {
    if (!queue.length.value) return;

    if (queue.hasNext() || repeat.value === 'All') {
      queue.next(true);
      await loadSong(autoPlay);
    } else {
      toast.warning('キューに次の曲がありません。', { id: 'end-of-queue-warning' });
    }
  };

  const previousSong = async () => {
    if (!queue.length.value) {
      setCurrentTime(0);
      return;
    }

    // 現在の曲の再生位置が3秒より後ろの場合は、現在の曲を頭から再生
    if (currentTime.value > 3) {
      setCurrentTime(0);
      return;
    }

    if (queue.hasPrevious() || repeat.value === 'All') {
      queue.previous(true);
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

    if (!isMuted.value && volume.value < 10) setVolume(10);
  };

  const setCurrentTime = (currentTime: number) => {
    audio.currentTime = currentTime;
  };

  const setRepeat = (payload: RepeatState) => {
    audio.loop = payload === 'Once';
    repeat.value = payload;
  };

  /**
   * 新しいキューをセットする
   * @param songIds キューにセットする楽曲ID
   * @param options オプション
   */
  const setQueue = async (
    songIds: Readonly<string[]>,
    options?: {
      /** キューセット後に自動再生するか（default: true） */
      autoplay?: boolean;
      /** 楽曲をシャッフルするか（default: false） */
      shuffle?: boolean;
      /** 最初に再生する楽曲のインデックス（default: shuffle ? -1 : 0） */
      firstSongIndex?: number;
    }
  ) => {
    const opts = {
      autoplay: true,
      shuffle: false,
      firstSongIndex: options?.shuffle ? -1 : 0,
      ...options,
    };

    state.value = 'Loading';
    queue.set(songIds, opts.shuffle, opts.firstSongIndex);
    state.value = 'StandBy';

    await loadSong(opts.autoplay);
  };

  const addSongsToQueue = async (
    songIds: Readonly<string[]>,
    options?: { nextToCurrent?: boolean; shuffle?: boolean; skipImmediate?: boolean }
  ) => {
    const opts = { nextToCurrent: false, shuffle: false, skipImmediate: false, ...options };

    if (!queue.length.value) {
      await setQueue(songIds, { autoplay: opts.skipImmediate, shuffle: opts.shuffle });
    } else {
      queue.push(songIds, { nextToCurrent: opts.nextToCurrent, shuffle: opts.shuffle });
      if (opts.nextToCurrent && opts.skipImmediate)
        await nextSong(state.value === 'Playing' || opts.skipImmediate);
    }
  };

  /**
   * キューから楽曲を削除する
   * @param queueIds 削除対象の楽曲に振られているキューID
   */
  const removeSongsFromQueue = async (...queueIds: string[]) => {
    if (queue.currentItem.value && queueIds.includes(queue.currentItem.value.queueId)) {
      deactivateAudio();
    }
    queue.remove(...queueIds);

    if (queue.currentItem.value) await loadSong(false);
  };

  /**
   * キューをクリアする
   */
  const clearQueue = () => {
    if (queue.length.value <= 1) {
      // 全削除
      queue.clear(true);
      deactivateAudio();
    } else {
      // 現在の曲以外を削除
      queue.clear(false);
    }

    toast.info('キューから曲を削除しました。');
  };

  // メディアセッションのイベントハンドリング
  mediaSession.setActionHandler('play', async () => await play());
  mediaSession.setActionHandler('pause', () => pause());
  mediaSession.setActionHandler('previoustrack', async () => await previousSong());
  mediaSession.setActionHandler('nexttrack', async () => await nextSong(state.value === 'Playing'));

  // メインプロセスのイベントハンドリング
  window.electron.on.sendPlaySongCommand(async () => await play());
  window.electron.on.sendPauseSongCommand(() => pause());
  window.electron.on.sendPrevSongCommand(async () => await previousSong());
  window.electron.on.sendNextSongCommand(async () => await nextSong(state.value === 'Playing'));

  return {
    htmlAudioElement: audio,

    playerState: readonly(state),
    duration: readonly(duration),
    currentTime: readonly(currentTime),
    volume: readonly(volume),
    isMuted: readonly(isMuted),
    repeat: readonly(repeat),

    queueItems: queue.allItems,
    currentSongIndex: queue.currentIndex,
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
    addSongsToQueue,
    shuffleQueue: queue.shuffle,
    clearQueue,
    removeSongsFromQueue,
  };
};

export type AudioPlayer = ReturnType<typeof audioPlayer>;
export default audioPlayer;
