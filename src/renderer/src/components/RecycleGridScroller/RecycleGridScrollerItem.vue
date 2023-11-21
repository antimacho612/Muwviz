<script setup lang="ts">
const emits = defineEmits<{
  click: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
}>();
</script>

<template>
  <div
    v-ripple
    class="grid-item"
    @click="emits('click', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.grid-item {
  position: relative;
  height: 100%;
  border-radius: $borderRadiusLg;
  cursor: pointer;
  transition: box-shadow $transitionDuration;
}

.vue-recycle-scroller__item-view.hover .grid-item {
  box-shadow: $innerShadow;
}
</style>
