import { Component, inject, input, OnInit } from '@angular/core';
import { HeaderService } from '@expose/shell-data-access';

@Component({
  imports: [],
  selector: 'lib-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrl: './photo-edit.component.scss',
})
export class PhotoEditComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  // Route param :id
  public id = input<string | null>(null);

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: '',
    });

    console.log(this.id());
  }
}
