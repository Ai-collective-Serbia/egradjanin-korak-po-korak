import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadGraph } from '../../src/lib/content';

const DIST = path.resolve('dist');
const read = (p: string) => readFileSync(path.join(DIST, p), 'utf8');

describe('built pages', () => {
  const graph = loadGraph();

  it('has a Cyrillic and a Latin page for every node', () => {
    for (const id of Object.keys(graph.nodes)) {
      expect(existsSync(path.join(DIST, 'step', id, 'index.html')), id).toBe(true);
      expect(existsSync(path.join(DIST, 'lat', 'step', id, 'index.html')), id).toBe(true);
    }
  });

  it('sets the html lang per script', () => {
    expect(read('step/have-id-card/index.html')).toContain('<html lang="sr-Cyrl"');
    expect(read('lat/step/have-id-card/index.html')).toContain('<html lang="sr-Latn"');
  });

  it('transliterates title, body, and answers on the Latin page', () => {
    const html = read('lat/step/have-id-card/index.html');
    expect(html).toContain('Da li imate ličnu kartu sa čipom?');
    expect(html).toMatch(/>\s*Da\s*</);
    expect(html).toContain('Ћирилица'); // the script toggle label stays Cyrillic on purpose
  });

  it('keeps Cyrillic on the Cyrillic page', () => {
    expect(read('step/have-id-card/index.html')).toContain('Да ли имате личну карту са чипом?');
  });

  it('optimizes a Markdown image into /_astro/', () => {
    const html = read('step/register-euprava/index.html');
    expect(html).toMatch(/src="\/egradjanin-korak-po-korak\/_astro\/01-home\.[^"]+\.webp"/);
    expect(html).toContain('alt="Почетна страна еУправе"');
  });

  it('prefixes internal links with the base path', () => {
    const html = read('step/have-id-card/index.html');
    expect(html).toContain('href="/egradjanin-korak-po-korak/step/have-email/"');
    expect(html).toContain('href="/egradjanin-korak-po-korak/lat/step/have-id-card/"');
  });

  it('renders the external button with target _blank and the return instruction', () => {
    const html = read('step/register-euprava/index.html');
    expect(html).toContain('href="https://euprava.gov.rs/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('Када завршите, вратите се овде.');
  });
});
