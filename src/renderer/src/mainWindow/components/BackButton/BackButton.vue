<script setup lang="ts">
import { ArrowSmallLeftIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/commonComponents/Button/Button.vue';

interface Props {
  to: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), { size: 'sm' });
</script>

<template>
  <Button size="sm" text :icon="ArrowSmallLeftIcon" @click="$router.push(to)" />
</template>
