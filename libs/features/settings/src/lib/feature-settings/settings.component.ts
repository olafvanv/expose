import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AppTheme,
  HomePagePreference,
  SettingsStateService,
} from '@expose/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { SelectInputComponent } from '@expose/ui';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';

// =============================================================================
// SettingsComponent
// Component handling app options (theme, startpage) with dynamic forms.
// =============================================================================

@Component({
  selector: 'lib-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectInputComponent,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      lucideSun,
      lucideMoon,
      lucideMonitor,
    }),
  ],
})
export class SettingsComponent implements OnInit {
  private readonly _settingsStateService = inject(SettingsStateService);
  private readonly _headerService = inject(HeaderService);

  public readonly settingsStateService = this._settingsStateService;
  public readonly homePageControl = new FormControl<HomePagePreference>(
    'sessions',
    { nonNullable: true },
  );
  public readonly homePageOptions = [
    { label: 'Sessions', value: 'sessions' },
    { label: 'Film Rolls', value: 'rolls' },
    { label: 'Photos', value: 'photos' },
  ];

  public constructor() {
    this.homePageControl.setValue(
      this._settingsStateService.preferredHomePage(),
      { emitEvent: false },
    );
    this.homePageControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this._settingsStateService.setPreferredHomePage(value);
      });
  }

  public ngOnInit(): void {
    this._headerService.setConfig({
      title: 'Settings',
    });
  }

  /**
   * Triggers a theme state update on the settings service.
   */
  public setTheme(theme: AppTheme): void {
    this._settingsStateService.setTheme(theme);
  }
}
