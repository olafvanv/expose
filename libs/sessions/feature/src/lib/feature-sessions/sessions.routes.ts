import { Routes } from '@angular/router';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { SessionsComponent } from './sessions/sessions.component';
import { SessionEditComponent } from './sesstion-edit/session-edit.component';

export const sessionsRoutes: Routes = [
  { path: '', component: SessionsComponent },
  { path: 'new', component: SessionEditComponent },
  { path: ':id', component: SessionDetailComponent },
  { path: ':id/edit', component: SessionEditComponent },
];
