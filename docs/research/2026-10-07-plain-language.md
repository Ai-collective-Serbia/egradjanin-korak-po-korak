# Simpler, cleaner language for the guide: research synthesis

Date: 2026-10-07. Status: research, no decision taken yet. Four reports back this synthesis and
live next to it in `plain-language/`:

| Report                                                       | What it covers                                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [serbian-regional.md](plain-language/serbian-regional.md)    | What exists for Serbian, Croatian, Bosnian, Montenegrin and Slovenian, with a 69-row search log and Pravopis notes |
| [world.md](plain-language/world.md)                          | 31 international sources across three traditions, and 24 rules ranked by how many sources agree                  |
| [tooling.md](plain-language/tooling.md)                      | What can be checked automatically for free, Serbian NLP feasibility, and a tiered rule table                     |
| [baseline-audit.md](plain-language/baseline-audit.md)        | Measurements of our current content at main `93be62c`, including the synonym and homonym tables                  |

The question was: does something like ASD-STE100 (Simplified Technical English) exist for Serbian,
what exists in the world, and what should we adapt for this project.

## 1. Short answer

1. **Nothing like ASD-STE100 exists for Serbian** or any neighbouring language. No controlled
   language, no approved word list, no readability formula calibrated for Serbian. Serbia has not
   adopted the plain-language standard ISO 24495-1; only Slovenia has, as an English endorsement.
2. **Three usable regional sources exist**, all free. The Serbian easy-to-read standard
   "Информације за све" (Inclusion Europe, adapted by Caritas Srbije, 2023) gives ready-made Serbian
   wording for 45 written-text rules. The Croatian 2021 e-services standard was written for exactly
   our kind of product. The Slovenian "Lahko je brati 2" (2019) is the most concrete rule set.
3. **The world's three traditions agree on a core** of about ten rules: short sentences, one idea
   per sentence and one action per step, imperative addressed to the reader, common words, the
   same word for the same thing, numbered steps, explain a term where it first appears, digits for
   numbers, and testing with real readers.
4. **ASD-STE100 transfers as a method, not as a dictionary.** What transfers: one word for one
   meaning, a project term list, imperative procedural steps, the condition before the action. Its
   900 English words do not.
5. **Our content already has short sentences.** Mean 7.7 words per sentence, maximum 21. Only two
   sentences exceed 20 words. A sentence-length rule would change almost nothing.
6. **Our real problems are elsewhere**: one word used for several things (картица means a browser
   tab, the ID card, a bank card and a smart card), several words for one thing (a browser tab is
   картица or страница; activating the app is активирајте, укључите and активирана on one screen),
   six screens over 150 words, answer labels in five different voices, and abbreviations used
   before they are explained (QR is used on four screens before "Шта је QR код").
7. **Most of the fix is a term list plus a short guide.** Automated checks can enforce the
   mechanical part for free in TypeScript under `npm run validate`. The judgement part fits a
   Claude PR-review rubric, which the team already uses.

## 2. What exists

### 2.1 Three traditions, and which one fits us

| Tradition                                                                         | Examples                                                                                                            | Ships a word list              | Fit for elderly readers on a phone                                                                                                   |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Controlled language**: rules plus an approved dictionary, one meaning per word | ASD-STE100 (aerospace, Issue 9, 2025, free), Caterpillar Technical English, Microsoft and IBM style guides           | Yes, about 900 words in STE    | The method fits (term list, imperative steps). The vocabulary, the "-ing" rules and the trained-technician assumption do not.          |
| **Plain language**: clear writing for the general public                         | ISO 24495-1:2023, GOV.UK, NHS, US plainlanguage.gov, EU "How to write clearly", Sweden Klarspråk, Canada, Australia | No; GOV.UK has a words-to-avoid list | Closest to our register. NHS gives the tightest verified numbers: 20 words per sentence, 3 sentences per paragraph, reading age 9 to 11. |
| **Easy-to-read**: for people with intellectual or cognitive disabilities         | Inclusion Europe "Information for all", German Leichte Sprache and DIN SPEC 33429, Finnish selkokieli, Easy Japanese | No                             | Stricter than we need in full, but its layout rules (one sentence per line, no hyphenation, 14 pt, left-aligned) and its term-explanation rules fit phones well. |

Two sources outside the traditions matter for a wizard: the W3C guidance "Making Content Usable
for People with Cognitive and Learning Disabilities" (2021), which asks to show completed, current
and pending steps and to include even the obvious steps, and Finnish selkokieli, the closest
analogue for an inflected language, which bans participle constructions, rare cases and passive
instructions.

### 2.2 For Serbian and the region

| Source                                                                    | Year | Tradition     | Usable for us                                                                                                                                  |
| ------------------------------------------------------------------------- | ---- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Информације за све / Informacije za sve (Inclusion Europe, Caritas Srbije) | 2023 | Easy-to-read  | Serbian wording for the rules; five Serbian-specific rules (digits not words, no Roman numerals, present tense, no elisions, dates in digits)   |
| Standard razvoja javnih e-usluga u RH: Smjernice (Croatian government)   | 2021 | Plain language | Rules for e-service UI text: short sentences, closed questions, no "click the green button", offer a "Nisam siguran/na" answer, one service one name |
| Lahko je brati 2: Pravila (Zavod Risa, Slovenia)                          | 2019 | Easy-to-read  | 59 concrete rules, including "write *ali* instead of /", big numbers rounded, ranges as "od ... do"                                            |
| ITE Смернице за израду веб презентација органа државне управе v5.0        | 2014 | Plain language (weak) | Only says to author in Cyrillic and generate Latin (which we do) and to use trained writers. No eUprava style guide exists.             |
| Језичке смернице МЕИ (EU acquis translation rules)                        | 2016 | House style   | Pravopis-aligned rules for dates, thousands, "ако" not "уколико", "сат" not "час"                                                               |
| Закон о заштити података о личности, чл. 21                               | 2018 | Legal hook    | The only Serbian statute that requires "јасних и једноставних речи"                                                                            |

Two places where easy-to-read rules and Pravopis disagree, which our guide must settle:
dates ("13.10.2023." in easy-to-read against "13. 10. 2023." in Pravopis practice) and digits
versus words for small numbers.

Pravopis supports what we already do: "Гугл" in Cyrillic with "Google" generated in Latin, case
endings after a hyphen ("ЈМБГ-а"), and a capital only on the first word of an institution's name.

### 2.3 Automated checking

- No existing linter supports Serbian. LanguageTool dropped its Serbian module from releases in 2018.
  Vale and textlint run on Cyrillic only with hand-written rules, and Vale's default word boundary
  silently never matches Cyrillic. A bespoke TypeScript check under `npm run validate` is cheaper
  and needs no Python.
- **Inflection is solvable without NLP at check time.** Expand each listed word (lemma) once,
  offline, into all its forms from the free srLex lexicon (CC BY-SA 4.0), commit the generated map,
  and look words up after transliteration to Latin. CLASSLA, the only strong Serbian lemmatiser,
  needs PyTorch and a 173 MB Latin-script model, so it fits only an optional job.
- No readability formula is calibrated for Serbian. Hard caps per sentence plus a corpus-level trend
  of the two LIX inputs (sentence length, share of words over six letters) is the honest substitute.

## 3. Where our content stands (main at `93be62c`)

| Measure                                 | Value                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Prose screens / body words              | 34 / 3,633 (mean 107 per screen)                                        |
| Words per sentence                      | mean 7.7, median 7, max 21                                              |
| Sentences over 15 / over 20 words       | 16 (3.5%) / 2 (0.4%)                                                    |
| Screens over 150 words                  | 6; activate-consentid has 340 words, 5 headings, 4 lists                |
| Paragraphs with 4+ sentences            | 2                                                                       |
| Gender slash forms                      | 14 forms, 22 uses in prose, plus one label on all 24 counter-list screens |
| Abbreviations never explained           | ПИН, ЈМБГ, МУП, еИД, ИД, MB; QR explained four screens after first use  |
| Instruction verbs                       | consistent: притисните 84, упишите 16; кликните and унесите never used   |

The baseline audit and the tooling report measured the content with different sentence splitters
(458 against 482 sentences; 16 against 19 sentences over 15 words). The baseline audit's figures are
the canonical ones; the tooling report's agree in every conclusion.

The 24 `counter-list-*` directory screens are address tables, excluded from prose statistics. They
carry six Latin homoglyphs inside Cyrillic words (a Latin "o" in "oслобођења") that break search,
screen readers and transliteration, and 27 opening-hours lines with missing spaces.

The highest-value findings, in order:

1. **Homonyms.** картица (4 senses), страна (this screen, side of the card, store page; both senses
   on one screen in register-document-data), потврда (paper slip, confirm button, email
   confirmation, phone approval; six uses on activate-consentid), пошта (mailbox and post office),
   слика (screenshot you must not tap, photo you must upload).
2. **Synonyms.** Browser tab: картица or страница. The guide itself: ова страна, водич, овде.
   "Come back here": four phrasings. Activate the app: three verbs on one screen. The user ID from
   the counter: ИД корисника and кориснички ИД four lines apart. Sign in: пријавите се or улазите.
   Register: регистрација or отворите налог. The registration site: сајт eid.gov.rs, формулар,
   Портал еИД, eID.gov.rs.
3. **Answer-label voice.** Five voices across 82 labels: first-person past ("Урадио/ла сам"),
   statements ("Порука није стигла"), imperatives ("Изаберите друго слово"), first-person future
   ("Урадићу касније"), yes/no. Welcome offers "Почните регистрацију" next to "Већ имам налог".
4. **Screen length**, not sentence length. Six screens over 150 words; activate-consentid at 340.
5. **Terms before explanation.** The "Већ имам налог" shortcut from welcome skips every screen that
   introduces QR, ПИН and ConsentID.
6. **Number style.** The PIN is "6 цифара" on one screen and "шест цифара" on two. "1.473" reads as
   a decimal to some readers.

The baseline report lists the ten hardest passages for a 75-year-old reader in its section 7.

## 4. Recommendation

Adopt a project writing standard with four parts. The model is ASD-STE100's structure (rules plus a
term list), filled with plain-language numbers from NHS and GOV.UK, Serbian wording from
"Информације за све", and UI rules from the Croatian e-services standard. Level: plain language
tuned for elderly readers, with selected easy-to-read layout rules. Not full easy-to-read.

### 4.1 The writing guide (`docs/` or `content/`, one page)

Rules a content author follows, each with a Serbian before/after example. Draft rule set, ranked by
how many of the 31 world sources back it, with the check that enforces it:

| #   | Rule                                                                                                                                  | Backed by | Enforced by                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| 1   | At most 20 words per sentence; aim for 15. Split with a full stop, not a comma.                                                       | 15        | CI: error over 20, warning over 15 |
| 2   | Use everyday words. Prefer the short Serbian word to the loanword where one exists.                                                   | 14        | Claude review, plus the term list  |
| 3   | Instructions are imperatives addressed to the reader as "ви". No passive or impersonal forms ("Захтев се подноси" becomes "Поднесите захтев"). | 14   | Claude review; "ти" forms by CI    |
| 4   | One idea per sentence, one action per numbered step.                                                                                  | 9         | CI: warn on a step with 3+ sentences; Claude review |
| 5   | Explain a term where it first appears on that screen, keeping the real word the reader will see: "ПИН (број од 6 цифара који сами смислите)". | 9  | CI: unexplained abbreviation not on the allowlist; Claude review |
| 6   | Say what to do, not what not to do. No double negatives. "Не" only for real warnings.                                                 | 9         | Claude review                      |
| 7   | Test screens with elderly readers and change the text from what they do.                                                              | 9         | People                             |
| 8   | Avoid abbreviations; the allowed ones (ЈМБГ, ПИН, QR) are explained on first use on each path.                                        | 8         | CI: allowlist                      |
| 9   | Address the reader as "ви" everywhere, lowercase, never "ти", never "ми" as the authors.                                               | 8         | CI: "ти" forms; Claude review      |
| 10  | Use verbs, not nouns: "проверите", not "извршите проверу".                                                                             | 7         | CI: light-verb list (извршити, обавити, вршити); Claude review |
| 11  | Anything done in order is a numbered list. Three or more items of any kind are a list.                                                | 7         | CI: 3+ imperatives in one paragraph |
| 12  | The action comes first on the screen and first in the sentence. Conditions live in question screens, not in step bodies.              | 6         | Claude review                      |
| 13  | Literal language. No metaphors ("као два листа папира" needs care).                                                                    | 6         | Claude review                      |
| 14  | Numbers as digits, including 2 to 9: "6 цифара". Round large numbers and write four-digit numbers without a separator, as Pravopis does: "више од 1400 шалтера". No percentages, no Roman numerals. | 6 | CI: number words, Roman numerals |
| 15  | Every image has alt text that says what to look for. Bold only the word to tap or the thing to look for.                              | 6         | CI: alt text present and 3+ words; bold span over 4 words |
| 16  | One word for one thing, from the term list. Never a synonym, never a second meaning.                                                  | 5         | CI: term list                      |
| 17  | At most 3 sentences per paragraph.                                                                                                    | 4         | CI: warning                        |
| 18  | "Морате" or the imperative for what is required, "можете" for what is optional.                                                       | 4         | Claude review                      |
| 19  | Dates with the month in words, "13. октобар 2026." Ranges as "од 9 до 18 часова", never with a dash or slash.                          | 4         | CI: date and range patterns        |
| 20  | Every screen stands alone. Repeat what the reader needs instead of referring back.                                                    | 4         | Claude review                      |
| 21  | Latin script only for brand names, domains and quoted interface labels, introduced as "(на енглеском Allow)". Never a Latin letter inside a Cyrillic word. | 4 | CI: mixed-script error, Latin allowlist |
| 22  | Include every step, even "притисните Даље".                                                                                            | 3         | Claude review, walkthrough testing |
| 23  | At most 150 words of body per screen. Split a longer screen into steps. (Our own number: no source sets one.)                          | own       | CI: warning                        |
| 24  | Titles at most 50 characters, answer labels at most 40.                                                                                | own       | CI: error                          |

Rules not adopted, and why: one sentence per line (easy-to-read tradition only; forced breaks
misbehave on narrow phones), a full approved-vocabulary whitelist as in STE (needs part-of-speech
and sense checking; not realistic for a volunteer team), a composite readability score (none is
calibrated for Serbian).

### 4.2 The term list (`content/terms.yaml`, the STE "technical noun" list for this project)

One entry per concept: the approved Cyrillic term, the banned variants, the explanation to give on
first use, and the Latin form if any. Seeded from the baseline audit's section 4. The first entries
to settle, because they are inconsistent today:

| Concept                     | Today                                                              | Proposed                                                              |
| --------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Browser tab                 | картица, страница                                                  | one term, and never that term for anything else                       |
| The ID card                 | лична карта, картица                                               | лична карта only                                                      |
| This guide                  | ова страна, водич, овде                                            | водич                                                                 |
| Come back to the guide      | four phrasings                                                     | one fixed sentence                                                    |
| The registration site       | сајт eid.gov.rs, формулар, Портал еИД, eID.gov.rs                  | сајт eid.gov.rs for the place, формулар for the form on it            |
| Activate ConsentID          | активирајте, укључите, активирана                                  | one verb                                                              |
| The counter paper           | потврда (shared with three other senses)                           | a term that is not also the confirm button                            |
| Mailbox vs post office      | пошта for both                                                     | имејл for the mailbox, пошта only for the building                    |
| User ID from the counter    | ИД корисника, кориснички ИД, број корисника, регистрациони код     | one term                                                              |
| Sign in                     | пријавите се, улазите                                              | пријавите се                                                          |
| Register                    | регистрација, отворите налог                                       | one term                                                              |
| Photo vs screenshot         | слика for both, фотографија                                        | фотографија for what you upload; слика only for the illustration      |
| Tap, type, choose, tick     | притисните, упишите, изаберите, означите                           | keep; these are already consistent                                    |

The term list also drives the Latin allowlist (ConsentID, eid.gov.rs, Gmail, iPhone, Android,
Chrome, Safari, App Store, Google Play, and quoted labels) and the abbreviation allowlist.

### 4.3 Automated checks (`npm run validate`, TypeScript, no new runtime)

Tier A from the tooling report, all deterministic, two to four days of work including fixing current
content. Each rule starts as a warning, the content is fixed, then it becomes an error.

| Check                                      | Current content would get                        |
| ------------------------------------------ | ------------------------------------------------ |
| Sentence over 20 words (error), over 15 (warning) | 2 errors, 16 warnings                      |
| Paragraph over 3 sentences                 | 2 warnings                                       |
| Numbered step with 3+ sentences            | about 12 warnings                                |
| Screen body over 150 words                 | 6 warnings                                       |
| Mixed Latin and Cyrillic letters in a word | 6 errors, all in directory screens               |
| Latin word not on the allowlist            | 0 once the allowlist is seeded                   |
| Banned term or variant from the term list  | depends on the list; dozens at first             |
| Unexplained abbreviation not on the allowlist | a handful (MB, ИД, еИД)                       |
| Gender slash form                          | 22 in bodies and labels, plus the one label repeated on 24 letter screens (policy pending, see OQ3) |
| Bold span over 4 words                     | about 25 (policy pending, see OQ4)               |
| Title over 50 / label over 40 characters   | 0                                                |
| Alt text missing or under 3 words          | 0                                                |
| Number words above ten, Roman numerals, double spaces, straight quotes | few                  |
| Readability trend (sentence length, share of long words, LIX) | printed, not a gate           |

Not automated: lemma-level checks beyond the generated word-form map, passive with "се", clause
depth. Those stay with the Claude review, or with an optional Python job if ever needed.

### 4.4 The review rubric (for Claude sessions reviewing content PRs)

A short file the reviewer reads, modelled on the Finnish Selkomittari: each criterion scored 0 to 3,
and every main criterion must score 2 or more. Criteria: one action per step, imperative and "ви",
positive phrasing, every pronoun has a clear referent, each term explained on first use, no passive
or impersonal forms, same term and same button name across screens, calm tone, alt text says what
to look for, text matches the screenshot labels.

### 4.5 Order of work, if approved

1. Settle the open questions below.
2. Write the guide and the term list, and link both from `CLAUDE.md` so the teammates' Claude
   sessions follow them. This is the mandatory part.
3. Add the Tier A checks as warnings, fix the six long screens and the term inconsistencies, then
   promote the checks to errors.
4. Add the review rubric to the pull request template.
5. Run a walkthrough with three to five elderly readers on their own phones, and adjust the
   thresholds from what they do.

## 5. Open questions for the team

Numbering continues the conversation in which this research was commissioned. (The tooling report
has its own internal OQ1 and OQ2; they are OQ3 and OQ4 here.)

**Decision (OQ1 — enforcement depth):** a written guide is mandatory, and automated checks go as
deep as this research found feasible, which is the Tier A list in section 4.3.

**OQ2 — the level:** plain language tuned for elderly readers, with the term list and selected
easy-to-read layout rules (recommended), or full easy-to-read (one sentence per line, no
subordinate clauses, mandatory validation by readers with intellectual disabilities). The
recommendation keeps the current register, which is already close, and adds consistency.

**OQ3 — gender slash forms** ("Урадио/ла сам", 46 uses). This is a legal and political question in
Serbia, not a style call: the 2021 gender equality law requires gender-sensitive language in some
contexts, the Constitutional Court suspended the law in June 2024 with no final ruling found, the
Serbian standardisation board advised against slash forms in 2011, the Slovenian easy-to-read
rules say to write "or" instead of "/", and the Croatian government e-services standard itself uses
"siguran/na". Options:

- **Option 1 — neutral rewrites:** phrase labels so no gendered past participle is needed. Serbian
  first-person present and future are gender-free: "Имам налог", "Знам где ћу ићи", "Хоћу да га
  укључим". Results can be stated: "Порука је стигла", "Шалтер је пронађен", or simply "Готово".
  Keep one fixed slash pattern only where no natural neutral form exists. Recommended: it sidesteps
  the dispute and satisfies the easy-to-read "/" rule.
- **Option 2 — one fixed slash pattern everywhere:** keep slashes, standardise on "-о/ла" (today
  three patterns coexist), and let CI enforce the pattern.
- **Option 3 — double forms in full:** "Урадио сам / Урадила сам". Clearest, longest, and it
  doubles label length.

**OQ4 — the bold banners.** The "Ово радите у X, не на овој страни." sentence appears on ten screens
in full bold, which breaks the "bold only the tap target" rule. Recommended: make it a fixed
template with a single variable, rendered as a callout box by the site rather than by bold text.
That is a small code change (a blockquote convention or a `where` field in the graph) and it also
makes the sentence identical everywhere.

**OQ5 — the guide's language.** The research and the checks are in English like the rest of the
repo. The writing guide is read by Serbian authors and is about Serbian words, so its examples must
be Serbian. Recommended: the guide in Serbian Cyrillic with the rule names in English for the CI
messages, and a short English summary in `CLAUDE.md`.

**OQ6 — dates and times.** Pravopis practice is "13. 10. 2026." and "17.00"; easy-to-read says
"13.10.2026."; GOV.UK and Leichte Sprache prefer the month in words. The directory screens use
"07:00–11:00" from the official source. Recommended: month in words for prose ("13. октобар"),
"од 9 до 18 часова" for ranges in prose, and leave the directory tables in their source format.

## 6. Sources most worth reading

- ASD-STE100, Issue 9 (2025), free: https://www.asd-ste100.org/
- NHS content guide, "How we write": https://service-manual.nhs.uk/content/how-we-write
- GOV.UK clear-language guidance: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/
- Информације за све (Serbian Cyrillic): https://www.inclusion-europe.eu/wp-content/uploads/2021/10/SRB_Information_for_all-_cirilica.pdf
- Standard razvoja javnih e-usluga u RH, Smjernice (2021): https://mpudt.gov.hr/UserDocsImages/RDD/e-Standardi/Standard%20razvoja%20javnih%20e_usluga%20u%20RH_Smjernice.pdf
- Lahko je brati 2: Pravila (2019): https://www.nova-gorica.si/file/15808593322488793_9_lahko-je-brati-2-pravila.pdf
- W3C, Making Content Usable for People with Cognitive and Learning Disabilities (2021): https://www.w3.org/TR/coga-usable/
- Selkokielen mittari 2.0 (Finnish easy-language criteria): https://selkokeskus.fi/selkokieli/selkokielen-mittari/selkokielen-mittarin-ohjeet-ja-kriteerit/
- srLex inflectional lexicon (CLARIN.SI): https://www.clarin.si/repository/xmlui/handle/11356/1233
