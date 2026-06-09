import { Injectable } from '@angular/core';
import { CreateSessionInput, Session, UpdateSessionInput } from '../models/session.model';
import { STORE } from './expose-database.service';
import { BaseDataService } from './base-data.service';

// =============================================================================
// SessionDataService
// CRUD operations for sessions. Currently stored in IndexedDB.
// Sessions are stored without the nested photos array.
// =============================================================================

type StoredSession = Omit<Session, 'photos'>;

@Injectable({ providedIn: 'root' })
export class SessionDataService extends BaseDataService<StoredSession, CreateSessionInput, UpdateSessionInput> {
  protected readonly storeName = STORE.sessions;
}
