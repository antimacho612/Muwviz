import { ref } from 'vue';
import { onBackupState, useHistoryState } from 'vue-history-state';
import { AlbumsSortKey, ArtistsSortKey, Order } from '@shared/types';

type AlbumsHistoryBackupData = {
  searchText?: string;
  sortKey?: AlbumsSortKey;
  order?: Order;
  scrollTo?: number;
};

export const useAlbumsHistoryState = () => {
  const history = useHistoryState();
  const backupData = ref<AlbumsHistoryBackupData>({});

  if (history.action === 'back' && history.data) {
    backupData.value = { ...history.data };
  }

  onBackupState(() => backupData.value);

  return { backupData };
};

type ArtistsHistoryBackupData = {
  searchText?: string;
  sortKey?: ArtistsSortKey;
  order?: Order;
  scrollTo?: number;
};

export const useArtistsHistoryState = () => {
  const history = useHistoryState();
  const backupData = ref<ArtistsHistoryBackupData>({});

  if (history.action === 'back' && history.data) {
    backupData.value = { ...history.data };
  }

  onBackupState(() => backupData.value);

  return { backupData };
};
