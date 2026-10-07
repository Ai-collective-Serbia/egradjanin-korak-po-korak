# Checked dates, read-aloud rule and screen trims (research group 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every screen a "checked on" date the validator watches, add the read-aloud writing rule, and bring the seven screens that exceed the 150-word cap under it by splitting four of them and trimming three.

**Architecture:** A required `checked: YYYY-MM-DD` field on every node in `content/graph.yaml`, validated by the Zod schema in `src/lib/graph.ts` and checked by a new `checked-date` rule in `src/lib/language.ts` (error when malformed or in the future, warning when older than 6 months). Writing rules 33 and 34 and review criterion 14 document the date and the read-aloud rule. The trims are pure content: `welcome` becomes three screens, `switch-tabs`, `register-upload` and `scan-qr-code` each become two, and `register-open`, `activate-consentid` and `find-counter` are shortened. Five new nodes join existing groups, so no group is added or reordered.

**Tech Stack:** Astro 7 static site, TypeScript, Zod, Vitest unit and built-output tests, Prettier, `astro check`.

**Spec:** `docs/research/2026-10-07-elderly-and-vulnerable-users.md` (action items E4, W1, W5) and the user's rulings of 2026-10-07: W1 is done here rather than handed to the content team; E5 and C9 are dropped; C7's full restructure was declined, so `welcome` keeps its content but is split, and the testers' "account versus app" point must survive.

## Global Constraints

- **Worktree and git.** `/Users/filip/IdeaProjects/egradjanin-korak-po-korak/.claude/worktrees/research+elderly-vulnerable-users`, branch `research/elderly-vulnerable-users`. **Always `/usr/bin/git`**, never `git`. No shell globs. Never `cd` to the parent repo. Move images with `/usr/bin/git mv`.
- **Writing rules apply to every Cyrillic string.** `docs/writing-guide.md` (32 rules today) and `docs/terms.md`. Sentences of at most 20 words (aim 15), at most 150 words per screen (headings count, alt text does not), at most 3 sentences per paragraph, fewer than 3 sentences per numbered step, imperatives with „ви“, bold only what is tapped or looked for, digits for numbers (except „један/једна“), gender forms as `успео/ла`, titles at most 50 characters, labels at most 40. A browser tab is „картица“; the browser is „прегледач“; the ID card is „лична карта“; a help screen is only an id starting with `help-`.
- **Screens stand alone (rule 22).** When a split moves information to another screen, the screen that needs it repeats it in a sentence; it never says "as on the previous screen".
- **Verified claims only.** Do not add any eUprava claim that is not already in the current bodies.
- **Every content change leaves a rule.** The 150-word cap and the `checked-date` rule are the rules for this plan; the review rubric covers the read-aloud rule.
- **CI gates.** `content/` and `docs/` are prettier-ignored; `src/` and `tests/` are not: run `npm run format` and `npm run check` before any commit touching them. A change to `docs/terms.md` or `docs/writing-guide.md` needs a dated row in `docs/language-decisions.md` (English, newest first; next number D28). A pull request that changes `content/` needs a `## Language review` block with a `Verdict:` line.
- **No new dependencies, no backend.** Nothing under `.github/`.
- **Out of scope.** Screenshot staleness (the `checked` date covers text only), E5, C9, the switch-tabs images' content, and any screen not named here.

## Review Focus

1. **Every node must carry `checked`.** Adding the field to about 70 nodes by hand invites a miss; `npm run validate` fails on the first node without it, and Task 1 pins it with a schema test. New nodes in Tasks 3 to 5 must include it too.
2. **The 6-month warning must not fire today and must fire later.** Pinned by unit tests with a fixed "today" in Task 1.
3. **Progress labels must not change.** The five new nodes sit inside existing groups; Task 6 checks that `welcome` still reads „Увод · део 1 од 5“ and `scan-qr-result` „Апликација ConsentID · део 5 од 5“.
4. **Saved progress must survive the split.** A returning reader whose saved node is `welcome` or `scan-qr-code` must still land on a valid screen; no id is removed, so this holds. Pinned by `npm run validate` (no missing node) in each task.
5. **Moved images must resolve.** `npm run build` fails on a missing image; Tasks 4 and 5 run it.

---

### Task 1: The `checked` date on every screen (E4)

**Files:**

- Modify: `src/lib/graph.ts` (schema `common`), `src/lib/language.ts` (`LIMITS`, `RULE_IDS`, `checkGraphText`), `content/graph.yaml` (every node)
- Modify: `src/lib/graph.test.ts`, `src/lib/language.unit.test.ts` (fixtures and new tests)
- Modify: `docs/writing-guide.md` (rule 33), `AGENTS.md` (node types, enforced rules, rule-id list, rule count), `docs/language-decisions.md` (D28)
- Test: `npm test`, `npm run validate`

**Interfaces:**

- Produces: `checked: string` (YYYY-MM-DD) required on every node; `LIMITS.checkedMonths = 6`; `checkGraphText(graph, today = new Date())`; rule id `checked-date`.

- [ ] **Step 1: Write the failing tests**

In `src/lib/graph.test.ts`, add `checked: 2026-10-07` as a line directly after every `title:` line of the `VALID` fixture (six nodes), and add inside `describe('parseGraph', ...)`:

```ts
  it('requires a checked date on every node, as YYYY-MM-DD', () => {
    expect(() => parseGraph(VALID.replace('    checked: 2026-10-07\n    group: Пошта\n', '    group: Пошта\n'))).toThrow();
    expect(() => parseGraph(VALID.replace('checked: 2026-10-07\n    group: Пошта', 'checked: 7.10.2026\n    group: Пошта'))).toThrow();
  });
```

In `src/lib/language.unit.test.ts`, add `checked: 2026-10-07` after every `title:` line in the two inline `parseGraph(\`…\`)` fixtures (around lines 142 and 297), add `checkGraphText` is already imported, and append:

```ts
describe('checked date (rule 33, checked-date)', () => {
  const graphWith = (checked: string) =>
    parseGraph(`
start: a
nodes:
  a:
    type: end
    title: Крај
    checked: ${checked}
`);
  const today = new Date('2026-10-07T12:00:00Z');

  it('is quiet for a date within the last 6 months', () => {
    expect(rules(checkGraphText(graphWith('2026-10-07'), today))).toEqual([]);
    expect(rules(checkGraphText(graphWith('2026-04-08'), today))).toEqual([]);
  });

  it('warns when the date is older than 6 months', () => {
    const findings = checkGraphText(graphWith('2026-04-06'), today);
    expect(rules(findings)).toEqual(['warning:checked-date']);
    expect(findings[0].message).toContain('2026-04-06');
    expect(findings[0].message).toContain('"a"');
  });

  it('errors on a date in the future or not on the calendar', () => {
    expect(rules(checkGraphText(graphWith('2026-10-08'), today))).toEqual(['error:checked-date']);
    expect(rules(checkGraphText(graphWith('2026-02-30'), today))).toEqual(['error:checked-date']);
  });
});
```

Run: `npx vitest run src/lib/graph.test.ts src/lib/language.unit.test.ts`
Expected: FAIL (schema accepts a node without `checked`; `checkGraphText` takes one argument and emits nothing).

- [ ] **Step 2: Schema and rule**

In `src/lib/graph.ts`, change `common` to:

```ts
const common = {
  title: z.string().min(1),
  /** Date the screen's text was last checked against eUprava, YYYY-MM-DD (rule 33). */
  checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'checked is a date written YYYY-MM-DD'),
  group: z.string().min(1).optional(),
};
```

In `src/lib/language.ts`: add `checkedMonths: 6,` to `LIMITS`; add `'checked-date',` to the end of `RULE_IDS`; change the signature to `export function checkGraphText(graph: Graph, today: Date = new Date()): Finding[]` and, inside the node loop after the gender-form check, add:

```ts
    const [y, m, d] = node.checked.split('-').map(Number);
    const checked = new Date(Date.UTC(y, m - 1, d));
    const onCalendar =
      checked.getUTCFullYear() === y && checked.getUTCMonth() === m - 1 && checked.getUTCDate() === d;
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    if (!onCalendar || checked.getTime() > todayUtc) {
      push(
        'checked-date',
        `"${id}" has checked: ${node.checked}, which is not a past date on the calendar`,
        node.checked,
      );
    } else {
      const limit = new Date(todayUtc);
      limit.setUTCMonth(limit.getUTCMonth() - LIMITS.checkedMonths);
      if (checked.getTime() < limit.getTime()) {
        findings.push({
          file,
          line: 0,
          rule: 'checked-date',
          severity: 'warning',
          message: `"${id}" was last checked on ${node.checked}, more than ${LIMITS.checkedMonths} months ago; walk the screen against eUprava and update "checked"`,
          excerpt: node.title,
        });
      }
    }
```

(`push` in `checkGraphText` already creates an error-level finding.)

- [ ] **Step 3: Add `checked: 2026-10-07` to every node in `content/graph.yaml`**

Every node's second key is `title:`. Insert the date directly after it. Write this script to the scratchpad and run it with `node`:

```js
// add-checked.mjs — insert "checked: 2026-10-07" after every node title in content/graph.yaml
import { readFileSync, writeFileSync } from 'node:fs';
const file = 'content/graph.yaml';
const lines = readFileSync(file, 'utf8').split('\n');
const out = [];
for (let i = 0; i < lines.length; i++) {
  out.push(lines[i]);
  if (/^    title: /.test(lines[i]) && !/^    checked: /.test(lines[i + 1] ?? '')) {
    out.push('    checked: 2026-10-07');
  }
}
writeFileSync(file, out.join('\n'));
```

Run: `node /path/to/scratchpad/add-checked.mjs` from the worktree root, then `grep -c "^    checked: 2026-10-07" content/graph.yaml` and `grep -c "^    title: " content/graph.yaml`.
Expected: the two counts are equal. The content was walked on a phone in the public testing round on 2026-10-07, which is why that date is honest for every screen today.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/lib/graph.test.ts src/lib/language.unit.test.ts && npm run validate`
Expected: PASS; validate 0 errors and no `checked-date` warning. `language-docs.test.ts` will FAIL until Step 5 adds `(checked-date)` to the guide.

- [ ] **Step 5: Docs**

`docs/writing-guide.md`, inside `## Одржавање` after rule 32:

```markdown
33. **Датум провере** (checked-date). Сваки екран у `content/graph.yaml` има `checked: ГГГГ-ММ-ДД`,
    датум када је текст екрана последњи пут проверен на самом сајту eid.gov.rs или у апликацији.
    Кад мењате текст екрана, ставите данашњи датум. Провера јавља грешку за датум који није на
    календару или је у будућности, а упозорење кад је старији од 6 месеци: тада екран треба
    поново проћи на телефону. Датум се односи на текст, не на слике.
```

`AGENTS.md`: in the node-types YAML sample add `checked: 2026-10-07 # date the text was last checked against eUprava, YYYY-MM-DD` after the `title:` line of the first node (`welcome`) and a plain `checked: 2026-10-07` after every other sample node's `title:`; in "Rules the build enforces" add a graph bullet „a node has no `checked` date, or it is not written `YYYY-MM-DD`, is not on the calendar, or is in the future (`checked-date`),“ and in the warnings sentence add „a `checked` date older than 6 months“; change "32 rules with examples" to "33 rules with examples" and append `checked-date` to the rule-id list; in the "In short" list add „- Every node carries `checked: YYYY-MM-DD`, the date its text was last checked against eUprava; set it to today when you change the text.“

`docs/language-decisions.md`, insert above D27:

```markdown
| D28 | 2026-10-07 | Every node in `content/graph.yaml` carries `checked: YYYY-MM-DD`, the date its text was last checked against eUprava; the validator fails a missing, malformed, non-calendar or future date and warns when it is older than 6 months. The date covers text, not screenshots. | GOV.UK keeps content correct with per-page review dates; the retire-step rule (32) needs a trigger that does not rely on someone remembering. The public testing round of 2026-10-07 walked every screen, so that date is honest for all of them today. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, item E4 | Filip | `src/lib/graph.ts`, `src/lib/language.ts`, `content/graph.yaml`, `docs/writing-guide.md` rule 33, `AGENTS.md` |
```

- [ ] **Step 6: Everything, then commit**

Run: `npm run format && npm run check && npm test && npm run validate && npm run build && npm run test:dist`
Expected: all PASS.

```bash
/usr/bin/git add src/lib/graph.ts src/lib/language.ts src/lib/graph.test.ts src/lib/language.unit.test.ts content/graph.yaml docs/writing-guide.md AGENTS.md docs/language-decisions.md
/usr/bin/git commit -m "feat: every screen carries a checked date; validator warns after 6 months"
```

---

### Task 2: The read-aloud rule (W5)

**Files:**

- Modify: `docs/writing-guide.md` (rule 34), `docs/language-review.md` (criterion 14, count), `.claude/skills/language-review/SKILL.md` ("thirteen" → "fourteen" twice), `AGENTS.md` ("33 rules" → "34 rules"), `docs/language-decisions.md` (D29)
- Test: `npm test` (`language-docs.test.ts`), the grep below

- [ ] **Step 1: Rule 34**

`docs/writing-guide.md`, after rule 33 inside `## Одржавање`:

```markdown
34. **Читање наглас** (read-aloud). Помагач који седи поред читаоца мора да прочита цео екран
    наглас за мање од једног минута. То држе правила 1, 19 и 20: кратке реченице, до 150 речи,
    нумерисани кораци. Екран типа `card` пише се у првом лицу, као порука коју читалац даје
    службенику: „Молим вас…“, као на екрану `counter-card`.
```

- [ ] **Step 2: Criterion 14 and counts**

`docs/language-review.md`: add after row 13 `| 14 | Read-aloud and card voice | A helper can read the screen aloud in under a minute (short sentences, at most 150 words, numbered steps); a `card` body is written in the first person as the reader's message to the clerk. A set of changed screens with no card scores this on length alone. |` and change "Score each of the 13 criteria below" to "Score each of the 14 criteria below".

`.claude/skills/language-review/SKILL.md`: "thirteen" → "fourteen" in the description and in step 5.

`AGENTS.md`: "33 rules with examples" → "34 rules with examples".

`docs/language-decisions.md`, insert above D28:

```markdown
| D29 | 2026-10-07 | A helper must be able to read any screen aloud in under a minute; `card` screens are written in the first person as the reader's message to the clerk (rule 34, criterion 14). | Every programme with measured results for older people paired content with a human helper (NOS 2023; Be Connected 2020); Red Cross volunteers read screens aloud in trainings. `counter-card` already follows this. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, item W5 | Filip | `docs/writing-guide.md` rule 34; `docs/language-review.md` criterion 14 |
```

- [ ] **Step 3: Verify and commit**

Run: `npm test && grep -n "33 rules\|thirteen\|13 criteria" AGENTS.md docs/language-review.md .claude/skills/language-review/SKILL.md`
Expected: tests PASS; grep prints nothing.

```bash
/usr/bin/git add docs/writing-guide.md docs/language-review.md .claude/skills/language-review/SKILL.md AGENTS.md docs/language-decisions.md
/usr/bin/git commit -m "docs: read-aloud rule 34 and review criterion 14"
```

---

### Task 3: Split `welcome` into three screens; trim `register-open` and `activate-consentid` (W1, part 1)

**Files:**

- Modify: `content/graph.yaml` (`welcome`; two new nodes after it)
- Modify: `content/nodes/welcome/index.md`, `content/nodes/register-open/index.md`, `content/nodes/activate-consentid/index.md`
- Create: `content/nodes/what-you-can-do/index.md`, `content/nodes/account-and-app/index.md`
- Test: `npm run validate`, `npm run build`

**Interfaces:**

- Consumes: `checked` is required on every node (Task 1).
- Produces: `welcome` → `what-you-can-do` → `account-and-app` → the two existing answers.

- [ ] **Step 1: Graph**

Replace the `welcome` node with these three (all in group Увод, so the progress label stays „Увод · део 1 од 5“):

```yaml
  welcome:
    type: step
    title: Постаните еГрађанин
    checked: 2026-10-07
    group: Увод
    next: what-you-can-do

  what-you-can-do:
    type: step
    title: Шта све можете са налогом
    checked: 2026-10-07
    group: Увод
    next: account-and-app

  account-and-app:
    type: step
    title: Налог и апликација нису исто
    checked: 2026-10-07
    group: Увод
    answers:
      - label: Почните регистрацију
        next: what-you-need
      - label: Већ имам налог
        next: have-smartphone
```

- [ ] **Step 2: `content/nodes/welcome/index.md`** (keep the banner image line exactly as it is now; replace everything after it):

```markdown
Послове са државом завршите од куће, са телефона или рачунара. Потребан вам је само један бесплатан налог.

## Зашто да се региструјете

- **Без чекања у реду.** Захтеве шаљете од куће. Термин у полицијској станици бирате сами, у календару.
- **Један налог за све.** Истим налогом се пријављујете на еУправу, еЗдравље, Портал ЛПА за порез и есДневник.
- **Документа стижу вама.** Изводи, уверења и решења стижу у ваше еСандуче (јединствено електронско сандуче за документа од државе).
- **Мање папира.** Уз захтев за извод не прилажете ниједан документ.
- **Бесплатно је.** Регистрација и апликација ConsentID се не плаћају.

Шта све можете са налогом, видите на следећем екрану. Притисните **Даље**.
```

- [ ] **Step 3: `content/nodes/what-you-can-do/index.md`**

```markdown
Ово су само неки од послова које завршавате од куће, са налогом за еУправу.

- **Лична документа:** закажите термин за личну карту или пасош, за себе и до 4 члана породице.
- **Изводи и уверења:** извод из матичне књиге рођених, венчаних или умрлих стиже у еСандуче. Можете тражити и уверење о држављанству и о пребивалишту.
- **Деца и школа:** пријавите дете у вртић без папира. Пратите оцене и изостанке у есДневнику.
- **Здравље:** закажите преглед код свог лекара. Погледајте налазе и рецепте.
- **Порез:** проверите порез на имовину и платите га преко интернета.

И још стотине других услуга. Притисните **Даље**.
```

- [ ] **Step 4: `content/nodes/account-and-app/index.md`**

```markdown
Пут до еГрађанина има 2 дела. Прво направите налог, па тек онда активирајте апликацију.

- **Налог** су ваш имејл и лозинка. Правите га од куће, уз фотографију личне карте или пасоша. Активира се најкасније за 48 сати.
- **Апликација ConsentID** је додатак уз налог. Активирате је једном, QR кодом који добијете на шалтеру. Тек са њом добијате изводе, уверења и еСандуче.
- **Потпис у клауду** није обавезан. Њиме потписујете документа на телефону, без посебног уређаја.

Са самим налогом већ можете да закажете термин за личну карту и да проверите порез.

## Одакле да почнете

Немате налог? Притисните **Почните регистрацију**.

Већ имате налог на еУправи? Притисните **Већ имам налог**.
```

- [ ] **Step 5: Trim `register-open`**

In `content/nodes/register-open/index.md`, delete the section from the heading `## Како да прелазите између водича и формулара` through its numbered list (the heading, the „Ово пише на почетку водича…“ line and the three steps), and in its place put one paragraph:

```markdown
Како да прелазите између картица, пише на екрану „Како да прелазите између картица“, на почетку водича.
```

Keep everything else (callout, first two paragraphs, „Како да знате где сте“, the image, the closing line).

- [ ] **Step 6: Trim `activate-consentid`**

In `content/nodes/activate-consentid/index.md`, delete the last paragraph „На следећем екрану скенирате QR код са потврде.“ Nothing else changes.

- [ ] **Step 7: Validate and build**

Run: `npm run validate`
Expected: 0 errors; no `screen-length` warning on `welcome`, `what-you-can-do`, `account-and-app`, `register-open` or `activate-consentid`; no other new warning on them. If one appears, make the smallest cut that clears it and name it in the report.

Run: `npm run build`
Expected: success.

- [ ] **Step 8: Commit**

```bash
/usr/bin/git add content/graph.yaml content/nodes/welcome/index.md content/nodes/what-you-can-do/index.md content/nodes/account-and-app/index.md content/nodes/register-open/index.md content/nodes/activate-consentid/index.md
/usr/bin/git commit -m "content: welcome becomes three short screens; register-open and activate-consentid under the word cap"
```

---

### Task 4: Split `switch-tabs`; trim `find-counter` (W1, part 2)

**Files:**

- Modify: `content/graph.yaml` (`switch-tabs` next; new node `find-tabs-button` after it)
- Modify: `content/nodes/switch-tabs/index.md`, `content/nodes/find-counter/index.md`
- Create: `content/nodes/find-tabs-button/index.md`
- Move: `content/nodes/switch-tabs/tabs-iphone-chrome.jpg`, `tabs-iphone-safari.jpg`, `tabs-android-chrome.jpg` → `content/nodes/find-tabs-button/`
- Test: `npm run validate`, `npm run build`

- [ ] **Step 1: Graph**

Change `switch-tabs` to `next: find-tabs-button` and add directly after it:

```yaml
  find-tabs-button:
    type: step
    title: Где је дугме са квадратићима
    checked: 2026-10-07
    group: Припрема
    next: have-id-card
```

- [ ] **Step 2: Move the three images**

```bash
mkdir -p content/nodes/find-tabs-button
/usr/bin/git mv content/nodes/switch-tabs/tabs-iphone-chrome.jpg content/nodes/find-tabs-button/tabs-iphone-chrome.jpg
/usr/bin/git mv content/nodes/switch-tabs/tabs-iphone-safari.jpg content/nodes/find-tabs-button/tabs-iphone-safari.jpg
/usr/bin/git mv content/nodes/switch-tabs/tabs-android-chrome.jpg content/nodes/find-tabs-button/tabs-android-chrome.jpg
```

`tabs-overview.jpg` stays in `switch-tabs`.

- [ ] **Step 3: `content/nodes/switch-tabs/index.md`** (keep the `tabs-overview.jpg` image line exactly as it is):

```markdown
Ово је важно да знате пре него што почнете. Мало вежбе сада ће вам много олакшати касније.

## Шта је картица

Нека дугмад у овом водичу отварају **други сајт**, на пример сајт за регистрацију. Тај сајт се отвара у **новој картици**.

Водич се **не затвара**. Остаје отворен у својој картици, као два листа папира један испод другог. На једном читате упутство, на другом попуњавате формулар.

![Илустрација: две отворене картице једна поред друге; лево водич еГрађанин корак по корак где читате, десно сајт eid.gov.rs где пишете](./tabs-overview.jpg)

## Како да пређете са једне на другу

1. Притисните дугме са квадратићима, на дну или на врху екрана.
2. Видећете све отворене картице, као мале слике.
3. Притисните ону која вам треба:
   - **еГрађанин корак по корак** је овај водич,
   - **eid.gov.rs** или други сајт је место где нешто попуњавате.

Тако можете да идете напред и назад колико год пута треба. Ништа се неће изгубити.

Где је то дугме на вашем телефону, видите на следећем екрану. Притисните **Даље**.
```

- [ ] **Step 4: `content/nodes/find-tabs-button/index.md`**

```markdown
Где је дугме са квадратићима, зависи од телефона. Зависи и од прегледача (програма у ком отварате сајтове, на пример Chrome или Safari).

**iPhone, Chrome:** доле, квадратић са бројем. Број показује колико је картица отворено.

![Пример: доња трака у програму Chrome на iPhone-у; заокружен је квадратић са бројем 33](./tabs-iphone-chrome.jpg)

**iPhone, Safari:** доле десно, 2 квадратића један преко другог.

![Илустрација: доња трака у програму Safari на iPhone-у; заокружена су 2 квадратића доле десно](./tabs-iphone-safari.jpg)

**Android телефон, Chrome:** горе десно, поред адресе, квадратић са бројем.

![Илустрација: горња трака у програму Chrome на Android телефону; заокружен је квадратић са бројем поред адресе](./tabs-android-chrome.jpg)

Ако не налазите дугме, замолите неког од породице или комшија да вам покаже једном. После ћете знати сами. Притисните **Даље**.
```

- [ ] **Step 5: Trim `find-counter`**

In `content/nodes/find-counter/index.md`: delete the section `## Како да нађете шалтер у свом месту` with its two paragraphs (the answer buttons say the same), and change „Сачувајте потврду, требаће вам у следећем кораку.“ to „Сачувајте је.“ Everything else stays.

- [ ] **Step 6: Validate, build, commit**

Run: `npm run validate && npm run build`
Expected: 0 errors; no `screen-length` warning on `switch-tabs`, `find-tabs-button` or `find-counter`; build succeeds (the moved images resolve).

```bash
/usr/bin/git add content/graph.yaml content/nodes/switch-tabs content/nodes/find-tabs-button content/nodes/find-counter/index.md
/usr/bin/git commit -m "content: the tab button gets its own screen; find-counter under the word cap"
```

---

### Task 5: Split `register-upload` and `scan-qr-code` (W1, part 3)

**Files:**

- Modify: `content/graph.yaml` (`register-open` answer target; new `upload-menu` before `register-upload`; `scan-qr-code` next; new `scan-qr-result` after it)
- Modify: `content/nodes/register-upload/index.md`, `content/nodes/scan-qr-code/index.md`
- Create: `content/nodes/upload-menu/index.md`, `content/nodes/scan-qr-result/index.md`
- Move: `content/nodes/register-upload/upload-menu.jpg` → `content/nodes/upload-menu/upload-menu.jpg`
- Test: `npm run validate`, `npm run build`

- [ ] **Step 1: Graph**

In `register-open`, change the answer „Видим формулар“ to `next: upload-menu`. Insert before `register-upload`:

```yaml
  upload-menu:
    type: step
    title: Шта пише у менију за фотографије
    checked: 2026-10-07
    group: Регистрација
    next: register-upload
```

Change `scan-qr-code` from its two answers to `next: scan-qr-result`, and insert directly after it:

```yaml
  scan-qr-result:
    type: step
    title: Проверите да ли је успело
    checked: 2026-10-07
    group: Апликација ConsentID
    answers:
      - label: Апликација је активирана
        next: cloud-certificate
      - label: Нисам успео/ла
        next: help-account
```

- [ ] **Step 2: Move the menu image**

```bash
mkdir -p content/nodes/upload-menu
/usr/bin/git mv content/nodes/register-upload/upload-menu.jpg content/nodes/upload-menu/upload-menu.jpg
```

- [ ] **Step 3: `content/nodes/upload-menu/index.md`**

```markdown
Када у формулару притиснете **Приложите документа**, отвори се мали мени. Из њега бирате фотографије које сте већ направили. Натписи зависе од телефона и од језика на телефону.

![Пример: мени који се отвори после притиска на дугме, на енглеском: Photo Library, Take photo, Choose File и Google Drive](./upload-menu.jpg)

**На iPhone-у:**

- **Фототека** (на енглеском **Photo Library**): фотографије које сте већ направили. Ово изаберите.
- **Сликај** (на енглеском **Take photo**): сликате личну карту сада.
- **Изабери фајл** (на енглеском **Choose File**) и **Google Drive**: не треба вам.

**На Android телефону:**

- **Галерија** или **Фотографије**: фотографије које сте већ направили. Ово изаберите.
- **Камера**: сликате личну карту сада.
- **Фајлови** или **Датотеке**: не треба вам.

Слика је само пример. На следећем екрану то урадите у формулару. Притисните **Даље**.
```

- [ ] **Step 4: `content/nodes/register-upload/index.md`** (keep the callout, the first three paragraphs and the `upload-button.jpg` image line as they are; replace the rest):

```markdown
У формулару урадите ово:

1. Притисните дугме **Приложите документа**.
2. Отвориће се мали мени. Притисните **Фототека** или **Галерија**, где су фотографије које сте већ направили.
3. Притисните фотографију **предње** стране личне карте.
4. Поново притисните **Приложите документа**.
5. Изаберите фотографију **задње** стране.

Када приложите обе фотографије, испод дугмета видите њихове називе.

Ако се региструјете пасошем, приложите само страну са својом сликом.

Када завршите, вратите се у водич на исти начин и притисните **Приложио/ла сам фотографије**.
```

(The deleted parts are: the „Слика испод је само пример како изгледа мени…“ paragraph, the `upload-menu.jpg` image, and the whole `## Шта пише у менију` section.)

- [ ] **Step 5: `content/nodes/scan-qr-code/index.md`** (keep the callout, `## Шта је QR код` with its image, and `## Скенирајте QR код` with its seven steps and image, all exactly as they are; delete `## Како знате да је успело`, `## Ако скенирање не успе` and the closing „Када је апликација активирана…“ paragraph; add at the end):

```markdown
Шта видите када успе, пише на следећем екрану. Притисните **Даље**.
```

- [ ] **Step 6: `content/nodes/scan-qr-result/index.md`**

```markdown
> Ово радите у апликацији ConsentID на телефону, не у водичу.

## Како знате да је успело

На екрану се појаве **име**, **презиме** и **ИД корисника** (први број са потврде са шалтера). То значи да је апликација активирана. Притисните **Апликација је активирана**.

## Ако скенирање не успе

- Упалите светло и пазите да на папиру нема сенке.
- Мало удаљите или приближите телефон.
- Ако ни тада не иде, апликација нуди да кодове упишете ручно. На потврди су 2 броја: **ИД корисника** (први број) и **регистрациони код** (други број). Препишите их тачно.

Ако и даље не иде, притисните **Нисам успео/ла**.

Када је апликација активирана, на еУправу се пријављујете тако што у апликацији потврдите пријаву.
```

- [ ] **Step 7: Validate, build, commit**

Run: `npm run validate && npm run build`
Expected: 0 errors; no `screen-length` warning on `register-upload`, `upload-menu`, `scan-qr-code` or `scan-qr-result`; `help-upload` still validates (it names the same menu items); build succeeds.

Run: `npm run validate 2>&1 | grep -c "screen-length"`
Expected: `0` (every screen is now under the cap).

```bash
/usr/bin/git add content/graph.yaml content/nodes/register-upload content/nodes/upload-menu content/nodes/scan-qr-code/index.md content/nodes/scan-qr-result
/usr/bin/git commit -m "content: upload menu and QR result get their own screens; no screen over the word cap"
```

---

### Task 6: Verification and the language review block

**Files:**

- Modify: this plan file (append the review under `## Language review` at the end)

- [ ] **Step 1: Click-through**

`npm run build`, `npm run preview` in the background, headless Chrome via the repo's `puppeteer-core` (as the previous plans' verification did), then confirm: `about-guide` → `welcome` → `what-you-can-do` → `account-and-app` → „Почните регистрацију“ → `what-you-need`; `switch-tabs` → `find-tabs-button` → `have-id-card`; `register-open` „Видим формулар“ → `upload-menu` → `register-upload`; `scan-qr-code` → `scan-qr-result` → „Апликација је активирана“ → `cloud-certificate` and „Нисам успео/ла“ → `help-account`; the three moved images render on their new screens; the progress label reads „Увод · део 1 од 5“ on `account-and-app` and „Апликација ConsentID · део 5 од 5“ on `scan-qr-result`. Stop the preview server. If headless Chrome is unavailable, check the same in `dist/` and say so.

- [ ] **Step 2: Language review**

Follow `docs/language-review.md`, all 14 criteria, on: `welcome`, `what-you-can-do`, `account-and-app`, `register-open`, `activate-consentid`, `switch-tabs`, `find-tabs-button`, `find-counter`, `register-upload`, `upload-menu`, `scan-qr-code`, `scan-qr-result`. Append the block to the end of this plan file under `## Language review`. If the verdict is `needs work`, apply the edits, re-run `npm run validate`, run the review again.

- [ ] **Step 3: Full run and commit**

Run: `npm run format:check && npm run check && npm test && npm run build && npm run test:dist && npm run validate`
Expected: all PASS, 0 validate errors, no `screen-length` warning anywhere.

```bash
/usr/bin/git add docs/superpowers/plans/2026-10-07-checked-dates-and-screen-trims.md
/usr/bin/git commit -m "docs: language review for the checked dates and screen trims"
```

Do not push and do not open a pull request.

## Language review

Screens: welcome, what-you-can-do, account-and-app, register-open, activate-consentid, switch-tabs, find-tabs-button, find-counter, register-upload, upload-menu, scan-qr-code, scan-qr-result

| # | Criterion | Score | Note |
| --- | --- | --- | --- |
| 1 | One action per step | 2 | register-upload step 2 is now one sentence naming **Фототека** or **Галерија**; switch-tabs step 1 is one press; remaining slips: scan-qr-code step 7 has 3 sentences (validator warning the user accepted) and step 3 describes what the reader sees rather than an action; activate-consentid step 3 asks to think up the PIN and type it ("Смислите… Упишите га.") |
| 2 | Imperative, addressed as "ви" | 2 | every instruction is an imperative in "ви"; no "ти", no authors' "ми"; statements keep 2 "се" forms: welcome "Регистрација и апликација ConsentID се не плаћају" and account-and-app "Активира се најкасније за 48 сати"; welcome "Потребан вам је само један бесплатан налог" is a statement, not a "потребно је" instruction |
| 3 | Positive phrasing | 2 | "не" otherwise appears only in real warnings ("Не притискајте их", "Не затварајте ниједну картицу", "Ништа не притискајте", "Не дајте га никоме", "Не треба да га фотографишете"); upload-menu says "не треба вам" for the items to skip, after "Ово изаберите" names the right one; no double negatives |
| 4 | Clear referents | 2 | register-open "Тим налогом се пријављујете на еУправу" still has no earlier "налог" on the screen (carried from the last review); switch-tabs "то дугме" is the дугме са квадратићима; upload-menu "то урадите" is choosing Фототека or Галерија; scan-qr-result "То значи" is the name and user ID appearing; find-counter "После тога" follows both buttons it names |
| 5 | Terms explained in place | 2 | explained where they first appear: еСандуче (welcome), потпис у клауду (account-and-app), картица (switch-tabs), прегледач in the terms.md words (find-tabs-button), QR код in the terms.md words (find-counter), ПИН as "ПИН од 6 цифара" that the reader thinks up (activate-consentid), мени (upload-menu); slips: account-and-app names the QR код before find-counter explains it, welcome says "Портал ЛПА" before find-counter explains ЛПА, scan-qr-code glosses QR in its own words ("квадрат од ситних црних и белих поља", matching its illustration) rather than the terms.md words |
| 6 | One word for one thing | 2 | account-and-app now says "Прво се региструјте" and "Добијате га регистрацијом" and no longer says "2 дела", so it has no slip left (see Edits); remaining slips: scan-qr-result "кодове упишете ручно" uses "код" for both numbers; register-upload "страну са својом сликом" (passport portrait, carried from the last review); switch-tabs "као мале слике" for tab previews (carried); find-tabs-button "квадратић са бројем" describes how the button looks and matches the screenshot captions |
| 7 | Consistent with the flow | 3 | every button the text names matches its label (Даље, Почните регистрацију, Већ имам налог, Видим формулар, Приложио/ла сам фотографије, Хоћу списак шалтера, Знам где ћу ићи, Апликација је активирана, Нисам успео/ла); find-counter now names both buttons; register-open says how to switch back to the guide in the same words as the other register screens; activate-consentid ends with "Притисните **Даље** у водичу." like the other split screens; scan-qr-result's sentence about approving logins now sits under the success heading (see Edits) |
| 8 | Calm tone | 3 | no exclamation marks, no "просто", no blame; "само" means "only" ("само један бесплатан налог", "само неки од послова", "само пример", "само страну"); find-tabs-button suggests asking a family member or neighbour once |
| 9 | Alt text says what to look for | 2 | find-tabs-button alts name the circled button on each phone; register-upload and register-open alts name the Приложите документа button; switch-tabs alt names both tabs; slip: upload-menu alt lists 4 items without pointing at Photo Library (carried from the last review) |
| 10 | Text matches the screenshot | 3 | Photo Library, Take photo, Choose File and Google Drive appear in upload-menu.jpg; Приложите документа in upload-button.jpg and registration-form-top.jpg; the eID.gov.rs logo and "Региструјте налог корисничким именом и лозинком" in registration-form-top.jpg; "квадратић са бројем" and "два квадратића" are the captions of the 3 tab images; еГрађанин корак по корак and eid.gov.rs head the 2 tabs in tabs-overview.jpg; qr-code-example.png is a labelled illustration ("Потврда са шалтера"), not a screenshot of the official paper |
| 11 | Help and failure screens | 3 | no help- screen changed; register-open keeps "Страница се не отвара" to help-technical, register-upload keeps "Не могу да приложим фотографије" to help-upload, scan-qr-result has "Нисам успео/ла" to help-account, and scan-qr-code says in its body that the next screen covers a failed scan; scan-qr-code has no failure answer on the screen itself because scan-qr-result, one Даље away, carries it (accepted deviation) |
| 12 | Helper safety | 3 | neither for-helper nor prepare-id-photos changed; activate-consentid has the account holder think up and type the PIN and tells them to give it to nobody, clerk or family member included |
| 13 | Statistics carry a source | 3 | numbers the reader acts on (48 сати, највише 4 члана породице, 6 цифара, 20 cm, 2 броја) need no source; find-counter names no counter count and links the official list; nothing is claimed for people over 75; what-you-can-do now says "Има и много других услуга" instead of the unsourced "стотине" (see Edits) |
| 14 | Read-aloud and card voice | 3 | `npm run validate` reports no screen-length warning, so every reviewed screen is at most 150 words; order-dependent actions are numbered lists; no card in the set; the one long sentence left is register-upload line 3 (17 words, accepted by the user) |

Verdict: pass

Edits (applied before this review; the first pass scored criterion 7 at 1 because the trim removed find-counter's only mention of its two buttons and left "На следећем екрану је порука коју можете да покажете на шалтеру", which is false for a reader who taps "Хоћу списак шалтера" and lands on the letter question):
- find-counter: "На следећем екрану је порука коју можете да покажете на шалтеру." → "Да видите шалтере у свом месту, притисните **Хоћу списак шалтера**. Ако већ знате где ћете ићи, притисните **Знам где ћу ићи**. После тога видите поруку коју можете да покажете на шалтеру."
- register-open: "Како прелазите између картица, пише на екрану „Како да прелазите између картица“, на почетку водича." → "Да се вратите у водич, притисните дугме са квадратићима, на дну или на врху екрана. Затим притисните картицу **еГрађанин корак по корак**."
- account-and-app: "Пут до еГрађанина има 2 дела. Прво направите налог, па тек онда активирајте апликацију." → "Налог и апликација ConsentID су 2 различите ствари. Прво се региструјте, па тек онда активирајте апликацију."
- account-and-app: "Правите га од куће, уз фотографију личне карте или пасоша." → "Добијате га регистрацијом од куће, уз фотографију личне карте или пасоша."
- account-and-app: the bullet "**Потпис у клауду** није обавезан. Њиме потписујете документа на телефону, без посебног уређаја." → a paragraph after "Са самим налогом…": "Касније можете да укључите и потпис у клауду, ако желите. То је начин да потписујете документа телефоном, без посебног уређаја."
- what-you-can-do: "Термин можете заказати и за до 4 члана породице." → "Термин можете да закажете и за највише 4 члана породице."
- what-you-can-do: "И још стотине других услуга. Притисните **Даље**." → "Има и много других услуга. Притисните **Даље**."
- activate-consentid: added as the last paragraph "Притисните **Даље** у водичу."
- scan-qr-result: "Притисните **Апликација је активирана**." moved out of the first success paragraph into a new one: "Од сада се на еУправу пријављујете тако што у апликацији потврдите пријаву. Притисните **Апликација је активирана**."; the last line "Када је апликација активирана, на еУправу се пријављујете тако што у апликацији потврдите пријаву." deleted
