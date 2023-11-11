<script setup lang="ts">
import { ref } from 'vue';
import { Song } from '@shared/types';
import { formatTime, formatBytes, toHyphenIfEmpty } from '@renderer/utils/utils';

import { XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '@renderer/components/base/Button/Button.vue';
import Artwork from '@renderer/components/Artwork/Artwork.vue';

defineProps<{ song?: Song; isOpen?: boolean }>();
const emits = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const wapperEl = ref<HTMLElement>();

const onOpened = () => {
  wapperEl.value?.focus();
};

const close = () => {
  emits('update:isOpen', false);
};
</script>

<template>
  <Transition enter-active-class="fadeIn" leave-active-class="fadeOut">
    <div v-show="isOpen" class="backdrop"></div>
  </Transition>
  <Transition
    enter-active-class="fadeInDown"
    leave-active-class="fadeOutUp"
    @after-enter="onOpened"
  >
    <div
      v-show="isOpen"
      ref="wapperEl"
      class="wrapper"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="close"
      @keydown.esc.stop="close"
    >
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ toHyphenIfEmpty(song?.title) }}
          </h3>
          <Button class="modal-close-button" size="sm" :icon="XMarkIcon" text @click="close" />
        </div>
        <div class="modal-content">
          <Artwork
            :src="song?.artworkPath"
            class="artwork"
            width="120px"
            height="120px"
            :show-play-icon="false"
          />
          <div class="info">
            <div class="row">
              <div class="prop-name" style="width: 20%">アーティスト</div>
              <div class="prop-value" style="width: 80%">{{ toHyphenIfEmpty(song?.artist) }}</div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">アルバム</div>
              <div class="prop-value" style="width: 80%">{{ toHyphenIfEmpty(song?.album) }}</div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">ディスク</div>
              <div class="prop-value" style="width: 30%">{{ toHyphenIfEmpty(song?.diskNo) }}</div>
              <div class="prop-name" style="width: 20%">トラック</div>
              <div class="prop-value" style="width: 30%">{{ toHyphenIfEmpty(song?.trackNo) }}</div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">年</div>
              <div class="prop-value" style="width: 30%">{{ toHyphenIfEmpty(song?.year) }}</div>
              <div class="prop-name" style="width: 20%">長さ</div>
              <div class="prop-value" style="width: 30%">{{ formatTime(song?.duration) }}</div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">ジャンル</div>
              <div class="prop-value" style="width: 80%">
                {{ toHyphenIfEmpty(song?.genres?.join(', ')) }}
              </div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">ビットレート</div>
              <div class="prop-value" style="width: 30%">
                {{ song?.bitrate ? `${(song.bitrate / 1000000).toFixed(2)} Mbps` : '-' }}
              </div>
              <div class="prop-name" style="width: 20%">サンプルレート</div>
              <div class="prop-value" style="width: 30%">
                {{ song?.sampleRate ? `${song.sampleRate / 1000} kHz` : '-' }}
              </div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">ファイルパス</div>
              <div class="prop-value" style="width: 80%">{{ toHyphenIfEmpty(song?.filePath) }}</div>
            </div>
            <div class="row">
              <div class="prop-name" style="width: 20%">サイズ</div>
              <div class="prop-value" style="width: 30%">
                {{ song?.size ? formatBytes(song.size) : '-' }}
              </div>
              <div class="prop-name" style="width: 20%">作成日</div>
              <div class="prop-value" style="width: 30%">
                {{ toHyphenIfEmpty(song?.createdAt.toLocaleDateString('ja')) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.backdrop {
  position: absolute;
  inset: 0;
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.4);
}

.wrapper {
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  z-index: 1051;
}

.modal {
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.modal-content {
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
    }

    .prop-value {
      flex: 0 0 auto;
      text-wrap: wrap;
      overflow-wrap: break-word;

      user-select: text;
      cursor: text;
    }
  }
}

.fadeIn {
  @include animation($name: fadeIn);
}

.fadeOut {
  @include animation($name: fadeOut, $delay: 0.1s);
}

.fadeInDown {
  @include animation($name: fadeInDown, $delay: 0.1s, $fillMode: both);
}

.fadeOutUp {
  @include animation($name: fadeOutUp);
}
</style>
