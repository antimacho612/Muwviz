<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
  title: '',
});
</script>

<template>
  <div class="settings-item">
    <h4 class="title">{{ title }}</h4>
    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-item {
  .title {
    font-size: map-get($fontSizes, lg);
    margin-bottom: 0.5rem;
  }

  .main {
    position: relative;
    padding: 1rem 3rem;

    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 1px;
      top: 0;
      left: 1.5rem;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<style>
.settings-item + .settings-item {
  margin-top: 1.5rem;
}
</style>
