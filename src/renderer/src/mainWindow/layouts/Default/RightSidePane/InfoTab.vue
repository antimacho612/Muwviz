<script setup lang="ts">
import { useAudioPlayer } from '@renderer/mainWindow/composables/useAudioPlayer';
import {
  formatAlbumTitle,
  formatArtistName,
  formatBytes,
  formatTime,
  toHyphenIfEmpty,
} from '@renderer/commonUtils';

import Artwork from '@mainWindow/components/Artwork/Artwork.vue';

const { currentSong } = useAudioPlayer();
</script>

<template>
  <div class="info-tab">
    <template v-if="!currentSong">曲を再生すると情報が表示されます</template>
    <template v-else>
      <Artwork
        :src="currentSong.artworkPath"
        width="120px"
        height="120px"
        class="flex-shrink-0 mx-auto"
      />
      <div class="title">{{ currentSong.title }}</div>
      <div class="detail-info">
        <div class="row">
          <div class="prop-name">アーティスト</div>
          <div class="prop-value">{{ formatArtistName(currentSong.artist) }}</div>
        </div>
        <div class="row">
          <div class="prop-name">アルバム</div>
          <div class="prop-value">{{ formatAlbumTitle(currentSong.album) }}</div>
        </div>
        <div class="row two-items">
          <div class="prop-name">ディスク</div>
          <div class="prop-value">{{ toHyphenIfEmpty(currentSong.diskNo) }}</div>
          <div class="prop-name">トラック</div>
          <div class="prop-value">{{ toHyphenIfEmpty(currentSong.trackNo) }}</div>
        </div>
        <div class="row">
          <div class="prop-name">年</div>
          <div class="prop-value">{{ toHyphenIfEmpty(currentSong.year) }}</div>
        </div>
        <div class="row">
          <div class="prop-name">長さ</div>
          <div class="prop-value">{{ formatTime(currentSong.duration) }}</div>
        </div>
        <div class="row">
          <div class="prop-name">ジャンル</div>
          <div class="prop-value">{{ toHyphenIfEmpty(currentSong.genres?.join(', ')) }}</div>
        </div>
        <div class="row">
          <div class="prop-name">ビットレート</div>
          <div class="prop-value">
            {{ currentSong.bitrate ? `${(currentSong.bitrate / 1000).toFixed(2)} kbps` : '-' }}
          </div>
        </div>
        <div class="row">
          <div class="prop-name">サンプルレート</div>
          <div class="prop-value">
            {{ currentSong.sampleRate ? `${currentSong.sampleRate / 1000} kHz` : '-' }}
          </div>
        </div>
        <div class="row">
          <div class="prop-name">ファイルパス</div>
          <div class="prop-value">{{ toHyphenIfEmpty(currentSong.filePath) }}</div>
        </div>
        <div class="row">
          <div class="prop-name">サイズ</div>
          <div class="prop-value">
            {{ formatBytes(currentSong.size) }}
          </div>
        </div>
        <div class="row">
          <div class="prop-name">作成日</div>
          <div class="prop-value">
            {{ new Date(currentSong.createdAt).toLocaleDateString('ja') }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.info-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
}

.title {
  flex-shrink: 0;
  width: 100%;
  text-align: center;
  font-size: map-get($fontSizes, lg);
  font-weight: 500;
  @include singleLineClamp;
  user-select: text;
  cursor: text;
}

.detail-info {
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  font-size: map-get($fontSizes, sm);

  .row {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    padding: 0.375rem 0.5rem;
    border-top: 1px solid var(--divider-color);

    &:last-child {
      border-bottom: 1px solid var(--divider-color);
    }

    .prop-name {
      flex: 0 0 auto;
      width: 30%;
      display: inline-flex;
      flex-shrink: 0;
      font-weight: 500;
    }

    .prop-value {
      flex: 0 1 auto;
      text-wrap: wrap;
      overflow-wrap: break-word;

      user-select: text;
      cursor: text;
    }

    &.two-items {
      .prop-value {
        width: 22.5%;
      }
    }
  }
}
</style>
