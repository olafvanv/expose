import { FilmFormat } from './shared.model';

// =============================================================================
// Roll — film roll
// =============================================================================

/** A film roll loaded into the camera. */
export type Roll = {
  id: string;

  /** Brand of the film, e.g. 'Kodak', 'Fujifilm', 'Ilford', 'Lomography'. */
  brand: string;

  /** Name of the film type, e.g. 'Portra 400', 'HP5 Plus', 'Velvia 50'. */
  name: string;

  /** ISO sensitivity of the film (box speed). */
  iso: number;

  /** Film format, e.g. '35mm' or '120'. Optional: not always relevant. */
  format?: FilmFormat;

  /**
   * Number of frames on the roll.
   * Common values: 12, 24, 36 (35mm) or 8, 12, 16 (120).
   */
  frameCount: number;

  /** Date the film was loaded into the camera (ISO 8601). */
  loadedAt?: string;

  /** Date the film was developed (ISO 8601). */
  developedAt?: string;


  /** Optional notes, e.g. deviated development time or push/pull. */
  notes?: string;

  createdAt: string;
  updatedAt: string;
};

export type CreateRollInput = Omit<Roll, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRollInput = Partial<CreateRollInput>;
