<script setup lang="ts">
import { useSettingsStore } from '@renderer/stores/settings';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import InputText from '@renderer/components/base/InputText/InputText.vue';
import Radio from '@renderer/components/base/Radio/Radio.vue';
import { storeToRefs } from 'pinia';

const { fontFamily, theme, primaryColor } = storeToRefs(useSettingsStore());
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="フォント">
      <InputText v-model="fontFamily" size="sm" style="width: 80%"></InputText>
    </BaseSettingsItem>
    <BaseSettingsItem title="テーマ">
      <div class="theme-radios">
        <Radio v-model="theme" name="theme" label="ライト" value="Light" />
        <Radio v-model="theme" name="theme" label="ダーク" value="Dark" />
      </div>
    </BaseSettingsItem>
    <BaseSettingsItem title="プライマリーカラー">
      <div class="primary-color">
        <input v-model="primaryColor" type="color" class="primary-color-picker" />
        <div class="primary-color-preview">
          プレビュー
          <div class="preview-swatch" style="background: var(--primary-color)" />
          <span style="color: var(--primary-color)">Primary</span>
          <div class="preview-swatch" style="background: var(--primary-color--lighter)" />
          <span style="color: var(--primary-color--lighter)">Lighter</span>
          <div class="preview-swatch" style="background: var(--primary-color--lightest)" />
          <span style="color: var(--primary-color--lightest)">Lightest</span>
        </div>
      </div>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style lang="scss" scoped>
.theme-radios {
  display: flex;
  gap: 2rem;
}

.primary-color {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.primary-color-picker {
  appearance: none;
  background-color: transparent;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    border-radius: 50%;
    padding: 5px;
    background: var(--color-swatch-wrapper-color);
  }

  &::-webkit-color-swatch {
    border-radius: 50%;
  }
}

.primary-color-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: $borderRadiusLg;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.preview-swatch {
  margin-left: 1rem;
  height: 2rem;
  width: 2rem;
  border-radius: $borderRadiusFull;
}
</style>
