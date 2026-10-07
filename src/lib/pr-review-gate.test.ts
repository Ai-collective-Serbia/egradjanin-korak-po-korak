// src/lib/pr-review-gate.test.ts
import { describe, expect, it } from 'vitest';
import { checkPullRequest } from '../../scripts/check-pr-language-review.mjs';

const review =
  '## What changed\n\nx\n\n## Language review\n\n| # | Criterion | Score | Note |\n\nVerdict: pass\n';

describe('pull-request language review gate', () => {
  it('passes when no file under content/ changed, whatever the body says', () => {
    expect(checkPullRequest({ body: null, changedFiles: ['src/lib/text.ts'] }).ok).toBe(true);
  });

  it('fails when content/ changed and the body is empty or has no verdict', () => {
    expect(checkPullRequest({ body: null, changedFiles: ['content/graph.yaml'] }).ok).toBe(false);
    expect(
      checkPullRequest({
        body: '## Language review\n\n<!-- paste -->',
        changedFiles: ['content/nodes/a/index.md'],
      }).ok,
    ).toBe(false);
    expect(
      checkPullRequest({ body: 'Verdict: pass', changedFiles: ['content/nodes/a/index.md'] }).ok,
    ).toBe(false);
  });

  it('passes with a verdict under the Language review heading', () => {
    for (const verdict of [
      'Verdict: pass',
      'Verdict: needs work',
      'Verdict: not needed (image swap)',
    ]) {
      const body = review.replace('Verdict: pass', verdict);
      expect(checkPullRequest({ body, changedFiles: ['content/nodes/a/index.md'] }).ok).toBe(true);
    }
  });

  it('ignores a verdict that sits under a later heading', () => {
    const body = '## Language review\n\nnothing\n\n## Notes\n\nVerdict: pass';
    expect(checkPullRequest({ body, changedFiles: ['content/nodes/a/index.md'] }).ok).toBe(false);
  });
});
