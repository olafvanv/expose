// =============================================================================
// Shared primitives — shared enums and utility types
// =============================================================================

/** Film format of the camera or film roll. */
export type FilmFormat = '35mm' | '120' | '4x5' | '8x10';

/**
 * Shutter speed as a readable string.
 * Examples: '1/8000', '1/500', '1/30', '1', '4', '30', 'B'
 */
export type ShutterSpeed = string;

/**
 * Aperture value (f-stop).
 * Standard series: 1.0, 1.4, 1.8, 2, 2.8, 3.5, 4, 5.6, 8, 11, 16, 22
 */
export type Aperture = number;

export const apertureOptions = [1.0, 1.4, 1.8, 2, 2.8, 3.5, 4, 5.6, 8, 11, 16, 22];

/** Light conditions at the time of shooting. */
export type LightCondition =
  | 'sunny' // sunny, hard shadows
  | 'partly-cloudy' // partly cloudy
  | 'overcast' // overcast, diffused light
  | 'shade' // shade
  | 'golden-hour' // golden hour (sunrise/sunset)
  | 'blue-hour' // blue hour (twilight)
  | 'indoor-natural' // indoor, daylight
  | 'indoor-artificial' // indoor, artificial light
  | 'night'; // night/low-light

/** ISO value of the film or camera setting. */
export type IsoValue = 25 | 50 | 64 | 100 | 125 | 160 | 200 | 400 | 800 | 1600 | 3200 | 6400 | 12800;
