<script setup lang="ts">
import { computed } from 'vue';
import { formatAlbumTitle, formatArtistName } from '@renderer/commonUtils';
import { Album } from '@shared/types';

import PlayIcon from '@renderer/assets/icons/play.svg?component';
import ShuffleIcon from '@renderer/assets/icons/shuffle.svg?component';
import RecycleGridScrollerItem from '@mainWindow/components/RecycleGridScroller/RecycleGridScrollerItem.vue';
import Artwork from '@mainWindow/components/Artwork/Artwork.vue';

const props = defineProps<{ album: Album }>();

type Emits = {
  clickItem: [e: MouseEvent];
  clickPlayButton: [e: MouseEvent];
  clickShufflePlayButton: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const artistName = computed(() => {
  if (!props.album.artists.length) return formatArtistName();
  if (props.album.artists.length === 1) return formatArtistName(props.album.artists[0].name);
  return `${formatArtistName(props.album.artists[0].name)} 他`;
});

const title = computed(() => formatAlbumTitle(props.album.title));
</script>

<template>
  <RecycleGridScrollerItem
    class="album-grid-item"
    @click="emits('clickItem', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <Artwork :src="album.artworkPath" width="128px" height="128px" style="z-index: 1" />

    <div>
      <div class="title" :title="title">{{ title }}</div>
      <div class="artist">{{ artistName }}</div>
    </div>

    <div class="song-count">{{ album.songCount }}</div>

    <div
      v-ripple
      :title="`【${formatAlbumTitle(album.title)}】を再生`"
      class="icon-button play-button"
      @click.stop="emits('clickPlayButton', $event)"
      @pointerdown.stop
    >
      <PlayIcon />
    </div>

    <div
      v-ripple
      :title="`【${formatAlbumTitle(album.title)}】をシャッフル再生`"
      class="icon-button shuffle-play-button"
      @click.stop="emits('clickShufflePlayButton', $event)"
      @pointerdown.stop
    >
      <ShuffleIcon />
    </div>
  </RecycleGridScrollerItem>
</template>

<style lang="scss" scoped>
.album-grid-item {
  width: 10rem;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: map-get($fontSizes, md);
  @include singleLineClamp;
}

.artist {
  font-size: map-get($fontSizes, sm);
  color: var(--secondary-text-color);
  @include singleLineClamp;
}

.song-count {
  position: absolute;
  top: 0.75rem;
  left: 1.25rem;
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
  line-height: 1.5rem;
  font-size: map-get($fontSizes, xs);
  color: #fff;
  background: rgba(var(--primary-color-rgb), 0.6);
  border-radius: $borderRadiusFull;
  z-index: 2;
}

.icon-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(var(--primary-color-rgb), 0.4);
  border-radius: $borderRadiusFull;
  visibility: hidden;
  opacity: 0;
  transition:
    background-color $transitionDuration,
    opacity $transitionDuration;

  &:hover {
    background: rgba(var(--primary-color-rgb), 1);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #fff;
  }
}

.play-button {
  top: 6rem;
  right: 3.75rem;
  z-index: 3;
}

.shuffle-play-button {
  top: 6rem;
  right: 1.25rem;
  z-index: 4;
}

.vue-recycle-scroller__item-view.hover .icon-button {
  visibility: visible;
  opacity: 1;
}
</style>
