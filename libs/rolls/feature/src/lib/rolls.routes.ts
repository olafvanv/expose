import { Routes } from '@angular/router';
import { RollEditComponent } from './roll-edit/roll-edit.component';
import { RollsComponent } from './rolls/rolls.component';

export const rollsRoutes: Routes = [
  { path: '', component: RollsComponent },
  { path: 'new', component: RollEditComponent },
  { path: ':id', component: RollEditComponent },
];
