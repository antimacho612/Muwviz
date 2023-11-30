<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatTime, toHyphenIfEmpty } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import RecycleScrollerItem from '@mainWindow/components/RecycleScrollerItem/RecycleScrollerItem.vue';
import Artwork from '@mainWindow/components/Artwork/Artwork.vue';
import BarsAnimation from '@mainWindow/components/BarsAnimation/BarsAnimation.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

interface Props {
  song: Song;
  selected?: boolean;
}
const props = withDefaults(defineProps<Props>(), { selected: false });

type Emits = {
  clickRow: [e: MouseEvent];
  doubleClickRow: [e: MouseEvent];
  clickArtwork: [e: MouseEvent];
  contextmenu: [e: MouseEvent];
  clickEllipsisButton: [e: MouseEvent];
};
const emits = defineEmits<Emits>();

const { isPlaying, currentSong } = useAudioPlayer();
const current = computed(() => props.song.id === currentSong.value?.id);
</script>

<template>
  <RecycleScrollerItem
    height="3.5rem"
    :selected="selected"
    :current="current"
    class="song-list-item"
    @click="emits('clickRow', $event)"
    @dblclick="emits('doubleClickRow', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <Artwork
      :src="song.artworkPath"
      width="44px"
      height="44px"
      :show-play-icon="true"
      class="song-artwork"
      @click.stop="emits('clickArtwork', $event)"
      @dblclick.stop
      @pointerdown.stop
    />

    <div class="main-area">
      <div class="title-and-artist">
        <span class="title">{{ song.title }}</span>
        <div class="artist">
          <RouterLink :to="`/artists/${song.artistId}`">
            {{ toHyphenIfEmpty(song.artist) }}
          </RouterLink>
        </div>
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
      <span class="duration">{{ formatTime(song.duration) }}</span>
    </div>

    <Button
      :icon="EllipsisVerticalIcon"
      size="sm"
      text
      @click.stop="emits('clickEllipsisButton', $event)"
      @pointerdown.stop
      @dblclick.stop
    />
  </RecycleScrollerItem>
</template>

<style lang="scss" scoped>
.song-list-item.current {
  .title,
  .album,
  .duration {
    color: var(--primary-color);
  }

  .artist {
    color: var(--primary-color--lighter);
  }
}

.song-artwork {
  flex: 0 0 auto;
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
  justify-content: center;
  height: 100%;
  line-height: 1.4;
  overflow: hidden;

  .title {
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
@renderer/mainWindow/composables/useAudioPlayer @renderer/utils
