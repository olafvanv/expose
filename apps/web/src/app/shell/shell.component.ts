import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { HeaderService } from '@expose/ui';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideCamera,
  lucideFilm,
  lucideSettings,
  lucideArrowLeft,
  lucideFilter,
  lucideMoreVertical,
  lucidePlus,
  lucideCheck,
  lucideX,
  lucideEdit,
  lucideTrash,
  lucideSearch,
  lucideShare2,
  lucideInfo,
  lucideImage,
} from '@ng-icons/lucide';

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIconComponent],
  providers: [
    provideIcons({
      lucideCamera,
      lucideFilm,
      lucideSettings,
      lucideArrowLeft,
      lucideFilter,
      lucideMoreVertical,
      lucidePlus,
      lucideCheck,
      lucideX,
      lucideEdit,
      lucideTrash,
      lucideSearch,
      lucideShare2,
      lucideInfo,
      lucideImage,
    }),
  ],
})
export class ShellComponent {
  public readonly navItemsLeft: NavItem[] = [
    { path: '/', label: 'Sessions', icon: 'lucideCamera' },
    { path: '/rolls', label: 'Rolls', icon: 'lucideFilm' },
  ];

  public readonly navItemsRight: NavItem[] = [
    { path: '/photos', label: 'Photos', icon: 'lucideImage' },
    { path: '/settings', label: 'Settings', icon: 'lucideSettings' },
  ];

  public readonly headerService = inject(HeaderService);
  public readonly isAddMenuOpen = signal<boolean>(false);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.headerService.reset();
        this.isAddMenuOpen.set(false); // Close menu when navigating
      });
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Handles the header back button click.
   * If a custom back action is provided in the configuration, it is executed.
   * Otherwise, the router/location history is used to navigate back.
   */
  public onBack(): void {
    const customAction = this.headerService.backAction();
    if (customAction) {
      customAction();
    } else {
      this.location.back();
    }
  }

  /**
   * Toggles the state of the central expandable add menu.
   */
  public toggleAddMenu(): void {
    this.isAddMenuOpen.update((open) => !open);
  }

  /**
   * Action triggered when clicking a quick-action item.
   * Closes the menu and routes to the corresponding creation path.
   */
  public onAddOption(type: 'session' | 'roll' | 'photo'): void {
    this.isAddMenuOpen.set(false);
    switch (type) {
      case 'photo':
        this.router.navigate(['/photos/new']);
        break;
      case 'session':
        console.log('Navigate to log new session');
        // Will route to /sessions/new in the future
        break;
      case 'roll':
        this.router.navigate(['/rolls/new']);
        break;
    }
  }
}
