export type Overrides = Record<string, string>;

const LETTERS: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  ђ: 'đ',
  е: 'e',
  ж: 'ž',
  з: 'z',
  и: 'i',
  ј: 'j',
  к: 'k',
  л: 'l',
  љ: 'lj',
  м: 'm',
  н: 'n',
  њ: 'nj',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ћ: 'ć',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'č',
  џ: 'dž',
  ш: 'š',
};

const CYRILLIC = /[\u0400-\u04FF]/g;

function isCyrillicUpper(ch: string | undefined): boolean {
  return !!ch && /[\u0400-\u04FF]/.test(ch) && ch !== ch.toLowerCase();
}

function isCyrillicLower(ch: string | undefined): boolean {
  return !!ch && /[\u0400-\u04FF]/.test(ch) && ch !== ch.toUpperCase();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyOverrides(text: string, overrides: Overrides): string {
  const keys = Object.keys(overrides).sort((a, b) => b.length - a.length);
  let out = text;
  for (const key of keys) {
    const pattern = new RegExp(`(?<!\\p{L})${escapeRegex(key)}(?!\\p{L})`, 'gu');
    out = out.replace(pattern, overrides[key]);
  }
  return out;
}

/** Serbian Cyrillic to Latin. Only Cyrillic code points change; everything else is returned as is. */
export function transliterate(text: string, overrides: Overrides = {}): string {
  const source = Object.keys(overrides).length ? applyOverrides(text, overrides) : text;
  return source.replace(CYRILLIC, (ch, offset: number, whole: string) => {
    const lower = ch.toLowerCase();
    const latin = LETTERS[lower];
    if (latin === undefined) return ch;
    if (ch === lower) return latin;
    if (latin.length === 1) return latin.toUpperCase();
    const next = whole[offset + 1];
    const prev = whole[offset - 1];
    const allCaps = isCyrillicUpper(next) || (!isCyrillicLower(next) && isCyrillicUpper(prev));
    return allCaps ? latin.toUpperCase() : latin[0].toUpperCase() + latin.slice(1);
  });
}
