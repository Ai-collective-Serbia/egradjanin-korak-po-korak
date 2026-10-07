# Help screens and failure paths (research group 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the four dead-end help screens into reassuring screens with one next action and a way back, add a failure answer to the two screens where a reader can get stuck, finish the "the guide stays open" wording, and make every one of those changes a rule the repo enforces from now on.

**Architecture:** Content changes live in `content/` (four rewritten help bodies, one new `help-upload` step, two steps that gain answers, one interface string). Durability comes from three deterministic checks: a graph rule in `src/lib/graph.ts` (a step that opens another site must have at least two answers), and two language rules in `src/lib/language.ts` (`help-screen`: fixed opening sentence and no phone number on `help-` screens; `terms`: a fixed list of forbidden phrases from the term list, checked in bodies, titles, labels and interface strings). A small page change keeps the Назад button on `end` screens whose id starts with `help-`, using the same id-prefix convention the checker already uses for `counter-list-`. Rules that cannot be made deterministic go into the writing guide, the review rubric and the decision log, which CI now requires.

**Tech Stack:** Astro 7 static site, TypeScript, Zod schemas, Vitest unit tests (`npm test`) and built-output tests (`npm run build && npm run test:dist`), Prettier, `astro check`.

**Spec:** `docs/research/2026-10-07-elderly-and-vulnerable-users.md` (action items C3, C4, C8, W4) and the decisions recorded in Global Constraints below. There is no separate design spec for this group; the research report is the spec.

## Global Constraints

- **Worktree and git.** All work happens in `/Users/filip/IdeaProjects/egradjanin-korak-po-korak/.claude/worktrees/research+elderly-vulnerable-users` on branch `research/elderly-vulnerable-users`. A shell hook rewrites `git` and refuses it there: **always call `/usr/bin/git`**, never `git`. Avoid shell globs in commands (list files explicitly). Never `cd` to the parent repo.
- **Decisions already made (do not reopen).** C1 (a "this guide never asks for your password or ID photo" trust line) is dropped: the process itself needs both, so the line would contradict later steps, and the audience would not act on it. Every change in this plan must leave behind a rule: deterministic check where possible, otherwise writing-guide rule plus rubric criterion plus decision-log row.
- **Writing rules apply to every Cyrillic string in this plan.** `docs/writing-guide.md` (27 rules today) and `docs/terms.md`. Sentences of at most 20 words, at most 150 words per screen, imperatives addressed as „ви“, bold only the thing to tap, numbered lists for anything done in order, digits for numbers, gender forms as `успео/ла`. Titles at most 50 characters, answer labels at most 40 (counted in characters, which `npm run validate` does; `awk length` counts bytes and is wrong for Cyrillic).
- **Term list wins.** Never write „Портал еИД“ (write „сајт eid.gov.rs“), „вратите се овде“ (write „Вратите се у водич.“), „укућани“ (write „неко од породице или комшија“). The Назад button is written **Назад** in bold.
- **Verified claims only.** The counter (шалтер) can check an account and issue a new QR code, and registration can be done at a post office, municipality, local tax office or Mobi Banka counter (eid.gov.rs FAQ 12). Do not claim a clerk resets a ConsentID PIN, do not claim counter registration removes the email requirement, and do not say "only an ID card with a chip": `have-id-card` accepts a passport.
- **Phone numbers.** No help screen gives a phone number. The official eID help has a contact form only.
- **CI gates.** `content/` is prettier-ignored and so is `docs/`; `src/`, `tests/`, `scripts/` and `.github/` are not. Before every commit that touches `src/` or `tests/`, run `npm run format` and `npm run check`. A pull request that changes `docs/terms.md` or `docs/writing-guide.md` must add a dated row to `docs/language-decisions.md` (Д21 onward, newest row first) or CI fails. A pull request that changes `content/` must carry a `## Language review` block with a `Verdict:` line.
- **Zero infrastructure.** No new dependencies, no backend, no analytics.
- **Out of scope.** Screenshot staleness, the other research action items (C2, C5, C6, C7, C9, W1, W2, W3, W5, W6, W7, E1 to E5), and shortening `welcome`.

## Review Focus

1. **Назад on a help screen reached mid-flow.** The dist test checks the attribute only; the client script `src/scripts/progress-client.ts` rewrites `a[data-back]` to the previous visited node. A reviewer should open `help-technical` from `register-open` in `npm run dev` and confirm Назад returns to `register-open`. Pinned by the dist test in Task 1 and the manual check in Task 6.
2. **The opener rule must skip the callout.** `help-upload` opens with the `> Ово радите у …` blockquote; the `help-screen` rule must look at the first `paragraph` block, not the first block. Pinned by a unit test in Task 5.
3. **The phone-number check must not fire on ordinary numbers.** „13 цифара“, „48 сати“, „2 броја“, „1000 шалтера“, „од 8 до 20 знакова“ and a 6-digit PIN example must pass; „011 123 456“, „011/1234-567“ and „+381 11 1234567“ must fail. Pinned by a unit test in Task 5.
4. **Forbidden phrases must respect letter boundaries.** „имејл“ must not trip „мејл“; „Унесите“ at a sentence start must trip „унесите“ (case-insensitive); „Порталу еИД“ and „Портала еИД“ must trip. Pinned by a unit test in Task 5.
5. **External step with too few answers.** A step with `external` and `next`, or with `external` and a single answer, must fail validation with a message naming the node; the existing sample graph (two answers) must still pass. Pinned by a unit test in Task 3.

---

### Task 1: Help screens keep the Назад button

**Files:**

- Modify: `src/lib/graph.ts` (add `isHelpNode` next to the other exports)
- Modify: `src/components/NodePage.astro:27-29` and the two `nav` blocks at the end
- Test: `src/lib/graph.test.ts`, `tests/dist/fixtures.ts`, `tests/dist/pages.test.ts`

**Interfaces:**

- Consumes: `graph.nodes[id].type`, existing `data-back` handling in `src/scripts/progress-client.ts` (unchanged).
- Produces: `export function isHelpNode(id: string): boolean` in `src/lib/graph.ts`, used by Task 5's language rule and by `NodePage.astro`.

- [ ] **Step 1: Write the failing unit test for `isHelpNode`**

Append to `src/lib/graph.test.ts` (after the `outgoing` describe block), and add `isHelpNode` to the import on line 2:

```ts
describe('isHelpNode', () => {
  it('is true only for ids that start with "help-"', () => {
    expect(isHelpNode('help-account')).toBe(true);
    expect(isHelpNode('help-upload')).toBe(true);
    expect(isHelpNode('help')).toBe(false);
    expect(isHelpNode('helper-screen')).toBe(false);
    expect(isHelpNode('done')).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/lib/graph.test.ts`
Expected: FAIL, `isHelpNode` is not exported.

- [ ] **Step 3: Implement `isHelpNode`**

In `src/lib/graph.ts`, after `export function outgoing(...)`, add:

```ts
/** A help screen: an id that starts with "help-". Help screens keep the Назад button and follow writing rule 28. */
export function isHelpNode(id: string): boolean {
  return id.startsWith('help-');
}
```

- [ ] **Step 4: Run the unit test to see it pass**

Run: `npx vitest run src/lib/graph.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing dist test**

In `tests/dist/fixtures.ts`, after `export const endId = ...`, add:

```ts
/** First end node that is a help screen (id starts with "help-"), or undefined. */
export const helpEndId = entries.find(([id, n]) => n.type === 'end' && id.startsWith('help-'))?.[0];
```

In `tests/dist/pages.test.ts`, import `helpEndId` from `./fixtures` next to `endId`, and add after the test `'shows a home button instead of Back on end pages'`:

```ts
  it.skipIf(!helpEndId)('keeps Back on help end pages, next to the home button', () => {
    // A help screen is reached from the middle of the flow; the reader must be able to retry.
    const html = page('cyr', helpEndId as string);
    expect(html).toContain('data-back href=');
    expect(html).toContain('class="nav-home"');
  });
```

- [ ] **Step 6: Build and run the dist tests to see the new test fail**

Run: `npm run build && npx vitest run --config vitest.dist.config.ts tests/dist/pages.test.ts`
Expected: the new test FAILS (no `data-back` on `help-id-card`); every other test passes.

- [ ] **Step 7: Change the page component**

In `src/components/NodePage.astro`, replace lines 27 to 29:

```astro
const external = node.type === 'step' ? node.external : undefined;
/** End screens have no Back (testers found it confusing); they offer a way home instead. */
const isEnd = node.type === 'end';
```

with:

```astro
const external = node.type === 'step' ? node.external : undefined;
/**
 * End screens have no Back (testers found it confusing); they offer a way home instead.
 * Help screens (ids starting with "help-") are end screens reached mid-flow, so they keep Back too.
 */
const isEnd = node.type === 'end';
const showBack = !home && (!isEnd || isHelpNode(id));
```

Add `isHelpNode` to the import from `'../lib/graph'` on line 4:

```astro
import { groupPosition, isHelpNode, outgoing } from '../lib/graph';
```

Replace the back nav condition `{!home && !isEnd && (` with `{showBack && (`. Leave the `{isEnd && (` home nav as it is, so a help screen renders Назад first and then На почетну страну.

- [ ] **Step 8: Format, type-check, build, run all tests**

Run: `npm run format && npm run check && npm test && npm run build && npm run test:dist`
Expected: all PASS. The existing test `'shows a home button instead of Back on end pages'` still passes because `endId` resolves to `done`.

- [ ] **Step 9: Commit**

```bash
/usr/bin/git add src/lib/graph.ts src/lib/graph.test.ts src/components/NodePage.astro tests/dist/fixtures.ts tests/dist/pages.test.ts
/usr/bin/git commit -m "feat: help screens (help-* ids) keep the Back button next to the home button"
```

---

### Task 2: Rewrite the four help screens (C3)

**Files:**

- Modify: `content/graph.yaml` (title of `help-account`, lines 643-645)
- Modify: `content/nodes/help-account/index.md`, `content/nodes/help-technical/index.md`, `content/nodes/help-email/index.md`, `content/nodes/help-id-card/index.md`
- Test: `npm run validate`, `npm run build`

**Interfaces:**

- Consumes: nothing from other tasks (Task 1 only changes rendering).
- Produces: every help body opens with the fixed sentence „Нисте ништа покварили.“ which Task 5's `help-screen` rule will require; `help-account` is the target of the new failure answers in Task 3.

- [ ] **Step 1: Retitle `help-account`**

In `content/graph.yaml`, change

```yaml
  help-account:
    type: end
    title: Пишите подршци Портала еИД
```

to

```yaml
  help-account:
    type: end
    title: Затражите помоћ за налог
```

- [ ] **Step 2: Replace `content/nodes/help-account/index.md` with exactly this body**

Reached from: `register-error` (ЈМБГ in use; still failing), `email-missing` (no message after half an hour), `wait-activation` (more than 48 hours), `scan-qr-code` (activation failed), `cloud-approve` (forgot PIN), `cloud-check-login` (still failing), and, after Task 3, `help-upload` and `cloud-login`.

```markdown
Нисте ништа покварили. Овакве проблеме решава службеник на шалтеру или подршка сајта eid.gov.rs.

## Идите на шалтер

Ово је најбржи пут. Понесите личну карту и телефон.

1. Идите на шалтер са ознаком еУправа, на пример у пошти или у општини.
2. Реците службенику шта се десило.
3. Службеник може да провери ваш налог и да вам да нови QR код за апликацију.

## Или пишите подршци

Ако не можете на шалтер, пошаљите поруку преко сајта eid.gov.rs: [отворите страницу Контакт](https://eid.gov.rs/sr-Cyrl-RS/kontakt).

У поруци напишите имејл адресу са којом сте се регистровали и шта се десило. Одговор стиже на имејл.

Неко од породице или комшија може да вам помогне.
```

- [ ] **Step 3: Replace `content/nodes/help-technical/index.md` with exactly this body**

Reached from: `register-open` (page does not open), `install-consentid` (cannot find the app).

```markdown
Нисте ништа покварили. Ово се дешава због интернета или због телефона.

## Ако се страница не отвара

1. Проверите да ли телефон има интернет, преко Wi-Fi-ја или мобилних података.
2. Сачекајте неколико минута.
3. Притисните **Назад** и покушајте поново.
4. Ако и даље не ради, отворите страницу у другом прегледачу, на пример Chrome или Safari.

## Ако не можете да нађете апликацију ConsentID

Притисните линк за свој телефон:

- **Android телефон:** [Отворите ConsentID у продавници Google Play](https://play.google.com/store/apps/details?id=nl.aeteurope.mpki.gui)
- **iPhone:** [Отворите ConsentID у продавници App Store](https://apps.apple.com/rs/app/consentid/id883224643)

Када инсталирате апликацију, притисните **Назад** и наставите водич.

## Ако ништа не помаже

Регистрацију можете да обавите и на шалтеру, на пример у пошти или у општини. Понесите личну карту.

Неко од породице или комшија може да вам помогне.
```

- [ ] **Step 4: Replace `content/nodes/help-email/index.md` with exactly this body**

Reached from: `create-email` (Нисам успео/ла).

```markdown
Нисте ништа покварили. Имејл адресу је лакше направити удвоје.

Имејл адреса вам треба за све што следи. Она је ваше корисничко име, а на њу стижу и поруке од еУправе.

1. Замолите неког од породице или комшија да направи имејл адресу заједно са вама, на вашем телефону.
2. Запишите имејл адресу и лозинку на папир.
3. Притисните **Назад** и наставите водич.

Регистрацију можете да обавите и на шалтеру, на пример у пошти или у општини. Понесите личну карту.
```

- [ ] **Step 5: Replace `content/nodes/help-id-card/index.md` with exactly this body**

Reached from: `how-to-get-id-card` (Треба ми помоћ).

```markdown
Нисте ништа покварили. Без важеће личне карте или пасоша нико не може да се региструје.

Личну карту издаје полицијска станица по месту где живите.

1. Замолите неког од породице или комшија да оде са вама у полицијску станицу.
2. Понесите стару личну карту. Ако сте је изгубили, понесите пасош или возачку дозволу.
3. Када добијете нову личну карту, отворите водич и притисните **Наставите где сте стали**.

Шта тачно треба да понесете, пише на [сајту полиције](https://www.mup.gov.rs/wps/portal/sr/gradjani/dokumenta/licna+karta).
```

- [ ] **Step 6: Validate and build**

Run: `npm run validate`
Expected: 0 errors. No new warnings on the four help screens (each is under 150 words; no sentence over 15 words except possibly the first sentence of `help-account`, which is 13 words). If a warning names one of these screens, shorten the sentence it quotes and run again.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
/usr/bin/git add content/graph.yaml content/nodes/help-account/index.md content/nodes/help-technical/index.md content/nodes/help-email/index.md content/nodes/help-id-card/index.md
/usr/bin/git commit -m "content: help screens open with reassurance, name one next action, offer the counter"
```

---

### Task 3: Failure answers where a reader can get stuck, and the graph rule that keeps them (C4)

**Files:**

- Modify: `content/graph.yaml` (`register-upload` lines 128-132, `cloud-login` lines 500-507; new node `help-upload` after `register-upload`)
- Create: `content/nodes/help-upload/index.md`
- Modify: `content/nodes/register-upload/index.md` (last line), `content/nodes/cloud-login/index.md` (last paragraph)
- Modify: `src/lib/graph.ts` (`validateGraph`)
- Test: `src/lib/graph.test.ts`, `npm run validate`, `npm run build`

**Interfaces:**

- Consumes: `help-account` from Task 2 as a failure target.
- Produces: the graph rule "a step with `external` needs `answers` with at least two entries", with the error message `node "<id>" opens another site but has no answer for when that fails; give it "answers" with at least 2 entries`. Task 5 documents it in `AGENTS.md`.

- [ ] **Step 1: Write the failing graph-rule tests**

In `src/lib/graph.test.ts`, inside `describe('validateGraph', ...)`, add:

```ts
  it('requires at least two answers on a step that opens another site', () => {
    // A reader who leaves the guide can fail there; "next" alone gives them no way to say so.
    const withNext = VALID.replace(
      /    answers:\n      - \{ label: Урадио сам, next: card \}\n      - \{ label: Нисам успео, next: help \}\n/,
      '    next: card\n',
    );
    expect(validateGraph(parseGraph(withNext), bodies)).toEqual([
      expect.stringContaining('"register" opens another site but has no answer for when that fails'),
      expect.stringContaining('"help" is unreachable'),
    ]);

    const oneAnswer = VALID.replace('      - { label: Нисам успео, next: help }\n', '');
    expect(validateGraph(parseGraph(oneAnswer), bodies)).toEqual([
      expect.stringContaining('"register" opens another site but has no answer for when that fails'),
      expect.stringContaining('"help" is unreachable'),
    ]);
  });
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/lib/graph.test.ts`
Expected: FAIL, the arrays contain only the "unreachable" error.

- [ ] **Step 3: Add the rule to `validateGraph`**

In `src/lib/graph.ts`, inside the `for (const [id, node] of Object.entries(graph.nodes))` loop of `validateGraph`, after the `needsBody` check, add:

```ts
    if (node.type === 'step' && node.external && (node.answers?.length ?? 0) < 2) {
      errors.push(
        `node "${id}" opens another site but has no answer for when that fails; give it "answers" with at least 2 entries`,
      );
    }
```

- [ ] **Step 4: Run the unit test to see it pass**

Run: `npx vitest run src/lib/graph.test.ts`
Expected: PASS. (`npm run validate` now FAILS on the real content because `cloud-login` has `next`; the next steps fix that.)

- [ ] **Step 5: Give `cloud-login` answers**

In `content/graph.yaml`, change

```yaml
  cloud-login:
    type: step
    title: Пријавите се на сајт eid.gov.rs
    group: Апликација ConsentID
    external:
      label: Отворите пријаву на eid.gov.rs
      url: https://eid.gov.rs/sr-Cyrl-RS/eid
    next: cloud-approve
```

to

```yaml
  cloud-login:
    type: step
    title: Пријавите се на сајт eid.gov.rs
    group: Апликација ConsentID
    external:
      label: Отворите пријаву на eid.gov.rs
      url: https://eid.gov.rs/sr-Cyrl-RS/eid
    answers:
      - label: Урадио/ла сам
        next: cloud-approve
      - label: Не могу да се пријавим
        next: help-account
```

In `content/nodes/cloud-login/index.md`, change the last paragraph

```markdown
Чим притиснете **Пријавите се**, на телефон стиже захтев у апликацији ConsentID. Вратите се у водич и притисните **Даље**. Имате око **један минут**.
```

to

```markdown
Чим притиснете **Пријавите се**, на телефон стиже захтев у апликацији ConsentID. Вратите се у водич и притисните **Урадио/ла сам**. Имате око **један минут**.
```

- [ ] **Step 6: Give `register-upload` answers and add the `help-upload` node**

In `content/graph.yaml`, change

```yaml
  register-upload:
    type: step
    title: Приложите фотографије личне карте
    group: Регистрација
    next: register-personal-data
```

to

```yaml
  register-upload:
    type: step
    title: Приложите фотографије личне карте
    group: Регистрација
    answers:
      - label: Приложио/ла сам обе фотографије
        next: register-personal-data
      - label: Не могу да приложим фотографије
        next: help-upload

  help-upload:
    type: step
    title: Ако не можете да приложите фотографије
    group: Регистрација
    answers:
      - label: Сада је успело
        next: register-personal-data
      - label: И даље не могу
        next: help-account
```

In `content/nodes/register-upload/index.md`, change the last line

```markdown
Када завршите, вратите се у водич на исти начин и притисните **Даље**.
```

to

```markdown
Када завршите, вратите се у водич на исти начин и притисните **Приложио/ла сам обе фотографије**.
```

- [ ] **Step 7: Create `content/nodes/help-upload/index.md` with exactly this body**

```markdown
> Ово радите у формулару на сајту eid.gov.rs, не у водичу.

Нисте ништа покварили. Најчешће је фотографија превелика, или сте у менију изабрали погрешну ставку.

1. Пређите на формулар: притисните дугме са квадратићима, па страницу **eid.gov.rs**.
2. Ако сајт јави да је фотографија превелика, фотографишите личну карту поново, без зумирања.
3. Притисните **Приложите документа**.
4. У менију изаберите **Фототека** или **Галерија**, не **Камера**.
5. Изаберите фотографију предње стране личне карте.
6. Поново притисните **Приложите документа** и изаберите фотографију задње стране.
7. Вратите се у водич и притисните **Сада је успело**.

Ако и даље не иде, притисните **И даље не могу**. Регистрацију можете да обавите и на шалтеру, на пример у пошти.
```

- [ ] **Step 8: Validate, build, run all unit tests**

Run: `npm run validate`
Expected: 0 errors; `help-upload` is reachable; labels are within 40 characters (the longest, „Приложио/ла сам обе фотографије“, is 31). If `validate` reports a label over 40, shorten it and update the matching bold button name in the body in the same change.

Run: `npm run format && npm run check && npm test && npm run build && npm run test:dist`
Expected: all PASS.

- [ ] **Step 9: Commit**

```bash
/usr/bin/git add src/lib/graph.ts src/lib/graph.test.ts content/graph.yaml content/nodes/help-upload/index.md content/nodes/register-upload/index.md content/nodes/cloud-login/index.md
/usr/bin/git commit -m "feat: external steps need a failure answer; upload and sign-in screens get one"
```

---

### Task 4: Finish the "the guide stays open" wording (C8)

**Files:**

- Modify: `content/ui-strings.yaml:10` (`afterExternal`)
- Modify: `content/nodes/confirm-email/index.md`
- Test: `npm run validate`, `npm run build && npm run test:dist` (the dist test `'renders the external button with target _blank and the return instruction'` reads the string from `ui-strings.yaml`, so it keeps passing)

**Interfaces:**

- Consumes: nothing.
- Produces: `afterExternal` no longer contains „вратите се овде“, which Task 5's `terms` rule forbids in interface strings.

- [ ] **Step 1: Change the interface string**

In `content/ui-strings.yaml`, change

```yaml
afterExternal: Када завршите, вратите се овде.
```

to

```yaml
afterExternal: Када завршите, вратите се у водич.
```

- [ ] **Step 2: Add the "stays open" line to `confirm-email`**

In `content/nodes/confirm-email/index.md`, after the first paragraph (the one that starts „Ако користите Gmail“), insert a new paragraph:

```markdown
Имејл се отвара у новој картици. Водич остаје отворен.
```

The file then reads, in order: the callout, the „Ако користите Gmail“ paragraph, the new two-sentence paragraph, the „Отворите своју имејл пошту“ paragraph, the numbered list, the 24-hour paragraph, the image.

- [ ] **Step 3: Validate, build, dist tests**

Run: `npm run validate && npm run build && npm run test:dist`
Expected: 0 errors, build succeeds, dist tests PASS (including the external-button test, which now expects the new string).

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add content/ui-strings.yaml content/nodes/confirm-email/index.md
/usr/bin/git commit -m "content: return-to-guide wording under external buttons; confirm-email says the guide stays open"
```

---

### Task 5: The rules that keep it this way (W4 and the durability mechanism)

**Files:**

- Modify: `src/lib/language.ts` (`RULE_IDS`, new constants, `checkBody`, `checkGraphText`, new `checkUiStrings`, `checkContent`)
- Modify: `src/lib/language.unit.test.ts`
- Modify: `docs/writing-guide.md` (rules 28 and 29), `docs/language-review.md` (criterion 11 and the output table), `.claude/skills/language-review/SKILL.md`, `AGENTS.md`, `docs/language-decisions.md` (rows Д21 to Д23)
- Test: `npm test` (`language.unit.test.ts`, `language-docs.test.ts`, `language.test.ts` on the real content)

**Interfaces:**

- Consumes: `isHelpNode` from `src/lib/graph.ts` (Task 1); the four help bodies and `help-upload` (Tasks 2 and 3) already satisfy the new rules; `ui-strings.yaml` (Task 4) already satisfies them.
- Produces: rule ids `help-screen` and `terms` in `RULE_IDS`; `export const HELP_OPENER = 'Нисте ништа покварили.'`; `export const FORBIDDEN_PHRASES: { pattern: RegExp; write: string }[]`; `export function checkUiStrings(strings: Record<string, string>): Finding[]`.

- [ ] **Step 1: Write the failing unit tests**

Append to `src/lib/language.unit.test.ts`, and add `checkUiStrings` and `HELP_OPENER` to the import from `./language`:

```ts
describe('help screens (rule 28, help-screen)', () => {
  const opener = HELP_OPENER + ' Ово се дешава многима.';

  it('requires the fixed opening sentence as the first sentence of the first paragraph', () => {
    expect(rules(checkBody('help-account', opener))).toEqual([]);
    expect(rules(checkBody('help-account', 'Ако активација није успела, идите на шалтер.'))).toEqual([
      'error:help-screen',
    ]);
    expect(rules(checkBody('help-account', 'Ово се дешава многима. ' + HELP_OPENER))).toEqual([
      'error:help-screen',
    ]);
  });

  it('looks past the callout blockquote and a heading to find the first paragraph', () => {
    const body = '> Ово радите у формулару на сајту eid.gov.rs, не у водичу.\n\n' + opener;
    expect(rules(checkBody('help-upload', body))).toEqual([]);
    const headed = '## Шта да урадите\n\n' + opener;
    expect(rules(checkBody('help-upload', headed))).toEqual([]);
  });

  it('does not apply to screens whose id does not start with "help-"', () => {
    expect(rules(checkBody('register-upload', 'Приложите 2 фотографије.'))).toEqual([]);
    expect(rules(checkBody('helper-screen', 'Приложите 2 фотографије.'))).toEqual([]);
  });

  it('rejects a phone number on a help screen, but not ordinary numbers', () => {
    // toContain, not toEqual: "1234-567" also trips the existing dates warning, which is fine.
    for (const phone of ['Позовите 011 123 456.', 'Позовите 011/1234-567.', 'Позовите +381 11 1234567.']) {
      expect(rules(checkBody('help-account', opener + ' ' + phone))).toContain('error:help-screen');
    }
    // Separate paragraphs, so the paragraph-length warning does not fire.
    const ordinary = [
      opener,
      'ЈМБГ има 13 цифара. Чекате највише 48 сати.',
      'На потврди су 2 броја. Шалтера има преко 1000.',
      'Лозинка има од 8 до 20 знакова. ПИН је на пример 482913.',
    ].join('\n\n');
    expect(rules(checkBody('help-account', ordinary))).toEqual([]);
    // Phone numbers are fine on ordinary screens; the rule is about help screens only.
    expect(rules(checkBody('find-counter', 'Позовите 011 123 456.'))).toEqual([]);
  });
});

describe('forbidden phrases from the term list (rule 29, terms)', () => {
  it('errors on a listed phrase in a body, case-insensitively and with letter boundaries', () => {
    expect(rules(checkBody('x', 'Када завршите, вратите се овде.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Пишите подршци Портала еИД.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Унесите лозинку.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Кликните на дугме.'))).toEqual(['error:terms']);
    expect(rules(checkBody('x', 'Проверите имејл. Упишите лозинку. Притисните дугме.'))).toEqual([]);
    expect(rules(checkBody('counter-list-a', '- **Пошта**, кликните овде.'))).toEqual([
      'error:terms',
    ]);
  });

  it('names the phrase and what to write instead', () => {
    const [finding] = checkBody('x', 'Вратите се овде.');
    expect(finding.message).toContain('вратите се овде');
    expect(finding.message).toContain('Вратите се у водич.');
  });

  it('errors on a listed phrase in a title or answer label', () => {
    const graph = parseGraph(`
start: a
nodes:
  a:
    type: question
    title: Пишите подршци Портала еИД
    answers:
      - { label: Кликните овде, next: b }
      - { label: Даље, next: b }
  b:
    type: end
    title: Крај
`);
    expect(rules(checkGraphText(graph))).toEqual(['error:terms', 'error:terms']);
  });

  it('errors on a listed phrase in an interface string', () => {
    expect(rules(checkUiStrings({ afterExternal: 'Када завршите, вратите се овде.' }))).toEqual([
      'error:terms',
    ]);
    expect(checkUiStrings({ afterExternal: 'Када завршите, вратите се у водич.' })).toEqual([]);
    expect(checkUiStrings({ back: 'Назад' })[0]?.file).toBeUndefined();
    expect(checkUiStrings({ afterExternal: 'вратите се овде' })[0].file).toBe(
      'content/ui-strings.yaml',
    );
  });
});
```

Note for the `checkGraphText` test: `parseGraph` is already imported at the top of this file. The existing `rules` helper maps findings to `severity:rule`.

- [ ] **Step 2: Run the unit tests to see them fail**

Run: `npx vitest run src/lib/language.unit.test.ts`
Expected: FAIL (`HELP_OPENER` and `checkUiStrings` are not exported; no `help-screen` or `terms` findings).

- [ ] **Step 3: Implement the two rules in `src/lib/language.ts`**

Change the import from `./graph` to:

```ts
import { isHelpNode, outgoing, parseGraph, type Graph } from './graph';
```

Extend `RULE_IDS`:

```ts
export const RULE_IDS = [
  'sentence-length',
  'paragraph-length',
  'one-action',
  'screen-length',
  'scripts',
  'gender-form',
  'alt-text',
  'title-label-length',
  'bold',
  'callout',
  'dates',
  'punctuation',
  'help-screen',
  'terms',
] as const;
```

After `RULE_IDS`, add the constants:

```ts
/** Rule 28: every help screen (id "help-…") opens with this sentence, the one allowed exception to rule 4. */
export const HELP_OPENER = 'Нисте ништа покварили.';

/**
 * Rule 28: help screens never give a phone number (the official help has a contact form only).
 * Matches a Serbian number such as 011 123 456, 011/1234-567 or +381 11 1234567, not "13 цифара".
 */
const PHONE_NUMBER = /(?<!\d)(?:\+381|0[1-9]\d)[ /-]?\d{2,4}[ -]?\d{3,4}(?:[ -]?\d{1,3})?(?!\d)/u;

/**
 * Rule 29: phrases from the "Не пишемо" column of docs/terms.md that are never right, with the
 * replacement from the "Пишемо" column. Ambiguous words from that column (страна, пошта, слика …)
 * are left to the language review.
 */
export const FORBIDDEN_PHRASES: { pattern: RegExp; write: string }[] = [
  { pattern: /вратите се овде/iu, write: 'Вратите се у водич.' },
  { pattern: /на ову стран[уи]/iu, write: 'у водич' },
  { pattern: /портал[ау]? еид/iu, write: 'сајт eid.gov.rs' },
  { pattern: /(?<!\p{L})(?:улогујте|излогујте)/iu, write: 'пријавите се, одјавите се' },
  { pattern: /(?<!\p{L})(?:кликните|тапните|додирните)(?!\p{L})/iu, write: 'притисните' },
  { pattern: /(?<!\p{L})(?:укуцајте|унесите)(?!\p{L})/iu, write: 'упишите' },
  { pattern: /(?<!\p{L})(?:штиклирајте|чекирајте)(?!\p{L})/iu, write: 'означите' },
  { pattern: /(?<!\p{L})(?:јузернејм|пасворд)(?!\p{L})/iu, write: 'корисничко име, лозинка' },
  { pattern: /(?<!\p{L})скриншот/iu, write: 'слика' },
  { pattern: /(?<!\p{L})веб-сајт/iu, write: 'сајт' },
  { pattern: /(?<!\p{L})е-пошт/iu, write: 'имејл' },
  { pattern: /(?<!\p{L})мејл(?!\p{L})/iu, write: 'имејл' },
  { pattern: /(?<!\p{L})икониц/iu, write: 'сличица' },
];

/** The forbidden phrases a text contains, as (phrase as written, replacement) pairs. */
export function forbiddenPhrases(text: string): { found: string; write: string }[] {
  const hits: { found: string; write: string }[] = [];
  for (const { pattern, write } of FORBIDDEN_PHRASES) {
    const m = text.match(pattern);
    if (m) hits.push({ found: m[0], write });
  }
  return hits;
}

function termsMessage(hit: { found: string; write: string }): string {
  return `"${hit.found}" is on the "не пишемо" list in docs/terms.md; write "${hit.write}"`;
}
```

In `checkBody`, inside the first `for (const block of blocks)` loop (the one that runs before the directory-node early return), after the `mixesScripts` check for each `text`, add the terms check so it also covers directory nodes:

```ts
      for (const hit of forbiddenPhrases(plainText(text)))
        add(block, 'terms', 'error', termsMessage(hit), text);
```

Keep that inside `for (const text of texts)` so each unit of text is checked once. Alt text is included in `texts` there; that is fine.

At the end of `checkBody`, before `return findings;`, add the help-screen checks:

```ts
  if (isHelpNode(id)) {
    const firstParagraph = blocks.find((b) => b.kind === 'paragraph');
    const firstSentence = firstParagraph
      ? (splitSentences(plainText(firstParagraph.text))[0] ?? '').trim()
      : '';
    if (!firstParagraph || firstSentence !== HELP_OPENER) {
      findings.push({
        file,
        line: firstParagraph?.line ?? 1,
        rule: 'help-screen',
        severity: 'error',
        message: `a help screen opens with "${HELP_OPENER}" as the first sentence of its first paragraph`,
        excerpt: excerpt(firstParagraph?.text ?? ''),
      });
    }
    for (const block of blocks) {
      for (const text of proseTexts(block)) {
        const plain = plainText(text);
        if (PHONE_NUMBER.test(plain)) {
          findings.push({
            file,
            line: block.line,
            rule: 'help-screen',
            severity: 'error',
            message: 'a help screen never gives a phone number; the official help has a contact form only',
            excerpt: excerpt(plain),
          });
        }
      }
    }
  }
```

`splitSentences` in `src/lib/text.ts` keeps the final period on each sentence, so the strict comparison with `HELP_OPENER` is correct.

In `checkGraphText`, inside the `for (const text of [node.title, ...labels])` loop, after the gender-form check, add:

```ts
      for (const hit of forbiddenPhrases(text)) push('terms', `on "${id}": ${termsMessage(hit)}`, text);
```

Add the new exported function after `checkGraphText`:

```ts
/** Rule 29 on the interface strings: a forbidden phrase under every external button is on every screen. */
export function checkUiStrings(strings: Record<string, string>): Finding[] {
  const file = 'content/ui-strings.yaml';
  const findings: Finding[] = [];
  for (const [key, text] of Object.entries(strings)) {
    for (const hit of forbiddenPhrases(text))
      findings.push({
        file,
        line: 0,
        rule: 'terms',
        severity: 'error',
        message: `${key}: ${termsMessage(hit)}`,
        excerpt: excerpt(text),
      });
  }
  return findings;
}
```

In `checkContent`, after `const findings = checkGraphText(graph);`, add:

```ts
  const uiFile = path.join(root, 'content', 'ui-strings.yaml');
  if (existsSync(uiFile)) {
    const strings = parse(readFileSync(uiFile, 'utf8')) as Record<string, unknown>;
    const onlyStrings = Object.fromEntries(
      Object.entries(strings ?? {}).filter((e): e is [string, string] => typeof e[1] === 'string'),
    );
    findings.push(...checkUiStrings(onlyStrings));
  }
```

and add `import { parse } from 'yaml';` at the top of the file (the `yaml` package is already a dependency and `graph.ts` imports it the same way).

- [ ] **Step 4: Run the unit tests to see them pass**

Run: `npx vitest run src/lib/language.unit.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the real-content check and the docs test**

Run: `npx vitest run src/lib/language.test.ts src/lib/language-docs.test.ts`
Expected: `language.test.ts` PASSES (the five help screens and `ui-strings.yaml` already comply after Tasks 2 to 4; if an error names another screen, fix that screen's phrase using the replacement in the message and note it in the commit). `language-docs.test.ts` FAILS: the guide does not yet mention `(help-screen)` and `(terms)`. The next step fixes that.

- [ ] **Step 6: Add rules 28 and 29 to `docs/writing-guide.md`**

After rule 27 (the last item under `## Екран`), add a new section:

```markdown
## Помоћ и речи

28. **Екран за помоћ** (help-screen). Екран чији ид почиње са `help-` је екран за помоћ. Прва
    реченица првог пасуса (после оквира из правила 26, ако га има) увек гласи: „Нисте ништа
    покварили.“ То је једини дозвољени изузетак од правила 4. После ње иде 1 следећа радња, а
    шалтер се нуди као редован пут кад год може. Екран за помоћ никад не наводи број телефона:
    подршка сајта eid.gov.rs има само контакт форму. Екран за помоћ типа `end` задржава дугме
    **Назад**, да читалац може да покуша поново. Екран на који води одговор о неуспеху („Нисам
    успео/ла“, „Не могу…“) пише се по истом правилу, и кад му ид не почиње са `help-`.
29. **Речи са списка** (terms). Провера пријављује грешку за изразе из колоне „Не пишемо“ у
    `docs/terms.md` који су увек погрешни: „вратите се овде“, „на ову страну“, „Портал еИД“,
    „улогујте се“, „излогујте се“, „кликните“, „тапните“, „додирните“, „укуцајте“, „унесите“,
    „штиклирајте“, „чекирајте“, „јузернејм“, „пасворд“, „скриншот“, „веб-сајт“, „е-пошта“, „мејл“,
    „иконица“. Проверава тела екрана, наслове, одговоре и `content/ui-strings.yaml`. Остале речи из
    те колоне (страна, пошта, слика…) проверава преглед пре спајања, јер имају и исправна значења.
```

Also change the second sentence of the guide's introduction so the count stays right if it names one (it does not today; leave it if it does not).

- [ ] **Step 7: Add criterion 11 to `docs/language-review.md` and update the skill**

In `docs/language-review.md`, add a row to the criteria table after row 10:

```markdown
| 11 | Help and failure screens | A screen whose id starts with `help-`, and every screen a failure answer leads to, opens with „Нисте ништа покварили.“, names one next action, offers the counter as a normal route where it applies, and gives no phone number. A set of changed screens with no such screen scores 3. |
```

In the same file, change "Score each criterion below" in step 3 to "Score each of the 11 criteria below". The "Output format" block uses an ellipsis row, so it needs no change.

In `.claude/skills/language-review/SKILL.md`, change "score the ten rubric criteria" in the description to "score the eleven rubric criteria", and in step 5 change "Score the ten criteria" to "Score the eleven criteria".

- [ ] **Step 8: Update `AGENTS.md`**

Under "Rules the build enforces", in the graph bullet list, add a bullet after the `question`/`step`/`end` bullet:

```markdown
- a `step` with `external` has `next` or a single answer instead of at least two `answers` (a reader
  who leaves the guide can fail there and needs an answer that says so).
```

In the language-check list (the one that starts "and, from the language check"), add two bullets at the end:

```markdown
- a help screen (an id starting with `help-`) does not open with „Нисте ништа покварили.“ or gives
  a phone number (`help-screen`),
- a body, title, answer label or interface string uses a phrase from the fixed forbidden list in
  rule 29 of `docs/writing-guide.md`, such as „вратите се овде“ or „кликните“ (`terms`).
```

Change "`docs/writing-guide.md` (Serbian, 27 rules with examples)" to "29 rules", and extend the rule-id list in that paragraph to end with `…, dates, punctuation, help-screen, terms`.

Under "Node types", after the YAML block, add one paragraph:

```markdown
An `end` node whose id starts with `help-` is a help screen: it keeps the Назад button so the reader
can retry, and its body follows rule 28 of `docs/writing-guide.md` (it opens with „Нисте ништа
покварили.“, names one next action, never gives a phone number). Every `step` with `external` needs
at least two answers, one of them for when the other site fails.
```

- [ ] **Step 9: Add decision rows D22 to D24 to `docs/language-decisions.md`**

The log is written in English (decision D21); decided words stay in Serbian Cyrillic quotes. The header row is `| No. | Date | Decision | Reason | Source | Decided by | Applies to |`. Insert directly under the header, above D21 (newest first):

```markdown
| D24 | 2026-10-07 | A node whose id starts with `help-` is a help screen: it keeps the **Назад** button even when its type is `end`; every `step` with `external` must have at least 2 answers. | After PR #12 the help screens had no way back, and a reader who left for another site had no answer for failure. Research: GOV.UK Verify succeeded on the first attempt for only 48% of users, so failure paths are a core feature. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, items C3 and C4; branch `research/elderly-vulnerable-users` | Filip | `src/lib/graph.ts`, `src/components/NodePage.astro`, `AGENTS.md` |
| D23 | 2026-10-07 | The `terms` check reports an error for 19 unambiguous phrases from the „Не пишемо“ column, in bodies, titles, answer labels and `content/ui-strings.yaml`. | „вратите се овде“ sat under every external button although the term list forbids it; a list without a check is not followed. | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, item C8; branch `research/elderly-vulnerable-users` | Filip | `docs/writing-guide.md`, rule 29; `src/lib/language.ts` |
| D22 | 2026-10-07 | A help screen opens with „Нисте ништа покварили.“, offers 1 next action and the counter as a normal route, and never gives a phone number. That sentence is the only exception to rule 4. | Older readers blame themselves and give up after an error (Bong & Li 2025; Gomez-Hernandez 2023); the official help has no phone line (eid.gov.rs). | `docs/research/2026-10-07-elderly-and-vulnerable-users.md`, item W4; branch `research/elderly-vulnerable-users` | Filip | `docs/writing-guide.md`, rule 28; `docs/language-review.md`, criterion 11; `src/lib/language.ts` |
```

- [ ] **Step 10: Run everything**

Run: `npm run format && npm run check && npm test && npm run validate && npm run build && npm run test:dist`
Expected: all PASS, 0 validate errors. `grep -n "27 rules\|ten criteria\|ten rubric" AGENTS.md CONTRIBUTING.md docs/language-review.md .claude/skills/language-review/SKILL.md` prints nothing.

- [ ] **Step 11: Commit**

```bash
/usr/bin/git add src/lib/language.ts src/lib/language.unit.test.ts docs/writing-guide.md docs/language-review.md .claude/skills/language-review/SKILL.md AGENTS.md docs/language-decisions.md
/usr/bin/git commit -m "feat: help-screen and terms language rules; writing rules 28 and 29; review criterion 11"
```

---

### Task 6: Final verification and the language review for the pull request

**Files:**

- Modify: this plan file (append the review output under a `## Language review` heading at the end)

- [ ] **Step 1: Manual check of Назад on a help screen**

Run: `npm run dev` (background), open `http://localhost:4321/egradjanin-korak-po-korak/step/register-open/`, press „Страница се не отвара“, confirm the help screen shows both **Назад** and **На почетну страну**, press **Назад** and confirm it returns to `register-open`. Then open `.../step/register-upload/`, press „Не могу да приложим фотографије“, confirm `help-upload` renders with its callout, two answers and a Назад button. Stop the dev server.

If Назад returns home instead of to `register-open`, the client script did not rewrite the link: check that the help page still renders `a[data-back]` (Task 1 Step 7) and fix before continuing.

- [ ] **Step 2: Run the language review**

Follow `docs/language-review.md` on every changed screen (`help-account`, `help-technical`, `help-email`, `help-id-card`, `help-upload`, `register-upload`, `cloud-login`, `confirm-email`), scoring all 11 criteria. In Claude Code, `/language-review` does this. Paste the full output block, verdict included, at the end of this plan file under a `## Language review` heading. If the verdict is `needs work`, apply the listed edits, re-run `npm run validate`, and run the review again until it passes.

- [ ] **Step 3: Full test run and commit**

Run: `npm run format:check && npm run check && npm test && npm run build && npm run test:dist`
Expected: all PASS.

```bash
/usr/bin/git add docs/superpowers/plans/2026-10-07-help-screens-and-failure-paths.md
/usr/bin/git commit -m "docs: language review for the help-screen and failure-path changes"
```

Do not push and do not open a pull request; the branch owner does that.
