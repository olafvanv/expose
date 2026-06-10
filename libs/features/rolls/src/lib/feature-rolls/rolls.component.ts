import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@expose/ui';

@Component({
  selector: 'lib-rolls',
  templateUrl: './rolls.component.html',
  styleUrl: './rolls.component.scss',
})
export class RollsComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: 'Film Rolls',
    });
  }
}
