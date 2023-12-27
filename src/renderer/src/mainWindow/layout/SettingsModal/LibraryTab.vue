<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { openLibraryEditModalKey } from '@mainWindow/injectionKeys';
import { useSettingsStore } from '@mainWindow/stores/settings';
import { showNativeConfirm } from '@renderer/commonUtils';
import { LibrarySettings } from '@shared/types';

import Button from '@renderer/commonComponents/Button/Button.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import { useToast } from 'vue-toastification';
import { useLibraryManager } from '@renderer/mainWindow/core/libraryManager';

const settings = useSettingsStore();

const { scannedFolders, artworkPath, waveformPath, cacheWaveformData } = storeToRefs(settings);

const openSettingsModal = inject(openLibraryEditModalKey);

const { initializeLibrary } = useLibraryManager();
const toast = useToast();
const onClickInitializeLibraryButton = async () => {
  const isOk = await showNativeConfirm(
    true,
    '確認',
    'ライブラリを初期化してよろしいですか？\n※全楽曲および関連情報（アートワーク、歌詞、波形データ）がアプリケーションから削除されます。'
  );
  if (isOk) {
    await initializeLibrary();
    toast.info('ライブラリを初期化しました。');
  }
};

const onClickOpenArtworkDirButton = async () =>
  await window.electron.invoke.openPath(artworkPath.value);

const onClickOpenWaveformDirButton = async () =>
  await window.electron.invoke.openPath(waveformPath.value);

const onChangeValue = async <K extends keyof LibrarySettings>(key: K, value: LibrarySettings[K]) =>
  await settings.saveChange(key, value);
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem
      title="スキャン済みフォルダ"
      :description="`フォルダのスキャン履歴が下記に表示されます。\n追加でフォルダをスキャンする場合は、「フォルダを追加...」ボタンを押してください。`"
    >
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

      <div class="flex align-items-center justify-content-center mt-4 gap-8">
        <Button size="sm" @click="openSettingsModal">フォルダを追加...</Button>
        <Button size="xs" class="initialize-library-button" @click="onClickInitializeLibraryButton">
          ライブラリを初期化
        </Button>
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem
      title="アートワークの保存場所"
      description="スキャンした楽曲のアートワークが保存されているフォルダです。"
    >
      <div class="flex align-items-center justify-content-between column-gap-1">
        <span class="artwork-dir">{{ artworkPath }}</span>
        <Button size="sm" class="flex-shrink-0" @click="onClickOpenArtworkDirButton">
          フォルダを開く
        </Button>
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem
      title="波形データのキャッシュ"
      :description="`楽曲の再生時に生成した波形データ（アプリケーション下部のシークバー）をキャッシュするかどうかを設定します。\n※キャッシュしない場合、楽曲を再生してから波形が表示されるまで少し時間がかかります。`"
    >
      <div class="flex align-items-center column-gap-3">
        <Switch
          v-model="cacheWaveformData"
          @change="onChangeValue('cacheWaveformData', cacheWaveformData)"
        />
        <span>{{ cacheWaveformData ? 'ON' : 'OFF' }}</span>
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem
      title="波形データの保存場所"
      description="波形データが保存されているフォルダです。"
    >
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

.initialize-library-button {
  --ripple-color: rgba(255, 0, 0, 0.3);
  color: red !important;
}

.artwork-dir,
.waveform-dir {
  @include singleLineClamp;
}
</style>
