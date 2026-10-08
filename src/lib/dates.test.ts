import { describe, expect, it } from 'vitest';
import { formatDate } from './dates';

describe('formatDate', () => {
  it('writes the date as the guide does: day without a leading zero, Cyrillic month, trailing period', () => {
    expect(formatDate('2026-10-07')).toBe('7. октобар 2026.');
    expect(formatDate('2026-01-13')).toBe('13. јануар 2026.');
    expect(formatDate('2027-12-31')).toBe('31. децембар 2027.');
  });

  it('rejects text that is not a YYYY-MM-DD calendar date', () => {
    expect(() => formatDate('7.10.2026')).toThrow();
    expect(() => formatDate('2026-13-01')).toThrow();
  });
});
