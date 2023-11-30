<script setup lang="ts">
interface Props {
  pause?: boolean;
  width?: string;
  height?: string;
  color?: string;
}

withDefaults(defineProps<Props>(), {
  pause: false,
  width: '40px',
  height: '40px',
});
</script>

<template>
  <div class="bars-animation" :class="{ pause: pause }" :style="{ width, height }">
    <span v-for="n in 3" :key="n" class="bars-animation-bar" :style="{ background: color }"></span>
  </div>
</template>

<style lang="scss" scoped>
.bars-animation {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .bars-animation-bar {
    display: inline-block;
    background: var(--primary-text-color);
    width: 25%;
    height: 100%;

    @include animation(
      $name: up-and-down,
      $duration: 1.2s,
      $iterationCount: infinite,
      $direction: alternate
    );

    &:nth-child(1) {
      height: 60%;
    }

    &:nth-child(2) {
      height: 20%;
      animation-delay: -2.2s;
    }

    &:nth-child(3) {
      height: 85%;
      animation-delay: -3.7s;
    }
  }

  &.pause .bars-animation-bar {
    animation-play-state: paused;
  }
}
</style>
