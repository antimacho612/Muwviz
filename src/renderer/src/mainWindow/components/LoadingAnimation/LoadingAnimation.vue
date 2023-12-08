<script setup lang="ts">
interface Props {
  size?: string;
  color?: string;
}
withDefaults(defineProps<Props>(), {
  size: '40px',
  color: 'var(--primary-color)',
});
</script>

<template>
  <svg viewBox="0 0 40 40" class="loading-animation" aria-hidden="true">
    <defs>
      <path
        id="arc"
        d="M 7.27 32.73 C 0.24 25.7 0.24 14.3 7.27 7.27"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        id="arc-inner"
        d="M 12.22 27.78 C 7.93 23.48 7.93 16.52 12.22 12.22"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </defs>

    <g transform-origin="20 20" class="circle-outer">
      <use href="#arc" />
      <use href="#arc" transform="rotate(180 20 20)" />
    </g>
    <g transform-origin="20 20" class="circle-inner">
      <use href="#arc-inner" />
      <use href="#arc-inner" transform="rotate(180 20 20)" />
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.loading-animation {
  height: v-bind(size);
  width: v-bind(size);
  color: v-bind(color);

  .circle-outer {
    @include animation(
      $name: rotate,
      $duration: 1s,
      $timingFunction: ease-in-out,
      $iterationCount: infinite
    );
  }

  .circle-inner {
    @include animation(
      $name: rotate,
      $duration: 0.5s,
      $timingFunction: ease-in-out,
      $direction: reverse,
      $iterationCount: infinite
    );
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.6);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
</style>
