<script setup lang="ts">
import { ArrowSmallLeftIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/components/base/Button/Button.vue';

withDefaults(defineProps<{ to: string; size?: 'xs' | 'sm' | 'md' | 'lg' }>(), {
  size: 'sm',
});
</script>

<template>
  <Button size="sm" text :icon="ArrowSmallLeftIcon" @click="$router.push(to)" />
</template>
