/**
 * Single source of truth for the deploy base path.
 *
 * This is a GitHub Pages *project* site, so everything is served under
 * /jvblog/ rather than the domain root. astro.config.ts imports BASE for its
 * `base` option, and every internal link runs through withBase() so the two
 * can never drift apart.
 */
export const BASE = "/jvblog";

/** Prefix a root-relative internal path with the deploy base path. */
export function withBase(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}
