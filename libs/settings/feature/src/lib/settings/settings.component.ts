import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppTheme, HomePagePreference, SettingsStateService } from '@expose/settings/data-access';
import { HeaderService } from '@expose/shell-data-access';
import { SelectInputComponent } from '@expose/ui/form-fields';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';

@Component({
  selector: 'lib-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [ReactiveFormsModule, SelectInputComponent, NgIconComponent],
  providers: [
    provideIcons({
      lucideSun,
      lucideMoon,
      lucideMonitor,
    }),
  ],
})
export class SettingsComponent implements OnInit {
  private readonly settingsStateService = inject(SettingsStateService);
  private readonly headerService = inject(HeaderService);

  public homePageControl = new FormControl<HomePagePreference>(this.settingsStateService.preferredHomePage(), { nonNullable: true });
  public homePageOptions = [
    { label: 'Sessions', value: 'sessions' },
    { label: 'Film Rolls', value: 'rolls' },
    { label: 'Photos', value: 'photos' },
  ];

  public activeTheme = this.settingsStateService.theme;

  public constructor() {
    this.homePageControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.settingsStateService.setPreferredHomePage(value);
    });
  }

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: 'Settings',
    });
  }

  /**
   * Triggers a theme state update on the settings service.
   */
  public setTheme(theme: AppTheme): void {
    this.settingsStateService.setTheme(theme);
  }
}
