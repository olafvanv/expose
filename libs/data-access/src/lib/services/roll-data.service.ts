import { Injectable } from '@angular/core';
import { CreateRollInput, Roll, UpdateRollInput } from '../models/roll.model';
import { STORE } from './expose-database.service';
import { BaseDataService } from './base-data.service';

// =============================================================================
// RollDataService
// CRUD operations for film rolls. Currently stored in IndexedDB.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class RollDataService extends BaseDataService<Roll, CreateRollInput, UpdateRollInput> {
  protected readonly storeName = STORE.rolls;
}
