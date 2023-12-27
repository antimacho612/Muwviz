import { useAudioPlayer } from '../composables/useAudioPlayer';
import { useEntitiesStore } from '../stores/entities';
import { useSettingsStore } from '../stores/settings';

export const useLibraryManager = () => {
  const audioPlayer = useAudioPlayer();

  const removeSongsFromLibrary = async (songIds: Readonly<string[]>) => {
    // キューから対象の楽曲を削除
    const { fetch: fetchEntities } = useEntitiesStore();
    const queueIds = audioPlayer.queueItems.value
      .filter((queueItem) => songIds.includes(queueItem.songId))
      .map((queueItem) => queueItem.queueId);
    await audioPlayer.removeSongsFromQueue(...queueIds);

    // main側のライブラリから楽曲および関連情報を削除
    await window.electron.invoke.removeSongsFromLibrary([...songIds]);

    // ストアのエンティティ情報を更新
    await fetchEntities();
  };

  const initializeLibrary = async () => {
    const { fetch: fetchEntities } = useEntitiesStore();
    const { fetch: fetchSettings } = useSettingsStore();

    // ライブラリ初期化
    await window.electron.invoke.initializeLibrary();

    // ストアのエンティティ情報・設定情報を更新
    await Promise.allSettled([fetchEntities(), fetchSettings()]);
  };

  return {
    removeSongsFromLibrary,
    initializeLibrary,
  };
};
