# World plain-language, controlled-language and easy-to-read standards: what transfers to a Serbian phone wizard for elderly users

Research date: 7 October 2026. Scope: everything except Serbian, Croatian and Slovenian sources (covered separately).
"Verified" below means the claim was read on the primary page or PDF during this research. "Secondary" means it comes from search snippets or secondary sites only and should be re-checked before it is quoted as a hard number.

## 1. Summary

1. Three traditions converge on the same core: short sentences, one idea or one action per sentence, active imperative verbs, common words used consistently, direct address, numbered steps, and testing with real readers.
2. No source gives a words-per-screen limit. Sentence caps range from 20 words (NHS, Simplified Technical English procedures, EU average) to 25 words (GOV.UK, Australia). Easy-language sources give no number and say "short, one statement".
3. The strongest numeric target for our audience is NHS: sentences up to 20 words, paragraphs up to 3 sentences, reading age 9 to 11 (verified).
4. Simplified Technical English (ASD-STE100, Issue 9, 2025, free) transfers as a method: one word for one meaning, a project-controlled term list, imperative procedures, condition before action. Its English dictionary of about 900 words does not transfer.
5. Easy-language standards (Inclusion Europe, Leichte Sprache, Finnish selkokieli) add layout rules that matter on phones: one sentence per line, no hyphenation, left-aligned, 14 pt or larger, and mandatory checking by target readers.
6. Finnish selkokieli is the closest linguistic analogue to Serbian. It is inflection-heavy and bans participle and converb constructions, rare cases and passive instructions. Its 96-criterion "Selkomittari 2.0" scoring (0 to 3, all main criteria must score 2 or more) is the best template for an LLM rubric.
7. Easy Japanese (2020, government) adds rules directly usable for a formal-address language: polite form only, "please do X" for instructions, keep an important term and explain it in brackets, write dates in full, use "from X to Y" instead of a dash.
8. W3C COGA (2021) maps straight onto a wizard: show completed, current and pending steps, include "obvious" steps, and highlight on the image exactly what to look at.
9. Readability formulas are not calibrated for Serbian. LIX (average sentence length plus share of words longer than 6 letters) computes on any alphabetic language, so report its two components rather than a composite score, and calibrate thresholds on our own screens.
10. A ranked list of 24 transferable rules, each tagged as mechanically checkable, LLM-checkable or human-only, is in section 6.

## 2. Sources

Tradition: CL = controlled language, PL = plain language, ER = easy-to-read, DA = digital accessibility or ageing research.

| Source | Tradition | Publisher | Year | Word list | Verified | URL | Usable for us |
|---|---|---|---|---|---|---|---|
| ASD-STE100 Simplified Technical English, Issue 9 | CL | ASD (Aerospace, Security and Defence Industries Association of Europe) | 2025 (Issue 8 2021) | Yes, about 900 approved words, one meaning each | FAQ verified; 20/25-word limits secondary | https://www.asd-ste100.org/STE_faq.html | One word for one meaning; controlled term list; imperative steps; condition first |
| Microsoft Writing Style Guide | CL (corporate style) | Microsoft | living | No | Verified | https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions | Separate step per instruction; location before action; fit steps on one screen |
| Caterpillar Technical English | CL | Caterpillar | 1970s onward | Yes (proprietary) | Not verified | n/a | Historical precedent only |
| Basic English | CL | C. K. Ogden | 1930 | Yes, 850 words | Not verified | n/a | Shows a small core vocabulary is workable; not adaptable |
| Attempto Controlled English | CL | University of Zurich | 1995 onward | Grammar, not a word list | Not verified | n/a | Machine-parsable logic language; not relevant |
| ISO 24495-1:2023 Plain language, Part 1 | PL | ISO | 2023 | No | Four principles verified via national standards body listings and the International Plain Language Federation; ISO page blocked | https://www.iso.org/standard/78907.html | Framework: relevant, findable, understandable, usable; evaluate with readers |
| US Federal Plain Language Guidelines / digital.gov plain language series | PL | US GSA (plainlanguage.gov archived to digital.gov) | 2011, digital.gov 2024 onward | No | digital.gov verified | https://digital.gov/guides/plain-language/ | Active voice, present tense, hidden verbs (nominalisations), test for understanding |
| GOV.UK content and publishing guidance and A to Z style guide | PL | UK Government Digital Service | living; archived 2022 version | "Words to avoid" list | Verified (current and 2022 archive) | https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/ | 25-word check, 5-sentence paragraphs, numbered steps, front-loading, digits |
| NHS digital service manual, content guide | PL | NHS England | 2019 to 2023 | No | Verified | https://service-manual.nhs.uk/content/how-we-write | Tightest numbers: 20-word sentences, 3-sentence paragraphs, reading age 9 to 11 |
| EU "How to write clearly" and "Claire's Clear Writing Tips" | PL | European Commission | 2011 (guide), 2016 (tips) | No | Guide verified | https://commission.europa.eu/system/files/2016-12/clear_writing_tips_en.pdf | 20 words average; cut excess nouns; active verbs |
| Sweden: Språklagen 2009:600 §11, Myndigheternas skrivregler, 1177 language guidelines | PL | Språkrådet; Inera (1177) | 2009 law; 1177 living | No | 1177 verified; law wording secondary | https://www.1177.se/riktlinjer-och-material/sprakliga-riktlinjer/skriv-klarsprak-pa-1177/ | "One thought per sentence"; no inserted clauses; verbs instead of nouns; split compounds |
| Norway: Klarspråk, Språklova 2021 §9 | PL | Språkrådet Norway | 2021 | No | Not verified (site is script-rendered) | https://sprakradet.no/klarsprak/ | Same principles as Sweden; nothing new found |
| Finland: Selkeä virkakieli; Hallintolaki 434/2003 §9 | PL | Kotus (Institute for the Languages of Finland) | 2003 law | No | Not verified | https://www.kotus.fi/ | Legal duty of clear administrative language |
| Canada.ca Content Style Guide | PL | Treasury Board Secretariat | living | No | Verified | https://design.canada.ca/style-guide/ | 15 to 20 words optimal; one idea per sentence; 3-sentence paragraphs; positive form |
| Australian Government Style Manual | PL and Easy English | Digital Transformation Agency | 2020, living | No | Secondary (site unreachable) | https://www.stylemanual.gov.au/user-needs/understanding-needs/literacy-and-access | Year 7 reading level; average 15 words, maximum 25 |
| New Zealand Plain Language Act 2022 | PL (law) | NZ Parliament | 2022 | No | Secondary, wording consistent across sources | https://www.legislation.govt.nz/act/public/2022/0054/latest/whole.html | Definition only: appropriate to audience; clear, concise, well organised |
| Inclusion Europe "Information for all" | ER | Inclusion Europe | 2009 (PDF 2017 upload) | No | Verified (PDF read) | https://www.inclusion-europe.eu/easy-to-read-standards-guidelines/ | One sentence per line, digits, no percentages, Arial 14, mandatory checking by readers |
| Netzwerk Leichte Sprache, "Die Regeln für Leichte Sprache" | ER | Netzwerk Leichte Sprache (also printed by the German Labour Ministry) | 2013 | No | Verified (PDF read) | https://www.leichte-sprache.org/ | One statement per sentence; same word always; no negation; 14 pt; checking by readers |
| DIN SPEC 33429:2023 "Empfehlungen für Deutsche Leichte Sprache" | ER | DIN | 2023 | No | Secondary; the catalogue shows a 2023-04 draft as withdrawn, likely superseded by the final edition | https://www.dinmedia.de/de/technische-regel-entwurf/din-spec-33429/364785446 | Paid; formalises the Netzwerk rules |
| Einfache Sprache | PL/ER middle level | various German bodies | n/a | No | Not verified | n/a | Middle level between Leichte Sprache and standard; no formal standard |
| Finland Selkokieli: Selkokielen mittari 2.0 and quick guide | ER | Selkokeskus (Finnish Centre for Easy Language) | 2.0 current | No | Verified | https://selkokeskus.fi/selkokieli/selkokielen-mittari/selkokielen-mittarin-ohjeet-ja-kriteerit/ | Best scoring model; grammar rules for an inflected language |
| Sweden Lättläst | ER | MTM (Swedish Agency for Accessible Media) | living | No | Overview verified; detailed writing page moved | https://www.mtm.se/lattlast/ | Everyday words, short sentences, few lines per page, images |
| Easy English (Australia, Scope) and Easy Read (UK) | ER | Scope Australia; UK Department of Health and others | 2010s | No | Not verified | n/a | Image beside every sentence block; not needed for our audience level |
| Easy Japanese for residence support (Yasashii Nihongo) | ER/PL | Immigration Services Agency and Agency for Cultural Affairs | Aug 2020 | No | Verified (PDF read) | https://www.moj.go.jp/isa/content/930006072.pdf | Polite form only; key term plus bracketed explanation; dates in full; check with readers |
| IFLA Guidelines for easy-to-read materials, 2nd ed. | ER | IFLA, Professional Report 120 | 2010 | No | Bibliographic data only | https://repository.ifla.org/handle/123456789/636 | Library publishing focus; adds little beyond Inclusion Europe |
| W3C "Making Content Usable for People with Cognitive and Learning Disabilities" (COGA) | DA | W3C Working Group Note | 29 April 2021 | Points to 1,500 common words | Verified | https://www.w3.org/TR/coga-usable/ | Step progress, separate each instruction, include obvious steps, literal language |
| WCAG 2.2 SC 3.1.5 Reading Level (AAA) | DA | W3C | 2008, 2023 | No | Verified | https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html | Lower secondary level (about 9 years of school) or supplemental content |
| WCAG 3 draft, "Clear language" guideline | DA | W3C | draft, 2024 to 2026 | No | Secondary | https://www.w3.org/WAI/GL/WCAG3/2022/how-tos/clear-words | Same list as COGA; not final before about 2028 |
| NN/g "Usability for Older Adults: Challenges and Changes" (Kane) | DA | Nielsen Norman Group | Sept 2019 | No | Verified | https://www.nngroup.com/articles/usability-for-senior-citizens/ | Small type, small targets, unforgiving input, unclear error messages |
| NN/g senior studies, 2013 round | DA | Nielsen Norman Group | 2013 | No | Secondary | https://www.nngroup.com/articles/usability-seniors-improvements/ | Task success 55% for 65+ versus 75% for 21 to 55 |
| NIA and NLM "Making Your Website Senior Friendly" | DA | US National Institute on Aging | 2001 to 2009 | No | Secondary | archived | Positive phrasing, active voice, sans-serif, left-aligned, phone contact |
| Age UK house style guide | PL | Age UK | living | No | Verified | https://www.ageuk.org.uk/about-us/content-resource-hub/house-style-guide/ | Write how people talk; no clauses or semicolons; direct address |
| BT and Susie Dent digital dictionary | DA | BT | 2020s | Yes, a jargon list | Secondary | press coverage | Older people misread "hyperlink" (41%), "QR code" (24%), "the cloud" (23%) |

## 3. Per-source concrete rules

### 3.1 ASD-STE100 Simplified Technical English (controlled language)

- **Status.** Issue 9 (2025) made it an international standard and it is free of charge (FAQ, verified). The "About" page still says Issue 8 (2021) and is stale.
- **Two parts.** Part 1 is about 53 writing rules in 9 sections (secondary). Part 2 is a dictionary of about 900 approved general words (verified).
- **One word, one meaning, one part of speech.** STE picks one synonym and bans the others: "start", never "begin", "commence", "initiate". "Fall" means only to move down by gravity, never "decrease" (verified).
- **Technical nouns and verbs.** Company-specific terms are allowed if they come from an official glossary. This is the mechanism to copy: a project term list (verified).
- **Sentence length.** Procedural sentences at most 20 words; descriptive sentences at most 25 words; paragraphs at most 6 sentences (secondary, consistent across rule summaries; numbering from Issue 8).
- **Procedures.** Imperative form, one instruction per sentence unless two actions happen at the same time, no passive voice (imperative and no-passive verified).
- **Conditions first.** A condition the reader must know before acting goes at the start of the sentence (verified).
- **Other rules.** No "-ing" forms (verified). No noun clusters longer than 3 words, use vertical lists, warnings start with a simple command (secondary).
- **What transfers.** Controlled vocabulary per project, one meaning per word, imperative procedural steps, condition before action, separate descriptive text from instructions.
- **What does not transfer.** The English dictionary, the "-ing" ban, the technical-noun categories, and the assumption of a trained technician who reads the whole manual. STE has no rules for tone, reassurance, typography, images or testing with users, all of which matter for elderly lay readers.

### 3.2 GOV.UK (plain language)

Current guidance (verified, October 2026):
- Plain English is mandatory. Use "buy" not "purchase", "help" not "assist", "about" not "approximately".
- Try to split sentences over 25 words. Paragraphs at most 5 sentences.
- Active voice. "-ion" and "-ment" words make sentences longer.
- Avoid negative contractions such as "can't"; people misread them as the opposite.
- "Must" for legal requirements, "need" for process steps, "can" for options.
- Use the words users use; check search terms.
- Front-load headings, titles and bullets. People read 20 to 28% of a page in an F pattern.
- Headings start with a verb ("Apply for a driving licence") and are not questions.
- Numbered steps for a process. Each step is a complete sentence ending in a full stop.
- Numbers as numerals, including 2 to 9; "one" spelled out except in steps and lists. Dates as "2 June", not "2nd June". Ranges as "500 to 900", not "500-900".
- Explain an abbreviation on first use.

Archived 2022 version (verified via a snapshot of gov.uk/guidance/content-design/writing-for-gov-uk):
- Write for a reading age of 9. By age 9 people recognise common words by shape, not letter by letter.
- People with moderate learning disabilities understand sentences of 5 to 8 words without difficulty. With common words, most users can handle about 25 words.

### 3.3 NHS digital service manual (plain language, health, older users)

Verified:
- Reading age 9 to 11. Where medical content makes this impossible, aim for 11 to 14.
- Sentences up to 20 words. Paragraphs up to 3 sentences.
- Plain term first, then the technical term in brackets: "piles (haemorrhoids)".
- Short words: "have" or "get", not "experience".
- Active voice: "find a pharmacy", not "a pharmacy can be found".
- No metaphors. Be precise instead of subjective: "It takes X weeks", not "it can take a long time".
- Numerals for all numbers, including 1 and 2, because people scan for them. Ordinals as "1st", not superscript, because screen readers misread superscript.
- More than 4 in 10 adults struggle with health content; more than 6 in 10 when it contains numbers.
- Readability tools are not recommended except for prioritising; "test it with your users".

### 3.4 EU "How to write clearly" (plain language)

Verified (2011 guide):
- One document at most 15 pages; one sentence 20 words on average, with some shorter ones.
- Break long sentences up, but keep linking words ("but", "so") so the logic survives.
- Ten hints: think before you write, focus on the reader, shape the document, keep it short and simple, structure sentences, cut excess nouns, be concrete, prefer active verbs, beware of jargon and abbreviations, revise and check.

### 3.5 Canada.ca Content Style Guide (plain language)

Verified:
- Start sentences with the subject and verb.
- Sentences optimally under 15 to 20 words; one idea each; avoid many commas.
- Paragraphs one main idea and at most 3 sentences; one-sentence paragraphs are fine.
- Positive form: say what people may or must do. Negative form is acceptable for serious or fatal consequences, without contractions.
- Digits are easier to scan and draw attention.
- People with literacy challenges stall on words longer than two syllables and skip text dense with long words.

### 3.6 Inclusion Europe "Information for all" (easy-to-read)

Verified from the 2009 standards PDF:
- **Words.** Use well-known words; explain difficult ones. Use the same word for the same thing throughout. No metaphors, no foreign words, no initials or abbreviations like "e.g.".
- **Numbers.** Avoid percentages and big numbers; use "few" or "many". Write numbers as digits, never Roman numerals. Write dates in full: "Tuesday 13 October 2008", not "13/10/2008".
- **Sentences.** Keep them short, with one idea each. Use a full stop instead of a comma or "and". Address people as "you". Prefer positive and active sentences.
- **Layout.** Start every new sentence on a new line. Never hyphenate a word across lines. If a sentence must wrap, break it where a reader would pause.
- **Typography.** Sans-serif such as Arial or Tahoma, at least Arial 14. No italics, no all-caps words, no light fonts. Left-aligned, never justified. No columns.
- **Structure.** Put important information at the start, in bold or a box. Repeating important information is fine.
- **Navigation.** Big, clear buttons for next page, previous page and home page. Always show which part of the site the reader is in.
- **Validation.** People with intellectual disabilities must check the text before publication; their feedback must change the text. This is the condition for using the easy-to-read logo.

### 3.7 Netzwerk Leichte Sprache (easy-to-read, German)

Verified from the 2013 rules PDF:
- **Words.** Simple, precise, known words. Explain hard words and announce them. Always use the same word: do not switch between "Tablette" and "Pille". Short words; hyphenate long compounds visibly ("Bundes-Gleichstellungs-Gesetz"). No abbreviations. Use verbs, avoid nouns.
- **Grammar.** Avoid genitive and subjunctive. Avoid figurative language. Avoid negation ("Peter ist nicht krank" becomes "Peter ist gesund").
- **Numbers.** Arabic digits, no Roman numerals, no old year numbers, no big numbers or percentages. Dates as "3. März 2012", not "03.03.12".
- **Sentences.** Short sentences, one statement each, simple structure. Sentences may start with "Oder", "Wenn", "Weil", "Und", "Aber". The Netzwerk PDF gives no numeric word limit; a "12 words maximum" figure circulates online but is not in the rules.
- **Text.** Address the reader as "Sie", personally: "Sie dürfen morgen wählen", not "Morgen ist die Wahl". No questions in body text (some readers think they must answer them). No cross-references; if unavoidable, explain them.
- **Layout.** One simple sans-serif font, size 14 or larger, line spacing 1.5. Left-aligned only. Every new sentence on a new line. No hyphenation at line end. Keep words that belong together on the same line. Many paragraphs and headings.
- **Validation.** Checking by people with learning difficulties is part of the definition of Leichte Sprache.
- **DIN SPEC 33429:2023** formalises these recommendations (paid; status of the final edition not verified).

### 3.8 Selkokieli and Selkokielen mittari 2.0 (easy-to-read, Finnish)

Verified. Finnish is highly inflected, so these rules are the most relevant to Serbian morphology.
- **Scoring.** 96 criteria in four groups: text as a whole (27), words (16), structures (24), layout and images (29). Main criteria are scored 0 to 3. A text counts as selkokieli only if every applicable main criterion scores 2 or 3.
- **Text.** Concrete, everyday examples. No gaps in content. The text explains itself. Address the reader directly ("sinä", 2nd person imperative). Make clear what is mandatory ("täytyy") and what is optional ("voi", "kannattaa"). Instructions to the reader are never in the passive ("lomake täytetään" is banned). No references back to earlier parts ("see the picture on page 3").
- **Words.** Mostly common words; explain a hard word where it first appears; do not explain words readers know. Figurative language only if common. Large numbers only when needed, rounded. No abbreviations except ones better known than their expansion.
- **Structures.** Short clauses and sentences, one important thing per clause. At most one subordinate clause. No participle phrases as noun modifiers ("the instruction received from your doctor"). No converb or infinitive constructions ("Voidakseen osallistua..."). Prefer base forms and the easiest case forms; ban rare cases. Present and simple past tense; conditional only when meaning requires it. Verbs, not noun style. Subject, verb, object order with the verb early. Passive only when the agent is unknown. No double negation. No inserted clauses in the middle of a sentence.
- **Layout.** New sentences and clauses start on a new line where possible; related words stay on one line. Plain font, 12 to 16 pt body. Mostly lowercase, bold and italics only for short emphasis. Left-aligned, ragged right, no hyphenation. Plain background, never text on images. WCAG contrast. Narrow column on the web; forced line breaks must not break on small screens such as phones.
- **Images.** Typical viewing angle, tight crop on what matters, caption close to the image. Symbols always paired with text ("Haku" next to the magnifier).
- **Quick guide rule 10.** Ask readers and subject experts for feedback and revise.

### 3.9 Easy Japanese for residence support (easy-to-read for non-native readers)

Verified from the August 2020 guideline:
- **Three steps.** Rewrite so native readers understand; adapt words and notation for learners; check the draft with teachers or the target readers.
- **Information.** Select what the reader needs instead of translating line by line. Add missing information ("submit to the city office", not "submit to the municipality"). Use illustrations, photos and tables.
- **Sentences.** One sentence, one point. Three or more items become a bulleted list. No roundabout phrasing ("there is a problem", not "it becomes the case that there is a problem"). Avoid loanwords where a native word exists.
- **Grammar.** No double negatives. Avoid passive and causative because they hide who acts. Polite form only, no honorific or humble forms. End every sentence the same way (です/ます).
- **Instructions.** Use "please do X" (〜してください) or "you must X"; avoid "let's X" (〜ましょう) because it reads as an invitation. "You can" for possible, "you cannot" for impossible.
- **Terms.** Keep an important term the reader will meet in real life and explain it right after it: "余震 <= an earthquake that comes later>", "暗証番号 <= a number only you know>".
- **Ambiguity.** Avoid vague quantities ("about", "around") and words with several meanings.
- **Dates and times.** No slashes in dates; write "4 June 2020, from 9 a.m. to 6 p.m.". Write "from X to Y"; never use "〜" for a range because readers misread it.
- **Fonts.** Universal-design fonts recommended.

### 3.10 W3C COGA, "Making Content Usable for People with Cognitive and Learning Disabilities" (digital accessibility)

Verified (W3C Working Group Note, 29 April 2021):
- **4.2.4 Make each step clear.** In a multi-step process, show completed steps, the current step, pending steps and important choices. Example: someone with early dementia is interrupted and needs to see where they are.
- **4.4.1 Use clear words.** Look at the most common 1,500 words. Do not invent new words or give words new meanings. Explain uncommon words next to them.
- **4.4.2 Simple tense and voice.** Present tense, active voice, speak directly to the user. Use local plain-language guidance for other languages.
- **4.4.3 Avoid double negatives and nested clauses.**
- **4.4.4 Literal language.** No metaphors or implied meaning.
- **4.4.5 Keep text succinct.** Short paragraphs with one topic; aim at the start; short sentences with one point; three or more steps as a numbered list. A sentence with more than one "and" or "but" usually has more than one point.
- **4.4.9 Separate each instruction.** Include every step, even the "obvious" ones. Use if/then tables for branches. Friendly graphics make instructions less scary.
- **4.5.7 Clear step-by-step instructions.** Put instructions before the field or action, not in the error message. Example: show an image of a passport with the needed number highlighted.
- **4.8 Provide help.** Icons may support headings, but always with text.
- **WCAG 2.2 SC 3.1.5 Reading Level (AAA).** If text needs more than lower secondary reading ability (about 9 years of school), provide supplemental content or a simpler version.

## 4. Readability metrics and their portability

| Metric | Formula | Calibrated for | Usable for Serbian? |
|---|---|---|---|
| Flesch Reading Ease (1948) | 206.835 − 1.015 × words per sentence − 84.6 × syllables per word | English | Computable, because Serbian syllables are easy to count (vowels plus syllabic р). The coefficients are English-specific, so the score has no meaning for Serbian. |
| Flesch-Kincaid Grade (1975) | 0.39 × words per sentence + 11.8 × syllables per word − 15.59 | English, US grades | Same problem. Grade numbers would be misleading. |
| LIX (Björnsson, 1968) | words per sentence + 100 × words longer than 6 letters ÷ words | Swedish; used across Scandinavia | Computable on any alphabetic text. Commonly cited bands are about 20 very easy, 30 easy, 40 medium, 50 hard, 60 very hard. Serbian inflection makes words longer, so Swedish bands would overstate difficulty. |
| RIX (Anderson, 1983) | long words (7+ letters) ÷ sentences | English, derived from LIX | Same portability as LIX. |
| Wiener Sachtextformel (Bamberger and Vanecek, 1984) | 0.1935 × MS + 0.1672 × SL + 0.1297 × IW − 0.0327 × ES − 0.875, where MS is % words of 3+ syllables, SL average sentence length, IW % words over 6 letters, ES % one-syllable words | German, school grades 4 to 15 | German-calibrated; not portable. |
| Croatian Flesch-type formula (Rasprave IHJJ 40(1):35–58, 2014, "Kvantitativna procjena težine teksta na hrvatskom jeziku") | Flesch-type, recalibrated | Croatian | Nearest calibrated formula to Serbian; not validated for Serbian. Details in the Serbian-sources report. |
| SMOG-Cro (Brangan, 2011 thesis; Collegium Antropologicum 39(1):11–20, 2015) | grade = 2 + √(words of 4 or more syllables in a 30-sentence sample) | Croatian health texts | Same caveat. |
| Knežević 2018 (Serbian) | LIX variant with long word = more than 7 letters | not calibrated | The only Serbian application found; it uses no calibration. |

Recommendation for this project:
1. Do not publish a composite score. Report the two LIX components per screen: average and maximum sentence length in words, and the share of words longer than 6 letters.
2. Count letters in Cyrillic, where љ, њ and џ are single letters. Counting in Latin script would make words look longer.
3. Calibrate thresholds on a set of screens the team has already rewritten and tested with elderly readers.
4. Follow NHS and the easy-language traditions: formulas only prioritise what to rewrite first. They never replace testing with readers.

## 5. Writing for older adults: evidence-based patterns

- **Vision and motor decline are the top barriers.** NN/g tested 123 people aged 65 and older across three rounds (2001, 2013, 2018 to 2019). Small type and small tap targets remained the main problem even on phones (verified, 2019).
- **Older users make more input errors and blame themselves.** Interfaces that accept only one input format, and error messages that are obscure or easy to overlook, stopped participants. Advice: focus on the error, explain it plainly, make it easy to fix (verified, 2019).
- **Task success is lower.** In the 2013 round, participants aged 65 and older succeeded on 55% of tasks against 75% for ages 21 to 55, and took longer (secondary).
- **Interrupted readers need to re-orient.** COGA's dementia example: show completed, current and pending steps so the reader can resume without restarting (verified).
- **Working memory limits favour one step at a time.** COGA 4.4.9: people with impaired working memory make fewer mistakes when steps are clearly separated and none is left out (verified). E-learning studies with older adults report a preference for step-by-step instructions with examples and graphics (secondary).
- **Digital jargon is a specific barrier.** BT research found older people misread "hyperlink" (41%), "QR code" (24%) and "the cloud" (23%) (secondary). Explain every interface word, or use the label exactly as it appears on screen.
- **Instructions belong before the action, with the target highlighted.** COGA 4.5.7: show the document with the needed number highlighted (verified).
- **Older readers want a human fallback.** The NIA checklist recommends offering a phone number or email (secondary). Age UK keeps offline routes as policy.
- **Plain language helps experts too.** GOV.UK cites research where 80% preferred clear English, and the preference grew with education (verified). Simple text does not patronise; Selkomittari explicitly penalises over-explaining.

## 6. Transferable to a Serbian phone wizard for elderly users

Ranked by the number of sources in this survey that state the rule. Checkability tiers:
- **Mechanical:** a script can check it on the Markdown.
- **LLM:** a language model can judge it with a rubric.
- **Human:** it needs people.

| Rank | Rule for our screens | Sources that back it | Count | Checkability |
|---|---|---|---|---|
| 1 | Write short sentences. Hard ceiling 20 words (NHS); Canada calls under 15 to 20 optimal and Australia sets an average of 15. | STE, GOV.UK, NHS, EU, Canada, Australia, US plain language, Sweden 1177, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, Age UK, NIA | 15 | Mechanical |
| 2 | Use common, everyday words. Prefer the short word. | STE, GOV.UK, NHS, US plain language, EU, Sweden 1177, Australia, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, Age UK, NIA | 14 | LLM, with a word list |
| 3 | Give instructions as active imperatives addressed to the reader. Never use passive or impersonal forms such as "се попуњава". | STE, Microsoft, US plain language, GOV.UK, NHS, EU, Canada, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, Age UK, NIA | 14 | LLM; the passive with "се" is partly mechanical |
| 4 | Put one idea in each sentence and one action in each step. | STE, Microsoft, Canada, Sweden 1177, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA | 9 | LLM; "и" plus a second verb is a mechanical hint |
| 5 | Explain an unavoidable term where it first appears. Keep the real term the reader will see, then explain it, as in Easy Japanese's bracket rule. | GOV.UK, NHS, Australia, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, NIA | 9 | LLM |
| 6 | Say things positively. Never use double negatives. Keep "не" only for real warnings. | Canada, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, US plain language, GOV.UK, NIA | 9 | Mechanical count of "не" and "ни"; LLM for double negatives |
| 7 | Test each screen with elderly target readers and revise from what they do. | ISO 24495-1, US plain language, NHS, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, NN/g | 9 | Human |
| 8 | Avoid abbreviations. Spell out an abbreviation on first use, unless it is better known than the full form, as ЈМБГ is. | GOV.UK, Australia, EU, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA | 8 | Mechanical, by matching runs of Cyrillic capitals |
| 9 | Address the reader directly and consistently with formal "Ви". | US plain language, GOV.UK, Inclusion Europe, Leichte Sprache, Selkokieli, Easy Japanese, COGA, Age UK | 8 | Mechanical, by flagging "ти" forms |
| 10 | Use verbs, not nominalisations. Write "платите", not "извршите уплату"; write "проверите", not "обавите проверу". | US plain language, EU, Sweden 1177, Selkokieli, Leichte Sprache, GOV.UK, Microsoft | 7 | LLM, plus a mechanical list of light verbs such as "извршити", "обавити", "вршити" |
| 11 | Use numbered steps for anything done in order. Use a list for three or more items. | STE, Microsoft, GOV.UK, COGA, Easy Japanese, Inclusion Europe, Canada | 7 | Mechanical |
| 12 | Put the most important information or action first in each screen and each sentence. | GOV.UK, Microsoft, Sweden 1177, COGA, Inclusion Europe, Canada | 6 | LLM |
| 13 | Use literal language. No metaphors or idioms. | NHS, Inclusion Europe, Leichte Sprache, Selkokieli, COGA, Easy Japanese | 6 | LLM |
| 14 | Write numbers as digits. Avoid percentages and large numbers. | GOV.UK, NHS, Canada, Inclusion Europe, Leichte Sprache, Easy Japanese; percentages: Inclusion Europe, Leichte Sprache, Selkokieli | 6 | Mechanical |
| 15 | Use pictures to support the text. Crop screenshots to what matters, highlight the button, and keep a caption or alt text close to the image. Never use an icon without a text label. | Inclusion Europe, Leichte Sprache, Selkokieli, COGA, Easy Japanese, NIA | 6 | Alt text present: mechanical. Quality: human |
| 16 | Use large, plain type: sans-serif, 14 pt or larger equivalent, left-aligned, no justification, no italics, no all-caps. | Inclusion Europe, Leichte Sprache, Selkokieli, NIA, NN/g, COGA | 6 | Mechanical in CSS |
| 17 | Use one word for one thing on every screen, from a project term list. Never switch between synonyms such as "налог" and "профил". | STE, Inclusion Europe, Leichte Sprache, COGA, Easy Japanese | 5 | Mechanical, against a term list |
| 18 | Keep paragraphs to 3 sentences or fewer. | NHS, Canada; GOV.UK says 5; STE says 6 | 4 | Mechanical |
| 19 | Separate what the reader must do from what they can do. Use "морате" or the imperative for must, and "можете" for may. | GOV.UK, Selkokieli, Easy Japanese, US plain language | 4 | LLM |
| 20 | Write dates and times unambiguously: "4. јун 2026", "од 9 до 18 часова". Never use slashes or dashes for ranges. | Inclusion Europe, Leichte Sprache, Easy Japanese, GOV.UK | 4 | Mechanical |
| 21 | Make every screen self-contained. Do not refer back to earlier screens; repeat what is needed. | Leichte Sprache, Selkokieli, COGA, Inclusion Europe | 4 | LLM |
| 22 | Avoid foreign and anglicised words where a common Serbian word exists. Explain every interface term, such as link or QR code. | Inclusion Europe, Leichte Sprache, Easy Japanese, BT research | 4 | LLM, with a word list |
| 23 | Include every step, even the obvious ones, such as "Тапните **Даље**." | COGA, Selkokieli, Microsoft | 3 | LLM, and walk-through testing |
| 24 | Show where the reader is in the process and what comes next. | COGA, Inclusion Europe, NIA | 3 | Mechanical; the wizard already shows group progress |

Rules found only in the easy-language tradition, worth using selectively on phones:
- **Start each sentence on a new line and never hyphenate.** Inclusion Europe, Leichte Sprache and Selkokieli all require this. On a phone, a hard break per sentence in Markdown achieves it. Selkokieli warns that forced breaks must still work on small screens.
- **No questions in body text.** Leichte Sprache says some readers think they must answer them. In our wizard, questions belong only in question screens.

Notes on transfer to Serbian:
- **Where the condition goes depends on the source.** STE and Leichte Sprache put the condition first. Sweden's 1177 guidance says put the main point first and do not open with "if" or "because". For the wizard, conditions belong in question screens, so step bodies can open with the action.
- **Some rules are English-only.** The ban on negative contractions and on "-ing" forms has no Serbian equivalent. The German rule against the genitive does not transfer, because the Serbian genitive is ordinary and unavoidable.
- **The Finnish structure rules map onto Serbian forms.**
  - Avoid verbal adverbs such as "попунивши" and "кликћући".
  - Avoid long participle modifiers such as "добијени код".
  - Avoid the passive with "се" in instructions.
  - Avoid stacked genitive noun chains such as "захтев за издавање потврде".
- **Gender pairs need one fixed order.** Leichte Sprache asks for one consistent order when both forms appear. Our answer labels already use "Урадио/ла"; keep that pattern identical everywhere.
- **The STE method transfers through a term list.** The repository already keeps a controlled list of names for transliteration. A matching list of approved interface terms would be the STE "technical noun" list. It would make rule 12 mechanically checkable.
- **The Finnish scoring model suits an LLM reviewer.** Selkomittari scores each criterion 0 to 3 and requires 2 or more on every main criterion. That pass condition fits an LLM review step better than one composite score.
- **No source sets a words-per-screen limit.** Inclusion Europe and Microsoft only say "not too much text" and "fit the steps on one screen". Any limit we set must come from our own testing.
