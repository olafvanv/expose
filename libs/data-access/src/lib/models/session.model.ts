import { Photo } from './photo.model';

// =============================================================================
// Session — opnamesessie
// =============================================================================

/**
 * Een opnamesessie: een aaneengesloten reeks opnames, doorgaans op één dag
 * en met één filmrol in de camera.
 */
export type Session = {
  id: string;

  /** Naam van de sessie */
  title: string;

  /** Datum van de sessie (ISO 8601, alleen datum: 'YYYY-MM-DD'). */
  date: string;

  /** Verwijzing naar de geladen filmrol. */
  rollId?: string;

  /** Locatie van de sessie, bijv. 'Amsterdam, Jordaan'. */
  location?: string;

  /** Vrije notities over de sessie. */
  notes?: string;

  /** Alle opnames die bij deze sessie horen. */
  photos: Photo[];

  createdAt: string;
  updatedAt: string;
};

export type CreateSessionInput = Omit<
  Session,
  'id' | 'photos' | 'createdAt' | 'updatedAt'
>;
export type UpdateSessionInput = Partial<CreateSessionInput>;
