<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { openLibraryEditModalKey } from '@mainWindow/injectionKeys';
import { useSettingsStore } from '@mainWindow/stores/settings';

import Button from '@renderer/commonComponents/Button/Button.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import { LibrarySettings } from '@shared/types';

const settings = useSettingsStore();
const { scannedFolders, artworkPath, waveformPath, cacheWaveformData } = storeToRefs(settings);

const openSettingsModal = inject(openLibraryEditModalKey);

const onClickOpenArtworkDirButton = async () =>
  await window.electron.invoke.openPath(artworkPath.value);

const onClickOpenWaveformDirButton = async () =>
  await window.electron.invoke.openPath(waveformPath.value);

const onChangeValue = async <K extends keyof LibrarySettings>(key: K, value: LibrarySettings[K]) =>
  await settings.saveChange(key, value);
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="スキャン済みフォルダ">
      <div class="max-h-15rem overflow-auto">
        <table class="scanned-folders-table">
          <thead>
            <tr>
              <th class="text-left">パス</th>
              <th class="w-10rem">曲数</th>
              <th class="w-12rem text-center">スキャン日</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="folder in scannedFolders" :key="folder.id">
              <td>{{ folder.path }}</td>
              <td class="text-right">{{ folder.scannedSongsCount.toLocaleString() }}</td>
              <td class="text-center">{{ new Date(folder.scannedAt).toLocaleString('ja') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button size="sm" class="add-folder-button" @click="openSettingsModal">
        フォルダを追加...
      </Button>
    </BaseSettingsItem>

    <BaseSettingsItem title="アートワークの保存場所">
      <div class="flex align-items-center justify-content-between column-gap-1">
        <span class="artwork-dir">{{ artworkPath }}</span>
        <Button size="sm" class="flex-shrink-0" @click="onClickOpenArtworkDirButton">
          フォルダを開く
        </Button>
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem title="波形データのキャッシュ">
      <div class="flex align-items-center column-gap-3">
        <Switch
          v-model="cacheWaveformData"
          @change="onChangeValue('cacheWaveformData', cacheWaveformData)"
        />
        <span>{{ cacheWaveformData ? 'ON' : 'OFF' }}</span>
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem title="波形データの保存場所">
      <div class="flex align-items-center justify-content-between column-gap-1">
        <span class="waveform-dir">{{ waveformPath }}</span>
        <Button size="sm" class="flex-shrink-0" @click="onClickOpenWaveformDirButton">
          フォルダを開く
        </Button>
      </div>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style lang="scss" scoped>
.scanned-folders-table {
  width: 100%;
  max-height: 20rem;
  border-spacing: 0;

  th {
    position: sticky;
    top: 0;
    left: 0;
    padding: 0.5rem;
    color: var(--secondary-text-color);
    background: var(--background-color);
    border-bottom: 2px solid var(--divider-color);
  }

  td {
    padding: 0.25rem 0.5rem;
  }
}

.add-folder-button {
  display: flex;
  width: 50%;
  margin: 2rem auto 0;
}

.artwork-dir,
.waveform-dir {
  @include singleLineClamp;
}
</style>
