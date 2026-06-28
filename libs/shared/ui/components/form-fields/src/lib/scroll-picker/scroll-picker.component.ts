import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, TouchedChangeEvent } from '@angular/forms';
import { filter } from 'rxjs';

export type ScrollPickerOption = {
  value: string | number;
  label: string;
};

@Component({
  selector: 'lib-scroll-picker',
  imports: [],
  templateUrl: './scroll-picker.component.html',
  styleUrl: './scroll-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScrollPicker),
      multi: true,
    },
  ],
})
export class ScrollPicker implements ControlValueAccessor, OnInit, AfterViewInit {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);

  public readonly control = input.required<FormControl<unknown>>();
  public readonly options = input.required<ScrollPickerOption[]>();
  public readonly label = input<string>('');

  public readonly scrollRef = viewChild<ElementRef>('scrollRef');

  public readonly showLeftFade = signal(false);
  public readonly showRightFade = signal(false);

  /** Internally tracked selected value, kept in sync with the form control. */
  public readonly value = signal<string | number | null>(null);

  /** Whether the form control is disabled. */
  public readonly isDisabled = signal(false);

  public readonly isTouched = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string | number | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  ngOnInit(): void {
    this.control()
      .events.pipe(
        filter((ev) => ev instanceof TouchedChangeEvent),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.cdRef.markForCheck());
  }

  public ngAfterViewInit(): void {
    this.scrollToActive();

    const el: HTMLElement = this.scrollRef()?.nativeElement;
    if (!el) return;

    el.addEventListener('scroll', () => this.updateScrollFades(el));
    this.updateScrollFades(el);
  }

  /**
   * Selects an option, updates the internal signal, and notifies the form control.
   */
  public select(val: string | number): void {
    if (this.isDisabled()) return;

    this.value.set(val);
    this._onChange(val);
    this._onTouched();

    afterNextRender(() => this.scrollToActive(), { injector: this.injector });
  }

  /**
   * Called by Angular forms when the model value changes externally.
   */
  public writeValue(value: string | number | null): void {
    this.value.set(value ?? null);
    afterNextRender(() => this.scrollToActive(), { injector: this.injector });
  }

  /**
   * Registers the onChange callback provided by Angular forms.
   */
  public registerOnChange(fn: (value: string | number | null) => void): void {
    this._onChange = fn;
  }

  /**
   * Registers the onTouched callback provided by Angular forms.
   */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Called by Angular forms when the disabled state changes.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private updateScrollFades(el: HTMLElement): void {
    this.showLeftFade.set(el.scrollLeft > 0);
    this.showRightFade.set(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }

  private scrollToActive(): void {
    const el = this.scrollRef()?.nativeElement as HTMLElement;
    if (!el) return;

    const active = el.querySelector('.picker-item--active') as HTMLElement;
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}
