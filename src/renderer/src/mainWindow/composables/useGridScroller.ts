import { Ref, onMounted, readonly, ref } from 'vue';

export const useGridScroller = (
  wrapperEl: Ref<HTMLDivElement | undefined>,
  wrapperPadding: number,
  baseItemWidth: number
) => {
  const itemsPerRow = ref(1);
  const itemWidth = ref(baseItemWidth);

  const resizeScroller = () => {
    if (wrapperEl.value) {
      const scrollerWidth = wrapperEl.value.clientWidth - wrapperPadding;
      itemsPerRow.value = Math.floor(scrollerWidth / baseItemWidth);
      itemWidth.value = scrollerWidth / itemsPerRow.value;
    } else {
      itemsPerRow.value = 1;
      itemWidth.value = baseItemWidth;
    }
  };

  onMounted(() => resizeScroller());

  return {
    itemsPerRow: readonly(itemsPerRow),
    itemWidth: readonly(itemWidth),
    resizeScroller,
  };
};
