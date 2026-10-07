# Language review

A review of changed or added screens against `docs/writing-guide.md` and `docs/terms.md`. Any
coding agent or person can run it; in Claude Code, `/language-review` does these steps.

## Steps

1. List the changed files under `content/`, uncommitted edits included. Compare the working tree
   with the point where this branch left `main`
   (`git diff --name-only "$(git merge-base main HEAD)" -- content/`) and add new files that git does
   not track yet (`git status --porcelain -- content/`). If there is no local `main` branch, use
   `origin/main` instead. Review every screen whose `index.md`, title, labels or images changed.
   Read each one in full, with its entry in `content/graph.yaml`.
2. Run `npm run validate` and read the language warnings for those screens.
3. Score each of the 13 criteria below from 0 to 3 for the set of changed screens: 3 fully met, 2 met with a
   small slip you name, 1 broken in a way the reader will notice, 0 broken throughout.
4. The verdict is `pass` when every criterion scores 2 or 3, otherwise `needs work`. If only images
   changed, score criteria 9 and 10, write "n/a" for the others, and give the verdict from those
   two. The verdict is `not needed` followed by the reason only when both the text and the images
   are untouched, for example a file rename or a folder move.
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
| 11 | Help and failure screens | A screen whose id starts with `help-` opens with „Нисте ништа покварили.“, names one next action, offers the counter as a normal route where it applies, and gives no phone number. A step where the reader acts outside the guide and can get stuck has a failure answer that leads to a help screen or to the step to repeat. A set of changed screens with none of these scores 3. |
| 12 | Helper safety | `for-helper` carries every rule for using someone else's phone (sign out of email and eUprava, delete the ID-card photos); the screen where ID-card photos are taken (`prepare-id-photos`) repeats in one sentence that they are deleted afterwards, bin included; the password and PIN are always typed by the account holder. A set of changed screens with none of these scores 3. |
| 13 | Statistics carry a source | Every statistic or count about the world the reader sees (how many counters, accounts or users; percentages) has its year and source beside it. Numbers the reader acts on (PIN length, time limits, opening hours) come from the official site and need none. Nothing is claimed for people over 75. |

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
