import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadOverrides, loadUiStrings } from '../../src/lib/content';
import { homePath, nodePath, withBase } from '../../src/lib/paths';
import { transliterate } from '../../src/lib/translit';
import { base, externalStepId, graph, imageNodeId, questionId, startId } from './fixtures';

const DIST = path.resolve('dist');
const read = (p: string) => readFileSync(path.join(DIST, p), 'utf8');
const page = (script: 'cyr' | 'lat', id: string) => read(`${nodePath(script, id)}index.html`);
const overrides = loadOverrides();
const ui = loadUiStrings();
const lat = (text: string) => transliterate(text, overrides);

/** Escapes text the way Astro escapes expressions in HTML. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('built pages', () => {
  it('has a Cyrillic and a Latin page for every node', () => {
    for (const id of Object.keys(graph.nodes)) {
      expect(existsSync(path.join(DIST, nodePath('cyr', id), 'index.html')), id).toBe(true);
      expect(existsSync(path.join(DIST, nodePath('lat', id), 'index.html')), id).toBe(true);
    }
  });

  it.skipIf(!questionId)('sets the html lang per script', () => {
    expect(page('cyr', questionId!)).toContain('<html lang="sr-Cyrl"');
    expect(page('lat', questionId!)).toContain('<html lang="sr-Latn"');
  });

  it.skipIf(!questionId)('transliterates title and answers on the Latin page', () => {
    const node = graph.nodes[questionId!];
    if (node.type !== 'question') throw new Error('expected a question');
    const html = page('lat', questionId!);
    expect(html).toContain(esc(lat(node.title)));
    const label = esc(lat(node.answers[0].label));
    expect(html).toMatch(new RegExp(`>\\s*${escapeRegex(label)}\\s*<`));
    expect(html).toContain(esc(ui.scriptToggleToCyrillic)); // the toggle label stays Cyrillic on purpose
  });

  it.skipIf(!questionId)('keeps Cyrillic on the Cyrillic page', () => {
    expect(page('cyr', questionId!)).toContain(esc(graph.nodes[questionId!].title));
  });

  it.skipIf(!imageNodeId)('optimizes a Markdown image into _astro/', () => {
    const md = readFileSync(path.resolve('content/nodes', imageNodeId!, 'index.md'), 'utf8');
    const [, alt, file] = md.match(/!\[([^\]]*)\]\(\.\/([^)\s]+)\)/)!;
    const stem = path.basename(file, path.extname(file));
    const html = page('cyr', imageNodeId!);
    expect(html).toMatch(
      new RegExp(`src="${escapeRegex(base)}_astro/${escapeRegex(stem)}\\.[^"]+\\.webp"`),
    );
    expect(html).toContain(`alt="${esc(alt)}"`);
  });

  it.skipIf(!questionId)('prefixes internal links with the base path', () => {
    const node = graph.nodes[questionId!];
    if (node.type !== 'question') throw new Error('expected a question');
    const html = page('cyr', questionId!);
    expect(html).toContain(`href="${withBase(base, nodePath('cyr', node.answers[0].next))}"`);
    expect(html).toContain(`href="${withBase(base, nodePath('lat', questionId!))}"`);
  });

  it.skipIf(!externalStepId)(
    'renders the external button with target _blank and the return instruction',
    () => {
      const node = graph.nodes[externalStepId!];
      if (node.type !== 'step' || !node.external) throw new Error('expected an external step');
      const html = page('cyr', externalStepId!);
      expect(html).toContain(`href="${esc(node.external.url)}"`);
      expect(html).toContain('target="_blank"');
      expect(html).toContain(esc(ui.afterExternal));
    },
  );

  it('has home pages in both scripts with resume hooks and the client script', () => {
    const cyr = read('index.html');
    const latHome = read('lat/index.html');
    expect(cyr).toContain('data-resume');
    expect(cyr).toContain('data-fresh');
    // Astro inlines the client script because its bundle is under Vite's 4 KB inline limit.
    expect(cyr).toContain('<script type="module">');
    expect(cyr).toContain('egradjanin-progress');
    expect(latHome).toContain(esc(lat(ui.resume)));
    const node = page('cyr', startId);
    expect(node).toContain('<script type="module">');
    expect(node).toContain('egradjanin-progress');
  });

  it('has a Cyrillic 404 page that links home', () => {
    expect(existsSync(path.join(DIST, '404.html'))).toBe(true);
    const html = read('404.html');
    expect(html).toContain('<html lang="sr-Cyrl"');
    expect(html).toContain(`href="${withBase(base, homePath('cyr'))}"`);
  });
});
