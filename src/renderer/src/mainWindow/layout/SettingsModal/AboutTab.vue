<script setup lang="ts">
import { useSettingsStore } from '@mainWindow/stores/settings';

import Logo from '@renderer/assets/icons/logo.svg?component';
import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';

const { appVersion, audioMotionAnalyzerVersion } = useSettingsStore();
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="アプリケーションのバージョン">
      <div class="flex align-items-center column-gap-2">
        <Logo class="h-2rem w-2rem" />
        <span class="font-bold text-lg">{{ appVersion }}</span>
      </div>
      <div class="mt-4">
        バグ報告・ご意見・ご要望などはGitHubのIssuesまでお願いします👇
        <br />
        <a target="_blank" href="https://github.com/antimacho612/Muwviz/issues/new/choose" class="external-link">
          https://github.com/antimacho612/Muwviz/issues/new/choose
        </a>
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem title="audioMotion-analyzer (Visualizer)のバージョン">
      <span class="font-bold text-lg">{{ audioMotionAnalyzerVersion }}</span>
      <a target="_blank" href="https://audiomotion.dev/" class="external-link ml-4"> https://audiomotion.dev/ </a>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style scoped>
.external-link {
  color: var(--primary-color);
}
</style>
