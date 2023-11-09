<script setup lang="ts">
import { PlayIcon } from '@heroicons/vue/24/solid';
import Button from '@renderer/components/base/Button/Button.vue';
import { Order } from '@shared/types';

interface Props {
  sortBy: string;
  order: Order;
  items: { key: string; title: string }[];
}

const props = defineProps<Props>();

const emits = defineEmits<{
  'update:sortBy': [value: string];
  'update:order': [value: Order];
}>();

const onSortButtonClick = (key: string) => {
  const order = key === props.sortBy && props.order === 'ASC' ? 'DESC' : 'ASC';
  if (key !== props.sortBy) {
    emits('update:sortBy', key);
  }
  emits('update:order', order);
};
</script>

<template>
  <div class="sort-widget">
    <span class="label">並び順: </span>
    <Button
      v-for="item of items"
      :key="item.key"
      size="xs"
      text
      class="sort-btn"
      :class="{
        'active-asc': item.key === sortBy && order === 'ASC',
        'active-desc': item.key === sortBy && order === 'DESC',
      }"
      @click="onSortButtonClick(item.key)"
    >
      <span class="btn-label">{{ item.title }}</span>
      <PlayIcon v-if="sortBy === item.key" class="btn-icon" />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.sort-widget {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-size: map-get($fontSizes, sm);
}

.btn-icon {
  flex: 1 0 auto;
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 0.5rem;
  transition: transform $transitionDuration;
}

.sort-btn {
  font-size: map-get($fontSizes, sm);
  padding: 0.75rem 1rem;

  &.active-asc,
  &.active-desc {
    color: var(--primary-color);
    box-shadow: $innerShadow;

    &:enabled:hover {
      color: var(--primary-color);
      box-shadow: $innerShadow;
    }
  }

  &.active-asc {
    .btn-icon {
      transform: rotate(90deg);
    }
  }

  &.active-desc {
    .btn-icon {
      transform: rotate(270deg);
    }
  }
}
</style>
