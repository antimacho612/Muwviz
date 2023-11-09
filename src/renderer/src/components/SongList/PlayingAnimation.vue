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
  <div class="playing-animation" :class="{ pause: pause }" :style="{ width, height }">
    <span
      v-for="n in 3"
      :key="n"
      class="playing-animation-bar"
      :style="{ background: color }"
    ></span>
  </div>
</template>

<style lang="scss" scoped>
.playing-animation {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .playing-animation-bar {
    display: inline-block;
    background: var(--primary-text-color);
    width: 25%;
    height: 100%;
    animation: up-and-down 1.3s ease infinite alternate;

    &:nth-child(1) {
      height: 60%;
    }

    &:nth-child(2) {
      height: 30%;
      animation-delay: -2.2s;
    }

    &:nth-child(3) {
      height: 75%;
      animation-delay: -3.7s;
    }
  }

  &.pause .playing-animation-bar {
    animation-play-state: paused;
  }
}

@keyframes up-and-down {
  10% {
    height: 30%;
  }

  30% {
    height: 100%;
  }

  60% {
    height: 50%;
  }

  80% {
    height: 75%;
  }

  100% {
    height: 60%;
  }
}
</style>
