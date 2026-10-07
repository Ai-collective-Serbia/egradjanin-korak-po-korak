# Automated language checks for Serbian Cyrillic content: tooling survey

Research date: 2026-10-07. Scope: what an STE-inspired (ASD-STE100) plain-language rule set for
`content/` can enforce for free in CI, and what stays with an LLM reviewer or with user testing.
Baseline numbers below were measured on the repo at commit `93be62c`.

## 1. Summary

1. No off-the-shelf plain-language linter supports Serbian. LanguageTool has a Serbian module in its source tree, but it was dropped from releases in December 2018 and holds only a few dozen rules.
2. Vale and textlint can run Cyrillic rules, but Vale's own docs say its default `\b` word boundary never matches in non-Latin scripts, so every word rule needs hand-written Unicode boundaries.
3. For one repo, a bespoke TypeScript check that runs under `npm run validate` (Vitest) is cheaper than adopting either framework. It needs no Python and at most one small dev dependency.
4. About 15 rule categories are mechanical and fit that check (Tier A): sentence and paragraph length, steps per numbered item, bold span length, title and label length, alt text, mixed-script words, Latin allowlist, forbidden word list, digits, punctuation hygiene.
5. Lemma-level vocabulary rules do not need NLP at check time. Expand each listed lemma into all its wordforms once, offline, from the srLex inflectional lexicon, commit the JSON, and look words up after Cyrillic-to-Latin transliteration.
6. CLASSLA is the only strong free Serbian tagger and lemmatiser. Its models are trained on Latin-script text, it pulls PyTorch, and the Serbian model is about 173 MB. It fits a non-blocking optional job at best (Tier B).
7. A pure-JS Serbian Snowball stemmer exists on npm and accepts Cyrillic. It conflates nouns and adjectives well but splits verb paradigms, so it is a fallback, not the main mechanism.
8. No readability formula is calibrated for Serbian. Use hard per-sentence caps plus a corpus-level trend of average sentence length and share of words over six letters (the LIX inputs), not a per-node score gate.
9. Current prose, excluding the 34 counter-list address tables, averages 7.6 words per sentence with a maximum of 21. Caps of 20 words (error) and 15 words (warning) fit what the team already writes.
10. Meaning, one-action-per-step, ambiguity, tone and passive-voice judgement belong in the Claude PR review rubric (Tier C). Comprehension by elderly readers stays with user testing (Tier D).

## 2. Tools survey

| Tool | Cost | Runs in CI | Serbian / Cyrillic | What it can check | Verdict for this repo |
| --- | --- | --- | --- | --- | --- |
| **Vale** (Go binary) | Free, MIT | Yes, GitHub Action or binary | Rules are regex, so Cyrillic text matches. Its regex engine is regexp2 in RE2 mode and its docs warn that `\b` "never matches" in a script with no `[0-9A-Za-z_]` characters, with no error. Workaround: `nonword: true` plus `(?<![\p{L}])…(?![\p{L}])`. Readability metrics are English grade-level formulas. Its `metric` check exposes `words`, `sentences`, `long_words` (more than six characters) and a `lix` variable since v3.23; whether it counts runes or bytes on Cyrillic is unverified. | existence, substitution, occurrence, repetition, consistency, conditional, capitalization, metric, readability, spelling (Hunspell), sequence (needs NLP tags, English only), script (Tengo). Markdown scopes: heading, list, alt, link, strong, sentence, paragraph. | Usable with care. Adds a Go binary to CI and Vale's sentence splitter is unknown on Serbian abbreviations. Little gain over a small TS check. |
| **Vale styles** (proselint, write-good, alex, Google, Microsoft, RedHat) | Free | Yes | English word lists only. | Weasel words, passive voice, clichés, inclusive language, product terms. | Use only as a source of rule ideas. None of the lists transfer. |
| **textlint** (Node) | Free, MIT | Yes, npm | Rule plugins are JS over a Markdown AST, so any script works. Shipped rule presets are Japanese or English. `sentence-splitter` targets Japanese and English. `textlint-rule-sentence-length` counts characters, not words. | Anything a JS rule can express, with Markdown-aware node types and autofix. | Best framework fit if the team wants one: npm, Markdown AST, editor plugins. Every Serbian rule would still be custom code. |
| **LanguageTool** (Java) | Free, LGPL; self-host server via Docker | Yes, but Java server in CI | Not in the release language list. The source tree has a `sr` module (Cyrillic resources, Ekavian and Ijekavian, morfologik tagger and synthesiser dictionaries of 5 to 8 MB), removed from releases on 2018-12-27 ("remove Serbian, currently not part of our releases anymore"). Its style list is wordform-based, for example `реализовати=остварити`, `бенефит=повластица`. | Pattern rules with POS tags, replace lists, spelling. The `de-DE-x-simple-language` module is the only open-source plain-language rule set found; its rules are listed below. | Too heavy to build from source for this repo. Mine its Serbian replace and barbarism lists as seeds for a forbidden-word list. |
| **LanguageTool simple German** (Leichte Sprache module) | Free | Same as above | German only | Rules: Perfekt vs Präteritum, footnote, negation, subordinate clauses, relative clauses, passive, genitive, indirect speech, one statement per sentence, subjunctive, avoid questions, abbreviation, metaphors, anglicisms, difficult words, abstract words, technical terms, long word, difficult phrases, cross-references, Roman numerals, numbers and years, number words, dates, special characters. LanguageTool's own forum says these rules are limited and unmaintained. | The best ready checklist of what a rule-based plain-language checker attempts. Used to build the tier table below. |
| **Hemingway Editor** | Web free; desktop one-time purchase | No | English only | Sentence difficulty, adverbs, passive, complex words, grade level. | Not applicable. |
| **ASD-STE100 term checker** (simplified-english.co.uk) | Commercial | CLI and LanguageTool HTTP server | English only | Unapproved and unknown words, inflections of unapproved words, wrong part of speech, misused words, unapproved tenses, noun clusters over three words. It does not check sentence length. It is built on LanguageTool. | Shows the architecture: an approved-word list implemented as LanguageTool rules plus a lexicon. |
| **HyperSTE** (Tedopres), **Congree**, **Acrolinx / Markup AI** | Commercial, enterprise pricing | Via their servers | Acrolinx's support matrix lists Chinese, Czech, English (including ASD-STE100), German, Japanese, French, Portuguese, Spanish, Swedish. No Serbian. HyperSTE is English STE. Congree targets German and English (not verified in detail). | Approved vocabulary, sentence length, style guides, terminology, inclusive language. | Not applicable: cost and no Serbian. |
| **Selkomittari** (Finland, Selkokeskus) | Free document | No | Finnish | A rubric of 106 easy-language criteria, 80 of them on text, words and structures. It is a human assessment checklist, not software. | Source for the Tier C LLM rubric. |
| **capito digital, SUMM AI** (Leichte Sprache) | Commercial | API | German | LLM-based simplification and scoring at three language levels. | Not applicable; confirms the market moved to LLM review for meaning-level rules. |
| **Open-source Slavic plain-language linters** | None found | n/a | n/a | n/a | Gap. |

## 3. Serbian NLP feasibility

### Tools

| Tool | What it does | Script | Cost to run | Notes |
| --- | --- | --- | --- | --- |
| **CLASSLA** (Stanza fork, `pip install classla`, v2.2.3, Python 3.8+) | Tokenisation and sentence splitting (rule-based via reldi-tokeniser), MULTEXT-East and UD POS tags, lemmas, dependency parse, NER. Standard, non-standard and web Serbian models. | Latin. All README Serbian examples are Latin, training corpora (SETimes.SR, ReLDI-NormTagNER-sr, hr500k) are Latin, and GitHub issue #52 "Why isn't Serbian Cyrillic script supported?" is open with no reply. | Depends on PyTorch. The non-standard Serbian morphosyntax model is 172.9 MB (67.7 MB model plus 105.2 MB embeddings), CC BY-SA 4.0. Estimate 3 to 5 minutes cold on a GitHub runner, under a minute with pip and model caches. | Transliterate Cyrillic to Latin first. That direction is lossless for Serbian, and the repo already has `src/lib/translit.ts`, so it is a pipeline step, not a blocker. Outputs `Voice=Pass` on participles. |
| **reldi-tokeniser** | Rule-based tokeniser and sentence splitter for sl, hr, sr, mk, bg. | Uses Python Unicode `\w`, so Cyrillic tokenises. Abbreviation handling is tuned on Latin. | Small, pure Python. | Usable alone for sentence splitting, but a TS splitter with a Serbian abbreviation list is enough here. |
| **reldi-tagger** | CRF tagger and lemmatiser for hr, sl, sr, trained with the srLex lexicon. | Latin. | Python 2-era code, pycrfsuite. | Superseded by CLASSLA. |
| **spaCy** | No official Serbian pipeline. Third-party models on Hugging Face from the TESLA group (University of Belgrade): `sr_pln_tesla_j125` (POS, lemma, NER, transformer). | Not verified. | Transformer, heavy. | Not worth it over CLASSLA. |
| **srLex 1.3** (CLARIN.SI) | Inflectional lexicon: wordform, lemma, MSD, UPOS, features, frequency. Version 1.2 has 192,590 lemmas and 6.9 million wordform entries. | Latin. | A data file; no runtime. Licence CC BY-SA 4.0 for 1.3 (GPLv3 for 1.1 and 1.2). | The key resource for lemma-level checks without NLP at check time. |
| **LanguageTool `sr` dictionaries** | morfologik tagger and synthesiser dictionaries, Ekavian and Ijekavian. | Cyrillic, the opposite convention to the CLARIN tools. | Needs the morfologik Java tool to dump. | Alternative wordform source. |
| **Snowball Serbian stemmer** (`@orama/stemmers`, file `rs.js`, Apache-2.0, pure JS) | Suffix-stripping stemmer. Converts Cyrillic to Latin as its first step. | Accepts Cyrillic, outputs Latin stems. | Zero: one small JS file. | Tested here, results below. |
| **Hunspell `sr`** | Spelling dictionaries, Cyrillic and Latin. LGPL. | Both. | Small. | Spelling only. Vale can load it. |

No JS or Node Serbian lemmatiser was found. `@nlpjs/lang-sr` exists but is an alpha with no documented lemmatiser.

### Snowball stemmer test on wordforms from this repo

| Wordforms | Stems | Result |
| --- | --- | --- |
| притисните, притисне, притиснути | pritisn, pritisn, pritisn | Conflated |
| притискајте | pritiska | Split: imperfective aspect has a different stem |
| налог | nal | Split: the bare nominative over-stems |
| налога, налогу, налозима | nalog, nalog, nalog | Conflated |
| апликацију, апликација, апликацијом | aplikacij ×3 | Conflated |
| лична, личну, личне | ličn ×3 | Conflated |
| реализовати, реализујете | realizova, realizuj | Split: verb stem alternation `-ова-` / `-уј-` |

A stem-based forbidden list would miss forms unless each entry lists every stem its lemma produces.

### How lemma-level checking is realistic here

The team's question is whether an STE-style word list can work given Serbian inflection. It can, without Python in CI:

1. Keep a hand-edited list of lemmas in `content/`, each with a status (`forbidden` with a replacement, or `approved`) and a short reason.
2. Run a one-off local script, Python or Node, that looks up every wordform of each listed lemma in srLex and writes a generated JSON map of wordform to lemma. Rerun it only when the list changes.
3. At check time in TypeScript, transliterate each Cyrillic word to Latin with the existing transliteration code, lowercase it, and look it up in the map.
4. Use the Snowball stemmer only as a fallback for lemmas missing from srLex, and list every stem by hand for those.

Two cautions apply. The generated file derives from srLex, so committing it puts that file under CC BY-SA 4.0; keep it separate and attributed, or generate it in CI from a cached download. Homographs are the remaining false-positive source, because a wordform list cannot tell two lemmas with the same surface form apart. Keep the forbidden list to words where that does not happen often, and allow an inline opt-out.

A full approved-vocabulary rule, where every word must be on a whitelist as in STE, is not realistic for this team. It needs part-of-speech and sense checks, and the content names many places, institutions, apps and UI labels. A forbidden-and-replacement list of perhaps 50 to 150 lemmas gives most of the consistency benefit.

## 4. Readability proxy recommendation

- **No Serbian-calibrated formula exists.** The nearest work is Croatian. Brangan (2011) adapted SMOG for Croatian by counting words of four or more syllables as polysyllabic. A PLOS ONE study of Croatian consent forms says there are no computer programs with readability formulas adjusted for Croatian and did all counts by hand. A Croatian Flesch adaptation and a Croatian LIX use are also reported but not validated for this audience.
- **LIX is language-agnostic in form.** It adds average sentence length to the percentage of words longer than six letters. It counts letters, not syllables, so it runs on Cyrillic as is. Its bands (below 30 very easy, 30 to 40 easy, 40 to 50 medium) were calibrated on Swedish. Serbian words are longer on average, so the bands are not directly meaningful.
- **Serbian syllables are countable deterministically.** The spelling is phonemic, so a syllable count is the vowel count plus syllabic р between consonants (as in прст, врх). That makes the Croatian SMOG adaptation mechanically computable, unlike English SMOG.
- **Per-node scores are noise on short screens.** The `done` screen has 14 words and scores LIX 50 because of a few long words.

Recommended proxy, all Tier A:

1. Fail any sentence over 20 words. Warn over 15 words.
2. Fail a paragraph of more than 3 sentences, and a numbered step with more than 2 sentences, as warnings first.
3. Report corpus-level average sentence length, share of words over six letters, share of words of 10 or more letters, and LIX in the validate output, as a trend number, not a gate.
4. Optionally warn on any single word of 15 or more letters outside an allowlist.

Measured baseline, prose screens only (24 nodes; the 34 `counter-list-*` address tables are excluded because they are data, not prose):

| Measure | Value |
| --- | --- |
| Sentences | 482 |
| Words | 3,652 |
| Average sentence length | 7.6 words |
| Median / 90th / 95th percentile | 7 / 13 / 15 words |
| Longest sentence | 21 words |
| Sentences over 15 words | 19 |
| Sentences over 20 words | 2 |
| Words over six letters | 27.9 % |
| Words of 10 or more letters | 7.5 % |
| Words of four or more syllables | 16.4 % |
| LIX | 35.5 |

The two sentences over 20 words, both of which a 20-word cap would flag:

- activate-consentid, 21 words: „Ако мислите да ћете га заборавити, запишите га на папир који чувате код куће, никако у телефону и никако уз телефон.“
- cloud-approve, 21 words: „То је број од шест цифара који сте сами смислили када сте први пут укључили апликацију, на шалтеру или код куће.“

A 15-word warning would also flag, for example, install-consentid (20 words, „Ако желите да прочитате више о апликацији, то пише на сајту eid.gov.rs, у менију Услуге → Мобилна апликација ConsentID.“) and done-basic (18 words).

## 5. Tiered rule table

Effort: S under half a day, M one to three days, L a week or more. False-positive risk is for the rule as described.

### Tier A: deterministic TypeScript in CI

| Rule category | Example rule | Tool | Effort | False-positive risk |
| --- | --- | --- | --- | --- |
| Sentence length | Error over 20 words, warning over 15. Current content: 2 errors, 19 warnings. | TS splitter with a Serbian abbreviation list (нпр., тзв., итд., др., бр., ул., г.), list items and line breaks as boundaries | S | Low. Colons and URLs need care; `eid.gov.rs` must not split. |
| Paragraph length | Warn over 3 sentences. Current: activate-consentid has 4, confirm-email has 5. | Same | S | Low |
| One action per numbered step | Warn when a numbered item has more than 2 sentences. Current: 12 items. | Markdown list parsing | S | Medium. A step plus its explanation is often fine. |
| Ordered actions use numbered lists | Warn when a paragraph has 3 or more imperative sentences in a row. | Imperative detection by suffix (`-ите`, `-јте`) | M | Medium |
| Bold only the tap target | Warn when a bold span is over 4 words. Current: 25 spans, mostly „Ово радите у апликацији…“ banners. | Regex or AST | S | Medium. The team uses bold banners on purpose; it needs a team decision. |
| Title length | Error over 50 characters. Current maximum: 44 (check-id-card). | `graph.yaml` via the existing loader | S | Low |
| Answer label length | Error over 40 characters. Current maximum: 36. | Same | S | Low |
| Alt text present and useful | Error when empty, equal to the file name, or under 3 words. Warn over 160 characters. Current: 26 images, lengths 39 to 158 characters, none empty. | Regex or AST | S | Low |
| Mixed-script word | Error when one word mixes Latin and Cyrillic letters, for example a Latin `a` or `o` inside a Cyrillic word. It silently breaks transliteration and search. Current: 0 hits. | Unicode script check per token | S | Very low |
| Latin words in Cyrillic text | Error for a Latin word not on an allowlist. Current Latin words are all legitimate: brands (ConsentID, Yettel, Banca Intesa, Addiko, Gmail, iPhone), the domain `eid.gov.rs`, and English UI labels such as Requests, Allow, Approve, Done. The allowlist lives in `content/`. | Regex plus allowlist file | S | Medium until the allowlist settles |
| Forbidden words and phrases | `реализовати` → `урадити`; `кликните` → `притисните`; `извршите` → name the action. Matched by wordform set. | srLex-expanded JSON (section 3) or hand-listed wordforms; Snowball stemmer fallback | M | Medium: homographs |
| Consistent UI terms | Same thing, same word: always `притисните`, never `кликните` or `додирните`; always `имејл`, never `е-маил` or `мејл`. | Same as forbidden words | S | Low |
| Gender slash forms | Detect `Нашао/ла`, `успео/ла`, `пријављен/а`. Current: 45 Cyrillic occurrences. Skip URLs, which produce Latin false matches such as `rs/sr`. Enforce one agreed format or flag them for rewrite. | Regex | S | Low for detection. The policy is open, see below. |
| Numbers | Warn on number words above ten where digits read faster, and on Roman numerals. Skip the address tables. | Regex | S | Medium |
| Abbreviations | Warn on an unexplained abbreviation in capitals that is not on an allowlist (ЈМБГ, QR, ПИН). | Regex plus allowlist | S | Medium |
| Punctuation hygiene | Double spaces, space before punctuation, straight quotes instead of „…“, `...` instead of `…`. | Regex | S | Low |
| Very long words | Warn on a word of 15 or more letters outside an allowlist. | Count | S | Medium |
| Readability trend | Print average sentence length, share of words over six letters, LIX. Not a gate. | Arithmetic | S | n/a |

### Tier B: Serbian NLP in Python

| Rule category | Example rule | Tool | Effort | False-positive risk |
| --- | --- | --- | --- | --- |
| Lemma-level vocabulary at check time | Flag any form of a forbidden lemma, including forms missing from srLex. | CLASSLA on transliterated text | M; CI cost 3 to 5 minutes cold | Low to medium (tagger F1 about 93 % on XPOS) |
| Participle passive | Flag `је послат`, `биће објављено` and similar. | CLASSLA `Voice=Pass` feature | M | Medium |
| `се`-passive | Flag „Захтев се подноси…“. Regex can only approximate it, because reflexive `се` is also common in active sentences. | CLASSLA plus dependency parse | L | High |
| Nominal style | Flag verbal nouns in `-ње` / `-ћење` where a verb works („вршење провере“ → „проверите“). | POS tags and suffix | M | Medium |
| Subordinate clause depth | Flag a sentence with more than one subordinate clause. | Dependency parse | M | Medium |
| Approved-vocabulary whitelist (full STE) | Every word must be on the list. | CLASSLA plus a lexicon | L | High; not recommended |

If the team ever adopts Tier B, run it as a separate non-blocking workflow, or as a local precompute step that writes results into the repo.

### Tier C: LLM review (Claude PR review with a rubric)

| Rule category | Example rubric item | Effort | False-positive risk |
| --- | --- | --- | --- |
| One action per step, really | Does each numbered step ask for exactly one physical action? | S (rubric text) | Low to medium |
| Second person and imperative | Is the reader addressed as „ви“ with imperatives, consistently? | S | Low |
| Positive instructions | Is „не заборавите да…“ rewritten as „урадите…“? | S | Low |
| Ambiguity and pronouns | Does every „то“, „га“, „је“ have a clear referent? | S | Medium |
| Jargon and unexplained terms | Is each official term (сертификат у клауду, еСандуче) explained the first time on that screen? | S | Medium |
| Passive and impersonal voice | Is any „се“-passive better as an imperative? | S | Medium |
| Consistency across screens | Same term, same button name, same step wording across the flow. | M (needs graph context) | Medium |
| Tone and reassurance | Respectful, calm, no blame, no exclamation marks. | S | Medium |
| Alt text quality | Does the alt text say what the reader should look for, not only describe the picture? | S | Medium |
| Factual consistency with the screenshot | Does the text name the same labels as the screenshot shows? | M | Medium |
| Selkomittari-style criteria | Use its text, word and structure criteria as rubric items. | M | Medium |

### Tier D: human only

| Rule category | How | Effort |
| --- | --- | --- |
| Comprehension | Observe 3 to 5 older readers completing the flow on their own phone. | L |
| Findability of the next action | Can the reader find the button the text names? | L |
| Trust and anxiety | Does the reader feel safe entering ЈМБГ and photos? | L |
| Real-world accuracy | Does eid.gov.rs still look and behave as described? | M, recurring |
| Gender form preference | Do readers find slash forms or neutral rewrites easier? | M |

**OQ1 — the gender slash question:** should slash forms such as „Добио/ла сам“ stay, become one standard format, or be rewritten to neutral forms such as „Добили сте“? Detection is trivial in Tier A, but the rule depends on this decision. 45 occurrences exist today, 25 of them the answer label „Нашао/ла сам поруку“ repeated across the counter-list screens in `graph.yaml`. Recommendation: keep slash forms only in first-person answer labels, where a neutral rewrite is awkward, and use second-person neutral forms in bodies.

**OQ2 — the bold banner question:** should the „Ово радите у…“ banners keep full-sentence bold? The CLAUDE.md rule says to bold only the word to tap. Recommendation: allow one bold banner sentence per screen as an explicit exception and cap other bold spans at 4 words.

## 6. Feasibility sketch for this repo

Fit with the existing build:

- `npm run validate` runs `vitest run src/lib/content.test.ts`, which calls `loadGraph()` and fails with a list of errors. A language check fits as a second test file, or as extra cases in the same file, so CI needs no new step.
- Astro 7.3 renders Markdown through its own `@astrojs/markdown-satteri` package. No remark or mdast parser is installed today. The content Markdown is simple: headings, paragraphs, bullet and numbered lists, bold, images, and inline `<a>` tags. Two options exist:
  1. Write a line-based scanner of about 150 to 250 lines with zero new dependencies. It is enough for these constructs.
  2. Add `mdast-util-from-markdown` as a dev dependency for a real AST of list items, headings, alt text and link text. It is small and pure JS. Prefer this if rules grow.
- The repo already has a Cyrillic-to-Latin transliterator, which the wordform lookup reuses.

Proposed shape:

1. Add `src/lib/language.ts` with pure functions: split Markdown into blocks, split blocks into sentences, tokenise words with Unicode property regexes, and run each rule to return findings with node id, line, rule id, severity and message.
2. Add `content/language-rules.yaml` for the thresholds, the Latin allowlist, the abbreviation allowlist and the forbidden-lemma list. Content authors edit this, not code.
3. Optionally add `content/language-wordforms.json`, generated offline from srLex by a script outside CI, with its licence noted.
4. Add `src/lib/language.test.ts` that fails on errors and prints warnings. Add a separate npm script for a full report with the readability trend.
5. Skip the `counter-list-*` nodes for prose rules, or mark them with a per-node opt-out in `language-rules.yaml`, because they are address tables.
6. Support an inline opt-out comment, such as `<!-- lint-ignore sentence-length -->`, for the rare justified exception.
7. Start every new rule as a warning, fix the current content, then promote it to an error.

Technical gotchas:

- JavaScript `\b` is ASCII-only even with the `u` flag, the same trap Vale documents. Use `(?<!\p{L})…(?!\p{L})` for word boundaries.
- Count letters with `[...word].length` or `\p{L}`, never `.length` on bytes. Byte-based tools report Cyrillic lengths about twice too long.
- Do not split sentences on the dots in `eid.gov.rs`, in abbreviations, or in numbered-list markers. Treat each list item and each line as a boundary.
- Strip image syntax, HTML tags and URLs before counting words, but check alt text and link text as their own scopes.

What needs Python, if ever: lemmatisation of words not covered by the generated wordform list, participle and `се`-passive detection, nominal style, and clause depth. Run those through CLASSLA on transliterated text in an optional workflow.

Rough effort for Tier A as a whole: two to four days for one developer, including fixing the current content to pass. The srLex expansion script adds about one day.

## 7. Sources

- Vale regex engine and the `\b` warning for non-Latin scripts: https://docs.vale.sh/guides/regex.md
- Vale existence check and `nonword`: https://docs.vale.sh/checks/existence.md
- Vale metric variables, `long_words`, `lix`: https://docs.vale.sh/checks/metric.md
- Vale readability metrics: https://docs.vale.sh/checks/readability.md
- Vale scopes: https://docs.vale.sh/topics/scopes.md
- Vale check list: https://docs.vale.sh/sitemap.md
- textlint rule collection: https://github.com/azu/textlint/wiki/Collection-of-textlint-rule
- textlint sentence-length rule: https://www.npmjs.com/package/textlint-rule-sentence-length
- LanguageTool supported languages: https://dev.languagetool.org/languages
- LanguageTool language modules, including `sr` and `de-DE-x-simple-language`: https://github.com/languagetool-org/languagetool/tree/master/languagetool-language-modules
- LanguageTool Serbian style replace list: https://github.com/languagetool-org/languagetool/blob/master/languagetool-language-modules/sr/src/main/resources/org/languagetool/rules/sr/ekavian/replace-style.txt
- LanguageTool simple German rules: https://github.com/languagetool-org/languagetool/blob/master/languagetool-language-modules/de-DE-x-simple-language/src/main/resources/org/languagetool/rules/de-DE-x-simple-language/grammar.xml
- LanguageTool forum on the Leichte Sprache rules: https://forum.languagetool.org/t/using-the-leichte-sprache-tool-via-api-request/8986
- ASD-STE100 term checker features: https://simplified-english.co.uk/features.html
- Acrolinx language support matrix: https://support.markup.ai/hc/en-us/articles/10211264809490-Acrolinx-Language-Support-Matrix
- Hemingway pricing: https://www.scripted.com/writing/hemingway-app-review
- capito and SUMM AI overview: https://www.capgemini.com/de-de/insights/blog/ki-digitale-barrierefreiheit-technologie-kommunikationsbarrieren-public-sector-ueberwinden/?p=848838
- Selkomittari, easy Finnish research: https://blogs2.abo.fi/salc8/2022/05/12/text-based-easy-language-research-perspectives-on-developing-easy-finnish-guidelines/
- CLASSLA README: https://github.com/clarinsi/classla
- CLASSLA issue on Serbian Cyrillic: https://github.com/clarinsi/classla/issues/52
- CLASSLA on PyPI (version, dependencies): https://pypi.org/project/classla/
- CLASSLA non-standard Serbian model, size and licence: https://www.clarin.si/repository/xmlui/handle/11356/1825
- reldi-tokeniser: https://github.com/clarinsi/reldi-tokeniser
- reldi-tagger: https://github.com/clarinsi/reldi-tagger
- srLex inflectional lexicon: https://b2find.eudat.eu/dataset/aea68ca3-269b-54b4-a0fb-f7589fa96b1b and https://www.clarin.si/repository/xmlui/handle/11356/1233
- Serbian spaCy models (TESLA): https://huggingface.co/Tanor/sr_pln_tesla_j125
- Hunspell Serbian: https://linuxsoft.cern.ch/cern/slc67/SRPMS/repoview/hunspell-sr.html
- Snowball Serbian stemmer: https://snowballstem.org/algorithms/serbian/stemmer.html
- Orama stemmers on npm: https://www.npmjs.com/package/@orama/stemmers
- Croatian readability, SMOG-Cro: https://pmc.ncbi.nlm.nih.gov/articles/PMC4573755/
- Croatian readability formula study: https://www.researchgate.net/publication/289809226_Quantitative_Assessment_of_Text_Difficulty_in_Croatian_Language
- LIX: https://en.wikipedia.org/wiki/Lix_(readability_test)
- MDN on JavaScript word boundaries: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Regular_expressions/Word_boundary_assertion
