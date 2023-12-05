<script setup lang="ts">
import { useSettingsStore } from '@mainWindow/stores/settings';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';

const { appVersion, audioMotionAnalyzerVersion } = useSettingsStore();
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="アプリケーションのバージョン">
      <span>{{ appVersion }}</span>
    </BaseSettingsItem>

    <BaseSettingsItem title="audioMotion-analyzer (Visualizer)のバージョン">
      <span>{{ audioMotionAnalyzerVersion }}</span>
      <a target="_blank" href="https://audiomotion.dev/" class="ml-4">https://audiomotion.dev/</a>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>
