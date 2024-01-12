<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@mainWindow/stores/settings';
import { sendMessageToSubWindowKey } from '@mainWindow/injectionKeys';
import { AppearanceSettings, DEFAULT_SETTINGS, KeyValue, UpdatableSettings } from '@shared/types';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import InputText from '@renderer/commonComponents/InputText/InputText.vue';
import Radio from '@renderer/commonComponents/Radio/Radio.vue';
import ColorPicker from '@renderer/commonComponents/ColorPicker/ColorPicker.vue';

const settings = useSettingsStore();
const { fontFamily, theme, primaryColor } = storeToRefs(settings);
const sendMessageToSubWindow = inject(sendMessageToSubWindowKey);

const onChangeValue = async <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
  sendMessageToSubWindow &&
    sendMessageToSubWindow({
      channel: 'changeAppearance',
      payload: { key, value } as KeyValue<AppearanceSettings>,
    });
  await settings.saveChange(key, value as UpdatableSettings[K]);
};
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem
      title="フォント"
      :description="`アプリケーション全体で使用するフォントを設定します。（デフォルト: ${DEFAULT_SETTINGS.fontFamily}）`"
    >
      <InputText v-model="fontFamily" size="sm" style="width: 75%" @change="onChangeValue('fontFamily', fontFamily)" />
    </BaseSettingsItem>

    <BaseSettingsItem
      title="テーマ"
      :description="`アプリケーションのテーマを設定します。（デフォルト: ${
        DEFAULT_SETTINGS.theme === 'Light' ? 'ライト' : 'ダーク'
      }）`"
    >
      <div class="flex" style="column-gap: 2rem">
        <Radio v-model="theme" name="theme" label="ライト" value="Light" @change="onChangeValue('theme', theme)" />
        <Radio v-model="theme" name="theme" label="ダーク" value="Dark" @change="onChangeValue('theme', theme)" />
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem
      title="プライマリーカラー"
      :description="`アプリケーション全体で使用するプライマリカラーを選択してください。\n※LighterカラーとLightestカラーはプライマリーカラーから自動で生成されます。`"
    >
      <div class="flex align-items-center" style="gap: 3rem">
        <ColorPicker
          v-model="primaryColor"
          class="primary-color-picker"
          @update:model-value="onChangeValue('primaryColor', primaryColor)"
        />

        <div
          class="flex align-items-center border-radius-lg column-gap-3"
          style="padding: 0.75rem 1.5rem; border: 1px solid var(--divider-color)"
        >
          <div class="flex-shrink-0">プレビュー</div>
          <div class="flex flex-wrap align-items-center column-gap-3 row-gap-2">
            <div class="flex align-items-center column-gap-3">
              <div class="preview-swatch" style="background: var(--primary-color)" />
              <span style="color: var(--primary-color)">Primary</span>
            </div>

            <div class="flex align-items-center column-gap-3">
              <div class="preview-swatch" style="background: var(--primary-color--lighter)" />
              <span style="color: var(--primary-color--lighter)">Lighter</span>
            </div>

            <div class="flex align-items-center column-gap-3">
              <div class="preview-swatch" style="background: var(--primary-color--lightest)" />
              <span style="color: var(--primary-color--lightest)">Lightest</span>
            </div>
          </div>
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
  flex-shrink: 0;
  margin-left: 1rem;
  height: 2rem;
  width: 2rem;
  border-radius: $borderRadiusFull;
}
</style>
