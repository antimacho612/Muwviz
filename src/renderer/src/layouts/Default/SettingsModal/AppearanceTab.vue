<script setup lang="ts">
import { reactive, unref, watchEffect } from 'vue';
import { useSettingsStore } from '@renderer/stores/settings';
import { storeToRefs } from 'pinia';

import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import InputText from '@renderer/components/base/InputText/InputText.vue';
import Radio from '@renderer/components/base/Radio/Radio.vue';
import { Settings } from '@shared/types';

const settings = useSettingsStore();
const { fontFamily, theme, primaryColor } = storeToRefs(settings);

const items = reactive({
  fontFamily: {
    initialValue: unref(fontFamily),
    refValue: fontFamily,
  },
  theme: {
    initialValue: unref(theme),
    refValue: theme,
  },
  primaryColor: {
    initialValue: unref(primaryColor),
    refValue: primaryColor,
  },
});

const changedItemKeys: Set<keyof Settings> = new Set();

watchEffect(async () => {
  Object.keys(items).forEach((key) => {
    if (items[key].initialValue !== items[key].refValue.value) {
      changedItemKeys.add(key as keyof Settings);
    } else {
      changedItemKeys.delete(key as keyof Settings);
    }
  });

  if (changedItemKeys.size) {
    await settings.saveChanges(changedItemKeys);
  }
});
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="フォント">
      <InputText v-model="items.fontFamily.refValue" size="sm" style="width: 75%"></InputText>
    </BaseSettingsItem>

    <BaseSettingsItem title="テーマ">
      <div class="flex" style="column-gap: 2rem">
        <Radio v-model="items.theme.refValue" name="theme" label="ライト" value="Light" />
        <Radio v-model="items.theme.refValue" name="theme" label="ダーク" value="Dark" />
      </div>
    </BaseSettingsItem>

    <BaseSettingsItem title="プライマリーカラー">
      <div class="flex align-items-center" style="gap: 3rem">
        <input v-model="items.primaryColor.refValue" type="color" class="primary-color-picker" />

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
