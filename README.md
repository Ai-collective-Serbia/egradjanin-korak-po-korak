# еГрађанин корак по корак

A free, phone-first guide that takes a non-technical person from nothing to a working eUprava
account and consent ID. Static site, zero infrastructure cost, built for a community hackathon.

Live: https://filippetrovic.github.io/egradjanin-korak-po-korak/

## Run locally

Requires Node 22.12 or newer (24 recommended, see `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321/egradjanin-korak-po-korak/
npm run build     # static output in dist/
npm run preview   # serve dist/ at the same base path
```

## Checks

```bash
npm run validate      # fast check of content/ against every graph rule
npm run check         # TypeScript and .astro type errors
npm test              # unit tests for graph, transliteration, progress, paths, and the real content in content/
npm run build && npm run test:dist   # built-output checks
npm run lhci          # Lighthouse accessibility gate (needs Chrome)
npm run format:check
```

## How it works

- `content/graph.yaml` is the wizard: nodes are screens, answers are edges.
- `content/nodes/<id>/index.md` is a screen's body, with screenshots next to it.
- Content is written in Cyrillic. Latin pages are generated at build time.
- Every screen is its own URL, so back, refresh, and sharing a link all work.
- Progress is kept in the phone's local storage. Nothing leaves the device.

See `CONTRIBUTING.md` for adding content and `docs/superpowers/specs/` for the design.

## License

Apache 2.0.
