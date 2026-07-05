import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, TouchedChangeEvent } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

export type CounterOptions = {
  max?: number;
  min?: number;
  steps?: number;
};

@Component({
  selector: 'lib-counter',
  imports: [NgIcon],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideMinus,
      lucidePlus,
    }),
  ],
})
export class CounterComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);

  public readonly control = input.required<FormControl>();
  public readonly options = input<CounterOptions | null>(null);
  public readonly label = input<string>('');

  protected readonly value = signal<number>(0);
  public readonly isTouched = signal(false);

  public readonly min = computed(() => this.options()?.min ?? 0);
  public readonly max = computed(() => this.options()?.max);
  public readonly steps = computed(() => this.options()?.steps ?? 1);

  ngOnInit(): void {
    if (this.control().value) {
      this.value.set(this.control().value ?? this.min());
    } else {
      this.control().setValue(this.min());
    }

    this.control()
      .events.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ev) => {
        if (ev instanceof TouchedChangeEvent) {
          this.isTouched.set(true);
        }

        if (this.control().value) {
          this.value.set(this.control().value);
        }

        this.cdRef.markForCheck();
      });
  }

  public subtract(): void {
    if (this.value() === this.min()) return;

    this.control().setValue(this.value() - this.steps());
  }

  public add(): void {
    if (this.value() === this.max()) return;

    this.control().setValue(this.value() + this.steps());
  }
}
