/**
 * Central mapping for externally hosted images (WebP).
 *
 * Set VITE_ASSETS_BASE_URL in your .env / Vercel env to the folder
 * where you uploaded the WebP files (no trailing slash), for example:
 *   https://cdn.your-domain.com/portfolio
 *
 * Each entry below is a path relative to that base.
 * Update filenames if your WebP names differ.
 */

const BASE = import.meta.env.VITE_ASSETS_BASE_URL || '';

export function getAssetUrl(path) {
  if (!path) return '';
  const clean = path.replace(/^\//, '');
  return BASE ? `${BASE}/${clean}` : '';
}

// All image paths (WebP versions)
export const assetPaths = {
  // Landscape
  langza: 'images/langza.webp',
  cometTsu: 'images/comet-tsu.webp',
  mace: 'images/mace_new.webp',
  pangong: 'images/pangong1.webp',
  milkywayArch: 'images/milkyway-arch.webp',
  nubra: 'images/nubra.webp',

  // Portrait
  tso: 'images/tso1.webp',
  milky: 'images/milkydate2.webp',
  hagar: 'images/hagar.webp',
  cometVertical: 'images/comet-vertical.webp',
  cometTele: 'images/comet-tele.webp',
  cb14: 'images/CB-14.webp',
  house: 'images/abandoned_house.webp',

  // Deep sky
  andromeda: 'images/andromeda.webp',
  orion: 'images/orion.webp',

  // Star trails
  pangongTrail: 'images/pangong_trail.webp',
  shantiTsupa: 'images/shanti_tsupa.webp',
  tsoTrails: 'images/tso_trails.webp',

  // Meteor shower
  geminids: 'images/geminids.webp',
  perseids: 'images/perseids.webp',

  // About headshot
  headshot: 'images/potrait.webp',
};

