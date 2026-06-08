import { Aperture, IsoValue, LightCondition, ShutterSpeed } from './shared.model';

// =============================================================================
// Photo — individuele opname
// =============================================================================

/**
 * Een individuele opname (frame) met alle relevante camerainstellingen.
 * Dit is het kernmodel van de applicatie.
 */
export type Photo = {
  id: string;

  /**
   * Verwijzing naar de sessie waar deze opname bij hoort.
   * Optioneel: een foto kan ook los van een sessie worden gelogd.
   */
  sessionId?: string;

  /**
   * Verwijzing naar de filmrol die in de camera zat.
   * Optioneel: een foto kan ook los van een rol worden gelogd.
   */
  rollId?: string;

  /**
   * Framenummer op de filmrol, bijv. 1–36.
   * Optioneel: niet altijd bijgehouden.
   */
  frameNumber?: number;

  // -------------------------------------------------------------------------
  // Belichtingsinstellingen
  // -------------------------------------------------------------------------

  /** Diafragma (f-stop), bijv. 2.8, 5.6, 11. */
  aperture: Aperture;

  /** Sluitertijd, bijv. '1/125', '1/60', '4', 'B'. */
  shutterSpeed: ShutterSpeed;

  /**
   * ISO-waarde. Kan afwijken van de box speed van de film
   * bij push- of pull-ontwikkeling.
   */
  iso: IsoValue;

  /** Focusafstand in millimeter, bijv. 50, 85, 135. */
  focalLength?: number;

  // -------------------------------------------------------------------------
  // Situatie
  // -------------------------------------------------------------------------

  /** Lichtomstandigheden op het moment van de opname. */
  lightCondition?: LightCondition;

  /** Beschrijving van het onderwerp of de scène. */
  subject?: string;

  /** Vrije notities, bijv. filtercorrectie, standpunt, afstand. */
  notes?: string;

  /** Tijdstip van de opname (ISO 8601). */
  takenAt: string;

  createdAt: string;
  updatedAt: string;
};

export type CreatePhotoInput = Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePhotoInput = Partial<CreatePhotoInput>;
