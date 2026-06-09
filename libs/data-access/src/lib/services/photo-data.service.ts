import { Injectable } from '@angular/core';
import { CreatePhotoInput, Photo, UpdatePhotoInput } from '../models/photo.model';
import { STORE } from './expose-database.service';
import { BaseDataService } from './base-data.service';

// =============================================================================
// PhotoDataService
// CRUD operations for photos. Currently stored in IndexedDB.
// Supports fetching by session and by film roll via IndexedDB indexes.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class PhotoDataService extends BaseDataService<Photo, CreatePhotoInput, UpdatePhotoInput> {
  protected readonly storeName = STORE.photos;

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Returns all photos belonging to a specific session.
   */
  public async getBySessionId(sessionId: string): Promise<Photo[]> {
    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readonly');
    const index = tx.objectStore(this.storeName).index('sessionId');
    return this.db.cursorAll<Photo>(index.openCursor(IDBKeyRange.only(sessionId)));
  }

  /**
   * Returns all photos belonging to a specific film roll.
   */
  public async getByRollId(rollId: string): Promise<Photo[]> {
    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readonly');
    const index = tx.objectStore(this.storeName).index('rollId');
    return this.db.cursorAll<Photo>(index.openCursor(IDBKeyRange.only(rollId)));
  }
}
