#!/usr/bin/env node
// scripts/check-pr-language-review.mjs
// Fails a pull request that changes content/ without a language review verdict in its description,
// or that changes docs/terms.md or docs/writing-guide.md without a row in docs/language-decisions.md.
// Usage: PR_BODY="<description>" node scripts/check-pr-language-review.mjs <changed files...>
import { pathToFileURL } from 'node:url';

const HEADING = '## Language review';
// "not needed" must carry a reason on the same line, such as "not needed (image rename)".
const VERDICT = /^\s*Verdict:\s*(pass|needs work|not needed[ \t]+\S.*)\s*$/im;

export const MESSAGE =
  'content/ changed but the pull request has no language review. ' +
  'Run /language-review and paste the result under "## Language review".';

export const DECISION_MESSAGE =
  'docs/terms.md or docs/writing-guide.md changed but docs/language-decisions.md did not. ' +
  'Add a dated row (decision, reason, source, who decided, where it applies) to ' +
  'docs/language-decisions.md in this pull request.';

const GOVERNED_DOCS = ['docs/terms.md', 'docs/writing-guide.md'];
const DECISION_LOG = 'docs/language-decisions.md';

function sectionAfter(body, heading) {
  const start = body.lastIndexOf(heading);
  if (start < 0) return '';
  const rest = body.slice(start + heading.length);
  const next = rest.search(/^## /m);
  return next < 0 ? rest : rest.slice(0, next);
}

/**
 * @param {{ body: string | null | undefined, changedFiles: string[] }} input
 * @returns {{ ok: boolean, reason: string }}
 */
function checkLanguageReview({ body, changedFiles }) {
  if (!changedFiles.some((f) => f.startsWith('content/'))) {
    return { ok: true, reason: 'no changes under content/' };
  }
  if (VERDICT.test(sectionAfter(body ?? '', HEADING))) {
    return { ok: true, reason: 'language review present' };
  }
  return { ok: false, reason: MESSAGE };
}

/**
 * @param {string[]} changedFiles
 * @returns {{ ok: boolean, reason: string }}
 */
function checkDecisionLog(changedFiles) {
  if (!changedFiles.some((f) => GOVERNED_DOCS.includes(f))) {
    return { ok: true, reason: 'term list and guide unchanged' };
  }
  if (changedFiles.includes(DECISION_LOG)) return { ok: true, reason: 'decision log updated' };
  return { ok: false, reason: DECISION_MESSAGE };
}

/**
 * @param {{ body: string | null | undefined, changedFiles: string[] }} input
 * @returns {{ ok: boolean, reason: string }}
 */
export function checkPullRequest({ body, changedFiles }) {
  const review = checkLanguageReview({ body, changedFiles });
  if (!review.ok) return review;
  const log = checkDecisionLog(changedFiles);
  if (!log.ok) return log;
  return { ok: true, reason: `${review.reason}; ${log.reason}` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkPullRequest({
    body: process.env.PR_BODY,
    changedFiles: process.argv.slice(2),
  });
  console.log(result.reason);
  process.exit(result.ok ? 0 : 1);
}
