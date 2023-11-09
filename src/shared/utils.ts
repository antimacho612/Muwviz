import { Order, Song, SongsSortKey, SortOption } from './types';

export const isEmpty = <T>(value: T | undefined): value is undefined =>
  typeof value === 'undefined' || value === null;

export const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max + 1 - min)) + min;

export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = getRandomInt(i);
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
};

export const sortArrayOfObjects = <T>(array: T[], sortOptions: SortOption<T>[]) => {
  const compareFn = (a: T, b: T) => {
    let collator: Intl.Collator | undefined;

    for (const opt of sortOptions) {
      const [first, second] =
        opt.order !== 'DESC' ? [a[opt.key], b[opt.key]] : [b[opt.key], a[opt.key]];

      if (first && second) {
        if (typeof first === 'number' && typeof second === 'number') {
          return first - second;
        }

        if (typeof first === 'string' && typeof second === 'string') {
          if (!collator) collator = new Intl.Collator('ja');
          return collator.compare(first, second);
        }

        if (Array.isArray(first) && Array.isArray(second)) {
          if (!collator) collator = new Intl.Collator('ja');
          return collator.compare(first.join(' '), second.join(' '));
        }

        return 0;
      }

      if (first) {
        return -1;
      }

      if (second) {
        return 1;
      }

      return 0;
    }

    return 0;
  };

  return array.sort(compareFn);
};

export const getSongsSortOptions = (key: SongsSortKey, order: Order): SortOption<Song>[] => {
  switch (key) {
    case 'Artist':
      return [
        { key: 'artist', order },
        { key: 'album' },
        { key: 'diskNo' },
        { key: 'trackNo' },
        { key: 'title' },
      ];
    case 'Album':
      return [
        { key: 'album', order },
        { key: 'diskNo' },
        { key: 'trackNo' },
        { key: 'artist' },
        { key: 'title' },
      ];
    case 'Title':
      return [
        { key: 'title', order },
        { key: 'artist' },
        { key: 'album' },
        { key: 'diskNo' },
        { key: 'trackNo' },
      ];
    case 'PlayCount':
      // TODO:
      return [
        { key: 'artist', order },
        { key: 'album' },
        { key: 'diskNo' },
        { key: 'trackNo' },
        { key: 'title' },
      ];
  }
};
