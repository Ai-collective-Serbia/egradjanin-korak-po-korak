import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';
import { loadUiStrings } from '../../src/lib/content';
import { base } from './fixtures';

const ui = loadUiStrings();
const dist = (p: string) => readFileSync(path.resolve('dist', p), 'utf8');

it('manifest start_url, scope, and icons are under the base path', () => {
  const manifest = JSON.parse(dist('manifest.webmanifest'));
  expect(manifest.start_url).toBe(base);
  expect(manifest.scope).toBe(base);
  expect(manifest.display).toBe('standalone');
  expect(manifest.description).toBe(ui.disclaimer);
  expect(manifest.icons.map((i: { src: string }) => i.src)).toEqual([
    `${base}icons/icon-192.png`,
    `${base}icons/icon-512.png`,
  ]);
});

it('pages link the manifest and the apple touch icon with the base path', () => {
  const html = dist('index.html');
  expect(html).toContain(`<link rel="manifest" href="${base}manifest.webmanifest">`);
  expect(html).toContain(`<link rel="apple-touch-icon" href="${base}icons/apple-touch-icon.png">`);
});

it('ships the service worker at the site root', () => {
  expect(dist('sw.js')).toContain("CACHE = 'egradjanin-v1'");
});
