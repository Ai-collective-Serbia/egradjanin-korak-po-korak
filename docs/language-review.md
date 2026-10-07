# Language review

A review of changed or added screens against `docs/writing-guide.md` and `docs/terms.md`. Any
coding agent or person can run it; in Claude Code, `/language-review` does these steps.

## Steps

1. List the changed files under `content/` (`git diff --name-only main...HEAD -- content/`). Review
   every screen whose `index.md`, title or labels changed. Read each one in full, with its entry in
   `content/graph.yaml`.
2. Run `npm run validate` and read the language warnings for those screens.
3. Score each criterion below from 0 to 3 for the set of changed screens: 3 fully met, 2 met with a
   small slip you name, 1 broken in a way the reader will notice, 0 broken throughout.
4. The verdict is `pass` when every criterion scores 2 or 3, otherwise `needs work`. If the change
   touches no reader-visible text (an image swap, a typo in a file name), the verdict is
   `not needed` followed by the reason.
5. Print the result in the format below and nothing else.

## Criteria

| # | Criterion | What 3 looks like |
| --- | --- | --- |
| 1 | One action per step | Every numbered step asks for exactly one physical action; explanations sit in their own sentence or paragraph. |
| 2 | Imperative, addressed as "ви" | Instructions are imperatives; no "се"-passive, no "потребно је", no "ти", no authors' "ми". |
| 3 | Positive phrasing | The text says what to do; "не" appears only in real warnings; no double negatives. |
| 4 | Clear referents | Every "то", "га", "је", "овде", "ова страна" has one obvious referent on the same screen. |
| 5 | Terms explained in place | Each term the reader may not know (ПИН, QR, сертификат у клауду, еСандуче) is explained where it first appears on this path, in the words from `docs/terms.md`. |
| 6 | One word for one thing | The screen uses the words in `docs/terms.md` and never a listed "не пишемо" variant, never one word in two senses (картица, страна, потврда, пошта, слика). |
| 7 | Consistent with the flow | Button names, step wording and the callout match the neighbouring screens; answer labels on one screen share one voice. |
| 8 | Calm tone | No blame, no exclamation marks, no "просто" or "само" that makes a hard step sound trivial. |
| 9 | Alt text says what to look for | Each image's alt text names the control or detail the reader must find, not only what the picture shows. |
| 10 | Text matches the screenshot | Every label the text names appears, with the same spelling, in the screenshot it refers to. |

## Output format

```
## Language review

Screens: <node ids>

| # | Criterion | Score | Note |
| --- | --- | --- | --- |
| 1 | One action per step | 3 | |
| 2 | Imperative, addressed as "ви" | 2 | register-upload step 2: "ставка" is explained in the next sentence; fine |
| … | … | … | … |

Verdict: pass

Edits:
- <node id>: "<sentence>" → "<rewrite>"
```

`Verdict: needs work` lists every edit that would raise a 0 or 1 to a 2. `Verdict: not needed`
gives the reason on the same line.
