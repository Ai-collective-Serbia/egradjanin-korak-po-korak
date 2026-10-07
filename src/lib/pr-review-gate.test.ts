// src/lib/pr-review-gate.test.ts
import { describe, expect, it } from 'vitest';
import {
  checkPullRequest,
  DECISION_MESSAGE,
  MESSAGE,
} from '../../scripts/check-pr-language-review.mjs';

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

  it('requires a reason on the same line after "not needed"', () => {
    const changedFiles = ['content/nodes/a/index.md'];
    const withVerdict = (v: string) => review.replace('Verdict: pass', v);
    expect(checkPullRequest({ body: withVerdict('Verdict: not needed'), changedFiles }).ok).toBe(
      false,
    );
    expect(
      checkPullRequest({ body: withVerdict('Verdict: not needed\n\nThanks'), changedFiles }).ok,
    ).toBe(false);
    expect(
      checkPullRequest({ body: withVerdict('Verdict: not needed (image rename)'), changedFiles })
        .ok,
    ).toBe(true);
  });

  it('reads the last Language review section when a pasted review repeats the heading', () => {
    const pasted =
      '## Language review\n\n<!-- paste -->\n\n## Language review\n\n| # | Criterion |\n\n';
    const changedFiles = ['content/nodes/a/index.md'];
    expect(checkPullRequest({ body: pasted + 'Verdict: pass\n', changedFiles }).ok).toBe(true);
    expect(checkPullRequest({ body: pasted, changedFiles }).ok).toBe(false);
  });

  it('ignores a verdict that sits under a later heading', () => {
    const body = '## Language review\n\nnothing\n\n## Notes\n\nVerdict: pass';
    expect(checkPullRequest({ body, changedFiles: ['content/nodes/a/index.md'] }).ok).toBe(false);
  });
});

describe('pull-request decision log gate', () => {
  it('fails when docs/terms.md changed without docs/language-decisions.md', () => {
    expect(checkPullRequest({ body: null, changedFiles: ['docs/terms.md'] })).toEqual({
      ok: false,
      reason: DECISION_MESSAGE,
    });
  });

  it('passes when docs/writing-guide.md changed together with the log', () => {
    expect(
      checkPullRequest({
        body: null,
        changedFiles: ['docs/writing-guide.md', 'docs/language-decisions.md'],
      }).ok,
    ).toBe(true);
  });

  it('fails a content pull request with a verdict when the term list changed without the log', () => {
    expect(
      checkPullRequest({
        body: review,
        changedFiles: ['docs/terms.md', 'content/nodes/a/index.md'],
      }),
    ).toEqual({ ok: false, reason: DECISION_MESSAGE });
  });

  it('reports the missing language review first when both checks fail', () => {
    expect(
      checkPullRequest({
        body: null,
        changedFiles: ['docs/terms.md', 'content/nodes/a/index.md'],
      }),
    ).toEqual({ ok: false, reason: MESSAGE });
  });

  it('passes when only the decision log changed', () => {
    expect(checkPullRequest({ body: null, changedFiles: ['docs/language-decisions.md'] }).ok).toBe(
      true,
    );
  });
});
