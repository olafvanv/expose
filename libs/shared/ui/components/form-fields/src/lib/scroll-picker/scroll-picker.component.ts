import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

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
})
export class ScrollPicker implements AfterViewInit {
  private readonly injector = inject(Injector);

  public options = input.required<ScrollPickerOption[]>();
  public value = model<string | number | null>(null);

  public scrollRef = viewChild<ElementRef>('scrollRef');

  public showLeftFade = signal(false);
  public showRightFade = signal(false);

  ngAfterViewInit(): void {
    this.scrollToActive();

    const el: HTMLElement = this.scrollRef()?.nativeElement;

    if (!el) return;

    el.addEventListener('scroll', () => {
      this.updateScrollFades(el);
    });

    this.updateScrollFades(el);
  }

  public select(val: string | number): void {
    this.value.set(val);

    afterNextRender(
      () => {
        this.scrollToActive();
      },
      { injector: this.injector },
    );
  }

  private updateScrollFades(el: HTMLElement) {
    this.showLeftFade.set(el.scrollLeft > 0);
    this.showRightFade.set(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }

  private scrollToActive(): void {
    const el = this.scrollRef()?.nativeElement as HTMLElement;

    if (!el) return;

    const active = el.querySelector('.picker-item--active') as HTMLElement;

    console.log(el, active);
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}
