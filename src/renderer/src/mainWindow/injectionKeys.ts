import { InjectionKey } from 'vue';
import { AudioPlayer } from './core/audioPlayer';
import { MainToSubMessage } from '@renderer/commonUtils/messagePort';
import { Song } from '@shared/types';

export const audioPlayerKey: InjectionKey<AudioPlayer> = Symbol('AudioPlayer');

export const sendMessageToSubWindowKey: InjectionKey<(message: MainToSubMessage) => void> =
  Symbol('SendMessageToSubWindow');

export const showSongDetailModalKey: InjectionKey<(song: Song) => void> = Symbol('ShowSongDetailModal');

export const openSettingsModalKey: InjectionKey<() => void> = Symbol('OpenSettingsModal');

export const openLibraryEditModalKey: InjectionKey<() => void> = Symbol('OpenLibraryEditModalKey');
