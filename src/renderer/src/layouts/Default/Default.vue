<script setup lang="ts">
import LeftSidePane from './LeftSidePane/LeftSidePane.vue';
import CenterPane from './CenterPane/CenterPane.vue';
import RightSidePane from './RightSidePane/RightSidePane.vue';
import ControlsPane from './ControlsPane/ControlsPane.vue';
</script>

<template>
  <div class="layout">
    <div class="layout-left">
      <LeftSidePane />
    </div>

    <div class="layout-center">
      <CenterPane />
    </div>

    <div class="layout-right">
      <RightSidePane />
    </div>

    <div class="layout-bottom">
      <ControlsPane />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  display: grid;
  grid-template:
    'left   center right ' 1fr
    'bottom bottom bottom' $bottomHeight
    / #{$sidebarCollapsedWidth + 1rem} 1fr 360px;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.layout-left {
  grid-area: left;
  position: relative;
  height: calc(100vh - $titleBarHeight - $bottomHeight);
  padding: 0.5rem;
  z-index: 1;
}

.layout-center {
  grid-area: center;
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.layout-bottom {
  grid-area: bottom;
  position: relative;
  padding: 0 0.5rem 0.5rem;
  z-index: 2;
}

.layout-right {
  grid-area: right;
  padding: 0.5rem;
}
</style>
