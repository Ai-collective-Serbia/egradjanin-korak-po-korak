import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const BASE = '/egradjanin-korak-po-korak/';
const dist = (p: string) => readFileSync(path.resolve('dist', p), 'utf8');

it('manifest start_url, scope, and icons are under the base path', () => {
  const manifest = JSON.parse(dist('manifest.webmanifest'));
  expect(manifest.start_url).toBe(BASE);
  expect(manifest.scope).toBe(BASE);
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.map((i: { src: string }) => i.src)).toEqual([
    `${BASE}icons/icon-192.png`,
    `${BASE}icons/icon-512.png`,
  ]);
});

it('pages link the manifest and the apple touch icon with the base path', () => {
  const html = dist('index.html');
  expect(html).toContain(`<link rel="manifest" href="${BASE}manifest.webmanifest">`);
  expect(html).toContain(`<link rel="apple-touch-icon" href="${BASE}icons/apple-touch-icon.png">`);
});

it('ships the service worker at the site root', () => {
  expect(dist('sw.js')).toContain("CACHE = 'egradjanin-v1'");
});
