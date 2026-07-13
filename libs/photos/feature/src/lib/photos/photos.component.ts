import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RollStateService } from '@expose/data-access';
import { PhotoStateService } from '@expose/photos/data-access';
import { PhotoCardComponent } from '@expose/photos/ui/photo-card';
import { SessionStateService } from '@expose/sessions/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { EmptyState } from '@expose/ui/empty-state';

@Component({
  selector: 'lib-photos',
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  imports: [CommonModule, EmptyState, PhotoCardComponent],
})
export class PhotosComponent implements OnInit {
  public readonly photoStateService = inject(PhotoStateService);
  public readonly rollStateService = inject(RollStateService);
  public readonly sessionStateService = inject(SessionStateService);
  private readonly headerService = inject(HeaderService);
  private readonly router = inject(Router);

  /**
   * Computed list of photos enriched with their respective roll and session metadata.
   * Sorted descending by takenAt date.
   */
  public readonly photosWithMetadata = computed(() => {
    const rolls = this.rollStateService.rolls();
    const sessions = this.sessionStateService.sessions();
    return this.photoStateService
      .photos()
      .map((photo) => {
        const roll = photo.rollId ? rolls.find((r) => r.id === photo.rollId) : undefined;
        const session = photo.sessionId ? sessions.find((s) => s.id === photo.sessionId) : undefined;
        return {
          ...photo,
          roll,
          session,
        };
      })
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
  });

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: 'Photos',
    });
    this.photoStateService.loadAll();
    this.rollStateService.loadAll();
    this.sessionStateService.loadAll();
  }

  /**
   * Navigates to the edit page for a specific photo.
   */
  public onEdit(id: string): void {
    this.router.navigate(['/photos', id, 'edit']);
  }

  /**
   * Prompts for confirmation and deletes the specified photo.
   */
  public async onDelete(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this photo?')) {
      await this.photoStateService.deletePhoto(id);
    }
  }
}
