# Civic tech sustainability, accuracy and adoption for a small volunteer guide

Scope: what the civic tech literature and practitioner guides say about how community-built software
for government services gets adopted, sustained and kept accurate, with every point tied to
"eGrađanin korak po korak". That project is a zero-cost Astro site on GitHub Pages with no backend,
no CMS and no analytics. Non-technical authors write Serbian Cyrillic Markdown and open pull
requests, and CI validates the flow graph and runs an accessibility audit. One engineer owns the
infrastructure. The repo state below was read from `CLAUDE.md` and `CONTRIBUTING.md` on 2026-10-07.
Research date: 2026-10-07. Every source carries the date it gives; "undated" means the page shows no
date.

What the repo already has, so it is not proposed again: a plain-language contributor guide in
`CONTRIBUTING.md` and `CLAUDE.md`, schema and graph validation in CI (`npm run validate`), an
accessibility audit, a print button on `card` screens, a Latin transliteration of every page, offline
re-opening of pages already visited, and "Наставите где сте стали" (continue where you left off). The
repo has no review dates, no feedback channel, no analytics, no licence statement for content, and no
disclaimer or ownership statement. These absences were confirmed only from the two files above and
are worth re-checking in the repo.

## (1) Why small civic tech projects die or survive (post-mortems and sustainability studies)

### Takeaway
Most civic tech dies for human and organisational reasons rather than technical ones. The causes are
no real user demand, owners shifting focus, money and maintainers running out, and lost
relationships with the officials the service depends on. The survivors are narrow, useful services
that someone keeps maintaining for years.

### Cited Findings
- At TICTeC 2018 (18 Apr 2018), Matt Stempeck and Micah Sifry reported that the Civic Tech Field
  Guide listed about 800 tools, of which about 50 were defunct, across 30 countries. They named four
  failure modes:
  1. No user demand. ChangeByUs, Jumo and VoteIQ had early funding, but "users did not have
     interest".
  2. Strategic shutdown, where the owner focused elsewhere or another body already offered the
     service (mySociety's PledgeBank, Sunlight's OpenCongress).
  3. Acqui-hires (Localocracy, ElectNext).
  4. Designs never built to last, such as Flash-based games.

  [TICTeC 2018 – Knowledge from failure](https://tictec.mysociety.org/tictec-archive/2018/presentation/knowledge-from-failure.html)
- A research summary in the Civic Tech Field Guide's directory says that "while some failures relate
  to technology and tech skills, most failures boil down to human elements". It names organisations
  struggling to involve users in design and to keep relationships with the public officials who
  provide key data. [Civic tech tools that did not meet expectations (Civic Tech Field Guide listing, undated)](https://directory.civictech.guide/listing/civic-tech-tools-that-did-not-meet-expectations-lessons-learned-from-the-field)
- The CHI'23 workshop "Failed yet successful" (28 Apr 2023, Hamburg) treats discontinuation as a
  source of learning. It lists "missed momentum, volunteer attrition, design flaws" among the causes
  and notes that some stopped initiatives "inspire other initiatives and create forms of agency". It
  also asks when longevity is not desirable at all.
  [civictech.guide listing](https://civictech.guide/listing/failed-yet-successful-learning-from-discontinued-civic-tech-initiatives)
- Matthew Somerville of mySociety (TICTeC 2019, 20 Mar 2019) said that running civic tech sites over
  a long period brings "unique challenges, not all of which are foreseeable". He named a changing
  internet environment and rising user expectations. TheyWorkForYou (2004), WriteToThem (2005) and
  FixMyStreet (2007) were still running, while PledgeBank and HearFromYourMP ran 2005–2015 and then
  closed. [TICTeC 2019 – When civic tech matures](https://tictec.mysociety.org/tictec-archive/2019/presentation/mature-civic-tech)
- mySociety's own archive notes say that a site, "no matter how small and self-sufficient", needs
  investment in maintenance, user support and updating. mySociety retired projects it could not keep
  "useful and functional". [mySociety archived projects (undated category page)](https://www.mysociety.org/category/archived/groupsnearyou/)
- Angela Dixon of SocietyWorks (17 Oct 2024) wrote, using PledgeBank as the case: "Without funding,
  you can't pay salaries for the people and the supplier costs for maintaining infrastructure". She
  added that services such as FixMyStreet depend on authorities cooperating to act on reports.
  [SocietyWorks – Failures in civic tech](https://www.societyworks.org/2024/10/17/failures-in-civic-tech/)
- The Knight Foundation and Rita Allen Foundation report "Scaling Civic Tech: Paths to a Sustainable
  Future" (15 Nov 2017) interviewed nearly 50 founders and funders (by Catherine Bracy and Elana
  Berkowitz). It found that "very few startups in the space have been able to sustain and scale". The
  report predates 2018 but is still the reference study.
  [Rita Allen Foundation blog](https://ritaallen.org/blog/building-a-sustainable-future-for-civic-tech/);
  [Balkan CSD summary](https://balkancsd.net/scaling-civic-tech-paths-to-a-sustainable-future/)
- Code for America stopped funding brigade operations in 2016. It later won a USD 1M Knight grant
  (2021) for brigade work in seven cities.
  [Knight Foundation / StateScoop coverage via search summary](https://knightfoundation.org/features/civictechbiz)
  (The brigade figures come from a search-result summary. The primary StateScoop article was not
  fetched.)
- A case study of g0v (Taiwan, founded 2012) describes a volunteer community that works nights and
  weekends and is polycentric and loosely structured, which "presents challenges" for sustained
  partnerships. The recommendation to governments is "small-scale, in-depth partnerships" that
  respect the community's independence.
  [European Partnership for Democracy case study (undated)](https://epd.eu/news-publications/exploring-worldwide-democratic-innovations-a-case-study-of-taiwan/);
  [FNF Taiwan – Innovation Democracy Café ep. 6 (undated)](https://www.freiheit.org/taiwan/6th-episode-innovation-democracy-cafe-what-can-governments-do-sustain-their-collaborations)

### Inferences
- This project is already on the "low running cost" side of the PledgeBank lesson: static hosting,
  no servers and no paid services. The remaining cost is human: keeping the steps true as eUprava
  changes. Content maintenance is therefore the main risk to the project's survival.
- The "no user demand" failure mode argues for early tests with real elderly users and partner
  organisations over adding features.
- Discontinuation is not always failure. A planned sunset is legitimate, for example if eUprava
  publishes an equally plain official guide. Planning for it means a clear notice and a redirect, not
  a page left to go stale (see section 2).

### Gaps
- I did not obtain the full text of the Knight/Rita Allen report or of the ACM Interactions 2024
  article "What does failure mean in civic tech?" (HTTP 403). Their detailed recommendations are not
  quoted here.
- I found no published post-mortem of a small volunteer-built static guide, as opposed to platforms.

## (2) Keeping instructional content accurate when the government service changes

### Takeaway
Government publishers handle drift with named content owners, review dates that trigger reminders,
regular audits, and explicit retirement through a withdrawal banner or a redirect. Volunteer crisis
guides added disclaimers to "double-check with authorities" and relied on large pools of volunteer
verifiers. Neither approach is enough for a small team without a dated, owned review cycle.

### Cited Findings
- GOV.UK publishing guidance:
  - Any content type in Whitehall Publisher can carry an optional future review date. The publisher
    gets an email reminder on that date, sent to a team or a personal address.
  - The CSV export shows "whether the content is overdue for a review".
  - Organisations should "monitor your content regularly to check if it's useful for users".

  [GOV.UK – Manage existing GOV.UK content (current guidance, undated)](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/manage-existing-govuk-content/)
- Retiring content on GOV.UK can be done in two ways:
  - Withdraw it: the page stays, with a banner saying it is no longer current, and drops out of
    internal search.
  - Unpublish it: the page is removed, with a redirect to current content.

  [GOV.UK – Retire content](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/retire-content);
  [GOV.UK – Unpublishing and withdrawing](https://gov.uk/guidance/how-to-publish-on-gov-uk/unpublishing-and-archiving)
- A GOV.UK content audit published in Feb 2016 retired 79 items (10.9%) of the audited content by
  withdrawal or redirect. This is older than 2018 but shows that audits routinely find stale content.
  [Inside GOV.UK blog, 19 Feb 2016](https://insidegovuk.blog.gov.uk/2016/02/19/finding-things-audit-12-what-why-how)
- Naprymok.org, a 2022 platform for Ukrainian refugees, had more than 150 volunteers "constantly
  engaged in search, verification, editing and updating" its information.
  [BySol – Naprymok initiative (2022)](https://bysol.org/en/initiatives/naprymok/)
- Other 2022 refugee guides said they could not guarantee information was "up to date or valid
  within the fast pace of changes". They advised double-checking with local authorities, and they
  showed a visible "last updated" date (one page read 15 June 2022).
  [Rubryka – Goodacity (16 Jul 2022)](https://rubryka.com/en/2022/07/16/ukraine-goodacity/);
  [RefTrans resources (2021–22)](https://reftrans.org/publications-and-media/2021/8/18/resources-for-afghan-community-8mryk)
  (These quotes came through a search summary. I could not tie each quote to one exact page.)
- GetCalFresh shows how drift is handled once the government is a partner. Code for America watched
  how counties actually processed applications, which created "a feedback loop between Code for
  America, the counties, and the state that drove process changes". The partnership began in 2013–14
  and became the statewide portal in all 58 counties in 2019.
  [Code for America – GetCalFresh statewide](https://codeforamerica.org/news/california-launches-code-for-americas-getcalfresh-in-all-58-counties);
  [GetCalFresh in Civic Tech Field Guide](https://directory.civictech.guide/listing/getcalfresh)

### Inferences
- The volunteer equivalent of GOV.UK's review date is a `reviewed` (last verified) date per node. CI
  can check it and warn or fail when it is older than N months, much as it already checks reachability
  today. That needs a schema change in `graph.yaml` or front matter, so it is a code capability the
  infrastructure owner would add. Authors would only update a date.
- Screenshots of eUprava go out of date faster than text when the portal is redesigned. One review
  date per screen, rather than one per site, matches how GOV.UK scopes reviews.
- A shown "Проверено: <датум>" (verified on <date>) line, together with "if something looks different,
  check on euprava.gov.rs", matches what the refugee guides did. It also lowers the risk of blame
  when a step changes (see section 5).
- A scheduled GitHub Action that fetches a short list of official eUprava pages and opens an issue
  when their text hash changes would cost nothing. I found no civic-tech source that documents this
  practice, so it is an engineering inference, not evidence.

### Gaps
- I found no documented "change-watch on official pages" practice from a civic tech guide, and no
  sources on WhatDoTheyKnow's help-page maintenance or on Polish volunteer guides in particular.
- I found no evidence on what review interval works for volunteer guides. GOV.UK leaves it to the
  publisher.

## (3) Measuring impact without a backend, privately

### Takeaway
Free, cookieless, script-based counters work on GitHub Pages: GoatCounter (hosted free for
"reasonable public usage", open source) and Cloudflare Web Analytics (free, no client-side state,
sampled). Both can count page views per screen, which is enough to see drop-off along the flow
without identifying anyone. Serbia's data protection law (ZZPL) mirrors the GDPR, so the
no-cookie, no-personal-data design is what keeps a consent banner unnecessary.

### Cited Findings
- GoatCounter:
  - It "doesn't track users with unique identifiers and doesn't need a GDPR notice".
  - It is free for "reasonable public usage", and self-hosting is the option for heavy use.
  - It is open source, built by one developer (arp242), and funded by GitHub Sponsors and NLnet NGI0.

  [goatcounter.com (fetched 2026-10-07)](https://www.goatcounter.com/)
- A third-party description says GoatCounter hashes site, user agent and IP to count unique visits
  without storing identifying data. The same source cites a free limit of about 100,000 page views
  per month and a script of about 3.5 KB.
  [DEV Community – GoatCounter for GitHub Pages](https://dev.to/iam_pbk/why-i-chose-goatcounter-for-my-github-pages-site-7k8)
  (Secondary source. The homepage did not state the 100k figure, so verify it before relying on it.)
- Cloudflare Web Analytics:
  - It launched for everyone on 9 Dec 2020, and it is free.
  - It uses no cookies or localStorage and does not track users "via their IP address, User Agent
    string, or any other immutable attributes". Cloudflare calls fingerprinting more intrusive than
    cookies.
  - It counts a "visit" as a page view whose referrer is from another site.

  [Cloudflare blog – Free, privacy-first analytics (Dec 2020)](https://blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web/)
- An independent review of Cloudflare Web Analytics notes three limits: the data is sampled, it shows
  only the "top 15" of each dimension, and the same person counts as multiple visitors.
  [ctrl.blog review](https://www.ctrl.blog/entry/review-cloudflare-analytics/)
- Serbia's Law on Personal Data Protection (Službeni glasnik 87/2018):
  - It was adopted on 9 Nov 2018 and has applied since 21 Aug 2019.
  - It mirrors the GDPR "in almost all aspects", including lawful basis, privacy by design and data
    protection impact assessments.
  - It is enforced by the Commissioner for Information of Public Importance and Personal Data
    Protection.

  [IAPP – Serbia's law after two years](https://iapp.org/news/a/serbian-law-on-personal-data-protection-law-after-two-years-of-implementation-and-harmonization-with-gdpr);
  [Hunton – Serbia enacts new data protection law (2018)](https://huntonak.com/privacy-and-information-security-law/serbia-enacts-new-data-protection-law)
- On cookies in Serbia: as of early 2025, specific cookie rules were reported to be in drafting, and
  prior consent was reported to be required for cookies that process personal data.
  [ConsentStack – RS ZZPL (undated)](https://www.consentstack.io/regulations/rs-zzpl)
  (Vendor source. A Serbian lawyer should confirm this.)
- GOV.UK guidance tells publishers to use analytics to check that content is "useful for users".
  [GOV.UK – Manage existing content](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/manage-existing-govuk-content/)

### Inferences
- Because every screen is its own URL, page-view counts per node id show where people drop off in
  the flow. Counts of the `help-*` screens show where people get stuck. No custom events or
  identifiers are needed.
- Both tools send each visitor's IP address to a third party on every page load, even though neither
  stores identifiers. A short privacy note in Cyrillic should name the tool and what is counted. That
  is what the DPG privacy indicator expects (section 5), and it is what an elderly audience that is
  wary of scams deserves.
- The site works offline for pages already visited, and the analytics script will fail there.
  Counts are therefore a lower bound and must not be treated as completions.
- The best impact metric needs no tracking at all. "Did you get your account?" asked by a partner
  organisation after an assisted session (section 6) gives a completion figure, which page views
  cannot.
- Self-hosting Plausible or GoatCounter needs a server, so it needs funding and conflicts with the
  "no backend" constraint.

### Gaps
- I did not verify whether the Serbian Commissioner has issued guidance on cookieless analytics in
  particular.
- I did not confirm the current GoatCounter free-tier numbers from a primary source.
- I found no civic-tech-specific ethics guidance on analytics for vulnerable users in this pass.

## (4) Volunteer burnout and single-maintainer risk

### Takeaway
The evidence concerns volunteer attrition and project dependence on a few people more than burnout
as such. Volunteer communities sustain themselves through small, regular rhythms and loose,
distributed ownership, while organisations sustain projects through money or an institutional home.
Because one engineer owns this project's infrastructure, its main risk is a single point of failure.

### Cited Findings
- The CHI'23 workshop lists "volunteer attrition" and loss of "community engagement" among the
  causes of discontinuation.
  [civictech.guide listing (2023)](https://civictech.guide/listing/failed-yet-successful-learning-from-discontinued-civic-tech-initiatives)
- g0v keeps volunteers through monthly meet-ups and hackathons, with members in different regions
  self-organising weekend sessions. Its loose structure is both a strength and a challenge.
  [EPD case study](https://epd.eu/news-publications/exploring-worldwide-democratic-innovations-a-case-study-of-taiwan/)
- Code for America ended central funding of brigades in 2016, and brigades then depended on
  targeted grants.
  [Knight Foundation civic tech feature](https://knightfoundation.org/features/civictechbiz)
- mySociety's view is that every site needs some maintenance investment, and that projects without
  it were retired.
  [mySociety archive](https://www.mysociety.org/category/archived/groupsnearyou/);
  [SocietyWorks 2024](https://www.societyworks.org/2024/10/17/failures-in-civic-tech/)
- GoatCounter itself is maintained by one developer, which is a single-maintainer dependency that
  this project would inherit if it adopted the tool.
  [goatcounter.com](https://www.goatcounter.com/)

### Inferences
- The repo already lowers the bar for authors through plain-language guides, CI that explains
  errors, and Claude Code guidance. The remaining single points of failure are probably GitHub
  organisation admin rights, the Pages deploy, and knowledge of `src/`.
- These can be mitigated at no cost:
  - at least two admins on the GitHub organisation;
  - a CODEOWNERS file mapping `content/` to two or more content reviewers and `src/` to the engineer
    plus a backup;
  - a short "if the maintainer disappears" note covering how deploys work and where the domain or
    settings live.
- Dependencies on single-maintainer services such as GoatCounter should be optional and easy to
  remove: one script tag, no data the project relies on.
- An "editorial calendar" can be as small as a monthly 30-minute review in which content owners walk
  the flow on a real phone and update review dates. It mirrors g0v's regular-rhythm pattern at the
  scale of this team.

### Gaps
- I found no quantitative study of volunteer burnout in civic tech in this pass, nor a primary
  Code for America brigade post-mortem. The Code for America brigade network was wound down in 2023,
  but I did not fetch a source for that, so it is not asserted here.

## (5) Licensing, governance and the Digital Public Goods route

### Takeaway
Registering as a Digital Public Good mostly takes paperwork this project can produce at no cost:
- an OSI licence for the code;
- a Creative Commons licence for the content;
- a stated owner;
- documentation;
- a privacy statement;
- a do-no-harm statement.

It is realistic for a small guide and would bring a listing in the DPG Registry. Two items need care:
"clear ownership" when the owner is an informal volunteer group, and a written policy on
inappropriate content.

### Cited Findings
- The DPG Standard has 9 indicators:
  1. SDG relevance
  2. Open licensing
  3. Clear ownership
  4. Platform independence
  5. Documentation
  6. Extraction of non-PII data
  7. Privacy and applicable laws
  8. Standards and best practices
  9. Do no harm: (A) data privacy and security, (B) inappropriate and illegal content, (C) protection
     from harassment

  Recognised DPGs are "listed in the Registry".
  [DPG Standard (fetched 2026-10-07)](https://www.digitalpublicgoods.net/standard);
  [Submission guide](https://www.digitalpublicgoods.net/submission-guide)
- Requirements from the standard's text on GitHub (the fetch reported "v1.1.4, updated 2021-01-04";
  a newer version may exist):
  - Content needs a Creative Commons licence, with CC BY, CC BY-SA or CC0 preferred. Code needs an
    OSI-approved licence.
  - Ownership must be "clearly defined and documented".
  - Content collections must document how to access the content.
  - Non-PII data and content must be extractable "in a non-proprietary format".
  - The project must "comply with privacy and other applicable laws".
  - Content projects need "policies identifying inappropriate and illegal content" and processes for
    detecting, moderating, reporting and removing it.
  - Interactive platforms need a process to protect users and contributors from harassment.

  [DPG Standard on GitHub](https://github.com/DPGAlliance/DPG-Standard/blob/main/standard.md)
- An independent assessment of the standard and registry is available for context.
  [Leigh Dodds, 24 Feb 2022](https://blog.ldodds.com/2022/02/24/assessing-data-infrastructure-the-digital-public-goods-standard-and-registry/)
- Code for America brigades formalised government relationships with lightweight MOUs, for example
  Open Savannah with the City of Savannah.
  [Open Savannah MOU (undated Dropbox Paper)](https://paper.dropbox.com/doc/H3AINTxg4k2ziqdkZTF3N)

### Inferences
- The content is Markdown with screenshots and the code is Astro. A split licence (MIT or Apache-2.0
  for code, CC BY-SA 4.0 or CC BY 4.0 for `content/`) satisfies the DPG licensing indicator, and
  partners and governments could reuse the text. One caveat: screenshots of eUprava show a
  government interface and may contain third-party rights. Their reuse status should be stated
  separately, and someone with legal knowledge should check it.
- Markdown in git already satisfies "extract in a non-proprietary format". The project has no
  personal data to begin with, which helps indicators 6, 7 and 9A.
- Clear ownership needs a named holder. That could be the volunteer group as an informal
  association, one named person, or a host NGO. The partner landscape is another researcher's topic.
- "Do no harm" for this site means a short content policy (accuracy, no collection of personal data,
  never ask for passwords) and a way to report problems. A GitHub issue template plus a contact
  address is enough, because the site has no user-generated content.
- SDG relevance: SDG 16.9 (legal identity) and 16.10 (access to information) look like the natural
  fit. This is an inference; check the targets' wording.
- Value of registration: credibility with institutions and funders and discoverability. I found no
  evidence that registration brings funding by itself.

### Gaps
- I did not confirm the current DPG Standard version or the current review times.
- I found no source on whether DPG status has helped small content-only projects win government
  endorsement.

## (6) Government endorsement in Europe and the Balkans, and the risks

### Takeaway
The best-documented path is gradual: build something useful, work alongside the agency on real
cases, then formalise. GetCalFresh moved from a 2013 observation to a 2014 partnership to statewide
adoption in 2019, and brigades used lightweight MOUs. The g0v experience suggests governments sustain
"small-scale, in-depth partnerships" rather than broad ones. I found little Balkan-specific evidence
in this pass.

### Cited Findings
- GetCalFresh:
  - Code for America noticed in 2013 that SNAP applicants were struggling.
  - It launched GetCalFresh with California in 2014 and cut application time from 45 to 8 minutes.
  - It was adopted statewide in all 58 counties in 2019.
  - As of 2025 it had helped 6.2 million people access more than USD 12.8 billion.

  [Code for America – statewide launch](https://codeforamerica.org/news/california-launches-code-for-americas-getcalfresh-in-all-58-counties);
  [Code for America – Shoulder to Shoulder](https://codeforamerica.org/news/shoulder-to-shoulder-building-capacity-for-state-owned-benefits-delivery-systems/)
- Lessons from g0v and vTaiwan for governments: integrate civic tech participation into policy
  planning, keep partnerships small-scale and in-depth, and respect the community's independence.
  [FNF Taiwan](https://www.freiheit.org/taiwan/6th-episode-innovation-democracy-cafe-what-can-governments-do-sustain-their-collaborations);
  [EPD](https://epd.eu/news-publications/exploring-worldwide-democratic-innovations-a-case-study-of-taiwan/)
- Brigade–city MOU template: [Open Savannah MOU](https://paper.dropbox.com/doc/H3AINTxg4k2ziqdkZTF3N)
- Service dependence on authorities: SocietyWorks says services such as FixMyStreet depend on
  authorities cooperating. [SocietyWorks 2024](https://www.societyworks.org/2024/10/17/failures-in-civic-tech/)

### Inferences
- The project's ladder of endorsement, cheapest first:
  1. An eUprava or ministry help desk links to the guide from a FAQ.
  2. A partner such as a library or a pensioners' association uses it in assisted sessions.
  3. A written MOU or letter of support.
  4. An institution forks or adopts the repo. An open licence makes this possible without asking.
- An Open Government Partnership commitment is a possible formal route. I did not verify Serbia's
  current OGP action plan.
- Risks:
  - Being mistaken for an official site. The guide sits next to a government login and uses
    eID-related vocabulary, which could look like a phishing look-alike to cautious users or to
    security teams.
  - Blame when steps go wrong.

  Mitigations:
  - a visible "unofficial, volunteer guide" line on every screen;
  - never asking for credentials, and saying so;
  - linking only to the canonical `euprava.gov.rs` and naming that domain in the text;
  - not copying government logos or visual identity;
  - showing the "verified on" date (section 2).

  These mitigations are inferences. I found no cited case of a civic guide being reported as
  phishing.

### Gaps
- I found no documented examples of Balkan or Serbian institutions endorsing a volunteer guide, and
  no OGP commitment text covering one. The Serbian partner landscape is assigned to another
  researcher.
- I found no sourced cases of volunteer guides being blamed for errors or flagged as phishing
  look-alikes.

## (7) Feedback loops with elderly and offline users

### Takeaway
For older adults, the evidence-backed channel is assisted, in-person support. Library drop-ins, Age
UK digital-inclusion volunteers and one-to-one sessions exist and collect participant feedback
through short surveys. A static site should plug into these channels rather than rely on online
forms alone.

### Cited Findings
- Libraries run IT-help drop-ins and bookable one-to-one appointments for older people. Norfolk
  Library's "Online, safe and in control" project ran across four branches.
  [Ofcom – Norfolk Library end-of-project report](https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/making-sense-of-media/evaluate/what-works-in-media-literacy/norfolk-library--online-safe-and-in-control-end-of-project-report.pdf)
- A Northumbria study interviewed 15 library staff and volunteers and 25 older people. It found that
  the barriers were device access, anxiety, security concerns and the skills gap.
  [Northumbria research portal – Digital inclusion in later life](https://researchportal.northumbria.ac.uk/en/publications/digital-inclusion-in-later-life-the-role-of-libraries-in-helping-/)
- Age UK Isle of Wight surveyed workshop participants and people who had received one-to-one support
  to evaluate their satisfaction (Nov 2023).
  [Age UK IoW digital support survey (Nov 2023)](https://www.ageuk.org.uk/bp-assets/globalassets/isle-of-wight/digital-support-survey-results-shephard-and-moyes---nov-2023.pdf)
- The University of St Andrews "Digital Inclusion in Later Life" project has a written volunteer
  policy covering recruitment and deployment of volunteers (2024).
  [St Andrews volunteer policy (PDF)](https://sachi.cs.st-andrews.ac.uk/files/2024/11/Digital-Inclusion-in-Later-Life-Volunteer-Policy.pdf)

### Inferences
- The `card` screens are already built to be printed and shown at a counter. The same print path can
  carry a QR code and a short paper feedback slip that partner volunteers collect. Paper responses
  enter the repo as GitHub issues filed by the volunteer, so the site needs no backend.
- Zero-cost online channels:
  - a `mailto:` link (it opens the phone's email app, which is a barrier for this audience);
  - a GitHub issue template for helpers, not for elderly users;
  - a free-tier form service. Its data processing must be named in the privacy note, and free tiers
    may need funding later.
- "Did this help? Да / Не" buttons could be recorded as GoatCounter or Cloudflare events or page
  views without identifiers. They inherit the analytics privacy note from section 3.
- Security anxiety is a known barrier. Feedback prompts must never ask for personal data,
  JMBG (personal ID number) or passwords, and should say so.

### Gaps
- I did not find a study of QR-code feedback or "was this page helpful" buttons used by older adults,
  nor sources on phone lines run by partners. The other researcher's Serbian partner mapping should
  name the channels.

## Candidate action items for this repo

Each item is tagged and cites its evidence.

1. Add a "reviewed" (last verified) date per node and have CI warn when it is older than N months
   (proposed: 6, or immediately after a known eUprava release). Show "Проверено: <датум>" on the
   screen.
   - Tag: code capability, plus a writing rule (update the date whenever you check a screen).
   - Evidence: GOV.UK review dates and overdue-review export
     ([GOV.UK](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/manage-existing-govuk-content/));
     refugee guides' "last updated" practice
     ([Rubryka 2022](https://rubryka.com/en/2022/07/16/ukraine-goodacity/)).
2. Add a GitHub issue template, "Корак више није тачан" ("This step is no longer correct"), with
   fields for the screen id, what you see now, a screenshot and the date. Link to it from the footer
   for helpers and partners.
   - Tag: process.
   - Evidence: GOV.UK feedback-driven maintenance
     ([GOV.UK](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/manage-existing-govuk-content/));
     the human failure mode of losing touch with users
     ([Civic Tech Field Guide](https://directory.civictech.guide/listing/civic-tech-tools-that-did-not-meet-expectations-lessons-learned-from-the-field)).
3. Add a writing rule to `CLAUDE.md` and `CONTRIBUTING.md`: when eUprava changes, either update the
   screen or retire it. To retire a screen, point its `next` elsewhere and delete the folder, rather
   than leaving a stale step.
   - Tag: writing rule.
   - Evidence: GOV.UK withdraw and unpublish practice
     ([GOV.UK retire content](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/retire-content)).
4. Hold a monthly 30-minute "walk the flow on a real phone" review, rotating among content owners, in
   which reviewers update the review dates. The manual phone check in `CONTRIBUTING.md` can serve as
   the checklist.
   - Tag: process.
   - Evidence: g0v's regular-rhythm model
     ([EPD](https://epd.eu/news-publications/exploring-worldwide-democratic-innovations-a-case-study-of-taiwan/));
     mySociety's point that even small sites need maintenance
     ([mySociety](https://www.mysociety.org/category/archived/groupsnearyou/)).
5. Optional: add a scheduled GitHub Action that hashes a short list of official eUprava help pages and
   opens an issue when one changes.
   - Tag: code capability.
   - Evidence: an inference only, with no civic-tech source. It responds to the content-drift risk in
     section 2.
6. Add CODEOWNERS (`content/` needs at least two content reviewers; `src/`, `.github/` and config
   need the engineer plus a named backup), require one approving review, and have at least two GitHub
   organisation admins.
   - Tag: process.
   - Evidence: volunteer attrition as a cause of discontinuation
     ([CHI'23](https://civictech.guide/listing/failed-yet-successful-learning-from-discontinued-civic-tech-initiatives)).
7. Write a one-page maintainer handover: how a deploy works, where the settings are, how to roll
   back.
   - Tag: process.
   - Evidence: the same attrition evidence, and Code for America brigades losing central support
     ([Knight](https://knightfoundation.org/features/civictechbiz)).
8. Add a split licence: an OSI licence for code (MIT or Apache-2.0) and CC BY-SA 4.0 or CC BY 4.0 for
   `content/`, with a note that eUprava screenshots show a government interface. State the owner
   (the volunteer group or a host organisation) in the README.
   - Tag: process, plus partnership/funding (the owner decision).
   - Evidence: DPG indicators 2 and 3
     ([DPG Standard](https://github.com/DPGAlliance/DPG-Standard/blob/main/standard.md)).
9. Add a short Cyrillic page or footer note with three statements:
   - "Ово није званични сајт" ("This is not an official site"), with a link to `euprava.gov.rs`;
   - "никад не тражимо лозинку ни ЈМБГ" ("we never ask for your password or JMBG");
   - what, if anything, is counted.

   Do not copy government branding.
   - Tag: content.
   - Evidence: DPG indicators 7 and 9
     ([DPG](https://github.com/DPGAlliance/DPG-Standard/blob/main/standard.md)); ZZPL mirrors the
     GDPR ([IAPP](https://iapp.org/news/a/serbian-law-on-personal-data-protection-law-after-two-years-of-implementation-and-harmonization-with-gdpr)).
     The look-alike risk itself is an inference.
10. Optionally add a cookieless counter, either GoatCounter (hosted, free) or Cloudflare Web Analytics.
    Use page views per node id for drop-off and do not send custom identifiers. Document it in the
    privacy note and make it removable with one line. Self-hosting would need funding.
    - Tag: code capability.
    - Evidence: [GoatCounter](https://www.goatcounter.com/);
      [Cloudflare 2020](https://blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web/);
      [ctrl.blog limits](https://www.ctrl.blog/entry/review-cloudflare-analytics/).
11. Add a "Да ли вам је ово помогло? Да / Не" ("Did this help? Yes / No") prompt on `end` and `help-*`
    screens, recorded as a page view or event without identifiers. It depends on item 10.
    - Tag: code capability plus content.
    - Evidence: the GOV.UK principle of monitoring usefulness
      ([GOV.UK](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/manage-existing-govuk-content/)).
12. Put a QR code and a short paper feedback slip on the printable `card` screen. Partner volunteers
    (libraries, pensioners' clubs) collect the slips and file them as issues, and record "did the
    person get an account?" after assisted sessions.
    - Tag: partnership/funding. Printing has a small cost, so it needs funding or partner support.
    - Evidence: library and Age UK assisted-support models with participant surveys
      ([Ofcom/Norfolk](https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/making-sense-of-media/evaluate/what-works-in-media-literacy/norfolk-library--online-safe-and-in-control-end-of-project-report.pdf),
      [Age UK IoW 2023](https://www.ageuk.org.uk/bp-assets/globalassets/isle-of-wight/digital-support-survey-results-shephard-and-moyes---nov-2023.pdf)).
13. Test with real elderly users through a partner before adding features.
    - Tag: process, plus partnership/funding.
    - Evidence: "no user demand" is the top failure mode
      ([TICTeC 2018](https://tictec.mysociety.org/tictec-archive/2018/presentation/knowledge-from-failure.html)).
14. Seek endorsement step by step: a link from an official help page or FAQ, then a partner's
    assisted-session use, then a letter or MOU. Present the open licence as a ready path for the
    institution to adopt the repo.
    - Tag: partnership/funding.
    - Evidence: the GetCalFresh trajectory
      ([Code for America](https://codeforamerica.org/news/california-launches-code-for-americas-getcalfresh-in-all-58-counties));
      the brigade MOU ([Open Savannah](https://paper.dropbox.com/doc/H3AINTxg4k2ziqdkZTF3N));
      g0v's small, in-depth partnerships
      ([FNF](https://www.freiheit.org/taiwan/6th-episode-innovation-democracy-cafe-what-can-governments-do-sustain-their-collaborations)).
15. Once items 8 and 9 exist, apply to the DPG Registry for credibility with institutions and funders.
    Registration itself costs nothing as far as I found.
    - Tag: partnership/funding.
    - Evidence: [DPG Standard](https://www.digitalpublicgoods.net/standard);
      [Submission guide](https://www.digitalpublicgoods.net/submission-guide).
16. Write a sunset plan: if eUprava publishes an equally plain official guide, or if no one can
    maintain the site, show a banner and redirect to the official guide rather than letting the site
    go stale.
    - Tag: process.
    - Evidence: the CHI'23 point that longevity is not always desirable
      ([civictech.guide](https://civictech.guide/listing/failed-yet-successful-learning-from-discontinued-civic-tech-initiatives));
      GOV.UK withdrawal banners
      ([GOV.UK](https://gov.uk/guidance/how-to-publish-on-gov-uk/unpublishing-and-archiving)).
