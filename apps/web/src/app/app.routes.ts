import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
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
      { path: '**', redirectTo: '' },
    ],
  },
];
