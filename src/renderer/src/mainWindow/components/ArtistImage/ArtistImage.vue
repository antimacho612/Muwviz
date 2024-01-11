<script setup lang="ts">
import UserIcon from '@renderer/assets/icons/user.svg?component';
import PlayIcon from '@renderer/assets/icons/play.svg?component';

withDefaults(defineProps<{ showPlayIcon?: boolean }>(), { showPlayIcon: false });

const emits = defineEmits<{ click: [e: MouseEvent] }>();
</script>

<template>
  <div class="artist-image" @click="emits('click', $event)">
    <UserIcon class="artist-image-icon" />

    <div v-if="showPlayIcon" class="play-button">
      <PlayIcon class="play-button-icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.artist-image {
  position: relative;
  background: var(--artist-img-bg-color);
  border-radius: $borderRadiusMd;
  z-index: 1;
}

.artist-image-icon {
  color: var(--artist-img-icon-color);
}

.play-button {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $borderRadiusMd;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  cursor: pointer;
  transition: opacity $transitionDuration;

  &:hover {
    opacity: 1;
  }
}

.play-button-icon {
  color: #fff;
  height: 75%;
  width: 75%;
}
</style>
