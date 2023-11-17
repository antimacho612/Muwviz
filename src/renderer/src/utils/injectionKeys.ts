import { Song } from '@shared/types';
import { InjectionKey } from 'vue';

export const showSongDetailModalKey: InjectionKey<(song: Song) => void> =
  Symbol('ShowSongDetalModal');

export const expandSidebarKey: InjectionKey<() => void> = Symbol('ExpandSidebar');

export const openSettingsModalKey: InjectionKey<() => void> = Symbol('OpenSettingsModal');
