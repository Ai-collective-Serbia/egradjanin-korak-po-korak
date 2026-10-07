# Official eID / eUprava term names (verified 2026-10-07)

Sources were read directly: eid.gov.rs HTML pages (fetched with curl, Cyrillic version `sr-Cyrl-RS`), the
eid.gov.rs PDF manuals ("Упутство за ..."), which contain screenshots of the current ConsentID app
and portal, and euprava.gov.rs help pages. Quotes are copied from the page text or read off the
screenshots inside the official PDFs.

## Summary table

| # | Term | Official wording as seen on screen | Where | URL | Confidence | Variants seen |
|---|------|-----------------------------------|-------|-----|-----------|---------------|
| 1 | Cloud signature (service) | **Потпис у клауду** (menu item and page title); the certificate itself is **Квалификовани електронски сертификат у клауду** | eid.gov.rs top menu, Помоћ menu, page titles; Услуге dropdown after login | https://eid.gov.rs/sr-Cyrl-RS/potpis-u-klaudu ; https://eid.gov.rs/sr-Cyrl-RS/kvalifikovani-elektronski-sertifikat-u-klaudu | high | Abbrev. "КЕС у клауду" in body text; success toast "Успешно је издат сертификат за потпис у клауду"; FAQ "Како до потписа у клауду?"; dropdown item "Квалификовано електронско потписивање у клауду". Never "Cloud потпис". |
| 1b | Button to get the cloud certificate | **Издај**, then **Прихвати** (contract), then **Провери статус**; status text "Квалификовани електронски сертификат у клауду је активан." | eID portal, Услуге → Квалификовани електронски сертификат у клауду | https://eid.gov.rs/documents/Uputstvo_Za_izdavanje_kvalifikovanog_elektronskog_sertifikata_u_klaudu.pdf | high | Section label "Управљај квалификованим електронским сертификатом у клауду:" with buttons Издај / Обнови / Опозови; also "Опозови све сертификате". |
| 2 | ConsentID activation | **активација / Активирајте** ("Активирајте ConsentID", "Активирајте апликацију у пар корака") | App onboarding screens; eid.gov.rs help page heading "Инсталирање и активација мобилне апликације ConsentID" | https://eid.gov.rs/sr-Cyrl-RS/instaliranje-mobilne-aplikacije ; https://eid.gov.rs/documents/Uputstvo_Za_instalaciju_mobilne_aplikacije_ConsentID.pdf | high | In-app the final button is **Додајте ИД** and success is "Ваш ИД је додат". FAQ also: "Апликација је инсталирана и активирана". Old app v2 said "ПОКРЕНИТЕ УПИС" / "Upis" (obsolete). No "укључите", "повезивање". |
| 3 | Paper from the counter | Printed heading **Параметри за мобилну апликацију ConsentID**; site calls them **параметри за активацију** (ConsentID мобилне апликације) | Sample printout in an official KITEU slide deck; help pages | https://www.efaktura.gov.rs/view_file.php?file_id=293&cache=sr (slide 9) ; https://eid.gov.rs/sr-Cyrl-RS/kako-do-parametara-za-aktivaciju-mobilne-aplikacije | medium (name of paper); high (field names) | Field labels: **ИД корисника** and **Регистрациони код** (capital Р on the paper and in the app; lower-case "регистрациони код" in running text). Also "QR код" as an alternative. Not "Потврда о регистрацији", not "активациони код". |
| 4 | Login approval in app | Message **"Потврдите да бисте се пријавили на prijava.eid.gov.rs (54328)."**; button **Потврди** (reject: **Одбаци**); list tab **Захтеви** → **На чекању** | Current ConsentID app (v3) screenshots in official manual | https://eid.gov.rs/documents/Uputstvo_Prijava_putem_mobilne_apliakcije_ConsentID.pdf | high | Portal waiting screen says **"Одобрите захтев за пријаву преко ConsentID апликације на свом мобилном уређају"**. Manual verbs: "Кликните на дугме Захтеви а затим Потврдите да бисте се пријавили. Кликните на дугме Потврди." Old v2 app: "Autorizovati"/"Odbiti" (obsolete). |
| 5 | QR scan button | **Скенирајте QR код** (Cyrillic words, Latin "QR") | App activation screen and floating button on main screen | https://eid.gov.rs/documents/Uputstvo_Za_instalaciju_mobilne_aplikacije_ConsentID.pdf | high | Second option **Унесите параметре ручно**; skip link "Прескочи". App language follows phone OS language; Serbian shown in Cyrillic in all current official screenshots; changeable via Подешавања → Језик. |
| 6 | еСандуче | **еСандуче**; full name **Јединствено електронско сандуче (еСандуче)**; second view **еСандуче - архива** | euprava.gov.rs help page | https://euprava.gov.rs/eSanduce_uputstvo | high (name); medium (definition, law text) | Law: "јединствени електронски сандучић" = "електронски поштански сандучић корисника за пријем свих електронских докумената у електронској управи". Menu label "еСандуче - преузимање докумената". |
| 7 | Sign-in / registration verbs | **Пријава** (menu/page), button **Пријавите се**; **Регистрација** (menu), button **Региструј се** | eid.gov.rs header (Мој налог → Пријава), login page; euprava.gov.rs header "Пријава", "Регистрација", "Моја еУправа" | https://eid.gov.rs/ ; https://euprava.gov.rs/ | high | Body: "Пријавите се на свој кориснички налог на Порталу еУправа". Infinitive "региструјете се". Never "Улаз", "Улогујте се", "Отворите налог". |
| 8 | Portal relationship / account | eid.gov.rs = **Портал за електронску идентификацију** (also "Портал еИД", "еИД"); account = **кориснички налог** / **еИД налог**; euprava.gov.rs = **Портал еУправа** | eid.gov.rs header and FAQ; euprava eSanduče page | https://eid.gov.rs/sr-Cyrl-RS/najcesca-pitanja-i-odgovori ; https://eid.gov.rs/sr-Cyrl-RS/ko-je-egradjanin | high | "еГрађанин је свако лице које има кориснички налог на Порталу ЕИД"; account types Грађанин / Привреда / Држава. |
| 9 | Levels | **основни ниво поузданости** (username+password) vs **висок ниво поузданости** (ConsentID, КЕС) | eid.gov.rs FAQ question 8; login tab text | https://eid.gov.rs/sr-Cyrl-RS/najcesca-pitanja-i-odgovori ; https://eid.gov.rs/sr-Cyrl-RS/prijava-mobilnom-aplikacijom | high | Page subtitle "- Висок ниво поузданости -"; login tab "представља пријаву високог нивоа поузданости". Old v2 manual said "средњи ниво поузданости" (obsolete). No "виши ниво". |

## Quotes per term

### 1. Cloud signature

- eid.gov.rs top menu (every page): `еГрађанин | Потпис у клауду | Помоћ | Контакт | еУправа`.
- Помоћ sidebar group "Квалификовани електронски сертификат у клауду" with items
  "Квалификовани електронски сертификат у клауду" and "Потпис у клауду".
- https://eid.gov.rs/sr-Cyrl-RS/potpis-u-klaudu: "Потпис у клауду је услуга која Вам омогућава да
  електронски потписујете документа квалификованим електронским сертификатом у клауду."
- https://eid.gov.rs/sr-Cyrl-RS/kvalifikovani-elektronski-sertifikat-u-klaudu: "Квалификовани
  електронски сертификат (КЕС) у клауду кориснику обезбеђује електронску идентификацију високог
  нивоа поузданости ... КЕС у клауду омогућава ..." and "Рок важења квалификованог електронског
  сертификата у клауду је 5 година." Also: "корисник мора да инсталира мобилну апликацију ConsentID
  и путем ње врши одобрење квалификованог електронског потписивања на даљину."
- FAQ 15: "Како до потписа у клауду? Да бисте могли да потписујете у клауду потребно је да имате
  мобилну апликацију ConsentID и квалификовани електронски сертификат у клауду."
- Issuing manual (PDF above), steps and on-screen labels: "Одаберете опцију услуге и из падајуће
  листе изаберите **Квалификовани електронски сертификат у клауду**." → "За издавање ... одаберете
  опцију **Издај**." → contract "Уговор о пружању услуге издавања квалификованог електронског
  сертификата за квалификовани електронски потпис на даљину", button **Прихвати** (other button
  **Одустани**) → toast "Успешно је издат сертификат за потпис у клауду" → button **Провери статус**
  → "Статус корисничког налога: Квалификовани електронски сертификат у клауду је активан."
- Short form used by the site in body text: "потпис у клауду" for the service, "КЕС у клауду" or
  "сертификат у клауду" for the certificate. The Услуге dropdown (in parameter manual screenshot)
  lists "Мобилна апликација ConsentID", "Квалификовани електронски сертификат у клауду",
  "Квалификовано електронско потписивање у клауду".

### 2. ConsentID activation

- Page heading: "Инсталирање и активација мобилне апликације ConsentID".
- Steps on that page: "2. Покрените апликацију и кликните на 'Следећи корак' кроз уводне екране.
  3. Поставите свој 6-цифрени ПИН код и потврдите га. 4. Активирајте апликацију скенирањем QR кода
  или ручним уносом ИД корисника и регистрационог кода."
- "Како да знам да је апликација активирана? Ако је све исправно, апликација ће приказати ваше име,
  презиме, ИД корисника и датум важења. То је потврда да је ConsentID успешно активиран."
- App onboarding screens (manual screenshots): "Већа поузданост уз ConsentID", "Активирајте
  апликацију у пар корака" ("Активирајте апликацију уносом параметара за активацију или скенирањем
  QR кода."), "Поставите свој ПИН", "Поставите свој шестоцифрени ПИН", "Потврдите постављени
  шестоцифрени ПИН поновним уносом.", then "**Активирајте ConsentID**" ("Скенирајте QR код или ручно
  унесите параметре за активацију.").
- Manual-entry screens: title "Додајте свој ИД", field "ИД корисника", button **Даље**; then field
  "Регистрациони код", button **Додајте ИД**; confirm screen button **Додајте ИД** / **Поништи**;
  result "Ваш ИД је додат" with name, ИД корисника and "Важи до: ...".
- Manual closing line: "Апликација је инсталирана и активирана."

### 3. Paper from the counter

- No eid.gov.rs page gives the printed paper a formal document title. Pages call its contents
  "параметри за активацију ConsentID мобилне апликације" / "параметре (ИД корисника и регистрациони
  код)" / "QR код".
  - https://eid.gov.rs/sr-Cyrl-RS/kako-do-parametara-za-aktivaciju-mobilne-aplikacije: "Поседујете
    или QR код или параметре (ИД корисника и регистрациони код) за активацију." and "На шалтеру: Ако
    немате квалификовани електронски сертификат, параметре преузимате лично одласком на шалтер неког
    од регистрационих тела."
  - FAQ 12: "Како до параметара или QR кода за активацију мобилне апликације ConsentID? ...
    издавање параметара и регистрацију можете да обавите и на неком од шалтера поште, општине,
    локалне пореске администрације или Моби банке."
- Sample printout shown by the government office (Канцеларија за ИТ и еУправу) in its eID slide deck
  hosted on efaktura.gov.rs, slide "Параметри за мобилну апликацију ConsentID", left image captioned
  "Параметри које сте преузели на неком од шалтера регистрационих тела". The printed sheet reads:
  - "Портал за електронску идентификацију"
  - "Канцеларија за информационе технологије и електронску управу"
  - "Параметри за мобилну апликацију ConsentID"
  - "ЈМБГ:", "Име:", "Презиме:", "**ИД корисника:**", "**Регистрациони код:**"
  - "Параметре које сте добили уписујете у апликацију ConsentID која је доступна за кориснике уређаја
    са Android и iOS оперативним системима. Више информација доступно је на адреси eid.gov.rs/pomoc."
  - Caveat: the sample is from an older deck and shows no QR code. Current sheets may also carry a
    QR code (all current pages say "параметри или QR код"); not verified with a current printout.
- On-portal self-generation screen (same names): "Управљај параметрима за ConsentID:", button
  **Издај**, fields "ИД корисника: (User ID)" and "Регистрациони код: (Reg. code)", and under the QR:
  "Покрените мобилну апликацију ConsentID и скенирајте QR код за аутоматску активацију".
- Assumptions confirmed: "ИД корисника" and "регистрациони код" are the official names.

### 4. Login approval in the app

- https://eid.gov.rs/documents/Uputstvo_Prijava_putem_mobilne_apliakcije_ConsentID.pdf (current app):
  - Portal waiting screen: "Одобрите захтев за пријаву преко ConsentID апликације на свом мобилном
    уређају", with an "Ид захтева: ..." number below.
  - Text: "Покрените мобилну апликацију ConsentID и унесите шестоцифрени пин ... Стићи ће нотификација
    да постоји захтев за ауторизацију пријаве. Кликните на дугме Захтеви а затим Потврдите да бисте се
    пријавили."
  - App list: header "Захтеви", tabs "На чекању" / "Историја", item "Потврдите да бисте се пријавили
    на prijava.eid.gov.rs (54328).", red badge "Преостало 48s".
  - Detail screen: "Потврдите да бисте се пријавили на prijava.eid.gov.rs (54328).", "Издавалац:
    eid.gov.rs", "Захтев стигао са:", button **✓ Потврди**, link **Одбаци**, top-left **Затвори**.
  - Text: "Кликните на дугме Потврди. Након успешне обраде захтева, Портал извршава пријаву ..."
- Verbs: the portal says "одобрите захтев"; the app and manuals say "потврдите" / "Потврди".
- Obsolete: the v2 manual (test.eid.gov.rs/documents/ConsentID-uputstvo-eGov-v1.11.pdf) shows Latin
  "Autorizovati" / "Odbiti" and English "Sign" / "Reject". Do not use.

### 5. QR scan step and app language

- Activation screen buttons: **Скенирајте QR код** (primary, blue) and **Унесите параметре ручно**.
- Main screen (after activation) has a floating button **Скенирајте QR код** and bottom tabs
  **Захтеви**, **ИД**, **Подешавања**.
- Manual: "Бирате један од два понуђена начина активације Скенирајте QR код или Унесите параметре
  ручно. Уколико сте изабрали опцију скенирајте QR код отвориће се екран за скенирање."
- Language: "Језик на ком се приказује ConsentID апликација зависи од језика на ком ради оперативни
  систем мобилног уређаја. Ако уређај приказује текст на српском језику и ConsentID апликација ће
  приказивати текст на српском језику ... У сваком тренутку можете променити језик кликом на опцију
  Подешавања а затим и Језик." All current screenshots are Serbian Cyrillic. Whether a Latin-script
  Serbian UI exists (for phones set to Srpski latinica) is not stated: not found.

### 6. еСандуче

- https://euprava.gov.rs/eSanduce_uputstvo: "Јединствено електронско сандуче (еСандуче) на Порталу
  еУправа добило је нови изглед и унапређене функционалности, при чему се електронска документа могу
  преузимати кроз еСандуче и еСандуче - архива." Menu entry: "еСандуче - преузимање докумената".
- One-line legal definition (Закон о електронској управи, via search summary of ite.gov.rs and
  parlament.gov.rs PDFs, not opened directly): "јединствени електронски сандучић – електронски
  поштански сандучић корисника за пријем свих електронских докумената у електронској управи".
- Suggested plain one-liner consistent with the site: "еСандуче је Ваше електронско сандуче на
  Порталу еУправа, где стижу документа од државних органа."

### 7. Sign-in and registration verbs

- eid.gov.rs header: "Мој налог" → "Пријава", "Регистрација корисничким именом и лозинком",
  "Регистрација квалификованим електронским сертификатом", "Регистрација страних држављана".
- eid.gov.rs login page: title "Пријава", tabs "Корисничко име и лозинка" / "Квалификовани
  електронски сертификат" / "Мобилна апликација", field "Корисничко име: (Адреса електронске поште
  коришћена приликом регистрације)", green button **Пријавите се**, footer "Немате налог на
  eid.gov.rs? Региструјте се овде."
- Registration form submit button: **Региструј се** (efaktura deck screenshots of the eID form).
- euprava.gov.rs header: "Моја еУправа", "Пријава", "Регистрација". eSanduče page: "Пријавите се на
  свој кориснички налог на Порталу еУправа тако што на адреси https://euprava.gov.rs/ одаберете
  „Моја еУправа“, а затим „Пријава“."
- euprava help menu: "Пријава мобилним телефоном (апликација ConsentID)", "Пријава корисничким
  именом и лозинком", "Пријава квалификованим електронским сертификатом".
- Not found anywhere: "Улаз", "Улогујте се", "Отворите налог".

### 8. Portal relationship

- eid.gov.rs logo text: "eID.gov.rs — Портал за електронску идентификацију"; login screenshot
  heading "Добро дошли на еИД".
- FAQ 1: "Портал за електронску идентификацију представља централно место за регистрацију налога
  еГрађана и њихову пријаву на повезане системе електронске управе (Портал еУправа, Портал локалне
  пореске администрације, еЗдравље, Моја прва плата, есДневник, итд.)"
- https://eid.gov.rs/sr-Cyrl-RS/ko-je-egradjanin: "еГрађанин је свако лице које има кориснички налог
  на Порталу ЕИД." and "еГрађанин на основу јединственог налога може да приступа свим повезаним
  системима Портал еУправа, ЛПА, еЗдравље, ..."
- Account names: "кориснички налог" (both portals), "еИД налог" ("Поседујете регистрован еИД налог").
  euprava.gov.rs calls its site "Портал еУправа" and the signed-in area "Моја еУправа".

### 9. Levels

- FAQ 8: "Постоје три начина пријаве: 1. пријава мобилном апликацијом ConsentID (висок ниво
  поузданости); 2. пријава са квалификованим електронским сертификатом (висок ниво поузданости);
  3. пријава корисничким именом и лозинком (основни ниво позданости)." (typo "позданости" is on
  the site.)
- https://eid.gov.rs/sr-Cyrl-RS/prijava-mobilnom-aplikacijom: "- Висок ниво поузданости - Пријава
  мобилном апликацијом ConsentID представља висок ниво поверења у идентитет корисника и означава се
  као пријава високог нивоа поузданости."

## Pages tried that gave nothing extra

- https://cloud.eid.gov.rs/ (signing app; login required, no relevant labels in public HTML).
- https://www.zdravlje.gov.rs/view_file.php?file_id=2280&cache=sr (TLS certificate error).
- A current photo or scan of the counter printout with a QR code: not found.
