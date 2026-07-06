import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RollStateService } from '@expose/data-access';
import { PhotoStateService } from '@expose/photos/data-access';
import { SessionStateService } from '@expose/sessions/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { EmptyState } from '@expose/ui/empty-state';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCamera,
  lucideCloud,
  lucideCloudSun,
  lucideEdit3,
  lucideFilm,
  lucideHouse,
  lucideInfo,
  lucideLamp,
  lucideMapPin,
  lucideMoon,
  lucidePlus,
  lucideStars,
  lucideSun,
  lucideSunset,
  lucideTrash2,
  lucideTrees,
} from '@ng-icons/lucide';

// =============================================================================
// PhotosComponent
// Overview page showing all logged photos, sorted by date (newest first).
// Displays camera settings, roll, session, and light condition metadata.
// =============================================================================

@Component({
  selector: 'lib-photos',
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  imports: [CommonModule, NgIconComponent, EmptyState],
  providers: [
    provideIcons({
      lucidePlus,
      lucideEdit3,
      lucideTrash2,
      lucideCalendar,
      lucideCamera,
      lucideFilm,
      lucideMapPin,
      lucideInfo,
      lucideSun,
      lucideCloudSun,
      lucideCloud,
      lucideTrees,
      lucideSunset,
      lucideMoon,
      lucideHouse,
      lucideLamp,
      lucideStars,
    }),
  ],
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
  public onEdit(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/photos', id, 'edit']);
  }

  /**
   * Prompts for confirmation and deletes the specified photo.
   */
  public async onDelete(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this photo?')) {
      await this.photoStateService.deletePhoto(id);
    }
  }

  /**
   * Returns the lucide icon name matching a given light condition value.
   */
  public getLightConditionIcon(condition?: string): string {
    switch (condition) {
      case 'sunny':
        return 'lucideSun';
      case 'partly-cloudy':
        return 'lucideCloudSun';
      case 'overcast':
        return 'lucideCloud';
      case 'shade':
        return 'lucideTrees';
      case 'golden-hour':
        return 'lucideSunset';
      case 'blue-hour':
        return 'lucideMoon';
      case 'indoor-natural':
        return 'lucideHouse';
      case 'indoor-artificial':
        return 'lucideLamp';
      case 'night':
        return 'lucideStars';
      default:
        return 'lucideSun';
    }
  }

  /**
   * Returns the user-friendly label for a light condition value.
   */
  public getLightConditionLabel(condition?: string): string {
    switch (condition) {
      case 'sunny':
        return 'Zonnig';
      case 'partly-cloudy':
        return 'Half bew.';
      case 'overcast':
        return 'Bewolkt';
      case 'shade':
        return 'Schaduw';
      case 'golden-hour':
        return 'Gouden uur';
      case 'blue-hour':
        return 'Blauwe uur';
      case 'indoor-natural':
        return 'Binnen/dag';
      case 'indoor-artificial':
        return 'Binnen/kunst';
      case 'night':
        return 'Nacht';
      default:
        return condition || '';
    }
  }
}
