<script setup lang="ts">
import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
import Button from '@renderer/components/base/Button/Button.vue';
import InputText from '@renderer/components/base/InputText/InputText.vue';

const onClick = async () => {
  await window.electronAPI.invoke.openPath('D:\\');
};
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="曲のフォルダ">
      <table class="path-table">
        <thead>
          <tr>
            <th style="text-align: left">パス</th>
            <th style="width: 10rem">曲数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>D:\hogehogenroibnaepoinairgnpeaoirbreoain</td>
            <td style="text-align: right">1,128</td>
          </tr>
        </tbody>
      </table>
      <Button size="sm" style="display: flex; margin: 1.5rem auto 0; width: 50%">変更...</Button>
    </BaseSettingsItem>
    <BaseSettingsItem title="アートワークの保存場所">
      <InputText size="sm" :readonly="true" style="width: 80%"></InputText>
      <Button size="sm" @click="onClick">open</Button>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style lang="scss" scoped>
.path-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.5rem 1rem;
  }

  th {
    color: var(--secondary-text-color);
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }

  td {
    font-weight: 500;
  }
}
</style>
