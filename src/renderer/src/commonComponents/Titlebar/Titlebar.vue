<script setup lang="ts">
import { MinusIcon, Square2StackIcon, StopIcon, XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  isWindowMaximized?: boolean;
  showTitle?: boolean;
  showMaximizeButton?: boolean;
  showMinimizeButton?: boolean;
}
withDefaults(defineProps<Props>(), {
  isWindowMaximized: false,
  showTitle: true,
  showMaximizeButton: true,
  showMinimizeButton: true,
});

type Emits = {
  clickMinimizeButton: [e: MouseEvent];
  clickMaximizeButton: [e: MouseEvent];
  clickCloseButton: [e: MouseEvent];
};
const emits = defineEmits<Emits>();
</script>

<template>
  <div class="c-titlebar">
    <div v-if="showTitle" class="c-titlebar-title">
      <div style="display: flex; gap: 1px; align-items: center; height: 90%; margin-right: 4px">
        <div
          style="width: 3px; background: var(--primary-color); border-radius: 100%; height: 30%"
        ></div>
        <div
          style="width: 3px; background: var(--primary-color); border-radius: 100%; height: 55%"
        ></div>
        <div
          style="width: 3px; background: var(--primary-color); border-radius: 100%; height: 75%"
        ></div>
        <div
          style="width: 3px; background: var(--primary-color); border-radius: 100%; height: 35%"
        ></div>
        <div
          style="width: 3px; background: var(--primary-color); border-radius: 100%; height: 70%"
        ></div>
        <div
          style="width: 3px; background: var(--primary-color); border-radius: 100%; height: 45%"
        ></div>
      </div>

      Muwviz
    </div>
    <div class="c-titlebar-buttons" :style="{ marginLeft: showTitle ? undefined : 'auto' }">
      <div
        v-if="showMinimizeButton"
        class="c-titlebar-button"
        @click="emits('clickMinimizeButton', $event)"
      >
        <MinusIcon class="icon" />
      </div>
      <div
        v-if="showMaximizeButton"
        class="c-titlebar-button"
        @click="emits('clickMaximizeButton', $event)"
      >
        <Square2StackIcon v-if="isWindowMaximized" class="icon unmiximize-icon" style="" />
        <StopIcon v-else class="icon" style="" />
      </div>
      <div
        class="c-titlebar-button c-titlebar-button-close"
        @click="emits('clickCloseButton', $event)"
      >
        <XMarkIcon class="icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-titlebar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100vw;
  -webkit-app-region: drag;
  box-shadow: 1.5px 1.5px 8px var(--shadow-color--dark);
  z-index: 100;
}

.c-titlebar-title {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  padding-left: 8px;
}

.c-titlebar-buttons {
  -webkit-app-region: no-drag;
  height: 100%;
  display: flex;

  .c-titlebar-button {
    display: inline-flex;
    height: 100%;
    width: 40px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all $transitionDuration;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &.c-titlebar-button-close:hover {
      color: white;
      background: red;
    }

    .icon {
      height: 20px;
      width: 20px;

      &.unmiximize-icon {
        transform: scale(-1, 1);
      }
    }
  }
}
</style>
