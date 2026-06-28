import { Aperture, IsoValue, LightCondition, ShutterSpeed } from './shared.model';

// =============================================================================
// Photo — individual shot
// =============================================================================

/**
 * An individual shot (frame) with all relevant camera settings.
 * This is the core model of the application.
 */
export type Photo = {
  id?: string;

  /**
   * Reference to the session this photo belongs to.
   * Optional: a photo can also be logged independently of a session.
   */
  sessionId?: string;

  /**
   * Reference to the film roll loaded in the camera.
   * Optional: a photo can also be logged independently of a roll.
   */
  rollId?: string;

  /**
   * Frame number on the film roll, e.g. 1–36.
   * Optional: not always tracked.
   */
  frameNumber?: string;

  /** Aperture (f-stop), e.g. 2.8, 5.6, 11. */
  aperture: Aperture;

  /** Shutter speed, e.g. '1/125', '1/60', '4', 'B'. */
  shutterSpeed: ShutterSpeed;

  /**
   * ISO value. Can deviate from the box speed of the film
   * in case of push or pull development.
   */
  iso: IsoValue;

  /** Focal length in millimeters, e.g. 50, 85, 135. */
  focalLength?: number;

  /** Light conditions at the time of shooting. */
  lightCondition?: LightCondition;

  /** Description of the subject or scene. */
  subject?: string;

  /** Free text notes, e.g. filter compensation, viewpoint, distance. */
  notes?: string;

  /** Time the photo was taken (ISO 8601). */
  takenAt: string;

  createdAt: string;
  updatedAt: string;
};

export type CreatePhotoInput = Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePhotoInput = Partial<CreatePhotoInput>;
