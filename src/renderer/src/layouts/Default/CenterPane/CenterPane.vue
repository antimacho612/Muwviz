<script setup lang="ts">
import Visualizer from './Visualizer.vue';
</script>

<template>
  <div class="center-pane">
    <div class="head">HEAD</div>
    <div class="visualizer-container">
      <Visualizer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-pane {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.head {
  height: 3.5rem;
  width: 100%;
}

.visualizer-container {
  position: relative;
  width: 100%;
  height: calc(100% - 3.5rem);
  border-radius: $borderRadiusLg;
  padding: 0.5rem;
}
</style>
