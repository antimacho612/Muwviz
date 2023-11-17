<script setup lang="ts">
import { computed } from 'vue';
import { Song } from '@shared/types';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { formatTime, toHyphenIfEmpty } from '@renderer/utils/utils';

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import Button from '@renderer/components/base/Button/Button.vue';
import Artwork from '@renderer/components/Artwork/Artwork.vue';
import BarsAnimation from '@renderer/components/BarsAnimation/BarsAnimation.vue';

interface Props {
  song: Song;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const emits = defineEmits<{
  clickRow: [e: MouseEvent];
  doubleClickRow: [e: MouseEvent];
  clickArtwork: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
  clickEllipsisButton: [e: MouseEvent];
}>();

const { isPlaying, currentSong } = useAudioPlayer();

const current = computed(() => props.song.id === currentSong.value?.id);

const onClickRow = (e: MouseEvent) => emits('clickRow', e);
const onDoubleClickRow = (e: MouseEvent) => emits('doubleClickRow', e);
const onClickArtwork = (e: MouseEvent) => emits('clickArtwork', e);
const onClickEllipsisButton = (e: MouseEvent) => emits('clickEllipsisButton', e);
const contextMenu = (e: MouseEvent) => emits('contextmenu', e);
</script>

<template>
  <div
    v-ripple="{ duration: 0.25 }"
    class="list-item"
    :class="{ selected, current }"
    @click="onClickRow"
    @dblclick="onDoubleClickRow"
    @contextmenu="contextMenu"
  >
    <Artwork
      :src="song.artworkPath"
      width="40px"
      height="40px"
      :show-play-icon="true"
      class="img-area"
      @click="onClickArtwork"
    />
    <div class="main-area">
      <div class="title-and-artist">
        <span class="title">{{ song.title }}</span>
        <span class="artist">{{ toHyphenIfEmpty(song.artist) }}</span>
      </div>

      <BarsAnimation
        v-if="current"
        :pause="!isPlaying"
        width="1rem"
        height="1.25rem"
        color="var(--primary-color--lighter)"
        class="playing-animation"
      />
    </div>
    <div class="trailing-area">
      <span class="album">{{ toHyphenIfEmpty(song.album) }}</span>
      <span>{{ formatTime(song.duration) }}</span>
    </div>
    <div style="grid-area: menu">
      <Button
        :icon="EllipsisVerticalIcon"
        size="sm"
        text
        @click.stop="onClickEllipsisButton"
        @pointerdown.stop
        @dblclick.stop
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  width: 100%;
  height: 3rem;
  padding: 0.25rem 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.5rem;

  border: 1px solid transparent;
  border-radius: $borderRadiusMd;
  cursor: default;

  &.current {
    .title,
    .trailing-area {
      color: var(--primary-color);
    }

    .artist {
      color: var(--primary-color--lighter);
    }
  }

  &.selected {
    box-shadow: $innerShadow;
    border: 1px solid var(--primary-color--lightest);
  }
}

.hover .list-item {
  box-shadow: $innerShadow;
}

.img-area {
  flex: 0 0 auto;
  width: auto;
}

.main-area {
  flex: 1 1 auto;
  width: 40%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}

.playing-animation {
  flex: 0 0 auto;
  margin-left: 0.5rem;
}

.title-and-artist {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  line-height: 1.3;
  overflow: hidden;

  .title {
    font-size: map-get($fontSizes, md);
    @include singleLineClamp;
  }

  .artist {
    font-size: map-get($fontSizes, sm);
    color: var(--secondary-text-color);
    @include singleLineClamp;
  }
}

.trailing-area {
  flex: 0 0 auto;
  width: 30%;
  display: flex;
  column-gap: 0.5rem;
  justify-content: space-between;

  .album {
    font-size: 1rem;
    @include singleLineClamp;
  }
}
</style>
