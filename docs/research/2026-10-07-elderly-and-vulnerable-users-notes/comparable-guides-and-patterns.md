# Comparable guides and design-system patterns for helping older and low-skill people get a digital identity

Scope: international comparables to "eGrađanin korak po korak" (static, phone-first, Serbian Cyrillic step/question/card/end wizard; progress in localStorage; no backend). Serbia-specific programmes and the eUprava UI are out of scope. Research date: 2026-10-07. GOV.UK Design System pages are living documents; they were read on 2026-10-07 and carry no single publication date. Roughly 20 searches and fetches; several national programmes were checked only by search snippet. Those findings are marked "(snippet)" and need verification before anyone relies on them.

## GOV.UK Design System patterns: what research backs them, and documented pitfalls

### Takeaway
GOV.UK's step-by-step navigation, question pages ("one thing per page"), and task list patterns map closely onto this repo's `step` / `question` / `group` model. The published research is mostly qualitative (rounds of usability testing including low-digital-literacy users). The most useful documented pitfalls: users rarely use a step-by-step header, users get frustrated looping between guides, users distrust the browser back button, and step-count progress indicators were removed with no loss in completion.

### Cited Findings
- Step-by-step navigation is meant for "end-to-end journeys" with a start and an end that involve several pieces of guidance or transactions and benefit from a logical order. It should NOT be used when "most guidance or services exist outside GOV.UK", when users only read, or inside a transactional service. Structure: an introduction, numbered expandable steps, tasks as links, and "and"/"or" sub-steps for conditional paths; costs can be shown after link text — [GOV.UK Design System, Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/) (accessed 2026-10-07)
- Research basis for step-by-step: "eight rounds of user testing including people with disabilities and low digital literacy", plus a Digital Accessibility Centre review — [same](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)
- Known issues: "Users rarely use the step by step navigation header, which might suggest the purpose of it is not clear to them"; users get frustrated "when looping back and forth between step by steps"; the pattern cannot appear on confirmation pages — [same](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)
- Question pages: ask one thing per page so users can focus. Always show a back link at the top, because "some users do not trust browser back buttons when they're entering data". Do not reuse the same heading across pages. Hint text is one short sentence with no links — [GOV.UK Design System, Question pages](https://design-system.service.gov.uk/patterns/question-pages/) (accessed 2026-10-07)
- Progress indicators: test whether you need one before adding it. "A number of GOV.UK services have removed this style of progress indicator without any negative effects." The Carer's Allowance team removed a 12-step indicator with no impact on completion rates or times — [same](https://design-system.service.gov.uk/patterns/question-pages/)
- Task list ("Complete multiple tasks"): for long transactions done across several sessions; simplify the service first. Start with only the statuses "Completed" and "Incomplete" and add "In progress" or "Cannot start yet" only if research supports them. A section can end with "Have you completed this section? Yes / No, I'll come back to it later", which suits answers that need information looked up or verified elsewhere. Users must always be able to go back and change answers. The pattern came from GDS in 2017 — [GOV.UK Design System, Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/) (accessed 2026-10-07)
- A warning from UK identity work: GOV.UK Verify's first-attempt verification success rate was 48% against a projected 90%, and only 38% of Universal Credit claimants using it could prove their identity online (NAO report, March 2019) — [PublicTechnology, 2019-03-05](https://www.publictechnology.net/2019/03/05/science-technology-and-research/nao-report-finds-verify-exemplifies-failings-we-often-see-major-programmes/)

### Inferences
- This repo is close to the "do not use" case for step-by-step navigation, because the real service (eUprava) lives on another site. GOV.UK's guidance implies that the guide's value depends on clear hand-offs and clear return points, not on an overview header.
- The Carer's Allowance result is a reason not to add a numeric "step N of 40" counter. The existing coarse "Group · part X of 5" is closer to the evidence, but it is untested.
- The back-link finding supports keeping a visible "Назад" button on every screen.
- Verify shows that identity proofing has a high failure rate even with good design. The "Нисам успео/ла" branch and help paths are core features, not edge cases.

### Gaps
- I did not fetch the start-page, check-answers, or confirmation-page patterns, or GDS blog research posts. Their specific evidence is not recorded here.
- I found no age-specific breakdown of Verify completion.

## Denmark MitID: support for older citizens, what went wrong, what changed

### Takeaway
Denmark relied on in-person channels (Borgerservice citizen service centres, library IT cafés, a 7-day phone line) and physical non-smartphone authenticators (code display, code reader, chip). The main documented failure was that the non-smartphone devices were late when banks switched off NemID in late 2022, which left people without smartphones stuck. Ældre Sagen's MitID page mainly points people to official channels.

### Cited Findings
- Copenhagen libraries' IT cafés give free help with MitID, e-Boks, MobilePay and other digital services; Borgerservice can issue an activation code for the MitID app — [Københavns Kommune, Hjælp til MitID](https://kk.dk/mitid) (undated page; snippet)
- MitID Support phone: 33 98 00 10, Mon–Fri 8–20, weekends and holidays 10–16. To get help at Borgerservice, bring a driving licence or passport, or two other documents, one of them showing the CPR number — [Ældre Sagen, MitID](https://www.aeldresagen.dk/viden-og-raadgivning/vaerd-at-vide/d/digitalisering/mitid) (accessed 2026-10-07)
- The Ældre Sagen MitID page is informational. It offers no Ældre Sagen phone line or printed guide and points to official channels. It notes that the "kodeoplæser" (audio code reader) is sent free by post to people who cannot use a smartphone — [same](https://www.aeldresagen.dk/viden-og-raadgivning/vaerd-at-vide/d/digitalisering/mitid)
- Ældre Sagen's volunteer portal ("frivilligportalen") tells volunteers about MitID changes, which suggests its volunteers help members with MitID — [Ældre Sagen frivilligportalen, Ændringer af MitID ved aktivering af enheder](https://www.aeldresagen.dk/frivilligportalen/aktuelt/aendringer-af-mitid-ved-aktivering-af-enheder) (snippet; not fetched)
- From 1 November 2022 banks phased out NemID. Citizens without smartphones who depended on code displays faced problems because the devices were not expected to work until spring 2023 — [Københavns Kommune, administration's reply on MitID and code displays, Nov 2022](https://www.kk.dk/sites/default/files/2022-11/Forvaltningssvar%20til%20Bente%20M%C3%B8ller%20om%20MitID%20og%20kodevisere.pdf) (snippet); see also [Folketinget Digitalisation Committee, 2022-23](https://www.ft.dk/samling/20222/almdel/DIU/bilag/41/2675254/index.htm) (snippet)
- MitID has three physical alternatives to the app: code display, code reader, and chip — [borger.dk MitID help](https://www.borger.dk/hjaelp-og-vejledning/hvad-har-du-brug-for-hjaelp-til/mitid) (snippet)
- The Danish Agency for Digitisation published "Klæd din bruger på til MitID" (Dec 2022), a guide for frontline staff who help users. The URL now returns 404, so I could not check its contents — [digst.dk PDF (dead link)](https://digst.dk/media/28182/guide_klaed-din-bruger-paa-til-mitid_dec-2022_web.pdf)

### Inferences
- Denmark's model of "bring these documents to the counter" maps directly to this repo's `card` node and to an "if you cannot, go to the post office" branch.
- The NemID → MitID cut-off shows that switchover dates hurt older people most. A static guide should put any deadline and its non-smartphone alternative near the start of the flow.
- The fact that a helper-facing guide ("dress your user") exists is a pattern worth copying: material for the grandchild or volunteer who sits next to the older person.

### Gaps
- I did not reach DR.dk or Politiken coverage, or exact numbers of excluded elderly people. I found no published evaluation of MitID support channels and no documented post-2023 changes.

## Other national eID programmes (NL, IT, AT, FI, UA, and others): guides, helper programmes, evaluations for older users

### Takeaway
The strongest comparables are the Netherlands (682 library "Informatiepunten Digitale Overheid", 60% of questions from 65+, DigiD the single largest topic, plus the Steffie low-literacy DigiD explainer) and Italy (more than 2,800 "Punti Digitale Facile" with facilitators, SPID activation as a core service). Ukraine uses short "serial" lessons for over-60s. Austria and Finland show the barriers: a smartphone with biometrics or bank credentials is required, and in-person registration is needed.

### Cited Findings
- Netherlands, IDO: set up in 2019 by the Manifestgroep, the National Library (KB) and the Ministry of the Interior. Libraries help with applying for DigiD, benefits and taxes. Staff were trained on the services of CAK, the Tax Service, SVB and UWV and did role-play for customer sensitivity. A monitoring and evaluation instrument started in 2019 — [Binnenlands Bestuur, IDOs voorzien in een behoefte](https://www.binnenlandsbestuur.nl/digitaal/informatiepunten-digitale-overheid-voorzien-een-behoefte) (snippet)
- In one library (Het Groene Hart) more than 30% of IDO visitors ask for help installing the DigiD app; in another, 10% — [Binnenlands Bestuur](https://www.binnenlandsbestuur.nl/digitaal/informatiepunten-digitale-overheid-voorzien-een-behoefte) (snippet)
- NOS (2023-07-10): 4.5 million Dutch adults lack the digital skills for government services; 682 IDOs; the 100,000th help request since 2019; 60% of questions come from people 65+; 24% concern DigiD; 38% of conversations last more than 20 minutes. KB's Wietske Kamsma names three things that make DigiD hard: a limited time window for identification, the need for several devices at once, and frequent security updates that break familiarity. Help from family or friends is described as most effective — [NOS, 2023-07-10](https://nos.nl/l/2482218)
- Steffie (digid.steffie.nl): a DigiD explainer ("what DigiD is, how to request it, how to use it") of image, sound and exercises for low-literacy, intellectually disabled and digitally limited users, made by Stichting Leer Zelf Online with Netrex and gemeente Utrecht, supported by Stichting Digisterker and Pharos (translations), and tested with user test groups — [Steffie DigiD, Meer over deze website](https://digid.steffie.nl/nl/meer-over-deze-website/) (accessed 2026-10-07)
- Italy: "Punti Digitale Facile" (PNRR) target more than 3,000 points and 2 million citizens by 2026. More than 2,800 points and 600,000 citizens were reported by early 2024. Core services: requesting and using SPID and CIE, electronic health records, online bookings and payments. Facilitators aim to make citizens autonomous — [BusinessOnline](https://www.businessonline.it/news/imparare-a-usare-il-cellulare-spid-e-servizi-informatici-al-via-i-2800-punti-digitali-facili-statali-gratis_n76404.html); [Regione Emilia-Romagna factsheet, April 2024](https://notizie.regione.emilia-romagna.it/comunicati/2024/aprile/data-valley-bene-comune-parte-da-cesena-la-rete-regionale-dei-punti-201cdigitale-facile201d-che-sorgeranno-in-tutta-l2019emilia-romagna-presentato-oggi-nell2019ambito-del-festival-after-lo-sportello-della-valle-del-savio-gli-assessori-salomoni-e-calvano/scheda-digitale-facile.pdf/@@download/file/scheda%20Digitale%20Facile.pdf) (snippets)
- Austria: ID Austria replaced Handy-Signatur when the pilot ended on 5 December 2023. It needs a smartphone with face or fingerprint unlock and a current OS. Critics noted that about 3 million Handy-Signatur users might have to register in person at an authority — [vol.at](https://www.vol.at/id-austria-ersetzt-am-dienstag-handy-signatur/8444020); [The Local Austria, 2023-10-11](https://thelocal.at/20231011/explained-what-you-need-to-know-about-austrias-new-digital-id/); [Austrian Parliament written question](https://www.parlament.gv.at/dokument/XXVII/J/14916/fname_1555069.pdf) (snippets). The Finance Ministry ran a "joint switch to ID Austria" invitation event in December 2023 — [BMF press release, Dec 2023](https://www.bmf.gv.at/presse/pressemeldungen/2023/dezember/gemeinsamer-umstieg-id-austria.html) (snippet)
- Finland: a survey reported that a quarter of respondents had never authenticated electronically, nearly half of paper-form respondents had never used online services, and reliable personal guidance is hard or impossible to get in many places — [Verkkouutiset](https://www.verkkouutiset.fi/a/sahkoinen-tunnistautuminen-ongelma-iakkaille-moni-edelleen-digiyhteiskunnan-ulkopuolella-65760/) (snippet; the page returned 403, so date and sample are unknown)
- Ukraine: the Diia.Digital Education platform launched in January 2020. Its over-60 course "Basic Digital Skills for Elegant Age People" has 10 lessons built around everyday situations (doctor appointments, pensions, money transfers, email, false information) and uses a "serial" format: episodes instead of lessons, seasons instead of grades. More than 1 million learners use the platform, about 20% aged 55+ — [UNDP Ukraine, New course to help older people master digital skills](https://www.undp.org/ukraine/press-releases/new-course-help-older-people-master-digital-skills) (snippet; date not confirmed)

### Inferences
- The Dutch "several devices at once" and "time-limited identification" problems match the leave-and-return problem in this repo. A guide shown on the same phone as the app makes things harder. A printed or second-screen version of the guide helps.
- IDO and Punti Digitale Facile are natural distribution partners: staff there need a short link or a printable sheet to hand out.

### Gaps
- Not researched in this pass: Estonia (id.ee, Smart-ID), Belgium (itsme), Spain (Cl@ve), Germany (BundID, Online-Ausweis), Poland (mObywatel). I have no findings for them. DigiD-hulp/DigiD-machtigen specifics, other NOS coverage of DigiD, and Der Standard on ID Austria were not fetched. Italy and Austria figures come from search snippets of press and regional pages, not from evaluations.

## Digital-skills programmes for older people (Be Connected, Seniors Go Digital, Learn My Way, Senior Planet): format and outcomes

### Takeaway
All of these programmes combine bite-sized self-paced online modules with in-person helpers in libraries and community centres. Be Connected has the best evaluation: SROI of 4.01:1, more than 580,000 reached, and each completed module raised independent internet use by 10%.

### Cited Findings
- Be Connected (Australia): a 3-year mixed-methods evaluation by Swinburne with 915 participants and stakeholders (report dated 16 June 2020). It found more than 580,000 older Australians reached between 2016 and February 2020 (more than double the target), a social return of $4.01 per $1, and "for each module learners completed, the likelihood of using the internet independently increased by 10 percent", along with less loneliness — [DSS, Be Connected social impact evaluation, 2020-06-16](https://dss.gov.au/system/files/resources/improving-digital-inclusion-older-australians-social-impact-be-connected-16-june-2020.pdf); [eSafety media release](https://www.esafety.gov.au/about-us/newsroom/digital-skills-program-creates-major-value-for-community-and-connects-more-older-australians) (snippet)
- Singapore, Seniors Go Digital / SG Digital Office (SDO, set up June 2020): Digital Ambassadors give one-to-one or small-group coaching in libraries and community centres, at more than 30 SG Digital Community Hubs and more than 200 roving counters. Learning is tiered: Tier 1 communication, Tier 2 government digital services (SingPass Mobile, QR codes), Tier 3 e-payment, with cybersecurity tips in every tier. More than 370,000 seniors learned to go online, and ambassadors helped more than 280,000 seniors adopt digital tools — [IMDA Seniors Go Digital factsheet](https://www.imda.gov.sg/-/media/imda/files/news-and-events/media-room/media-releases/08/annex-a-seniors-go-digital-programme-factsheet.pdf); [MDDI parliamentary reply](https://www.mddi.gov.sg/newsroom/programmes-to-train-seniors-on-digitalisation/) (snippets; dates not confirmed)
- Learn My Way (UK, Good Things Foundation): more than 100 bite-sized topics, from using a touch screen to claiming Universal Credit, picked by need. More than 70,000 users a year, and 88% feel more digitally able or safe. It works for self-study but is regularly used by Digital Champions in hundreds of Digital Inclusion Hubs. Digital Unite has since been involved in its delivery — [Good Things Foundation, New beginnings for Learn My Way](https://goodthingsfoundation.org/insights/new-beginnings-learn-my-way); [Digital Unite, Learn My Way (2024)](https://digitalunite.com/sites/default/files/2024-09/Learn%20My%20Way_DU_formatted.pdf) (snippets)

### Inferences
- "Each module completed raised independent use" supports small, self-contained groups that a person can finish in one sitting, which matches this repo's `group`.
- Every programme pairs content with a human helper. A static guide is most effective as a tool for helpers (family, library staff, volunteers), not only for solo use.

### Gaps
- I did not check AARP Senior Planet. For Be Connected I found no detail on screenshot use, step size, or print material. No programme reported completion rates specific to a government-ID task.

## Handling "leave the guide, use another app, come back"

### Takeaway
Of the evidence found, only the GOV.UK task list explicitly provides an "I'll come back to it later" state. The Dutch IDO evidence names multiple devices and time windows as the main DigiD pain points. Human helpers and offline aids (Denmark's posted code reader, counters) cover the gap.

### Cited Findings
- Task list sections can end with "No, I'll come back to it later", which suits answers that need information looked up elsewhere — [GOV.UK Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/)
- DigiD is hard because identification has a limited time window and needs several devices at once — [NOS, 2023-07-10](https://nos.nl/l/2482218)
- Step-by-step is not recommended when most services are outside the guide's site, and looping between guides frustrates users — [GOV.UK Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)

### Inferences
- This repo's `external` step with answers "Урадио/ла сам / Нисам успео/ла" is effectively a self-reported task-list status. localStorage resume covers the return path only on the same browser, so a printed checklist or card covers the "different device" case.

### Gaps
- I found no published research measuring return rates after hand-off to an external app for any of these guides, and no documented "write this code down" pattern.

## Open-source or community-built guides and government endorsement

### Takeaway
The clearest example of a community-built guide that government adopted is Steffie (a social enterprise working with a municipality and national digital-inclusion foundations). Dutch IDOs and Italian facilitator points are where governments adopt and distribute help, and both work through libraries and NGOs. The GOV.UK Design System itself is open source.

### Cited Findings
- Steffie DigiD was built by Stichting Leer Zelf Online with gemeente Utrecht, Digisterker and Pharos — [Steffie](https://digid.steffie.nl/nl/meer-over-deze-website/)
- IDO was co-founded by libraries (Manifestgroep, KB) and the Ministry of the Interior — [Binnenlands Bestuur](https://www.binnenlandsbestuur.nl/digitaal/informatiepunten-digitale-overheid-voorzien-een-behoefte) (snippet)
- Learn My Way is run by a charity and used by government-funded hubs — [Good Things Foundation](https://goodthingsfoundation.org/insights/new-beginnings-learn-my-way) (snippet)

### Inferences
- The likely adoption path for this repo is the same: partner with a municipality or the library network, so that front-line helpers hand out the link and the print card.

### Gaps
- I did not find a fully open-source (code-licensed) eID onboarding guide that a government adopted.

## Measurable outcomes reported

### Takeaway
Hard numbers exist for reach and attitude (Be Connected, Learn My Way, Seniors Go Digital, IDO) and for identity-verification failure (Verify). None of the guides reported support-call reduction or task-completion rates for eID onboarding.

### Cited Findings
- Be Connected: SROI 4.01:1; more than 580,000 reached; +10% independent use per module — [DSS 2020](https://dss.gov.au/system/files/resources/improving-digital-inclusion-older-australians-social-impact-be-connected-16-june-2020.pdf)
- Learn My Way: 88% feel more able or safe — [Good Things Foundation](https://goodthingsfoundation.org/insights/new-beginnings-learn-my-way) (snippet)
- IDO: more than 100,000 requests by 2023, 24% about DigiD, 38% longer than 20 minutes — [NOS 2023](https://nos.nl/l/2482218)
- Verify: 48% first-attempt success; 38% for Universal Credit claimants — [PublicTechnology 2019](https://www.publictechnology.net/2019/03/05/science-technology-and-research/nao-report-finds-verify-exemplifies-failings-we-often-see-major-programmes/)
- Carer's Allowance: removing the progress indicator did not change completion — [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/)

### Gaps
- No support-call reduction data was found for any programme.

## Candidate action items for this repo

1. **Keep the coarse group progress and do not add a per-screen "N of M" counter.** [code capability] Evidence: Carer's Allowance removed a 12-step indicator with no change in completion ([GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/)).
2. **Show a visible in-page "Назад" link on every screen.** [code capability] (Check the current UI.) Evidence: users distrust the browser back button ([GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/)).
3. **Writing rule: one question or one action per screen, a unique title on every screen, and any hint as one short sentence with no link.** [writing rule] Evidence: [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/).
4. **Every `external` step gets a failure branch that leads to concrete help (the post office counter or a helper) and is never a dead end.** [content] Evidence: Verify succeeded on the first attempt only 48% of the time ([PublicTechnology 2019](https://www.publictechnology.net/2019/03/05/science-technology-and-research/nao-report-finds-verify-exemplifies-failings-we-often-see-major-programmes/)); 38% of IDO help sessions run past 20 minutes ([NOS 2023](https://nos.nl/l/2482218)).
5. **Add a "what to bring" `card` or checklist before any in-person step (ID document, phone, charger, email password).** [content] Evidence: Borgerservice lists the exact documents to bring ([Ældre Sagen MitID](https://www.aeldresagen.dk/viden-og-raadgivning/vaerd-at-vide/d/digitalisering/mitid)).
6. **Add a printable whole-flow checklist ("print this and keep it next to you") for the case where the guide and the eUprava app or site are on the same phone, or the user changes device.** [code capability, static print CSS] Evidence: DigiD's hardest part is needing several devices at once within a time window ([NOS 2023](https://nos.nl/l/2482218)); localStorage resume works on one browser only (inferred).
7. **Add a helper-facing intro screen or page ("Ако помажете некоме") for grandchildren, volunteers and library staff.** [content] Evidence: Denmark published a guide for helpers ([digst.dk Dec 2022, link now dead](https://digst.dk/media/28182/guide_klaed-din-bruger-paa-til-mitid_dec-2022_web.pdf)); NOS reports help from family or friends is most effective ([NOS 2023](https://nos.nl/l/2482218)); Be Connected, Learn My Way and SDO all pair content with a human helper ([DSS 2020](https://dss.gov.au/system/files/resources/improving-digital-inclusion-older-australians-social-impact-be-connected-16-june-2020.pdf); [IMDA](https://www.imda.gov.sg/-/media/imda/files/news-and-events/media-room/media-releases/08/annex-a-seniors-go-digital-programme-factsheet.pdf)).
8. **Early in the flow, state plainly what device is needed and offer a non-smartphone route (the counter path).** [content] Evidence: Danish citizens without smartphones were stranded when non-app devices were late ([KK Nov 2022](https://www.kk.dk/sites/default/files/2022-11/Forvaltningssvar%20til%20Bente%20M%C3%B8ller%20om%20MitID%20og%20kodevisere.pdf)); ID Austria requires a biometric-capable smartphone ([The Local 2023](https://thelocal.at/20231011/explained-what-you-need-to-know-about-austrias-new-digital-id/)).
9. **Keep groups short enough to finish in one sitting, and end each with a small "готово" moment.** [writing rule] Evidence: each Be Connected module completed raised independent internet use by 10% ([DSS 2020](https://dss.gov.au/system/files/resources/improving-digital-inclusion-older-australians-social-impact-be-connected-16-june-2020.pdf)).
10. **Run moderated tests with older users, as Steffie did with test groups and GOV.UK did over 8 rounds including low-literacy users, and record outcomes per group (finished / stuck where).** [process] Evidence: [Steffie](https://digid.steffie.nl/nl/meer-over-deze-website/); [GOV.UK step-by-step](https://design-system.service.gov.uk/patterns/step-by-step-navigation/).
11. **Optional privacy-respecting measurement: count "Нисам успео/ла" clicks per node to find where people get stuck.** [code capability; needs funding if it requires a server, though a free cookieless analytics tier may suffice] Evidence: none of the comparables published completion or support-call data. This gap is worth filling (inferred).
12. **Approach libraries and the local-government digital-help network to distribute the link and the printed cards, following the IDO (NL) and Punti Digitale Facile (IT) model.** [partnership/funding] Evidence: 60% of IDO questions come from people 65+ ([NOS 2023](https://nos.nl/l/2482218)); Italy reports more than 2,800 facilitation points with SPID activation as a core service ([BusinessOnline](https://www.businessonline.it/news/imparare-a-usare-il-cellulare-spid-e-servizi-informatici-al-via-i-2800-punti-digitali-facili-statali-gratis_n76404.html)).
13. **Consider short narrated or audio versions of key screens for low-literacy users, as Steffie (image, sound, exercises) and Diia ("serial" lessons) do.** [content; needs funding for production] Evidence: [Steffie](https://digid.steffie.nl/nl/meer-over-deze-website/); [UNDP Ukraine](https://www.undp.org/ukraine/press-releases/new-course-help-older-people-master-digital-skills).
