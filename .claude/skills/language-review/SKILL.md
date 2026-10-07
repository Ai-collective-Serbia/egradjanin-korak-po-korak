---
name: language-review
description: Review changed screens under content/ against the writing guide and term list, score the ten rubric criteria, and print the "## Language review" block for the pull request. Run it before opening or updating a content pull request.
context: fork
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(npm run validate)
---

Review the content changes on this branch for language, following `docs/language-review.md`
exactly.

1. Read `docs/writing-guide.md`, `docs/terms.md` and `docs/language-review.md`.
2. Run `git diff --name-only main...HEAD -- content/` to find the changed screens. If nothing under
   `content/` changed, print `Verdict: not needed (no content changes)` under a `## Language review`
   heading and stop.
3. For each changed screen, read `content/nodes/<id>/index.md` in full and its entry in
   `content/graph.yaml` (title, answers, external label). Read the screens it links to only when a
   criterion needs them (criterion 7).
4. Run `npm run validate` and note the language warnings for the changed screens.
5. Score the ten criteria from 0 to 3 as the rubric defines, with a one-line note for every score
   under 3.
6. Print only the output block from the rubric's "Output format" section, verdict and edits
   included. Do not edit any file.
