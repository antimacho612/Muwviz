<script setup lang="ts">
import { computed } from 'vue';
import { useAudioPlayer } from '@mainWindow/composables/useAudioPlayer';
import { formatDiskAndTrackNo, formatTime, toHyphenIfEmpty } from '@renderer/commonUtils';
import { Song } from '@shared/types';

import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import RecycleScrollerItem from '@mainWindow/components/RecycleScrollerItem/RecycleScrollerItem.vue';
import BarsAnimation from '@mainWindow/components/BarsAnimation/BarsAnimation.vue';
import Button from '@renderer/commonComponents/Button/Button.vue';

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
  contextmenu: [e: MouseEvent];
  clickEllipsisButton: [e: MouseEvent];
}>();

const { isPlaying, currentSong } = useAudioPlayer();
const current = computed(() => props.song.id === currentSong.value?.id);
</script>

<template>
  <RecycleScrollerItem
    height="2.5rem"
    :selected="selected"
    :current="current"
    @click="emits('clickRow', $event)"
    @dblclick="emits('doubleClickRow', $event)"
    @contextmenu="emits('contextmenu', $event)"
  >
    <div class="disk-and-track-no">{{ formatDiskAndTrackNo(song.diskNo, song.trackNo) }}</div>
    <div class="title-area">
      <div class="title">{{ song.title }}</div>
      <BarsAnimation
        v-if="current"
        :pause="!isPlaying"
        width="1rem"
        height="1.25rem"
        color="var(--primary-color)"
        class="playing-animation"
      />
    </div>
    <RouterLink :to="`/artists/${song.artistId}`" class="artist">
      {{ toHyphenIfEmpty(song.artist) }}
    </RouterLink>
    <div class="duration">{{ formatTime(song.duration) }}</div>
    <Button
      :icon="EllipsisVerticalIcon"
      size="xs"
      text
      @click.stop="emits('clickEllipsisButton', $event)"
      @pointerdown.stop
      @dblclick.stop
    />
  </RecycleScrollerItem>
</template>

<style lang="scss" scoped>
.scroller-item.current {
  .disk-and-track-no,
  .title,
  .artist,
  .duration {
    color: var(--primary-color);
  }
}

.disk-and-track-no,
.title,
.artist,
.duration {
  font-size: map-get($fontSizes, md);
}

.disk-and-track-no {
  flex: 0 0 auto;
  width: 2.5rem;
}

.title-area {
  flex: 1 1 auto;
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    flex: 1 1 auto;
    @include singleLineClamp;
  }

  .playing-animation {
    flex: 0 0 auto;
    margin-left: 0.5rem;
  }
}

.artist {
  flex: 1 1 auto;
  width: 20%;
  @include singleLineClamp;
}

.duration {
  flex: 0 0 auto;
}
</style>
@renderer/mainWindow/composables/useAudioPlayer @renderer/utils
