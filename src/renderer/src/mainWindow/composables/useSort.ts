import { Ref, ref, watch } from 'vue';
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
  songs: Ref<Song[]>,
  defaultSort?: { sortKey: SongsSortKey; order: Order }
) => {
  const sortedSongs = ref<Song[]>([...songs.value]);
  const sortKey = ref<SongsSortKey>('Artist');
  const order = ref<Order>('Asc');

  if (defaultSort) {
    sortKey.value = defaultSort.sortKey;
    order.value = defaultSort.order;

    if (sortKey.value !== 'Artist' || order.value !== 'Asc') {
      const sortOptions = getSongsSortOptions(sortKey.value, order.value);
      sortedSongs.value = sortArrayOfObjects([...songs.value], sortOptions);
    }
  }

  watch([songs, sortKey, order], () => {
    if (sortKey.value === 'Artist' && order.value === 'Asc') {
      sortedSongs.value = [...songs.value];
    } else {
      const sortOptions = getSongsSortOptions(sortKey.value, order.value);
      sortedSongs.value = sortArrayOfObjects([...songs.value], sortOptions);
    }
  });

  return {
    sortedSongs,
    sortKey,
    order,
  };
};

export const useAlbumsSort = (albums: Ref<Album[]>) => {
  const sortedAlbums = ref<Album[]>([...albums.value]);
  const sortKey = ref<AlbumsSortKey>('Name');
  const order = ref<Order>('Asc');

  watch([albums, sortKey, order], () => {
    if (sortKey.value === 'Name' && order.value === 'Asc') {
      sortedAlbums.value = [...albums.value];
    } else {
      const sortOptions = getAlbumsSortOptions(sortKey.value, order.value);
      sortedAlbums.value = sortArrayOfObjects([...albums.value], sortOptions);
    }
  });

  return {
    sortedAlbums,
    sortKey,
    order,
  };
};

export const useArtistsSort = (artists: Ref<Artist[]>) => {
  const sortedArtists = ref<Artist[]>([...artists.value]);
  const sortKey = ref<ArtistsSortKey>('Name');
  const order = ref<Order>('Asc');

  watch([artists, sortKey, order], () => {
    if (sortKey.value === 'Name' && order.value === 'Asc') {
      sortedArtists.value = [...artists.value];
    } else {
      const sortOptions = getArtistsSortOptions(sortKey.value, order.value);
      sortedArtists.value = sortArrayOfObjects([...artists.value], sortOptions);
    }
  });

  return {
    sortedArtists,
    sortKey,
    order,
  };
};
