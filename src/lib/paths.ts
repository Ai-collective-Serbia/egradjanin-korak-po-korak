import type { Script } from './script';

export function homePath(script: Script): string {
  return script === 'lat' ? 'lat/' : '';
}

export function nodePath(script: Script, id: string): string {
  return `${homePath(script)}step/${id}/`;
}

/** Joins Astro's BASE_URL (with or without trailing slash) and a site-relative path. */
export function withBase(base: string, path: string): string {
  return base.endsWith('/') ? base + path : `${base}/${path}`;
}
