<script setup lang="ts">
defineProps<{ itemName: string }>();
</script>

<template>
  <div class="config-item">
    <span class="config-item-name">{{ itemName }}</span>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.config-item {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.config-item-name {
  font-size: map-get($map: $fontSizes, $key: sm);
  font-weight: bold;
}
</style>
