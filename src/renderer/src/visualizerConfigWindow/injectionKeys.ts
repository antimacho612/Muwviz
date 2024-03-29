import { InjectionKey } from 'vue';
import { SubToMainMessage } from '@renderer/commonUtils/messagePort';

export const sendMessageToMainWindowKey: InjectionKey<(message: SubToMainMessage) => void> =
  Symbol('SendMessageToMainWindow');

export const openPresetModalKey: InjectionKey<() => void> = Symbol('OpenPresetModal');
