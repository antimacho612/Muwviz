<script setup lang="ts">
import BaseSettingsTabPanel from './BaseSettingsTabPanel.vue';
import BaseSettingsItem from './BaseSettingsItem.vue';
</script>

<template>
  <BaseSettingsTabPanel>
    <BaseSettingsItem title="ホットキー">
      <div class="overflow-auto">
        <table class="hot-key-table">
          <thead>
            <tr>
              <th class="text-left">アクション</th>
              <th class="w-15rem text-center">キー</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>楽曲の再生／停止</td>
              <td class="text-center"><span class="key">Space</span></td>
            </tr>
            <tr>
              <td>前の楽曲</td>
              <td class="text-center">
                <span class="key">Alt</span>
                +
                <span class="key">←</span>
              </td>
            </tr>
            <tr>
              <td>次の楽曲</td>
              <td class="text-center">
                <span class="key">Alt</span>
                +
                <span class="key">→</span>
              </td>
            </tr>
            <tr>
              <td>5秒巻き戻し</td>
              <td class="text-center">
                <span class="key">Shift</span>
                +
                <span class="key">←</span>
              </td>
            </tr>
            <tr>
              <td>5秒早送り</td>
              <td class="text-center">
                <span class="key">Shift</span>
                +
                <span class="key">→</span>
              </td>
            </tr>
            <tr>
              <td>ミュート／ミュート解除</td>
              <td class="text-center"><span class="key">M</span></td>
            </tr>
            <tr>
              <td>リピートモード切替</td>
              <td class="text-center"><span class="key">R</span></td>
            </tr>
            <tr>
              <td>画面リロード</td>
              <td class="text-center"><span class="key">F5</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseSettingsItem>
  </BaseSettingsTabPanel>
</template>

<style scoped lang="scss">
.hot-key-table {
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

.key {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  min-width: 2rem;
  font-size: map-get($fontSizes, sm);
  color: white;
  background: #3d3d3d;
  border-radius: 5px;
}
</style>
