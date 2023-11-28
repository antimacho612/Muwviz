import { InjectionKey } from 'vue';
import { Song } from '@shared/types';

export const showSongDetailModalKey: InjectionKey<(song: Song) => void> =
  Symbol('ShowSongDetalModal');

export const openSettingsModalKey: InjectionKey<() => void> = Symbol('OpenSettingsModal');

export const openLibraryEditModalKey: InjectionKey<() => void> = Symbol('OpenLibraryEditModalKey');
