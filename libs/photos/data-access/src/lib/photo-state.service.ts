import { inject, Injectable, signal } from '@angular/core';
import { CreatePhotoInput, Photo, UpdatePhotoInput } from '@expose/data-access';
import { PhotoDataService } from './photo-data.service';

// =============================================================================
// PhotoStateService
// Intermediary reactive state management layer for photos using Signals.
// =============================================================================

@Injectable({ providedIn: 'root' })
export class PhotoStateService {
  private readonly _photoDataService = inject(PhotoDataService);
  private readonly _photos = signal<Photo[]>([]);
  private readonly _loading = signal<boolean>(false);

  public readonly photos = this._photos.asReadonly();
  public readonly loading = this._loading.asReadonly();

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Loads all photos from the database into the state.
   */
  public async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const photos = await this._photoDataService.getAll();
      this._photos.set(photos);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Loads photos for a specific session from the database into the state.
   */
  public async loadBySessionId(sessionId: string): Promise<void> {
    this._loading.set(true);
    try {
      const photos = await this._photoDataService.getBySessionId(sessionId);
      this._photos.set(photos);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Loads photos for a specific film roll from the database into the state.
   */
  public async loadByRollId(rollId: string): Promise<void> {
    this._loading.set(true);
    try {
      const photos = await this._photoDataService.getByRollId(rollId);
      this._photos.set(photos);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Adds a new photo to the database and updates state.
   */
  public async addPhoto(input: CreatePhotoInput): Promise<Photo> {
    this._loading.set(true);
    try {
      const newPhoto = await this._photoDataService.create(input);
      this._photos.update((photos) => [...photos, newPhoto]);
      return newPhoto;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Updates an existing photo in the database and state.
   */
  public async updatePhoto(id: string, input: UpdatePhotoInput): Promise<Photo> {
    this._loading.set(true);
    try {
      const updatedPhoto = await this._photoDataService.update(id, input);
      this._photos.update((photos) => photos.map((photo) => (photo.id === id ? updatedPhoto : photo)));
      return updatedPhoto;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Deletes a photo from the database and updates state.
   */
  public async deletePhoto(id: string): Promise<void> {
    this._loading.set(true);
    try {
      await this._photoDataService.delete(id);
      this._photos.update((photos) => photos.filter((photo) => photo.id !== id));
    } finally {
      this._loading.set(false);
    }
  }
}
