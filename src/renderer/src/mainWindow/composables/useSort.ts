import { ref, watch } from 'vue';
import {
  getAlbumsSortOptions,
  getArtistsSortOptions,
  getSongsSortOptions,
  sortArrayOfObjects,
} from '@shared/utils';
import {
  Album,
  AlbumsSortKey,
  Artist,
  ArtistsSortKey,
  Order,
  Song,
  SongsSortKey,
} from '@shared/types';

export const useSongsSort = (
  songs: Song[],
  defaultSort?: { sortKey: SongsSortKey; order: Order }
) => {
  const sortedSongs = ref<Song[]>([...songs]);
  const sortKey = ref<SongsSortKey>('Artist');
  const order = ref<Order>('Asc');

  if (defaultSort) {
    sortKey.value = defaultSort.sortKey;
    order.value = defaultSort.order;

    if (sortKey.value !== 'Artist' || order.value !== 'Asc') {
      const sortOptions = getSongsSortOptions(sortKey.value, order.value);
      sortedSongs.value = sortArrayOfObjects([...songs], sortOptions);
    }
  }

  watch([sortKey, order], () => {
    if (sortKey.value === 'Artist' && order.value === 'Asc') {
      sortedSongs.value = [...songs];
    } else {
      const sortOptions = getSongsSortOptions(sortKey.value, order.value);
      sortedSongs.value = sortArrayOfObjects([...songs], sortOptions);
    }
  });

  return {
    sortedSongs,
    sortKey,
    order,
  };
};

export const useAlbumsSort = (albums: Album[]) => {
  const sortedAlbums = ref<Album[]>([...albums]);
  const sortKey = ref<AlbumsSortKey>('Name');
  const order = ref<Order>('Asc');

  watch([sortKey, order], () => {
    if (sortKey.value === 'Name' && order.value === 'Asc') {
      sortedAlbums.value = [...albums];
    } else {
      const sortOptions = getAlbumsSortOptions(sortKey.value, order.value);
      sortedAlbums.value = sortArrayOfObjects([...albums], sortOptions);
    }
  });

  return {
    sortedAlbums,
    sortKey,
    order,
  };
};

export const useArtistsSort = (artists: Artist[]) => {
  const sortedArtists = ref<Artist[]>([...artists]);
  const sortKey = ref<ArtistsSortKey>('Name');
  const order = ref<Order>('Asc');

  watch([sortKey, order], () => {
    if (sortKey.value === 'Name' && order.value === 'Asc') {
      sortedArtists.value = [...artists];
    } else {
      const sortOptions = getArtistsSortOptions(sortKey.value, order.value);
      sortedArtists.value = sortArrayOfObjects([...artists], sortOptions);
    }
  });

  return {
    sortedArtists,
    sortKey,
    order,
  };
};
