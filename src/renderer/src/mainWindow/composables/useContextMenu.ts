import { inject } from 'vue';
import ContextMenu, { MenuItem } from '@imengyu/vue3-context-menu';
import { useToast } from 'vue-toastification';
import { showSongDetailModalKey } from '@mainWindow/injectionKeys';
import { useAudioPlayer } from './useAudioPlayer';
import { useLibraryManager } from '../core/libraryManager';
import { Song } from '@shared/types';
import { showNativeConfirm } from '@renderer/commonUtils';

export type ContextMenuType = 'Song' | 'Songs';

export type ContextMenuArgs<T extends ContextMenuType> = T extends 'Song'
  ? {
      song: Song;
    }
  : {
      selectedSongs: ReadonlyArray<string>;
    };

const toast = useToast();

export const useContextMenu = <T extends ContextMenuType>(type: T) => {
  const { setQueue } = useAudioPlayer();
  const showSongDetailModal = inject(showSongDetailModalKey);
  const { removeSongsFromLibrary } = useLibraryManager();

  const getSongContextMenuItems = (args: ContextMenuArgs<'Song'>) => [
    {
      label: 'キューをクリアして今すぐ再生',
      onClick: () => setQueue([args.song.id]),
    },
    {
      label: 'キューをクリアせずに今すぐ再生',
      onClick: () => {
        // TODO: 未実装
      },
    },
    {
      label: '次に再生',
      onClick: () => {
        // TODO: 未実装
      },
    },
    {
      label: '最後に再生',
      onClick: () => {
        // TODO: 未実装
      },
      divided: true,
    },
    {
      label: 'ライブラリから削除',
      onClick: async () => {
        const isOk = await showNativeConfirm(
          true,
          '確認',
          `【${args.song.title}】をライブラリから削除しますか？`
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
          onClick: () => {
            setQueue(args.selectedSongs);
          },
        },
        {
          label: 'シャッフル再生',
          onClick: () => {
            setQueue(args.selectedSongs, { shuffle: true, firstSongIndex: -1 });
          },
        },
      ],
    },
    {
      label: 'キューをクリアせずに今すぐ再生',
      children: [
        {
          label: '通常再生',
          onClick: () => {
            // TODO: 未実装
          },
        },
        {
          label: 'シャッフル再生',
          onClick: () => {
            // TODO: 未実装
          },
        },
      ],
    },
    {
      label: '次に再生',
      children: [
        {
          label: '通常再生',
          onClick: () => {
            // TODO: 未実装
          },
        },
        {
          label: 'シャッフル再生',
          onClick: () => {
            // TODO: 未実装
          },
        },
      ],
    },
    {
      label: '最後に再生',
      children: [
        {
          label: '通常再生',
          onClick: () => {
            // TODO: 未実装
          },
        },
        {
          label: 'シャッフル再生',
          onClick: () => {
            // TODO: 未実装
          },
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
          await removeSongsFromLibrary([...args.selectedSongs]);
          toast.info('ライブラリから楽曲を削除しました。');
        }
      },
    },
  ];

  const show = (event: MouseEvent, args: ContextMenuArgs<T>) => {
    let items: MenuItem[] = [];

    switch (type) {
      case 'Song':
        items = getSongContextMenuItems(args as ContextMenuArgs<'Song'>);
        break;
      case 'Songs':
        items = getSongsContextMenuItems(args as ContextMenuArgs<'Songs'>);
        break;
    }

    ContextMenu.showContextMenu({
      x: event.x,
      y: event.y,
      items,
    });
  };

  return {
    show,
  };
};
