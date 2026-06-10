import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@expose/ui';

@Component({
  selector: 'lib-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
})
export class SessionsComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: 'Sessions',
    });
  }
}
