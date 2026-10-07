// Baseline language audit. Usage: node audit.mjs <repo-root> <out-dir>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const [repo, out] = process.argv.slice(2);
const require = createRequire(path.join(repo, 'package.json'));
const YAML = require('yaml');
const graph = YAML.parse(fs.readFileSync(path.join(repo, 'content/graph.yaml'), 'utf8'));
const order = Object.keys(graph.nodes);
const isDir = (id) => /^counter-list-[a-z]+$/.test(id);

const ABBR = ['бр', 'нпр', 'тзв', 'итд', 'Рег', 'рег', 'б.б', 'ул', 'др', 'сл', 'мин', 'тј'];
const NUMWORDS = ['један','једна','једно','једног','једном','једну','два','две','три','четири','пет','шест','седам','осам','девет','десет','двадесет','тридесет','четрдесет','педесет','сто','стотине','хиљаду','пола','једанпут','двапут','први','прва','прво','други','друга','друго','трећи','трећа','трећу','четврти'];
const words = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-.@#]*[\p{L}\p{N}]|[\p{L}\p{N}]/gu) || []);
const letters = (w) => (w.match(/\p{L}/gu) || []).length;
const lc = (s) => s.toLowerCase();

function splitSentences(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return [];
  const out = []; let start = 0;
  const re = /([.!?…])(["“”»]?)\s+(?=[„"«*(\p{Lu}\p{N}])/gu;
  let m;
  while ((m = re.exec(t))) {
    const before = t.slice(start, m.index);
    const lastTok = (before.match(/(\S+)$/) || ['', ''])[1];
    if (ABBR.some((a) => lastTok === a || lastTok.endsWith(' ' + a) || lastTok === a.split('.')[0])) continue;
    if (/^\d{1,2}$/.test(lastTok)) continue; // ordinal like "29. новембар"
    out.push(t.slice(start, m.index + 1 + m[2].length).trim());
    start = m.index + m[0].length;
  }
  out.push(t.slice(start).trim());
  return out.filter((s) => words(s).length);
}

function parseBody(md) {
  md = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  const alts = []; const headings = []; const units = []; // units: {kind:'prose'|'item'|'intro', para, text}
  const paras = []; const lists = [];
  md = md.replace(/<details>\s*<summary>(.*?)<\/summary>/g, (_, s) => { headings.push(s.trim()); return ''; }).replace(/<\/details>/g, '');
  const blocks = md.split(/\n\s*\n/);
  let pi = 0;
  for (let b of blocks) {
    b = b.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_, a) => { alts.push(a); return ''; });
    b = b.replace(/<a [^>]*>(.*?)<\/a>/g, '$1').replace(/<[^>]+>/g, '');
    b = b.replace(/\*\*/g, '').replace(/\\\*/g, '*').trim();
    if (!b) continue;
    if (/^#{1,6} /.test(b)) { headings.push(b.replace(/^#+ /, '')); continue; }
    const lines = b.split('\n');
    if (lines.every((l) => /^\s*([-*]|\d+\.)\s/.test(l) || /^\s{2,}\S/.test(l))) {
      let items = [];
      for (const l of lines) {
        if (/^\s*([-*]|\d+\.)\s/.test(l)) items.push({ text: l.replace(/^\s*([-*]|\d+\.)\s+/, ''), nested: /^\s{2,}/.test(l) });
        else items[items.length - 1].text += ' ' + l.trim();
      }
      lists.push(items.length);
      for (const it of items) for (const s of splitSentences(it.text)) units.push({ kind: 'item', para: null, text: s });
      continue;
    }
    const text = lines.join(' ');
    const ss = splitSentences(text);
    paras.push(ss.length);
    for (const s of ss) units.push({ kind: /:$/.test(s) ? 'intro' : 'prose', para: pi, text: s });
    pi++;
  }
  return { alts, headings, units, paras, lists };
}

const nodes = [];
for (const id of order) {
  const n = graph.nodes[id];
  const f = path.join(repo, 'content/nodes', id, 'index.md');
  const body = fs.existsSync(f) ? parseBody(fs.readFileSync(f, 'utf8')) : { alts: [], headings: [], units: [], paras: [], lists: [] };
  const labels = (n.answers || []).map((a) => a.label);
  if (n.external) labels.push(n.external.label);
  nodes.push({ id, type: n.type, title: n.title, labels, extLabel: n.external?.label, dir: isDir(id), ...body });
}
const prose = nodes.filter((n) => !n.dir);
const dirs = nodes.filter((n) => n.dir);

const stats = (arr) => { const a = [...arr].sort((x, y) => x - y); const n = a.length; if (!n) return { n: 0 }; return { n, mean: +(a.reduce((s, x) => s + x, 0) / n).toFixed(1), median: n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2, max: a[n - 1] }; };
const R = {}; const L = []; const log = (...x) => L.push(x.join(' '));

// sentences
const allS = []; for (const n of prose) for (const u of n.units) allS.push({ id: n.id, kind: u.kind, text: u.text, wc: words(u.text).length, para: u.para });
const sentLike = allS.filter((s) => s.kind !== 'item');
const wcAll = allS.map((s) => s.wc);
log('## OVERALL (prose population: ' + prose.length + ' nodes; directory nodes excluded: ' + dirs.length + ')');
log('units all', JSON.stringify(stats(wcAll)));
log('prose sentences (paragraph sentences incl. list intros)', JSON.stringify(stats(sentLike.map((s) => s.wc))));
log('list-item sentences', JSON.stringify(stats(allS.filter((s) => s.kind === 'item').map((s) => s.wc))));
const share = (arr, k) => (arr.filter((s) => s.wc > k).length + '/' + arr.length + ' = ' + (100 * arr.filter((s) => s.wc > k).length / arr.length).toFixed(1) + '%');
log('over 15 words (all units)', share(allS, 15)); log('over 20 words (all units)', share(allS, 20));
log('over 15 words (prose only)', share(sentLike, 15)); log('over 20 words (prose only)', share(sentLike, 20));
log('\n## PER NODE: id | units | prose | items | mean | median | max | bodyWords | headings | alts | altWords | paras(sentences each) | lists(items each)');
for (const n of prose) {
  const ss = allS.filter((s) => s.id === n.id); const st = stats(ss.map((s) => s.wc));
  n.bodyWords = ss.reduce((a, s) => a + s.wc, 0) + n.headings.reduce((a, h) => a + words(h).length, 0);
  n.altWords = n.alts.reduce((a, h) => a + words(h).length, 0);
  log([n.id, ss.length, ss.filter((s) => s.kind !== 'item').length, ss.filter((s) => s.kind === 'item').length, st.mean ?? '-', st.median ?? '-', st.max ?? '-', n.bodyWords, n.headings.length, n.alts.length, n.altWords, JSON.stringify(n.paras), JSON.stringify(n.lists)].join(' | '));
}
log('\n## 15 LONGEST UNITS');
for (const s of [...allS].sort((a, b) => b.wc - a.wc).slice(0, 15)) log(s.wc, s.id, s.kind, '::', s.text);
log('\n## SCREENS BY BODY WORDS (desc)');
for (const n of [...prose].sort((a, b) => b.bodyWords - a.bodyWords)) log(n.bodyWords, n.id, '(+alt', n.altWords + ')');
const allParas = prose.flatMap((n) => n.paras.map((p) => ({ id: n.id, p })));
log('\n## PARAGRAPHS', JSON.stringify(stats(allParas.map((x) => x.p))), '4+:', allParas.filter((x) => x.p >= 4).length, JSON.stringify(allParas.filter((x) => x.p >= 3)));
const allLists = prose.flatMap((n) => n.lists.map((p) => ({ id: n.id, p })));
log('## LISTS', JSON.stringify(stats(allLists.map((x) => x.p))), '6+ items:', JSON.stringify(allLists.filter((x) => x.p >= 6)));
// alt stats
const altAll = prose.flatMap((n) => n.alts.map((a) => ({ id: n.id, a, wc: words(a).length })));
log('## ALT TEXT', JSON.stringify(stats(altAll.map((x) => x.wc))));
for (const x of altAll.sort((a, b) => b.wc - a.wc).slice(0, 6)) log(x.wc, x.id, '::', x.a);

// long words
const bodyText = (n) => [...n.units.map((u) => u.text), ...n.headings].join(' ');
const tokAll = prose.flatMap((n) => words(bodyText(n)).map((w) => ({ id: n.id, w })));
const alpha = tokAll.filter((t) => letters(t.w) > 0);
const long = alpha.filter((t) => letters(t.w) >= 10);
log('\n## LONG WORDS (10+ letters):', long.length + '/' + alpha.length, (100 * long.length / alpha.length).toFixed(1) + '%');
const stem = (w) => lc(w).slice(0, Math.max(8, letters(w) - 3));
const grp = {}; for (const t of long) { const k = stem(t.w); (grp[k] ||= { n: 0, v: new Set(), nodes: new Set() }); grp[k].n++; grp[k].v.add(lc(t.w)); grp[k].nodes.add(t.id); }
for (const [k, g] of Object.entries(grp).sort((a, b) => b[1].n - a[1].n).slice(0, 35)) log(g.n, k + '…', [...g.v].join(','), '| nodes:', g.nodes.size);

// gender slash
const allTextUnits = [];
for (const n of nodes) {
  allTextUnits.push({ id: n.id, where: 'title', text: n.title });
  for (const l of n.labels) allTextUnits.push({ id: n.id, where: 'label', text: l });
  if (!n.dir) for (const u of n.units) allTextUnits.push({ id: n.id, where: 'body', text: u.text });
  if (!n.dir) for (const h of n.headings) allTextUnits.push({ id: n.id, where: 'heading', text: h });
}
const dirLabelsDup = (u) => u.where === 'label' && /^counter-list-/.test(u.id);
log('\n## GENDER SLASH FORMS (directory nodes\' repeated labels counted once)');
const gs = {}; const seenDir = new Set();
for (const u of allTextUnits) for (const m of u.text.matchAll(/\p{L}+\/\p{L}+/gu)) {
  if (dirLabelsDup(u)) { if (seenDir.has(m[0])) continue; seenDir.add(m[0]); }
  (gs[m[0]] ||= []).push(u.id + ':' + u.where);
}
for (const [k, v] of Object.entries(gs)) log(k, v.length, v.join(', '));
const dirGender = nodes.filter((n) => n.dir).flatMap((n) => n.labels).filter((l) => /\//.test(l)).length;
log('(raw count incl. all 24 directory nodes\' labels: ' + dirGender + ' extra)');

// numbers
log('\n## NUMBERS: digits');
for (const u of allTextUnits.filter((u) => u.where !== 'label' || !/^counter-list-/.test(u.id))) {
  const d = u.text.match(/\d[\d.,:–\-]*/g); if (d) log(u.id, u.where, JSON.stringify(d), '::', u.text);
}
log('## NUMBERS: words');
for (const u of allTextUnits) { const ws = words(u.text).filter((w) => NUMWORDS.includes(lc(w))); if (ws.length) log(u.id, u.where, JSON.stringify(ws), '::', u.text); }

// latin
log('\n## LATIN TOKENS by node (prose + titles + labels)');
const latByNode = {}; const latCount = {};
for (const u of allTextUnits) for (const w of words(u.text)) if (/[A-Za-z]/.test(w)) { (latByNode[u.id] ||= new Set()).add(w); latCount[w] = (latCount[w] || 0) + 1; }
for (const n of prose) for (const a of n.alts) for (const w of words(a)) if (/[A-Za-z]/.test(w)) (latByNode[n.id + ' (alt)'] ||= new Set()).add(w);
for (const [k, v] of Object.entries(latByNode)) log(k, ':', [...v].join(', '));
log('freq:', Object.entries(latCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + '=' + v).join(', '));
log('mixed-script tokens:', Object.keys(latCount).filter((w) => /[A-Za-z]/.test(w) && /[Ѐ-ӿ]/.test(w)).join(', '));
log('## DIRECTORY NODES: words, distinct Latin tokens, odd strings');
for (const n of dirs) {
  const raw = fs.readFileSync(path.join(repo, 'content/nodes', n.id, 'index.md'), 'utf8');
  const lat = new Set(words(raw.replace(/<[^>]+>/g, '')).filter((w) => /[A-Za-z]/.test(w)));
  const odd = raw.split('\n').filter((l) => /не ради не ради|,\S|\d{2}:\d{2} не ради/.test(l)).length;
  log(n.id, 'words=' + words(raw.replace(/<[^>]+>/g, ' ')).length, 'cities=' + n.headings.length, 'latin=' + [...lat].join('/'), 'oddLines=' + odd);
}

// concept / variant KWIC
const C = {
  'email': { 'имејл': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))имејл\p{L}*/giu, 'мејл': /(?<![\p{L}])мејл\p{L}*/giu, 'е-пошта': /е-пошт\p{L}*/giu, 'електронска пошта': /електронск\p{L}* пошт\p{L}*/giu, 'пошта (mailbox sense?)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))пошт\p{L}*/giu, 'Gmail': /gmail\S*/giu },
  'account': { 'налог': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))налог\p{L}*/giu, 'рачун': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))рачун(?!ар)\p{L}*/giu, 'профил': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))профил\p{L}*/giu },
  'id card': { 'лична карта': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))личн\p{L}* карт\p{L}*/giu, 'ЛК': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))ЛК(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/gu, 'картица': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))картиц\p{L}*/giu, 'документ': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))документ\p{L}*/giu },
  'web page / tab / this guide': { 'страна (page/side)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))стран(а|у|е|и|ом|ама)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'страница': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))страниц\p{L}*/giu, 'картица (tab?)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))картиц\p{L}*/giu, 'сајт': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сајт\p{L}*/giu, 'портал': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))портал\p{L}*/giu, 'водич': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))водич\p{L}*/giu, 'формулар': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))формулар\p{L}*/giu, 'образац': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))образ(а|ц)\p{L}*/giu, 'прозор': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))прозор\p{L}*/giu, 'екран': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))екран\p{L}*/giu },
  'button / icon': { 'дугме/дугмад': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))дугм\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))дугмад\p{L}*/giu, 'тастер': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))тастер\p{L}*/giu, 'сличица': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сличиц\p{L}*/giu, 'иконица/икона': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))икон\p{L}*/giu, 'квадратић': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))квадратић\p{L}*/giu, 'ставка': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))ставк\p{L}*/giu, 'линк': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))линк\p{L}*/giu },
  'tap verb': { 'притисн-/притиск-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))притис\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))притиск\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))притиснуо\p{L}*/giu, 'кликн-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))клик\p{L}*/giu, 'додирн-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))додир\p{L}*/giu, 'изабер-/бира-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))изабер\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))изабра\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))бира\p{L}*/giu, 'означ-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))означ\p{L}*/giu, 'отвор-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))отвор\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))отвара\p{L}*/giu },
  'write verb': { 'упиш-/уписа-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))упиш\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))уписа\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))уписуј\p{L}*/giu, 'унес-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))унес\p{L}*/giu, 'напиш-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))напиш\p{L}*/giu, 'препиш-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))препиш\p{L}*/giu, 'попун-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))попуњ\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))попун\p{L}*/giu, 'запиш-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))запиш\p{L}*/giu, 'смисли-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))смисл\p{L}*/giu },
  'photo': { 'фотографиј-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))фотографиј\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))фотографи\p{L}*/giu, 'слика (noun)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))слик(а|е|у|ом|ама|и)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'сликај-/сликате': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сликај\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сликате(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сликали(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'сличица': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сличиц\p{L}*/giu, 'илустрациј-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))илустрациј\p{L}*/giu, 'пример': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))пример\p{L}*/giu },
  'activate / turn on': { 'активир-/активац-/активан': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))актив\p{L}*/giu, 'укључ-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))укључ\p{L}*/giu, 'издај/издат': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))издај(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))издат\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))издав\p{L}*/giu },
  'sign in': { 'пријав-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))пријав\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))пријављ\p{L}*/giu, 'улаз-/уђ-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))улаз\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))уђ\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))улаз(ите|ићете)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'одјав-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))одјав\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))одјављ\p{L}*/giu },
  'secret': { 'лозинка': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))лозинк\p{L}*/giu, 'шифра': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))шифр\p{L}*/giu, 'ПИН': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))ПИН\p{L}*/gu },
  'counter / office': { 'шалтер': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))шалтер\p{L}*/giu, 'службеник': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))службеник\p{L}*/giu, 'полицијска станица/полиција': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))полициј\p{L}*/giu, 'МУП': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))МУП\p{L}*/gu },
  'confirmation': { 'потврд-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))потврд\p{L}*|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))потврђ\p{L}*/giu, 'одобр-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))одобр\p{L}*/giu, 'верификац-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))верифик\p{L}*|verifikacij\p{L}*/giu },
  'user id from counter': { 'ИД корисника': /ИД корисника/gu, 'кориснички ИД': /кориснички ИД/gu, 'број корисника': /број корисника/gu, 'регистрациони код': /регистрацион\p{L}* код\p{L}*/giu, 'QR код': /QR код\p{L}*/gu, 'два броја': /два броја/gu },
  'state portals': { 'еУправа': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))еУправ\p{L}*/gu, 'Портал еИД': /Портал\p{L}* еИД/gu, 'eid.gov.rs': /eid\.gov\.rs/giu, 'еИД (logo)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))еИД(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/gu, 'eUprava site words': /електронск\p{L}* управ\p{L}*/giu },
  'browser / app program': { 'прегледач': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))прегледач\p{L}*/giu, 'програм': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))програм\p{L}*/giu, 'браузер': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))браузер\p{L}*/giu, 'апликација': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))апликациј\p{L}*/giu, 'продавница': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))продавниц\p{L}*/giu },
  'cloud signature': { 'потпис у клауду': /потпис\p{L}* у клауду/giu, 'сертификат': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сертификат\p{L}*/giu, 'клауд': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))клауд\p{L}*/giu, 'читач': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))читач\p{L}*/giu },
  'registration': { 'регистр-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))регистр\p{L}*/giu, 'отворите налог / отвори- налог': /отвор\p{L}* налог|налог\p{L}* отвор\p{L}*/giu, 'направ- налог': /направ\p{L}* налог/giu },
  'helper person': { 'неко од породице или комшија': /неко\p{L}* од породице или комшија/giu, 'укућан': /укућан\p{L}*/giu, 'члан породице': /члан\p{L}* породице/giu },
  'phone': { 'телефон': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))телефон\p{L}*/giu, 'паметни телефон': /паметн\p{L}* телефон\p{L}*/giu, 'мобилн-': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))мобилн\p{L}*/giu, 'рачунар': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))рачунар\p{L}*/giu },
  'message': { 'порука': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))порук\p{L}*/giu, 'обавештење': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))обавешт\p{L}*/giu },
  'mailbox folder': { 'фасцикла': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))фасцикл\p{L}*/giu, 'Spam': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))spam(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'категорија': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))категориј\p{L}*/giu },
  'return here': { 'вратите се овде': /врати\p{L}* се овде/giu, 'вратите се на ову страну': /врати\p{L}* се на ову страну/giu, 'вратите се у (овај) водич': /врати\p{L}* се у (овај )?водич/giu, 'вратите се назад': /врати\p{L}* се назад/giu, 'вратите се (other)': /врати\p{L}* се(?! (овде|на ову|у овај|у водич|назад))/giu },
  'image disclaimer': { 'само пример': /само пример/giu, 'само илустрациј': /само илустрациј\p{L}*/giu, 'Није права': /није права/giu, 'не треба да притискате': /не треба да притискате/giu, 'наранџастом оквиру': /наранџаст\p{L}* оквиру/giu },
};
log('\n## CONCEPTS (counts over prose bodies+headings, titles, labels; directory label repeats counted once)');
const units2 = allTextUnits.filter((u) => !(dirLabelsDup(u) && u.id !== 'counter-list-a'));
const concept = {};
for (const [c, vars] of Object.entries(C)) {
  log('### ' + c); concept[c] = {};
  for (const [v, re] of Object.entries(vars)) {
    let n = 0; const ids = new Set(); const kw = [];
    for (const u of units2) { const m = u.text.match(re); if (m) { n += m.length; ids.add(u.id); kw.push(`  [${u.id}/${u.where}] ${m.join('|')} :: ${u.text}`); } }
    concept[c][v] = { n, nodes: [...ids] };
    log(`- ${v}: ${n} in ${ids.size} nodes: ${[...ids].join(', ')}`);
    if (process.env.KWIC) for (const k of kw) log(k);
  }
}

// imperatives
log('\n## -ИТЕ/-ЈТЕ FORMS (imperative or 2pl present; capitalised = sentence-initial)');
const imp = {}; for (const u of units2) for (const w of words(u.text)) if (/(ите|јте)$/u.test(lc(w)) && letters(w) > 4) { const k = lc(w); (imp[k] ||= { n: 0, init: 0, ids: new Set() }); imp[k].n++; if (/^\p{Lu}/u.test(w)) imp[k].init++; imp[k].ids.add(u.id); }
log(Object.entries(imp).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => `${k}=${v.n}(init ${v.init}, ${v.ids.size} nodes)`).join('; '));
log('## 2ND SINGULAR / OTHER PERSON CHECK');
for (const u of units2) { const ws = words(u.text).map(lc); const hits = ws.filter((w) => ['ти', 'тебе', 'теби', 'твој', 'твоја', 'твоје', 'твоју', 'уради', 'притисни', 'изабери', 'упиши', 'отвори', 'кликни', 'сачекај'].includes(w) || /(\p{L}{3,}(аш|иш))$/u.test(w) && !['ваш', 'наш'].includes(w)); if (hits.length) log('2sg?', u.id, u.where, hits.join(','), '::', u.text); }
for (const u of units2) if (/(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))(ми|ја|мој\p{L}*|сам|смо|ћу)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/u.test(lc(u.text)) && u.where === 'body') log('1st person in body:', u.id, '::', u.text);
for (const u of units2) if (/(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))В(ас|ам|аш\p{L}*|и)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/u.test(u.text)) log('capital Ви:', u.id, '::', u.text);
log('## LABEL VOICE');
const labelU = units2.filter((u) => u.where === 'label');
const voice = (t) => /(о|ла|ли|ао)\/\p{L}+ сам|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))сам(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))|(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))смо(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/u.test(t) ? '1st person (сам)' : /ћу(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))|\p{L}+ћу(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/u.test(t) ? '1st person future' : /^\p{L}+(ите|јте)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/u.test(t) ? 'imperative' : /^(Да|Не|Важи|Не важи)$/.test(t) ? 'yes/no' : /^\p{Lu}: /u.test(t) ? 'letter picker' : 'statement';
const vg = {}; for (const u of labelU) (vg[voice(u.text)] ||= []).push(`${u.text} [${u.id}]`);
for (const [k, v] of Object.entries(vg)) log(`${k} (${v.length}): ${v.join(' | ')}`);

// passive / impersonal
log('\n## PASSIVE / IMPERSONAL');
const PASS = { 'потребно/потребан је': /потреб\p{L}* (је|су)|(је|су) потреб\p{L}*/giu, 'неопходно': /неопходн\p{L}*/giu, 'мора(ју)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))мора(ју)?(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'биће/бити/буде + participle': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))(биће|бити|буде|бити)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'је/су + passive participle': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))(је|су)\s+\p{L}+(ан|ен|ет|ат|на|не|ни|но|та|то|ти)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'se-passive (се + 3rd p. verb)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))се\s+\p{L}+(а|и|е|у|ају|е)(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'impersonal "се" before verb (отвара се, деси се)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))\p{L}+(а|и|е)\s+се(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu, 'постоји/постоје': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))постој\p{L}*/giu, 'треба (impersonal)': /(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))треба(?:(?<![\p{L}\p{N}])(?=[\p{L}\p{N}])|(?<=[\p{L}\p{N}])(?![\p{L}\p{N}]))/giu };
for (const [k, re] of Object.entries(PASS)) { const ex = []; let n = 0; for (const u of units2.filter((u) => u.where !== 'label' || true)) { const m = u.text.match(re); if (m) { n += m.length; ex.push(`[${u.id}] ${m.join('|')} :: ${u.text}`); } } log(`- ${k}: ${n}`); for (const e of ex.slice(0, process.env.KWIC ? 999 : 6)) log('   ' + e); }

// negation & conditionals
log('\n## NEGATION / CONDITIONALS (prose units)');
const NEG = /^(не|нема|није|нису|нисте|нисам|ни|никад|никада|никоме|никако|ниједан|ниједну|ниједно|ништа|немате|немојте|нећете|не могу|неће)$/u;
const COND = /^(ако|уколико|осим|ли|док|чим|кад|када)$/u;
let neg2 = 0, cond2 = 0, negU = 0;
for (const s of allS) { const ws = words(s.text).map(lc); const nn = ws.filter((w) => NEG.test(w)).length; const cc = ws.filter((w) => ['ако', 'уколико', 'осим'].includes(w)).length; if (nn) negU++; if (nn >= 2) { neg2++; log('2+ neg', s.id, '::', s.text); } if (cc >= 2 || (cc && ws.includes('када'))) { cond2++; log('stacked cond', s.id, '::', s.text); } }
log('units with negation:', negU + '/' + allS.length, ' 2+ negations:', neg2, ' stacked conditionals:', cond2);
const condCount = {}; for (const s of allS) for (const w of words(s.text).map(lc)) if (COND.test(w)) condCount[w] = (condCount[w] || 0) + 1; log('conditional/temporal words:', JSON.stringify(condCount));

// abbreviations
log('\n## ABBREVIATIONS (first appearance in graph order; includes titles/labels/alt)');
const ab = {};
for (const n of nodes) { const texts = [n.title, ...n.labels, ...(n.dir ? [] : [...n.units.map((u) => u.text), ...n.headings, ...n.alts])]; for (const t of texts) for (const w of words(t)) { const core = w.replace(/[-’'].*$/, ''); if (/^[\p{Lu}]{2,6}$/u.test(core) || /^(cm|MB|ИД|QR|OK|еИД|ЛПА)$/u.test(core)) { (ab[core] ||= { first: null, firstText: '', n: 0, ids: new Set() }); ab[core].n++; ab[core].ids.add(n.id); if (!ab[core].first) { ab[core].first = n.id; ab[core].firstText = t; } } } }
for (const [k, v] of Object.entries(ab).sort((a, b) => b[1].n - a[1].n)) log(`${k}: n=${v.n}, nodes=${v.ids.size}, first=${v.first} :: ${v.firstText}`);

// titles and labels
log('\n## TITLES AND LABELS');
const tl = prose.map((n) => ({ id: n.id, t: n.title, w: words(n.title).length, c: n.title.length }));
log('titles words', JSON.stringify(stats(tl.map((x) => x.w))), 'chars', JSON.stringify(stats(tl.map((x) => x.c))));
for (const x of tl.sort((a, b) => b.c - a.c).slice(0, 6)) log(' ', x.c + 'ch', x.w + 'w', x.id, '::', x.t);
const lb = labelU.map((u) => ({ id: u.id, t: u.text, w: words(u.text).length, c: u.text.length }));
log('labels words', JSON.stringify(stats(lb.map((x) => x.w))), 'chars', JSON.stringify(stats(lb.map((x) => x.c))));
for (const x of lb.sort((a, b) => b.c - a.c).slice(0, 8)) log(' ', x.c + 'ch', x.w + 'w', x.id, '::', x.t);

// commas / clauses
log('\n## 3+ COMMAS OR 3+ SUBORDINATORS');
const SUB = ['који', 'која', 'које', 'коју', 'којим', 'којом', 'што', 'да', 'ако', 'када', 'док', 'јер', 'где', 'чим', 'уколико'];
for (const s of allS) { const c = (s.text.match(/,/g) || []).length; const sub = words(s.text).map(lc).filter((w) => SUB.includes(w)).length; if (c >= 3 || sub >= 3) log(`commas=${c} sub=${sub}`, s.id, '::', s.text); }

// duplicates / near duplicates
log('\n## REPEATED SENTENCES ACROSS NODES (exact)');
const dup = {}; for (const s of allS) (dup[s.text] ||= new Set()).add(s.id);
for (const [t, ids] of Object.entries(dup)) if (ids.size >= 2) log(ids.size, '::', t, '::', [...ids].join(', '));

fs.writeFileSync(path.join(out, process.env.KWIC ? 'output-kwic.txt' : 'output.txt'), L.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'concepts.json'), JSON.stringify(concept, null, 1));
console.log('ok', L.length);
