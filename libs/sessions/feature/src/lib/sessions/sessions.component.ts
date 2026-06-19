import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoStateService } from '@expose/photos/data-access';
import { SessionStateService } from '@expose/sessions/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { EmptyState } from '@expose/ui/empty-state';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCamera, lucideEdit3, lucideImage, lucideMapPin, lucideTrash2 } from '@ng-icons/lucide';

// =============================================================================
// SessionsComponent
// Overview page showing the list of shooting sessions.
// =============================================================================

@Component({
  selector: 'lib-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
  imports: [DatePipe, NgIconComponent, EmptyState],
  providers: [
    provideIcons({
      lucideCamera,
      lucideEdit3,
      lucideTrash2,
      lucideMapPin,
      lucideImage,
    }),
  ],
})
export class SessionsComponent implements OnInit {
  public readonly sessionStateService: SessionStateService = inject(SessionStateService);
  private readonly _photoStateService = inject(PhotoStateService);
  private readonly _headerService = inject(HeaderService);
  private readonly _router = inject(Router);

  /** Sessions sorted newest-first by date. */
  public readonly sortedSessions = computed(() => [...this.sessionStateService.sessions()].sort((a, b) => b.date.localeCompare(a.date)));

  /** Photo count per sessionId, derived from the loaded photos. */
  public readonly photoCountBySession = computed(() => {
    const map = new Map<string, number>();
    for (const photo of this._photoStateService.photos()) {
      if (photo.sessionId) {
        map.set(photo.sessionId, (map.get(photo.sessionId) ?? 0) + 1);
      }
    }
    return map;
  });

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    this._headerService.setConfig({ title: 'Sessions' });
    this.sessionStateService.loadAll();
    this._photoStateService.loadAll();
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Navigates to the session detail page.
   */
  public onNavigate(id: string): void {
    this._router.navigate(['/sessions', id]);
  }

  /**
   * Navigates to the session edit page, stopping the event from bubbling
   * so the card click does not trigger simultaneously.
   */
  public onEdit(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this._router.navigate(['/sessions', id, 'edit']);
  }

  /**
   * Deletes a session after confirmation and updates state.
   */
  public async onDelete(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (
      confirm(
        'Are you sure you want to delete this session? Photos in this session will remain but their session reference will be cleared.',
      )
    ) {
      await this.sessionStateService.deleteSession(id);
    }
  }
}
