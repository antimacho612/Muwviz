<script setup lang="ts">
import { computed } from 'vue';

import { FolderPlusIcon, MagnifyingGlassCircleIcon } from '@heroicons/vue/24/outline';
import Modal from '@renderer/components/base/Modal/Modal.vue';
import Button from '@renderer/components/base/Button/Button.vue';

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const items = [{ path: 'D:\\music', scannedCount: 0, skippedCount: 0 }];

const onClickClose = () => {
  emits('update:isOpen', false);
};
</script>

<template>
  <Modal
    v-model:is-open="opened"
    :close-on-click-outside="false"
    :close-on-press-esc="false"
    :z-index="5000"
  >
    <div class="library-edit-modal">
      <div class="header">
        <div class="title">スキャン対象のフォルダ</div>
        <Button size="sm" text>
          <FolderPlusIcon style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem" />
          フォルダを追加...
        </Button>
      </div>

      <div class="folder-list">
        <div>a</div>
      </div>

      <div class="footer">
        <div class="progress"></div>
        <Button size="sm">
          <MagnifyingGlassCircleIcon style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem" />
          スキャン
        </Button>
        <Button size="sm" text @click="onClickClose">閉じる</Button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.library-edit-modal {
  position: absolute;
  @include positionCenterXY;
  width: 50rem;
  height: 30rem;
  padding: 1rem;
  background: var(--background-color);
  border-radius: $borderRadiusLg;
  box-shadow:
    0px 9px 46px 8px rgba(0, 0, 0, 0.12),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 11px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: map-get($fontSizes, lg);
    font-weight: bold;
  }
}

.folder-list {
  width: 100%;
  height: 22rem;
  margin: 0.5rem 0;
  padding: 0 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.footer {
  display: flex;
  column-gap: 0.5rem;

  .progress {
    flex-grow: 1;
  }

  button {
    flex-shrink: 0;
  }
}
</style>
