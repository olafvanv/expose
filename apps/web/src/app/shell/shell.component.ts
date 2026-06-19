import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderService } from '@expose/shell-data-access';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideCamera,
  lucideCheck,
  lucideEdit,
  lucideFilm,
  lucideFilter,
  lucideImage,
  lucideInfo,
  lucideMoreVertical,
  lucidePlus,
  lucideSearch,
  lucideSettings,
  lucideShare2,
  lucideTrash,
  lucideX,
} from '@ng-icons/lucide';
import { filter } from 'rxjs';

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

type FloatingMenuButton = {
  icon: string;
  label: string;
  type: AddOptionType;
};

type AddOptionType = 'session' | 'roll' | 'photo';

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
  public readonly headerService: HeaderService = inject(HeaderService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  public readonly navItemsLeft: NavItem[] = [
    { path: '/sessions', label: 'Sessions', icon: 'lucideCamera' },
    { path: '/rolls', label: 'Rolls', icon: 'lucideFilm' },
  ];

  public readonly navItemsRight: NavItem[] = [
    { path: '/photos', label: 'Photos', icon: 'lucideImage' },
    { path: '/settings', label: 'Settings', icon: 'lucideSettings' },
  ];

  public readonly menuButtons: FloatingMenuButton[] = [
    { label: 'Add Session', icon: 'lucideCamera', type: 'session' },
    { label: 'Add Roll', icon: 'lucideFilm', type: 'roll' },
    { label: 'Add Photo', icon: 'lucideImage', type: 'photo' },
  ];

  public readonly isAddMenuOpen = signal<boolean>(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.headerService.reset();
        this.isAddMenuOpen.set(false); // Close menu when navigating
      });
  }

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
  public onAddOption(type: AddOptionType): void {
    this.isAddMenuOpen.set(false);
    switch (type) {
      case 'photo':
        this.router.navigate(['/photos/new']);
        break;
      case 'session':
        this.router.navigate(['/sessions/new']);
        break;
      case 'roll':
        this.router.navigate(['/rolls/new']);
        break;
    }
  }
}
