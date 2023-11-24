<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
  title: '',
});
</script>

<template>
  <div class="settings-item">
    <h4 class="settings-item-title">{{ title }}</h4>

    <div class="settings-item-main">
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
</style>

<style>
.settings-item + .settings-item {
  margin-top: 1.5rem;
}
</style>
