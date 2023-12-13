<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

import AddFolderIcon from '@renderer/assets/icons/add-folder.svg?component';
import Search2Icon from '@renderer/assets/icons/search2.svg?component';
import DeleteIcon from '@renderer/assets/icons/delete-outlined.svg?component';
import Modal from '@renderer/commonComponents/Modal/Modal.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';
import LoadingAnimation from '@mainWindow/components/LoadingAnimation/LoadingAnimation.vue';
import ProgressBar from '@renderer/commonComponents/ProgressBar/ProgressBar.vue';

type ScanStatus = {
  path: string;
  status: string;
  isScanning: boolean;
};

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const toast = useToast();

const foldersToScan = ref<ScanStatus[]>([]);
const status = ref<'WAITING' | 'SCANNING' | 'DONE'>('WAITING');

const alreadyAdded = (path: string) =>
  foldersToScan.value.some(
    (folder) => folder.path.toLocaleLowerCase() === path.toLocaleLowerCase()
  );

const onClickAddFolderButton = async () => {
  const result = await window.electron.invoke.openFileBrowser(true, 'Folder');
  if (result.canceled) return;

  for (const path of result.filePaths) {
    if (alreadyAdded(path)) {
      toast.warning(`『${path}』は既にスキャン対象のフォルダに追加されています。`, {
        timeout: 3000,
      });
      continue;
    }

    foldersToScan.value.push({ path, status: 'スキャン待ち', isScanning: false });
  }
};

const onClickDeleteButton = (index: number) => {
  foldersToScan.value.splice(index, 1);
};

const onClickScanButton = async () => {
  status.value = 'SCANNING';

  for (const folder of foldersToScan.value) {
    folder.isScanning = true;
    try {
      await window.electron.invoke.scanFolder(folder.path);
    } catch (e) {
      console.error(e);
      folder.status = 'エラーが発生しました。';
      toast.error(`『${folder.path}』のスキャンに失敗しました。`);
    } finally {
      folder.isScanning = false;
    }
  }

  status.value = 'DONE';
};

const progressBarValue = ref(0);
window.electron.on.updateScanProgress(async (_, progress) => {
  const target = foldersToScan.value.find((folder) => folder.path === progress.path);
  if (!target) return;

  const { done, scannedFilesCount, currentIndex, skippedFilesCount, totalFilesCount } = progress;
  if (done) {
    target.status = `スキャン終了\n(スキャン: ${scannedFilesCount}曲, スキップ: ${skippedFilesCount}曲)`;
  } else {
    target.status = `スキャン中...(${currentIndex}/${totalFilesCount})`;
    progressBarValue.value = Math.floor((currentIndex / totalFilesCount) * 100);
  }
});

watch(
  () => props.isOpen,
  () => {
    if (!props.isOpen) return;
    foldersToScan.value = [];
    status.value = 'WAITING';
  },
  { immediate: true }
);
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
        <Button v-if="status === 'WAITING'" size="sm" text @click="onClickAddFolderButton">
          <AddFolderIcon style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem" />
          フォルダを追加...
        </Button>
      </div>

      <div class="main">
        <table class="folder-table">
          <thead>
            <tr>
              <th style="width: 3.5rem"></th>
              <th class="text-left">パス</th>
              <th style="width: 18rem">ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(folder, index) in foldersToScan" :key="folder.path">
              <td class="text-center">
                <Button
                  v-if="status === 'WAITING'"
                  :icon="DeleteIcon"
                  size="sm"
                  text
                  class="delete-button"
                  @click="onClickDeleteButton(index)"
                />
                <LoadingAnimation v-else-if="folder.isScanning" size="1.5rem"></LoadingAnimation>
              </td>
              <td>{{ folder.path }}</td>
              <td style="white-space: pre-line">{{ folder.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div class="progress-bar-container">
          <ProgressBar v-if="status === 'SCANNING'" :value="progressBarValue" />
        </div>

        <Button
          v-if="status === 'WAITING'"
          size="sm"
          :disabled="!foldersToScan.length"
          @click="onClickScanButton"
        >
          <Search2Icon style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem" />
          スキャン
        </Button>
        <Button
          size="sm"
          text
          :disabled="status === 'SCANNING'"
          @click="emits('update:isOpen', false)"
        >
          閉じる
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.library-edit-modal {
  position: absolute;
  @include positionCenterXY;
  width: 55rem;
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

.main {
  width: 100%;
  height: 22rem;
  margin: 0.5rem 0;
  padding: 0 1rem;
  overflow: auto;
}

.folder-table {
  width: 100%;
  border-spacing: 0;

  th {
    position: sticky;
    top: 0;
    left: 0;
    padding: 0.5rem 0.5rem;
    background: var(--background-color);
    border-bottom: 2px solid var(--divider-color);
  }

  td {
    padding: 0.25rem 0.5rem;
  }
}

.delete-button {
  --ripple-color: rgba(255, 0, 0, 0.3);

  &:enabled:hover {
    color: red !important;
    background: rgba(255, 0, 0, 0.1) !important;
  }

  &:enabled:active {
    color: red !important;
  }
}

.footer {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  .progress-bar-container {
    flex-grow: 1;
    padding: 0 0.5rem;
    height: 1.5rem;
  }

  button {
    flex-shrink: 0;
  }
}
</style>
