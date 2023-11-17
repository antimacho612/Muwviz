<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MinusIcon, Square2StackIcon, StopIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const onMinimizeButtonClick = async () => await window.electronAPI.invoke.minimizeWindow();
const onMaximizeButtonClicked = async () => await window.electronAPI.invoke.maximizeWindow();
const onCloseButtonClicked = async () => await window.electronAPI.invoke.closeWindow();

const isMaximized = ref(false);
onMounted(() => {
  window.electronAPI.on.windowResized(async (_, isWindowMaximized) => {
    isMaximized.value = isWindowMaximized;
  });
});
</script>

<template>
  <div class="titlebar">
    <div class="title">
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
    <div class="buttons">
      <div class="button" @click="onMinimizeButtonClick">
        <MinusIcon class="icon" />
      </div>
      <div class="button" @click="onMaximizeButtonClicked">
        <Square2StackIcon v-if="isMaximized" class="icon icon-unmiximize" style="" />
        <StopIcon v-else class="icon" style="" />
      </div>
      <div class="button button-close" @click="onCloseButtonClicked">
        <XMarkIcon class="icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.titlebar {
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

.title {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  padding-left: 8px;
}

.buttons {
  -webkit-app-region: no-drag;
  height: 100%;
  display: flex;

  .button {
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

    &.button-close:hover {
      color: white;
      background: red;
    }

    .icon {
      height: 20px;
      width: 20px;

      &.icon-unmiximize {
        transform: scale(-1, 1);
      }
    }
  }
}
</style>
