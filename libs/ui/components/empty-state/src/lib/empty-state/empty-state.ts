import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';

export type EmptyStateButton = {
  icon?: string;
  label: string;
  path: string;
};

@Component({
  selector: 'lib-empty-state',
  imports: [NgIconComponent, RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  public icon = input.required<string>();
  public title = input.required<string>();
  public message = input.required<string>();
  public button = input<EmptyStateButton | null>(null);
}
