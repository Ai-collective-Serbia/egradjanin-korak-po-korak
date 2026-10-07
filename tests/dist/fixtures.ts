import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { loadGraph } from '../../src/lib/content';
import { base as configuredBase, repo } from '../../site.config.mjs';

export const graph = loadGraph();
export { repo };
/** Base path with a trailing slash, as Astro's BASE_URL renders it. */
export const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;

const entries = Object.entries(graph.nodes);
function firstId(pred: (n: (typeof entries)[number][1]) => boolean): string | undefined {
  return entries.find(([, n]) => pred(n))?.[0];
}

export const startId = graph.start;
export const questionId = firstId((n) => n.type === 'question');
export const externalStepId = firstId((n) => n.type === 'step' && n.external !== undefined);
export const cardId = firstId((n) => n.type === 'card');
export const endId = firstId((n) => n.type === 'end');
/** First node whose body has a plain Markdown link to another site, with that link's URL. */
export const bodyLink = entries
  .map(([id]) => {
    const file = path.resolve('content/nodes', id, 'index.md');
    const match =
      existsSync(file) && readFileSync(file, 'utf8').match(/\[[^\]]+\]\((https?:[^)\s]+)\)/);
    return match ? { id, url: match[1] } : undefined;
  })
  .find((x) => x !== undefined);
/** First node whose body references a relative image, or undefined. */
export const imageNodeId = entries
  .map(([id]) => id)
  .find((id) => {
    const file = path.resolve('content/nodes', id, 'index.md');
    return existsSync(file) && /!\[[^\]]*\]\(\.\//.test(readFileSync(file, 'utf8'));
  });
