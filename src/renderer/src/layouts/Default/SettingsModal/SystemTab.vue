<script setup lang="ts">
import { ref } from 'vue';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import ToggleButton from '@renderer/components/base/ToggleButton/ToggleButton.vue';

const onOff = ref(false);
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="デスクトップ通知">
      <div class="flex align-items-center column-gap-3">
        <ToggleButton v-model="onOff" />
        <span>{{ onOff ? 'ON' : 'OFF' }}</span>
      </div>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>
