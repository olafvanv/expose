import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, TouchedChangeEvent } from '@angular/forms';
import { FormOption } from '@expose/util';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'lib-grid-picker',
  imports: [NgIconComponent],
  templateUrl: './grid-picker.component.html',
  styleUrl: './grid-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridPicker implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);

  public readonly control = input.required<FormControl>();
  public readonly options = input.required<FormOption[]>();

  protected readonly value = signal<unknown>(null);
  public readonly isTouched = signal(false);

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

  public select(val: unknown): void {
    if (this.control().disabled) return;
    this.control().setValue(val);
    this.control().markAsTouched();
  }
}
