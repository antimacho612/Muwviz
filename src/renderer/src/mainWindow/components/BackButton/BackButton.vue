<script setup lang="ts">
import BackIcon from '@renderer/assets/icons/back.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';

interface Props {
  to: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
withDefaults(defineProps<Props>(), { size: 'sm' });
</script>

<template>
  <Button size="sm" text :icon="BackIcon" @click="$router.push(to)" />
</template>
