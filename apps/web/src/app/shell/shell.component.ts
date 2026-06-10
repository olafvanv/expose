import { Component, inject } from '@angular/core';
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
    }),
  ],
})
export class ShellComponent {
  public readonly navItems: NavItem[] = [
    { path: '/', label: 'Sessions', icon: 'lucideCamera' },
    { path: '/rolls', label: 'Rolls', icon: 'lucideFilm' },
    { path: '/settings', label: 'Settings', icon: 'lucideSettings' },
  ];

  public readonly headerService = inject(HeaderService);
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
}
