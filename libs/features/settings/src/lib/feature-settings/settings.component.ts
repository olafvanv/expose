import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@expose/ui';

@Component({
  selector: 'lib-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: 'Settings',
    });
  }
}
