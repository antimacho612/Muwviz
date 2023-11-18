import { InjectionKey } from 'vue';
import { Song } from '@shared/types';

export const showSongDetailModalKey: InjectionKey<(song: Song) => void> =
  Symbol('ShowSongDetalModal');

export const expandSidebarKey: InjectionKey<() => void> = Symbol('ExpandSidebar');

export const openSettingsModalKey: InjectionKey<() => void> = Symbol('OpenSettingsModal');
