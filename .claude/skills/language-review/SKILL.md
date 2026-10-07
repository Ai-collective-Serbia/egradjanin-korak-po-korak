---
name: language-review
description: Review changed screens under content/ against the writing guide and term list, score the eleven rubric criteria, and print the "## Language review" block for the pull request. Run it before opening or updating a content pull request.
context: fork
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git merge-base:*), Bash(git status:*), Bash(git log:*), Bash(npm run validate)
---

Review the content changes on this branch for language, following `docs/language-review.md`
exactly.

1. Read `docs/writing-guide.md`, `docs/terms.md` and `docs/language-review.md`.
2. Find the changed screens, uncommitted edits included. Run
   `git diff --name-only "$(git merge-base main HEAD)" -- content/` to compare the working tree with
   the point where this branch left `main`, and `git status --porcelain -- content/` to find new
   folders git does not track yet. If there is no local `main` branch, use `origin/main` instead.
   If nothing under `content/` changed, print `Verdict: not needed (no content changes)` under a
   `## Language review` heading and stop. If only images changed, score criteria 9 and 10 as the
   rubric says.
3. For each changed screen, read `content/nodes/<id>/index.md` in full and its entry in
   `content/graph.yaml` (title, answers, external label). Read the screens it links to or that lead
   to it only when a criterion needs them (criteria 5 and 7).
4. Run `npm run validate` and note the language warnings for the changed screens.
5. Score the eleven criteria from 0 to 3 as the rubric defines, with a one-line note for every score
   under 3.
6. Print only the output block from the rubric's "Output format" section, verdict and edits
   included. Do not edit any file.
