<script setup lang="ts">
import { useCssVar, useDark } from '@vueuse/core';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import InputText from '@renderer/components/base/InputText/InputText.vue';
import Radio from '@renderer/components/base/Radio/Radio.vue';

const fontFamily = useCssVar('--font-family', document.documentElement, {
  initialValue:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
});

const isDark = useDark();
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="フォント">
      <InputText v-model="fontFamily" size="sm" style="width: 80%"></InputText>
    </BaseSettingsItem>
    <BaseSettingsItem title="テーマ">
      <div class="theme-radios">
        <Radio v-model="isDark" name="theme" label="ライト" :value="false" />
        <Radio v-model="isDark" name="theme" label="ダーク" :value="true" />
      </div>
    </BaseSettingsItem>
    <BaseSettingsItem title="アクセントカラー">
      <input type="color" name="" id="" />
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style lang="scss" scoped>
.theme-radios {
  display: flex;
  gap: 2rem;
}
</style>
