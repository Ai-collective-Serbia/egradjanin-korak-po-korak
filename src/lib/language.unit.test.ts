// src/lib/language.unit.test.ts
import { describe, expect, it } from 'vitest';
import { parseGraph } from './graph';
import {
  checkBody,
  checkGraphText,
  checkUiStrings,
  formatFinding,
  genderFormErrors,
  HELP_OPENER,
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

  it('checks alt text of indented, titled and inline images, and does not count it as prose', () => {
    expect(
      rules(checkBody('x', '1. Притисните **Даље**.\n   ![](./a.png)\n2. Сачекајте.')),
    ).toEqual(['error:alt-text']);
    expect(rules(checkBody('x', '![Дугме Даље на дну](./a.png "наслов")'))).toEqual([]);
    const fifteen = 'реч '.repeat(15).trim();
    expect(rules(checkBody('x', `${fifteen} ![Дугме](./a.png).`))).toEqual(['error:alt-text']);
    expect(rules(checkBody('x', `${fifteen} ![Дугме](./a.png "наслов") овде.`))).toEqual([
      'error:alt-text',
      'warning:sentence-length',
    ]);
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
    expect(rules(checkBody('x', '**Ово проверавате у пошти.** Текст.'))).toContain(
      'warning:callout',
    );
    expect(rules(checkBody('x', '**Ово је важно.** Текст.'))).not.toContain('warning:callout');
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
        'help-screen',
        'one-action',
        'paragraph-length',
        'punctuation',
        'scripts',
        'screen-length',
        'sentence-length',
        'terms',
        'title-label-length',
      ].sort(),
    );
  });
});

describe('help screens (rule 28, help-screen)', () => {
  const opener = HELP_OPENER + ' Ово се дешава многима.';

  it('requires the fixed opening sentence as the first sentence of the first paragraph', () => {
    expect(rules(checkBody('help-account', opener))).toEqual([]);
    expect(
      rules(checkBody('help-account', 'Ако активација није успела, идите на шалтер.')),
    ).toEqual(['error:help-screen']);
    expect(rules(checkBody('help-account', 'Ово се дешава многима. ' + HELP_OPENER))).toEqual([
      'error:help-screen',
    ]);
  });

  it('looks past the callout blockquote and a heading to find the first paragraph', () => {
    const body = '> Ово радите у формулару на сајту eid.gov.rs, не у водичу.\n\n' + opener;
    expect(rules(checkBody('help-upload', body))).toEqual([]);
    const headed = '## Шта да урадите\n\n' + opener;
    expect(rules(checkBody('help-upload', headed))).toEqual([]);
  });

  it('does not apply to screens whose id does not start with "help-"', () => {
    expect(rules(checkBody('register-upload', 'Приложите 2 фотографије.'))).toEqual([]);
    expect(rules(checkBody('helper-screen', 'Приложите 2 фотографије.'))).toEqual([]);
  });

  it('rejects a phone number on a help screen, but not ordinary numbers', () => {
    // toContain, not toEqual: "1234-567" also trips the existing dates warning, which is fine.
    for (const phone of [
      'Позовите 011 123 456.',
      'Позовите 011/1234-567.',
      'Позовите +381 11 1234567.',
    ]) {
      expect(rules(checkBody('help-account', opener + ' ' + phone))).toContain('error:help-screen');
    }
    // Separate paragraphs, so the paragraph-length warning does not fire.
    const ordinary = [
      opener,
      'ЈМБГ има 13 цифара. Чекате највише 48 сати.',
      'На потврди су 2 броја. Шалтера има преко 1000.',
      'Лозинка има од 8 до 20 знакова. ПИН је на пример 482913.',
    ].join('\n\n');
    expect(rules(checkBody('help-account', ordinary))).toEqual([]);
    // Phone numbers are fine on ordinary screens; the rule is about help screens only.
    expect(rules(checkBody('find-counter', 'Позовите 011 123 456.'))).toEqual([]);
  });
});

describe('forbidden phrases from the term list (rule 29, terms)', () => {
  it('errors on a listed phrase in a body, case-insensitively and with letter boundaries', () => {
    expect(rules(checkBody('x', 'Када завршите, вратите се овде.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Пишите подршци Портала еИД.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Унесите лозинку.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Кликните на дугме.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Проверите имејл. Упишите лозинку. Притисните дугме.'))).toEqual(
      [],
    );
    expect(rules(checkBody('counter-list-a', '- **Пошта**, кликните овде.'))).toEqual([
      'error:terms',
    ]);
  });

  it('names the phrase and what to write instead', () => {
    const [finding] = checkBody('x', 'Када завршите, вратите се овде.');
    expect(finding.message).toContain('вратите се овде');
    expect(finding.message).toContain('Вратите се у водич.');
  });

  it('errors on a listed phrase in a title or answer label', () => {
    const graph = parseGraph(`
start: a
nodes:
  a:
    type: question
    title: Пишите подршци Портала еИД
    answers:
      - { label: Кликните овде, next: b }
      - { label: Даље, next: b }
  b:
    type: end
    title: Крај
`);
    expect(rules(checkGraphText(graph))).toEqual(['error:terms', 'error:terms']);
  });

  it('errors on a listed phrase in an interface string', () => {
    expect(rules(checkUiStrings({ afterExternal: 'Када завршите, вратите се овде.' }))).toEqual([
      'error:terms',
    ]);
    expect(checkUiStrings({ afterExternal: 'Када завршите, вратите се у водич.' })).toEqual([]);
    expect(checkUiStrings({ back: 'Назад' })[0]?.file).toBeUndefined();
    expect(checkUiStrings({ afterExternal: 'вратите се овде' })[0].file).toBe(
      'content/ui-strings.yaml',
    );
  });
});
