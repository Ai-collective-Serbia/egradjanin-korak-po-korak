#!/bin/sh
# Claude Code PreToolUse hook (Bash tool). Before `gh pr create` or `gh pr edit`, when files under
# content/ changed on this branch and the command carries no "Verdict:" line, block with the same
# message as the CI gate. Exit 0 lets the command run; exit 2 blocks it and shows stderr to Claude.
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
changed=$(git diff --name-only origin/main...HEAD 2>/dev/null | grep -c '^content/')
[ "${changed:-0}" -eq 0 ] && exit 0
body="$command"
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
  # A body file we cannot read: let the command run rather than block on a guess.
  [ -n "$file" ] && [ -r "$file" ] || exit 0
  body="$body $(cat "$file")"
fi
if printf '%s' "$body" | grep -qiE 'Verdict: *(pass|needs work|not needed +[^ ])'; then exit 0; fi
echo 'content/ changed but the pull request has no language review. Run /language-review and paste the result under "## Language review".' >&2
exit 2
