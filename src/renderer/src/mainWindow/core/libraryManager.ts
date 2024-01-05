import { useAudioPlayer } from '../composables/useAudioPlayer';
import { useLyricsStore } from '../stores/lyrics';
import { useEntitiesStore } from '../stores/entities';
import { useSettingsStore } from '../stores/settings';

export const useLibraryManager = () => {
  const audioPlayer = useAudioPlayer();

  const removeSongsFromLibrary = async (songIds: Readonly<string[]>) => {
    // キューから対象の楽曲を削除
    const queueIds = audioPlayer.queueItems.value
      .filter((queueItem) => songIds.includes(queueItem.songId))
      .map((queueItem) => queueItem.queueId);
    await audioPlayer.removeSongsFromQueue(...queueIds);

    // main側のライブラリから楽曲および関連情報を削除
    await window.electron.invoke.removeSongsFromLibrary([...songIds]);

    // ストアのエンティティ情報・歌詞情報を更新
    const { fetch: fetchEntities } = useEntitiesStore();
    await fetchEntities();
    songIds.forEach((songId) => useLyricsStore().delete(songId));
  };

  const initializeLibrary = async () => {
    // ライブラリ初期化
    await window.electron.invoke.initializeLibrary();

    // ストアのエンティティ情報・歌詞情報・設定情報を更新
    const { fetch: fetchEntities } = useEntitiesStore();
    const { fetch: fetchSettings } = useSettingsStore();
    await Promise.allSettled([fetchEntities(), fetchSettings()]);

    useLyricsStore().deleteAll();
  };

  return {
    removeSongsFromLibrary,
    initializeLibrary,
  };
};
