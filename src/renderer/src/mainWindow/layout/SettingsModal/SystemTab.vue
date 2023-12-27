<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@renderer/mainWindow/stores/settings';
import { SystemSettings } from '@shared/types';

import Button from '@renderer/commonComponents/Button/Button.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';
import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import { showNativeConfirm } from '@renderer/commonUtils';

const settings = useSettingsStore();
const { showDesktopNotification } = storeToRefs(settings);

const onChangeValue = async <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) =>
  await settings.saveChange(key, value);

const onClickInitializeApplicationButton = async () => {
  const isOk = await showNativeConfirm(
    true,
    '確認',
    'アプリケーションを初期化してもよろしいですか？\n※ライブラリ、ビジュアライザー、その他設定がすべて初期状態に戻ります。\n※初期化後、アプリケーションが再起動します。'
  );
  if (isOk) {
    await window.electron.invoke.initializeApp();
    await window.electron.invoke.relaunchApp();
  }
};
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem
      title="デスクトップ通知"
      description="デスクトップ通知を表示するかどうかを設定します。"
    >
      <div class="flex align-items-center column-gap-3">
        <Switch
          v-model="showDesktopNotification"
          @change="onChangeValue('showDesktopNotification', showDesktopNotification)"
        />
        <span>{{ showDesktopNotification ? 'ON' : 'OFF' }}</span>
      </div>
    </BaseSettingsItem>

    <div class="w-full mt-4 text-center">
      <Button
        size="xs"
        class="initialize-application-button"
        @click="onClickInitializeApplicationButton"
      >
        アプリケーションを初期化
      </Button>
    </div>
  </BaseSettingsTabPanel>
</template>

<style scoped>
.initialize-application-button {
  --ripple-color: rgba(255, 0, 0, 0.3);
  color: red !important;
}
</style>
