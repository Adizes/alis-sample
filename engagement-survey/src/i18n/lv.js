/* Engagement Survey — Latviešu
 * GENERATED from the translations workbook (tools/translations.py). Edit the workbook, not this file.
 * Answer values and the order of questions come from English and never change.
 */
ES_I18N.lv = {
  code: "lv",
  langName: "Latviešu",
  locale: "lv-LV",
  ui: {
    start: "Sākt",
    back: "Atpakaļ",
    next: "Tālāk",
    pressEnter: "nospiediet Enter ↵",
    keyboardHint: "Taustiņi 1–{n} · 0 = Nezinu",
    of: "no",
    section: "Joma",
    resume: "Laipni lūdzam atpakaļ! Jūsu līdzšinējās atbildes ir saglabātas.",
    resumeYes: "Turpināt no vietas, kur apstājos",
    resumeNo: "Sākt no jauna",
    loading: "Ielādē…",
    sending: "Sūta jūsu atbildes…",
    errorGeneric: "Kaut kas nogāja greizi. Lūdzu, pārbaudiet interneta savienojumu un mēģiniet vēlreiz.",
    retry: "Mēģināt vēlreiz",
    importance: "Cik svarīgs jums ir šis jautājums?",
    imp: [
      "Mazāk svarīgs",
      "Vidēji svarīgs",
      "Vissvarīgākais"
    ],
    mostCount: "Vissvarīgākie: {n} no {max}",
    mostFull: "Jau ir atzīmēti 15 jautājumi kā vissvarīgākie. Lai atzīmētu šo, vispirms mainiet kādu no tiem.",
    comment: "Pievienot komentāru (nav obligāti)",
    commentPh: "Jūsu komentārs… Tas tiks parādīts anonīmi un vārds vārdā."
  },
  intro: {
    eyebrow: "Iesaistes aptauja",
    title: "{company} vēlas uzzināt jūsu viedokli",
    body: "{company} kopā ar Adizes institūtu veic darbinieku iesaistes aptauju. Jūs atbildēsiet uz {n} jautājumiem par savu ikdienas darbu un organizāciju.",
    bullets: [
      "Aptauja ir anonīma: atbildes tiek apkopotas, un {company} nekad neredz nevienas personas individuālās atbildes.",
      "Pie katra jautājuma norādiet, cik tas jums ir svarīgs. Atzīmējiet līdz 15 jautājumiem kā “Vissvarīgākie” (vismaz vienu).",
      "Pie jebkura jautājuma varat pievienot komentāru. Komentāri tiek parādīti vārds vārdā bez jūsu vārda, tāpēc nenorādiet detaļas, pēc kurām jūs varētu atpazīt.",
      "Tas aizņems apmēram 10–15 minūtes. Varat pārtraukt un vēlāk turpināt ar to pašu saiti."
    ],
    note: "Atbildiet par to, kā lietas ir patiesībā šodien. Ja jums nav pamata atbildēt, izvēlieties “Nezinu”.",
    deadline: "Termiņš: {date}",
    meta: "{n} jautājumi · apmēram 10–15 minūtes · anonīmi"
  },
  review: {
    eyebrow: "Pēdējais solis",
    title: "Pārskatiet savas atbildes",
    body: "Jūs atbildējāt uz visiem {n} jautājumiem.",
    cannot: "Atbilde “Nezinu”: {n}.",
    most: "Vissvarīgākie: {n} no {max}.",
    needMost: "Pirms nosūtīšanas atzīmējiet vismaz {min} jautājumu kā “Vissvarīgākais” (atveriet jebkuru jautājumu, lai to mainītu).",
    missingN: "Neatbildēti jautājumi: {n}.",
    missingHelp: "Noklikšķiniet uz jebkura jautājuma, lai atbildētu vai mainītu atbildi.",
    missing: "Nav atbildes",
    commented: "Komentārs",
    warn: "Noklikšķiniet uz jebkura jautājuma, lai mainītu atbildi, tās svarīgumu vai komentāru. Pēc nosūtīšanas atbildes vairs nevarēs mainīt.",
    submit: "Nosūtīt atbildes",
    hint: "Atbildes var nosūtīt arī saraksta beigās.",
    back: "Atpakaļ uz pārskatu"
  },
  thanks: {
    title: "Paldies",
    body: "Jūsu atbildes ir anonīmi saņemtas. Paldies, ka veltījāt laiku dalībai aptaujā! Varat aizvērt šo logu."
  },
  states: {
    noToken: {
      title: "Nepieciešama jūsu personīgā saite",
      body: "Lai atbildētu, atveriet saiti, ko saņēmāt uzaicinājuma e-pastā."
    },
    invalid_link: {
      title: "Šī saite nav derīga",
      body: "Pārliecinieties, ka atvērāt pilnu saiti no uzaicinājuma e-pasta. Ja problēma atkārtojas, rakstiet uz info@adizes.com."
    },
    completed: {
      title: "Atbildes jau ir iesniegtas",
      body: "Jūsu atbildes ir saņemtas. Paldies par dalību!"
    },
    closed: {
      title: "Šī aptauja ir slēgta",
      body: "Atbildes vairs netiek pieņemtas. Ja uzskatāt, ka tā ir kļūda, sazinieties ar personu, kas jūs uzaicināja."
    },
    not_open: {
      title: "Šī aptauja vēl nav sākusies",
      body: "Lūdzu, mēģiniet vēlāk ar to pašu saiti."
    }
  },
  dontKnow: "Nezinu",
  scales: {
    F: [
      {
        value: 2,
        label: "Nekad",
        sub: "Pilnībā nepiekrītu"
      },
      {
        value: 3,
        label: "Dažreiz",
        sub: "Drīzāk nepiekrītu"
      },
      {
        value: 4,
        label: "Bieži",
        sub: "Drīzāk piekrītu"
      },
      {
        value: 5,
        label: "Vienmēr",
        sub: "Pilnībā piekrītu"
      }
    ],
    A: [
      {
        value: 2,
        label: "Pilnībā nepiekrītu",
        sub: "Nekad"
      },
      {
        value: 3,
        label: "Drīzāk nepiekrītu",
        sub: "Dažreiz"
      },
      {
        value: 4,
        label: "Drīzāk piekrītu",
        sub: "Bieži"
      },
      {
        value: 5,
        label: "Pilnībā piekrītu",
        sub: "Vienmēr"
      }
    ],
    FR: [
      {
        value: 5,
        label: "Nekad",
        sub: "Pilnībā nepiekrītu"
      },
      {
        value: 4,
        label: "Dažreiz",
        sub: "Drīzāk nepiekrītu"
      },
      {
        value: 3,
        label: "Bieži",
        sub: "Drīzāk piekrītu"
      },
      {
        value: 2,
        label: "Vienmēr",
        sub: "Pilnībā piekrītu"
      }
    ],
    AR: [
      {
        value: 5,
        label: "Pilnībā nepiekrītu",
        sub: "Nekad"
      },
      {
        value: 4,
        label: "Drīzāk nepiekrītu",
        sub: "Dažreiz"
      },
      {
        value: 3,
        label: "Drīzāk piekrītu",
        sub: "Bieži"
      },
      {
        value: 2,
        label: "Pilnībā piekrītu",
        sub: "Vienmēr"
      }
    ],
    S: [
      {
        value: 2,
        label: "Pilnīgi neapmierina"
      },
      {
        value: 3,
        label: "Drīzāk neapmierina"
      },
      {
        value: 4,
        label: "Drīzāk apmierina"
      },
      {
        value: 5,
        label: "Pilnīgi apmierina"
      }
    ],
    C: [
      {
        value: 1,
        label: "Būtiski pasliktinājusies"
      },
      {
        value: 2,
        label: "Nedaudz pasliktinājusies"
      },
      {
        value: 3,
        label: "Būtisku pārmaiņu nav"
      },
      {
        value: 4,
        label: "Nedaudz uzlabojusies"
      },
      {
        value: 5,
        label: "Būtiski uzlabojusies"
      }
    ]
  },
  cells: {
    values: "Vērtības",
    climate: "Klimats",
    styles: "Vadības stili",
    responsibility: "Pienākumu struktūra",
    authority: "Pilnvaru struktūra",
    reward: "Atlīdzības struktūra",
    supervisor: "Vadītājs",
    planning: "Plānošana",
    information: "Informācijas plūsma",
    client: "Mijiedarbība ar klientiem",
    transformation: "Transformācija",
    human: "Cilvēkresursi",
    behaviour: "Uzvedība",
    changes: "Pārmaiņas",
    inefficiency: "Neefektivitāte"
  },
  levels: {
    fully: {
      name: "Pilnībā iesaistīti",
      desc: [
        "aizrautīgi attiecībā uz savu darbu un organizāciju",
        "darīs visu nepieciešamo, lai sasniegtu rezultātu",
        "pastāvīgi sasniedz augstas kvalitātes rezultātus",
        "atrod nestandarta un inovatīvus risinājumus vissarežģītākajām problēmām",
        "tiek uztverti kā līderi un paraugs citiem"
      ]
    },
    engaged: {
      name: "Iesaistīti",
      desc: [
        "koncentrējas uz rezultātu, projektu un savu pienākumu izpildi",
        "strādā labi un stabili",
        "vienmēr paveic savu darba daļu",
        "labi sadarbojas ar citiem un palīdz, kad tiek lūgti"
      ]
    },
    somewhat: {
      name: "Daļēji iesaistīti",
      desc: [
        "izvēlīgi attiecībā uz to, kam veltīt savu enerģiju",
        "daudz laika velta lietām, kas nepalīdz klientiem un/vai organizācijai",
        "paveic darbu, kad tas ir nepieciešams vai kad viņus uzrauga",
        "negatīvi ietekmē citus"
      ]
    },
    disengaged: {
      name: "Neiesaistīti",
      desc: [
        "strādā tikai tad, kad tas ir nepieciešams",
        "labprātāk darītu kaut ko citu",
        "rezultāti neatbilst standartiem",
        "domā kategorijās “mēs un viņi”",
        "negatīvi izsakās par organizāciju un saskarsmē ar klientiem un kolēģiem"
      ]
    }
  },
  pdf: {
    file: "Iesaistes-aptauja",
    title: "Iesaistes aptauja",
    subtitle: "Atskaite",
    company: "Uzņēmums",
    launch: "Aptauja",
    date: "Atskaites datums",
    responses: "Atbildes",
    of: "no",
    invited: "uzaicinātajiem",
    anon: "Aptauja ir anonīma. Rezultāti tiek rādīti tikai apkopotā veidā, un grupas ar mazāk nekā 5 atbildēm nekad netiek rādītas atsevišķi.",
    contents: "Saturs",
    toc: [
      "Sadalījums pa iesaistes līmeņiem",
      "Iesaiste pa jomām",
      "Organizācijas faktori",
      "Kas darbiniekiem ir vissvarīgākais",
      "Visi jautājumi",
      "Komentāri"
    ],
    levelsTitle: "Sadalījums pa iesaistes līmeņiem",
    levelsHelp: "Katrs dalībnieks tiek klasificēts pēc visām viņa atbildēm un pēc jautājumiem, ko viņš atzīmēja kā vissvarīgākos.",
    positive: "Pilnībā iesaistīti + Iesaistīti",
    people: "cilv.",
    byAreaTitle: "Iesaiste pa jomām",
    byAreaHelp: "Tiek rādītas tikai jomas ar 5 vai vairāk atbildēm. Mazākas jomas tiek apvienotas grupā “Citas jomas”, ja kopā tās sasniedz 5.",
    company_col: "Uzņēmums",
    other: "Citas jomas",
    hidden: "Atbildes no jomām, kurās ir mazāk nekā 5 cilvēki, ir iekļautas tikai uzņēmuma kopsummā ({n}).",
    noAreas: "Nevienā jomā vēl nav 5 vai vairāk atbilžu, tāpēc rezultāti pa jomām netiek rādīti.",
    respondents: "Respondenti",
    factorsTitle: "Organizācijas faktori",
    factorsHelp: "Katra faktora vērtējums pēc atbildēm (“Nezinu” netiek ņemts vērā), izmantojot to pašu metodi kā Adizes diagnostikas matricā. 75% un vairāk — veselīgs stāvoklis; zem 50% — anomālija.",
    groups: {
      culture: "Organizācijas kultūra",
      structure: "Struktūra",
      process: "Procesi",
      functions: "Organizācijas funkcijas",
      effects: "Sekas"
    },
    colors: {
      green: "Viss kārtībā",
      yellow: "Uzmanības zona",
      red: "Anomāliju zona"
    },
    topTitle: "Kas darbiniekiem ir vissvarīgākais",
    topHelp: "Jautājumi, kas visbiežāk atzīmēti kā “Vissvarīgākie”, un kā uz tiem tika atbildēts.",
    mostPct: "vissvarīgākais",
    distTitle: "Visi jautājumi",
    distHelp: "Atbilžu sadalījums (%) un sarkanā krāsā labajā pusē — to respondentu daļa, kuri šo jautājumu atzīmēja kā vissvarīgāko.",
    legend: {
      "1": "Nezinu",
      "2": "Nekad / Pilnībā nepiekrītu",
      "3": "Dažreiz / Drīzāk nepiekrītu",
      "4": "Bieži / Drīzāk piekrītu",
      "5": "Vienmēr / Pilnībā piekrītu"
    },
    q50: "Zaļā krāsa vienmēr ir pozitīvākā atbilde: negatīvajiem apgalvojumiem 5 un 45 tā ir “Nekad” / “Pilnībā nepiekrītu”. 50. jautājumam ir sava skala (būtiski uzlabojusies → būtiski pasliktinājusies).",
    commentsTitle: "Komentāri",
    commentsHelp: "Dalībnieku rakstīti, anonīmi un vārds vārdā.",
    noComments: "Komentāri netika atstāti.",
    footer: "Adizes institūts · Iesaistes aptauja",
    page: "Lapa",
    cont: "turp."
  },
  questions: [
    "Uzņēmuma vadītāji ievēro tajā deklarētās vērtības",
    "Mūsu uzņēmums pilnībā pilda savas saistības pret darbiniekiem",
    "Uzņēmums novērtē un atbalsta jaunas idejas",
    "Es jūtos labi uzņēmumā valdošajā atmosfērā",
    "Pie mums uzņēmumā katrs ir pats par sevi",
    "Par labi padarītu darbu es saņemu pateicību un novērtējumu",
    "Mēs cienām viens otru",
    "Mūsu uzņēmuma vadītāju uzvedība veicina veselīgu darba vidi, mērķu sasniegšanu un uzņēmuma attīstību",
    "Es skaidri saprotu savus darba uzdevumus un savu lomu nodaļas darbā",
    "Man ir saprotams, kādas procedūras, noteikumi, politikas, profesionālie standarti u. tml. regulē manu darbu",
    "Es zinu, pie kā vērsties ar jautājumiem",
    "Es saprotu, kādus lēmumus man ir tiesības pieņemt",
    "Lēmumi jautājumos, kas skar mani, tiek pieņemti laikus un paredzamā veidā",
    "Man ir pietiekamas pilnvaras, lai uzņemtos atbildību par sava darba rezultātiem",
    "Mans atalgojuma līmenis uzņēmumā ir konkurētspējīgs",
    "Es saprotu, no kā ir atkarīga mana ienākumu mainīgā daļa",
    "Es uzskatu, ka varu diezgan lielā mērā ietekmēt gan fiksēto, gan mainīgo ienākumu daļu",
    "Mana sociālā pakete ir konkurētspējīga tirgū",
    "Es varu pārrunāt personiskus jautājumus ar savu vadītāju",
    "Mans vadītājs izturas pret mani kā pret personību",
    "Mans vadītājs veicina manu profesionālo izaugsmi",
    "Mans vadītājs regulāri runā ar mani par manu progresu",
    "Mans vadītājs sniedz kvalitatīvu un motivējošu atgriezenisko saiti — es vienmēr zinu, ko viņš domā par mani un manu darbu",
    "Uzdevumi, ko man uzdod mans vadītājs, ir skaidri un izpildāmi",
    "Es varu droši uzdot savam vadītājam precizējošus jautājumus",
    "Es uzskatu, ka mana vadītāja pieņemtie lēmumi ir pareizi un noderīgi uzņēmumam",
    "Mans vadītājs uzmanīgi uzklausa mani un ņem vērā manu viedokli",
    "Es zinu un saprotu uzņēmuma ilgtermiņa mērķus",
    "Mani iedvesmo mūsu uzņēmuma mērķi. Mēs darām svarīgu un noderīgu darbu",
    "Es saprotu, kā mana darba rezultāti ietekmē uzņēmuma kopējos rezultātus",
    "Man ir iespēja tikt uzklausītam",
    "Man ir pietiekami daudz informācijas par to, kas notiek uzņēmumā, lai veiktu savu darbu",
    "Es zinu, kuri ir mūsu mērķa klienti (iekšējie vai ārējie). Es zinu, kādas vajadzības mēs varam apmierināt un ar kādiem produktiem vai pakalpojumiem",
    "Mēs labi zinām savu tirgu (iekšējos vai ārējos klientus), sekojam tendencēm un vajadzībām un pastāvīgi domājam, kā labāk apkalpot savus klientus (iekšējos vai ārējos)",
    "Man ir ērta darba vide",
    "Man ir visi nepieciešamie tehniskie resursi, lai labi veiktu savu darbu",
    "Darba procesi, kuros es piedalos, ir sistematizēti un labi organizēti",
    "Mēs apņēmīgi uzlabojam savus darba procesus un izmantotās tehnoloģijas",
    "Mani apmierina darba kvalitāte, ko nodrošina citas nodaļas",
    "Pēdējo 12 mēnešu laikā mans darbs ir ļāvis man uzlabot un attīstīt savas zināšanas, prasmes un iemaņas",
    "Es zinu, ar kādiem nosacījumiem (kas jādara, jāmācās, jāsasniedz) es varu “augt” uzņēmumā",
    "Vai jūs kopumā apmierina darbs šajā uzņēmumā?",
    "Es jūtu, ka uzņēmumā mani novērtē",
    "Darbs, ko es patiesībā daru, man ir interesants un sniedz gandarījumu",
    "Es plānoju aiziet no uzņēmuma tuvākā gada laikā",
    "Es iesaku mūsu uzņēmumu saviem draugiem un paziņām kā labu darba devēju",
    "Es lepojos, ka strādāju šajā uzņēmumā",
    "Uzņēmums attīstās līdzi laikam (produkti, tehnoloģijas, procesi)",
    "Es uzskatu, ka darbinieku potenciāls, viņu prasmes, zināšanas un iemaņas uzņēmumā tiek izmantotas efektīvi",
    "Ņemot vērā visas iepriekšējās atbildes, kā, jūsuprāt, situācija uzņēmumā kopumā ir mainījusies pēdējā gada laikā?"
  ]
};
