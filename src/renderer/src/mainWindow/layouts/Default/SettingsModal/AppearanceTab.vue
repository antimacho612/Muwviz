<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@mainWindow/stores/settings';
import { sendMessageToSubWindowKey } from '@renderer/mainWindow/injectionKeys';
import { AppearanceSettings, KeyValue } from '@shared/types';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import InputText from '@renderer/commonComponents/InputText/InputText.vue';
import Radio from '@renderer/commonComponents/Radio/Radio.vue';
import ColorPicker from '@renderer/commonComponents/ColorPicker/ColorPicker.vue';

const settings = useSettingsStore();
const { fontFamily, theme, primaryColor } = storeToRefs(settings);

const sendMessageToSubWindow = inject(sendMessageToSubWindowKey);
const onChangeInputValue = async <K extends keyof AppearanceSettings>(
  key: K,
  value: AppearanceSettings[K]
) => {
  sendMessageToSubWindow &&
    sendMessageToSubWindow({
      channel: 'changeAppearance',
      payload: { key, value } as KeyValue<AppearanceSettings>,
    });
  await settings.saveChanges(new Set([key]));
};
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="フォント">
      <InputText
        v-model="fontFamily"
        size="sm"
        style="width: 75%"
        @change="onChangeInputValue('fontFamily', fontFamily)"
      ></InputText>
    </BaseSettingsItem>

    <BaseSettingsItem title="テーマ">
      <div class="flex" style="column-gap: 2rem">
        <Radio
          v-model="theme"
          name="theme"
          label="ライト"
          value="Light"
          @update:model-value="onChangeInputValue('theme', theme)"
        />
        <Radio
          v-model="theme"
          name="theme"
          label="ダーク"
          value="Dark"
          @update:model-value="onChangeInputValue('theme', theme)"
        />
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem title="プライマリーカラー">
      <div class="flex align-items-center" style="gap: 3rem">
        <ColorPicker
          v-model="primaryColor"
          class="primary-color-picker"
          @update:model-value="onChangeInputValue('primaryColor', primaryColor)"
        />

        <div
          class="flex align-items-center border-radius-lg column-gap-3"
          style="padding: 0.75rem 1.5rem; border: 1px solid var(--divider-color)"
        >
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

.preview-swatch {
  margin-left: 1rem;
  height: 2rem;
  width: 2rem;
  border-radius: $borderRadiusFull;
}
</style>
