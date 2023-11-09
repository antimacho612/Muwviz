import ContextMenu, { MenuItem } from '@imengyu/vue3-context-menu';
import { Song } from '@shared/types';

export type ContextMenuArgs<T extends 'SONGS'> = T extends 'SONG'
  ? {
      exclude?: string;
      refreshCallback?: () => void;
      songs: Song[];
      isRemote?: boolean;
    }
  : {
      exclude?: string;
      refreshCallback?: () => void;
      songs: Song[];
      isRemote?: boolean;
    };

export const getContextMenu = async <T>(
  event: MouseEvent,
  type: T
  // options: ContextMenuArgs<T>
) => {
  let items: MenuItem[] = [];

  switch (type) {
    case 'SONG':
      items = [
        {
          label: 'A menu item',
          onClick: () => {
            alert('You click a menu item');
          },
        },
        {
          label: 'A submenu',
          children: [{ label: 'Item1' }, { label: 'Item2' }, { label: 'Item3' }],
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
