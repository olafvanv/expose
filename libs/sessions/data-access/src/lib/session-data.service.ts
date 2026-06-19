import { Injectable } from '@angular/core';
import { BaseDataService, CreateSessionInput, Session, STORE, UpdateSessionInput } from '@expose/data-access';

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
