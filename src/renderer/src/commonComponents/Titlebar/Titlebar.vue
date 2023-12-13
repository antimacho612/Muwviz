<script setup lang="ts">
import MinimizeIcon from '@renderer/assets/icons/minimize.svg?component';
import CloseIcon from '@renderer/assets/icons/close.svg?component';
import SquareIcon from '@renderer/assets/icons/square.svg?component';
import SquareStackIcon from '@renderer/assets/icons/square-stack.svg?component';
import PinIcon from '@renderer/assets/icons/pin.svg?component';
import PinOutlinedIcon from '@renderer/assets/icons/pin-outlined.svg?component';
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
        <PinIcon v-if="pinned" class="icon" />
        <PinOutlinedIcon v-else class="icon" />
      </div>
      <div
        v-if="showMinimizeButton"
        class="c-titlebar-button"
        @click="emits('clickMinimizeButton', $event)"
      >
        <MinimizeIcon class="icon" />
      </div>
      <div
        v-if="showMaximizeButton"
        class="c-titlebar-button"
        @click="emits('clickMaximizeButton', $event)"
      >
        <SquareStackIcon v-if="isWindowMaximized" class="icon" />
        <SquareIcon v-else class="icon" />
      </div>
      <div
        class="c-titlebar-button c-titlebar-button-close"
        @click="emits('clickCloseButton', $event)"
      >
        <CloseIcon class="icon" />
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
    }
  }
}
</style>
