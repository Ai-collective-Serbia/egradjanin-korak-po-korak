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
// Image syntax with an optional quoted title: ![alt](src "title").
const IMAGE_SYNTAX = String.raw`!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)`;
const IMAGE = new RegExp(`^\\s*${IMAGE_SYNTAX}\\s*$`);
const INLINE_IMAGE = new RegExp(`\\s*${IMAGE_SYNTAX}`, 'g');
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

/** Images written inside a line of prose, such as a paragraph or a list item. */
export function inlineImages(inline: string): { alt: string; file: string }[] {
  return [...inline.matchAll(INLINE_IMAGE)].map((m) => ({ alt: m[1].trim(), file: m[2] }));
}

/** Reader-visible text: markup removed, inline images (alt text included) dropped. */
export function plainText(inline: string): string {
  return inline
    .replace(/<[^>]+>/g, '')
    .replace(INLINE_IMAGE, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .replace(/\\([\\*_`#])/g, '$1');
}

const ABBREVIATIONS = new Set([
  'бр',
  'нпр',
  'тзв',
  'итд',
  'тј',
  'ул',
  'г',
  'рег',
  'б.б',
  'сл',
  'др',
]);
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
