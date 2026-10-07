#!/bin/sh
# Claude Code PreToolUse hook (Bash tool). Before `gh pr create` or `gh pr edit`, when files under
# content/ changed on this branch and the command carries no "Verdict:" line, block with the same
# message as the CI gate. Exit 0 lets the command run; exit 2 blocks it and shows stderr to Claude.
input=$(cat)
command=$(printf '%s' "$input" | node -e '
  let s = "";
  process.stdin.on("data", (d) => (s += d)).on("end", () => {
    try { process.stdout.write(JSON.parse(s).tool_input?.command ?? ""); } catch {}
  });
')
case "$command" in
  *"gh pr create"*|*"gh pr edit"*) ;;
  *) exit 0 ;;
esac
git fetch -q origin main 2>/dev/null
changed=$(git diff --name-only origin/main...HEAD 2>/dev/null | grep -c '^content/')
[ "${changed:-0}" -eq 0 ] && exit 0
body="$command"
file=$(printf '%s' "$command" | sed -n 's/.*--body-file[= ]\([^ ]*\).*/\1/p')
if [ -n "$file" ] && [ -f "$file" ]; then body="$body $(cat "$file")"; fi
if printf '%s' "$body" | grep -qiE 'Verdict: *(pass|needs work|not needed)'; then exit 0; fi
echo 'content/ changed but the pull request has no language review. Run /language-review and paste the result under "## Language review".' >&2
exit 2
