// Lighthouse CI config. URLs are derived from content/graph.yaml so replacing the sample content
// never breaks the audit. Representative pages: home, one question, one step with an external link,
// one card, and the Latin version of the question.
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('yaml');
const { base } = require('./site.config.mjs');

const origin = 'http://127.0.0.1:4321';
const prefix = `${origin}${base.endsWith('/') ? base : `${base}/`}`;
const graph = parse(fs.readFileSync(path.join(__dirname, 'content', 'graph.yaml'), 'utf8'));
const entries = Object.entries(graph.nodes);
const first = (pred) => (entries.find(([, n]) => pred(n)) || [])[0];
const question = first((n) => n.type === 'question');
const external = first((n) => n.type === 'step' && n.external);
const card = first((n) => n.type === 'card');

const url = [prefix];
if (question) url.push(`${prefix}step/${question}/`, `${prefix}lat/step/${question}/`);
if (external) url.push(`${prefix}step/${external}/`);
if (card) url.push(`${prefix}step/${card}/`);

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 30000,
      numberOfRuns: 1,
      url,
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
