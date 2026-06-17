import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextInputType } from './text-input.types';

// =============================================================================
// TextInputComponent
// Standalone reusable form control for standard text inputs using Signals.
// =============================================================================

@Component({
  selector: 'lib-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
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
}
