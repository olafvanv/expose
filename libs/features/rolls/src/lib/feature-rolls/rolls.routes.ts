import { Routes } from '@angular/router';
import { RollsComponent } from './rolls.component';
import { RollEditComponent } from './roll-edit.component';

export const rollsRoutes: Routes = [
  { path: '', component: RollsComponent },
  { path: 'new', component: RollEditComponent },
  { path: ':id', component: RollEditComponent },
];
