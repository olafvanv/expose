import { computed, Signal } from '@angular/core';

export type FormOption<T = string> = {
  value: T;
  label: string;
};

export function toFormOptions<I, O extends string | number>(
  items: I[],
  valueFn: (item: I) => O,
  labelFn: (item: I) => string,
): FormOption<O>[] {
  return items.map((item) => ({
    label: labelFn(item),
    value: valueFn(item),
  }));
}

/**
 * Returns an computed signal with a mapped FormOption array as value.
 * Takes a signal as input
 */
export function toFormOptionsComputed<I, O extends string | number>(
  items: Signal<I[]>,
  valueFn: (item: I) => O,
  labelFn: (item: I) => string,
) {
  return computed(() => toFormOptions(items(), valueFn, labelFn));
}
