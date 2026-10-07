# Helper screen, button spacing and term fixes (research groups 2 and 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a screen for the person helping an older reader, widen the gap between stacked answer buttons, fix the browser-tab and ID-card wording the term list forbids, and add two maintenance rules (sourced numbers, retiring a changed step), each change backed by a rule the repo keeps.

**Architecture:** Content lives in `content/` (one new `question`, one new `step`, one line on `prepare-id-photos`, a wording sweep over ten screens, one interface string, one sourced sentence on `find-counter`). The gap change is CSS in `src/styles/global.css` pinned by a built-output test. Durability: a term-list row for „прегледач“ and a new forbidden phrase in the `terms` validator rule; writing-guide rules 30 to 32 with review criteria 12 and 13; decision-log rows D25 to D27, which CI requires.

**Tech Stack:** Astro 7 static site, TypeScript, Vitest unit and built-output tests, Prettier, `astro check`.

**Spec:** `docs/research/2026-10-07-elderly-and-vulnerable-users.md` (action items C2, E1, W2, W6, W7) and the user's rulings on 2026-10-07: C5, C6, C7, E2, E3 are skipped; the guide assumes one phone; print work is a separate team discussion.

## Global Constraints

- **Worktree and git.** All work happens in `/Users/filip/IdeaProjects/egradjanin-korak-po-korak/.claude/worktrees/research+elderly-vulnerable-users` on branch `research/elderly-vulnerable-users`. A shell hook refuses plain `git`: **always call `/usr/bin/git`**. No shell globs. Never `cd` to the parent repo.
- **Writing rules apply to every Cyrillic string.** `docs/writing-guide.md` (29 rules today) and `docs/terms.md`: sentences of at most 20 words (aim 15), at most 150 words per screen, imperatives addressed as „ви“, bold only what is tapped or looked for, digits for numbers, gender forms as `сам/а`, titles at most 50 characters, labels at most 40 (characters, as `npm run validate` counts them). Never „укућани“ (write „неко од породице или комшија“), never „картица“ for the ID card (write „лична карта“), never „страница“ for a browser tab (write „картица“).
- **The guide assumes one phone.** Do not add "own phone versus any phone" instructions (C6 was dropped). The helper screen may say that ConsentID goes on the phone of the person being helped, because that is a safety rule, not a device-count instruction.
- **Verified claims only.** Do not name the iOS or Android "recently deleted" folder by its on-screen label (unverified); describe it generically. Do not give a counter count; link the official list instead.
- **Durability rule.** Every content change here leaves a rule: a validator check where deterministic, otherwise a writing-guide rule plus a review criterion plus a decision-log row.
- **CI gates.** `content/` and `docs/` are prettier-ignored; `src/` and `tests/` are not: run `npm run format` and `npm run check` before any commit touching them. A change to `docs/terms.md` or `docs/writing-guide.md` needs a dated row in `docs/language-decisions.md` (English, newest first, next number D25). A pull request that changes `content/` needs a `## Language review` block with a `Verdict:` line.
- **No new dependencies, no backend.** Nothing under `.github/`.

## Review Focus

1. **Group order.** The new `has-helper` and `for-helper` nodes sit in group Припрема between `what-you-need` and `switch-tabs`; inserting them must not create a new group or reorder existing ones. Pinned by `npm run validate` and a check of the rendered progress label in Task 3.
2. **The sweep must not touch „страница“ where it means a web page.** `cloud-login` („страница за пријаву“), `help-technical` („Ако се страница не отвара“, „отворите страницу у другом прегледачу“), `register-open` title („Отворите страницу за регистрацију“) and `register-error` („На страници за пријаву“) stay. Pinned by the explicit file-and-line list in Task 2.
3. **The answer bar must stay sticky and the four-answer fallback must still work** after the CSS change. Pinned by the existing dist tests plus the new gap test in Task 1.
4. **„браузер“ must be forbidden without tripping anything real.** Pinned by a grep in Task 2 before the phrase is added and by the real-content language test.
5. **The helper screen must keep the opener rule out.** Its id does not start with `help-`, so the `help-screen` validator rule must not fire on it. Pinned by `npm run validate` in Task 3.

---

### Task 1: Wider gap between stacked answer buttons (E1)

**Files:**

- Modify: `src/styles/global.css:133-146`
- Test: `tests/dist/pages.test.ts` (next to `'pins the answer bar to the bottom of the viewport'`)

**Interfaces:**

- Consumes: nothing.
- Produces: `.answers` is a flex column with `gap: 1rem`; `.answers .btn` has no vertical margin.

- [ ] **Step 1: Write the failing dist test**

In `tests/dist/pages.test.ts`, after the test `'pins the answer bar to the bottom of the viewport'`, add:

```ts
  it.skipIf(!questionId)('spaces stacked answer buttons at least 16 px apart', () => {
    // Older adults mis-tap neighbouring targets; the evidence asks for 16–24 CSS px between
    // stacked buttons (Jin et al. 2007 via W3C; Gomez-Hernandez et al. 2023).
    const html = page('cyr', questionId as string);
    expect(html).toMatch(/\.answers\{[^}]*display:flex/);
    expect(html).toMatch(/\.answers\{[^}]*flex-direction:column/);
    expect(html).toMatch(/\.answers\{[^}]*gap:1rem/);
    expect(html).toMatch(/\.answers \.btn\{[^}]*margin:0(?:;|\})/);
  });
```

- [ ] **Step 2: Build and run the dist tests to see it fail**

Run: `npm run build && npx vitest run --config vitest.dist.config.ts tests/dist/pages.test.ts`
Expected: the new test FAILS (no `display:flex` in `.answers`); others pass.

- [ ] **Step 3: Change the stylesheet**

In `src/styles/global.css`, replace

```css
.answers {
  position: sticky;
  bottom: 0;
  margin: 1rem -1rem 0;
  padding: 0.5rem 1rem calc(0.5rem + env(safe-area-inset-bottom, 0px));
```

with

```css
.answers {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: column;
  /* 16 px between stacked buttons: older adults mis-tap neighbouring targets. */
  gap: 1rem;
  margin: 1rem -1rem 0;
  padding: 0.5rem 1rem calc(0.5rem + env(safe-area-inset-bottom, 0px));
```

and replace

```css
.answers .btn {
  min-height: 52px;
  margin: 0.375rem 0;
}
```

with

```css
.answers .btn {
  min-height: 52px;
  margin: 0;
}
```

Leave the `.node-card .answers, .answers:has(> :nth-child(4))` block as it is; `display: flex` and `gap` still apply there.

- [ ] **Step 4: Format, type-check, build, run all tests**

Run: `npm run format && npm run check && npm test && npm run build && npm run test:dist`
Expected: all PASS, including the existing sticky-bar and card tests.

- [ ] **Step 5: Commit**

```bash
/usr/bin/git add src/styles/global.css tests/dist/pages.test.ts
/usr/bin/git commit -m "feat: 16 px gap between stacked answer buttons"
```

---

### Task 2: Term fixes: „прегледач“ row, „браузер“ forbidden, tab and ID-card wording sweep (W2)

**Files:**

- Modify: `docs/terms.md` (one new row), `src/lib/language.ts` (`FORBIDDEN_PHRASES`), `src/lib/language.unit.test.ts`, `docs/writing-guide.md` (rule 29 list), `docs/language-decisions.md` (row D25)
- Modify: `content/graph.yaml:36` (title of `switch-tabs`), `content/ui-strings.yaml:11` (`opensNewTab`)
- Modify: `content/nodes/switch-tabs/index.md`, `content/nodes/register-open/index.md`, `content/nodes/register-upload/index.md`, `content/nodes/register-personal-data/index.md`, `content/nodes/register-document-data/index.md`, `content/nodes/register-login-data/index.md`, `content/nodes/register-submit/index.md`, `content/nodes/register-error/index.md`, `content/nodes/help-upload/index.md`, `content/nodes/prepare-id-photos/index.md`
- Test: `npm run validate`, `npm test`, `npm run build && npm run test:dist`

**Interfaces:**

- Consumes: `FORBIDDEN_PHRASES` shape `{ pattern: RegExp; write: string }[]` from `src/lib/language.ts`.
- Produces: the `switch-tabs` title „Како да прелазите између картица“, which Task 3's helper screen and `register-open` quote.

- [ ] **Step 1: Confirm „браузер“ has no current hits**

Run: `grep -rn -i "браузер" content/graph.yaml content/ui-strings.yaml content/nodes --include=index.md`
Expected: no output. If there is output, fix those occurrences to „прегледач“ in this task and list them in the report.

- [ ] **Step 2: Write the failing unit test**

In `src/lib/language.unit.test.ts`, inside `describe('forbidden phrases from the term list (rule 29, terms)', ...)`, add:

```ts
  it('forbids „браузер“ and names „прегледач“', () => {
    expect(rules(checkBody('x', 'Отворите страницу у другом браузеру.'))).toEqual(['error:terms']);
    expect(checkBody('x', 'Отворите браузер.')[0].message).toContain('прегледач');
    expect(rules(checkBody('x', 'Отворите страницу у другом прегледачу.'))).toEqual([]);
  });
```

Run: `npx vitest run src/lib/language.unit.test.ts`
Expected: FAIL on the new test.

- [ ] **Step 3: Add the phrase**

In `src/lib/language.ts`, append to `FORBIDDEN_PHRASES`:

```ts
  { pattern: /(?<!\p{L})браузер/iu, write: 'прегледач' },
```

Run: `npx vitest run src/lib/language.unit.test.ts`
Expected: PASS.

- [ ] **Step 4: Add the term-list row and update rule 29 and the decision log**

In `docs/terms.md`, after the row `| browser tab | картица | … |`, add:

```markdown
| browser | прегледач | браузер, претраживач (за прегледач) | „програм у ком отварате сајтове, на пример Chrome или Safari“ |
```

In `docs/writing-guide.md`, rule 29, add „браузер“ to the quoted list (after „иконица“), and change nothing else in the rule. The list then has 20 phrases.

In `docs/language-decisions.md`, insert above D24:

```markdown
| D25 | 2026-10-07 | „прегледач“ gets a term-list row (never „браузер“ or „претраживач“ for the browser) and „браузер“ joins the `terms` check, which now covers 20 phrases. A browser tab is „картица“ on every screen, including the `switch-tabs` title and the screen-reader text under external buttons; the ID card is never „картица“. | The research audit found „прегледач“ missing from the term list while the content used it; eight registration screens and the tab-switching screen called a tab „страница“, and `prepare-id-photos` called the ID card „картица“, both forms the term list forbids. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, item W2; final review of PR for group 1 | Filip | `docs/terms.md`; `docs/writing-guide.md`, rule 29; `src/lib/language.ts`; screens switch-tabs, register-open, register-upload, register-personal-data, register-document-data, register-login-data, register-submit, register-error, help-upload, prepare-id-photos; `content/ui-strings.yaml` |
```

- [ ] **Step 5: The wording sweep, file by file**

Make exactly these replacements. Everything not listed stays.

`content/graph.yaml` line 36: `title: Како да прелазите између страница` → `title: Како да прелазите између картица`.

`content/ui-strings.yaml` line 11: `opensNewTab: отвара се у новом прозору` → `opensNewTab: отвара се у новој картици`.

`content/nodes/switch-tabs/index.md`:
- `2. Видећете све отворене странице, као мале слике.` → `2. Видећете све отворене картице, као мале слике.`
- alt text `Илустрација: две отворене странице једна поред друге; …` → `Илустрација: две отворене картице једна поред друге; …` (rest of the alt unchanged).
- `Број показује колико је страница отворено.` → `Број показује колико је картица отворено.`
- `Ако не налазите дугме, замолите неког од укућана да вам покаже једном.` → `Ако не налазите дугме, замолите неког од породице или комшија да вам покаже једном.`

`content/nodes/register-open/index.md`:
- line 9: `… на екрану „Како да прелазите између страница“. Укратко:` → `… на екрану „Како да прелазите између картица“. Укратко:`
- line 12: `2. Видећете све отворене странице.` → `2. Видећете све отворене картице.`
- line 25: `Не затварајте ниједну страницу.` → `Не затварајте ниједну картицу.`
- The title on graph.yaml line 107 („Отворите страницу за регистрацију“) stays: it is a web page.

In each of `content/nodes/register-upload/index.md`, `register-personal-data/index.md`, `register-document-data/index.md`, `register-login-data/index.md`, `register-submit/index.md`, `register-error/index.md`, the sentence `Затим притисните страницу **eid.gov.rs**.` → `Затим притисните картицу **eid.gov.rs**.` (one occurrence each). `register-error` line 8 „На страници за пријаву“ stays: it is a web page.

`content/nodes/help-upload/index.md` step 1: `… притисните дугме са квадратићима, па страницу **eid.gov.rs**.` → `… притисните дугме са квадратићима, па картицу **eid.gov.rs**.`

`content/nodes/prepare-id-photos/index.md`:
- `2. Упалите светло, али пазите да се на картици не сија одсјај.` → `2. Упалите светло, али пазите да се на личној карти не сија одсјај.`
- `4. Окрените картицу и фотографишите **задњу** страну.` → `4. Окрените личну карту и фотографишите **задњу** страну.`

- [ ] **Step 6: Verify nothing else calls a tab „страница“ or the ID card „картица“**

Run: `grep -rn "отворене странице\|страницу \*\*eid\|ниједну страницу\|између страница\|новом прозору\|укућан" content/graph.yaml content/ui-strings.yaml content/nodes --include=index.md`
Expected: no output.

Run: `grep -rn "картиц" content/nodes/prepare-id-photos/index.md content/nodes/register-upload/index.md content/nodes/check-id-card/index.md content/nodes/have-id-card/index.md`
Expected: only lines where „картица“ means a browser tab (the `register-upload` sweep line). If `check-id-card` uses „картица“ for the ID card, fix it the same way and list it in the report.

- [ ] **Step 7: Run everything**

Run: `npm run format && npm run check && npm test && npm run validate && npm run build && npm run test:dist`
Expected: all PASS, 0 validate errors, no new warning on the touched screens.

- [ ] **Step 8: Commit**

```bash
/usr/bin/git add src/lib/language.ts src/lib/language.unit.test.ts docs/terms.md docs/writing-guide.md docs/language-decisions.md content/graph.yaml content/ui-strings.yaml content/nodes/switch-tabs/index.md content/nodes/register-open/index.md content/nodes/register-upload/index.md content/nodes/register-personal-data/index.md content/nodes/register-document-data/index.md content/nodes/register-login-data/index.md content/nodes/register-submit/index.md content/nodes/register-error/index.md content/nodes/help-upload/index.md content/nodes/prepare-id-photos/index.md
/usr/bin/git commit -m "content: a browser tab is картица everywhere, the ID card never is; прегледач in the term list"
```

---

### Task 3: The helper screen (C2)

**Files:**

- Modify: `content/graph.yaml` (`what-you-need` next; two new nodes after it)
- Create: `content/nodes/for-helper/index.md`
- Modify: `content/nodes/prepare-id-photos/index.md` (one new closing line)
- Modify: `docs/writing-guide.md` (rule 30), `docs/language-review.md` (criterion 12), `.claude/skills/language-review/SKILL.md` ("eleven" → "thirteen" after Task 4; see Task 4 Step 4), `docs/language-decisions.md` (row D26), `AGENTS.md` (rule count)
- Test: `npm run validate`, `npm run build`

**Interfaces:**

- Consumes: the `switch-tabs` title from Task 2 („Како да прелазите између картица“).
- Produces: nodes `has-helper` (question) and `for-helper` (step) in group Припрема; writing rule 30 (helper) and review criterion 12.

- [ ] **Step 1: Graph changes**

In `content/graph.yaml`, change

```yaml
  what-you-need:
    type: step
    title: Шта вам треба да почнете
    group: Припрема
    next: switch-tabs
```

to

```yaml
  what-you-need:
    type: step
    title: Шта вам треба да почнете
    group: Припрема
    next: has-helper

  has-helper:
    type: question
    title: Да ли вам неко помаже?
    group: Припрема
    answers:
      - label: Да, помаже ми неко
        next: for-helper
      - label: Не, радим сам/а
        next: switch-tabs

  for-helper:
    type: step
    title: Ако помажете некоме
    group: Припрема
    next: switch-tabs
```

- [ ] **Step 2: Create `content/nodes/for-helper/index.md` with exactly this body**

The reader of this screen is the helper. „Особа“ is grammatically feminine, so „она“ refers to the person being helped whatever their gender.

```markdown
Хвала што помажете. Налог је лични, као лична карта. Зато особа којој помажете ради кључне кораке сама, а ви јој показујете.

1. Нека она сама упише лозинку и ПИН. Ви их не записујете у свој телефон.
2. Имејл адресу и лозинку запишите на њен папир, не на свој.
3. Ако сликате личну карту својим телефоном, после обришите те фотографије. Обришите их и из корпе за обрисане фотографије.
4. Ако отварате њен имејл на свом телефону, после се одјавите.
5. Апликација ConsentID иде на њен телефон, не на ваш.

Читајте екран наглас и сачекајте да она сама притисне дугме. Притисните **Даље**.
```

- [ ] **Step 3: One line on `prepare-id-photos`**

In `content/nodes/prepare-id-photos/index.md`, after the last line („Ако се региструјете пасошем, …“), add a paragraph:

```markdown
Ако сликате туђим телефоном, после обришите фотографије са њега.
```

- [ ] **Step 4: Writing rule 30, criterion 12, decision row D26, AGENTS.md count**

In `docs/writing-guide.md`, after rule 29 (still inside `## Помоћ и речи`), add:

```markdown
30. **Помагач** (helper). Екран `for-helper` је једини екран који се обраћа помагачу; сви остали
    се обраћају особи која отвара налог. Сваки екран на ком се може користити туђи телефон
    (фотографисање личне карте, отварање имејла) једном реченицом каже шта помагач после брише
    или одјављује. Лозинку и ПИН увек уписује особа која отвара налог.
```

In `docs/language-review.md`, add a criteria row after row 11:

```markdown
| 12 | Helper safety | A screen where the reader may use someone else's phone (photographing the ID card, opening email) says in one sentence what the helper deletes or signs out of afterwards; the password and PIN are always typed by the account holder. A set of changed screens with no such screen scores 3. |
```

Leave the "Score each of the 11 criteria below" sentence alone; Task 4 updates the counts once criterion 13 exists.

In `docs/language-decisions.md`, insert above D25:

```markdown
| D26 | 2026-10-07 | A question „Да ли вам неко помаже?“ after `what-you-need` leads helpers to `for-helper`, the one screen addressed to the helper: the account holder types the password and PIN, the helper's phone keeps no ID photos or email session, ConsentID goes on the account holder's phone. Rule 30 and review criterion 12 keep it. | Among over-60s, 64% get help from family or friends with online services (Age UK), and formal proxy schemes warn that helpers must not keep passwords or data (Digital Unite 2021; NHS proxy guidance). The guide had no word for the helper. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, item C2 | Filip | `docs/writing-guide.md`, rule 30; `docs/language-review.md`, criterion 12; screens has-helper, for-helper, prepare-id-photos |
```

Do not touch `AGENTS.md` in this task; Task 4 updates the rule count to 32 once rules 31 and 32 exist.

- [ ] **Step 5: Validate, build, check the group label**

Run: `npm run validate`
Expected: 0 errors; no `help-screen` error on `for-helper` (its id does not start with `help-`); no new warning on `for-helper` or `prepare-id-photos`. If a warning names them, shorten the quoted sentence and report it.

Run: `npm run build` then `grep -o "Припрема · део [0-9] од [0-9]" dist/step/for-helper/index.html | head -1`
Expected: build succeeds and the label reads `Припрема · део 2 од 5` (the same group number `what-you-need` has).

- [ ] **Step 6: Commit**

```bash
/usr/bin/git add content/graph.yaml content/nodes/for-helper/index.md content/nodes/prepare-id-photos/index.md docs/writing-guide.md docs/language-review.md docs/language-decisions.md
/usr/bin/git commit -m "content: helper screen with safety rules; writing rule 30 and review criterion 12"
```

---

### Task 4: Maintenance rules: sourced numbers and retiring a changed step (W6, W7)

**Files:**

- Modify: `docs/writing-guide.md` (new section with rules 31 and 32), `docs/language-review.md` (criterion 13), `.claude/skills/language-review/SKILL.md`, `docs/language-decisions.md` (row D27), `AGENTS.md`
- Modify: `content/nodes/find-counter/index.md:5`
- Test: `npm run validate`, `npm test` (`language-docs.test.ts` only checks rule ids the checker emits; these rules have none, so no code change)

**Interfaces:**

- Consumes: nothing.
- Produces: rules 31 and 32; criterion 13; the rule count 32.

- [ ] **Step 1: Fix the unsourced figure on `find-counter`**

In `content/nodes/find-counter/index.md`, change line 5

```markdown
Шалтера има преко 1000 широм Србије:
```

to

```markdown
Шалтера има у целој Србији. Званичан списак је на сајту еУправе: [euprava.gov.rs/eidlokacije](https://euprava.gov.rs/eidlokacije). Шалтер може да буде:
```

The bullet list that follows stays as it is.

- [ ] **Step 2: Add rules 31 and 32**

In `docs/writing-guide.md`, after rule 30 and before `## Како изгледа екран`, add:

```markdown
## Одржавање

31. **Бројеви са извором** (sourced-numbers). Сваки број који читалац види, осим бројева корака и
    рокова са званичног сајта, има годину и извор у истој реченици или у вези одмах уз њу: „2,2
    милиона налога (јун 2024, Канцеларија за ИТ и еУправу)“. Без извора, број се брише. Ништа не
    тврдимо за особе старије од 75 година, јер их званична статистика не обухвата.
32. **Застарели корак** (retire-step). Кад се званични корак промени, исправите екран у истом
    захтеву за спајање. Кад корак нестане, преусмерите сваки `next` који води на њега и обришите
    фасциклу екрана. Никад не остављајте застарели екран са напоменом. Провера `npm run validate`
    јавља грешку за фасциклу без чвора, па пола урађеног посла не пролази.
```

- [ ] **Step 3: Criterion 13, skill wording, decision row, AGENTS.md**

In `docs/language-review.md`, add a criteria row after row 12:

```markdown
| 13 | Numbers carry a source | Every number the reader sees, other than step numbers and deadlines from the official site, has its year and source beside it; nothing is claimed for people over 75. |
```

Change step 3 from "Score each of the 11 criteria below" to "Score each of the 13 criteria below".

In `.claude/skills/language-review/SKILL.md`, change "eleven" to "thirteen" in the description and in step 5.

In `docs/language-decisions.md`, insert above D26:

```markdown
| D27 | 2026-10-07 | Every number the reader sees carries its year and source, nothing is claimed for people over 75, and a changed official step is corrected or retired in the same pull request (rules 31 and 32, criterion 13). `find-counter` links the official counter list instead of giving a count. | The guide showed „преко 1000 шалтера“ with no source; official statistics cover ages 16 to 74 only; nothing told authors what to do when eUprava changes a step. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, items W6 and W7 | Filip | `docs/writing-guide.md`, rules 31 and 32; `docs/language-review.md`, criterion 13; screen find-counter |
```

In `AGENTS.md`, change "29 rules with examples" to "32 rules with examples" and add two bullets to the "In short" list under "Writing rules":

```markdown
- Every number the reader sees carries its year and source; nothing is claimed for people over 75.
- When an eUprava step changes, fix the screen in the same pull request; when a step disappears,
  repoint every `next` to it and delete its folder. Never leave a stale screen with a note.
```

- [ ] **Step 4: Verify**

Run: `npm run validate && npm test`
Expected: 0 validate errors; no new warning on `find-counter`; all unit tests pass.

Run: `grep -n "29 rules\|eleven\|11 criteria" AGENTS.md docs/language-review.md .claude/skills/language-review/SKILL.md`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
/usr/bin/git add content/nodes/find-counter/index.md docs/writing-guide.md docs/language-review.md .claude/skills/language-review/SKILL.md docs/language-decisions.md AGENTS.md
/usr/bin/git commit -m "docs: sourced-numbers and retire-step rules; find-counter links the official list"
```

---

### Task 5: Verification and the language review block

**Files:**

- Modify: this plan file (append the review under `## Language review` at the end)

- [ ] **Step 1: Click-through**

Run `npm run build`, start `npm run preview` in the background, and with headless Chrome (the repo's `puppeteer-core`, as the previous plan's Task 6 did) or by reading `dist/` confirm: `what-you-need` leads to `has-helper`; „Да, помаже ми неко“ leads to `for-helper`, whose Даље leads to `switch-tabs`; „Не, радим сам/а“ leads to `switch-tabs`; the progress label on `for-helper` reads „Припрема · део 2 од 5“; a question page's answer buttons are 16 px apart (computed `gap` of `.answers` is `16px`). Stop the preview server.

- [ ] **Step 2: Language review**

Follow `docs/language-review.md` on every changed screen (`switch-tabs`, `register-open`, `register-upload`, `register-personal-data`, `register-document-data`, `register-login-data`, `register-submit`, `register-error`, `help-upload`, `prepare-id-photos`, `has-helper`, `for-helper`, `find-counter`), all 13 criteria. Append the output block to the end of this plan file under `## Language review`. If the verdict is `needs work`, apply the edits, re-run `npm run validate`, and run the review again.

- [ ] **Step 3: Full run and commit**

Run: `npm run format:check && npm run check && npm test && npm run build && npm run test:dist`
Expected: all PASS.

```bash
/usr/bin/git add docs/superpowers/plans/2026-10-07-helper-screen-and-term-fixes.md
/usr/bin/git commit -m "docs: language review for the helper screen and term fixes"
```

Do not push and do not open a pull request.
