<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}
withDefaults(defineProps<Props>(), { title: '', description: '' });
</script>

<template>
  <div class="settings-item">
    <h4 class="settings-item-title">{{ title }}</h4>
    <div class="settings-item-main">
      <div v-if="description" class="settings-item-description">{{ description }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-item {
  width: 100%;
  overflow: hidden;
}

.settings-item-title {
  font-size: map-get($map: $fontSizes, $key: lg);
  margin-bottom: 0.5rem;
}

.settings-item-main {
  position: relative;
  padding: 1rem 3rem;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    left: 1.5rem;
    background: var(--divider-color);
  }
}

.settings-item-description {
  font-size: map-get($fontSizes, sm);
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
  white-space: pre-line;
}
</style>

<style>
.settings-item + .settings-item {
  margin-top: 1.5rem;
}
</style>
