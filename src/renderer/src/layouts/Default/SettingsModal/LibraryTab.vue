<script setup lang="ts">
import { inject } from 'vue';
import { useSettingsStore } from '@renderer/stores/settings';
import { openLibraryEditModalKey } from '@renderer/utils/injectionKeys';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import Button from '@renderer/components/base/Button/Button.vue';

const settings = useSettingsStore();

const openSettingsModal = inject(openLibraryEditModalKey);

const openArtworkDir = async () => {
  await window.electronAPI.invoke.openPath(settings.artworkPath);
};
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="曲のフォルダ">
      <table class="path-table">
        <thead>
          <tr>
            <th style="text-align: left">パス</th>
            <th style="width: 10rem">曲数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>D:\hogehogenroibnaepoinairgnpeaoirbreoain</td>
            <td style="text-align: right">1,128</td>
          </tr>
        </tbody>
      </table>
      <Button
        size="sm"
        style="display: flex; margin: 1.5rem auto 0; width: 50%"
        @click="openSettingsModal"
      >
        変更...
      </Button>
    </BaseSettingsItem>

    <BaseSettingsItem title="アートワークの保存場所">
      <div class="flex align-items-center justify-content-between column-gap-1">
        <span class="artwork-dir">{{ settings.artworkPath }}</span>
        <Button size="sm" class="flex-shrink-0" @click="openArtworkDir">フォルダを開く</Button>
      </div>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style lang="scss" scoped>
.path-table {
  width: 100%;
  border-spacing: 0;

  th,
  td {
    padding: 0.5rem 1rem;
  }

  th {
    color: var(--secondary-text-color);
    border-bottom: 2px solid var(--divider-color);
  }
}

.artwork-dir {
  @include singleLineClamp;
}
</style>
