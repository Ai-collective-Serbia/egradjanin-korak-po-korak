#!/usr/bin/env node
// scripts/check-pr-language-review.mjs
// Fails a pull request that changes content/ without a language review verdict in its description.
// Usage: PR_BODY="<description>" node scripts/check-pr-language-review.mjs <changed files...>
import { pathToFileURL } from 'node:url';

const HEADING = '## Language review';
const VERDICT = /^\s*Verdict:\s*(pass|needs work|not needed\b.*)\s*$/im;

export const MESSAGE =
  'content/ changed but the pull request has no language review. ' +
  'Run /language-review and paste the result under "## Language review".';

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
export function checkPullRequest({ body, changedFiles }) {
  if (!changedFiles.some((f) => f.startsWith('content/'))) {
    return { ok: true, reason: 'no changes under content/; language review not required' };
  }
  if (VERDICT.test(sectionAfter(body ?? '', HEADING))) {
    return { ok: true, reason: 'language review present' };
  }
  return { ok: false, reason: MESSAGE };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkPullRequest({
    body: process.env.PR_BODY,
    changedFiles: process.argv.slice(2),
  });
  console.log(result.reason);
  process.exit(result.ok ? 0 : 1);
}
