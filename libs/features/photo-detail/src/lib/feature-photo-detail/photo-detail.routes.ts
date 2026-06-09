import { Routes } from '@angular/router';
import { PhotoDetailComponent } from './photo-detail.component';

export const photoDetailRoutes: Routes = [
  {
    path: 'new',
    component: PhotoDetailComponent,
    title: 'New photo',
  },
  {
    path: ':id',
    component: PhotoDetailComponent,
    title: 'Edit photo',
  },
  { path: '', redirectTo: 'new', pathMatch: 'full' },
];
