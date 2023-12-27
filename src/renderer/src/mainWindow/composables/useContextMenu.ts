import { inject } from 'vue';
import ContextMenu, { MenuItem } from '@imengyu/vue3-context-menu';
import { useToast } from 'vue-toastification';
import { useAudioPlayer } from './useAudioPlayer';
import { useEntitiesStore } from '../stores/entities';
import { useLibraryManager } from '../core/libraryManager';
import { showSongDetailModalKey } from '@mainWindow/injectionKeys';
import { showNativeConfirm } from '@renderer/commonUtils';
import { Album, Artist, Song } from '@shared/types';

export type ContextMenuType = 'Song' | 'Songs' | 'Album' | 'Artist';

export type ContextMenuArgs<T extends ContextMenuType> = T extends 'Song'
  ? {
      song: Song;
    }
  : T extends 'Songs'
  ? {
      selectedSongs: ReadonlyArray<string>;
    }
  : T extends 'Album'
  ? {
      album: Album;
    }
  : T extends 'Artist'
  ? {
      artist: Artist;
    }
  : Record<string, never>;

const toast = useToast();

export const useContextMenu = <T extends ContextMenuType>(type: T) => {
  const { setQueue, addSongsToQueue } = useAudioPlayer();
  const { removeSongsFromLibrary } = useLibraryManager();
  const { getAlbumSongs, getArtistSongs } = useEntitiesStore();
  const showSongDetailModal = inject(showSongDetailModalKey);

  const getSongContextMenuItems = (args: ContextMenuArgs<'Song'>) => [
    {
      label: 'キューをクリアして今すぐ再生',
      onClick: () => setQueue([args.song.id]),
    },
    {
      label: 'キューをクリアせずに今すぐ再生',
      onClick: () => addSongsToQueue([args.song.id], { nextToCurrent: true, skipImmediate: true }),
    },
    {
      label: '次に再生',
      onClick: () => addSongsToQueue([args.song.id], { nextToCurrent: true }),
    },
    {
      label: '最後に再生',
      onClick: () => addSongsToQueue([args.song.id]),
      divided: true,
    },
    {
      label: 'ライブラリから削除',
      onClick: async () => {
        const isOk = await showNativeConfirm(
          true,
          '確認',
          `「${args.song.title}」をライブラリから削除しますか？`
        );
        if (isOk) {
          await removeSongsFromLibrary([args.song.id]);
          toast.info('ライブラリから楽曲を削除しました。');
        }
      },
      divided: true,
    },
    {
      label: '詳細情報',
      onClick: () => showSongDetailModal && showSongDetailModal(args.song),
    },
  ];

  const getSongsContextMenuItems = (args: ContextMenuArgs<'Songs'>) => [
    {
      label: 'キューをクリアして今すぐ再生',
      children: [
        {
          label: '通常再生',
          onClick: () => setQueue(args.selectedSongs),
        },
        {
          label: 'シャッフル再生',
          onClick: () => setQueue(args.selectedSongs, { shuffle: true }),
        },
      ],
    },
    {
      label: 'キューをクリアせずに今すぐ再生',
      children: [
        {
          label: '通常再生',
          onClick: () =>
            addSongsToQueue(args.selectedSongs, { nextToCurrent: true, skipImmediate: true }),
        },
        {
          label: 'シャッフル再生',
          onClick: () =>
            addSongsToQueue(args.selectedSongs, {
              nextToCurrent: true,
              shuffle: true,
              skipImmediate: true,
            }),
        },
      ],
    },
    {
      label: '次に再生',
      children: [
        {
          label: '通常再生',
          onClick: () => addSongsToQueue(args.selectedSongs, { nextToCurrent: true }),
        },
        {
          label: 'シャッフル再生',
          onClick: () =>
            addSongsToQueue(args.selectedSongs, { nextToCurrent: true, shuffle: true }),
        },
      ],
    },
    {
      label: '最後に再生',
      children: [
        {
          label: '通常再生',
          onClick: () => addSongsToQueue(args.selectedSongs),
        },
        {
          label: 'シャッフル再生',
          onClick: () => addSongsToQueue(args.selectedSongs, { shuffle: true }),
        },
      ],
      divided: true,
    },
    {
      label: 'ライブラリから削除',
      onClick: async () => {
        const isOk = await showNativeConfirm(
          true,
          '確認',
          `選択中の${args.selectedSongs.length}曲をライブラリから削除しますか？`
        );
        if (isOk) {
          await removeSongsFromLibrary(args.selectedSongs);
          toast.info('ライブラリから楽曲を削除しました。');
        }
      },
    },
  ];

  const getAlbumContextMenuItems = (args: ContextMenuArgs<'Album'>) => {
    const getAlbumSongIds = () => getAlbumSongs(args.album.id).map((song) => song.id);

    return [
      {
        label: 'キューをクリアして今すぐ再生',
        children: [
          {
            label: '通常再生',
            onClick: () => setQueue(getAlbumSongIds()),
          },
          {
            label: 'シャッフル再生',
            onClick: () => setQueue(getAlbumSongIds(), { shuffle: true }),
          },
        ],
      },
      {
        label: 'キューをクリアせずに今すぐ再生',
        children: [
          {
            label: '通常再生',
            onClick: () =>
              addSongsToQueue(getAlbumSongIds(), {
                nextToCurrent: true,
                skipImmediate: true,
              }),
          },
          {
            label: 'シャッフル再生',
            onClick: () =>
              addSongsToQueue(getAlbumSongIds(), {
                nextToCurrent: true,
                shuffle: true,
                skipImmediate: true,
              }),
          },
        ],
      },
      {
        label: '次に再生',
        children: [
          {
            label: '通常再生',
            onClick: () => addSongsToQueue(getAlbumSongIds(), { nextToCurrent: true }),
          },
          {
            label: 'シャッフル再生',
            onClick: () =>
              addSongsToQueue(getAlbumSongIds(), {
                nextToCurrent: true,
                shuffle: true,
              }),
          },
        ],
      },
      {
        label: '最後に再生',
        children: [
          {
            label: '通常再生',
            onClick: () => addSongsToQueue(getAlbumSongIds()),
          },
          {
            label: 'シャッフル再生',
            onClick: () => addSongsToQueue(getAlbumSongIds(), { shuffle: true }),
          },
        ],
        divided: true,
      },
      {
        label: 'ライブラリから削除',
        onClick: async () => {
          const isOk = await showNativeConfirm(
            true,
            '確認',
            `【${args.album.title}】の楽曲をライブラリから削除しますか？`
          );
          if (isOk) {
            await removeSongsFromLibrary(getAlbumSongIds());
            toast.info('ライブラリから楽曲を削除しました。');
          }
        },
      },
    ];
  };

  const getArtistContextMenuItems = (args: ContextMenuArgs<'Artist'>) => {
    const getArtistSongIds = () => getArtistSongs(args.artist.id).map((song) => song.id);

    return [
      {
        label: 'キューをクリアせずに今すぐ再生',
        children: [
          {
            label: '通常再生',
            onClick: () =>
              addSongsToQueue(getArtistSongIds(), { nextToCurrent: true, skipImmediate: true }),
          },
          {
            label: 'シャッフル再生',
            onClick: () =>
              addSongsToQueue(getArtistSongIds(), {
                nextToCurrent: true,
                shuffle: true,
                skipImmediate: true,
              }),
          },
        ],
      },
      {
        label: '次に再生',
        children: [
          {
            label: '通常再生',
            onClick: () => addSongsToQueue(getArtistSongIds(), { nextToCurrent: true }),
          },
          {
            label: 'シャッフル再生',
            onClick: () =>
              addSongsToQueue(getArtistSongIds(), { nextToCurrent: true, shuffle: true }),
          },
        ],
      },
      {
        label: '最後に再生',
        children: [
          {
            label: '通常再生',
            onClick: () => addSongsToQueue(getArtistSongIds()),
          },
          {
            label: 'シャッフル再生',
            onClick: () => addSongsToQueue(getArtistSongIds(), { shuffle: true }),
          },
        ],
        divided: true,
      },
      {
        label: 'ライブラリから削除',
        onClick: async () => {
          const isOk = await showNativeConfirm(
            true,
            '確認',
            `『${args.artist.name}』の楽曲をライブラリから削除しますか？`
          );
          if (isOk) {
            await removeSongsFromLibrary(getArtistSongIds());
            toast.info('ライブラリから楽曲を削除しました。');
          }
        },
      },
    ];
  };

  const show = (event: MouseEvent, args: ContextMenuArgs<T>) => {
    let items: MenuItem[] = [];

    switch (type) {
      case 'Song':
        items = getSongContextMenuItems(args as ContextMenuArgs<'Song'>);
        break;
      case 'Songs':
        items = getSongsContextMenuItems(args as ContextMenuArgs<'Songs'>);
        break;
      case 'Album':
        items = getAlbumContextMenuItems(args as ContextMenuArgs<'Album'>);
        break;
      case 'Artist':
        items = getArtistContextMenuItems(args as ContextMenuArgs<'Artist'>);
        break;
    }

    ContextMenu.showContextMenu({ x: event.x, y: event.y, items });
  };

  return { show };
};
