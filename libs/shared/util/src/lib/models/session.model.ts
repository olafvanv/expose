import { Photo } from './photo.model';

// =============================================================================
// Session — shooting session
// =============================================================================

/**
 * A shooting session: a continuous series of shots, usually on a single day
 * and with a single film roll loaded in the camera.
 */
export type Session = {
  id: string;

  /** Name of the session, e.g. 'Zeeland roadtrip' or 'Portrait Maaike'. */
  title: string;

  /** Date of the session (ISO 8601, date only: 'YYYY-MM-DD'). */
  date: string;

  /** Reference to the loaded film roll. */
  rollId?: string;

  /** Location of the session, e.g. 'Amsterdam, Jordaan'. */
  location?: string;

  /** Free text notes about the session. */
  notes?: string;

  /**
   * Photos belonging to this session.
   * Optional: not always loaded (lazy, via PhotoDbService).
   */
  photos?: Photo[];

  createdAt: string;
  updatedAt: string;
};

export type CreateSessionInput = Omit<Session, 'id' | 'photos' | 'createdAt' | 'updatedAt'>;
export type UpdateSessionInput = Partial<CreateSessionInput>;
