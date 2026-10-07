import type { Script } from './script';
import { transliterate, type Overrides } from './translit';

/** Returns a function that transliterates for Latin pages and is the identity for Cyrillic pages. */
export function makeT(script: Script, overrides: Overrides): (text: string) => string {
  return script === 'lat' ? (text) => transliterate(text, overrides) : (text) => text;
}
