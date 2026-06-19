import { Injectable } from '@angular/core';
import { BaseDataService, CreateRollInput, Roll, STORE, UpdateRollInput } from '@expose/data-access';

// =============================================================================
// RollDataService
// CRUD operations for film rolls. Currently stored in IndexedDB.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class RollDataService extends BaseDataService<Roll, CreateRollInput, UpdateRollInput> {
  protected readonly storeName = STORE.rolls;
}
