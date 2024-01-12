<script setup lang="ts">
import { computed } from 'vue';
import { formatTime, formatBytes, toHyphenIfEmpty, formatArtistName, formatAlbumTitle } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import CloseIcon from '@renderer/assets/icons/close.svg?component';
import Artwork from '@mainWindow/components/Artwork/Artwork.vue';
import Modal from '@renderer/commonComponents/Modal/Modal.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

interface Props {
  song?: Song;
  isOpen?: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const opened = computed({
  get: () => props.isOpen,
  set: (value: boolean) => emits('update:isOpen', value),
});
</script>

<template>
  <Modal v-model:is-open="opened">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ toHyphenIfEmpty(song?.title) }}
        </h3>
        <Button class="modal-close-button" size="sm" :icon="CloseIcon" text @click="emits('update:isOpen', false)" />
      </div>
      <div class="modal-main">
        <Artwork :src="song?.artworkPath" class="artwork" width="120px" height="120px" :show-play-icon="false" />
        <div class="info">
          <div class="row">
            <div class="prop-name">アーティスト</div>
            <div class="prop-value">{{ formatArtistName(song?.artist) }}</div>
          </div>
          <div class="row">
            <div class="prop-name">アルバム</div>
            <div class="prop-value">{{ formatAlbumTitle(song?.album) }}</div>
          </div>
          <div class="row two-columns">
            <div class="prop-name">ディスク</div>
            <div class="prop-value">{{ toHyphenIfEmpty(song?.diskNo) }}</div>
            <div class="prop-name">トラック</div>
            <div class="prop-value">{{ toHyphenIfEmpty(song?.trackNo) }}</div>
          </div>
          <div class="row two-columns">
            <div class="prop-name">年</div>
            <div class="prop-value">{{ toHyphenIfEmpty(song?.year) }}</div>
            <div class="prop-name">長さ</div>
            <div class="prop-value">{{ formatTime(song?.duration) }}</div>
          </div>
          <div class="row">
            <div class="prop-name">ジャンル</div>
            <div class="prop-value">{{ toHyphenIfEmpty(song?.genres?.join(', ')) }}</div>
          </div>
          <div class="row two-columns">
            <div class="prop-name">ビットレート</div>
            <div class="prop-value">
              {{ song?.bitrate ? `${(song.bitrate / 1000).toFixed(2)} kbps` : '-' }}
            </div>
            <div class="prop-name">サンプルレート</div>
            <div class="prop-value">
              {{ song?.sampleRate ? `${song.sampleRate / 1000} kHz` : '-' }}
            </div>
          </div>
          <div class="row">
            <div class="prop-name">ファイルパス</div>
            <div class="prop-value">{{ toHyphenIfEmpty(song?.filePath) }}</div>
          </div>
          <div class="row two-columns">
            <div class="prop-name">サイズ</div>
            <div class="prop-value">{{ song?.size ? formatBytes(song.size) : '-' }}</div>
            <div class="prop-name">作成日</div>
            <div class="prop-value">
              {{ song ? new Date(song.createdAt).toLocaleDateString('ja') : '-' }}
            </div>
          </div>
          <div class="row">
            <div class="prop-name">システムID</div>
            <div class="prop-value">{{ song?.id }}</div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.modal-content {
  position: absolute;
  top: 20%;
  left: calc(50% + 4rem);
  transform: translateX(-50%);
  width: 75%;
  max-height: 560px;

  background-color: var(--background-color);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: $borderRadiusLg;
  cursor: default;
}

.modal-header {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  overflow: hidden;
}

.modal-title {
  font-size: map-get($fontSizes, lg);
  @include singleLineClamp;
}

.modal-main {
  display: flex;
  flex-wrap: nowrap;
  align-items: start;
  padding: 0.5rem 1rem 1rem;
  gap: 0.75rem;
}

.artwork {
  flex-shrink: 0;
}

.info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  font-size: map-get($fontSizes, sm);
  overflow: hidden;

  .row {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    padding: 0.375rem 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);

    &:last-child {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .prop-name {
      display: inline-flex;
      flex-shrink: 0;
      font-weight: 500;
      width: 20%;
    }

    .prop-value {
      flex: 0 0 auto;
      text-wrap: wrap;
      overflow-wrap: break-word;
      width: 80%;

      user-select: text;
      cursor: text;
    }

    &.two-columns {
      .prop-value {
        width: 30%;
      }
    }
  }
}
</style>
