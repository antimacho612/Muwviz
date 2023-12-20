<script setup lang="ts">
import { inject } from 'vue';
import { openSettingsModalKey } from '@mainWindow/injectionKeys';

import SettingsIcon from '@renderer/assets/icons/settings.svg?component';
import Visualizers from './Visualizers.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import EntitiesSearchWidget from './EntitiesSearchWidget/EntitiesSearchWidget.vue';

const openSettingsModal = inject(openSettingsModalKey);
const onClickOpenSettingsButton = () => openSettingsModal?.();
</script>

<template>
  <div class="center-pane">
    <div class="head">
      <EntitiesSearchWidget />
      <Button text :icon="SettingsIcon" title="設定" @click="onClickOpenSettingsButton" />
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
