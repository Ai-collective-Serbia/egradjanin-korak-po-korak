// src/lib/language-docs.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RULE_IDS } from './language';

describe('docs/writing-guide.md and docs/terms.md', () => {
  it('the guide names every rule id the checker can emit', () => {
    const guide = readFileSync('docs/writing-guide.md', 'utf8');
    const missing = RULE_IDS.filter((id) => !guide.includes(`(${id})`));
    expect(missing).toEqual([]);
  });

  it('the term list is a table with the four columns', () => {
    const terms = readFileSync('docs/terms.md', 'utf8');
    expect(terms).toMatch(/^\| Појам \| Пишемо \| Не пишемо \| Објашњење при првој употреби \|$/m);
    expect(terms.split('\n').filter((l) => l.startsWith('| ')).length).toBeGreaterThan(30);
  });
});
