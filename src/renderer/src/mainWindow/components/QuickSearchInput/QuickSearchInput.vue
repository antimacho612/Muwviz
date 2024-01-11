<script setup lang="ts">
import { computed, ref } from 'vue';

import CloseIcon from '@renderer/assets/icons/close.svg?component';
import SearchIcon from '@renderer/assets/icons/search.svg?component';
import InputText from '@renderer/commonComponents/InputText/InputText.vue';

interface Props {
  modelValue: string;
  size?: 'xs' | 'sm';
}
const props = withDefaults(defineProps<Props>(), { size: 'xs' });

type Emits = {
  'update:modelValue': [value: string];
  focus: [e: FocusEvent];
  blur: [e: FocusEvent];
};
const emits = defineEmits<Emits>();

const text = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

const focused = ref(false);
const onFocus = (e: FocusEvent) => {
  focused.value = true;
  emits('focus', e);
};
const onBlur = (e: FocusEvent) => {
  focused.value = false;
  emits('blur', e);
};

const showCloseButton = computed(() => text.value !== '');
const onClickCloseButton = () => {
  text.value = '';
};
</script>

<template>
  <div class="quick-search-widget" :class="{ focused: focused }">
    <SearchIcon class="search-icon" />
    <InputText
      v-model="text"
      type="text"
      :size="size"
      select-all-on-focus
      placeholder="検索..."
      class="input-text"
      @focus="onFocus"
      @blur="onBlur"
    />
    <CloseIcon v-if="showCloseButton" class="close-icon" @click="onClickCloseButton" />
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
    color: var(--secondary-text-color);
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    transition: color $transitionDuration;
  }

  &.focused,
  &:hover {
    .search-icon {
      color: var(--primary-color);
    }
  }

  .input-text {
    width: 100%;
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
    transition: color $transitionDuration;

    &:hover {
      color: red;
    }
  }
}
</style>
