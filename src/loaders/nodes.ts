import type { Loader } from 'astro/loaders';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Script } from '../lib/script';
import { transliterate, type Overrides } from '../lib/translit';

/** Loads content/nodes/<id>/index.md as entries keyed by node id, transliterated for the Latin script. */
export function nodesLoader(script: Script, overrides: Overrides): Loader {
  return {
    name: `nodes-${script}`,
    async load({ store, renderMarkdown, config, logger }) {
      store.clear();
      const nodesDir = new URL('content/nodes/', config.root);
      let count = 0;
      for (const entry of await readdir(fileURLToPath(nodesDir), { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const fileURL = new URL(`${entry.name}/index.md`, nodesDir);
        let source: string;
        try {
          source = await readFile(fileURL, 'utf8');
        } catch {
          continue;
        }
        const text = script === 'lat' ? transliterate(source, overrides) : source;
        store.set({
          id: entry.name,
          data: {},
          body: text,
          rendered: await renderMarkdown(text, { fileURL }),
        });
        count += 1;
      }
      logger.info(`loaded ${count} node bodies (${script})`);
    },
  };
}
