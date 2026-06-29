import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, TouchedChangeEvent } from '@angular/forms';
import { FormOption } from '@expose/util';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { take } from 'rxjs';

@Component({
  selector: 'lib-select-input',
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
  imports: [ReactiveFormsModule, CdkTrapFocus, NgIcon],
  providers: [
    provideIcons({
      lucideCheck,
    }),
  ],
})
export class SelectInputComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  public control = input.required<FormControl<string | number | null>>();
  public label = input.required<string>();
  public options = input.required<FormOption[]>();
  public placeholder = input<string>();
  public id = input<string>();

  public readonly isOpen = signal(false);

  private overlayRef: OverlayRef | null = null;
  private sheetRef = viewChild.required<TemplateRef<void>>('dropdownSheet');

  public readonly computedId = computed(() => {
    return this.id() || this.label().toLowerCase().replace(/\s+/g, '-');
  });
  public readonly placeholderComputed = computed(() => {
    if (!this.options() || !this.options().length) {
      return 'No options available';
    }

    return this.placeholder() ?? 'Click to select';
  });
  public readonly disableTriggerBtn = computed(() => !this.options() || !this.options().length);
  public readonly isTouched = signal(false);
  public readonly selectedLabel = computed(() => this.options().find((f) => f.value === this.value())?.label ?? null);

  protected readonly value = signal<string | number | null>(null);

  public ngOnInit(): void {
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

  public select(val: string | number | null) {
    this.control().setValue(val);
    this.close();
  }

  public close() {
    this.isOpen.set(false);

    this.overlayRef?.detach();
    this.overlayRef = null;
  }

  public open() {
    this.control().markAsTouched();
    this.isOpen.set(true);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().bottom('0').centerHorizontally(),
      width: '100%',
    });

    this.overlayRef
      .backdropClick()
      .pipe(take(1))
      .subscribe(() => this.close());

    const portal = new TemplatePortal(this.sheetRef(), this.vcr);
    this.overlayRef.attach(portal);
  }

  public clear() {
    this.control().setValue(null);
    this.close();
  }
}
