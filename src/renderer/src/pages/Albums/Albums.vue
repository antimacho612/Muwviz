<script setup lang="ts">
import { useEntitiesStore } from '@renderer/stores/entities';

import PageHeader from '@renderer/components/PageHeader/PageHeader.vue';

const { albumList } = useEntitiesStore();
</script>

<template>
  <div class="albums-page">
    <PageHeader>
      <template #title>アルバム ({{ albumList.length }})</template>
      <template #actions></template>
    </PageHeader>

    <RouterView></RouterView>
  </div>
</template>

<style lang="scss" scoped>
.albums-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.page-header {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-title {
    font-weight: bold;
  }
}
</style>
