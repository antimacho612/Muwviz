<script setup lang="ts">
import { provide, ref } from 'vue';
import { showSongDetailModalKey } from '@mainWindow/injectionKeys';
import { Song } from '@shared/types';

import ChevronLeftIcon from '@renderer/assets/icons/chevron-left.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';
import Links from './Links.vue';
import SongDetailModal from './SongDetailModal.vue';

defineProps<{ isCollapsed: boolean }>();
const emits = defineEmits<{ 'update:isCollapsed': [value: boolean] }>();

const isModalOpen = ref(false);
const modalSong = ref<Song | undefined>();

const showSongDetailModal = (song: Song) => {
  modalSong.value = song;
  isModalOpen.value = true;
};
provide(showSongDetailModalKey, showSongDetailModal);
</script>

<template>
  <aside class="left-side-pane" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidenav" :inert="isModalOpen">
      <div class="links-container">
        <Links @click="emits('update:isCollapsed', false)" />
      </div>
      <div class="left-pane-toggle">
        <Button
          :icon="ChevronLeftIcon"
          size="lg"
          text
          class="toggle-button"
          @click="emits('update:isCollapsed', !isCollapsed)"
        />
      </div>
    </div>
    <div class="left-pane-main" :inert="isModalOpen">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in" enter-active-class="page-fade-in" leave-active-class="page-fade-out">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>

    <SongDetailModal v-model:is-open="isModalOpen" :song="modalSong" />
  </aside>
</template>

<style lang="scss" scoped>
.left-side-pane {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  gap: 1.5rem;
  height: 100%;
  width: $sideNavExpandedWidth;
  max-width: 100vw;
  padding: 1rem $sideNavPaddingX;
  border-radius: $borderRadiusXl;
  transition: width $transitionDuration cubic-bezier(0.18, 0.89, 0.32, 1.1);
  background: var(--background-color);
  box-shadow: $shadow;
  overflow: hidden;

  &.is-collapsed {
    width: $sideNavCollapsedWidth;
  }
}

.toggle-button :deep(.c-btn-icon) {
  transition: transform $transitionDuration ease-in-out;
}
.left-side-pane.is-collapsed .toggle-button :deep(.c-btn-icon) {
  transform: rotate(-180deg);
}

.sidenav {
  flex: 0 0 $sideNavLinksWidth;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.links-container {
  margin: auto 0;
}

.left-pane-toggle {
  padding-top: 1rem;
  border-top: 2px solid var(--divider-color);
  text-align: center;
}

.left-pane-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left-side-pane {
  &:not(.is-collapsed) .left-pane-main {
    @include animation($name: fadeIn, $delay: 0.25s, $fillMode: both);
  }

  &.is-collapsed .left-pane-main {
    display: none;
  }
}

.page-fade-in {
  @include animation($name: fadeIn);
}

.page-fade-out {
  @include animation($name: fadeOut);
}
</style>
