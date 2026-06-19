import { inject } from '@angular/core';
import { ExposeDatabaseService } from './expose-database.service';

// =============================================================================
// BaseDataService
// Generic data operations. Current implementation uses IndexedDB.
// =============================================================================

export abstract class BaseDataService<TEntity, TCreateInput, TUpdateInput> {
  protected readonly db = inject(ExposeDatabaseService);

  /**
   * Name of the object store in IndexedDB.
   */
  protected abstract readonly storeName: string;

  /**
   * Returns all stored records.
   */
  public async getAll(): Promise<TEntity[]> {
    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readonly');
    return this.db.cursorAll<TEntity>(tx.objectStore(this.storeName));
  }

  /**
   * Returns a single record by id, or undefined if it does not exist.
   */
  public async getById(id: string): Promise<TEntity | undefined> {
    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readonly');
    return this.db.request<TEntity>(tx.objectStore(this.storeName).get(id));
  }

  /**
   * Creates a new record and returns the stored version.
   */
  public async create(input: TCreateInput): Promise<TEntity> {
    const now = new Date().toISOString();
    const record = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as TEntity;

    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readwrite');
    await this.db.request(tx.objectStore(this.storeName).add(record));
    return record;
  }

  /**
   * Updates an existing record and returns the updated version.
   */
  public async update(id: string, input: TUpdateInput): Promise<TEntity> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Record '${id}' not found in store '${this.storeName}'.`);
    }

    const updated = {
      ...existing,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    } as TEntity;

    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readwrite');
    await this.db.request(tx.objectStore(this.storeName).put(updated));
    return updated;
  }

  /**
   * Deletes a record by id.
   */
  public async delete(id: string): Promise<void> {
    const db = await this.db.getDb();
    const tx = db.transaction(this.storeName, 'readwrite');
    await this.db.request(tx.objectStore(this.storeName).delete(id));
  }
}
