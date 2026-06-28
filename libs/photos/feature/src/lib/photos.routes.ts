import { Routes } from '@angular/router';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoEditComponent } from './photo-edit/photo-edit.component';
import { PhotosComponent } from './photos/photos.component';

export const photosRoutes: Routes = [
  { path: '', component: PhotosComponent },
  { path: 'new', component: PhotoEditComponent },
  { path: ':id', component: PhotoDetailComponent },
  { path: ':id/edit', component: PhotoEditComponent },
];
