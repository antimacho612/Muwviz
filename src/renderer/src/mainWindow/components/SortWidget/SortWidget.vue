<script setup lang="ts">
import { PlayIcon } from '@heroicons/vue/24/solid';
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import Button from '@renderer/commonComponents/Button/Button.vue';
import { Order } from '@shared/types';

interface Props {
  sortBy: string;
  order: Order;
  items: { key: string; label: string }[];
}
const props = defineProps<Props>();

type Emits = {
  'update:sortBy': [value: string];
  'update:order': [value: Order];
};
const emits = defineEmits<Emits>();

const onSortButtonClick = (key: string) => {
  const order = key === props.sortBy && props.order === 'Asc' ? 'Desc' : 'Asc';
  if (key !== props.sortBy) {
    emits('update:sortBy', key);
  }
  emits('update:order', order);
};
</script>

<template>
  <div class="sort-widget">
    <Button
      v-for="item of items"
      :key="item.key"
      size="xs"
      text
      class="sort-btn"
      :class="{
        'active-asc': item.key === sortBy && order === 'Asc',
        'active-desc': item.key === sortBy && order === 'Desc',
      }"
      @click="onSortButtonClick(item.key)"
    >
      <span class="btn-label">{{ item.label }}</span>
      <PlayIcon v-if="sortBy === item.key" class="btn-icon" />
      <ChevronUpDownIcon v-else class="btn-icon icon-up-down" />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.sort-widget {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  flex: 1 0 auto;
  padding: 0 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  transition: transform $transitionDuration;

  &.icon-up-down {
    padding: 0;
  }
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
