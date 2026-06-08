// =============================================================================
// Shared primitives — gedeelde enums en utility types
// =============================================================================

/** Filmformaat van de camera of filmrol. */
export type FilmFormat = '35mm' | '120' | '4x5' | '8x10';

/**
 * Sluitertijd als leesbare string.
 * Voorbeelden: '1/8000', '1/500', '1/30', '1', '4', '30', 'B'
 */
export type ShutterSpeed = string;

/**
 * Diafragmawaarde (f-stop).
 * Standaard reeks: 1.0, 1.4, 1.8, 2, 2.8, 3.5, 4, 5.6, 8, 11, 16, 22
 */
export type Aperture = number;

/** Lichtomstandigheden op het moment van de opname. */
export type LightCondition =
  | 'sunny'           // zonnig, harde schaduwen
  | 'partly-cloudy'   // halfbewolkt
  | 'overcast'        // bewolkt, diffuus licht
  | 'shade'           // schaduw
  | 'golden-hour'     // gouden uur (zonsopgang/ondergang)
  | 'blue-hour'       // blauwe uur (schemering)
  | 'indoor-natural'  // binnen, daglicht
  | 'indoor-artificial' // binnen, kunstlicht
  | 'night';          // nacht/low-light

/** ISO-waarde van de film of instelling op de camera. */
export type IsoValue =
  | 25 | 50 | 64 | 100 | 125 | 160 | 200 | 400
  | 800 | 1600 | 3200 | 6400 | 12800;
