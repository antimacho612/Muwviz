<script setup lang="ts">
import { ref } from 'vue';
import InfoTab from './InfoTab.vue';
import QueueTab from './QueueTab.vue';
import LyricsTab from './LyricsTab.vue';

const activeMenuIndex = ref(0);
const TABS = [
  {
    title: 'Info',
    component: InfoTab,
  },
  {
    title: 'Queue',
    component: QueueTab,
  },
  {
    title: 'Lyrics',
    component: LyricsTab,
  },
  {
    title: 'Visualizer',
    component: LyricsTab,
  },
] as const;
</script>

<template>
  <div class="right-side-pane">
    <div class="tab-menu">
      <button
        v-for="(tab, i) in TABS"
        :key="tab.title"
        type="button"
        class="tab-button"
        :class="{ active: i === activeMenuIndex }"
        @click="activeMenuIndex = i"
      >
        {{ tab.title }}
      </button>
      <div class="active-menu-color"></div>
    </div>
    <div class="tab-panel">
      <Transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut">
        <KeepAlive>
          <component :is="TABS[activeMenuIndex].component" />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-side-pane {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border-radius: $borderRadiusXl;
  background: var(--background-color);
  box-shadow: $shadow;
  overflow: hidden;
}

.tab-menu {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  .tab-button {
    height: 2rem;
    width: 4.5rem;
    font-size: map-get($fontSizes, sm);
    font-weight: 500;
    color: var(--secondary-text-color);
    background: var(--background-color);
    border: none;
    cursor: pointer;

    &.active {
      color: var(--primary-color);
    }

    &:hover {
      color: var(--primary-color);
    }

    &:focus-visible {
      @include focused();
    }
  }

  .active-menu-color {
    position: absolute;
    height: 2rem;
    width: 4.5rem;
    left: 0;
    border-radius: $borderRadiusSm;
    box-shadow: $innerShadow;
    transition: transform $transitionDuration cubic-bezier(0.66, -0.3, 0.33, 1.4);
    pointer-events: none;
  }

  @for $i from 1 through 5 {
    .tab-button:nth-child(#{$i}).active ~ .active-menu-color {
      $idx: $i - 1;
      $x: (5rem * $idx);
      transform: translateX($x);
    }
  }
}

.tab-panel {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.fadeIn {
  @include animation($name: fadeIn);
}

.fadeOut {
  @include animation($name: fadeOut);
}
</style>
