<script setup lang="ts">
interface Props {
  height: string;
  selected?: boolean;
  current?: boolean;
}

withDefaults(defineProps<Props>(), {
  selected: false,
  current: false,
});

const emits = defineEmits<{
  click: [e: MouseEvent];
  dblclick: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
}>();
</script>

<template>
  <div
    v-ripple
    class="scroller-item"
    :class="{ selected, current }"
    :style="{ height }"
    @click="emits('click', $event)"
    @dblclick="emits('dblclick', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.scroller-item {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0.25rem 1rem;
  column-gap: 0.5rem;
  cursor: default;

  border: 1px solid transparent;
  border-radius: $borderRadiusMd;
  transition: box-shadow $transitionDuration;

  &.selected {
    box-shadow: $innerShadow;
    border: 1px solid var(--primary-color);
  }
}

.vue-recycle-scroller__item-view.hover .scroller-item {
  box-shadow: $innerShadow;
}
</style>
