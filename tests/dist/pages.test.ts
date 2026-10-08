import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadOverrides, loadUiStrings } from '../../src/lib/content';
import { homePath, nodePath, withBase } from '../../src/lib/paths';
import { formatDate } from '../../src/lib/dates';
import { guideChecked } from '../../src/lib/graph';
import { transliterate } from '../../src/lib/translit';
import {
  base,
  bodyLink,
  endId,
  externalStepId,
  helpEndId,
  graph,
  imageNodeId,
  questionId,
  repo,
  startId,
} from './fixtures';

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

  it.skipIf(!bodyLink)('opens plain Markdown links to other sites in a new tab', () => {
    // Testers on an early build saw body links replace the guide; the build now adds the target.
    const { id, url } = bodyLink!;
    const html = page('cyr', id);
    expect(html).toMatch(
      new RegExp(`<a[^>]*href="${escapeRegex(esc(url))}"[^>]*target="_blank"[^>]*rel="noopener"`),
    );
  });

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

  it.skipIf(!questionId)('pins the answer bar to the bottom of the viewport', () => {
    // The stylesheet is inlined into every page; the answers nav must be sticky at the bottom
    // so buttons stay visible while a long body scrolls behind them.
    const html = page('cyr', questionId as string);
    expect(html).toMatch(/\.answers\{[^}]*position:sticky/);
    expect(html).toMatch(/\.answers\{[^}]*bottom:0/);
  });

  it.skipIf(!questionId)('spaces stacked answer buttons at least 16 px apart', () => {
    // Older adults mis-tap neighbouring targets; the evidence asks for 16–24 CSS px between
    // stacked buttons (1rem renders as 20 px here) (Jin et al. 2007 via W3C;
    // Gomez-Hernandez et al. 2023).
    const html = page('cyr', questionId as string);
    expect(html).toMatch(/\.answers\{[^}]*display:flex/);
    expect(html).toMatch(/\.answers\{[^}]*flex-direction:column/);
    expect(html).toMatch(/\.answers\{[^}]*gap:1rem/);
    expect(html).toMatch(/\.answers \.btn\{[^}]*margin:0(?:;|\})/);
  });

  it('shows the community disclaimer in the footer of every page and on the home page', () => {
    const step = page('cyr', startId);
    const home = read('index.html');
    expect(step).toMatch(new RegExp(`<footer[^>]*>[\\s\\S]*${esc(ui.disclaimer)}`));
    expect(step).toContain(`href="${repo}"`);
    expect(home).toMatch(new RegExp(`<p class="disclaimer">\\s*${esc(ui.disclaimer)}`));
    expect(read('lat/index.html')).toContain(esc(lat(ui.disclaimer)));
    // The home page states it once, above the start button, not again in the footer.
    expect(home.split(esc(ui.disclaimer)).length - 1).toBe(1);
  });

  it('tells on the intro screen when the whole guide was last checked, in both scripts', () => {
    const line = `${ui.lastChecked}: ${formatDate(guideChecked(graph))}`;
    expect(read('index.html')).toContain(`<p class="checked">${esc(line)}</p>`);
    expect(page('cyr', startId)).toContain(`<p class="checked">${esc(line)}</p>`);
    expect(read('lat/index.html')).toContain(esc(lat(line)));
  });

  it('uses the short site name in the header', () => {
    const html = page('cyr', startId);
    expect(html).toMatch(new RegExp(`class="home-link"[^>]*>\\s*${esc(ui.siteShortName)}\\s*<`));
  });

  it('does not pin the answer bar on card pages', () => {
    const html = page('cyr', startId);
    expect(html).toMatch(/\.node-card \.answers[^{]*\{[^}]*position:static/);
  });

  it.skipIf(!endId)('shows a feedback button instead of Back or home on finish pages', () => {
    const html = page('cyr', endId as string);
    // The inlined progress script mentions the selector, so match the rendered attribute only.
    expect(html).not.toContain('class="nav-back"');
    expect(html).not.toContain('data-back href=');
    expect(html).not.toContain('class="nav-home"');
    expect(html).toMatch(
      new RegExp(
        `class="nav-feedback"[\\s\\S]*href="mailto:${escapeRegex(ui.feedbackEmail)}\\?subject=[^"]+"[^>]*>\\s*${esc(ui.feedback)}\\s*<`,
      ),
    );
    // Every other screen keeps the Back button.
    expect(page('cyr', startId)).toContain('data-back href=');
  });

  it.skipIf(!helpEndId)('keeps Back on help end pages, next to the home button', () => {
    // A help screen is reached from the middle of the flow; the reader must be able to retry.
    const html = page('cyr', helpEndId as string);
    expect(html).toContain('data-back href=');
    expect(html).toContain('class="nav-home"');
  });

  it('has a Cyrillic 404 page that links home', () => {
    expect(existsSync(path.join(DIST, '404.html'))).toBe(true);
    const html = read('404.html');
    expect(html).toContain('<html lang="sr-Cyrl"');
    expect(html).toContain(`href="${withBase(base, homePath('cyr'))}"`);
    const latHome = `href="${withBase(base, homePath('lat'))}"`;
    expect(html.split(latHome).length - 1).toBe(1);
  });
});
