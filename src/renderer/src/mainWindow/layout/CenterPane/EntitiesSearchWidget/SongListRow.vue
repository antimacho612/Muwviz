<script setup lang="ts">
import { formatAlbumTitle, formatArtistName, formatTime } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import RecycleScrollerItem from '@mainWindow/components/RecycleScrollerItem/RecycleScrollerItem.vue';

defineProps<{ song: Song }>();

type Emits = {
  doubleClickRow: [e: MouseEvent];
  clickAlbumLink: [e: MouseEvent];
  clickArtistLink: [e: MouseEvent];
};
const emits = defineEmits<Emits>();
</script>

<template>
  <RecycleScrollerItem height="2rem" @dblclick="emits('doubleClickRow', $event)">
    <div class="title">{{ song.title }}</div>
    <div class="artist">
      <a @click="emits('clickArtistLink', $event)" @dblclick.stop @pointerdown.stop>
        {{ formatArtistName(song.artist) }}
      </a>
    </div>
    <div class="album">
      <a @click="emits('clickAlbumLink', $event)" @dblclick.stop @pointerdown.stop>
        {{ formatAlbumTitle(song.album) }}
      </a>
    </div>
    <div class="duration">{{ formatTime(song.duration) }}</div>
  </RecycleScrollerItem>
</template>

<style lang="scss" scoped>
.title {
  flex: 1 1 auto;
  width: 60%;
  font-size: map-get($fontSizes, md);
  @include singleLineClamp;
}

.artist,
.album,
.duration {
  font-size: map-get($fontSizes, sm);
  color: var(--secondary-text-color);
}

.artist {
  flex: 1 1 auto;
  width: 15%;
  @include singleLineClamp;
}

.album {
  flex: 1 1 auto;
  width: 15%;
  @include singleLineClamp;
}

.duration {
  flex: 0 0 auto;
}
</style>
