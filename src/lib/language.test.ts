import { describe, expect, it } from 'vitest';
import { checkContent, formatFinding } from './language';

describe('content/ language rules (the real wizard content)', () => {
  it('every screen passes the error-level language rules', () => {
    const { findings, trend } = checkContent();
    const errors = findings.filter((f) => f.severity === 'error').map(formatFinding);
    const warnings = findings.filter((f) => f.severity === 'warning').map(formatFinding);
    if (warnings.length) {
      console.log(
        `Language warnings (${warnings.length}), not failing:\n  ${warnings.join('\n  ')}`,
      );
    }
    console.log(
      `Readability trend (prose screens): mean sentence length ${trend.meanSentenceLength.toFixed(1)} words, ` +
        `${(trend.longWordShare * 100).toFixed(1)}% of words over six letters`,
    );
    expect(errors).toEqual([]);
  });
});
