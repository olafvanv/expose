import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleX } from '@ng-icons/lucide';
import { TextInputType } from './text-input.types';

// =============================================================================
// TextInputComponent
// Standalone reusable form control for standard text inputs using Signals.
// =============================================================================

@Component({
  selector: 'lib-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  imports: [CommonModule, ReactiveFormsModule, NgIcon],
  providers: [
    provideIcons({
      lucideCircleX,
    }),
  ],
})
export class TextInputComponent {
  public control = input.required<FormControl<string | null>>();
  public label = input.required<string>();
  public placeholder = input<string>('');
  public type = input<TextInputType>('text');
  public id = input<string>();

  public readonly computedId = computed(() => {
    return this.id() || this.label().toLowerCase().replace(/\s+/g, '-');
  });

  public clearControl() {
    this.control().setValue(null);
  }
}
