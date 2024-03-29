<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { sendMessageToSubWindowKey } from './injectionKeys';
import { useSettingsStore } from '@mainWindow/stores/settings';
import { useAppearance } from '@renderer/commonComposables/useAppearance';
import { useWindowStore } from '@mainWindow/stores/window';
import { useIpcEventHandler } from '@mainWindow/composables/useIpcEventHandler';
import { useKeyboardHotKeys } from './composables/useKeyboardHotKeys';

import Titlebar from '@renderer/commonComponents/Titlebar/Titlebar.vue';

const { fontFamily, theme, primaryColor } = storeToRefs(useSettingsStore());
useAppearance(fontFamily, theme, primaryColor);

useIpcEventHandler();

useKeyboardHotKeys();

const sendMessageToSubWindow = inject(sendMessageToSubWindowKey);

const { isWindowMaximized } = storeToRefs(useWindowStore());
const onClickMinimizeButton = async () => await window.electron.invoke.minimizeWindow(true);
const onClickMaximizeButton = async () => await window.electron.invoke.maximizeWindow(true);
const onClickCloseButton = async () => {
  sendMessageToSubWindow && sendMessageToSubWindow({ channel: 'closeWindow' });
  await window.electron.invoke.closeWindow(true);
};
</script>

<template>
  <Titlebar
    :is-window-maximized="isWindowMaximized"
    @click-minimize-button="onClickMinimizeButton"
    @click-maximize-button="onClickMaximizeButton"
    @click-close-button="onClickCloseButton"
  ></Titlebar>
  <RouterView></RouterView>
</template>
