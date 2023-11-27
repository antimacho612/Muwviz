<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useSettingsStore } from '@renderer/stores/settings';
import { ScanProgress } from '@shared/types';

import { FolderPlusIcon, ArrowPathRoundedSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Modal from '@renderer/components/base/Modal/Modal.vue';
import Button from '@renderer/components/base/Button/Button.vue';
import ProgressBar from '@renderer/components/base/ProgressBar/ProgressBar.vue';

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const toast = useToast();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});

const foldersToScan = ref<{ path: string; scannedCount: number; status: string }[]>([]);
const currentProcessing = ref<{ path: string; scannedCount: number; status: string }>();
const progressBarValue = ref(0);

const isProcessing = ref(false);

const onClickReScanButton = async () => {
  await window.electronAPI.invoke.scanFolder('D:\\Music\\Ado');
};

const alreadyScanned = (path: string) =>
  foldersToScan.value.findIndex(
    (folder) => folder.path.toLocaleLowerCase() === path.toLocaleLowerCase()
  ) >= 0;

const execScan = async (path: string) => {
  currentProcessing.value = {
    path,
    scannedCount: 0,
    status: '',
  };
  foldersToScan.value.push(currentProcessing.value);

  try {
    await window.electronAPI.invoke.scanFolder(path);
  } catch (e) {
    console.error(e);
    currentProcessing.value.status = 'エラーが発生しました。';
    toast.error(`『${path}』のスキャンに失敗しました。`);
  }
  currentProcessing.value = undefined;
};

const onClickAddFolderButton = async () => {
  const result = await window.electronAPI.invoke.openFileBrowser('Folder');
  if (result.canceled) {
    return;
  }

  isProcessing.value = true;
  for (const path of result.filePaths) {
    if (alreadyScanned(path)) {
      toast.warning(`『${path}』は既にスキャン対象のフォルダに登録されています。`, {
        timeout: 3000,
      });
      continue;
    }

    await execScan(path);
  }

  isProcessing.value = false;
};

const onClickDeleteButton = async () => {
  if (confirm('ライブラリからスキャン済みの楽曲を削除します。よろしいですか？')) {
    // TODO: delete
  }
};

const updateScanProgress = async (progress: ScanProgress) => {
  if (currentProcessing.value?.path !== progress.path) {
    return;
  }

  currentProcessing.value.scannedCount = progress.scannedFilesCount;
  if (progress.done) {
    currentProcessing.value.status = `スキャン終了(スキャン: ${progress.scannedFilesCount}曲, スキップ: ${progress.skippedFilesCount}曲)`;
    currentProcessing.value = undefined;
  } else {
    currentProcessing.value.status = `スキャン中...(${progress.currentIndex}/${progress.totalFilesCount})`;
    progressBarValue.value = Math.floor((progress.currentIndex / progress.totalFilesCount) * 100);
  }
};

onMounted(() => {
  window.electronAPI.on.updateScanProgress(
    async (_, progress) => await updateScanProgress(progress)
  );
});

watch(
  () => props.isOpen,
  () => {
    if (!props.isOpen) {
      return;
    }
    const { scannedFolders } = useSettingsStore();

    foldersToScan.value = scannedFolders.map((folder) => ({
      path: folder.path,
      scannedCount: folder.scannedSongsCount,
      status: '',
    }));
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
        <Button size="sm" text :disabled="isProcessing" @click="onClickReScanButton">
          <ArrowPathRoundedSquareIcon style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem" />
          再スキャン
        </Button>
      </div>

      <div class="main">
        <table class="folder-table">
          <thead>
            <tr>
              <th style="width: 3.5rem"></th>
              <th style="text-align: left">パス</th>
              <th style="width: 6.5rem">スキャン済</th>
              <th style="width: 18rem">ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="folder in foldersToScan" :key="folder.path">
              <td>
                <div
                  v-if="folder.path === currentProcessing?.path"
                  class="scanning-animation"
                ></div>
                <Button
                  v-else
                  :icon="TrashIcon"
                  size="sm"
                  text
                  :disabled="isProcessing"
                  class="delete-button"
                  @click="onClickDeleteButton"
                />
              </td>
              <td>{{ folder.path }}</td>
              <td style="text-align: right">{{ folder.scannedCount.toLocaleString() }} 曲</td>
              <td>{{ folder.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div class="progress-bar-container">
          <ProgressBar v-if="currentProcessing" :value="progressBarValue" />
        </div>
        <Button size="sm" :disabled="isProcessing" @click="onClickAddFolderButton">
          <FolderPlusIcon style="width: 1.5rem; height: 1.5rem; margin-right: 0.5rem" />
          フォルダを追加...
        </Button>
        <Button size="sm" text :disabled="isProcessing" @click="emits('update:isOpen', false)">
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

.scanning-animation {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: $borderRadiusFull;
  border-top: 0.75rem double var(--primary-color--lighter);
  border-bottom: 0.75rem double var(--primary-color--lighter);
  border-left: 0.75rem solid transparent;
  border-right: 0.75rem solid transparent;
  @include animation(
    $name: scanning,
    $duration: 1s,
    $timingFunction: ease-in-out,
    $iterationCount: infinite
  );
}

@keyframes scanning {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.delete-button {
  --ripple-color: rgba(255, 0, 0, 0.3);

  &:hover {
    color: red !important;
    background: rgba(255, 0, 0, 0.1) !important;
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
