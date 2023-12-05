<script setup lang="ts">
import { ref } from 'vue';
import InputText from '../InputText/InputText.vue';

interface Props {
  modelValue?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  selectAllOnFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selectAllOnFocus: false,
});

const emits = defineEmits<{ 'update:modelValue': [value: number] }>();

const handleMinMax = (num: number) => {
  if (props.min !== undefined && props.max !== undefined) {
    return Math.min(Math.max(num, props.min), props.max);
  } else if (props.min) {
    return Math.max(num, props.min);
  } else if (props.max) {
    return Math.min(num, props.max);
  } else {
    return num;
  }
};

const inputText = ref(handleMinMax(props.modelValue ?? 0).toString());

const updateValue = (value: string) => {
  let num = Number.parseFloat(value);
  if (num === null || Number.isNaN(num)) num = 0;
  const newValue = handleMinMax(num);
  inputText.value = newValue.toString();
  emits('update:modelValue', newValue);
};
</script>

<template>
  <InputText
    :model-value="inputText"
    :size="size"
    :select-all-on-focus="selectAllOnFocus"
    type="number"
    :min="min"
    :max="max"
    @update:model-value="updateValue"
  />
</template>
