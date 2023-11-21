<script setup lang="ts">
import { MusicalNoteIcon, PlayIcon } from '@heroicons/vue/24/solid';
import { computed, ref, watch } from 'vue';

interface Props {
  src?: string;
  width?: string;
  height?: string;
  showPlayIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPlayIcon: false,
});

const emits = defineEmits<{
  click: [e: MouseEvent];
}>();

const artworkImgSrc = computed(() => (props.src ? `media://${props.src}` : ''));

const showAltIcon = ref(false);

const onClick = (e: MouseEvent) => {
  emits('click', e);
};

const onImgError = () => {
  showAltIcon.value = true;
};

watch(
  () => props.src,
  () => {
    showAltIcon.value = false;
  }
);
</script>

<template>
  <div class="artwork" :style="{ width, height }" @click="onClick">
    <img
      v-if="!showAltIcon"
      :src="artworkImgSrc"
      alt="artwork"
      referrerpolicy="no-referrer"
      class="artwork-img"
      @error="onImgError"
    />
    <MusicalNoteIcon v-else class="icon-no-artwork" />

    <div v-if="showPlayIcon" class="play-button">
      <PlayIcon class="play-button-icon"></PlayIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.artwork {
  position: relative;
  line-height: 1;
  background: var(--artist-img-bg-color);
  border-radius: $borderRadiusMd;
}

.artwork-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  background: #fff;
  border-radius: $borderRadiusMd;
}

.icon-no-artwork {
  height: 90%;
  width: 90%;
  margin: 5%;
  color: var(--artist-img-icon-color);
  border-radius: $borderRadiusMd;
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
