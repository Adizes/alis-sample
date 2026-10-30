/* Engagement Survey — Lietuvių
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ES_I18N.lt = {
  code: "lt",
  langName: "Lietuvių",
  locale: "lt-LT",
  ui: {
    start: "Pradėti",
    back: "Atgal",
    next: "Toliau",
    pressEnter: "paspauskite Enter ↵",
    keyboardHint: "Klavišai 1–{n} · 0 = Nežinau",
    of: "iš",
    section: "Sritis",
    resume: "Sveiki sugrįžę! Jūsų ankstesni atsakymai išsaugoti.",
    resumeYes: "Tęsti nuo ten, kur baigiau",
    resumeNo: "Pradėti iš naujo",
    loading: "Įkeliama…",
    sending: "Siunčiami jūsų atsakymai…",
    errorGeneric: "Įvyko klaida. Patikrinkite interneto ryšį ir bandykite dar kartą.",
    retry: "Bandyti dar kartą",
    importance: "Kiek jums svarbus šis klausimas?",
    imp: [
      "Mažiau svarbus",
      "Vidutiniškai svarbus",
      "Svarbiausias"
    ],
    mostCount: "Svarbiausi: {n} iš {max}",
    mostFull: "Jau pažymėta 15 svarbiausių klausimų. Norėdami pažymėti šį, pirmiau pakeiskite vieną iš jų.",
    comment: "Pridėti komentarą (neprivaloma)",
    commentPh: "Jūsų komentaras… Jis bus pateiktas anonimiškai, pažodžiui."
  },
  intro: {
    eyebrow: "Įsitraukimo apklausa",
    title: "{company} nori išgirsti jūsų nuomonę",
    body: "{company} kartu su Adizes institutu atlieka darbuotojų įsitraukimo apklausą. Atsakysite į {n} klausimų apie savo kasdienį darbą ir organizaciją.",
    bullets: [
      "Apklausa anoniminė: atsakymai apibendrinami, o {company} niekada nemato atskirų žmonių atsakymų.",
      "Prie kiekvieno klausimo nurodykite, kiek jis jums svarbus. Pažymėkite iki 15 klausimų kaip „Svarbiausius“ (bent vieną).",
      "Prie bet kurio klausimo galite pridėti komentarą. Komentarai pateikiami pažodžiui be jūsų vardo, todėl nenurodykite detalių, pagal kurias būtų galima jus atpažinti.",
      "Tai užtruks apie 10–15 minučių. Galite sustoti ir vėliau tęsti naudodami tą pačią nuorodą."
    ],
    note: "Atsakykite, kaip yra iš tikrųjų šiandien. Jei neturite pagrindo atsakyti, pasirinkite „Nežinau“.",
    deadline: "Terminas: {date}",
    meta: "Klausimų: {n} · apie 10–15 minučių · anonimiškai"
  },
  review: {
    eyebrow: "Paskutinis žingsnis",
    title: "Peržiūrėkite savo atsakymus",
    body: "Atsakėte į visus klausimus ({n}).",
    cannot: "Atsakymas „Nežinau“: {n}.",
    most: "Svarbiausi: {n} iš {max}.",
    needMost: "Prieš siųsdami pažymėkite bent {min} klausimą kaip „Svarbiausią“ (atidarykite bet kurį klausimą, kad tai pakeistumėte).",
    missingN: "Neatsakyta klausimų: {n}.",
    missingHelp: "Spustelėkite bet kurį klausimą, kad atsakytumėte arba pakeistumėte atsakymą.",
    missing: "Neatsakyta",
    commented: "Komentaras",
    warn: "Spustelėkite bet kurį klausimą, kad pakeistumėte atsakymą, jo svarbą ar komentarą. Išsiųstų atsakymų pakeisti nebegalėsite.",
    submit: "Siųsti atsakymus",
    hint: "Atsakymus galite išsiųsti ir sąrašo apačioje.",
    back: "Grįžti į peržiūrą"
  },
  thanks: {
    title: "Ačiū",
    body: "Jūsų atsakymai anonimiškai užregistruoti. Dėkojame, kad skyrėte laiko apklausai. Galite uždaryti šį langą."
  },
  states: {
    noToken: {
      title: "Reikalinga jūsų asmeninė nuoroda",
      body: "Norėdami atsakyti, atidarykite nuorodą, kurią gavote kvietimo el. laiške."
    },
    invalid_link: {
      title: "Ši nuoroda negalioja",
      body: "Įsitikinkite, kad atidarėte visą nuorodą iš kvietimo el. laiško. Jei problema kartojasi, rašykite info@adizes.com."
    },
    completed: {
      title: "Jūs jau atsakėte",
      body: "Jūsų atsakymai užregistruoti. Ačiū, kad dalyvavote."
    },
    closed: {
      title: "Ši apklausa baigta",
      body: "Atsakymai nebepriimami. Jei manote, kad tai klaida, kreipkitės į jus pakvietusį asmenį."
    },
    not_open: {
      title: "Ši apklausa dar neprasidėjo",
      body: "Pabandykite vėliau naudodami tą pačią nuorodą."
    }
  },
  dontKnow: "Nežinau",
  scales: {
    F: [
      {
        value: 2,
        label: "Niekada",
        sub: "Visiškai nesutinku"
      },
      {
        value: 3,
        label: "Kartais",
        sub: "Iš esmės nesutinku"
      },
      {
        value: 4,
        label: "Dažnai",
        sub: "Iš esmės sutinku"
      },
      {
        value: 5,
        label: "Visada",
        sub: "Visiškai sutinku"
      }
    ],
    A: [
      {
        value: 2,
        label: "Visiškai nesutinku",
        sub: "Niekada"
      },
      {
        value: 3,
        label: "Iš esmės nesutinku",
        sub: "Kartais"
      },
      {
        value: 4,
        label: "Iš esmės sutinku",
        sub: "Dažnai"
      },
      {
        value: 5,
        label: "Visiškai sutinku",
        sub: "Visada"
      }
    ],
    FR: [
      {
        value: 5,
        label: "Niekada",
        sub: "Visiškai nesutinku"
      },
      {
        value: 4,
        label: "Kartais",
        sub: "Iš esmės nesutinku"
      },
      {
        value: 3,
        label: "Dažnai",
        sub: "Iš esmės sutinku"
      },
      {
        value: 2,
        label: "Visada",
        sub: "Visiškai sutinku"
      }
    ],
    AR: [
      {
        value: 5,
        label: "Visiškai nesutinku",
        sub: "Niekada"
      },
      {
        value: 4,
        label: "Iš esmės nesutinku",
        sub: "Kartais"
      },
      {
        value: 3,
        label: "Iš esmės sutinku",
        sub: "Dažnai"
      },
      {
        value: 2,
        label: "Visiškai sutinku",
        sub: "Visada"
      }
    ],
    S: [
      {
        value: 2,
        label: "Visiškai netenkina"
      },
      {
        value: 3,
        label: "Iš esmės netenkina"
      },
      {
        value: 4,
        label: "Iš esmės tenkina"
      },
      {
        value: 5,
        label: "Visiškai tenkina"
      }
    ],
    C: [
      {
        value: 1,
        label: "Gerokai pablogėjo"
      },
      {
        value: 2,
        label: "Šiek tiek pablogėjo"
      },
      {
        value: 3,
        label: "Esminių pokyčių nėra"
      },
      {
        value: 4,
        label: "Šiek tiek pagerėjo"
      },
      {
        value: 5,
        label: "Gerokai pagerėjo"
      }
    ]
  },
  cells: {
    values: "Vertybės",
    climate: "Klimatas",
    styles: "Vadovavimo stiliai",
    responsibility: "Atsakomybės struktūra",
    authority: "Įgaliojimų struktūra",
    reward: "Atlygio struktūra",
    supervisor: "Vadovas",
    planning: "Planavimas",
    information: "Informacijos srautai",
    client: "Bendravimas su klientais",
    transformation: "Transformacija",
    human: "Žmogiškieji veiksniai",
    behaviour: "Elgsena",
    changes: "Pokyčiai",
    inefficiency: "Neefektyvumas"
  },
  levels: {
    fully: {
      name: "Visiškai įsitraukę",
      desc: [
        "aistringai atsidavę savo darbui ir organizacijai",
        "padarys viską, ko reikia, kad pasiektų rezultatą",
        "nuolat pasiekia aukštos kokybės rezultatus",
        "randa nestandartinių ir inovatyvių sprendimų sudėtingiausioms problemoms",
        "laikomi lyderiais ir pavyzdžiu kitiems"
      ]
    },
    engaged: {
      name: "Įsitraukę",
      desc: [
        "susitelkę į rezultatus, projektus ir savo atsakomybes",
        "dirba gerai ir stabiliai",
        "visada atlieka savo darbo dalį",
        "gerai bendradarbiauja su kitais ir padeda, kai paprašoma"
      ]
    },
    somewhat: {
      name: "Iš dalies įsitraukę",
      desc: [
        "rinkasi, kam skirti savo energiją",
        "daug laiko skiria veiklai, kuri nepadeda klientams ir (arba) organizacijai",
        "padaro darbą, kai būtina arba kai yra prižiūrimi",
        "neigiamai veikia kitus"
      ]
    },
    disengaged: {
      name: "Neįsitraukę",
      desc: [
        "dirba tik tada, kai būtina",
        "mieliau užsiimtų kuo nors kitu",
        "rezultatai neatitinka standartų",
        "mąsto kategorijomis „mes ir jie“",
        "neigiamai atsiliepia apie organizaciją ir taip pat elgiasi su klientais bei kolegomis"
      ]
    }
  },
  pdf: {
    file: "Isitraukimo-apklausa",
    title: "Įsitraukimo apklausa",
    subtitle: "Ataskaita",
    company: "Įmonė",
    launch: "Apklausa",
    date: "Ataskaitos data",
    responses: "Atsakymai",
    of: "iš",
    invited: "pakviestų",
    anon: "Apklausa anoniminė. Rezultatai pateikiami tik apibendrinti, o grupės, kuriose mažiau nei 5 atsakymai, niekada nerodomos atskirai.",
    contents: "Turinys",
    toc: [
      "Pasiskirstymas pagal įsitraukimo lygį",
      "Įsitraukimas pagal sritis",
      "Organizacijos veiksniai",
      "Kas darbuotojams svarbiausia",
      "Visi klausimai",
      "Komentarai"
    ],
    levelsTitle: "Pasiskirstymas pagal įsitraukimo lygį",
    levelsHelp: "Kiekvienas dalyvis priskiriamas lygiui pagal visus jo atsakymus ir pagal klausimus, kuriuos jis pažymėjo kaip svarbiausius.",
    positive: "Visiškai įsitraukę + Įsitraukę",
    people: "žm.",
    byAreaTitle: "Įsitraukimas pagal sritis",
    byAreaHelp: "Rodomos tik sritys, kuriose yra 5 ar daugiau atsakymų. Mažesnės sritys sujungiamos į „Kitas sritis“, jei kartu jose yra bent 5 atsakymai.",
    company_col: "Įmonė",
    other: "Kitos sritys",
    hidden: "Atsakymai iš sričių, kuriose mažiau nei 5 žmonės, įskaičiuoti tik į bendrą įmonės rezultatą ({n}).",
    noAreas: "Nė vienoje srityje dar nėra 5 ar daugiau atsakymų, todėl rezultatai pagal sritis nerodomi.",
    respondents: "Respondentai",
    factorsTitle: "Organizacijos veiksniai",
    factorsHelp: "Kiekvieno veiksnio įvertinimas pagal atsakymus („Nežinau“ neįskaičiuojamas), taikant tą patį metodą kaip Adizes diagnostikos matricoje. 75 % ir daugiau — sveika būklė; mažiau nei 50 % — anomalija.",
    groups: {
      culture: "Organizacijos kultūra",
      structure: "Struktūra",
      process: "Procesai",
      functions: "Organizacijos funkcijos",
      effects: "Pasekmės"
    },
    colors: {
      green: "Viskas gerai",
      yellow: "Dėmesio zona",
      red: "Anomalijų zona"
    },
    topTitle: "Kas darbuotojams svarbiausia",
    topHelp: "Klausimai, kurie dažniausiai pažymėti kaip „Svarbiausi“, ir kaip į juos atsakyta.",
    mostPct: "svarbiausia",
    distTitle: "Visi klausimai",
    distHelp: "Atsakymų pasiskirstymas (%) ir raudonai dešinėje — respondentų, pažymėjusių klausimą kaip svarbiausią, dalis.",
    legend: {
      "1": "Nežinau",
      "2": "Niekada / Visiškai nesutinku",
      "3": "Kartais / Iš esmės nesutinku",
      "4": "Dažnai / Iš esmės sutinku",
      "5": "Visada / Visiškai sutinku"
    },
    q50: "Žalia spalva visada žymi palankiausią atsakymą: neigiamiems teiginiams 5 ir 45 tai „Niekada“ / „Visiškai nesutinku“. 50 klausimas turi savo skalę (gerokai pagerėjo → gerokai pablogėjo).",
    commentsTitle: "Komentarai",
    commentsHelp: "Parašyti dalyvių, anonimiški ir pateikti pažodžiui.",
    noComments: "Komentarų nepalikta.",
    footer: "Adizes institutas · Įsitraukimo apklausa",
    page: "Puslapis",
    cont: "tęsinys"
  },
  questions: [
    "Mūsų vadovai laikosi organizacijoje deklaruojamų vertybių",
    "Mūsų organizacija visiškai vykdo savo įsipareigojimus darbuotojams",
    "Organizacija vertina ir palaiko naujas idėjas",
    "Man gera organizacijoje vyraujančioje atmosferoje",
    "Pas mus galioja principas „kiekvienas už save“",
    "Už gerai atliktą darbą sulaukiu padėkos ir įvertinimo",
    "Mes gerbiame vieni kitus",
    "Mūsų organizacijos vadovų elgesys padeda kurti sveiką darbo aplinką, siekti tikslų ir plėtoti organizaciją",
    "Aiškiai suprantu savo darbo užduotis ir savo vaidmenį skyriaus veikloje",
    "Suprantu, kuo turiu vadovautis atlikdamas savo darbą: politikomis, reglamentais, taisyklėmis, profesiniais standartais ir pan.",
    "Žinau, į ką galiu kreiptis su klausimais",
    "Suprantu, kokius sprendimus turiu teisę priimti",
    "Sprendimai klausimais, kurie liečia mane, priimami laiku ir nuspėjamai",
    "Turiu pakankamai įgaliojimų, kad galėčiau atsakyti už savo darbo rezultatus",
    "Manau, kad pajamos, kurias gaunu organizacijoje, yra konkurencingos",
    "Suprantu, nuo ko priklauso kintamoji mano pajamų dalis",
    "Manau, kad galiu gana stipriai paveikti tiek pastoviąją, tiek kintamąją savo pajamų dalį",
    "Mano socialinių naudų paketas konkurencingas rinkoje",
    "Su savo vadovu galiu aptarti asmeninius klausimus",
    "Mano vadovas elgiasi su manimi kaip su asmenybe",
    "Mano vadovas skatina mano profesinį tobulėjimą",
    "Mano vadovas reguliariai kalbasi su manimi apie mano pažangą",
    "Mano vadovas teikia kokybišką ir motyvuojantį grįžtamąjį ryšį — visada žinau, ką jis mano apie mane ir mano darbą",
    "Vadovo man skiriamos užduotys yra aiškios ir įgyvendinamos",
    "Nesivaržau užduoti savo vadovui patikslinančių klausimų",
    "Manau, kad mano vadovo priimami sprendimai yra teisingi ir naudingi organizacijai",
    "Mano vadovas atidžiai mane išklauso ir atsižvelgia į mano nuomonę",
    "Žinau ir suprantu ilgalaikius organizacijos tikslus",
    "Mane įkvepia mūsų organizacijos tikslai. Mes dirbame svarbų ir naudingą darbą",
    "Suprantu, kaip mano darbo rezultatai veikia bendrą organizacijos rezultatą",
    "Turiu galimybę būti išklausytas",
    "Turiu pakankamai informacijos apie tai, kas vyksta organizacijoje, kad galėčiau atlikti savo darbą",
    "Žinau, kas yra mūsų tiksliniai klientai (vidiniai ar išoriniai). Žinau, kokius poreikius ir kokiais produktais ar paslaugomis galime patenkinti",
    "Gerai pažįstame savo rinką (vidinius ar išorinius klientus), stebime tendencijas ir poreikius ir nuolat galvojame, kaip geriau aptarnauti savo klientus (vidinius ar išorinius)",
    "Mano darbo aplinka patogi",
    "Turiu visas technines priemones, reikalingas gerai atlikti savo darbą",
    "Darbo procesai, kuriuose dalyvauju, yra susisteminti ir gerai organizuoti",
    "Esame pasiryžę tobulinti savo darbo procesus ir taikomas technologijas",
    "Mane tenkina kitų padalinių darbo kokybė",
    "Per pastaruosius 12 mėnesių darbas leido man patobulinti ir išplėsti savo žinias, įgūdžius ir gebėjimus",
    "Žinau, kokiomis sąlygomis (ką daryti, ko mokytis, ką pasiekti) galiu „augti“ organizacijoje",
    "Ar jus tenkina jūsų darbas šioje organizacijoje?",
    "Jaučiu, kad organizacijoje esu vertinamas",
    "Darbas, kurį iš tikrųjų dirbu, man įdomus ir teikia malonumą",
    "Planuoju išeiti iš organizacijos per artimiausius metus",
    "Rekomenduoju mūsų organizaciją savo draugams ir pažįstamiems kaip gerą darbdavį",
    "Didžiuojuosi, kad dirbu šioje organizacijoje",
    "Mūsų organizacija neatsilieka nuo laiko (produktai, technologijos, procesai)",
    "Manau, kad darbuotojų potencialas, jų įgūdžiai, žinios ir gebėjimai organizacijoje panaudojami efektyviai",
    "Atsižvelgiant į visus ankstesnius jūsų atsakymus, kaip, jūsų nuomone, per pastaruosius metus pasikeitė padėtis organizacijoje apskritai?"
  ]
};
