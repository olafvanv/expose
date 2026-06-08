import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** De component werkt in twee modi op basis van de route-parameter :id. */
type PhotoDetailMode = 'create' | 'edit';

@Component({
  selector: 'lib-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly photoId = this.route.snapshot.paramMap.get('id');

  readonly mode = computed<PhotoDetailMode>(() =>
    this.photoId ? 'edit' : 'create'
  );
}
