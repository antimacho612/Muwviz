<script setup lang="ts">
import { computed } from 'vue';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import InputText from '@renderer/components/base/InputText/InputText.vue';

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{ 'update:modelValue': [modelValue: string] }>();

const text = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});
</script>

<template>
  <div class="quick-search-widget">
    <MagnifyingGlassIcon class="icon-search" />
    <InputText
      v-model="text"
      type="text"
      size="sm"
      select-all-on-focus
      placeholder="検索..."
      class="input-text"
    />
    <XMarkIcon v-if="text !== ''" class="icon-x" @click="text = ''" />
  </div>
</template>

<style lang="scss">
.quick-search-widget {
  position: relative;
  display: inline-block;

  .icon-search {
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

  .icon-x {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.5rem;
    color: var(--secondary-text-color);
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
  }
}
</style>
