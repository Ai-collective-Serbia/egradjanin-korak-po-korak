// src/lib/language.ts
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { isHelpNode, outgoing, parseGraph, type Graph } from './graph';
import {
  boldSpans,
  inlineImages,
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
  'help-screen',
  'terms',
] as const;

/** Rule 28: every help screen (id "help-…") opens with this sentence, the one allowed exception to rule 4. */
export const HELP_OPENER = 'Нисте ништа покварили.';

/**
 * Rule 28: help screens never give a phone number (the official help has a contact form only).
 * Matches a Serbian number such as 011 123 456, 011/1234-567 or +381 11 1234567, not "13 цифара".
 */
const PHONE_NUMBER = /(?<!\d)(?:\+381|0[1-9]\d)[ /-]?\d{2,4}[ -]?\d{3,4}(?:[ -]?\d{1,3})?(?!\d)/u;

/**
 * Rule 29: phrases from the "Не пишемо" column of docs/terms.md that are never right, with the
 * replacement from the "Пишемо" column. Ambiguous words from that column (страна, пошта, слика …)
 * are left to the language review.
 */
export const FORBIDDEN_PHRASES: { pattern: RegExp; write: string }[] = [
  { pattern: /вратите се овде/iu, write: 'Вратите се у водич.' },
  { pattern: /на ову стран[уи]/iu, write: 'у водич' },
  { pattern: /портал[ау]? еид/iu, write: 'сајт eid.gov.rs' },
  { pattern: /(?<!\p{L})(?:улогујте|излогујте)/iu, write: 'пријавите се, одјавите се' },
  { pattern: /(?<!\p{L})(?:кликните|тапните|додирните)(?!\p{L})/iu, write: 'притисните' },
  { pattern: /(?<!\p{L})(?:укуцајте|унесите)(?!\p{L})/iu, write: 'упишите' },
  { pattern: /(?<!\p{L})(?:штиклирајте|чекирајте)(?!\p{L})/iu, write: 'означите' },
  { pattern: /(?<!\p{L})(?:јузернејм|пасворд)(?!\p{L})/iu, write: 'корисничко име, лозинка' },
  { pattern: /(?<!\p{L})скриншот/iu, write: 'слика' },
  { pattern: /(?<!\p{L})веб-сајт/iu, write: 'сајт' },
  { pattern: /(?<!\p{L})е-пошт/iu, write: 'имејл' },
  { pattern: /(?<!\p{L})мејл(?!\p{L})/iu, write: 'имејл' },
  { pattern: /(?<!\p{L})икониц/iu, write: 'сличица' },
];

/** The forbidden phrases a text contains, as (phrase as written, replacement) pairs. */
export function forbiddenPhrases(text: string): { found: string; write: string }[] {
  const hits: { found: string; write: string }[] = [];
  for (const { pattern, write } of FORBIDDEN_PHRASES) {
    const m = text.match(pattern);
    if (m) hits.push({ found: m[0], write });
  }
  return hits;
}

function termsMessage(hit: { found: string; write: string }): string {
  return `"${hit.found}" is on the "не пишемо" list in docs/terms.md; write "${hit.write}"`;
}

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

const SLASH_FORM =
  /(\p{Script=Cyrillic}+)( *[-–]? *)\/( *[-–]? *)(\p{Script=Cyrillic}+)(?!\p{L})/gu;
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

function altTextProblem(alt: string, file: string): boolean {
  const base = path.basename(file).replace(/\.[a-z0-9]+$/i, '');
  return !alt || alt === base || words(alt).length < LIMITS.altWords;
}

// A bold banner that opens a screen: „Ово“ and a verb ending in -те (радите, проверавате).
const BOLD_BANNER = /^\*\*Ово\s+\p{Ll}+те(?!\p{L})/u;

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
    const texts =
      block.kind === 'image'
        ? [block.alt]
        : proseTexts(block).flatMap((t) => [t, ...inlineImages(t).map((i) => i.alt)]);
    for (const text of texts) {
      for (const word of words(plainText(text))) {
        if (mixesScripts(word))
          add(
            block,
            'scripts',
            'error',
            `the word "${word}" mixes Latin and Cyrillic letters`,
            text,
          );
      }
      for (const hit of forbiddenPhrases(plainText(text)))
        add(block, 'terms', 'error', termsMessage(hit), text);
    }
  }
  if (isDirectoryNode(id)) return findings;

  let screenWords = 0;
  for (const block of blocks) {
    if (block.kind === 'image') {
      const alt = block.alt.trim();
      if (altTextProblem(alt, block.file)) {
        add(
          block,
          'alt-text',
          'error',
          `alt text must say what to look for, in at least ${LIMITS.altWords} words`,
          alt || block.file,
        );
      }
      continue;
    }
    const units = block.kind === 'list' ? block.items : [{ text: block.text, line: block.line }];
    for (const unit of units) {
      for (const image of inlineImages(unit.text)) {
        if (altTextProblem(image.alt, image.file))
          add(
            block,
            'alt-text',
            'error',
            `alt text must say what to look for, in at least ${LIMITS.altWords} words`,
            image.alt || image.file,
            unit.line,
          );
      }
      const plain = plainText(unit.text);
      screenWords += words(plain).length;
      for (const error of genderFormErrors(plain))
        add(block, 'gender-form', 'error', error, plain, unit.line);
      if (block.kind === 'heading') continue;

      const sentences = splitSentences(plain);
      for (const sentence of sentences) {
        const n = words(sentence).length;
        if (n > LIMITS.sentenceError)
          add(
            block,
            'sentence-length',
            'error',
            `${n} words in one sentence (limit ${LIMITS.sentenceError})`,
            sentence,
            unit.line,
          );
        else if (n > LIMITS.sentenceWarning)
          add(
            block,
            'sentence-length',
            'warning',
            `${n} words in one sentence (aim for ${LIMITS.sentenceWarning})`,
            sentence,
            unit.line,
          );
      }
      if (block.kind === 'paragraph' && sentences.length > LIMITS.paragraphSentences)
        add(
          block,
          'paragraph-length',
          'warning',
          `${sentences.length} sentences in one paragraph (limit ${LIMITS.paragraphSentences})`,
          plain,
        );
      if (block.kind === 'list' && block.ordered && sentences.length >= LIMITS.stepSentences)
        add(
          block,
          'one-action',
          'warning',
          `${sentences.length} sentences in one numbered step; one action per step`,
          plain,
          unit.line,
        );
      for (const span of boldSpans(unit.text)) {
        const n = words(span).length;
        if (n > LIMITS.boldWords)
          add(
            block,
            'bold',
            'warning',
            `bold span of ${n} words; bold only the word to tap or the thing to look for`,
            span,
            unit.line,
          );
      }
      if (/\d ?[–-] ?\d/u.test(plain))
        add(
          block,
          'dates',
          'warning',
          'a dash between numbers; write "од 9 до 18"',
          plain,
          unit.line,
        );
      if (/\S {2,}\S/.test(plain))
        add(block, 'punctuation', 'warning', 'double space', plain, unit.line);
      if (/\s[.,;:!?]/.test(plain))
        add(block, 'punctuation', 'warning', 'space before punctuation', plain, unit.line);
    }
  }

  if (screenWords > LIMITS.screenWords && blocks[0] && !blocks[0].ignore.has('screen-length')) {
    findings.push({
      file,
      line: 1,
      rule: 'screen-length',
      severity: 'warning',
      message: `${screenWords} words on one screen (limit ${LIMITS.screenWords}); split it into steps`,
      excerpt: '',
    });
  }
  const first = blocks[0];
  if (first?.kind === 'paragraph' && BOLD_BANNER.test(first.text.trim())) {
    add(
      first,
      'callout',
      'warning',
      'the "where you do this" banner is a blockquote: > Ово радите у …, не у водичу.',
      first.text,
    );
  }
  if (isHelpNode(id)) {
    const firstParagraph = blocks.find((b) => b.kind === 'paragraph');
    const firstSentence = firstParagraph
      ? (splitSentences(plainText(firstParagraph.text))[0] ?? '').trim()
      : '';
    if (!firstParagraph || firstSentence !== HELP_OPENER) {
      findings.push({
        file,
        line: firstParagraph?.line ?? 1,
        rule: 'help-screen',
        severity: 'error',
        message: `a help screen opens with "${HELP_OPENER}" as the first sentence of its first paragraph`,
        excerpt: excerpt(firstParagraph?.text ?? ''),
      });
    }
    for (const block of blocks) {
      for (const text of proseTexts(block)) {
        const plain = plainText(text);
        if (PHONE_NUMBER.test(plain)) {
          findings.push({
            file,
            line: block.line,
            rule: 'help-screen',
            severity: 'error',
            message:
              'a help screen never gives a phone number; the official help has a contact form only',
            excerpt: excerpt(plain),
          });
        }
      }
    }
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
      push(
        'title-label-length',
        `title of "${id}" has ${titleLength} characters (limit ${LIMITS.titleChars})`,
        node.title,
      );
    const labels = outgoing(node).flatMap((e) => (e.label ? [e.label] : []));
    if (node.type === 'step' && node.external) labels.push(node.external.label);
    for (const label of labels) {
      const n = [...label].length;
      if (n > LIMITS.labelChars)
        push(
          'title-label-length',
          `label on "${id}" has ${n} characters (limit ${LIMITS.labelChars})`,
          label,
        );
    }
    for (const text of [node.title, ...labels]) {
      for (const error of genderFormErrors(text)) push('gender-form', `on "${id}": ${error}`, text);
      for (const hit of forbiddenPhrases(text))
        push('terms', `on "${id}": ${termsMessage(hit)}`, text);
    }
  }
  return findings;
}

/** Rule 29 on the interface strings: a forbidden phrase under every external button is on every screen. */
export function checkUiStrings(strings: Record<string, string>): Finding[] {
  const file = 'content/ui-strings.yaml';
  const findings: Finding[] = [];
  for (const [key, text] of Object.entries(strings)) {
    for (const hit of forbiddenPhrases(text))
      findings.push({
        file,
        line: 0,
        rule: 'terms',
        severity: 'error',
        message: `${key}: ${termsMessage(hit)}`,
        excerpt: excerpt(text),
      });
  }
  return findings;
}

export type Trend = { meanSentenceLength: number; longWordShare: number };

export function checkContent(root = process.cwd()): { findings: Finding[]; trend: Trend } {
  const graph = parseGraph(readFileSync(path.join(root, 'content', 'graph.yaml'), 'utf8'));
  const findings = checkGraphText(graph);
  const uiFile = path.join(root, 'content', 'ui-strings.yaml');
  if (existsSync(uiFile)) {
    const strings = parse(readFileSync(uiFile, 'utf8')) as Record<string, unknown>;
    const onlyStrings = Object.fromEntries(
      Object.entries(strings ?? {}).filter((e): e is [string, string] => typeof e[1] === 'string'),
    );
    findings.push(...checkUiStrings(onlyStrings));
  }
  const nodesDir = path.join(root, 'content', 'nodes');
  const sentenceLengths: number[] = [];
  let wordCount = 0;
  let longWords = 0;

  for (const entry of readdirSync(nodesDir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
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
  return {
    findings,
    trend: { meanSentenceLength, longWordShare: wordCount ? longWords / wordCount : 0 },
  };
}

export function formatFinding(f: Finding): string {
  const where = f.line ? `${f.file}:${f.line}` : f.file;
  return `${where}: ${f.rule}: ${f.message} — "${f.excerpt}"`;
}
