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
    const blocks = parseBlocks(
      '<details>\n<summary>Шта пише у менију</summary>\n\nТекст.\n\n</details>',
    );
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph']);
    expect(blocks[0]).toMatchObject({ text: 'Шта пише у менију' });
  });

  it('reads an indented image and an image with a title', () => {
    const blocks = parseBlocks('   ![Пример: дугме Даље на дну](./a.png "наслов")');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      kind: 'image',
      alt: 'Пример: дугме Даље на дну',
      file: './a.png',
    });
  });
});

describe('plainText', () => {
  it('removes inline markup and keeps the words', () => {
    expect(plainText('Притисните **Даље** и [сајт](https://x.rs) <a href="/">овде</a> \\*')).toBe(
      'Притисните Даље и сајт овде *',
    );
  });

  it('drops inline images together with their alt text', () => {
    expect(plainText('Видећете ![Дугме](./a.png) дугме ![x](./b.png "наслов").')).toBe(
      'Видећете дугме.',
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
    expect(
      splitSentences('Идите на сајт eid.gov.rs. Понесите нпр. личну карту. Дођите 29. новембра.'),
    ).toEqual(['Идите на сајт eid.gov.rs.', 'Понесите нпр. личну карту.', 'Дођите 29. новембра.']);
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
