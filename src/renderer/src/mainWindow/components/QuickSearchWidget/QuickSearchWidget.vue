<script setup lang="ts">
import { computed } from 'vue';

import CloseIcon from '@renderer/assets/icons/close.svg?component';
import SearchIcon from '@renderer/assets/icons/search.svg?component';
import InputText from '@renderer/commonComponents/InputText/InputText.vue';

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{ 'update:modelValue': [modelValue: string] }>();

const text = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});
</script>

<template>
  <div class="quick-search-widget">
    <SearchIcon class="search-icon" />
    <InputText
      v-model="text"
      type="text"
      size="xs"
      select-all-on-focus
      placeholder="検索..."
      class="input-text"
    />
    <CloseIcon v-if="text !== ''" class="close-icon" @click="text = ''" />
  </div>
</template>

<style lang="scss" scoped>
.quick-search-widget {
  position: relative;
  display: inline-block;

  .search-icon {
    position: absolute;
    top: 50%;
    left: 0.5rem;
    transform: translateY(-50%);
    color: var(--primary-color);
    width: 1.5rem;
    height: 1.5rem;
  }

  .input-text {
    padding-left: 2.25rem;
    padding-right: 2.25rem;
  }

  .close-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.5rem;
    color: var(--secondary-text-color);
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;

    &:hover {
      color: red;
    }
  }
}
</style>
