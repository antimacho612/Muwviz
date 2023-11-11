import ContextMenu, { MenuItem } from '@imengyu/vue3-context-menu';
import { Song } from '@shared/types';
import { inject, onMounted } from 'vue';

export type ContextMenuType = 'SONG' | 'SONGS';

export type ContextMenuArgs<T extends ContextMenuType> = T extends 'SONG'
  ? {
      song: Song;
    }
  : {
      selectedSongs: ReadonlySet<string>;
    };

export const useContextMenu = <T extends ContextMenuType>(type: T) => {
  let showSongDetailModal: (song: Song) => void | undefined;

  onMounted(() => {
    if (type === 'SONG') {
      showSongDetailModal = inject('showSongDetailModal') as (song: Song) => void;
    }
  });

  const show = (event: MouseEvent, args: ContextMenuArgs<T>) => {
    let items: MenuItem[] = [];

    switch (type) {
      case 'SONG':
        items = [
          {
            label: '詳細情報',
            onClick: () => {
              // FIXME: asを使用しないように変更したい
              showSongDetailModal((args as ContextMenuArgs<'SONG'>).song);
            },
          },
        ];
        break;
      case 'SONGS':
        items = [
          {
            label: '追加',
            onClick: () => {
              alert((args as ContextMenuArgs<'SONGS'>).selectedSongs.size + ' songs are selected.');
            },
          },
        ];
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

// const s = useContextMenu('SONG');
// s.show(new MouseEvent(), { songId: 'sss' });
