#!/bin/sh
# Claude Code PreToolUse hook (Bash tool). Before `gh pr create` or `gh pr edit`, block with the same
# messages as the CI gate (scripts/check-pr-language-review.mjs) when files under content/ changed
# on this branch and the command carries no "Verdict:" line, or when docs/terms.md or
# docs/writing-guide.md changed and docs/language-decisions.md did not.
# Exit 0 lets the command run; exit 2 blocks it and shows stderr to Claude.
# This is a reminder only; CI enforces the rule. When in doubt it lets the command run.
input=$(cat)
command=$(printf '%s' "$input" | node -e '
  let s = "";
  process.stdin.on("data", (d) => (s += d)).on("end", () => {
    try { process.stdout.write(JSON.parse(s).tool_input?.command ?? ""); } catch {}
  });
')
# Act only when a command segment (split on newlines, ;, &, |) starts with gh pr create/edit,
# so a mention inside another command, such as a commit message, does not trigger the hook.
printf '%s\n' "$command" | tr ';|&' '\n\n\n' |
  grep -qE '^[[:space:]]*gh[[:space:]]+pr[[:space:]]+(create|edit)([[:space:]]|$)' || exit 0
git fetch -q origin main 2>/dev/null
# When the diff fails, files is empty and both checks below let the command run.
# --no-renames lists a renamed docs/terms.md under its old path too, so check 2 sees it.
files=$(git diff --name-only --no-renames origin/main...HEAD 2>/dev/null)

# Check 1: content/ changed, so the pull request body needs a language review verdict.
if printf '%s\n' "$files" | grep -q '^content/'; then
  body="$command"
  verdict_unknown=0
  # Path after --body-file, --body-file=, -F or -F=, optionally in single or double quotes.
  # The node call exits 0 with the path when the flag is present and 1 when it is not.
  file=$(CMD="$command" node -e '
    const m = process.env.CMD.match(
      /(?:^|\s)(?:--body-file|-F)(?:=|\s+)(?:"([^"]*)"|'"'"'([^'"'"']*)'"'"'|([^\s;|&]+))/,
    );
    if (!m) process.exit(1);
    process.stdout.write(m[1] ?? m[2] ?? m[3]);
  ')
  if [ $? -eq 0 ]; then
    if [ -n "$file" ] && [ -r "$file" ]; then
      body="$body $(cat "$file")"
    else
      # A body file we cannot read: do not block on a guess.
      verdict_unknown=1
    fi
  fi
  if [ "$verdict_unknown" -eq 0 ] &&
    ! printf '%s' "$body" | grep -qiE 'Verdict: *(pass|needs work|not needed +[^ ])'; then
    echo 'content/ changed but the pull request has no language review. Run /language-review and paste the result under "## Language review".' >&2
    exit 2
  fi
fi

# Check 2: the term list or the writing guide changed, so the decision log must change too.
if printf '%s\n' "$files" | grep -qxE 'docs/(terms|writing-guide)\.md' &&
  ! printf '%s\n' "$files" | grep -qxF 'docs/language-decisions.md'; then
  echo 'docs/terms.md or docs/writing-guide.md changed but docs/language-decisions.md did not. Add a dated row (decision, reason, source, who decided, where it applies) to docs/language-decisions.md in this pull request.' >&2
  exit 2
fi
exit 0
