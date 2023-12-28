<script setup lang="ts">
import { useRouter } from 'vue-router';
import BackIcon from '@renderer/assets/icons/back.svg?component';
import Button from '@renderer/commonComponents/Button/Button.vue';

interface Props {
  to: string | 'Back';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
const props = withDefaults(defineProps<Props>(), { size: 'sm' });

const router = useRouter();
const onClick = () => {
  if (props.to === 'Back') router.back();
  else router.push(props.to);
};
</script>

<template>
  <Button size="sm" text :icon="BackIcon" @click="onClick" />
</template>
