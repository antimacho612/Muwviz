<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useWindowStore } from '@renderer/mainWindow/stores/window';
import { useToast } from 'vue-toastification';
import { showNativeConfirm } from '@renderer/commonUtils';
import { openSettingsModalKey } from '@mainWindow/injectionKeys';

import SettingsIcon from '@renderer/assets/icons/settings.svg?component';
import DownloadIcon from '@renderer/assets/icons/download.svg?component';
import Visualizers from './Visualizers.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import EntitiesSearchWidget from './EntitiesSearchWidget/EntitiesSearchWidget.vue';

const openSettingsModal = inject(openSettingsModalKey);
const onClickOpenSettingsButton = () => openSettingsModal?.();

const { isUpdateAvailable } = storeToRefs(useWindowStore());
const toast = useToast();
const onClickUpdateAppButton = async () => {
  const isOk = await showNativeConfirm(true, '確認', 'アプリケーションをアップデートしますか？');
  if (!isOk) return;

  try {
    await window.electron.invoke.updateApp();
  } catch (e) {
    toast.error('アプリケーションのアップデートに失敗しました。');
    console.error(e);
  }
};
</script>

<template>
  <div class="center-pane">
    <div class="head">
      <EntitiesSearchWidget />
      <div>
        <Button
          v-if="isUpdateAvailable"
          text
          :icon="DownloadIcon"
          title="アプリケーションをアップデートする"
          @click="onClickUpdateAppButton"
        />
        <Button text :icon="SettingsIcon" title="設定" @click="onClickOpenSettingsButton" />
      </div>
    </div>
    <div class="main">
      <Visualizers />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-pane {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.head {
  height: $centerPaneHeaderHeight;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main {
  width: 100%;
  height: calc(100% - $centerPaneHeaderHeight);
  border-radius: $borderRadiusLg;
}
</style>
