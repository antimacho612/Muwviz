<script setup lang="ts">
import { MinusIcon, Square2StackIcon, StopIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { IconPin, IconPinFilled } from '@tabler/icons-vue';
import LogoIcon from '@renderer/assets/icons/logo.svg?component';

interface Props {
  isWindowMaximized?: boolean;
  showTitle?: boolean;
  showMaximizeButton?: boolean;
  showMinimizeButton?: boolean;
  showPinButton?: boolean;
  pinned?: boolean;
}
withDefaults(defineProps<Props>(), {
  isWindowMaximized: false,
  showTitle: true,
  showMaximizeButton: true,
  showMinimizeButton: true,
  showPinButton: false,
  pinned: false,
});

type Emits = {
  clickMinimizeButton: [e: MouseEvent];
  clickMaximizeButton: [e: MouseEvent];
  clickCloseButton: [e: MouseEvent];
  clickPinButton: [e: MouseEvent];
};
const emits = defineEmits<Emits>();
</script>

<template>
  <div class="c-titlebar">
    <div v-if="showTitle" class="c-titlebar-left">
      <LogoIcon />
      <span class="c-titlebar-title">Muwviz</span>
    </div>
    <div class="c-titlebar-right" :style="{ marginLeft: showTitle ? undefined : 'auto' }">
      <div v-if="showPinButton" class="c-titlebar-button" @click="emits('clickPinButton', $event)">
        <IconPinFilled v-if="pinned" stroke-width="1.5" style="transform: rotate(-45deg)" />
        <IconPin v-else stroke-width="1.5" />
      </div>
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
        <Square2StackIcon v-if="isWindowMaximized" class="icon unmaximize-icon" />
        <StopIcon v-else class="icon" />
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

.c-titlebar-left {
  height: 100%;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  padding-left: 0.5rem;

  .c-titlebar-title {
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
  }
}

.c-titlebar-right {
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

      &.unmaximize-icon {
        transform: scale(-1, 1);
      }
    }
  }
}
</style>
