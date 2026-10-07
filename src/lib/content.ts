import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { parseGraph, validateGraph, type Graph } from './graph';
import type { Overrides } from './translit';

const uiStringsSchema = z
  .object({
    siteName: z.string(),
    tagline: z.string(),
    start: z.string(),
    resume: z.string(),
    reset: z.string(),
    resetConfirm: z.string(),
    next: z.string(),
    back: z.string(),
    answersLabel: z.string(),
    afterExternal: z.string(),
    opensNewTab: z.string(),
    progressPart: z.string(),
    progressOf: z.string(),
    print: z.string(),
    scriptToggleToLatin: z.string(),
    scriptToggleToCyrillic: z.string(),
    notFoundTitle: z.string(),
    notFoundBody: z.string(),
    notFoundHome: z.string(),
    siteShortName: z.string(),
    disclaimer: z.string(),
    disclaimerSource: z.string(),
  })
  .strict();

export type UiStrings = z.infer<typeof uiStringsSchema>;

function contentDir(root: string): string {
  return path.join(root, 'content');
}

export function listBodyIds(root = process.cwd()): Set<string> {
  const nodesDir = path.join(contentDir(root), 'nodes');
  if (!existsSync(nodesDir)) return new Set();
  const ids = readdirSync(nodesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(path.join(nodesDir, d.name, 'index.md')))
    .map((d) => d.name);
  return new Set(ids);
}

export function loadGraph(root = process.cwd()): Graph {
  const file = path.join(contentDir(root), 'graph.yaml');
  const graph = parseGraph(readFileSync(file, 'utf8'));
  const errors = validateGraph(graph, listBodyIds(root));
  if (errors.length) {
    throw new Error(`content/graph.yaml is invalid:\n  - ${errors.join('\n  - ')}`);
  }
  return graph;
}

export function loadOverrides(root = process.cwd()): Overrides {
  const file = path.join(contentDir(root), 'translit-overrides.yaml');
  if (!existsSync(file)) return {};
  const data = parse(readFileSync(file, 'utf8')) ?? {};
  return z.record(z.string(), z.string()).parse(data);
}

export function loadUiStrings(root = process.cwd()): UiStrings {
  const file = path.join(contentDir(root), 'ui-strings.yaml');
  return uiStringsSchema.parse(parse(readFileSync(file, 'utf8')));
}
