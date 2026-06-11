import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RollStateService } from '@expose/data-access';
import { HeaderService } from '@expose/ui';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideEdit3, lucideTrash2, lucideInfo, lucideFilm } from '@ng-icons/lucide';

// =============================================================================
// RollsComponent
// Overview page showing the list of film rolls and their current status.
// =============================================================================

@Component({
  selector: 'lib-rolls',
  templateUrl: './rolls.component.html',
  styleUrl: './rolls.component.scss',
  imports: [CommonModule, RouterLink, NgIconComponent],
  providers: [
    provideIcons({
      lucidePlus,
      lucideEdit3,
      lucideTrash2,
      lucideInfo,
      lucideFilm,
    }),
  ],
})
export class RollsComponent implements OnInit {
  public readonly rollStateService = inject(RollStateService);
  private readonly _headerService = inject(HeaderService);
  private readonly _router = inject(Router);

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks
  // ---------------------------------------------------------------------------

  public ngOnInit(): void {
    this._headerService.setConfig({
      title: 'Film Rolls',
    });
    this.rollStateService.loadAll();
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Navigates to the edit page for a specific roll.
   */
  public onEdit(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this._router.navigate(['/rolls', id]);
  }

  /**
   * Deletes a specific film roll from IndexedDB and updates state.
   */
  public async onDelete(id: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this film roll? All related photos will remain but their roll reference will be cleared.')) {
      await this.rollStateService.deleteRoll(id);
    }
  }
}
