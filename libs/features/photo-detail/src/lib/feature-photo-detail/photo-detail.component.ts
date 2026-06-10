import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@expose/ui';

/** The component operates in two modes based on the route parameter :id. */
type PhotoDetailMode = 'create' | 'edit';

@Component({
  selector: 'lib-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly headerService = inject(HeaderService);

  public readonly photoId = this.route.snapshot.paramMap.get('id');

  public readonly mode = computed<PhotoDetailMode>(() =>
    this.photoId ? 'edit' : 'create'
  );

  public ngOnInit(): void {
    const title = this.mode() === 'create' ? 'New Photo' : 'Edit Photo';
    
    this.headerService.setConfig({
      title,
      showBackButton: true,
      actionButtons: [
        {
          id: 'save-photo',
          label: 'Save',
          type: 'text',
          action: () => this.onSave(),
        },
      ],
    });
  }

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Action triggered when clicking the "Save" header button.
   */
  public onSave(): void {
    console.log('Save button clicked in PhotoDetailComponent!');
  }
}
