import { computed, Signal } from '@angular/core';

export type FormOption<T extends string | number = string> = {
  value: T;
  label: string;
  icon?: string;
};

export type FormOptionsParams<I, O extends string | number> = {
  valueFn: (item: I) => O;
  labelFn: (item: I) => string;
  iconFn?: (item: I) => string;
};

/**
 * Returns an computed signal with a mapped FormOption array as value.
 * Takes a signal as input
 */
export function toFormOptionsComputed<I, O extends string | number>(
  items: Signal<I[]>,
  params: FormOptionsParams<I, O>,
): Signal<FormOption<O>[]> {
  return computed(() => toFormOptions(items(), params));
}

/**
 * Returns an array of FormOptions for form controls with pre-defined options.
 * Takes an array of type I as input
 * @param items
 * @param params
 * @returns
 */
export function toFormOptions<I, O extends string | number>(items: I[], params: FormOptionsParams<I, O>): FormOption<O>[] {
  return items.map((item) => ({
    label: params.labelFn(item),
    value: params.valueFn(item),
    icon: params.iconFn ? params.iconFn(item) : undefined,
  }));
}
