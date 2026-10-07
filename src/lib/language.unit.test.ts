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
    expect(genderFormErrors('карту/пасош')).toHaveLength(1);
    expect(genderFormErrors('Нашао/–ла сам')).toHaveLength(1);
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
    expect(
      rules(checkBody('x', '> Ово радите у формулару на сајту eid.gov.rs, не у водичу.')),
    ).toEqual([]);
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
    expect(
      formatFinding({
        file: 'content/graph.yaml',
        line: 0,
        rule: 'gender-form',
        severity: 'error',
        message: 'm',
        excerpt: 'e',
      }),
    ).toBe('content/graph.yaml: gender-form: m — "e"');
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
