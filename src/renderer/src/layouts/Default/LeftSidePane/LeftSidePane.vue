<script setup lang="ts">
import { provide, ref } from 'vue';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

import SongDetailModal from './SongDetailModal.vue';
import Button from '@renderer/components/base/Button/Button.vue';
import Links from './Links.vue';
import { Song } from '@shared/types';

const isCollapsed = ref(false);

const onSidebarToggleClick = () => {
  isCollapsed.value = !isCollapsed.value;
};

const onLinkClick = () => (isCollapsed.value = false);

const isModalOpen = ref(false);
const modalSong = ref<Song | undefined>();

const showSongDetailModal = (song: Song) => {
  modalSong.value = song;
  isModalOpen.value = true;
};

provide('showSongDetailModal', showSongDetailModal);
</script>

<template>
  <aside class="left-side-pane" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidenav" :inert="isModalOpen">
      <div class="links-container">
        <Links @click="onLinkClick" />
      </div>
      <div class="left-pane-toggle">
        <Button
          :icon="ChevronLeftIcon"
          size="lg"
          text
          class="toggle-button"
          @click="onSidebarToggleClick"
        />
      </div>
    </div>
    <div class="left-pane-main" :inert="isModalOpen">
      <RouterView v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component"></component>
        </transition>
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
  width: $sidebarExpandedWidth;
  max-width: 90vw;
  padding: 1rem $sidebarPaddingX;
  border-radius: $borderRadiusXl;
  transition: width $transitionDuration cubic-bezier(0.18, 0.89, 0.32, 1.1);
  background: var(--background-color);
  box-shadow: $shadow;
  overflow: hidden;

  &.is-collapsed {
    width: $sidebarCollapsedWidth;
  }
}

.toggle-button :deep(.c-btn-icon) {
  transition: transform $transitionDuration ease-in-out;
}
.left-side-pane.is-collapsed .toggle-button :deep(.c-btn-icon) {
  transform: rotate(-180deg);
}

.sidenav {
  flex: 0 0 $sidebarLinksWidth;
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
  border-top: 2px solid rgba(200, 200, 200, 0.4);
  text-align: center;
}

.left-pane-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left-side-pane.is-collapsed {
  .left-pane-main {
    visibility: hidden;
  }
}
</style>
