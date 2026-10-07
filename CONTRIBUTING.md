# Contributing content

If you work with Claude Code, it reads `CLAUDE.md` automatically; this file is the longer version.

You do not need to know Astro or TypeScript. You need a text editor and `npm`.

## Add or change a screen

1. Pick an id: English, lowercase, words joined by hyphens, e.g. `have-id-card`.
2. Add the node to `content/graph.yaml`. Node types:
   - `question`: `title` and `answers` (two or more; each has `label` and `next`). Body is optional.
   - `step`: `title`, a body, and either one `next` (renders one "Даље" button) or `answers`.
     Optional `external: { label, url }` renders a big button that opens in a new tab.
   - `card`: `title`, a body, one `next`. Rendered full screen with a print button.
   - `end`: `title`, optional body, no edges.
   - Optional `group` on any node, a Cyrillic label like `Регистрација`, used for the progress line.
     Groups are numbered in the order they first appear in `graph.yaml`, so keep nodes in flow
     order; adding a new group in the middle renumbers the ones after it.
3. If the node has a body, create `content/nodes/<id>/index.md` and write it in Cyrillic Markdown.
   Put screenshots in the same folder and reference them as `![опис](./01-name.png)`. The alt text
   is read aloud by screen readers, so describe what is on the screenshot.
4. Run `npm run validate` for a quick check of the graph rules, then `npm run build`. A broken
   graph fails both and prints what is wrong.
5. Open a pull request. CI builds, tests, and runs an accessibility audit.

## Text that is not content

Fixed interface labels (Даље, Назад, Наставите где сте стали, ...) live in `content/ui-strings.yaml`.

If the automatic Latin transliteration gets a word wrong (a foreign name, for example), add a
whole-word override to `content/translit-overrides.yaml`:

```yaml
Гугл: Google
```

## Rules the build enforces

- Every `next` points to an existing node.
- Every node is reachable from `start`.
- `step` and `card` nodes have an `index.md`; every `index.md` folder has a node.
- Ids match `^[a-z0-9]+(-[a-z0-9]+)*$`.
- Node objects have no unknown keys; a typo in a key name fails the build.

## Note on the dev server

The content loader does not watch files. After editing `graph.yaml` or an `index.md`, restart
`npm run dev`.

## Manual check before the demo

On a real Android phone and a real iPhone:

1. Open the live URL, add it to the home screen, open it from the icon.
2. Complete one full path to the end.
3. Close the app, reopen from the icon, confirm "Наставите где сте стали" leads to the last screen.
4. Open a `card` screen, switch to Latin, use the print button (print to PDF is fine).
5. Turn on airplane mode and reopen a screen you already visited.
