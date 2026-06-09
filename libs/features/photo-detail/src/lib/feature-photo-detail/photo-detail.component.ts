import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** The component operates in two modes based on the route parameter :id. */
type PhotoDetailMode = 'create' | 'edit';

@Component({
  selector: 'lib-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent {
  private readonly route = inject(ActivatedRoute);

  public readonly photoId = this.route.snapshot.paramMap.get('id');

  public readonly mode = computed<PhotoDetailMode>(() =>
    this.photoId ? 'edit' : 'create'
  );
}
