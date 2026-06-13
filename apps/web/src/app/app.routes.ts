import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { homeGuard } from './guards/home.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        canActivate: [homeGuard],
        loadChildren: () =>
          import('@expose/feature-sessions').then((m) => m.sessionsRoutes),
      },
      {
        path: 'rolls',
        loadChildren: () =>
          import('@expose/feature-rolls').then((m) => m.rollsRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@expose/feature-settings').then((m) => m.settingsRoutes),
      },
      {
        path: 'photos',
        loadChildren: () =>
          import('@expose/feature-photos').then((m) => m.photosRoutes),
      },
      {
        path: 'photos/new',
        loadChildren: () =>
          import('@expose/feature-photo-detail').then(
            (m) => m.photoDetailRoutes,
          ),
      },
      {
        path: 'photos/:id',
        loadChildren: () =>
          import('@expose/feature-photo-detail').then(
            (m) => m.photoDetailRoutes,
          ),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
