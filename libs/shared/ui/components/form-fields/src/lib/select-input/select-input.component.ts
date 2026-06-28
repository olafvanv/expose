import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-select-input',
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
})
export class SelectInputComponent {
  public control = input.required<FormControl<string | number | null>>();
  public label = input.required<string>();
  public options = input.required<(string | number | { label: string; value: string | number })[]>();
  public placeholder = input<string>();
  public id = input<string>();

  public readonly computedId = computed(() => {
    return this.id() || this.label().toLowerCase().replace(/\s+/g, '-');
  });

  /**
   * Helper method to determine if an option is an object with a label and value.
   */
  public isOptionObject(
    opt: string | number | { label: string; value: string | number },
  ): opt is { label: string; value: string | number } {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt;
  }
}
