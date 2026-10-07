# Designing phone-based step-by-step guidance for older adults (60+) for e-government onboarding

Research date: 2026-10-07. Scope: evidence for "eGrađanin korak po korak", a static, phone-first, no-backend wizard (graph of `step` / `question` / `card` / `end` screens, Serbian Cyrillic Markdown with screenshots, Latin generated, progress in localStorage).

Source-quality legend used below:
- **[fetched]**: page or abstract was retrieved and read this session.
- **[snippet]**: figure seen only in a search-engine summary; page not fetched. Treat as unverified.
- **[standard]**: normative W3C standard text, cited from the stable spec. Not re-fetched this session.

## Q1. What do W3C WAI, NN/g and peer-reviewed studies say about font size, contrast, tap targets, line length, scrolling vs paging, and reading on phones for 60+ users?

### Takeaway
The evidence agrees on direction (bigger text, high contrast, bigger and better-spaced targets, fewer elements per screen, labelled controls) but gives few hard numbers for font size. Target size is the one area with physical measurements: older adults do best with targets of roughly 11–17.5 mm, which is well above the WCAG AA minimum of 24 CSS px and closer to the AAA 44 CSS px.

### Cited Findings
- W3C WAI "Developing Websites for Older People" (page dated 2018, maps WCAG 2.0 to ageing) lists as relevant: text resizable to 200% without loss of content (1.4.4 AA); contrast at least 4.5:1 (1.4.3 AA), 7:1 enhanced (1.4.6 AAA); don't use colour alone (1.4.1); visual presentation incl. line spacing, line length, no justified text (1.4.8 AAA); avoid full or centred alignment; descriptive link purpose (2.4.4); location indicators such as breadcrumbs; consistent navigation (3.2.3) and consistent identification (3.2.4); adjustable time limits (2.2.1); labels and instructions (3.3.2); error identification (3.3.1) **[fetched]** — [W3C WAI, Developing Websites for Older People](https://www.w3.org/WAI/older-users/developing/)
- WCAG 2.2 SC 2.5.8 Target Size (Minimum), level AA: targets at least 24×24 CSS px (or enough spacing) **[standard]** — [W3C, Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- WCAG 2.2 SC 2.5.5 Target Size (Enhanced), level AAA: at least 44×44 CSS px **[standard]** — [W3C, Understanding 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- Jin, Plocher & Kiff (2007, UAHCI, two experiments on button size, spacing and manual dexterity with older adults) recommended a minimum button size of 11.43 mm and spacing of 3.17–12.7 mm to lower error rates for older users **[fetched via W3C summary wiki + search abstract]** — [W3C Mobile A11y TF, Summary of Research on Touch/Pointer Target Size](https://www.w3.org/WAI/GL/mobile-a11y-tf/wiki/Summary_of_Research_on_Touch/Pointer_Target_Size); [Springer chapter record](https://www.springerprofessional.de/en/touch-screen-user-interfaces-for-older-adults-button-size-and-sp/2824982)
- Gao & Sun (2015, Human Factors, older vs younger adults): button sizes larger than 15.9×9.0 mm led to better performance and satisfaction (note: tested on 23-inch screens, not phones) **[fetched via W3C wiki]** — [W3C Mobile A11y TF wiki](https://www.w3.org/WAI/GL/mobile-a11y-tf/wiki/Summary_of_Research_on_Touch/Pointer_Target_Size)
- Older adults' accuracy significantly lower for buttons below 14 mm; best performance at 14–17.5 mm; official guidelines of 7–9 mm are smaller than the average fingertip (10–14 mm) **[snippet; attribution uncertain, probably not Jin 2007, whose own figure is 11.43 mm]** — [ResearchGate search result, Touch Screen UIs for Older Adults](https://www.researchgate.net/publication/221099338_Touch_Screen_User_Interfaces_for_Older_Adults_Button_Size_and_Spacing); [Target and spacing sizes for smartphone user (core.ac.uk PDF)](https://fileserver-az.core.ac.uk/download/pdf/297018872.pdf)
- Average smartphone error rate for older users of 32.17%, about 3× that of young adults, rising disproportionately as target width decreases **[snippet, source page not identified with certainty; likely the core.ac.uk PDF]** — [Target and spacing sizes for smartphone user](https://fileserver-az.core.ac.uk/download/pdf/297018872.pdf)
- Gomez-Hernandez et al. (2023, JMIR mHealth uHealth; systematic review of 40 articles 2010–2021 that ran usability tests with people >60) synthesised guidelines incl.: two "golden rules", simplify and increase size and distance between interactive controls; avoid controls near screen edges; reduce number of elements per screen; label icons with text; use concrete familiar images; use large font sizes; clearly show what is tappable; high foreground/background contrast; favour tapping over gestures; minimise keyboard use; clear, bold feedback after tapping; longer response times and time-outs **[fetched]** — [Gomez-Hernandez et al. 2023, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10557006/)
- NN/g "Usability for Older Adults: Challenges and Changes" (2019-09-08; 123 participants 65+ across 2001, 2013 and 2018–19 rounds, US/CA/AU/DE/JP; 2018–19 round: 18 usability participants on 12 sites + 6 apps, 20 focus group, 10 contextual inquiry) reports older users make more mistakes, and website usability declines about 0.8% per year of age between 25 and 60; the article gives no specific font or target numbers **[fetched]** — [NN/g, Usability for Older Adults](https://www.nngroup.com/articles/usability-for-senior-citizens/)
- Ine (arXiv, January 2026, review/position paper on geriatric digital health) argues high-contrast screens, "lower interaction flow", multimodal feedback and caregiver integration positively influence usability, and that accessibility guidelines are "technically oriented rather than experiential" **[fetched abstract]** — [arXiv 2601.17012](https://arxiv.org/abs/2601.17012)

### Inferences
- For buttons, 44×44 CSS px (WCAG AAA) is the floor that best matches the physical evidence: on typical phones 44 CSS px is roughly 7–9 mm, which is still below Jin's 11.43 mm. Full-width answer buttons at about 56–64 CSS px tall would approach the 11–14 mm range. This is a conversion estimate, not a measured result.
- "Reduce number of elements on screen" and "avoid controls near edges" support the site's current one-screen-one-step model and argue against adding extra links (share, settings, language toggles) to every screen.
- The "golden rule" on spacing matters especially for `question` nodes with three or more stacked answers.

### Gaps
- No verified, age-specific font-size number (px/pt) was found this session; the sources only say "large". The report should not invent 16/18 px figures from this evidence.
- No study found on line length, or on scrolling vs paging, specifically for 60+ on phones.
- The 40% vs 13% error rate at 48 dp for "shaky" vs "non-shaky" participants appeared in a search summary without an identifiable source; excluded.

## Q2. Cognitive load in multi-step instructions: step granularity, numbered lists, one action per screen, progress indicators, confirmation, screenshots vs text

### Takeaway
Older adults prefer and benefit from contextual, step-by-step help shown at the moment of the task; their main failure mode is getting lost. "Fewer steps" is not automatically better: more steps with less to look at per step produced the best learning in one controlled study. GOV.UK's step-by-step pattern measurably raised task completion and confidence.

### Cited Findings
- Zhou, Zhou & Liu (2021, International Journal of Human–Computer Interaction; Exp. 1: n=24 older adults; Exp. 2: n=30): "a predominant problem is that older adults easily get lost" while learning new apps. In Exp. 2, across five information structures, "the highest number of interaction steps with the fewest number of preview size" (2⁸, i.e. 8 binary steps) gave the best learning performance; the authors conclude fewer steps is not necessarily better and the effect depends on how many options are previewed at once. Metaphorical instruction beat step-by-step on ease and time in Exp. 1, but depended on the structure **[fetched abstract]** — [Semantic Scholar record, DOI 10.1080/10447318.2021.1976506](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/10447318.2021.1976506?fields=title,authors,year,venue,abstract)
- Gomez-Hernandez et al. (2023, 40 studies): provide contextualised, step-by-step help; keep instructions and messages short; use simple, familiar, unambiguous language; don't assume familiarity with conventional symbols; maintain focus on the current action; simplify navigation with fewer alternative paths; favour video tutorials over written instructions; provide initial face-to-face training **[fetched]** — [Gomez-Hernandez et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10557006/)
- GOV.UK step-by-step navigation went through 8 rounds of research (incl. people with disabilities and low digital literacy, and a Digital Accessibility Centre review); a remote study found "a significant increase in users' successful task completion, as well as an increase in confidence" (blog 2018-10-17, updated Feb 2019; no sample sizes given) **[fetched]** — [GDS blog, Building a better GOV.UK step by step](https://gds.blog.gov.uk/2018/10/17/building-a-better-gov-uk-step-by-step/)
- GOV.UK research suggested steps should be collapsed by default so users are not overwhelmed **[snippet]** — [GOV.UK Design System, Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation)
- Older adults prefer step-by-step instructions and value exact steps over understanding how the software works; most had difficulty with lengthy instructions **[snippet; dates not verified]** — [How Older Adults Learn to Use Mobile Devices (ResearchGate)](https://www.researchgate.net/publication/262275480_How_Older_Adults_Learn_to_Use_Mobile_Devices); [PMC10736935](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10736935/)
- Personalised review manuals using screenshots from learners' own screens were rated clearer than handwritten notes or general textbooks (2026 conference chapter) **[snippet]** — [Springer, Designing Tailored Manuals... (2026)](https://link.springer.com/chapter/10.1007/978-3-032-29583-5_35)
- In instructional videos for older adults, a cartoon-finger tap cue gave higher ease of learning, satisfaction and shorter completion time than a red rectangle or a real finger (2018 chapter) **[snippet]** — [Springer, How to Help Older Adults Learn Smartphone Applications?](https://link.springer.com/chapter/10.1007/978-3-319-96065-4_16)

### Inferences
- Splitting one long screen into several single-action `step` nodes is supported (lost-ness and short-instruction findings, Zhou et al. 2021), as long as each screen shows few options. The extra taps cost less than the risk of getting lost.
- Screenshots with a clear marker on the thing to tap (an arrow or finger, not just a box) is the best-supported static analogue of the video-cue finding; this is an extrapolation from video to still images.
- Progress indicators: GOV.UK's confidence gain is the closest evidence, but it is for an overview of steps, not a "part X of Y" counter. No study isolating a progress counter for older adults was found.

### Gaps
- No controlled study comparing screenshots versus text-only instructions for older adults on phones was fetched.
- No direct evidence on numbered lists vs prose for 60+ readers, beyond the general "short, step-by-step" guidance.
- No evidence found on confirmation or reassurance messages ("You did it right") as a separate variable.

## Q3. Error recovery and anxiety: fear of "breaking something", abandonment, "I did not manage" paths, going back, resuming

### Takeaway
Older adults put avoiding mistakes ahead of speed, blame themselves, and rely heavily on helpers. Design guidance consistently asks for a safe exit and back option on every screen, forgiving time-outs, and explicit help paths.

### Cited Findings
- Bong & Li (2025, Norway; n=8 aged 65–80, all already had 2FA experience, ICT skill self-rated 1–9/10; user tests of five 2FA methods + interviews + SUS): some participants valued familiarity and "avoiding mistakes" over ease; self-blame quotes ("I am so bad with new technologies and apps!"); all had done 2FA "either they did it themselves or with help and assistance from someone" **[fetched]** — [Bong & Li 2025, SciTePress](https://www.scitepress.org/publishedPapers/2025/132065/pdf/index.html)
- Gomez-Hernandez et al. (2023): provide a safe exit on every screen (e.g., a back button); increase response times and time-outs; show clear feedback after a tap **[fetched]** — [Gomez-Hernandez et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10557006/)
- NN/g (2019): older users make more mistakes than younger users **[fetched]** — [NN/g](https://www.nngroup.com/articles/usability-for-senior-citizens/)
- WCAG 2.2.1 (adjustable time limits) and 3.3.1 (error identification) are listed by W3C as relevant to older users **[fetched]** — [W3C WAI](https://www.w3.org/WAI/older-users/developing/)
- Barriers in e-government adoption reviews include technology anxiety, confidence and preference for face-to-face interaction **[snippet]** — [Enhancing Digital Government Engagement Among Older Adults: Literature Review (ScienceDirect, 2024)](https://www.sciencedirect.com/science/article/pii/S240589632400243X)

### Inferences
- An "I did not manage" (Нисам успео/ла) answer after every external action is the wizard's equivalent of the "safe exit" guideline. It turns a failure into a normal path instead of a dead end.
- Help pages reached from "I did not manage" should say the user did nothing wrong and nothing is broken, since self-blame and mistake avoidance are the observed patterns.
- Because many users finish with a helper (Bong & Li), a `card` or help screen that a relative can read quickly fits real behaviour.

### Gaps
- No quantitative abandonment rates for older adults after a failed step were found.
- No study found on resume-later behaviour (coming back to a half-finished guide) for older adults.

## Q4. Older adults and e-government / eID adoption: measured barriers and interventions

### Takeaway
Barriers are both personal (anxiety, low digital literacy, vision and motor decline, trust) and design-caused (fragmented information, jargon, inaccessible authentication). Older users work around poor e-government sites by "translating" and "contextualising" what they see, and they depend on helpers.

### Cited Findings
- Bar-Lev, Luria & Aisenberg-Shafran (2025, Journal of Technology in Human Services; Israel; n=82 aged 68–98, mean 82; think-aloud on a National Insurance Institute benefits task): two workaround strategies, "translation" and "contextualization", to get past hurdles created by the site's design **[fetched abstract]** — [Semantic Scholar record, DOI 10.1080/15228835.2025.2501961](https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/15228835.2025.2501961?fields=title,authors,year,venue,abstract); [Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/15228835.2025.2501961)
- Reviews list barriers: cost, convenience, information accuracy, confidence, technology anxiety, digital literacy, trust, preference for face-to-face, income and education; fragmented information and complex terminology; age-related visual and motor impairment. Suggested remedies: simplified interfaces, digital-literacy programmes, trust-building, computing support **[snippet; attribution across the returned papers uncertain]** — [Enhancing Digital Government Engagement Among Older Adults (2024)](https://www.sciencedirect.com/science/article/pii/S240589632400243X)
- Das, Streiff, Huber & Camp (2019, Innovation in Aging; adults >60; interviews + think-aloud on hardware security-key registration; n not stated in the abstract): exclusion from 2FA is "by design" (tiny tokens, browser dependencies); organisations serving older adults avoid 2FA over usability concerns **[fetched]** — [Das et al. 2019, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6840946/)
- Bong & Li (2025, n=8, Norway): SMS codes and physical bank code devices preferred; most needed no guidance with SMS **[fetched]** — [Bong & Li 2025](https://www.scitepress.org/publishedPapers/2025/132065/pdf/index.html)
- A qualitative study of ten adults 60+ using 2FA for 30 days linked limited adoption to non-inclusive design, lack of tangible benefit, inconsistent instructions and device dependencies **[snippet; date not verified]** — [Non-Inclusive Online Security: Older Adults' Experience with 2FA (HICSS)](https://scholarspace.manoa.hawaii.edu/items/3fe2dd1f-e420-4873-83c6-0820daf81580)

### Inferences
- "Translation" behaviour suggests the guide should explain government terms (e.g., what "налог" or "квалификовани електронски сертификат" means) in plain words the first time they appear.
- "Inconsistent instructions" are a named barrier: wording in the guide should match the exact labels on the eUprava screens.
- A short "why this is worth it" screen at the start addresses the "lack of tangible benefit" barrier; the existing `welcome` node ("Шта добијате као еГрађанин") already does this.

### Gaps
- No Serbia- or Western-Balkans-specific study of older adults and eUprava/eID was found in this session.
- Quantitative effect sizes for interventions (e.g., assisted onboarding vs self-service) were not found.

## Q5. Switching between the guide and another app or site (tabs, SMS/email codes)

### Takeaway
App switching to fetch a code is a documented friction point: older participants found email codes more irritating than SMS, and some wrote codes on paper to bridge the switch.

### Cited Findings
- Bong & Li (2025, n=8, Norway, experienced 2FA users): "some participants also jotted it down on paper" to cope with memory demands when switching apps; participants were "irritated when required to check their email for the verification code, compared to checking an SMS message"; back-and-forth navigation between apps added cognitive load **[fetched]** — [Bong & Li 2025](https://www.scitepress.org/publishedPapers/2025/132065/pdf/index.html)
- WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum), level AA, says authentication should not depend on a cognitive function test such as remembering or transcribing a code unless there is help such as copy-paste support; SC 3.3.7 Redundant Entry discourages re-asking for information already given **[standard]** — [W3C, Understanding 3.3.8](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html); [W3C, Understanding 3.3.7](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)
- "Maintain focus on current action" and "simplify navigation with fewer alternative paths" (Gomez-Hernandez et al. 2023) **[fetched]** — [Gomez-Hernandez et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10557006/)

### Inferences
- Before any step that sends the user to eUprava or to their SMS/email, the guide should tell them exactly how to come back (e.g., "the guide stays open; come back to it the same way"), and suggest paper and pen for codes, since participants did that on their own.
- Opening external links in a new tab can strand users who do not understand tabs; staying in the same tab can lose their place. Neither choice is supported by direct evidence here; it should be tested.

### Gaps
- No study found that measures guide-to-site switching (as opposed to code retrieval) for older users, nor one comparing same-tab and new-tab behaviour.

## Q6. Cyrillic vs Latin script reading preferences and legibility for older readers in Serbia

### Takeaway
No legibility study for older Serbian readers was found. Population-level surveys show split preference, and qualitative work suggests older Serbians' script attitudes are shaped by the Yugoslav period. The site's choice to offer both scripts is the safe default.

### Cited Findings
- A 2014 survey reported 47% of Serbians preferred Latin and 36% Cyrillic; Latin is described as easier to type on phones (secondary journalism; survey not identified) **[snippet]** — [Emerging Europe, Cyrillic in Serbia is on life support](https://emerging-europe.com/cyrillic-in-serbia-is-on-life-support-but-its-not-dead-yet/)
- A 2023 International Journal of the Sociology of Language article reports older Serbians' script choices are mediated by notions of Yugoslavia and Serbo-Croatian, while younger Serbians and those outside cities may favour Cyrillic for ethnonational reasons **[snippet]** — [De Gruyter, IJSL 2023-0090](https://www.degruyterbrill.com/document/doi/10.1515/ijsl-2023-0090/html?lang=en)
- Constitution: Cyrillic is the official script; Latin is "in official use" **[snippet]** — [WorldAtlas](https://www.worldatlas.com/articles/what-languages-are-spoken-in-serbia.html)

### Inferences
- Older readers who learned in Yugoslav schools likely read both scripts, but this is an inference, not a measurement.
- The relevant design question is whether Latin users can find the Latin version easily, not which script is "better".

### Gaps
- No reading-speed or legibility study comparing Cyrillic and Latin for older adults was found.
- No age-split survey data on script preference in Serbia was verified.

## Q7. Usability testing methods with older participants

### Takeaway
Keep sessions short (about an hour, with breaks), use few realistic tasks, let participants use their own phones, recruit through community centres and word of mouth, and repeat that the site is being tested, not the person. Think-aloud works with very old participants (n=82, aged 68–98) but needs written task prompts.

### Cited Findings
- NN/g "Usability Testing With Older Adults" (2023-07-23): shorter sessions since older adults tire faster; few realistic tasks participants can remember; let them use their own devices and assistive tech; extra setup time for text size; screener on age, tech experience, devices, assistive needs; go to participants' homes or nearby places; repeat that "it is the website that is being tested"; give printed task references for think-aloud **[fetched]** — [NN/g, Usability Testing With Older Adults](https://www.nngroup.com/articles/usability-testing-older-adults/)
- Studies kept total sessions to about 60 minutes including think-aloud practice and rests; recruitment through local senior community centres and word of mouth **[snippet; the summary did not name the paper, so attribution is uncertain]** — [possibly Fan et al., CHI 2021, Older Adults' Think-Aloud Verbalizations](https://www.mingmingfan.com/papers/CHI21_OlderAdults_ThinkAloud_UXProblems.pdf)
- Think-aloud was feasible with 82 participants aged 68–98 on an e-government task **[fetched abstract]** — [Bar-Lev et al. 2025](https://www.tandfonline.com/doi/full/10.1080/15228835.2025.2501961)
- Bong & Li combined one-to-one task testing, semi-structured interviews and SUS with n=8 **[fetched]** — [Bong & Li 2025](https://www.scitepress.org/publishedPapers/2025/132065/pdf/index.html)

### Inferences
- Five to eight older participants per round (as in Bong & Li) is enough for a volunteer team to find the main problems; repeating small rounds fits better than one big study.
- Family members recruiting relatives is practical but risks the helper taking over the phone; observers should ask helpers to stay hands-off for the task.

### Gaps
- The CHI 2021 paper on older adults' think-aloud verbalisations (Fan et al.) could not be read (PDF not parsed); its findings on how older adults express problems were not verified.

## Candidate action items for this repo

1. **Keep "Нисам успео/ла" on every step that leaves the guide** (already on `register-euprava`); route each to a help screen that says nothing is broken and gives one next action. Tag: **writing rule**. Evidence: safe exit on every screen (Gomez-Hernandez 2023); mistake avoidance and self-blame (Bong & Li 2025); older users make more mistakes (NN/g 2019).
2. **One action per `step`; split long screens rather than adding text.** Prefer more screens with fewer things on each. Tag: **writing rule**. Evidence: older adults get lost; more steps with smaller previews learned best (Zhou et al. 2021); short instructions, reduce elements (Gomez-Hernandez 2023).
3. **Every screenshot marks the exact thing to tap** with an arrow or finger, and the body names that label in bold, spelled exactly as on the eUprava screen. Tag: **content**. Evidence: cartoon-finger cue study (2018, snippet); "inconsistent instructions" as a 2FA barrier (HICSS, snippet); clearly show tappable elements (Gomez-Hernandez 2023).
4. **Before any step that sends the user to SMS, email or eUprava**, add a short line: have pen and paper ready, write the code down, then come back to this page. Tag: **content** / **writing rule**. Evidence: participants wrote codes on paper and found email retrieval irritating (Bong & Li 2025); WCAG 3.3.8.
5. **Visible "continue where you left off" on return**, built on existing localStorage progress, shown on the home/start screen with the name of the last step. Tag: **code capability**. Evidence: app-switching load (Bong & Li 2025); maintain focus on the current action (Gomez-Hernandez 2023). Inference: users leave for SMS/eUprava and must find their place again.
6. **Answer and Next buttons at least 44×44 CSS px (WCAG 2.5.5 AAA), full width, with at least 20–24 CSS px between stacked answers (about Jin's 3.17 mm minimum spacing); aim for about 11 mm tall.** (The px-to-mm conversion is an estimate and depends on the device.) Tag: **code capability**. Evidence: WCAG 2.5.5/2.5.8; Jin et al. 2007 (11.43 mm, 3.17–12.7 mm spacing); spacing golden rule (Gomez-Hernandez 2023).
7. **Contrast at least 7:1 for body text (WCAG 1.4.6 AAA); text scales to 200% without breaking (1.4.4); left-aligned, not justified.** Check these in the existing Lighthouse/a11y audit. Tag: **code capability** / **process**. Evidence: W3C WAI older-users mapping; high contrast (Gomez-Hernandez 2023; Ine 2026).
8. **Keep the "група · део X од Y" progress label, and add a step overview available on demand** (collapsed by default). Tag: **code capability** (overview) / **writing rule** (keep group names short and concrete). Evidence: GOV.UK step-by-step raised completion and confidence, steps collapsed by default (GDS 2018). The counter itself has no isolated evidence.
9. **Explain each government term in plain words the first time it appears** (e.g., what a consent ID is) and avoid icons without text labels. Tag: **writing rule**. Evidence: "translation" strategy among 82 users aged 68–98 (Bar-Lev et al. 2025); jargon as barrier (review, snippet); label icons, don't assume symbol familiarity (Gomez-Hernandez 2023).
10. **Write help and `card` screens so a helper (relative or post-office clerk) can read them in seconds.** Tag: **content**. Evidence: all participants had done 2FA alone or with help (Bong & Li 2025); caregiver integration (Ine 2026).
11. **No time limits or auto-advance anywhere in the guide.** Tag: **code capability**. Evidence: WCAG 2.2.1; increase time-outs (Gomez-Hernandez 2023).
12. **Test both Cyrillic and Latin pages with older participants** and make the script switch easy to find. Do not drop either based on current evidence. Tag: **process**. Evidence: split preference (2014 survey, snippet); no legibility study found.
13. **Run small test rounds (5–8 people aged 60+, about 60 minutes, own phone, two or three real tasks, printed task card, "we test the site, not you"), recruiting through family and pensioner clubs; ask helpers to stay hands-off.** Tag: **process**. Evidence: NN/g 2023; CHI 2021 session norms (snippet); Bong & Li 2025 sample design.
14. **Optional short video or animated-tap clips for the hardest steps** (e.g., code entry). Tag: **content**, **needs funding** only if paid hosting is required (a short local MP4/GIF in the repo needs no server). Evidence: favour video tutorials (Gomez-Hernandez 2023); video cue study (2018, snippet).
15. **Measure where people drop off or pick "Нисам успео/ла"**: needs an analytics backend. Tag: **process**, **needs funding**. A zero-cost substitute: a printed or in-person feedback form during test rounds. Evidence: absence of abandonment data for older adults (gap in Q3).
