import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoStateService, RollStateService, SessionStateService } from '@expose/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideCamera, lucideFilm, lucideMapPin, lucidePlus } from '@ng-icons/lucide';

// =============================================================================
// SessionDetailComponent
// Detail page for a single session: shows session metadata and its photos
// as a compact list with camera settings.
// =============================================================================

@Component({
  selector: 'lib-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.scss',
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      lucideCamera,
      lucideCalendar,
      lucideFilm,
      lucideMapPin,
      lucidePlus,
    }),
  ],
})
export class SessionDetailComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _sessionStateService = inject(SessionStateService);
  private readonly _photoStateService = inject(PhotoStateService);
  private readonly _rollStateService = inject(RollStateService);
  private readonly _headerService = inject(HeaderService);

  private readonly _sessionId = this._route.snapshot.paramMap.get('id') ?? '';

  /** The session currently being viewed. */
  public readonly session = computed(() => this._sessionStateService.getById(this._sessionId));

  /** The roll linked to this session, if any. */
  public readonly roll = computed(() => {
    const rollId = this.session()?.rollId;
    return rollId ? this._rollStateService.rolls().find((r) => r.id === rollId) : undefined;
  });

  /** Photos belonging to this session, sorted by frame number then takenAt. */
  public readonly photos = computed(() =>
    [...this._photoStateService.photos()].sort((a, b) => {
      if (a.frameNumber != null && b.frameNumber != null) {
        return a.frameNumber - b.frameNumber;
      }
      return a.takenAt.localeCompare(b.takenAt);
    }),
  );

  public ngOnInit(): void {
    this._sessionStateService.loadAll();
    this._rollStateService.loadAll();
    this._photoStateService.loadBySessionId(this._sessionId);
    this._setupHeader();
  }

  /**
   * Navigates to the add-photo page, pre-seeding the sessionId via query params.
   */
  public onAddPhoto(): void {
    this._router.navigate(['/photos/new'], {
      queryParams: { sessionId: this._sessionId },
    });
  }

  /**
   * Navigates to the edit page for this session.
   */
  public onEdit(): void {
    this._router.navigate(['/sessions', this._sessionId, 'edit']);
  }

  private _setupHeader(): void {
    this._headerService.setConfig({
      title: 'Session',
      showBackButton: true,
      actionButtons: [
        {
          id: 'edit-session',
          label: 'Edit',
          type: 'text',
          action: () => this.onEdit(),
        },
      ],
    });
  }
}
