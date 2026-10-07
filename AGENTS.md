# eGrađanin korak po korak — guide for coding agents and people

This repo is a static wizard site (Astro, GitHub Pages) that guides elderly, non-technical people
through getting a Serbian eUprava account and consent ID. Content authors on the team use Claude Code
or Codex in this repo to add and edit screens and open pull requests. Read this file first.
`CONTRIBUTING.md` has the long form; `docs/superpowers/specs/` has the design.

## Where content lives (the only files content work touches)

- `content/graph.yaml` — the wizard flow: nodes are screens, `answers` are the edges between them.
- `content/nodes/<id>/index.md` — one screen's body in Serbian Cyrillic Markdown, with its
  screenshots in the same folder, referenced as `![опис](./01-name.png)`.
- `content/ui-strings.yaml` — fixed interface labels such as Даље and Назад (rarely changed).
- `content/translit-overrides.yaml` — whole-word Cyrillic → Latin overrides for names the automatic
  transliteration gets wrong, for example `Гугл: Google` (rarely changed).

Do not edit `src/`, `tests/`, `.github/`, or config files for content work. If a screen needs a new
capability, describe it in the pull request instead of changing code.

## Node types

```yaml
start: welcome # id of the first screen

nodes:
  welcome: # step with one "Даље" button
    type: step
    title: Шта добијате као еГрађанин
    checked: 2026-10-07 # date the text was last checked against eUprava, YYYY-MM-DD
    group: Увод # optional; shown as "Увод · део 1 од 5"
    next: have-id-card

  have-id-card: # question; any number of answers, two or more
    type: question
    title: Да ли имате личну карту са чипом?
    checked: 2026-10-07
    group: Припрема
    answers:
      - { label: Да, next: have-email }
      - { label: Не, next: how-to-get-id-card }
      - { label: Нисам сигуран/на, next: check-id-card }

  register-euprava: # step that sends the user to another site
    type: step
    title: Направите налог на еУправи
    checked: 2026-10-07
    group: Регистрација
    external: { label: Отворите еУправу, url: https://euprava.gov.rs/ }
    answers:
      - { label: Урадио/ла сам, next: post-office-card }
      - { label: Нисам успео/ла, next: help-account }

  post-office-card: # card: large text to show or print at a counter
    type: card
    title: Покажите ово на шалтеру поште
    checked: 2026-10-07
    group: Пошта
    next: done

  done: # end: no edges
    type: end
    title: Честитамо, имате налог и ID за сагласност
    checked: 2026-10-07
```

Groups are numbered in the order they first appear in `graph.yaml`, so keep nodes in flow order;
adding a new group in the middle renumbers the ones after it.

Bodies: `step` and `card` need `content/nodes/<id>/index.md`; `question` and `end` may have one.

A node whose id starts with `help-` is a help screen: its body follows rule 28 of
`docs/writing-guide.md` (it opens with „Нисте ништа покварили.“, names one next action, never gives
a phone number), and an `end` help screen keeps the Назад button so the reader can retry. Every `step` with `external` needs
at least two answers, one of them for when the other site fails.

## Rules the build enforces

`npm run validate` (and CI on every pull request) fails with a list of what is wrong when:

- a `next` points to an id that is not in `nodes`,
- a node cannot be reached from `start`,
- a `step` or `card` has no `index.md`, or a folder under `content/nodes/` that contains an
  `index.md` has no node (a folder with only images is ignored),
- an id is not lowercase English words joined by hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`),
- a `question` has fewer than two answers, a `step` has both or neither of `next`/`answers`,
  an `end` has an edge, or a node has an unknown key,
- a node has no `checked` date, or it is not written `YYYY-MM-DD`, is not on the calendar, or is in
  the future (`checked-date`),
- a `step` with `external` has `next` or a single answer instead of at least two `answers` (a reader
  who leaves the guide can fail there and needs an answer that says so).

and, from the language check in the same command (`src/lib/language.ts`), when:

- a sentence in a body has more than 20 words (`sentence-length`),
- a word mixes Latin and Cyrillic letters, such as a Latin "o" inside a Cyrillic word (`scripts`),
- a gender slash form is not `реч/ла`, `реч/а` or `реч/на`, or `и/или` is used (`gender-form`),
- an image has no alt text, alt text equal to its file name, or under 3 words (`alt-text`),
- a title has more than 50 characters or an answer label more than 40 (`title-label-length`),
- a help screen (an id starting with `help-`) does not open with „Нисте ништа покварили.“ or gives
  a phone number (`help-screen`),
- a body, title, answer label or interface string uses a phrase from the fixed forbidden list in
  rule 29 of `docs/writing-guide.md`, such as „вратите се овде“ or „кликните“ (`terms`).

The same check prints warnings that do not fail the build: sentences over 15 words, paragraphs over
3 sentences, numbered steps with 3 or more sentences, screens over 150 words, bold spans over 4
words, a bold "Ово радите" or "Ово проверавате" banner instead of the blockquote callout, dashes
between numbers, double spaces, a space before punctuation, a `checked` date older than 6 months.
Fix them when you touch the screen.

CI also fails a pull request that changes `docs/terms.md` or `docs/writing-guide.md` without a
dated row in `docs/language-decisions.md` (`scripts/check-pr-language-review.mjs`).

## Writing rules

The standard is `docs/writing-guide.md` (Serbian, 33 rules with examples) and the words we use are
in `docs/terms.md`. Read both before writing or reviewing a screen. The checker reports these rule
ids, which are the ids in `docs/writing-guide.md`: `sentence-length, paragraph-length, one-action, screen-length, scripts, gender-form, alt-text, title-label-length, bold, callout, dates, punctuation, help-screen, terms, checked-date`.
In short:

- Titles, answer labels, and bodies are Serbian Cyrillic only. Latin pages are generated at build.
- Ids, folder names, and image file names are English, lowercase, hyphenated.
- Sentences of at most 20 words, one action per numbered step, imperatives addressed as "ви", at
  most 150 words per screen, 3 sentences per paragraph.
- One word for one thing, from `docs/terms.md`; every term explained where it first appears on
  that path, never in a glossary.
- A change to `docs/terms.md` or `docs/writing-guide.md` adds a dated row to
  `docs/language-decisions.md` (decision, reason, source, who decided, where it applies) in the same
  pull request.
- Numbers as digits; dates as "13. октобар 2026."; ranges as "од 9 до 18 часова".
- Gender forms as `успео/ла`, `пријављен/а`, `сигуран/на`; write "или", never "и/или".
- Bold only the word to tap or the thing to look for. The "where you do this" banner is a
  blockquote: `> Ово радите у формулару на сајту eid.gov.rs, не у водичу.`
- Every screenshot has alt text, at least 3 words, saying what to look for.
- Links to other sites in a body are plain Markdown links, `[сајту МУП-а](https://...)`. The build
  makes them open in a new tab; do not write HTML `<a>` tags.
- Keep `start:` pointing at the first screen. Tests and the accessibility audit pick representative
  screens from `graph.yaml` automatically, so content changes need no test changes.
- Every statistic or count about the world (counters, accounts, users, percentages) carries its year
  and source; numbers the reader acts on (PIN length, time limits, opening hours) need none; nothing
  is claimed for people over 75.
- When an eUprava step changes, fix the screen in the same pull request; when a step disappears,
  repoint every `next` to it, delete its node from `content/graph.yaml` and delete its folder. Never
  leave a stale screen with a note.
- Every node carries `checked: YYYY-MM-DD`, the date its text was last checked against eUprava; set
  it to today when you change the text.

## Language review before a pull request

Before opening or updating a pull request that changes anything under `content/`:

1. Run the language review. In Claude Code: `/language-review`. In any other tool: follow
   `docs/language-review.md` on the changed screens.
2. Paste its output, including the `Verdict:` line, under `## Language review` in the pull request
   description. CI fails a content pull request that has no verdict there.
3. If the verdict is "needs work", fix the screens and run the review again before asking for a
   merge.
4. If the pull request changes `docs/terms.md` or `docs/writing-guide.md`, add a dated row to
   `docs/language-decisions.md` in the same pull request. CI fails the pull request without it,
   whether or not `content/` changed.

## Workflow for a content change

1. `npm install` once (Node 22.12 or newer; 24 recommended).
2. Edit `content/`.
3. `npm run validate` — fast, prints every error the validator finds; fix schema errors first, then
   run it again for link and reachability errors.
4. `npm run build` — also required before opening a pull request; it catches a wrong image path or
   a Markdown problem that validate cannot see.
5. Optional: `npm run dev` and open http://localhost:4321/egradjanin-korak-po-korak/. Restart the
   dev server after editing `graph.yaml` or an `index.md` (the loader does not watch files).
6. Commit on a branch, push, run the language review (see above), paste its result into the pull
   request description, then open the pull request against `main`. CI builds, tests, and runs a
   mobile accessibility audit; a broken graph fails the check with the same message as step 3.
7. Merging to `main` deploys to https://ai-collective-serbia.github.io/egradjanin-korak-po-korak/ in
   about two minutes.

## Commands

| Command                              | What it does                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`                   | checks `content/` against every graph rule and the error-level language rules, in seconds; prints language warnings |
| `npm run dev`                        | local preview with the base path                                                                                    |
| `npm run build && npm run test:dist` | full build plus built-output checks (CI additionally runs format check, type check, unit tests, and Lighthouse)     |
| `npm test`                           | all unit tests, including the content check                                                                         |
