<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { sendMessageToMainWindowKey } from '../injectionKeys';
import { SubToMainMessage } from '@renderer/commonUtils/messagePort';
import { useVisualizersConfigStore } from '../stores/visualizersConfig';
import { useVisualizerPresetsStore } from '../stores/visualizerPresets';
import { useWindowStore } from '../stores/window';
import { showNativeConfirm } from '@renderer/commonUtils';
import { VisualizerOptions, VisualizerPreset } from '@shared/visualizerTypes';
import { KeyValue } from '@shared/types';

import CloseIcon from '@renderer/assets/icons/close.svg?component';
import DeleteIcon from '@renderer/assets/icons/delete-outlined.svg?component';
import Modal from '@renderer/commonComponents/Modal/Modal.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import InputText from '@renderer/commonComponents/InputText/InputText.vue';

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const presetsStore = useVisualizerPresetsStore();

const { configs } = storeToRefs(useVisualizersConfigStore());
const { currentVisualizerIndex } = storeToRefs(useWindowStore());
const currentVisualizerConfig = computed(() => configs.value[currentVisualizerIndex.value]);

watch(
  () => props.isOpen,
  async () => {
    if (opened.value && !presetsStore.presets.length) {
      await presetsStore.fetch();
    }
  }
);

watch(currentVisualizerIndex, () => {
  if (opened.value) opened.value = false;
});

const toast = useToast();

const newPresetName = ref('');

const onClickSaveButton = () => {
  if (!newPresetName.value) return;

  const newPreset: VisualizerPreset = {
    id: crypto.randomUUID(),
    name: newPresetName.value,
    canDelete: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config: (({ isOn, ...rest }) => rest)(currentVisualizerConfig.value),
  };

  presetsStore.add(newPreset);
  newPresetName.value = '';

  toast.info('プリセットを保存しました。');
};

const sendMessageToMainWindow = inject(sendMessageToMainWindowKey);
const onClickPreset = (preset: VisualizerPreset) => {
  for (const key in preset.config) {
    if (!Object.hasOwn(currentVisualizerConfig.value, key)) continue;

    // メイン側に変更を通知
    if (sendMessageToMainWindow) {
      let message: SubToMainMessage;

      if (key === 'background') {
        message = {
          channel: 'changeVisualizerBackgroundColor',
          payload: { index: currentVisualizerIndex.value, color: preset.config.backgroundColor },
        };
      } else {
        const keyValue = { key, value: preset.config[key] } as KeyValue<VisualizerOptions>;
        message = {
          channel: 'changeVisualizerOption',
          payload: {
            index: currentVisualizerIndex.value,
            ...keyValue,
          },
        };
      }

      sendMessageToMainWindow(message);
    }

    // 現在のビジュアライザーの設定値にプリセットの値を反映
    currentVisualizerConfig.value[key] = preset.config[key];
  }
};

const onClickDeletePresetButton = async (id: string, name: string) => {
  const isOk = await showNativeConfirm(false, '確認', `プリセット【${name}】を削除しますか？`);

  if (isOk) {
    await presetsStore.delete(id);
    toast.info('プリセットを削除しました。');
  }
};
</script>

<template>
  <Modal v-model:is-open="opened">
    <div class="preset-modal">
      <div class="modal-header">
        <h3 class="modal-title">プリセットメニュー</h3>
        <Button size="xs" :icon="CloseIcon" text @click="emits('update:isOpen', false)" />
      </div>

      <div class="modal-main">
        <div class="mb-3">
          <h4 class="sub-title">現在の設定をプリセットとして保存</h4>
          <div class="flex align-items-center gap-2 px-2">
            <InputText
              v-model="newPresetName"
              size="xs"
              class="w-full flex-grow-1 flex-shrink-1"
              placeholder="プリセット名"
            />
            <Button
              :disabled="!newPresetName.length"
              size="xs"
              class="flex-shrink-0"
              @click="onClickSaveButton"
            >
              保存
            </Button>
          </div>
        </div>

        <div class="overflow-hidden">
          <div class="sub-title flex align-items-center gap-2">プリセットから選択</div>
          <div class="preset-list">
            <div
              v-for="preset in presetsStore.presets"
              :key="preset.id"
              v-ripple
              class="preset-list-item"
              tabIndex="0"
              @click="onClickPreset(preset)"
            >
              <div class="preset-name">{{ preset.name }}</div>
              <Button
                v-if="preset.canDelete"
                :icon="DeleteIcon"
                size="xs"
                text
                class="delete-button"
                @click.stop="onClickDeletePresetButton(preset.id, preset.name)"
                @pointerdown.stop
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.preset-modal {
  position: absolute;
  @include positionCenterXY;
  width: 90%;
  max-width: 30rem;
  height: 25rem;
  background: var(--background-color);
  border-radius: $borderRadiusLg;
  box-shadow:
    0px 9px 46px 8px rgba(0, 0, 0, 0.12),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 11px 15px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 1rem;
  overflow: hidden;
}

.modal-title {
  font-size: map-get($fontSizes, lg);
}

.modal-main {
  width: 100%;
  height: 22rem;
  padding: 0.5rem 1rem;
  overflow: hidden;
}

.sub-title {
  height: 2rem;
  font-size: map-get($fontSizes, sm);
  font-weight: bold;
}

.preset-list {
  width: 100%;
  height: 13.5rem;
  padding: 2px 0.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  overflow-y: auto;
}

.preset-list-item {
  flex-shrink: 0;
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  border-radius: $borderRadiusMd;
  cursor: pointer;
  transition: box-shadow $transitionDuration;

  &:hover {
    box-shadow: $innerShadow;
  }

  &:focus {
    @include focused;
  }
}

.preset-name {
  flex-grow: 1;
  font-size: map-get($fontSizes, sm);
  @include singleLineClamp;
}

.delete-button {
  flex: 0 0 auto;
  --ripple-color: rgba(255, 0, 0, 0.3);
  background: var(--background-color) !important;

  &:hover {
    color: red !important;
  }

  &:active {
    box-shadow: none !important;
  }
}
</style>
