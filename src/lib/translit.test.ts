import { describe, expect, it } from 'vitest';
import { transliterate } from './translit';

describe('transliterate', () => {
  it('maps every Serbian Cyrillic letter', () => {
    expect(transliterate('абвгдђежзијклљмнњопрстћуфхцчџш')).toBe(
      'abvgdđežzijklljmnnjoprstćufhcčdžš',
    );
    expect(transliterate('АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШ')).toBe(
      'ABVGDĐEŽZIJKLLJMNNJOPRSTĆUFHCČDŽŠ',
    );
  });

  it('title-cases digraphs when the word is not all caps', () => {
    expect(transliterate('Љубљана')).toBe('Ljubljana');
    expect(transliterate('Њего')).toBe('Njego');
    expect(transliterate('Џеп')).toBe('Džep');
  });

  it('upper-cases digraphs inside all-caps words', () => {
    expect(transliterate('ЉУБЉАНА')).toBe('LJUBLJANA');
    expect(transliterate('ЏЕП')).toBe('DŽEP');
    expect(transliterate('ВРАЊ')).toBe('VRANJ');
  });

  it('leaves Latin text, URLs, and Markdown syntax untouched', () => {
    expect(transliterate('Отворите https://euprava.gov.rs/ сада')).toBe(
      'Otvorite https://euprava.gov.rs/ sada',
    );
    expect(transliterate('![Почетна страна](./01-home.png)')).toBe(
      '![Početna strana](./01-home.png)',
    );
    expect(transliterate('**Важно:** `code`')).toBe('**Važno:** `code`');
  });

  it('keeps non-Serbian Cyrillic letters as they are', () => {
    expect(transliterate('ы')).toBe('ы');
  });

  it('applies whole-word overrides before the letter map', () => {
    const overrides = { Гугл: 'Google' };
    expect(transliterate('Гугл налог', overrides)).toBe('Google nalog');
    expect(transliterate('Гуглов налог', overrides)).toBe('Guglov nalog');
  });

  it('treats override keys literally even with regex characters', () => {
    expect(transliterate('С.Р.Б. (тест)', { 'С.Р.Б.': 'SRB' })).toBe('SRB (test)');
  });

  it('returns empty string for empty input', () => {
    expect(transliterate('')).toBe('');
  });
});
