import { Routes } from '@angular/router';
import { PhotoDetailComponent } from './photo-detail.component';

export const photoDetailRoutes: Routes = [
  {
    path: 'new',
    component: PhotoDetailComponent,
    title: 'Nieuwe foto',
  },
  {
    path: ':id',
    component: PhotoDetailComponent,
    title: 'Foto bewerken',
  },
  { path: '', redirectTo: 'new', pathMatch: 'full' },
];
