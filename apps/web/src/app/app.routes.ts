import { Route } from '@angular/router';
import { homeGuard } from './guards/home.guard';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [homeGuard],
        children: [],
      },
      {
        path: 'sessions',
        loadChildren: () => import('@expose/sessions/feature').then((m) => m.sessionsRoutes),
      },
      {
        path: 'rolls',
        loadChildren: () => import('@expose/rolls/feature').then((m) => m.rollsRoutes),
      },
      {
        path: 'settings',
        loadChildren: () => import('@expose/settings/feature').then((m) => m.settingsRoutes),
      },
      {
        path: 'photos',
        loadChildren: () => import('@expose/photos/feature').then((m) => m.photosRoutes),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
