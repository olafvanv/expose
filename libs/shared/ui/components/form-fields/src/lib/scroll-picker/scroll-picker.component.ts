import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, TouchedChangeEvent } from '@angular/forms';
import { FormOption } from '@expose/util';

@Component({
  selector: 'lib-scroll-picker',
  imports: [],
  templateUrl: './scroll-picker.component.html',
  styleUrl: './scroll-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollPicker implements OnInit, AfterViewInit {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);

  public readonly control = input.required<FormControl<unknown>>();
  public readonly options = input.required<FormOption<string | number>[]>();
  public readonly label = input<string>('');

  public readonly scrollRef = viewChild<ElementRef>('scrollRef');

  public readonly showLeftFade = signal(false);
  public readonly showRightFade = signal(false);

  public readonly isTouched = signal(false);

  protected readonly value = signal<unknown>(null);

  ngOnInit(): void {
    this.value.set(this.control().value);

    this.control()
      .events.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ev) => {
        if (ev instanceof TouchedChangeEvent) {
          this.isTouched.set(true);
        }

        this.value.set(this.control().value);
        this.cdRef.markForCheck();
      });
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
    if (this.control().disabled) return;

    this.control().setValue(val);

    afterNextRender(() => this.scrollToActive(), { injector: this.injector });
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
