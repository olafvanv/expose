import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Photo, Roll, Session } from '@expose/util';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCamera, lucideEdit3, lucideFilm, lucideImage, lucideTrash2 } from '@ng-icons/lucide';

export type PhotoWithMetadata = Photo & {
  roll?: Roll;
  session?: Session;
};

// =============================================================================
// PhotoCardComponent
// Reusable component representing a single photo frame. Displays camera
// settings, roll (associated with frame), session, date, and frame number.
// Uses input flags to dynamically hide elements based on parent context.
// =============================================================================

@Component({
  selector: 'lib-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, NgIconComponent],
  providers: [
    provideIcons({
      lucideEdit3,
      lucideTrash2,
      lucideCamera,
      lucideFilm,
      lucideImage,
    }),
  ],
})
export class PhotoCardComponent {
  /** The photo object to render, including optional pre-resolved roll and session. */
  public photo = input.required<PhotoWithMetadata>();

  /** Whether to show the linked session information. Set false on session details. */
  public showSession = input<boolean>(true);

  /** Whether to show the linked film roll information. Set false on roll details. */
  public showRoll = input<boolean>(true);

  /** Whether to show edit and delete buttons. */
  public showActions = input<boolean>(true);

  /** Emitted when edit button is clicked. Emits photo ID. */
  public edit = output<string>();

  /** Emitted when delete button is clicked. Emits photo ID. */
  public delete = output<string>();

  /**
   * Triggers the edit output event.
   */
  public onEdit(event: MouseEvent): void {
    event.stopPropagation();
    const id = this.photo().id;
    if (id) {
      this.edit.emit(id);
    }
  }

  /**
   * Triggers the delete output event.
   */
  public onDelete(event: MouseEvent): void {
    event.stopPropagation();
    const id = this.photo().id;
    if (id) {
      this.delete.emit(id);
    }
  }
}
