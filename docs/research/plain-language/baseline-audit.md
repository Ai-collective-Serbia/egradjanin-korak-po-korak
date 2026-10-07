# Baseline language audit: eGrađanin korak po korak (main at 93be62c)

Scope: language only. Facts were not re-checked and nothing in the repo was edited.

There are two populations:
- PROSE: 37 nodes, 34 with a body, plus the three body-less questions have-id-card, have-email and have-smartphone. The counter-list letter picker is included here.
- DIRECTORY: the 24 counter-list-<letter> screens, which are address and opening-hours tables. They total about 26,000 words, and counter-list-b alone has 7,569. They are reported only in section 6.

## 1. Summary
1. Sentences are already short. Mean 7.7 words, median 7, max 21. Only 3.5% exceed 15 words and 0.4% exceed 20. A cap of 15 or 20 words would affect about 16 sentences, half of them one repeated sentence.
2. Screen length is the real problem. Six screens have 150 or more body words. activate-consentid has 340 words plus 33 words of alt text, 5 headings and 4 lists.
3. The biggest consistency problem is one word with several meanings. "картица" means a browser tab, the ID card, a bank card and a smart card. "страна" means this guide screen, a side of the ID card and a store page. "потврда" means a paper slip, a confirm button, an email confirmation and a phone approval. "пошта" means both the post office and the mailbox.
4. One object also gets several names:
   - A tab is "картица" or "страница".
   - The guide is "ова страна", "водич" or "овде".
   - Activating the app is "Активирајте", "Укључите" and "активирана" on the same screen.
   - The user ID is "ИД корисника" and "кориснички ИД" four lines apart.
5. Instruction verbs are very consistent. "притисните" appears 84 times in 20 nodes, "додирните" once and "кликните" never. "упишите" is used throughout and "унесите" never.
6. Address is second person plural throughout, with lowercase "вам/вас". There are no real second person singular slips. There is one author "we", in register-open: "Ово смо показали".
7. Answer labels mix five voices:
   - first person past, such as "Урадио/ла сам" (12)
   - statements, such as "Порука није стигла" (24)
   - imperatives, such as "Изаберите друго слово" and "Погледајте списак шалтера"
   - first person future, such as "Урадићу касније" (3)
   - yes/no (8)
8. Passives are rare. Negation is common: 64 of 458 sentences. The disclaimer "Није права, на њу не треба да притискате" repeats 6 times and has two negations.
9. Numbers are usually digits for 10 and above and words for small counts, with breaks:
   - The PIN is "6 цифара" on one screen and "шест цифара" on two.
   - The number of counters is "1.473" on one screen and "преко 1.000" on the next.
10. Some abbreviations and jargon are never explained or explained late:
   - QR appears in welcome and is explained four screens later.
   - ПИН and ЈМБГ are never explained.
   - "Портал еИД", "MB", "есДневник", "потпис у клауду" and "виши ниво поузданости" are not explained.
   - The directory screens have 6 Latin-letter homoglyphs inside Cyrillic words and 27 broken opening-hours lines.

## 2. Numbers, overall (prose population)
| Measure | Value |
|---|---|
| Nodes measured | 37 (34 with a body) |
| Body words (sentences plus headings, no alt text) | 3,633 total, mean 107 per screen with a body |
| Alt text | 26 images, 381 words, mean 14.7 words, max 20 |
| Sentence units | 458: 236 in paragraphs (list intros included), 222 inside list items |
| Words per sentence, all units | mean 7.7, median 7, max 21 |
| Paragraph sentences only | mean 8.6, median 8, max 21 |
| List items only | mean 6.8, median 7, max 18 |
| Over 15 words | 16/458 (3.5%); paragraph sentences only 14/236 (5.9%) |
| Over 20 words | 2/458 (0.4%) |
| Paragraphs (prose blocks, lists excluded) | 137, mean 1.7 sentences, max 5 |
| Paragraphs with 4+ sentences | 2: confirm-email (5), activate-consentid (4) |
| Paragraphs with exactly 3 sentences | 14 |
| Lists | 47, mean 3.4 items, max 7 |
| Lists with 6+ items | register-login-data (7); register-personal-data, register-error, install-consentid, find-counter, activate-consentid (6 each) |
| Words with 10+ letters | 273/3,613 (7.6%); "притисните" alone accounts for 71 |
| Headings per screen | max 5 (welcome, activate-consentid) |
| Titles | mean 4.7 words / 29 characters; max 9 words / 44 characters |
| Answer and button labels | 82 (letter-screen repeats counted once), mean 3.3 words / 18.4 characters; max 8 words / 36 characters |

Screens by body words, longest first:

| Screen | Body words | Alt words |
|---|---|---|
| activate-consentid | 340 | 33 |
| welcome | 273 | 19 |
| register-upload | 239 | 27 |
| switch-tabs | 178 | 64 |
| register-open | 168 | 19 |
| register-error | 150 | 0 |
| find-counter | 145 | 0 |
| register-login-data | 144 | 0 |
| register-personal-data | 141 | 0 |
| cloud-check-login | 137 | 18 |
| cloud-approve | 125 | 42 |
| register-document-data | 112 | 14 |
| check-id-card | 110 | 55 |
| confirm-email | 105 | 9 |
| all others | 14 to 98 | |

The earlier QA pass reported every body under 150 words. Six screens now exceed that.

- Longest title: check-id-card, "Како да проверите да ли вам лична карта важи" (9 words).
- Longest labels: "Стигла је порука да је налог активан" (wait-activation, 7 words) and "Пријављен/а сам, а и даље не иде" (cloud-check-login, 8 words).

Most frequent long words (10+ letters, grouped by a crude stem):

| Count | Words | Nodes |
|---|---|---|
| 71 | притисните | 20 |
| 41 | апликација/-у/-е/-ом/-и | 12 |
| 12 | фотографију/-е/-а | 6 |
| 10 | притискате, притискајте | 7 |
| 9 | регистрација/-е/-у/-и | 8 |
| 8 | погледајте | 7 |
| 8 | квадратићима | 8 |
| 7 | корисничко/-и/-им | 7 |
| 6 | продавници/-а | 2 |
| 6 | сертификат | 3 |
| 6 | пријављени | 3 |
| 5 | електронски/-е | 4 |
| 5 | фотографишите/-ете | 3 |
| 4 | региструјете | 4 |

Three uses each: полицијској/-а, активацију/-а, припремите, попуњавате, наранџастом, региструјте.

Two uses each: пребивалиште/-у, најкасније, активирајте/-ате, потврђујете, потписујете, одштампана, регистровани/-ли, регистрован/-ао, администрације/-и, инсталирај/-ате, инсталираном, скенирајте, квалификовани.

One use each: држављанству, есДневнику.

Most long words are the core action verbs and "апликација", so a general ban on long words is impractical. A ban on the rare abstract ones is practical: квалификовани, пребивалиште, држављанству, администрације.

## 3. Longest sentences
| Words | Node | Sentence |
|---|---|---|
| 21 | activate-consentid | Ако мислите да ћете га заборавити, запишите га на папир који чувате код куће, никако у телефону и никако уз телефон. |
| 21 | cloud-approve | То је број од шест цифара који сте сами смислили када сте први пут укључили апликацију, на шалтеру или код куће. |
| 18 | register-error (list item) | Лозинка: проверите да има од 8 до 20 знакова, велико и мало слово, број и један од знакова ! @ # $ % & *. |
| 18 | install-consentid | Ако желите да прочитате више о апликацији, то пише на сајту eid.gov.rs, у менију Услуге → Мобилна апликација ConsentID. |
| 18 | done-basic | Са корисничким именом и лозинком можете да закажете термин за личну карту или пасош и да проверите порез. |
| 17 | six register nodes | Да пређете на формулар: притисните дугме са квадратићима (понекад има број), на дну или на врху екрана. |
| 17 | activate-consentid | Чувајте га као ПИН од платне картице и не дајте га никоме, ни службенику ни члану породице. |
| 17 | cloud-check-login | Ако на сајту пише да је сертификат у клауду већ активан, значи да сте га већ укључили. |
| 16 | welcome (list item) | Лична документа: закажите термин за личну карту или пасош, за себе и до четири члана породице. |
| 16 | create-email | Притисните дугме са квадратићима, на дну или на врху екрана, и изаберите еГрађанин корак по корак. |

Only five sentences have 3+ commas or 3+ subordinating words, a rough proxy for nested clauses:
- find-counter: the bank list "Banca Intesa, Addiko, Yettel Bank, 3Bank, AIK, ALTA," has 6 commas, all Latin names.
- switch-tabs: "Android телефон, Chrome: горе десно, поред адресе, квадратић са бројем." has 3 commas and no verb.
- find-counter: "Ако већ знате где ћете ићи, притисните Знам где ћу ићи." has three clause markers and two persons in one line.
- activate-consentid: the 21-word PIN storage sentence above.
- cloud-check-login: the "значи да" sentence above.
## 4. Synonym and homonym inconsistency (key output)
Counts cover prose bodies, headings, titles and labels. Labels repeated on all 24 letter screens are counted once. Senses were split by hand from the matching sentences in output-kwic.txt, so counts marked "about" are approximate.

### 4a. One word, several meanings
| Word | Senses (counts) | Nodes per sense | Risk |
|---|---|---|---|
| картица (19) | browser tab 11; ID card 4; bank card 2 ("ПИН од платне картице"); smart card for a reader 2 ("без читача картица", "читач ни картица") | tab: switch-tabs, create-email, register-open, cloud-login, cloud-issue, cloud-check-login. ID card: check-id-card, prepare-id-photos. Bank card: activate-consentid, cloud-approve. Smart card: welcome, cloud-certificate | High. switch-tabs teaches that "картица" is a tab, then prepare-id-photos says "Окрените картицу" for the ID card |
| страна (44, plus 1 false hit "страни држављани") | this guide screen 28 ("на дну ове стране", "не на овој страни", "вратите се на ову страну"); side of the ID card or passport page 15; store page 1 | guide screen: 16 nodes. Card side: check-id-card, prepare-id-photos, register-upload, register-personal-data, register-document-data | High. register-document-data uses both senses on one screen: "не на овој страни" and "са предње стране личне карте" |
| страница (22) | browser tab about 12 ("отворене странице", "притисните страницу eid.gov.rs", "између страница"); web page about 10 ("Страница за пријаву", "страницу Контакт", "Страница се не отвара") | tab: switch-tabs, register-open, six register nodes. Web page: register-open, register-error, cloud-login, help-technical, help-account | Medium. Overlaps with "картица" for tab and with "страна" for page |
| потврда / Потврди / потврдите (26) | paper slip from the counter 9; email-confirm button or act 7; phone approval of a login 7; "Потврда лозинке" field 1; "потврђујете да сте то ви" 2 | slip: find-counter, activate-consentid. Email: register-error, confirm-email, wait-activation. Login approval: activate-consentid, cloud-certificate, cloud-approve | High. activate-consentid uses it six times for the paper slip, and also "потврдом на телефону" and "да потврдите" for the PIN |
| пошта (9) | mailbox 7 ("освежите пошту", "потражите поруку у пошти", "имејл пошти"); post office 2 | mailbox: register-error, confirm-email, email-missing. Post office: find-counter, help-account | Medium. "у пошти" means the mailbox in register-error and the post office in help-account |
| слика (21) | screenshot or illustration about 13 ("Слика испод је само пример"); photo of the ID card about 5 ("свака слика … 3 MB", "две слике"); portrait 2 ("страну са својом сликом"); icon 1 ("сличица слика") | 13 nodes | Medium. One word covers both "the picture you must not tap" and "the photo you must upload" |
| документ(а) (10) | personal documents; the ID card in form fields ("Тип документа", "Број документа"); files to upload ("Приложите документа"); documents you sign | welcome, register-upload, register-document-data, cloud-certificate | Low to medium. The form-field wording is fixed by the site |
| отворите (53) | open a site or button; open an account ("Отворите налог"); open an app; open a message | 21 nodes | Low. Natural Serbian, but "отворите налог" competes with "регистрација" |
| активан | account active, app activated, certificate active | wait-activation, account-ready, activate-consentid, cloud-issue, cloud-check-login | Low |

### 4b. One concept, several names
| Concept | Variants (counts) | Nodes | Verdict |
|---|---|---|---|
| Browser tab | картица 11; страница about 12; "отворене странице, као мале слике" | switch-tabs, register-open, six register nodes, create-email, cloud-* | Inconsistent. Taught as "картица", then instructed as "страница" |
| Tab-switch button | "дугме за картице" (switch-tabs); "дугме са квадратићима" 11 times in 8 nodes; "квадратић са бројем"; "два квадратића један преко другог" | switch-tabs plus 8 nodes | Mostly consistent, but the teaching screen uses a different name |
| This guide | "ова страна" 28; "водич" 13; "овде" 10 | 16+ nodes | Inconsistent |
| Come back to the guide | "вратите се овде" 7; "вратите се на ову страну" 5; "вратите се у овај водич" 3; "вратите се назад (дугме Назад)" 1 | 15 nodes | Inconsistent, 4 phrasings for one action |
| Registration website | "сајт eid.gov.rs" 31; "формулар" 29; "Портал еИД" 2 (help-account only, never tied to eid.gov.rs); "eID.gov.rs" 1 (different casing); "registracija.eid.gov.rs" 1 (alt); "контакт форма" 1 (vs "формулар") | register-*, cloud-*, help-account | Inconsistent |
| eUprava vs eID | "улазите на еУправу" with the eid.gov.rs account 4; "портал еУправа: euprava.gov.rs"; "апликација еУправа"; "шалтер са ознаком еУправа"; "услуге еУправе" | welcome, register-open, register-login-data, account-ready, activate-consentid, done, how-to-get-id-card | Blurred. register-open: "Формулар … на сајту eid.gov.rs. То је налог којим улазите на еУправу." Two site names for one account, never explained |
| Email | "имејл" 30; "адреса електронске поште" 1 (quoted site text); Gmail 10; "мејл" and "е-пошта" 0 | 17 nodes | Consistent, a good baseline |
| Email inbox | "имејл пошта" 3; "пошта" 4; Gmail | confirm-email, email-missing, register-error | Mild. "пошта" alone collides with the post office |
| Spam folder | "фасцикла Непожељно (Spam)"; "категорија Промоције" | email-missing | One-off, but "фасцикла" and "категорија" are extra terms |
| Account | "налог" 25; "рачун" and "профил" 0 | 11 nodes | Consistent |
| ID card | "лична карта" 46; "картица" 4; "ЛК" 0; "документ" in form fields | 16 nodes | Mostly consistent; "картица" is the slip |
| Register | "регистрација / региструјте се" 27; "отворите налог" 5; "правите податке" | 15 + 4 nodes | Two names, used side by side in welcome |
| Activate ConsentID | "Активирајте апликацију" (title, welcome) 2; "активација апликације" 2; "Укључите апликацију" (heading) 1; "да бисте укључили апликацију" 1; "апликација је укључена" 2; label "Апликација је активирана"; "први пут укључили апликацију" 2 | welcome, find-counter, counter-card, activate-consentid, cloud-certificate, cloud-approve | INCONSISTENT within one screen: title "Активирајте", heading "Укључите", answer "активирана" |
| Turn on cloud signature | "Укључите потпис у клауду" (title); "укључите сертификат"; "Квалификовани електронски сертификат у клауду"; "Издај"; "сертификат је активан" | welcome, cloud-certificate, cloud-issue, cloud-check-login | 3 to 4 names for one thing |
| Sign in | "пријавите се / пријава" 33 (for eid.gov.rs); "улазите на еУправу" 4; "уђете на Портал ЛПА" 1; "одјављени" 1 | welcome, register-*, account-ready, cloud-* | Two verbs for one act |
| User ID from the counter | "ИД корисника" 1; "кориснички ИД" 1; "број корисника" 1 (alt); "два броја" 2; "регистрациони код" 1 | activate-consentid, find-counter, cloud-approve | INCONSISTENT within one screen (activate-consentid) |
| Secret code | "лозинка" 15 (account); "ПИН" 10 (ConsentID); "шифра" 1 (phone unlock, as a contrast) | 7 / 3 / 1 nodes | Deliberate. Keep, but define |
| Tap | "притисните" 84; "додирните" 1 (register-upload); "кликните" 0; "изаберите" 22 (choose); "означите" 3 (tick a box) | 20 nodes | Very consistent, one slip |
| Type in | "упишите" 16; "унесите" 0; "напишите" 1 (free-text message); "препишите" 2 (copy a number); "попуните" 5 (fill a form) | 10 nodes | Consistent; the other verbs carry different meanings |
| Button or icon | "дугме" 31; "сличица" 6 (app tile, eye icon, login icons); "квадратић" 11; "ставка" 1; "линк" 1 (install-consentid); "тастер" and "иконица" 0 | 17 nodes | Acceptable |
| Screen | "екран" 14 (the phone display) | 10 nodes | Consistent |
| Photo | "фотографија / фотографишите" 24; "слика / сликате / сликај" 25 | 13 nodes | Two words, and "слика" also means screenshot |
| Office | "шалтер" 45 (32 nodes incl. directory); "службеник" 4; "полицијска станица" 3; "полиција" 1; "МУП" 4 | many | "шалтер" is consistent. The police have three names |
| Phone | "телефон" 41; "паметни телефон" 4; "мобилн-" 4 | 15 nodes | Consistent |
| Browser | "прегледач" 1, never introduced; Chrome and Safari called "програм" only in alt text | help-technical, switch-tabs alt | One-off |
| Helper | "неко од породице или комшија" 4; "неког од укућана" 1; "члан породице" 2 | help-*, switch-tabs | Mostly consistent; "укућана" is the slip |
| Image disclaimer | "Слика испод је само пример како изгледа X. Није права, на њу не треба да притискате." 6; "Слике у наранџастом оквиру су само пример." 3; "Слике овде су само илустрације, нису прави екрани апликације." 1; alt-text prefixes "Пример:", "Илустрација:", "Специмен" | 10 nodes | Three phrasings; register-upload uses two of them |

### 4c. Exact repeats (consistency positives)
| Times | Sentence | Nodes |
|---|---|---|
| 6 | Да пређете на формулар: притисните дугме са квадратићима (понекад има број), на дну или на врху екрана. | register-upload, -personal-data, -document-data, -login-data, -submit, -error |
| 6 | Затим притисните страницу eid.gov.rs. | the same six |
| 6 | Није права, на њу не треба да притискате. | register-open, register-upload, confirm-email, install-consentid, cloud-login, cloud-check-login |
| 5 | Ово радите у формулару на сајту eid.gov.rs, не на овој страни. | register-upload, -personal-data, -document-data, -login-data, -submit |
| 4 | На овој страни само читате шта да урадите. | register-personal-data, -document-data, -login-data, -submit |
| 4 | Када завршите, вратите се на ову страну на исти начин и притисните Даље. | register-upload, -personal-data, -document-data, -login-data |
| 3 | Пре него што почнете, припремите: | what-you-need, activate-consentid, cloud-certificate |
| 3 | Слике у наранџастом оквиру су само пример. | register-upload, cloud-approve, cloud-issue |
| 2 each | "Запишите имејл адресу и лозинку на папир."; "Ако користите Gmail, притисните дугме Отворите Gmail на дну ове стране."; "Притисните дугме Отворите сајт eid.gov.rs, на дну ове стране."; "Неко од породице или комшија може да вам помогне." | various |

The opener "Ово радите у X, не на овој страни." is used with 5 different places: формулар (5), имејл пошта (1), продавница апликација (1), апликација ConsentID (2), сајт eid.gov.rs (1). It is a good candidate for a fixed template.
## 5. Verbs, person, passive

**Imperatives.** The count is by form (-ите/-јте). Imperative and present 2nd plural share this form for many verbs, so some hits are statements, not commands: користите, живите, видите, желите.

| Verb | Count |
|---|---|
| притисните | 71 |
| отворите | 29 |
| изаберите | 19 |
| вратите (се) | 17 |
| радите | 11 |
| проверите | 10 |
| упишите | 10 |
| погледајте | 9 |
| потврдите | 9 |
| урадите | 8 |
| пријавите (се) | 7 |
| завршите | 6 |
| укључите | 5 |
| фотографишите | 5 |
| почните, запишите, приложите, смислите | 4 each |

There are about 80 distinct verbs. A core set (притисните, упишите, изаберите, отворите, вратите се) carries most instructions. activate-consentid mixes imperfective forms (притискајте, померајте, држите, чувајте) with perfective ones.

**Person.**
- The reader is addressed as "ви" throughout, with lowercase "вам/вас/ваш". Capital "Ваш/Ваша" appears only at the start of a sentence. "Молимо Вас" is a quoted site string.
- There are no real "ти" slips. "Изабери фајл" is a quoted iPhone menu label. The "ти" in "Где су ти подаци" (register-document-data) means "those".
- The author says "we" once, in register-open: "Ово смо показали на почетку".
- counter-card uses first person singular on purpose, because the user shows it to the clerk.
- Six bodies quote first-person labels inside second-person sentences. Example from find-counter: "Ако већ знате где ћете ићи, притисните Знам где ћу ићи."

**Answer-label voice** (82 labels, letter-screen repeats counted once):

| Voice | Count | Examples |
|---|---|---|
| Statement | 24 | Порука није стигла; Време је истекло; Страница се не отвара; Нисам успео/ла |
| Letter picker | 24 | А: Ада, Александровац… |
| First person past ("…сам") | 12 | Урадио/ла сам; Нашао/ла сам шалтер; Заборавио/ла сам ПИН |
| Imperative | 11 | 8 are external buttons such as "Отворите Gmail", which is expected. 3 are answers: Почните регистрацију, Погледајте списак шалтера, Изаберите друго слово |
| Yes/no | 8 | Да; Не; Важи; Не важи |
| First person future | 3 | Знам где ћу ићи; Хоћу да га укључим сада; Урадићу касније |

The mixed pairs are the real issue:
- welcome offers "Почните регистрацију" next to "Већ имам налог".
- Every letter screen offers "Нашао/ла сам шалтер" next to "Изаберите друго слово".

**Passive and impersonal forms are rare.**
- "потребан је" appears once, in account-ready: "За изводе, уверења и еСандуче потребан је виши ниво поузданости."
- "мора(ју)" appears 4 times. Only "Поља са црвеном тачком морају да буду попуњена" (register-personal-data) is a true passive.
- Agentless "се" forms:
  - "Налог се активира најкасније за 48 сати" and "Регистрација и апликација ConsentID се не плаћају" (welcome)
  - "Ово се не ради преко интернета" (find-counter)
  - "Тај сајт се отвара у новој картици" and "Водич се не затвара" (switch-tabs)
- The wait-activation title "Сачекајте да вам активирају налог" does not say who activates the account.
- "ће бити" appears 2 times and "треба" 30 times, which is natural Serbian.
- "се врши", "неопходно је" and "потребно је да" do not occur.

**Negation.** 64 of 458 sentences contain a negation and 15 contain two or more. Most of these are normal Serbian negative concord, not true double negatives. These are the ones a reader has to work to decode:
- "Није права, на њу не треба да притискате." (6 nodes)
- activate-consentid: "… не дајте га никоме, ни службенику ни члану породице."
- activate-consentid: "… никако у телефону и никако уз телефон."
- activate-consentid: "Ако ни тада не иде, апликација нуди да кодове упишете ручно."
- cloud-certificate: "Не треба вам читач ни картица."
- welcome: "Уз захтев за извод не прилажете ниједан документ."
- Negative labels: Нисам успео/ла, Није успело, Нисам пријављен/а, Не важи, Нема је ни после пола сата.

**Conditionals.** ако 35, када 23, док 3, чим 1. "уколико" and "осим ако" do not occur. No sentence stacks two conditions. Some screens stack conditions across consecutive sentences:
- confirm-email: Gmail, then other mail, then the deadline, then "if more than 24 hours".
- cloud-check-login: two "Ако пише… / Ако видите…" branches inside one numbered step.

## 6. Gender forms, digits, Latin script, abbreviations

**Gender slash forms.** 14 forms appear 22 times in prose. "Нашао/ла сам шалтер" also appears on all 24 letter screens.

| Form | Count | Where |
|---|---|---|
| Пријављен/а | 6 | cloud-approve label; cloud-check-login 3 labels and 2 body mentions |
| успео/ла | 2 | create-email, activate-consentid labels |
| регистрован/а | 2 | register-error label and body |
| Нашао/ла | 2 (+23 directory) | email-missing label, every letter screen |
| Погрешио/ла | 2 | email-missing label and body |
| сигуран/на, Добио/ла, Урадио/ла, Притиснуо/ла, Инсталирао/ла, Заборавио/ла | 1 each | labels in have-id-card, how-to-get-id-card, create-email, confirm-email, install-consentid, cloud-approve |
| Понео/ла, регистровао/ла | 1 each | counter-card body |

Three slash patterns coexist: "-о/ла" (успео/ла), "-/а" (Пријављен/а) and "-/на" (сигуран/на).

**Digits vs number words.**
- Digits are used for 13 (ЈМБГ), 15 days, 16 years, 24 and 48 hours, 8 to 20 characters, 3 MB, 20 cm, 1.473, 1.000 and "ПИН од 6 цифара".
- Words are used for два/две (5), три (4), четири (2), пет (1), шест (2), десет минута, један минут and пола сата.
- Inconsistencies:
  - The PIN is "6 цифара" in activate-consentid and "шест цифара" in cloud-approve and cloud-certificate.
  - The counter count is "1.473" in counter-list and "преко 1.000" in find-counter.
  - email-missing says "десет минута" in the body and "пола сата" in a label, while hours are always digits.
  - In "1.473" the dot is a thousands separator, which a reader may take as a decimal point.

**Latin script by node**

| Node | Latin tokens |
|---|---|
| welcome | ConsentID, QR |
| switch-tabs | eid.gov.rs, iPhone, Chrome, Safari, Android |
| how-to-get-id-card | euprava.gov.rs |
| create-email | Gmail, Gmail-а |
| register-open | eid.gov.rs and "eID.gov.rs" (casing differs) |
| register-upload | eid.gov.rs, iPhone-у, Photo Library, Take photo, Choose File, Android |
| register-personal-data, register-document-data, register-submit, cloud-issue, cloud-check-login | eid.gov.rs |
| register-login-data | eid.gov.rs, Plavo#Nebo7 |
| register-error | eid.gov.rs, MB |
| confirm-email | Gmail, verifikacija |
| email-missing | Gmail, Spam |
| install-consentid | ConsentID, Android, Google Play, iPhone, App Store, Install, Get, eid.gov.rs |
| find-counter | QR, ConsentID, Banca Intesa, Addiko, Yettel Bank, 3Bank, AIK, ALTA |
| activate-consentid | QR, ConsentID, Allow, OK, cm |
| cloud-approve | ConsentID, Requests, Approve, Done, eid.gov.rs |
| help-technical | Wi-Fi-ја, Chrome, Safari, ConsentID, Android, Google Play, iPhone, App Store |
| others | ConsentID only, or QR only (help-account) |

- Frequencies: ConsentID 30, eid.gov.rs 30, QR 13, Gmail 9.
- English UI words are introduced consistently with "(на енглеском X)", 9 times in 4 nodes.
- Three inflected tokens mix scripts: Gmail-а, iPhone-у, Wi-Fi-ја.

**Directory screens.** All 24 carry Latin bank names and Roman numerals. They also have six Latin-letter homoglyphs inside Cyrillic words, which break search, screen-reader pronunciation and the Latin transliteration:
- counter-list-a line 6: "oслобођења" (Latin o)
- counter-list-b line 443: "Милoсава" (Latin o)
- counter-list-r line 26: "сезонa" (Latin a)
- counter-list-s lines 156 and 157: "Tрг" (Latin T)
- counter-list-t line 38: "ПетраIКарађорђевића" (no spaces around Roman I)

There are also 27 lines like "Понедељак,среда,петак 07:00–11:00 не ради не ради". They have missing spaces and unlabeled Saturday and Sunday.

**Abbreviations, in order of first use in the graph**

| Abbreviation | Uses / nodes | First use | Explained at first use? |
|---|---|---|---|
| QR | 15/5 | welcome, "QR кодом који добијете на шалтеру" | No. Explained in activate-consentid "Шта је QR код", after find-counter and counter-card have already used it |
| ПИН | 10/3 | activate-consentid, "Смислите ПИН од 6 цифара" | No. Familiar from bank cards; cloud-approve later says which PIN |
| ЈМБГ | 6/2 | register-personal-data, "ЈМБГ: 13 цифара" | No, though widely known; the text says where to find it |
| МУП | 4/2 | how-to-get-id-card button, "Отворите упутство МУП-а" | No. The body says "полицијска станица"; only help-id-card says "полицијска станица (МУП)" |
| ЛПА | 3/3 | welcome, "Портал ЛПА за порез" | No. Explained in account-ready and find-counter |
| еИД | 3/2 | welcome alt text, then help-account "Порталу еИД" | No, and never linked to eid.gov.rs |
| ИД | 2/1 | activate-consentid, "ИД корисника" | No |
| MB | 1 | register-error, "највише 3 MB" | No. Meaningless to the target reader |
| cm, OK | 1 each | activate-consentid | cm is common; OK is quoted UI |
| AIK, ALTA | 1 each | find-counter | Bank brand names |

The "Већ имам налог" answer in welcome jumps straight to have-smartphone. Readers on that path meet QR, ПИН and ConsentID with no introduction.

**Jargon and loanwords** (prose):

| Term | Count | Nodes |
|---|---|---|
| апликација | 46 | 12 |
| имејл | 30 | 17 |
| формулар | 29 | 9 |
| налог | 25 | 11 |
| QR код | 13 | 5 |
| сертификат | 13 | 4 |
| ПИН | 10 | 3 |
| захтев | 10 | 5 |
| клауд | 7 | 4 |
| инсталир- | 7 | 5 |
| мени | about 9 | 4 |
| еСандуче | 4 | 2 |
| скенир- | 3 | 1 |
| интернет | 3 | 3 |

- One or two uses each: уплатница, такса, фајл, линк, банер, прегледач, зумирање, мобилни подаци, форма, есДневник, еЗдравље, "виши ниво поузданости", "привремени боравак / стално настањење", "квалификовани електронски сертификат".
- Never used in our own text: мејл, е-пошта, браузер, верификација, кликните. "verifikacija" appears only as the email sender name.

## 7. Ten hardest passages for a 75-year-old non-technical reader
1. activate-consentid, the whole screen. It has 340 words, five headings, four lists and two illustrations. The reader must hold a PIN rule, a scan procedure and a fallback at once.
2. switch-tabs, the tab metaphor. The text says the tabs are "као два листа папира један испод другог". The illustration's alt text says "две отворене странице једна поред друге". The word "картица" it teaches is later used for the ID card.
3. Six register screens repeat "Да пређете на формулар: притисните дугме са квадратићима (понекад има број), на дну или на врху екрана. Затим притисните страницу eid.gov.rs." It has a parenthesis and an either/or location, and it says "страница" where switch-tabs taught "картица".
4. register-login-data and register-error, the password rules. "бар један од ових знакова: ! @ # $ % & *" and "велико и мало слово" assume keyboard knowledge. The example "Plavo#Nebo7" is Latin, with a symbol the reader may not find.
5. register-error, a six-item error list. Each item names a different form field and a different remedy. One item sends the reader both to an answer label and to "Заборављена лозинка" on another site.
6. account-ready: "За изводе, уверења и еСандуче потребан је виши ниво поузданости." It is an abstract legal phrase, it is passive, and "еСандуче" is unexplained.
7. cloud-certificate and cloud-issue, the cloud signature. "потпис у клауду", "сертификат", "Квалификовани електронски сертификат у клауду", "читач ни картица" and "Издај" name one thing five ways, in loanwords.
8. confirm-email, a five-sentence opening paragraph. It mixes where to do it, Gmail versus other mail, and an image disclaimer. It then adds a 24-hour deadline with a two-step "if late, press X then Y" branch. The sender "verifikacija" is Latin.
9. cloud-check-login, the menu check. "одјављени" is unexplained. Step 3 nests two conditional bullets, and each tells the reader to come back and press a long first-person label. It ends with a 17-word inference: "Ако … пише да је …, значи да сте га већ укључили".
10. register-open: "Формулар ће се отворити у новој картици, на сајту eid.gov.rs. То је налог којим улазите на еУправу." Two sentences call the site "формулар", "сајт eid.gov.rs" and "налог", then tie it to a fourth name, "еУправа".

Runners-up:
- what-you-need: "страни држављани са привременим боравком или сталним настањењем" is legal register.
- welcome lists "еЗдравље, Портал ЛПА, есДневник, еСандуче" without explanation.
- activate-consentid uses "ИД корисника" and "кориснички ИД" four lines apart.

## 8. Method notes and script path

Script: `baseline-audit.mjs` in this folder (originally run from the session scratchpad)

It is a Node script that reads the repo without changing it and loads `yaml` from the repo's node_modules. Commands:

```
node audit.mjs /Users/filip/IdeaProjects/egradjanin-korak-po-korak <out-dir>
KWIC=1 node audit.mjs /Users/filip/IdeaProjects/egradjanin-korak-po-korak <out-dir>
```

The second command also writes every matching sentence for each concept variant. A helper, extra.py, run with `python3 -I`, counted extra jargon terms and found the directory homoglyphs.

Outputs in the same folder: output.txt (all statistics), output-kwic.txt (statistics plus every matching sentence), concepts.json (concept variant counts and nodes).

How text was processed:
1. Strip front matter, then image lines (alt text kept separately), then HTML tags (link text kept), then the details/summary wrappers (summary kept as a heading).
2. Count `##` headings toward screen words but not toward sentence statistics. Remove bold markers and escapes.
3. Split blocks on blank lines. A block made only of list items, nested items included, is a list, and each item is split into list units.
4. Split sentences on . ! ? … followed by whitespace and a capital letter, digit, quote, bracket or **. Do not split after бр, нпр, тзв, итд, Рег, б.б, ул, тј, or after a one- or two-digit ordinal such as "29. новембар". Dots in domains and in "1.473" never split, because no space follows them.
5. Count a paragraph sentence ending in ":" (a list intro) as its own sentence. The intro and its items are not merged into one long sentence.
6. A word is a run of letters or digits that may contain hyphens, dots, apostrophes and "@#". "eid.gov.rs" is one word.

Limits:
- The imperative table counts forms, not moods.
- Concept counts come from stem patterns, and the section 4a sense splits are hand tallies.
- The raw "се + verb" count of 55 includes reflexive verbs such as "вратите се", so it is not a passive count. The passive examples were checked by hand.
- Directory screens are excluded from all prose statistics.
- Labels repeated on all 24 letter screens are counted once.
