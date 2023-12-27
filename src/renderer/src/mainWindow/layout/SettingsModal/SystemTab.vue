<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@renderer/mainWindow/stores/settings';
import { SystemSettings } from '@shared/types';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import Switch from '@renderer/commonComponents/Switch/Switch.vue';

const settings = useSettingsStore();
const { showDesktopNotification } = storeToRefs(settings);

const onChangeValue = async <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) =>
  await settings.saveChange(key, value);
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="デスクトップ通知">
      <div class="flex align-items-center column-gap-3">
        <Switch
          v-model="showDesktopNotification"
          @change="onChangeValue('showDesktopNotification', showDesktopNotification)"
        />
        <span>{{ showDesktopNotification ? 'ON' : 'OFF' }}</span>
      </div>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>
