# Plain-language standard: design

Date: 2026-10-07. Status: approved in conversation, pending spec review.
Research behind it: `docs/research/2026-10-07-plain-language.md` and the four reports in
`docs/research/plain-language/`.

## 1. Goal

Make the guide's Serbian simpler, cleaner and consistent, and keep it that way as teammates and
their Claude or Codex sessions add content. The model is ASD-STE100's structure, rules plus a term
list, filled with plain-language rules that the world's standards agree on and with Serbian wording
from "Информације за све". Readers never see a glossary: every term is explained in place.

## 2. Decisions already taken

| Question                        | Decision                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OQ1, enforcement depth          | A written guide is mandatory. Automated checks go as deep as is deterministic in TypeScript. Judgement rules go to a review rubric.                                        |
| OQ2, the level                  | Plain language tuned for elderly readers, not full easy-to-read. A term list exists for authors and agents only, broader than a dozen rows, not exhaustive. No reader-facing glossary. |
| OQ3, gender forms               | One fixed slash pattern everywhere, enforced by CI: the masculine form, a slash, the feminine ending, no hyphen, no space: "успео/ла", "пријављен/а", "сигуран/на".        |
| OQ4, the "Ово радите у" banners | A fixed template rendered as a callout box by the site, written as a Markdown blockquote. No full-sentence bold.                                                           |
| OQ5, guide language             | The guide and the term list are in Serbian Cyrillic with English rule ids. `AGENTS.md` carries an English summary.                                                        |
| OQ6, dates and times            | Month in words in prose ("13. октобар 2026."), ranges as "од 9 до 18 часова", the directory tables keep their source format.                                               |
| Agent entry point               | `CLAUDE.md` is renamed to `AGENTS.md` so Codex and other tools read it. `CLAUDE.md` stays as a one-line import, `@AGENTS.md`.                                             |
| The review before merge         | A repo skill `/language-review`, a "Language review" section in the PR template, and a CI step that fails when `content/` changed and the section is not filled in. Plus an optional Claude Code hook that reminds before `gh pr create`. |

## 3. Deliverables

### 3.1 Writing guide: `docs/writing-guide.md` (Serbian Cyrillic)

One page, about 24 numbered rules, each with an English rule id in parentheses (the id CI messages
use), one sentence of rule, and a Serbian before/after pair taken or adapted from our own content.
The rules, in the order of the research synthesis section 4.1:

| Id                  | Rule                                                                                                                                                  | Where enforced                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| sentence-length     | At most 20 words per sentence; aim for 15. Split with a full stop, not a comma.                                                                       | CI error over 20, warning over 15 |
| everyday-words      | Everyday words. The short Serbian word before the loanword when both are common.                                                                       | Review                           |
| imperative          | Instructions are imperatives addressed to the reader as "ви". No passive or impersonal forms.                                                          | Review                           |
| one-action          | One idea per sentence, one action per numbered step.                                                                                                  | CI warning on a step with 3+ sentences; review |
| explain-in-place    | A term is explained where it first appears on each path, keeping the word the reader will see on screen: "ПИН (број од 6 цифара који сами смислите)". | Review                           |
| positive            | Say what to do. No double negatives. "Не" only for real warnings.                                                                                      | Review                           |
| abbreviations       | Avoid abbreviations. ЈМБГ, ПИН and QR are allowed and explained on first use on each path.                                                            | Review                           |
| address             | "ви" everywhere, lowercase. Never "ти". Never "ми" as the authors.                                                                                     | Review                           |
| verbs-not-nouns     | "проверите", not "извршите проверу".                                                                                                                   | Review                           |
| numbered-steps      | Anything done in order is a numbered list. Three or more items of any kind are a list.                                                                 | Review                           |
| action-first        | The action comes first on the screen and in the sentence. Conditions belong in question screens.                                                       | Review                           |
| literal             | No metaphors.                                                                                                                                         | Review                           |
| digits              | Numbers as digits, including 2 to 9. Four-digit numbers without a separator ("1400"). No percentages, no Roman numerals.                              | Review                           |
| alt-text            | Every image has alt text of at least 3 words that says what to look for.                                                                              | CI error                         |
| bold                | Bold only the word to tap or the thing to look for. No bold sentences.                                                                                 | CI warning on a bold span over 4 words |
| one-word            | One word for one thing, from the term list. Never a synonym, never a second meaning.                                                                   | Review, with the term list       |
| paragraph-length    | At most 3 sentences per paragraph.                                                                                                                    | CI warning                       |
| must-can            | "морате" or the imperative for what is required, "можете" for what is optional.                                                                        | Review                           |
| dates               | "13. октобар 2026.", "од 9 до 18 часова". No dash or slash in a date or a range.                                                                       | CI warning on a dash range in prose |
| self-contained      | Every screen stands alone. Repeat instead of referring back.                                                                                           | Review                           |
| scripts             | Latin only for brand names, domains and quoted interface labels, introduced as "(на енглеском Allow)". Never a Latin letter inside a Cyrillic word.      | CI error on a mixed-script word  |
| every-step          | Include every step, even "притисните Даље".                                                                                                           | Review                           |
| screen-length       | At most 150 words of body per screen. Split a longer screen.                                                                                           | CI warning                       |
| title-label-length  | Titles at most 50 characters, answer labels at most 40.                                                                                                | CI error                         |
| gender-form         | The fixed slash pattern from OQ3.                                                                                                                      | CI error on any other pattern    |
| callout             | The "where you do this" banner is a blockquote with the fixed wording from section 3.4.                                                                | CI warning on a bold banner      |

The guide ends with a short "how a screen is built" section: callout, one-line purpose, numbered
steps, image with alt text, answers.

### 3.2 Term list: `docs/terms.md` (Serbian Cyrillic)

A Markdown table for authors and agents: concept (in English, for the id), the word we use, the
words we do not use, and the explanation to give on first use. Seeded from the baseline audit's
section 4 with about 30 rows, including at least:

| Concept                  | Use                              | Do not use                                      | Explain on first use as                              |
| ------------------------ | -------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| browser tab              | картица                          | страница (for a tab)                            | "картица, као лист папира у прегледачу"              |
| web page                 | страница                         | страна, сајт (for a page)                       |                                                      |
| the ID card              | лична карта                      | картица, ЛК, документ (outside form labels)     |                                                      |
| side of the card         | предња / задња страна личне карте |                                                 |                                                      |
| this guide               | водич                            | ова страна, овде                                |                                                      |
| return to the guide      | "Вратите се у водич."            | "вратите се овде", "на ову страну"              |                                                      |
| the registration site    | сајт eid.gov.rs                  | Портал еИД, eID.gov.rs, формулар (for the site) |                                                      |
| the form on that site    | формулар                         | форма                                           |                                                      |
| sign in                  | пријавите се                     | улазите, уђете                                  |                                                      |
| register                 | региструјте се / регистрација    | отворите налог, направите налог                 |                                                      |
| account                  | налог                            | рачун, профил                                   |                                                      |
| email                    | имејл                            | мејл, е-пошта, електронска пошта                |                                                      |
| mailbox                  | имејл (never пошта alone)        | пошта (for the mailbox)                         |                                                      |
| post office              | пошта                            |                                                 |                                                      |
| activate ConsentID       | активирајте апликацију           | укључите, покрените (for this)                  |                                                      |
| the counter paper        | the word printed on the paper the clerk hands over, which the implementer checks against the official eID instructions; "потврда" only if that is the printed word, and then never for the confirm button or the email | потврда in its other senses | "папир који добијете на шалтеру, са два броја" |
| user ID from the counter | the label printed on that paper, verified the same way | the other three variants         |                                                      |
| PIN                      | ПИН                              | шифра, лозинка (for the PIN)                    | "број од 6 цифара који сами смислите"                |
| password                 | лозинка                          | шифра, ПИН (for the password)                   |                                                      |
| photo you upload         | фотографија                      | слика (for the upload)                          |                                                      |
| illustration on a screen | слика                            |                                                 |                                                      |
| tap                      | притисните                       | кликните, додирните, тапните                    |                                                      |
| type in                  | упишите                          | унесите, укуцајте                               |                                                      |
| choose                   | изаберите                        | одаберите                                       |                                                      |
| tick a box               | означите                         | штиклирајте, чекирајте                          |                                                      |
| button                   | дугме                            | тастер, иконица                                 |                                                      |
| cloud signature          | сертификат у клауду              | потпис у клауду, квалификовани електронски сертификат | "начин да се потпишете телефоном, без читача картица" |
| QR code                  | QR код                           |                                                 | "квадрат са црним тачкицама који телефон очитава"    |
| helper                   | неко од породице или комшија     | укућани                                         |                                                      |
| police station           | полицијска станица               | МУП, полиција (as a place)                      |                                                      |

The implementer checks every "use" value against the official screens the reader sees (eid.gov.rs,
the ConsentID app) and keeps the official word where the two differ, because the reader must
recognise it on screen.

### 3.3 `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`

- `git mv CLAUDE.md AGENTS.md`. The content stays, with these additions: a "Writing standard"
  section in English that lists the rule ids in one paragraph, links `docs/writing-guide.md` and
  `docs/terms.md`, and states: before opening or updating a pull request that changes `content/`,
  run the language review (`/language-review` in Claude Code, or follow `docs/language-review.md`
  in any other tool) and paste its result into the PR's "Language review" section.
- New `CLAUDE.md` containing only `@AGENTS.md` and a comment line saying why.
- `CONTRIBUTING.md`, `README.md` and the PR template point to `AGENTS.md` where they pointed to
  `CLAUDE.md`.

### 3.4 Callout box

- Markdown: a blockquote as the first block of a body, with the fixed wording
  `> Ово радите у <place>, не у водичу.` where `<place>` is one of a few fixed phrases
  ("формулару на сајту eid.gov.rs", "апликацији ConsentID на телефону", "својој имејл пошти",
  "продавници апликација на телефону"). A second sentence is allowed only for the image disclaimer
  template: `Слике су само пример. Не притискајте их.`
- Rendering: `src/styles/global.css` styles `.body blockquote` as a box: left border in the accent
  colour, light background, 16px padding, 20px text, no italics. No component or schema change.
- Migration: the ten bodies that open with a bold banner are converted to the blockquote wording.
  The sentences that followed the banner stay as a normal paragraph.

### 3.5 CI language check: `src/lib/language.ts`, `src/lib/language.test.ts`

Pure TypeScript, no new runtime dependency, no Python. Runs under `npm run validate` (the script
becomes `vitest run src/lib/content.test.ts src/lib/language.test.ts`) and therefore in CI's `npm
test`. Input: every `content/nodes/*/index.md` body, plus titles and labels from `graph.yaml`.

Text handling, line-based (the content uses headings, paragraphs, lists, bold, images, blockquotes
and inline `<a>` tags only):

- Strip front matter, HTML tags (keep link text), image syntax (keep alt text as its own scope).
- Blocks split on blank lines. A block of list items is a list; each item is its own unit.
- Sentences split on `.`, `!`, `?`, `…` followed by whitespace and a capital, digit, quote, bracket
  or `**`. Never split after бр, нпр, тзв, итд, тј, ул, г, or a one- or two-digit ordinal, or inside
  a domain.
- Words are runs of letters or digits, with hyphens, dots and apostrophes allowed inside. Letters
  are counted with `\p{L}`, never bytes. JavaScript `\b` is never used; boundaries are
  `(?<!\p{L})` and `(?!\p{L})`.
- Nodes whose id starts with `counter-list-` are directory tables: only `scripts` and
  `title-label-length` apply to them.

Rules, severities and current expected hits (from the baseline audit at `93be62c`):

| Id                 | Scope            | Severity | Threshold                                                     | Expected today               |
| ------------------ | ---------------- | -------- | ------------------------------------------------------------- | ---------------------------- |
| sentence-length    | body sentences   | error    | over 20 words                                                 | 2, fixed in this work        |
| sentence-length    | body sentences   | warning  | over 15 words                                                 | about 16                     |
| paragraph-length   | paragraphs       | warning  | over 3 sentences                                              | 2                            |
| one-action         | numbered items   | warning  | 3 or more sentences in one item                               | about 12                     |
| screen-length      | body             | warning  | over 150 words, headings included, alt text excluded          | 6                            |
| scripts            | every word       | error    | a word mixing Latin and Cyrillic letters                      | 6, fixed in this work        |
| gender-form        | bodies and labels | error   | a slash form (Cyrillic letters, a slash, 1 to 3 Cyrillic letters, with or without a hyphen or spaces) whose right side is not exactly ла, а or на, or that has a hyphen or space at the slash. "и/или" is therefore an error too; the guide says to write "или". URLs are skipped. | 0 after migration |
| alt-text           | images           | error    | missing, empty, equal to the file name, or under 3 words      | 0                            |
| title-label-length | graph.yaml       | error    | title over 50 characters, answer or external label over 40    | 0                            |
| bold               | bold spans       | warning  | over 4 words                                                  | about 25, 10 fixed by the callout migration |
| callout            | first block      | warning  | a body whose first paragraph starts with a bold "Ово радите"  | 10, fixed by the migration   |
| dates              | body             | warning  | a digit, an en dash or hyphen, and a digit, outside directory nodes | few                     |
| punctuation        | body             | warning  | double space, space before `.,;:!?`                           | few                          |

Behaviour: errors fail the test with one line per finding in the form
`content/nodes/<id>/index.md: <rule-id>: <message> — "<excerpt>"`. Warnings are printed in the same
form under a "Warnings" heading and do not fail. The test also prints a two-line readability trend:
mean sentence length and share of words over six letters, prose nodes only.

Opt-out: an HTML comment `<!-- language-ignore <rule-id> -->` on the line before a block disables
that rule for that block. The guide says this is for a justified exception and the review asks why.

`AGENTS.md`'s "Rules the build enforces" section lists the error-level rules in the same style as
the existing graph rules.

### 3.6 Review rubric and skill

- `docs/language-review.md` (English, Serbian examples): the rubric. Ten criteria, each scored 0 to
  3, modelled on the Finnish Selkomittari: one action per step; imperative and "ви"; positive
  phrasing; every pronoun has a clear referent; every term explained on first use on this path;
  no passive or impersonal forms; one word for one thing per `docs/terms.md`; calm tone; alt text
  says what to look for; text matches the screenshot labels. Pass: every criterion scores 2 or 3.
  Output format, fixed: a Markdown table `criterion | score | note`, then `Verdict: pass` or
  `Verdict: needs work`, then a list of concrete edits with node id and the sentence.
- `.claude/skills/language-review/SKILL.md`: a skill named `language-review` that reads
  `docs/writing-guide.md`, `docs/terms.md`, `docs/language-review.md` and the diff of `content/`
  against `main`, reviews only changed or added screens, and prints the output format above. It
  runs in a forked context so the review is not biased by the session that wrote the content.
  `disable-model-invocation` is off, so a session may run it on its own when `AGENTS.md` tells it to.

### 3.7 Pull-request gate

- `.github/pull_request_template.md` gains a section:

  ```markdown
  ## Language review

  <!-- Paste the output of /language-review (or docs/language-review.md) here when content/ changed. -->
  ```

- `scripts/check-pr-language-review.mjs`: reads the PR body from an environment variable and the
  list of changed files from arguments. If any changed file is under `content/` and the body's
  "Language review" section has no `Verdict:` line, it exits 1 with the message
  `content/ changed but the pull request has no language review. Run /language-review and paste the result under "## Language review".`
  A `Verdict: not needed` line with a reason is accepted for image-only or typo changes.
- `ci.yml` gains a step in the `build` job, on pull requests only, that computes the changed files
  against the base and runs the script with the PR body. No new required check is needed because
  `build` is already required.

### 3.8 Optional reminder hook

- `.claude/settings.json` (committed) with a `PreToolUse` hook on the Bash tool running
  `scripts/hooks/pr-reminder.sh`. The script reads the hook's JSON from stdin, and if the command
  is a `gh pr create` or `gh pr edit` and `git diff --name-only origin/main...HEAD` lists a file
  under `content/`, and the command's body text (inline `--body` or the `--body-file` contents) has
  no `Verdict:` line, it prints the same message as the CI gate to stderr and exits 2, which
  blocks the command and shows the message to the session. Otherwise it exits 0.
- Scope: Claude Code sessions only. CI remains the enforcement for everyone else.

### 3.9 Content fixes included in this work

Only what the new error-level rules require, plus the migration:

- The six Latin homoglyphs inside Cyrillic words in the directory screens, and the spacing around
  the Roman numeral in `counter-list-t`.
- The two sentences over 20 words (activate-consentid, cloud-approve), split in place.
- The ten bold banners, converted to the callout blockquote.
- Any slash form that does not match the fixed pattern.

Everything the warning-level rules and the term list flag is left for the team, listed in the PR
description as a follow-up, so the content owners decide the wording.

## 4. Out of scope

- A reader-facing glossary or a glossary screen.
- Vocabulary checks in CI (banned words, Latin allowlist, abbreviation allowlist). The term list is
  enforced by the review.
- Serbian NLP (CLASSLA), passive detection, readability scores as a gate.
- One sentence per line and other full easy-to-read layout rules.
- Rewriting the six long screens and the answer-label voices. Those are content work for the team
  under the new guide.

## 5. Testing

- `src/lib/language.test.ts` runs on the real content, as `content.test.ts` does.
- `src/lib/language.unit.test.ts` covers the engine with fixtures: sentence splitting with
  abbreviations, domains and ordinals; Cyrillic letter counting; every rule with one positive and
  one negative case; the directory-node exemption; the opt-out comment.
- `scripts/check-pr-language-review.test.ts`: body with verdict, body without, `not needed`, no
  content changes.
- The hook script is tested by hand in the PR description (blocked once, allowed after pasting).
- `npm run build`, `npm run test:dist` and Lighthouse stay green; the callout CSS passes the
  contrast audit.

## 6. Rollout

1. This spec and its plan on the research branch; PR #11 stays docs-only and merges first.
2. Implementation on a new branch, one PR, executed task by task with subagents.
3. After merge, the team's next content PRs get the review section and the warnings list; the
   long screens and label voices are rewritten by the content owners.
