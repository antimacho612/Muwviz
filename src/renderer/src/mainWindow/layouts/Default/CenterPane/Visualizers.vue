<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { ConstructorOptions } from 'audiomotion-analyzer';
import { useAudioPlayer } from '@renderer/mainWindow/composables/useAudioPlayer';
import visualizer from '@mainWindow/core/visualizer';
import { useWindowStore } from '@mainWindow/stores/window';
import { sendMessageToSubWindowKey } from '@renderer/mainWindow/injectionKeys';

import Settings2Icon from '@renderer/assets/icons/settings2.svg?component';

const { htmlAudioElement } = useAudioPlayer();
const { visualizers } = useWindowStore();
const containerEls = ref<HTMLDivElement[]>();

onMounted(async () => {
  const options = await window.electron.invoke.getAllVisualizerConfig();
  let source: HTMLMediaElement | AudioNode = htmlAudioElement;
  containerEls.value?.forEach((containerEl, index) => {
    const isFirst = index === 0;
    const constructorOpts: ConstructorOptions = {
      source,
      overlay: true,
      bgAlpha: 0,
      showBgColor: false,
      connectSpeakers: isFirst,
      ...options[index],
    };
    const v = visualizer(containerEl, constructorOpts);
    visualizers.set(index, v);

    if (isFirst) source = v.getConnectedSource();
  });
});

onBeforeUnmount(() => {
  visualizers.forEach((visualizer) => visualizer.destroy());
});

const sendMessageToSubWindow = inject(sendMessageToSubWindowKey);
const onClickOpenConfigWindowButton = async (index: number) => {
  await window.electron.invoke.openVisualizerConfigWindow();
  sendMessageToSubWindow &&
    sendMessageToSubWindow({ channel: 'changeVisualizerSelection', payload: { index } });
};
</script>

<template>
  <div class="visualizers">
    <template v-for="n in 3" :key="n">
      <div ref="containerEls" class="visualizer" :style="{ gridArea: `visualizer${n}` }">
        <button
          type="button"
          class="open-config-window-button"
          @click="onClickOpenConfigWindowButton(n - 1)"
        >
          <Settings2Icon style="width: 1.5rem; height: 1.5rem" />
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.visualizers {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template:
    'visualizer1 visualizer2' 1fr
    'visualizer1 visualizer3' 1fr
    / 2fr 1fr;
  gap: 0.5rem;
}

.visualizer {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
  overflow: hidden;
  border-radius: $borderRadiusLg;
}

.open-config-window-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  margin: 0;
  background: transparent;
  color: var(--secondary-text-color);
  border: none;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition:
    color $transitionDuration,
    opacity $transitionDuration;

  &:hover {
    color: var(--primary-text-color);
  }
}

.visualizer:hover > .open-config-window-button {
  visibility: visible;
  opacity: 1;
}
</style>
