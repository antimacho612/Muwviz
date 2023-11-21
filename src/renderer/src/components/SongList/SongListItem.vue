<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@renderer/utils/useAudioPlayer';
import { formatTime, toHyphenIfEmpty } from '@renderer/utils/utils';
import { Song } from '@shared/types';

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import RecycleScrollerItem from '@renderer/components/RecycleScrollerItem/RecycleScrollerItem.vue';
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
</script>

<template>
  <RecycleScrollerItem
    height="3rem"
    :selected="selected"
    :current="current"
    @click="emits('clickRow', $event)"
    @dblclick="emits('doubleClickRow', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <Artwork
      :src="song.artworkPath"
      width="40px"
      height="40px"
      :show-play-icon="true"
      class="img-area"
      @click.stop="emits('clickArtwork', $event)"
      @dblclick.stop
      @pointerdown.stop
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
        color="var(--primary-color)"
        class="playing-animation"
      />
    </div>
    <div class="trailing-area">
      <RouterLink :to="`/albums/${song.albumId}`" class="album">
        {{ toHyphenIfEmpty(song.album) }}
      </RouterLink>
      <span>{{ formatTime(song.duration) }}</span>
    </div>
    <div>
      <Button
        :icon="EllipsisVerticalIcon"
        size="sm"
        text
        @click.stop="emits('clickEllipsisButton', $event)"
        @pointerdown.stop
        @dblclick.stop
      />
    </div>
  </RecycleScrollerItem>
</template>

<style lang="scss" scoped>
.scroller-item {
  &.current {
    .title,
    .trailing-area {
      color: var(--primary-color);
    }

    .artist {
      color: var(--primary-color--lighter);
    }
  }
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
