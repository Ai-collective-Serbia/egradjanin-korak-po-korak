# eGrađanin korak po korak — guide for Claude Code sessions

This repo is a static wizard site (Astro, GitHub Pages) that guides elderly, non-technical people
through getting a Serbian eUprava account and consent ID. Content authors on the team use Claude Code
in this repo to add and edit screens and open pull requests. Read this file first. `CONTRIBUTING.md`
has the long form; `docs/superpowers/specs/` has the design.

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
    group: Увод # optional; shown as "Увод · део 1 од 5"
    next: have-id-card

  have-id-card: # question; any number of answers, two or more
    type: question
    title: Да ли имате личну карту са чипом?
    group: Припрема
    answers:
      - { label: Да, next: have-email }
      - { label: Не, next: how-to-get-id-card }
      - { label: Нисам сигуран/на, next: check-id-card }

  register-euprava: # step that sends the user to another site
    type: step
    title: Направите налог на еУправи
    group: Регистрација
    external: { label: Отворите еУправу, url: https://euprava.gov.rs/ }
    answers:
      - { label: Урадио/ла сам, next: post-office-card }
      - { label: Нисам успео/ла, next: help-contact }

  post-office-card: # card: large text to show or print at a counter
    type: card
    title: Покажите ово на шалтеру поште
    group: Пошта
    next: done

  done: # end: no edges
    type: end
    title: Честитамо, имате налог и ID за сагласност
```

Groups are numbered in the order they first appear in `graph.yaml`, so keep nodes in flow order;
adding a new group in the middle renumbers the ones after it.

Bodies: `step` and `card` need `content/nodes/<id>/index.md`; `question` and `end` may have one.

## Rules the build enforces

`npm run validate` (and CI on every pull request) fails with a list of what is wrong when:

- a `next` points to an id that is not in `nodes`,
- a node cannot be reached from `start`,
- a `step` or `card` has no `index.md`, or a folder under `content/nodes/` that contains an
  `index.md` has no node (a folder with only images is ignored),
- an id is not lowercase English words joined by hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`),
- a `question` has fewer than two answers, a `step` has both or neither of `next`/`answers`,
  an `end` has an edge, or a node has an unknown key.

## Writing rules

- Titles, answer labels, and bodies are Serbian Cyrillic only. Latin pages are generated at build.
- Ids, folder names, and image file names are English, lowercase, hyphenated.
- The reader is elderly and on a phone: short sentences, one action per step, numbered lists for
  anything done in order, bold only the word to tap or the thing to look for.
- Every screenshot has alt text that says what is on it; screen readers read it aloud.
- Keep `start:` pointing at the first screen. The sample screens are placeholders; replace them and
  delete sample folders you no longer reference.

## Workflow for a content change

1. `npm install` once (Node 22.12 or newer; 24 recommended).
2. Edit `content/`.
3. `npm run validate` — fast, prints every error the validator finds; fix schema errors first, then
   run it again for link and reachability errors.
4. `npm run build` — also required before opening a pull request; it catches a wrong image path or
   a Markdown problem that validate cannot see.
5. Optional: `npm run dev` and open http://localhost:4321/egradjanin-korak-po-korak/. Restart the
   dev server after editing `graph.yaml` or an `index.md` (the loader does not watch files).
6. Commit on a branch, push, open a pull request against `main`. CI builds, tests, and runs a
   mobile accessibility audit; a broken graph fails the check with the same message as step 3.
7. Merging to `main` deploys to https://filippetrovic.github.io/egradjanin-korak-po-korak/ in
   about two minutes.

## Commands

| Command                              | What it does                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `npm run validate`                   | checks `content/` against every rule above, in seconds                                                          |
| `npm run dev`                        | local preview with the base path                                                                                |
| `npm run build && npm run test:dist` | full build plus built-output checks (CI additionally runs format check, type check, unit tests, and Lighthouse) |
| `npm test`                           | all unit tests, including the content check                                                                     |
