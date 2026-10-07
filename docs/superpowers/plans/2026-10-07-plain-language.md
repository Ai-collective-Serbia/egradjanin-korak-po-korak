# Plain-Language Standard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the guide a written Serbian writing standard, a term list for agents, a deterministic language check in `npm run validate`, a review rubric with a `/language-review` skill, and a pull-request gate that requires the review when content changes.

**Architecture:** A small line-based Markdown reader (`src/lib/text.ts`) feeds pure rule functions (`src/lib/language.ts`) that return findings; a Vitest file runs them on the real content inside `npm run validate`. Docs in Serbian Cyrillic carry the rules and terms; `AGENTS.md` (renamed from `CLAUDE.md`) points agents at them. A JS script enforces the review section on pull requests from CI, and an optional Claude Code hook reminds before `gh pr create`.

**Tech Stack:** TypeScript, Vitest 4, Node 24 (engines >= 22.12), zod 4 and yaml (already present), GitHub Actions. No new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-10-07-plain-language-design.md`

## Global Constraints

- English for every identifier, file name, rule id and commit message; Serbian Cyrillic only for text the reader or a content author sees (`docs/writing-guide.md`, `docs/terms.md`, content bodies).
- No new runtime dependency. No Python. Everything runs under the existing `npm test`, `npm run validate`, `npm run build`, `npm run test:dist`, `npm run lhci`.
- Letters are counted with `\p{L}` on code points, never `.length` on a UTF-16 string for lengths that matter (titles and labels use `[...s].length`). Never use JavaScript `\b`; use `(?<!\p{L})` and `(?!\p{L})`.
- Node ids starting with `counter-list-` are directory tables: only the `scripts` rule applies to their bodies; `title-label-length` and `gender-form` still apply to their graph entries.
- Error-level rules fail `npm run validate`; warning-level rules print and never fail.
- Content edits in this work are limited to spec section 3.9: the six homoglyphs and the Roman numeral spacing, the two sentences over 20 words, the ten banner migrations, and any slash form outside the fixed pattern.
- The fixed slash pattern: Cyrillic word, `/`, exactly `ла`, `а` or `на`, no hyphen, no space. `и/или` is an error; write `или`.
- Prettier ignores `content/` and `docs/`; everything else must pass `npm run format:check`.
- Commit after every task with the message given in the task. Run git as plain `git` commands from the worktree.

## Review Focus

1. A body saved with Windows line endings (`\r\n`) or trailing spaces must parse into the same blocks as a Unix file. Test in Task 1.
2. A sentence that ends inside Serbian quotation marks („…“) or a bracket must split after the closing mark, and a domain such as `eid.gov.rs` or an abbreviation such as `нпр.` must never split a sentence. Test in Task 1.
3. A Latin brand with a Cyrillic case ending joined by a hyphen (`Gmail-а`, `iPhone-у`, `Wi-Fi-ја`) is correct Serbian and must not be a `scripts` error, while a Latin letter inside one Cyrillic word must be. Test in Task 2.
4. An image whose alt text equals its file name, or is empty, is an `alt-text` error; the existing 26 images, all with real alt text, must produce none. Test in Task 2 and Task 3.
5. A pull request with no description (`body` is `null` in the event) must not crash the gate; it fails with the message when `content/` changed and passes otherwise. Test in Task 7.

---

### Task 1: Markdown text reader

**Files:**
- Create: `src/lib/text.ts`
- Test: `src/lib/text.test.ts`

**Interfaces:**
- Produces:
  - `type Block` (union of `heading`, `paragraph`, `quote`, `image`, `list`; every block has `line: number` and `ignore: Set<string>`; `image` has `alt` and `file`; `list` has `ordered` and `items: { text: string; line: number }[]`; the others have `text: string`, which keeps inline Markdown such as `**`).
  - `parseBlocks(markdown: string): Block[]`
  - `plainText(inline: string): string` strips `**`, `__`, backslash escapes, `[text](url)` to `text`, and HTML tags (keeping inner text).
  - `splitSentences(text: string): string[]`
  - `words(text: string): string[]`
  - `letters(word: string): number`
  - `mixesScripts(word: string): boolean`
  - `boldSpans(inline: string): string[]`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/text.test.ts
import { describe, expect, it } from 'vitest';
import {
  boldSpans,
  letters,
  mixesScripts,
  parseBlocks,
  plainText,
  splitSentences,
  words,
} from './text';

describe('parseBlocks', () => {
  it('reads headings, paragraphs, lists, quotes and images with line numbers', () => {
    const md = [
      '---',
      'title: x',
      '---',
      '> Ово радите у водичу.',
      '',
      '## Наслов',
      '',
      'Први пасус. Друга реченица',
      'у истом пасусу.',
      '',
      '1. Притисните **Даље**.',
      '2. Упишите број.',
      '   Наставак другог корака.',
      '',
      '- ставка',
      '',
      '![Пример: дугме Даље](./next.png)',
    ].join('\n');
    const blocks = parseBlocks(md);
    expect(blocks.map((b) => b.kind)).toEqual([
      'quote',
      'heading',
      'paragraph',
      'list',
      'list',
      'image',
    ]);
    expect(blocks[0]).toMatchObject({ text: 'Ово радите у водичу.', line: 4 });
    expect(blocks[1]).toMatchObject({ text: 'Наслов', line: 6 });
    expect(blocks[2]).toMatchObject({
      text: 'Први пасус. Друга реченица у истом пасусу.',
      line: 8,
    });
    expect(blocks[3]).toMatchObject({
      ordered: true,
      items: [
        { text: 'Притисните **Даље**.', line: 11 },
        { text: 'Упишите број. Наставак другог корака.', line: 12 },
      ],
    });
    expect(blocks[4]).toMatchObject({ ordered: false, items: [{ text: 'ставка', line: 15 }] });
    expect(blocks[5]).toMatchObject({ alt: 'Пример: дугме Даље', file: './next.png', line: 17 });
  });

  it('treats Windows line endings and trailing spaces like Unix text', () => {
    const unix = parseBlocks('Пасус један.\n\nПасус два.\n');
    const windows = parseBlocks('Пасус један.  \r\n\r\nПасус два.\r\n');
    expect(windows.map((b) => b.kind)).toEqual(unix.map((b) => b.kind));
    expect(windows[1]).toMatchObject({ text: 'Пасус два.' });
  });

  it('attaches a language-ignore comment to the next block only', () => {
    const blocks = parseBlocks(
      '<!-- language-ignore sentence-length bold -->\n\nДуг пасус.\n\nОбичан пасус.',
    );
    expect([...blocks[0].ignore]).toEqual(['sentence-length', 'bold']);
    expect(blocks[1].ignore.size).toBe(0);
  });

  it('keeps summary text as a heading and skips bare HTML wrapper lines', () => {
    const blocks = parseBlocks('<details>\n<summary>Шта пише у менију</summary>\n\nТекст.\n\n</details>');
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph']);
    expect(blocks[0]).toMatchObject({ text: 'Шта пише у менију' });
  });
});

describe('plainText', () => {
  it('removes inline markup and keeps the words', () => {
    expect(plainText('Притисните **Даље** и [сајт](https://x.rs) <a href="/">овде</a> \\*')).toBe(
      'Притисните Даље и сајт овде *',
    );
  });
});

describe('splitSentences', () => {
  it('splits on full stops, question and exclamation marks before a capital or digit', () => {
    expect(splitSentences('Прва. Друга? Трећа! 4. корак')).toEqual([
      'Прва.',
      'Друга?',
      'Трећа!',
      '4. корак',
    ]);
  });

  it('does not split after abbreviations, inside domains, or after a short ordinal', () => {
    expect(splitSentences('Идите на сајт eid.gov.rs. Понесите нпр. личну карту. Дођите 29. новембра.')).toEqual([
      'Идите на сајт eid.gov.rs.',
      'Понесите нпр. личну карту.',
      'Дођите 29. новембра.',
    ]);
    expect(splitSentences('Адреса је ул. Краља Петра 1. Радно време је 8 сати.')).toEqual([
      'Адреса је ул. Краља Петра 1.',
      'Радно време је 8 сати.',
    ]);
  });

  it('splits after a closing quotation mark or bracket', () => {
    expect(splitSentences('Пише „Потврди“. Притисните га (одмах). Затим чекајте.')).toEqual([
      'Пише „Потврди“.',
      'Притисните га (одмах).',
      'Затим чекајте.',
    ]);
  });

  it('keeps a trailing fragment without a full stop', () => {
    expect(splitSentences('Припремите:')).toEqual(['Припремите:']);
  });
});

describe('words, letters, scripts, bold', () => {
  it('counts Cyrillic and Latin words, keeping hyphens, dots and apostrophes inside a word', () => {
    expect(words('Сајт eid.gov.rs и Gmail-а, б.б. ПИН')).toEqual([
      'Сајт',
      'eid.gov.rs',
      'и',
      'Gmail-а',
      'б.б',
      'ПИН',
    ]);
  });

  it('counts letters by code point and ignores digits', () => {
    expect(letters('љубав')).toBe(5);
    expect(letters('ПИН1')).toBe(3);
  });

  it('flags a Latin letter inside a Cyrillic word but not a hyphenated brand', () => {
    expect(mixesScripts('oслобођења')).toBe(true); // Latin o
    expect(mixesScripts('ПетраIКарађорђевића')).toBe(true);
    expect(mixesScripts('Gmail-а')).toBe(false);
    expect(mixesScripts('Wi-Fi-ја')).toBe(false);
    expect(mixesScripts('ослобођења')).toBe(false);
  });

  it('returns bold spans', () => {
    expect(boldSpans('Притисните **Приложите документа** па **Даље**.')).toEqual([
      'Приложите документа',
      'Даље',
    ]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/text.test.ts`
Expected: FAIL, `Cannot find module './text'`.

- [ ] **Step 3: Write the reader**

```ts
// src/lib/text.ts
/**
 * Line-based reader for the Markdown the content uses: headings, paragraphs, bullet and numbered
 * lists, bold, images, blockquotes, and the odd inline HTML tag. It is not a Markdown parser; it is
 * enough for the language rules, and it needs no dependency.
 */

type Base = { line: number; ignore: Set<string> };
export type Block =
  | ({ kind: 'heading'; text: string } & Base)
  | ({ kind: 'paragraph'; text: string } & Base)
  | ({ kind: 'quote'; text: string } & Base)
  | ({ kind: 'image'; alt: string; file: string } & Base)
  | ({ kind: 'list'; ordered: boolean; items: { text: string; line: number }[] } & Base);

const HEADING = /^#{1,6}\s+(.*)$/;
const SUMMARY = /^\s*<summary>(.*?)<\/summary>\s*$/i;
const HTML_WRAPPER = /^\s*<\/?(details|div|p|br)[^>]*>\s*$/i;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/;
const QUOTE = /^>\s?(.*)$/;
const LIST_ITEM = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+/;
const IGNORE = /^<!--\s*language-ignore\s+([a-z-]+(?:\s+[a-z-]+)*)\s*-->\s*$/;

export function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: Block[] = [];
  let ignore = new Set<string>();
  let current: Block | null = null;

  // Skip front matter without removing lines, so line numbers stay those of the file.
  let first = 0;
  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex((l, k) => k > 0 && l.trim() === '---');
    if (end > 0) first = end + 1;
  }

  const flush = () => {
    if (current) {
      blocks.push(current);
      current = null;
      ignore = new Set();
    }
  };
  const push = (block: Block) => {
    flush();
    blocks.push(block);
    ignore = new Set();
  };

  for (let i = first; i < lines.length; i++) {
    const raw = lines[i].replace(/\s+$/, '');
    const line = i + 1;
    let m: RegExpMatchArray | null;

    if ((m = raw.match(IGNORE))) {
      flush();
      ignore = new Set(m[1].split(/\s+/));
      continue;
    }
    if (raw.trim() === '' || HTML_WRAPPER.test(raw)) {
      flush();
      continue;
    }
    if ((m = raw.match(HEADING)) || (m = raw.match(SUMMARY))) {
      push({ kind: 'heading', text: m[1].trim(), line, ignore });
      continue;
    }
    if ((m = raw.match(IMAGE))) {
      push({ kind: 'image', alt: m[1].trim(), file: m[2], line, ignore });
      continue;
    }
    if ((m = raw.match(QUOTE))) {
      if (current?.kind === 'quote') current.text += ' ' + m[1].trim();
      else {
        flush();
        current = { kind: 'quote', text: m[1].trim(), line, ignore };
      }
      continue;
    }
    if ((m = raw.match(LIST_ITEM))) {
      if (current?.kind !== 'list') {
        flush();
        current = { kind: 'list', ordered: ORDERED.test(raw), items: [], line, ignore };
      }
      current.items.push({ text: m[2].trim(), line });
      continue;
    }
    if (current?.kind === 'list' && /^\s+/.test(raw)) {
      const last = current.items[current.items.length - 1];
      last.text += ' ' + raw.trim();
      continue;
    }
    if (current?.kind === 'paragraph') current.text += ' ' + raw.trim();
    else {
      flush();
      current = { kind: 'paragraph', text: raw.trim(), line, ignore };
    }
  }
  flush();
  return blocks;
}

export function plainText(inline: string): string {
  return inline
    .replace(/<[^>]+>/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/\\([\\*_`#])/g, '$1');
}

const ABBREVIATIONS = new Set(['бр', 'нпр', 'тзв', 'итд', 'тј', 'ул', 'г', 'рег', 'б.б', 'сл', 'др']);
const BOUNDARY = /[.!?…]+["“”»’)\]]*(?=\s+["„“«(\[]*(?:\*\*)?[\p{Lu}\d])/gu;

export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;
  for (const m of text.matchAll(BOUNDARY)) {
    const index = m.index as number;
    const end = index + m[0].length;
    const lastToken = text.slice(start, index).match(/(\S+)$/)?.[1] ?? '';
    const bare = lastToken.replace(/^[„“"(\[*]+/, '').toLowerCase();
    if (ABBREVIATIONS.has(bare)) continue;
    if (/^\d{1,2}$/.test(bare) && m[0].startsWith('.') && /^\s+\p{Ll}/u.test(text.slice(end)))
      continue;
    out.push(text.slice(start, end).trim());
    start = end;
  }
  const rest = text.slice(start).trim();
  if (rest) out.push(rest);
  return out;
}

const WORD = /[\p{L}\p{N}]+(?:[-.'’@#][\p{L}\p{N}]+)*/gu;

export function words(text: string): string[] {
  return text.match(WORD) ?? [];
}

export function letters(word: string): number {
  return [...word].filter((c) => /\p{L}/u.test(c)).length;
}

export function mixesScripts(word: string): boolean {
  return word
    .split('-')
    .some((part) => /\p{Script=Cyrillic}/u.test(part) && /\p{Script=Latin}/u.test(part));
}

export function boldSpans(inline: string): string[] {
  return [...inline.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1].trim());
}
```

Note on the ordinal rule in `splitSentences`: a one- or two-digit number followed by a full stop is an ordinal only when a lowercase word follows ("29. новембра"); "Краља Петра 1. Радно" is two sentences because "Радно" is capitalised. The test covers both.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/text.test.ts`
Expected: PASS, 13 tests. If the "4. корак" case fails, check that the lookahead in `BOUNDARY` accepts a digit and that the ordinal exception requires a lowercase letter after the stop.

- [ ] **Step 5: Format, type-check and commit**

Run: `npx prettier --write src/lib/text.ts src/lib/text.test.ts && npm run check`
Expected: no diff after formatting beyond what prettier changed, and `astro check` reports 0 errors.

```bash
git add src/lib/text.ts src/lib/text.test.ts
git commit -m "feat: line-based Markdown text reader for language checks"
```

---

### Task 2: Language rules and the content runner

**Files:**
- Create: `src/lib/language.ts`
- Test: `src/lib/language.unit.test.ts`

**Interfaces:**
- Consumes from Task 1: `parseBlocks`, `plainText`, `splitSentences`, `words`, `letters`, `mixesScripts`, `boldSpans`, `Block`.
- Consumes from `src/lib/graph.ts` (exists): `parseGraph(yaml: string): Graph`, `outgoing(node): Edge[]`, `Graph`.
- Produces:
  - `type Severity = 'error' | 'warning'`
  - `type Finding = { file: string; line: number; rule: string; severity: Severity; message: string; excerpt: string }`
  - `const LIMITS` (sentenceError 20, sentenceWarning 15, paragraphSentences 3, stepSentences 3, screenWords 150, boldWords 4, altWords 3, titleChars 50, labelChars 40)
  - `const RULE_IDS: readonly string[]`
  - `isDirectoryNode(id: string): boolean`
  - `genderFormErrors(text: string): string[]`
  - `checkBody(id: string, markdown: string): Finding[]`
  - `checkGraphText(graph: Graph): Finding[]`
  - `checkContent(root?: string): { findings: Finding[]; trend: { meanSentenceLength: number; longWordShare: number } }`
  - `formatFinding(f: Finding): string` producing `content/nodes/<id>/index.md:<line>: <rule>: <message> — "<excerpt>"` (no `:<line>` when line is 0).

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/language.unit.test.ts
import { describe, expect, it } from 'vitest';
import { parseGraph } from './graph';
import {
  checkBody,
  checkGraphText,
  formatFinding,
  genderFormErrors,
  isDirectoryNode,
  LIMITS,
  RULE_IDS,
} from './language';

const rules = (findings: { rule: string; severity: string }[]) =>
  findings.map((f) => `${f.severity}:${f.rule}`);

describe('sentence, paragraph, step and screen length', () => {
  it('errors over 20 words and warns over 15', () => {
    const long = 'реч '.repeat(21).trim() + '.';
    const medium = 'реч '.repeat(16).trim() + '.';
    const short = 'Кратка реченица.';
    expect(rules(checkBody('x', long))).toEqual(['error:sentence-length']);
    expect(rules(checkBody('x', medium))).toEqual(['warning:sentence-length']);
    expect(rules(checkBody('x', short))).toEqual([]);
  });

  it('warns on a paragraph with more than 3 sentences, counting list intros as their own sentence', () => {
    expect(rules(checkBody('x', 'Једна. Друга. Трећа. Четврта.'))).toEqual([
      'warning:paragraph-length',
    ]);
    expect(rules(checkBody('x', 'Једна. Друга. Трећа.'))).toEqual([]);
  });

  it('warns on a numbered step with 3 or more sentences, not on a bullet', () => {
    const step = '1. Прва. Друга. Трећа.\n2. Само једна.';
    expect(rules(checkBody('x', step))).toEqual(['warning:one-action']);
    expect(rules(checkBody('x', '- Прва. Друга. Трећа.'))).toEqual([]);
  });

  it('warns when a screen has more than 150 words, headings included and alt text excluded', () => {
    const body = '## Наслов\n\n' + ('реч '.repeat(10).trim() + '.\n\n').repeat(15);
    const alt = '![' + 'опис '.repeat(40) + '](./a.png)';
    expect(rules(checkBody('x', body))).toContain('warning:screen-length');
    expect(rules(checkBody('x', 'Кратко.\n\n' + alt))).toEqual([]);
    expect(LIMITS.screenWords).toBe(150);
  });
});

describe('scripts and gender forms', () => {
  it('errors on a Latin letter inside a Cyrillic word, in bodies and alt text, also on directory nodes', () => {
    expect(rules(checkBody('counter-list-a', '- **Пошта**, Трг oслобођења 1.'))).toEqual([
      'error:scripts',
    ]);
    expect(rules(checkBody('x', '![Tрг Бранка Радичевића 1](./a.png)'))).toEqual(['error:scripts']);
    expect(rules(checkBody('x', 'Отворите Gmail-а на iPhone-у преко Wi-Fi-ја.'))).toEqual([]);
  });

  it('accepts the fixed slash pattern and rejects every other slash form', () => {
    expect(genderFormErrors('Нашао/ла сам, пријављен/а, сигуран/на.')).toEqual([]);
    expect(genderFormErrors('Нашао/-ла сам')).toHaveLength(1);
    expect(genderFormErrors('Нашао / ла сам')).toHaveLength(1);
    expect(genderFormErrors('Нашао/ло')).toHaveLength(1);
    expect(genderFormErrors('и/или')).toHaveLength(1);
    expect(genderFormErrors('Сајт eid.gov.rs/usluge и 01.01.-31.03.')).toEqual([]);
  });

  it('reports gender-form errors from a body', () => {
    expect(rules(checkBody('x', 'Понео/ла сам и/или папир.'))).toEqual(['error:gender-form']);
  });
});

describe('images, bold, callout, dates, punctuation', () => {
  it('errors on missing, file-name or very short alt text', () => {
    expect(rules(checkBody('x', '![](./next.png)'))).toEqual(['error:alt-text']);
    expect(rules(checkBody('x', '![next](./next.png)'))).toEqual(['error:alt-text']);
    expect(rules(checkBody('x', '![Дугме Даље](./next.png)'))).toEqual(['error:alt-text']);
    expect(rules(checkBody('x', '![Пример: дугме Даље на дну](./next.png)'))).toEqual([]);
  });

  it('warns on a bold span over 4 words', () => {
    expect(rules(checkBody('x', '**Ово је предуга подебљана реченица.** Даље.'))).toEqual([
      'warning:bold',
    ]);
    expect(rules(checkBody('x', 'Притисните **Приложите документа**.'))).toEqual([]);
  });

  it('warns when the first block is a bold "Ово радите" banner, not when it is a blockquote', () => {
    expect(rules(checkBody('x', '**Ово радите у формулару, не на овој страни.** Текст.'))).toEqual([
      'warning:bold',
      'warning:callout',
    ]);
    expect(rules(checkBody('x', '> Ово радите у формулару на сајту eid.gov.rs, не у водичу.'))).toEqual(
      [],
    );
  });

  it('warns on a dash between numbers and on punctuation slips', () => {
    expect(rules(checkBody('x', 'Радно време 9–18 часова.'))).toEqual(['warning:dates']);
    expect(rules(checkBody('x', 'Од 9 до 18 часова.'))).toEqual([]);
    expect(rules(checkBody('x', 'Двоструки  размак.'))).toEqual(['warning:punctuation']);
    expect(rules(checkBody('x', 'Размак пре тачке .'))).toEqual(['warning:punctuation']);
  });

  it('skips every prose rule on directory nodes', () => {
    const long = 'реч '.repeat(30).trim() + '.';
    expect(rules(checkBody('counter-list-b', long + '\n\n![](./a.png)'))).toEqual([]);
    expect(isDirectoryNode('counter-list-b')).toBe(true);
    expect(isDirectoryNode('counter-list')).toBe(false);
  });

  it('honours a language-ignore comment for the next block', () => {
    const long = 'реч '.repeat(21).trim() + '.';
    expect(rules(checkBody('x', `<!-- language-ignore sentence-length -->\n${long}`))).toEqual([]);
    expect(rules(checkBody('x', `<!-- language-ignore bold -->\n${long}`))).toEqual([
      'error:sentence-length',
    ]);
  });
});

describe('graph text', () => {
  const graph = parseGraph(`
start: a
nodes:
  a:
    type: question
    title: ${'Н'.repeat(51)}
    answers:
      - { label: ${'о'.repeat(41)}, next: b }
      - { label: Нисам сигуран/-на, next: b }
  b:
    type: step
    title: Кратак наслов
    external: { label: ${'о'.repeat(41)}, url: https://example.rs/ }
    next: c
  c:
    type: end
    title: Крај
`);

  it('errors on long titles and labels, external labels included, and on bad slash forms', () => {
    const findings = checkGraphText(graph);
    expect(rules(findings).sort()).toEqual(
      [
        'error:title-label-length',
        'error:title-label-length',
        'error:title-label-length',
        'error:gender-form',
      ].sort(),
    );
    expect(findings.every((f) => f.file === 'content/graph.yaml')).toBe(true);
  });
});

describe('formatting and rule ids', () => {
  it('formats a finding as file:line: rule: message — "excerpt"', () => {
    const text = formatFinding({
      file: 'content/nodes/x/index.md',
      line: 3,
      rule: 'sentence-length',
      severity: 'error',
      message: '21 words in one sentence (limit 20)',
      excerpt: 'Ако мислите…',
    });
    expect(text).toBe(
      'content/nodes/x/index.md:3: sentence-length: 21 words in one sentence (limit 20) — "Ако мислите…"',
    );
    expect(formatFinding({ file: 'content/graph.yaml', line: 0, rule: 'gender-form', severity: 'error', message: 'm', excerpt: 'e' })).toBe('content/graph.yaml: gender-form: m — "e"');
  });

  it('lists every rule id the checker can emit', () => {
    expect([...RULE_IDS].sort()).toEqual(
      [
        'alt-text',
        'bold',
        'callout',
        'dates',
        'gender-form',
        'one-action',
        'paragraph-length',
        'punctuation',
        'scripts',
        'screen-length',
        'sentence-length',
        'title-label-length',
      ].sort(),
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/language.unit.test.ts`
Expected: FAIL, `Cannot find module './language'`.

- [ ] **Step 3: Write the rules**

```ts
// src/lib/language.ts
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { outgoing, parseGraph, type Graph } from './graph';
import {
  boldSpans,
  letters,
  mixesScripts,
  parseBlocks,
  plainText,
  splitSentences,
  words,
  type Block,
} from './text';

export type Severity = 'error' | 'warning';
export type Finding = {
  file: string;
  line: number;
  rule: string;
  severity: Severity;
  message: string;
  excerpt: string;
};

export const LIMITS = {
  sentenceError: 20,
  sentenceWarning: 15,
  paragraphSentences: 3,
  stepSentences: 3,
  screenWords: 150,
  boldWords: 4,
  altWords: 3,
  titleChars: 50,
  labelChars: 40,
} as const;

export const RULE_IDS = [
  'sentence-length',
  'paragraph-length',
  'one-action',
  'screen-length',
  'scripts',
  'gender-form',
  'alt-text',
  'title-label-length',
  'bold',
  'callout',
  'dates',
  'punctuation',
] as const;

export function isDirectoryNode(id: string): boolean {
  return id.startsWith('counter-list-');
}

function excerpt(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > 80 ? t.slice(0, 77) + '…' : t;
}

/** Prose texts of a block: everything a reader reads, alt text excluded. */
function proseTexts(block: Block): string[] {
  switch (block.kind) {
    case 'image':
      return [];
    case 'list':
      return block.items.map((i) => i.text);
    default:
      return [block.text];
  }
}

const SLASH_FORM = /(\p{Script=Cyrillic}+)( ?-? ?)\/( ?-? ?)(\p{Script=Cyrillic}{1,3})(?!\p{L})/gu;
const ENDINGS = new Set(['ла', 'а', 'на']);

export function genderFormErrors(text: string): string[] {
  const errors: string[] = [];
  for (const m of text.matchAll(SLASH_FORM)) {
    const [whole, , before, after, ending] = m;
    if (before !== '' || after !== '' || !ENDINGS.has(ending)) {
      errors.push(
        `"${whole}" is not the fixed slash pattern (word/ла, word/а, word/на, no hyphen or space); for alternatives write "или"`,
      );
    }
  }
  return errors;
}

export function checkBody(id: string, markdown: string): Finding[] {
  const file = `content/nodes/${id}/index.md`;
  const blocks = parseBlocks(markdown);
  const findings: Finding[] = [];
  const add = (
    block: Block,
    rule: (typeof RULE_IDS)[number],
    severity: Severity,
    message: string,
    text: string,
    line = block.line,
  ) => {
    if (block.ignore.has(rule)) return;
    findings.push({ file, line, rule, severity, message, excerpt: excerpt(text) });
  };

  for (const block of blocks) {
    const texts = block.kind === 'image' ? [block.alt] : proseTexts(block);
    for (const text of texts) {
      for (const word of words(plainText(text))) {
        if (mixesScripts(word))
          add(block, 'scripts', 'error', `the word "${word}" mixes Latin and Cyrillic letters`, text);
      }
    }
  }
  if (isDirectoryNode(id)) return findings;

  let screenWords = 0;
  for (const block of blocks) {
    if (block.kind === 'image') {
      const alt = block.alt.trim();
      const base = path.basename(block.file).replace(/\.[a-z0-9]+$/i, '');
      if (!alt || alt === base || words(alt).length < LIMITS.altWords) {
        add(block, 'alt-text', 'error', `alt text must say what to look for, in at least ${LIMITS.altWords} words`, alt || block.file);
      }
      continue;
    }
    const units = block.kind === 'list' ? block.items : [{ text: block.text, line: block.line }];
    for (const unit of units) {
      const plain = plainText(unit.text);
      screenWords += words(plain).length;
      for (const error of genderFormErrors(plain)) add(block, 'gender-form', 'error', error, plain, unit.line);
      if (block.kind === 'heading') continue;

      const sentences = splitSentences(plain);
      for (const sentence of sentences) {
        const n = words(sentence).length;
        if (n > LIMITS.sentenceError)
          add(block, 'sentence-length', 'error', `${n} words in one sentence (limit ${LIMITS.sentenceError})`, sentence, unit.line);
        else if (n > LIMITS.sentenceWarning)
          add(block, 'sentence-length', 'warning', `${n} words in one sentence (aim for ${LIMITS.sentenceWarning})`, sentence, unit.line);
      }
      if (block.kind === 'paragraph' && sentences.length > LIMITS.paragraphSentences)
        add(block, 'paragraph-length', 'warning', `${sentences.length} sentences in one paragraph (limit ${LIMITS.paragraphSentences})`, plain);
      if (block.kind === 'list' && block.ordered && sentences.length >= LIMITS.stepSentences)
        add(block, 'one-action', 'warning', `${sentences.length} sentences in one numbered step; one action per step`, plain, unit.line);
      for (const span of boldSpans(unit.text)) {
        const n = words(span).length;
        if (n > LIMITS.boldWords)
          add(block, 'bold', 'warning', `bold span of ${n} words; bold only the word to tap or the thing to look for`, span, unit.line);
      }
      if (/\d ?[–-] ?\d/u.test(plain))
        add(block, 'dates', 'warning', 'a dash between numbers; write "од 9 до 18"', plain, unit.line);
      if (/\S {2,}\S/.test(plain)) add(block, 'punctuation', 'warning', 'double space', plain, unit.line);
      if (/\s[.,;:!?]/.test(plain)) add(block, 'punctuation', 'warning', 'space before punctuation', plain, unit.line);
    }
  }

  if (screenWords > LIMITS.screenWords && blocks[0] && !blocks[0].ignore.has('screen-length')) {
    findings.push({ file, line: 1, rule: 'screen-length', severity: 'warning', message: `${screenWords} words on one screen (limit ${LIMITS.screenWords}); split it into steps`, excerpt: '' });
  }
  const first = blocks[0];
  if (first?.kind === 'paragraph' && /^\*\*Ово радите/u.test(first.text.trim())) {
    add(first, 'callout', 'warning', 'the "where you do this" banner is a blockquote: > Ово радите у …, не у водичу.', first.text);
  }
  return findings;
}

export function checkGraphText(graph: Graph): Finding[] {
  const file = 'content/graph.yaml';
  const findings: Finding[] = [];
  const push = (rule: (typeof RULE_IDS)[number], message: string, text: string) =>
    findings.push({ file, line: 0, rule, severity: 'error', message, excerpt: excerpt(text) });

  for (const [id, node] of Object.entries(graph.nodes)) {
    const titleLength = [...node.title].length;
    if (titleLength > LIMITS.titleChars)
      push('title-label-length', `title of "${id}" has ${titleLength} characters (limit ${LIMITS.titleChars})`, node.title);
    const labels = outgoing(node).flatMap((e) => (e.label ? [e.label] : []));
    if (node.type === 'step' && node.external) labels.push(node.external.label);
    for (const label of labels) {
      const n = [...label].length;
      if (n > LIMITS.labelChars)
        push('title-label-length', `label on "${id}" has ${n} characters (limit ${LIMITS.labelChars})`, label);
    }
    for (const text of [node.title, ...labels]) {
      for (const error of genderFormErrors(text)) push('gender-form', `on "${id}": ${error}`, text);
    }
  }
  return findings;
}

export type Trend = { meanSentenceLength: number; longWordShare: number };

export function checkContent(root = process.cwd()): { findings: Finding[]; trend: Trend } {
  const graph = parseGraph(readFileSync(path.join(root, 'content', 'graph.yaml'), 'utf8'));
  const findings = checkGraphText(graph);
  const nodesDir = path.join(root, 'content', 'nodes');
  const sentenceLengths: number[] = [];
  let wordCount = 0;
  let longWords = 0;

  for (const entry of readdirSync(nodesDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const file = path.join(nodesDir, entry.name, 'index.md');
    if (!existsSync(file)) continue;
    const markdown = readFileSync(file, 'utf8');
    findings.push(...checkBody(entry.name, markdown));
    if (isDirectoryNode(entry.name)) continue;
    for (const block of parseBlocks(markdown)) {
      if (block.kind === 'heading') continue;
      for (const text of proseTexts(block)) {
        const plain = plainText(text);
        for (const sentence of splitSentences(plain)) sentenceLengths.push(words(sentence).length);
        for (const word of words(plain)) {
          wordCount++;
          if (letters(word) > 6) longWords++;
        }
      }
    }
  }
  const meanSentenceLength = sentenceLengths.length
    ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
    : 0;
  return { findings, trend: { meanSentenceLength, longWordShare: wordCount ? longWords / wordCount : 0 } };
}

export function formatFinding(f: Finding): string {
  const where = f.line ? `${f.file}:${f.line}` : f.file;
  return `${where}: ${f.rule}: ${f.message} — "${f.excerpt}"`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/language.unit.test.ts src/lib/text.test.ts`
Expected: PASS. If the `scripts` test on `'- **Пошта**, Трг oслобођења 1.'` fails, confirm the fixture's "o" is Latin (U+006F).

- [ ] **Step 5: Format, type-check and commit**

Run: `npx prettier --write src/lib/language.ts src/lib/language.unit.test.ts && npm run check`
Expected: `astro check` reports 0 errors (unused parameters are errors in this repo; `block` in `add` is used for `ignore`).

```bash
git add src/lib/language.ts src/lib/language.unit.test.ts
git commit -m "feat: deterministic language rules for content bodies and graph text"
```

---

### Task 3: Make the real content pass, wire the check into validate, style the callout

**Files:**
- Create: `src/lib/language.test.ts`
- Modify: `package.json` (the `validate` script)
- Modify: `src/styles/global.css` (after the `.body img` rule, around line 110)
- Modify: `content/nodes/counter-list-a/index.md:6`, `content/nodes/counter-list-b/index.md:443`, `content/nodes/counter-list-r/index.md:26`, `content/nodes/counter-list-s/index.md:156-157`, `content/nodes/counter-list-t/index.md:38`
- Modify: `content/nodes/activate-consentid/index.md:1,23`, `content/nodes/cloud-approve/index.md:1,5`
- Modify: the first line of `content/nodes/{register-upload,register-personal-data,register-document-data,register-login-data,register-submit,install-consentid,confirm-email,cloud-issue}/index.md`

**Interfaces:**
- Consumes from Task 2: `checkContent`, `formatFinding`.

- [ ] **Step 1: Write the real-content test**

```ts
// src/lib/language.test.ts
import { describe, expect, it } from 'vitest';
import { checkContent, formatFinding } from './language';

describe('content/ language rules (the real wizard content)', () => {
  it('every screen passes the error-level language rules', () => {
    const { findings, trend } = checkContent();
    const errors = findings.filter((f) => f.severity === 'error').map(formatFinding);
    const warnings = findings.filter((f) => f.severity === 'warning').map(formatFinding);
    if (warnings.length) {
      console.log(`Language warnings (${warnings.length}), not failing:\n  ${warnings.join('\n  ')}`);
    }
    console.log(
      `Readability trend (prose screens): mean sentence length ${trend.meanSentenceLength.toFixed(1)} words, ` +
        `${(trend.longWordShare * 100).toFixed(1)}% of words over six letters`,
    );
    expect(errors).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to see the current errors**

Run: `npx vitest run src/lib/language.test.ts`
Expected: FAIL with 8 errors: six `scripts` errors in `counter-list-a`, `counter-list-b`, `counter-list-r`, `counter-list-s` (two) and `counter-list-t`, and two `sentence-length` errors in `activate-consentid` and `cloud-approve`. If the splitter finds one more sentence over 20 words, split it in place the same way as Step 4 and record it in the commit body; if it finds another mixed-script word, fix it as in Step 3. Any `alt-text`, `gender-form` or `title-label-length` error on the current content is a parser bug: fix it in Task 1 or 2 before continuing.

- [ ] **Step 3: Fix the six homoglyphs**

Use the Edit tool with these exact replacements (the left side contains a Latin letter, the right side is all Cyrillic):

| File | Replace | With |
| --- | --- | --- |
| `content/nodes/counter-list-a/index.md` | `Трг oслобођења 1` | `Трг ослобођења 1` |
| `content/nodes/counter-list-b/index.md` | `Милoсава Влајића 2` | `Милосава Влајића 2` |
| `content/nodes/counter-list-r/index.md` | `Зимска сезонa` | `Зимска сезона` |
| `content/nodes/counter-list-s/index.md` | `Tрг Бранка Радичевић 1` (both occurrences) | `Трг Бранка Радичевић 1` |
| `content/nodes/counter-list-t/index.md` | `Краља ПетраIКарађорђевића 4` | `Краља Петра I Карађорђевића 4` |

Verify with: `grep -c 'oслобођења\|Милoсава\|сезонa\|Tрг\|ПетраIКарађорђевића' content/nodes/counter-list-*/index.md | grep -v ':0'`
Expected: no output.

- [ ] **Step 4: Split the two long sentences**

`content/nodes/activate-consentid/index.md`, in the paragraph that starts "Овај ПИН ће вам требати", replace

`Ако мислите да ћете га заборавити, запишите га на папир који чувате код куће, никако у телефону и никако уз телефон.`

with

`Ако мислите да ћете га заборавити, запишите га на папир и чувајте га код куће. Не чувајте га у телефону ни уз телефон.`

`content/nodes/cloud-approve/index.md`, line 5, replace

`То је број од **шест цифара** који сте **сами смислили** када сте први пут укључили апликацију, на шалтеру или код куће.`

with

`То је број од **6 цифара** који сте **сами смислили**. Смислили сте га када сте први пут активирали апликацију, на шалтеру или код куће.`

- [ ] **Step 5: Migrate the ten banners to the callout blockquote**

Replace the first paragraph of each file as follows. The blockquote is one line. Sentences that were in the banner paragraph but are not the callout or the image disclaimer become a normal paragraph right after the blockquote and a blank line.

| File | New first block |
| --- | --- |
| `register-upload` | `> Ово радите у формулару на сајту eid.gov.rs, не у водичу. Слике су само пример, на њих не треба да притискате.` |
| `register-personal-data` | `> Ово радите у формулару на сајту eid.gov.rs, не у водичу.` then a paragraph `У водичу само читате шта да урадите.` |
| `register-document-data` | same as register-personal-data |
| `register-login-data` | same as register-personal-data |
| `register-submit` | same as register-personal-data |
| `install-consentid` | `> Ово радите у продавници апликација на телефону, не у водичу.` |
| `activate-consentid` | `> Ово радите у апликацији ConsentID на телефону, не у водичу. Слике су само пример, на њих не треба да притискате.` |
| `cloud-approve` | `> Ово радите у апликацији ConsentID на телефону, не у водичу. Слике су само пример, на њих не треба да притискате.` |
| `cloud-issue` | `> Ово радите на сајту eid.gov.rs, где сте се управо пријавили, не у водичу. Слике су само пример, на њих не треба да притискате.` |
| `confirm-email` | `> Ово радите у својој имејл пошти, не у водичу.` then a paragraph `Ако користите Gmail, притисните дугме **Отворите Gmail** на дну водича. Ако користите другу пошту, отворите је као и обично. Слика испод је само пример како изгледа порука. Није права, на њу не треба да притискате.` |

Ruling recorded here: the spec's template `Ово радите у <place>, не у водичу.` has the preposition inside `<place>` so that `на сајту eid.gov.rs` reads correctly.

Verify with: `grep -L '^> Ово радите' content/nodes/{register-upload,register-personal-data,register-document-data,register-login-data,register-submit,install-consentid,activate-consentid,cloud-approve,cloud-issue,confirm-email}/index.md`
Expected: no output (every file now starts with the blockquote).

- [ ] **Step 6: Run the real-content test again**

Run: `npx vitest run src/lib/language.test.ts`
Expected: PASS, with a printed list of warnings (sentence-length over 15, paragraph-length, one-action, screen-length for six screens, bold spans, a few dates and punctuation) and the readability trend line. Record the warning count in the commit message body.

- [ ] **Step 7: Wire the check into validate**

In `package.json` change the `validate` script to:

```json
"validate": "vitest run src/lib/content.test.ts src/lib/language.test.ts"
```

Run: `npm run validate`
Expected: 4 tests pass (3 content, 1 language).

- [ ] **Step 8: Style the callout**

Add to `src/styles/global.css` after the `.body img { … }` rule:

```css
/* "Where you do this" callout: a Markdown blockquote at the top of a body. */
.body blockquote {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border-left: 0.375rem solid var(--primary);
  border-radius: 0.5rem;
  background: #eef2ff;
  font-style: normal;
}

.body blockquote p {
  margin: 0;
}
```

Run: `npm run build && npx prettier --check src/styles/global.css`
Expected: build succeeds; `dist/step/register-upload/index.html` contains `<blockquote>`. Check: `grep -c '<blockquote>' dist/step/register-upload/index.html` prints `1`.

- [ ] **Step 9: Full check and commit**

Run: `npm test && npm run test:dist && npm run format:check`
Expected: all green (built-output tests pick representative nodes from the graph; nothing structural changed).

```bash
git add package.json src/lib/language.test.ts src/styles/global.css content/nodes
git commit -m "feat: language check in npm run validate; callout box; content fixes the errors require"
```

---

### Task 4: Writing guide and term list (Serbian Cyrillic)

**Files:**
- Create: `docs/writing-guide.md`
- Create: `docs/terms.md`
- Test: `src/lib/language-docs.test.ts`

**Interfaces:**
- Consumes from Task 2: `RULE_IDS`.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/language-docs.test.ts`
Expected: FAIL, `ENOENT docs/writing-guide.md`.

- [ ] **Step 3: Write the guide**

Create `docs/writing-guide.md` with this content. Keep every rule id in parentheses exactly as written; the test checks them. Where an example is marked "из садржаја", it comes from the baseline audit in `docs/research/plain-language/baseline-audit.md`.

```markdown
# Како пишемо водич

Водич читају старије особе, на телефону, често први пут са оваквим задатком. Правила испод чине
текст кратким, јасним и истим на сваком екрану. Свако правило има ознаку на енглеском у загради.
Том ознаком `npm run validate` именује грешку или упозорење. Правила без ознаке у тој команди
проверава преглед пре спајања (`docs/language-review.md`).

Речи које користимо за исте ствари су у `docs/terms.md`. Читалац никад не види речник: сваку реч
објашњавамо тамо где се први пут јавља.

## Реченице

1. **Кратке реченице** (sentence-length). Највише 20 речи, циљ је 15. Делите тачком, не запетом.
   - Пре: „Ако мислите да ћете га заборавити, запишите га на папир који чувате код куће, никако у
     телефону и никако уз телефон.“
   - После: „Ако мислите да ћете га заборавити, запишите га на папир и чувајте га код куће. Не
     чувајте га у телефону ни уз телефон.“
2. **Једна мисао у реченици, једна радња у кораку** (one-action). Корак са три реченице су два
   корака. Реченица са два „и“ су две реченице.
3. **Заповедни начин, обраћање са „ви“** (imperative). Не: „Захтев се подноси на шалтеру.“ Да:
   „Поднесите захтев на шалтеру.“ Не: „Поља морају да буду попуњена.“ Да: „Попуните сва поља.“
4. **Кажите шта да се уради** (positive). Не: „Не заборавите да запишете лозинку.“ Да: „Запишите
   лозинку.“ Двострука негација никад. „Не“ само за право упозорење: „Не дајте ПИН никоме.“
5. **Прво радња** (action-first). Радња иде на почетак реченице и на врх екрана. Услови („ако
   имате Gmail…“) иду у екран са питањем, не у корак.
6. **Највише 3 реченице у пасусу** (paragraph-length). Дужи пасус поделите или претворите у листу.
7. **Шта је обавезно, а шта може** (must-can). „Морате“ или заповедни начин за обавезно, „можете“
   за оно што је по избору.

## Речи

8. **Свакодневне речи** (everyday-words). Кратка српска реч пре стране, кад су обе познате:
   „проверите“, не „верификујте“; „потврда“, не „верификација“. Страна реч остаје кад је читалац
   види на екрану (ConsentID, Gmail).
9. **Једна реч за једну ствар** (one-word). Иста ствар се увек зове исто, и иста реч не значи две
   ствари. Из садржаја: „картица“ је била и картица у прегледачу, и лична карта, и платна картица.
   Сада: „картица“ је само картица у прегледачу. Списак је у `docs/terms.md`.
10. **Објасните реч тамо где се први пут јавља** (explain-in-place). Задржите реч коју читалац види
    на екрану, па је објасните у загради или у следећој реченици: „ПИН (број од 6 цифара који сами
    смислите)“. Објасните на сваком путу кроз водич на ком се реч први пут јавља. Без речника.
11. **Без скраћеница** (abbreviations). Дозвољене су ЈМБГ, ПИН и QR, и свака се објасни при првој
    употреби. „МУП“ пишемо „полицијска станица“. „MB“ не пишемо; кажемо „ако је фотографија
    превелика, сајт то јави“.
12. **Глаголи, не именице** (verbs-not-nouns). „проверите“, не „извршите проверу“; „пријавите се“,
    не „обавите пријаву“.
13. **Дословно** (literal). Без метафора и поређења. Из садржаја: „као два листа папира један испод
    другог“ тражи објашњење; боље је рећи шта се види: „отворене странице, једна поред друге“.
14. **Обраћање** (address). Увек „ви“, малим словом. Никад „ти“. Никад „ми“ као аутори („ово смо
    показали“).
15. **Бројеви цифрама** (digits). „6 цифара“, не „шест цифара“; „2 слике“, не „две слике“.
    Четвороцифрени бројеви без тачке: „1400 шалтера“. Без процената и без римских бројева.
    Изузетак: „један“ и „једна“ у реченици остају речи.
16. **Датуми и распони** (dates). „13. октобар 2026.“ и „од 9 до 18 часова“. Без црте и без косе
    црте у датуму или распону. Табеле са адресама шалтера задржавају облик из извора.
17. **Писмо** (scripts). Латиница само за имена производа (ConsentID, Gmail, iPhone), адресе сајтова
    (eid.gov.rs) и натписе с екрана, уведене као „(на енглеском **Allow**)“. Латинично слово унутар
    ћириличне речи је грешка: „Tрг“ са латиничним Т не проналази претрага и не чита читач екрана.
18. **Род** (gender-form). Кад мора облик за оба рода: мушки облик, коса црта, женски наставак:
    „успео/ла“, „пријављен/а“, „сигуран/на“. Без цртице и без размака. Уместо „и/или“ пишите
    „или“.

## Екран

19. **Највише 150 речи на екрану** (screen-length). Дужи екран поделите на два корака. Наслове
    рачунамо, описе слика не.
20. **Нумерисана листа за редослед** (numbered-steps). Све што се ради по реду је нумерисана
    листа. Три и више ставки било чега су листа.
21. **Сваки корак, и очигледан** (every-step). „Притисните **Даље**.“ Читалац који је прекинут
    мора да може да настави без погађања.
22. **Екран стоји сам** (self-contained). Поновите шта треба уместо „као на претходном екрану“.
23. **Наслов до 50 знакова, одговор до 40** (title-label-length). Одговори су кратке изјаве или
    заповести; не мешајте „Почните регистрацију“ и „Већ имам налог“ на истом екрану без потребе.
24. **Слика има опис** (alt-text). Најмање 3 речи које кажу шта да се тражи на слици, не само шта
    је на њој: „Пример: дугме Приложите документа, плаво, на дну формулара“.
25. **Подебљано само оно што се притиска или тражи** (bold). Дугме, натпис, поље. Никад цела
    реченица.
26. **Оквир „где ово радите“** (callout). Први блок екрана, као навод (`>`), увек истим речима:
    `> Ово радите у формулару на сајту eid.gov.rs, не у водичу.` Друга реченица само кад су на
    екрану слике: `Слике су само пример, на њих не треба да притискате.` Места: „у формулару на
    сајту eid.gov.rs“, „на сајту eid.gov.rs“, „у апликацији ConsentID на телефону“, „у својој
    имејл пошти“, „у продавници апликација на телефону“.

## Како изгледа екран

1. Оквир „Ово радите у …“, ако се радња ради ван водича.
2. Једна реченица: шта се на овом екрану ради.
3. Нумерисани кораци, сваки са једном радњом.
4. Слика са описом, одмах уз корак на који се односи.
5. Одговори (дугмад) на дну, у истом облику на целом екрану.

## Изузетак

Ред `<!-- language-ignore sentence-length -->` изнад блока искључује то правило за тај блок.
Користи се ретко. У прегледу пре спајања објасните зашто.
```

- [ ] **Step 4: Write the term list**

Create `docs/terms.md`. Before writing the two rows marked "проверити", open https://eid.gov.rs and its activation instructions (the ConsentID page under Услуге) and read what the counter printout is called and what label its user identifier carries; use those words. If the pages are unreachable, use the defaults given in the row and say so in the pull request.

```markdown
# Речи које користимо

Једна ствар, једна реч. Читалац никад не види овај списак: реч објашњавамо тамо где се први пут
јавља (правило 10 у `docs/writing-guide.md`). Кад се реч коју читалац види на екрану (сајт
eid.gov.rs, апликација ConsentID, телефон) разликује од наше, побеђује реч са екрана.

| Појам | Пишемо | Не пишемо | Објашњење при првој употреби |
| --- | --- | --- | --- |
| browser tab | картица | страница (за картицу), таб | „картица, као лист папира у прегледачу; више их може бити отворено“ |
| web page | страница | страна, сајт (за страницу) | |
| website | сајт | портал, веб-сајт, страница (за сајт) | |
| the registration site | сајт eid.gov.rs | Портал еИД, eID.gov.rs, формулар (за сајт) | „сајт на ком правите налог за еУправу“ |
| the form on that site | формулар | форма, образац | |
| eUprava | еУправа | е-Управа, портал еУправа (као име) | „сајт државе на ком завршавате послове од куће“ |
| the ID card | лична карта | картица, ЛК, документ (ван натписа на формулару) | |
| side of the card | предња страна / задња страна личне карте | лице, наличје | |
| this guide | водич | ова страна, овде, апликација (за водич) | |
| return to the guide | Вратите се у водич. | вратите се овде, на ову страну, назад | |
| the phone | телефон | мобилни, паметни телефон, уређај | |
| screen | екран | дисплеј, страница (за екран) | |
| button | дугме | тастер, иконица, линк (за дугме) | |
| icon | сличица | иконица, икона | |
| menu | мени | изборник | „списак опција који се отвори“ |
| tab-switch button | дугме са квадратићима | дугме за картице, квадратић са бројем | „дугме са два квадратића, на дну или на врху екрана“ |
| tap | притисните | кликните, додирните, тапните | |
| type in | упишите | унесите, укуцајте | |
| choose | изаберите | одаберите | |
| tick a box | означите | штиклирајте, чекирајте | |
| open | отворите | покрените (за сајт или поруку) | |
| sign in | пријавите се / пријава | улазите, уђете, улогујте се | |
| sign out | одјавите се | излогујте се | |
| register | региструјте се / регистрација | отворите налог, направите налог | „правите свој налог, као чланску карту за еУправу“ |
| account | налог | рачун, профил | |
| username | корисничко име | јузернејм | |
| password | лозинка | шифра, ПИН (за лозинку), пасворд | |
| PIN | ПИН | шифра, лозинка (за ПИН), код | „број од 6 цифара који сами смислите“ |
| email | имејл | мејл, е-пошта, електронска пошта, е-маил | „адреса на коју вам стижу поруке преко интернета“ |
| mailbox | имејл (никад само „пошта“) | пошта (за сандуче), инбокс | |
| email message | порука | мејл, имејл (за поруку) | |
| spam folder | фасцикла Непожељно (Spam) | спам, џанк | |
| post office | пошта | поштанска експозитура | |
| counter | шалтер | експозитура, пулт | |
| clerk | службеник | радник, шалтерски радник | |
| police station | полицијска станица | МУП, полиција (као место) | |
| the app | апликација ConsentID | ConsentID апликација, програм | „бесплатна апликација којом потврђујете да сте то ви“ |
| install the app | инсталирајте | скините, преузмите, ставите | „инсталирате значи да је ставите на телефон из продавнице апликација“ |
| app store | продавница апликација (Google Play или App Store) | стор, маркет | |
| activate ConsentID | активирајте апликацију / активација | укључите, покрените, повежите (за ово) | „повезујете апликацију са својим налогом; то се ради једном“ |
| the counter paper (проверити) | потврда са шалтера | потврда (за дугме или имејл), папир, параметри | „папир који добијете на шалтеру, са два броја за апликацију“ |
| user ID from the counter (проверити) | ИД корисника | кориснички ИД, број корисника, регистрациони код | „први број са потврде са шалтера“ |
| QR code | QR код | QR-код, кју-ар | „квадрат са црним тачкицама који телефон очитава камером“ |
| confirm (a button) | Потврди (као натпис), потврдите | одобрите, прихватите | |
| approve a login on the phone | одобрите пријаву | потврдите (за ово) | „у апликацији притиснете да сте то ви“ |
| cloud signature | сертификат у клауду | потпис у клауду, квалификовани електронски сертификат, издај | „начин да се потпишете телефоном, без читача картица“ |
| photo you upload | фотографија | слика (за фотографију) | |
| illustration on a screen | слика | скриншот, снимак екрана | |
| upload | приложите | аплоудујте, пошаљите (за ово) | „приложити значи да сајту дате фотографију из телефона“ |
| the number ЈМБГ | ЈМБГ | матични број | „13 цифара са задње стране личне карте“ |
| helper | неко од породице или комшија | укућани, неко ко зна | |
| internet | интернет | мрежа, нет | |
| Wi-Fi | Wi-Fi | вај-фај, бежична мрежа | „интернет код куће, без трошења мобилних података“ |
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/language-docs.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 6: Proofread once against the spec**

Open `docs/superpowers/specs/2026-10-07-plain-language-design.md` section 3.1 and confirm every rule id in its table appears in the guide. Open section 3.2 and confirm every row is in `docs/terms.md`. Fix any gap inline.

- [ ] **Step 7: Commit**

```bash
git add docs/writing-guide.md docs/terms.md src/lib/language-docs.test.ts
git commit -m "docs: writing guide and term list in Serbian Cyrillic"
```

---

### Task 5: AGENTS.md as the agent entry point

**Files:**
- Rename: `CLAUDE.md` to `AGENTS.md` (with `git mv`)
- Create: `CLAUDE.md` (one import line)
- Modify: `AGENTS.md` (title line, "Rules the build enforces", "Writing rules", "Commands")
- Modify: `CONTRIBUTING.md:3`

**Interfaces:** none.

- [ ] **Step 1: Rename**

```bash
git mv CLAUDE.md AGENTS.md
```

- [ ] **Step 2: Create the new CLAUDE.md**

```markdown
@AGENTS.md

<!-- Claude Code reads this file; the shared instructions for every coding agent live in AGENTS.md. -->
```

- [ ] **Step 3: Edit AGENTS.md**

Change the first line to:

```markdown
# eGrađanin korak po korak — guide for coding agents and people
```

Change the second paragraph's first sentence from "Content authors on the team use Claude Code in this repo" to "Content authors on the team use Claude Code or Codex in this repo".

In "Rules the build enforces", after the existing bullet list, add:

```markdown
and, from the language check in the same command (`src/lib/language.ts`), when:

- a sentence in a body has more than 20 words (`sentence-length`),
- a word mixes Latin and Cyrillic letters, such as a Latin "o" inside a Cyrillic word (`scripts`),
- a gender slash form is not `реч/ла`, `реч/а` or `реч/на`, or `и/или` is used (`gender-form`),
- an image has no alt text, alt text equal to its file name, or under 3 words (`alt-text`),
- a title has more than 50 characters or an answer label more than 40 (`title-label-length`).

The same check prints warnings that do not fail the build: sentences over 15 words, paragraphs over
3 sentences, numbered steps with 3 or more sentences, screens over 150 words, bold spans over 4
words, a bold "Ово радите" banner instead of the blockquote callout, dashes between numbers, double
spaces. Fix them when you touch the screen.
```

Replace the "Writing rules" section with:

```markdown
## Writing rules

The standard is `docs/writing-guide.md` (Serbian, 26 rules with examples) and the words we use are
in `docs/terms.md`. Read both before writing or reviewing a screen. In short:

- Titles, answer labels, and bodies are Serbian Cyrillic only. Latin pages are generated at build.
- Ids, folder names, and image file names are English, lowercase, hyphenated.
- Sentences of at most 20 words, one action per numbered step, imperatives addressed as "ви", at
  most 150 words per screen, 3 sentences per paragraph.
- One word for one thing, from `docs/terms.md`; every term explained where it first appears on
  that path, never in a glossary.
- Numbers as digits; dates as "13. октобар 2026."; ranges as "од 9 до 18 часова".
- Gender forms as `успео/ла`, `пријављен/а`, `сигуран/на`; write "или", never "и/или".
- Bold only the word to tap or the thing to look for. The "where you do this" banner is a
  blockquote: `> Ово радите у формулару на сајту eid.gov.rs, не у водичу.`
- Every screenshot has alt text, at least 3 words, saying what to look for.
- Keep `start:` pointing at the first screen. Tests and the accessibility audit pick representative
  screens from `graph.yaml` automatically, so content changes need no test changes.

## Language review before a pull request

Before opening or updating a pull request that changes anything under `content/`:

1. Run the language review. In Claude Code: `/language-review`. In any other tool: follow
   `docs/language-review.md` on the changed screens.
2. Paste its output, including the `Verdict:` line, under `## Language review` in the pull request
   description. CI fails a content pull request that has no verdict there.
3. If the verdict is "needs work", fix the screens and run the review again before asking for a
   merge.
```

In the "Commands" table, change the `npm run validate` row's description to: `checks content/ against every graph rule and the error-level language rules, in seconds; prints language warnings`.

- [ ] **Step 4: Update CONTRIBUTING.md**

Replace line 3 with:

```markdown
If you work with Claude Code or Codex, it reads `AGENTS.md` automatically; this file is the longer
version. The writing standard is `docs/writing-guide.md`, the words we use are in `docs/terms.md`.
```

- [ ] **Step 5: Verify**

Run: `grep -rn 'CLAUDE.md' AGENTS.md CONTRIBUTING.md README.md .github; cat CLAUDE.md; npm run format:check`
Expected: no references to `CLAUDE.md` except the comment in `CLAUDE.md` itself; format check passes (`AGENTS.md` is a root Markdown file that prettier formats; run `npx prettier --write AGENTS.md CLAUDE.md CONTRIBUTING.md` if it complains).

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md CLAUDE.md CONTRIBUTING.md
git commit -m "docs: AGENTS.md is the shared entry point; writing standard and review steps"
```

---

### Task 6: Review rubric and the /language-review skill

**Files:**
- Create: `docs/language-review.md`
- Create: `.claude/skills/language-review/SKILL.md`

**Interfaces:** none. The skill's output format is what Task 7's gate looks for: a line matching `Verdict: pass`, `Verdict: needs work` or `Verdict: not needed <reason>` under the `## Language review` heading.

- [ ] **Step 1: Write the rubric**

Create `docs/language-review.md`:

```markdown
# Language review

A review of changed or added screens against `docs/writing-guide.md` and `docs/terms.md`. Any
coding agent or person can run it; in Claude Code, `/language-review` does these steps.

## Steps

1. List the changed files under `content/` (`git diff --name-only main...HEAD -- content/`). Review
   every screen whose `index.md`, title or labels changed. Read each one in full, with its entry in
   `content/graph.yaml`.
2. Run `npm run validate` and read the language warnings for those screens.
3. Score each criterion below from 0 to 3 for the set of changed screens: 3 fully met, 2 met with a
   small slip you name, 1 broken in a way the reader will notice, 0 broken throughout.
4. The verdict is `pass` when every criterion scores 2 or 3, otherwise `needs work`. If the change
   touches no reader-visible text (an image swap, a typo in a file name), the verdict is
   `not needed` followed by the reason.
5. Print the result in the format below and nothing else.

## Criteria

| # | Criterion | What 3 looks like |
| --- | --- | --- |
| 1 | One action per step | Every numbered step asks for exactly one physical action; explanations sit in their own sentence or paragraph. |
| 2 | Imperative, addressed as "ви" | Instructions are imperatives; no "се"-passive, no "потребно је", no "ти", no authors' "ми". |
| 3 | Positive phrasing | The text says what to do; "не" appears only in real warnings; no double negatives. |
| 4 | Clear referents | Every "то", "га", "је", "овде", "ова страна" has one obvious referent on the same screen. |
| 5 | Terms explained in place | Each term the reader may not know (ПИН, QR, сертификат у клауду, еСандуче) is explained where it first appears on this path, in the words from `docs/terms.md`. |
| 6 | One word for one thing | The screen uses the words in `docs/terms.md` and never a listed "не пишемо" variant, never one word in two senses (картица, страна, потврда, пошта, слика). |
| 7 | Consistent with the flow | Button names, step wording and the callout match the neighbouring screens; answer labels on one screen share one voice. |
| 8 | Calm tone | No blame, no exclamation marks, no "просто" or "само" that makes a hard step sound trivial. |
| 9 | Alt text says what to look for | Each image's alt text names the control or detail the reader must find, not only what the picture shows. |
| 10 | Text matches the screenshot | Every label the text names appears, with the same spelling, in the screenshot it refers to. |

## Output format

```
## Language review

Screens: <node ids>

| # | Criterion | Score | Note |
| --- | --- | --- | --- |
| 1 | One action per step | 3 | |
| 2 | Imperative, addressed as "ви" | 2 | register-upload step 2: "ставка" is explained in the next sentence; fine |
| … | … | … | … |

Verdict: pass

Edits:
- <node id>: "<sentence>" → "<rewrite>"
```

`Verdict: needs work` lists every edit that would raise a 0 or 1 to a 2. `Verdict: not needed`
gives the reason on the same line.
```

- [ ] **Step 2: Write the skill**

Create `.claude/skills/language-review/SKILL.md`:

```markdown
---
name: language-review
description: Review changed screens under content/ against the writing guide and term list, score the ten rubric criteria, and print the "## Language review" block for the pull request. Run it before opening or updating a content pull request.
context: fork
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(npm run validate)
---

Review the content changes on this branch for language, following `docs/language-review.md`
exactly.

1. Read `docs/writing-guide.md`, `docs/terms.md` and `docs/language-review.md`.
2. Run `git diff --name-only main...HEAD -- content/` to find the changed screens. If nothing under
   `content/` changed, print `Verdict: not needed (no content changes)` under a `## Language review`
   heading and stop.
3. For each changed screen, read `content/nodes/<id>/index.md` in full and its entry in
   `content/graph.yaml` (title, answers, external label). Read the screens it links to only when a
   criterion needs them (criterion 7).
4. Run `npm run validate` and note the language warnings for the changed screens.
5. Score the ten criteria from 0 to 3 as the rubric defines, with a one-line note for every score
   under 3.
6. Print only the output block from the rubric's "Output format" section, verdict and edits
   included. Do not edit any file.
```

- [ ] **Step 3: Verify the skill loads and the format matches the gate**

Run: `cat .claude/skills/language-review/SKILL.md | head -6` and confirm the frontmatter has `name`, `description`, `context: fork` and `allowed-tools`.
Run: `npx prettier --check .claude docs/language-review.md 2>&1 | tail -1`
Expected: `.claude/skills/language-review/SKILL.md` is checked by prettier (it is not ignored); if it reports a diff, run `npx prettier --write .claude/skills/language-review/SKILL.md`. `docs/` is ignored.

- [ ] **Step 4: Commit**

```bash
git add docs/language-review.md .claude/skills/language-review/SKILL.md
git commit -m "docs: language review rubric and /language-review skill"
```

---

### Task 7: Pull-request gate

**Files:**
- Create: `scripts/check-pr-language-review.mjs`
- Test: `src/lib/pr-review-gate.test.ts`
- Modify: `.github/pull_request_template.md`
- Modify: `.github/workflows/ci.yml` (the `build` job, after `npm ci`)

**Interfaces:**
- Produces: `checkPullRequest({ body, changedFiles }): { ok: boolean; reason: string }` exported from the `.mjs` file (importable from TypeScript tests because `allowJs` is on in Astro's base tsconfig).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/pr-review-gate.test.ts
import { describe, expect, it } from 'vitest';
import { checkPullRequest } from '../../scripts/check-pr-language-review.mjs';

const review = '## What changed\n\nx\n\n## Language review\n\n| # | Criterion | Score | Note |\n\nVerdict: pass\n';

describe('pull-request language review gate', () => {
  it('passes when no file under content/ changed, whatever the body says', () => {
    expect(checkPullRequest({ body: null, changedFiles: ['src/lib/text.ts'] }).ok).toBe(true);
  });

  it('fails when content/ changed and the body is empty or has no verdict', () => {
    expect(checkPullRequest({ body: null, changedFiles: ['content/graph.yaml'] }).ok).toBe(false);
    expect(
      checkPullRequest({ body: '## Language review\n\n<!-- paste -->', changedFiles: ['content/nodes/a/index.md'] }).ok,
    ).toBe(false);
    expect(checkPullRequest({ body: 'Verdict: pass', changedFiles: ['content/nodes/a/index.md'] }).ok).toBe(false);
  });

  it('passes with a verdict under the Language review heading', () => {
    for (const verdict of ['Verdict: pass', 'Verdict: needs work', 'Verdict: not needed (image swap)']) {
      const body = review.replace('Verdict: pass', verdict);
      expect(checkPullRequest({ body, changedFiles: ['content/nodes/a/index.md'] }).ok).toBe(true);
    }
  });

  it('ignores a verdict that sits under a later heading', () => {
    const body = '## Language review\n\nnothing\n\n## Notes\n\nVerdict: pass';
    expect(checkPullRequest({ body, changedFiles: ['content/nodes/a/index.md'] }).ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/lib/pr-review-gate.test.ts`
Expected: FAIL, cannot find the module.

- [ ] **Step 3: Write the script**

```js
#!/usr/bin/env node
// scripts/check-pr-language-review.mjs
// Fails a pull request that changes content/ without a language review verdict in its description.
// Usage: PR_BODY="<description>" node scripts/check-pr-language-review.mjs <changed files...>
import { pathToFileURL } from 'node:url';

const HEADING = '## Language review';
const VERDICT = /^\s*Verdict:\s*(pass|needs work|not needed\b.*)\s*$/im;

export const MESSAGE =
  'content/ changed but the pull request has no language review. ' +
  'Run /language-review and paste the result under "## Language review".';

function sectionAfter(body, heading) {
  const start = body.indexOf(heading);
  if (start < 0) return '';
  const rest = body.slice(start + heading.length);
  const next = rest.search(/^## /m);
  return next < 0 ? rest : rest.slice(0, next);
}

/**
 * @param {{ body: string | null | undefined, changedFiles: string[] }} input
 * @returns {{ ok: boolean, reason: string }}
 */
export function checkPullRequest({ body, changedFiles }) {
  if (!changedFiles.some((f) => f.startsWith('content/'))) {
    return { ok: true, reason: 'no changes under content/; language review not required' };
  }
  if (VERDICT.test(sectionAfter(body ?? '', HEADING))) {
    return { ok: true, reason: 'language review present' };
  }
  return { ok: false, reason: MESSAGE };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkPullRequest({ body: process.env.PR_BODY, changedFiles: process.argv.slice(2) });
  console.log(result.reason);
  process.exit(result.ok ? 0 : 1);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/pr-review-gate.test.ts && npm run check`
Expected: PASS, 4 tests; `astro check` has no error about the `.mjs` import (if it reports an implicit `any`, add `// @ts-expect-error untyped script` above the import and keep going).

Also run by hand: `PR_BODY='' node scripts/check-pr-language-review.mjs content/graph.yaml; echo "exit=$?"`
Expected: the message and `exit=1`.

- [ ] **Step 5: Add the section to the pull request template**

Append to `.github/pull_request_template.md`:

```markdown

## Language review

<!-- When anything under content/ changed: run /language-review (Claude Code) or follow
     docs/language-review.md, and paste the whole output here, including the "Verdict:" line.
     CI fails a content pull request without it. -->
```

- [ ] **Step 6: Add the CI step**

In `.github/workflows/ci.yml`, in the `build` job, add after the `- run: npm ci` step:

```yaml
      - name: Require a language review when content changed
        if: github.event_name == 'pull_request'
        env:
          PR_BODY: ${{ github.event.pull_request.body }}
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
        run: |
          git fetch --no-tags --depth=1 origin "$BASE_SHA"
          node scripts/check-pr-language-review.mjs $(git diff --name-only "$BASE_SHA" HEAD)
```

Note: `actions/checkout` fetches depth 1, so the base commit is fetched explicitly; `git diff` between two commits needs only their trees. Content paths contain no spaces, so word-splitting the file list is safe.

- [ ] **Step 7: Format and commit**

Run: `npx prettier --write scripts/check-pr-language-review.mjs src/lib/pr-review-gate.test.ts .github/workflows/ci.yml .github/pull_request_template.md && npm run format:check && npm test`
Expected: all green.

```bash
git add scripts/check-pr-language-review.mjs src/lib/pr-review-gate.test.ts .github/pull_request_template.md .github/workflows/ci.yml
git commit -m "ci: require a language review on pull requests that change content/"
```

---

### Task 8: Optional reminder hook for Claude Code sessions

**Files:**
- Create: `scripts/hooks/pr-reminder.sh`
- Create: `.claude/settings.json`
- Modify: `.gitignore` (add `.claude/settings.local.json`)

**Interfaces:** none. Reuses the message text from Task 7.

- [ ] **Step 1: Write the hook script**

```sh
#!/bin/sh
# Claude Code PreToolUse hook (Bash tool). Before `gh pr create` or `gh pr edit`, when files under
# content/ changed on this branch and the command carries no "Verdict:" line, block with the same
# message as the CI gate. Exit 0 lets the command run; exit 2 blocks it and shows stderr to Claude.
input=$(cat)
command=$(printf '%s' "$input" | node -e '
  let s = "";
  process.stdin.on("data", (d) => (s += d)).on("end", () => {
    try { process.stdout.write(JSON.parse(s).tool_input?.command ?? ""); } catch {}
  });
')
case "$command" in
  *"gh pr create"*|*"gh pr edit"*) ;;
  *) exit 0 ;;
esac
git fetch -q origin main 2>/dev/null
changed=$(git diff --name-only origin/main...HEAD 2>/dev/null | grep -c '^content/')
[ "${changed:-0}" -eq 0 ] && exit 0
body="$command"
file=$(printf '%s' "$command" | sed -n 's/.*--body-file[= ]\([^ ]*\).*/\1/p')
if [ -n "$file" ] && [ -f "$file" ]; then body="$body $(cat "$file")"; fi
if printf '%s' "$body" | grep -qiE 'Verdict: *(pass|needs work|not needed)'; then exit 0; fi
echo 'content/ changed but the pull request has no language review. Run /language-review and paste the result under "## Language review".' >&2
exit 2
```

Run: `chmod +x scripts/hooks/pr-reminder.sh`

- [ ] **Step 2: Register it in the shared project settings**

Create `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "sh scripts/hooks/pr-reminder.sh" }]
      }
    ]
  }
}
```

Add `.claude/settings.local.json` to `.gitignore` under the `.claude/worktrees/` line.

- [ ] **Step 3: Test the hook by hand**

Run (from the worktree, where content changed on this branch):

```sh
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"gh pr create --title t --body x"}}' | sh scripts/hooks/pr-reminder.sh; echo "exit=$?"
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"gh pr create --title t --body \"Verdict: pass\""}}' | sh scripts/hooks/pr-reminder.sh; echo "exit=$?"
printf '%s' '{"tool_name":"Bash","tool_input":{"command":"git status"}}' | sh scripts/hooks/pr-reminder.sh; echo "exit=$?"
```

Expected: the first prints the message and `exit=2`; the second and third print nothing and `exit=0`.

- [ ] **Step 4: Format and commit**

Run: `npx prettier --write .claude/settings.json && npm run format:check`

```bash
git add scripts/hooks/pr-reminder.sh .claude/settings.json .gitignore
git commit -m "chore: Claude Code hook reminds to run the language review before gh pr create"
```

---

### Task 9: Whole-branch verification and the follow-up list for the team

**Files:**
- Create: `docs/research/plain-language/warnings-2026-10-07.md`

**Interfaces:** consumes `npm run validate` output.

- [ ] **Step 1: Run everything CI runs**

Run: `npm run format:check && npm run check && npm test && npm run build && npm run test:dist`
Expected: all green. Lighthouse (`npm run lhci`) runs in CI; locally it stalls under agent environment variables, so skip it here and read the CI result on the pull request.

- [ ] **Step 2: Capture the warnings for the content owners**

Run: `npm run validate 2>&1 | sed -n '/Language warnings/,/Readability trend/p' > docs/research/plain-language/warnings-2026-10-07.md`
Then prepend one line to that file: `# Language warnings at the time the standard was introduced (not failing the build)`.
Expected: the file lists every warning with file, line and rule, and ends with the readability trend line.

- [ ] **Step 3: Commit**

```bash
git add docs/research/plain-language/warnings-2026-10-07.md
git commit -m "docs: language warnings list for the content owners"
```

The pull request description for this branch links `docs/writing-guide.md`, `docs/terms.md`, the warnings file, and states the rulings made during execution.
