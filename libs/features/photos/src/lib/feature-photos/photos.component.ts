import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '@expose/shell-data-access';

@Component({
  selector: 'lib-photos',
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  imports: [],
})
export class PhotosComponent implements OnInit {
  private readonly headerService = inject(HeaderService);

  public ngOnInit(): void {
    this.headerService.setConfig({
      title: 'Photos',
    });
  }
}
