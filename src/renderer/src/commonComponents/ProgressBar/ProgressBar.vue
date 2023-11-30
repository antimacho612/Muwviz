<script setup lang="ts">
withDefaults(defineProps<{ value: number }>(), {
  value: 0,
});
</script>

<template>
  <div class="c-progress-bar">
    <div class="c-progress-bar-value" :style="{ width: `${value}%` }">
      <span class="c-progress-bar-value-text">
        <slot>{{ value }}%</slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.c-progress-bar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  border-radius: $borderRadiusFull;
  box-shadow: $innerShadow;
}

.c-progress-bar-value {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: right;
  height: 100%;
  width: 0;
  font-size: map-get($fontSizes, sm);
  color: white;
  background: linear-gradient(to right, var(--primary-color), var(--primary-color--lighter));
  border-radius: $borderRadiusFull;
  overflow: hidden;
  transition: width 0.1s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 5rem;
    background: rgba(var(--primary-color--lightest-rgb), 0.3);
    border-radius: $borderRadiusFull;
    z-index: 1;

    @include animation(
      $name: left-to-right,
      $duration: 2s,
      $timingFunction: ease-in-out,
      $delay: 1s,
      $iterationCount: infinite
    );
  }
}

.c-progress-bar-value-text {
  margin-right: 0.5rem;
  z-index: 2;
}

@keyframes left-to-right {
  from {
    left: -5rem;
  }
  to {
    left: 100%;
  }
}
</style>
