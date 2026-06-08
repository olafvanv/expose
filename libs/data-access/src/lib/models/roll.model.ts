import { FilmFormat } from './shared.model';

// =============================================================================
// Roll — filmrolletje
// =============================================================================

/** Een filmrolletje dat in de camera wordt geladen. */
export type Roll = {
  id: string;

  /** Merknaam van de film, bijv. 'Kodak', 'Fujifilm', 'Ilford', 'Lomography'. */
  brand: string;

  /** Naam van het filmtype, bijv. 'Portra 400', 'HP5 Plus', 'Velvia 50'. */
  name: string;

  /** ISO-gevoeligheid van de film (box speed). */
  iso: number;

  /** Filmformaat, bijv. '35mm' of '120'. Optioneel: niet altijd relevant. */
  format?: FilmFormat;

  /**
   * Aantal frames op de rol.
   * Gebruikelijke waarden: 12, 24, 36 (35mm) of 8, 12, 16 (120).
   */
  frameCount: number;

  /** Datum waarop de film in de camera is geladen (ISO 8601). */
  loadedAt?: string;

  /** Datum waarop de film is ontwikkeld (ISO 8601). */
  developedAt?: string;


  /** Optionele notities, bijv. afwijkende ontwikkeltijd of push/pull. */
  notes?: string;

  createdAt: string;
  updatedAt: string;
};

export type CreateRollInput = Omit<Roll, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRollInput = Partial<CreateRollInput>;
