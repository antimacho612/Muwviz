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

type Emits = {
  click: [e: MouseEvent];
  dblclick: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
};
const emits = defineEmits<Emits>();
</script>

<template>
  <div
    v-ripple
    class="scroller-item"
    :class="{ selected, current }"
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
  height: v-bind(height);
  padding: 0.25rem 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
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
