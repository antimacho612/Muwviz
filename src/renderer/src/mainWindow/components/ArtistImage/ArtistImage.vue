<script setup lang="ts">
import { UserIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <div class="artist-image">
    <UserIcon class="artist-image-icon" />
  </div>
</template>

<style lang="scss" scoped>
.artist-image {
  background: var(--artist-img-bg-color);
  border-radius: $borderRadiusMd;
  z-index: 1;
}

.artist-image-icon {
  color: var(--artist-img-icon-color);
}
</style>
