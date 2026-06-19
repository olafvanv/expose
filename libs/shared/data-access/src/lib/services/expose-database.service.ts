import { Injectable } from '@angular/core';

// =============================================================================
// ExposeDatabaseService
// Manages the IndexedDB connection as a singleton.
// All entity services inject this service for DB access.
// =============================================================================

const DB_NAME = 'expose-db';
const DB_VERSION = 1;

export const STORE = {
  sessions: 'sessions',
  photos: 'photos',
  rolls: 'rolls',
} as const;

@Injectable({ providedIn: 'root' })
export class ExposeDatabaseService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Returns the opened database. Opens the connection if not already done.
   */
  public getDb(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = this.openDatabase();
    }
    return this.dbPromise;
  }

  /**
   * Wraps an IDBRequest in a Promise.
   */
  public request<T>(req: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Iterate over all records via a cursor and return them as an array.
   */
  public cursorAll<T>(storeOrRequest: IDBObjectStore | IDBIndex | IDBRequest<IDBCursorWithValue | null>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];
      const req: IDBRequest<IDBCursorWithValue | null> =
        storeOrRequest instanceof IDBRequest ? storeOrRequest : storeOrRequest.openCursor();

      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          results.push(cursor.value as T);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  // ---------------------------------------------------------------------------
  // Private Methods
  // ---------------------------------------------------------------------------

  /**
   * Opens the IndexedDB connection and initializes the schema if necessary.
   */
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createSchema(db);
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Creates the object stores and indexes on first open.
   */
  private createSchema(db: IDBDatabase): void {
    if (!db.objectStoreNames.contains(STORE.sessions)) {
      db.createObjectStore(STORE.sessions, { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains(STORE.photos)) {
      const photoStore = db.createObjectStore(STORE.photos, { keyPath: 'id' });
      photoStore.createIndex('sessionId', 'sessionId', { unique: false });
      photoStore.createIndex('rollId', 'rollId', { unique: false });
    }

    if (!db.objectStoreNames.contains(STORE.rolls)) {
      db.createObjectStore(STORE.rolls, { keyPath: 'id' });
    }
  }
}
