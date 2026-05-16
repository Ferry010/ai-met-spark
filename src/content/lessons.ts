/**
 * AI met Spark — volledige lescontent geschreven door Claude.
 * 3 werelden × 8 lessen = 24 lessen voor kids 9-12.
 *
 * Dit bestand wordt automatisch geconsumeerd door LessonRunner en de admin tools.
 * Bewerken via Admin > Lessen (lesson_overrides) heeft voorkeur boven het file editten.
 */

export type Pillar = "safe" | "smart" | "stronger";

export type InteractiveStep =
  | {
      kind: "multiChoice";
      question: string;
      options: { label: string; correct: boolean }[];
      explanation: string;
      hints?: string[];
    }
  | {
      kind: "tapReveal";
      prompt: string;
      reveals: { label: string; reveal: string }[];
      hints?: string[];
    }
  | {
      kind: "sortBuckets";
      prompt: string;
      buckets: string[];
      items: { label: string; bucket: number }[];
      hints?: string[];
    }
  | {
      kind: "dragOrder";
      prompt: string;
      items: string[];
      explanation: string;
      hints?: string[];
    }
  | {
      kind: "spotTheRed";
      prompt: string;
      message: string;
      flags: { fragment: string; isRed: boolean; why: string }[];
      hints?: string[];
    }
  | {
      kind: "promptBuilder";
      prompt: string;
      slots: {
        label: string;
        options: { text: string; strong: boolean }[];
      }[];
      explanation: string;
      hints?: string[];
    };

// Backwards-compatible alias used by Claude's content.
export type Interactive = InteractiveStep;

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  why: string;
}
export type QuizItem = QuizQuestion;

export interface Lesson {
  id: string;
  worldId: 1 | 2 | 3;
  pillar: Pillar;
  title: string;
  emoji: string;
  sparkIntro?: string;
  theoryIntro?: string;
  fact: string;
  sparkMiddle?: string;
  theoryDeep?: string;
  interactive: InteractiveStep;
  summary?: string[];
  quiz: QuizQuestion[];
  reflection?: string;
  bossTest?: boolean;
}

export interface World {
  id: 1 | 2 | 3;
  pillar: Pillar;
  name: string;
  tagline: string;
  emoji: string;
  badgeName: string;
  lessons: Lesson[];
}

// ============================================================
//  LESSEN (Claude content)
// ============================================================

const ALL: Lesson[] = [
  // ============================================================
  //  WERELD 1 — VEILIG
  // ============================================================

  {
    id: "1.1",
    worldId: 1,
    pillar: "safe",
    title: "Wat is AI eigenlijk?",
    emoji: "🤖",
    sparkIntro:
      "Hoi. Leuk dat je er bent. Denk eens aan de laatste keer dat TikTok precies dat ene filmpje liet zien waar jij zin in had. Bijna alsof TikTok al wist wat jij leuk vond. Dat is AI aan het werk. Vandaag leg ik je rustig uit wat dat is.",
    theoryIntro:
      "**AI is geen magie. En ook geen robot met gevoelens.**\n\nAI betekent: een computer die patronen leert herkennen. Laat een computer miljoenen foto's van katten zien en hij merkt op: spitse oren, snorharen, vachtstrepen. Dan zal het wel een kat zijn. Heeft die computer ooit een kat geaaid? Nee. Weet hij echt wat een kat is? Ook niet. Hij heeft alleen verbanden geleerd.",
    fact:
      "De eerste computer die een wereldkampioen schaken versloeg heette Deep Blue. Dat was in 1997. Hij dacht niet zoals een mens. Hij rekende alleen heel veel zetten vooruit en koos de beste. Dat is AI in één zin: super sterk in rekenen, zonder echt begrip.",
    sparkMiddle:
      "Oké, de basis snap je. Maar waarom lijkt AI dan soms zo slim?",
    theoryDeep:
      "**Waarom AI slim lijkt**\n\nDit soort systemen is getraind met enorm veel tekst van internet. Als jij iets vraagt, voorspelt de AI welk antwoord het beste past bij alles wat hij ooit heeft gezien. Het is geen weten. Het is een hele sterke gok. Vaak gaat dat goed. Soms helemaal niet. En AI klinkt altijd zelfverzekerd, ook als hij twijfelt. Daarom blijf jij zelf nadenken.",
    interactive: {
      kind: "sortBuckets",
      prompt: "Tik elk kaartje aan en kies de juiste zone.",
      buckets: ["🤖 Dit is AI", "📦 Dit is geen AI"],
      items: [
        { label: "TikTok die jouw lievelingsfilmpjes kiest", bucket: 0 },
        { label: "De rekenmachine op je telefoon", bucket: 1 },
        { label: "Snapchat-filter dat je gezicht herkent", bucket: 0 },
        { label: "Een papieren plattegrond", bucket: 1 },
        { label: "ChatGPT die een verhaaltje schrijft", bucket: 0 },
        { label: "De lichtknop in je kamer", bucket: 1 },
      ],
    },
    summary: [
      "AI herkent patronen in heel veel voorbeelden. Het denkt niet zoals een mens.",
      "AI klinkt vaak zeker van zichzelf, ook als hij gokt.",
      "Je komt AI overal tegen: TikTok, YouTube, games, Snapchat-filters.",
    ],
    quiz: [
      {
        question: "Wat doet AI eigenlijk?",
        options: [
          "Het denkt precies zoals mensen",
          "Het herkent patronen uit heel veel voorbeelden",
          "Het weet altijd het goede antwoord",
          "Het voelt wat jij voelt",
        ],
        correctIndex: 1,
        why: "Precies. AI leert door patronen te zien in miljoenen voorbeelden. Denken doet hij niet.",
      },
      {
        question: "AI heeft gevoelens, net als jij.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Nee. AI kan doen alsof, maar voelt niks. Het is code.",
      },
      {
        question: "Welk van deze dingen werkt met AI?",
        options: [
          "Een papieren boek",
          "Een rekenmachine",
          "TikTok-voorstellen",
          "Een fluitketel",
        ],
        correctIndex: 2,
        why: "TikTok-voorstellen werken met AI. De rest niet.",
      },
    ],
    reflection: "Je weet nu wat AI écht is. Vanaf nu zie je het voor wat het is: geen magie.",
  },

  {
    id: "1.2",
    worldId: 1,
    pillar: "safe",
    title: "Jouw geheimen zijn van jou",
    emoji: "🔒",
    sparkIntro:
      "Stel je voor: je typt iets in ChatGPT en denkt dat het weg is zodra je het tabblad sluit. Niet helemaal. Veel van wat jij intypt, wordt bewaard. Soms om de AI beter te maken. Soms voor andere redenen. Tijd voor een belangrijke regel.",
    theoryIntro:
      "**Wat jij naar AI typt is niet privé.**\n\nDe meeste AI-systemen slaan op wat je intypt. Bedrijven gebruiken dat om hun systeem te verbeteren. Soms lezen mensen mee om fouten te checken. Dus alles wat je intypt, behandel je alsof iemand anders het ook kan zien. Niet om je bang te maken. Gewoon zodat jij de baas blijft over jouw info.",
    fact:
      "In 2023 ging bij een groot techbedrijf per ongeluk een lijst privé-gesprekken met ChatGPT openbaar. Iedereen kon ze lezen. Daar stonden ook echte namen, e-mails en geheimen in van mensen die dachten dat het privé was. Het kan dus écht gebeuren.",
    sparkMiddle:
      "Hoe weet je nou wat oké is om te typen en wat niet? Hier is mijn trucje.",
    theoryDeep:
      "**De wachtkamer-test**\n\nStel je voor: je zit in een drukke wachtkamer bij de dokter. Iedereen kan je horen. Zou je het daar hardop zeggen? Ja? Dan kan het naar AI. Nee? Dan houd je het voor je. Je achternaam, je adres, je school, je wachtwoord, foto's van jezelf: dat zeg je niet in een wachtkamer. Dus ook niet tegen AI.",
    interactive: {
      kind: "sortBuckets",
      prompt: "Wat zou je wel of niet tegen AI zeggen?",
      buckets: ["✅ Oké om te typen", "🚫 Houd je voor je"],
      items: [
        { label: "Leg uit hoe een vulkaan werkt", bucket: 0 },
        { label: "Mijn wachtwoord is voetbal123", bucket: 1 },
        { label: "Help met mijn werkstuk over honden", bucket: 0 },
        { label: "Ik woon op de Kerkstraat 14", bucket: 1 },
        { label: "Schrijf een grappig gedicht", bucket: 0 },
        { label: "Mijn moeder heet Anouk de Vries", bucket: 1 },
      ],
    },
    summary: [
      "Wat je intypt bij AI kan bewaard worden. Zie het als publiek.",
      "Gebruik de wachtkamer-test: zou je het hardop zeggen tegen onbekenden? Zo niet, niet typen.",
      "AI helpen met huiswerk of een verhaal is prima. Persoonlijke info delen niet.",
    ],
    quiz: [
      {
        question: "Wat is de wachtkamer-test?",
        options: [
          "Wachten tot AI antwoord geeft",
          "Check of je het hardop zou zeggen in een volle wachtkamer",
          "Een test om te zien of AI werkt",
          "Wachten tot je ouders zeggen dat het mag",
        ],
        correctIndex: 1,
        why: "Yes. Zou je het tegen onbekenden zeggen? Zo niet, dan ook niet tegen AI.",
      },
      {
        question: "Alles wat je naar AI typt, blijft helemaal privé.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Klopt. Veel wordt opgeslagen. Soms lezen mensen mee.",
      },
      {
        question: "Wat kun je gerust intypen?",
        options: [
          "Je telefoonnummer",
          "Hoe je vader van zijn werk heet",
          "Leg fotosynthese uit als ik 10 ben",
          "Het wifi-wachtwoord van thuis",
        ],
        correctIndex: 2,
        why: "Een vraag over fotosynthese kan iedereen weten. De rest is privé.",
      },
    ],
    reflection: "Jij bent de baas over jouw info. Niet de AI. Niet het bedrijf erachter.",
  },

  {
    id: "1.3",
    worldId: 1,
    pillar: "safe",
    title: "Wat is een goede vraag aan AI?",
    emoji: "💬",
    sparkIntro:
      "Hier komt een geheimpje. AI is zo goed als jouw vraag. Stel een vage vraag en je krijgt een vaag antwoord. Stel een scherpe vraag en AI geeft je goud. Vandaag leer ik je hoe.",
    theoryIntro:
      "**Een goede vraag is concreet.**\n\nKijk naar het verschil:\n\nVaag: \"Vertel iets over honden.\"\nScherp: \"Leg uit waarom honden kwispelen. Ik ben 10. Geef twee redenen.\"\n\nDe tweede vraag krijgt een veel beter antwoord. Want je vertelt AI precies wat je wil, hoe oud je bent en hoe lang het mag zijn.",
    fact:
      "Onderzoekers hebben ontdekt dat dezelfde AI compleet andere antwoorden geeft op een vage of een scherpe vraag. Soms is het verschil zo groot dat het lijkt of je met een andere AI praat. Terwijl het exact dezelfde is.",
    sparkMiddle: "Onthoud dit trucje. Het is de basis van alles wat daarna komt.",
    theoryDeep:
      "**Het trucje: VOOR WIE, WAT, HOE LANG**\n\nVoor wie is het? Bijvoorbeeld: voor mij, 10 jaar. Of: voor mijn kleine zusje van 6.\nWat wil je? Bijvoorbeeld: uitleg, voorbeelden, een verhaaltje, ideeën.\nHoe lang? Bijvoorbeeld: in 3 zinnen, 5 punten, een korte alinea.\n\nGooi alle drie samen in één vraag en je krijgt veel betere antwoorden. Probeer het later eens uit.",
    interactive: {
      kind: "promptBuilder",
      prompt: "Bouw een goede vraag. Kies uit elke rij het beste blok.",
      slots: [
        {
          label: "VOOR WIE",
          options: [
            { text: "Voor mij", strong: false },
            { text: "Voor mij, ik ben 10", strong: true },
            { text: "Voor iemand", strong: false },
          ],
        },
        {
          label: "WAT",
          options: [
            { text: "iets over de ruimte", strong: false },
            { text: "leg uit waarom de zon niet ontploft", strong: true },
            { text: "vertel", strong: false },
          ],
        },
        {
          label: "HOE LANG",
          options: [
            { text: "een beetje", strong: false },
            { text: "in 3 korte zinnen", strong: true },
            { text: "zoveel je wil", strong: false },
          ],
        },
      ],
      explanation:
        "De sterke combinatie is: 'Voor mij, ik ben 10, leg uit waarom de zon niet ontploft, in 3 korte zinnen.' Concreet, scherp, kort.",
    },
    summary: [
      "AI is zo goed als jouw vraag. Vaag erin, vaag eruit.",
      "Gebruik het trucje VOOR WIE, WAT, HOE LANG.",
      "Hoe scherper jij vraagt, hoe beter AI antwoordt.",
    ],
    quiz: [
      {
        question: "Welke vraag is het beste?",
        options: [
          "Vertel iets",
          "Honden",
          "Leg in 3 zinnen uit waarom honden kwispelen, voor mij van 10",
          "Help me",
        ],
        correctIndex: 2,
        why: "Yes. Deze vraag vertelt AI wat je wil, voor wie en hoe lang.",
      },
      {
        question: "Een vage vraag geeft een goed antwoord.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Klopt. Vaag erin = vaag eruit. Altijd.",
      },
      {
        question: "Wat staat er in het trucje uit deze les?",
        options: [
          "WAAR, WANNEER, WIE",
          "VOOR WIE, WAT, HOE LANG",
          "HOE, WAAROM, WAT",
          "BEGIN, MIDDEN, EIND",
        ],
        correctIndex: 1,
        why: "VOOR WIE, WAT, HOE LANG. Onthoud die volgorde.",
      },
    ],
    reflection: "Eén goede vraag is meer waard dan tien slechte. Jij bepaalt de kwaliteit.",
  },

  {
    id: "1.4",
    worldId: 1,
    pillar: "safe",
    title: "AI klinkt altijd zeker, ook als het fout zit",
    emoji: "🎤",
    sparkIntro:
      "Ken je iemand die altijd zegt dat hij gelijk heeft, ook als hij ernaast zit? AI doet dat ook. En het is gevaarlijk, omdat AI vaak zo overtuigend klinkt dat je hem gelooft. Tijd om dat te leren herkennen.",
    theoryIntro:
      "**Zekerheid is geen bewijs.**\n\nAI praat altijd met een rustige, slimme stem. Geen twijfel, geen \"ehm\", geen \"ik weet het niet zeker\". Maar dat zegt niks over of het klopt. Een mens die heel zeker praat, kan ook gewoon ernaast zitten. Bij AI is dat nog vaker zo, omdat hij niet eens weet wat zeker en onzeker is.",
    fact:
      "Een advocaat in Amerika gebruikte ChatGPT om rechtszaken op te zoeken voor een dossier. AI noemde zes rechtszaken met namen, datums en uitspraken. Alles klonk perfect. Probleem: alle zes waren verzonnen. De advocaat kreeg een boete van een paar duizend dollar.",
    sparkMiddle: "Hoe bescherm je jezelf? Met één simpele actie.",
    theoryDeep:
      "**De wenkbrauw-check**\n\nElke keer als AI een feit noemt (een naam, een jaartal, een getal, een citaat) doe je dit: trek even één wenkbrauw op. \"Hmmm, klopt dat echt?\" En dan check je het op één andere plek. Wikipedia, schoolboek, of vraag het aan een volwassene. Klein gebaar, gigantisch verschil.",
    interactive: {
      kind: "spotTheRed",
      prompt: "AI gaf dit antwoord. Tik de stukken aan die je moet checken.",
      message:
        "De grootste vis ter wereld is de blauwe vinvis van 35 meter. Hij eet 8 ton garnalen per dag. Wetenschapper Karel de Bruin ontdekte dit in 1987.",
      flags: [
        {
          fragment: "blauwe vinvis van 35 meter",
          isRed: true,
          why: "De blauwe vinvis is geen vis maar een zoogdier. En 35 meter is overdreven. Check dit.",
        },
        {
          fragment: "8 ton garnalen per dag",
          isRed: true,
          why: "Dit getal klinkt rond en specifiek. Precies waar AI gokken doet. Check.",
        },
        {
          fragment: "Karel de Bruin ontdekte dit in 1987",
          isRed: true,
          why: "Verzonnen naam en jaartal. Dit is een klassieke hallucinatie. Altijd checken.",
        },
      ],
    },
    summary: [
      "AI klinkt zelfverzekerd, ook als hij gokt.",
      "Bij elk feit, naam, jaartal of getal: doe de wenkbrauw-check.",
      "Check één keer ergens anders. Wikipedia, boek of volwassene.",
    ],
    quiz: [
      {
        question: "Wat betekent het als AI zelfverzekerd klinkt?",
        options: [
          "Het klopt zeker",
          "Het is gegarandeerd waar",
          "Niks, het zegt niks over of het klopt",
          "AI weet het zeker",
        ],
        correctIndex: 2,
        why: "Precies. Zekerheid is geen bewijs bij AI.",
      },
      {
        question: "Wat is de wenkbrauw-check?",
        options: [
          "Je wenkbrauwen optillen voor een foto",
          "Bij elk feit even denken: klopt dit echt? En dan checken",
          "Een test voor je ogen",
          "Vragen aan AI of het zeker is",
        ],
        correctIndex: 1,
        why: "Yes. Eén klein moment van twijfel beschermt je tegen fouten.",
      },
      {
        question: "AI verzint nooit namen of jaartallen.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "AI verzint die juist makkelijk. Klinkt echt, is het niet.",
      },
    ],
    reflection: "Eén opgetrokken wenkbrauw redt je van veel fouten. Klein gebaar, groot effect.",
  },

  {
    id: "1.5",
    worldId: 1,
    pillar: "safe",
    title: "Nep-berichten herkennen",
    emoji: "🎣",
    sparkIntro:
      "Stel: je krijgt een appje van een onbekend nummer. \"Hoi, ik ben je tante Linda. Mijn telefoon is kapot. Kun je snel even iets voor me regelen?\" Vroeger zaten zulke berichten vol taalfouten. Nu niet meer. AI schrijft ze perfect. Maar er is iets dat oplichters altijd verraadt.",
    theoryIntro:
      "**Oplichters gebruiken AI om nep-berichten beter te maken.**\n\nVroeger herkende je oplichting aan rare zinnen en taalfouten. Nu schrijft AI perfecte Nederlandse berichten. Probleem opgelost voor de oplichter. Dus jij hebt een nieuwe manier nodig om ze te herkennen. Gelukkig is die er. Want hoe mooi het bericht ook geschreven is, de bedoeling is altijd hetzelfde.",
    fact:
      "Onderzoek van de politie in Nederland laat zien dat nep-berichten van zogenaamde familieleden in 2024 fors zijn gestegen. Veel daarvan zijn nu geschreven met AI. Toch trapt 90 procent van de mensen die de waarschuwingstekens kent er niet meer in. Kennis werkt.",
    sparkMiddle: "Wat is dan dat ene dat oplichters altijd verraadt?",
    theoryDeep:
      "**Het patroon van een oplichter: IETS, NU, GEHEIM**\n\nElke oplichting heeft drie ingrediënten. Iets: ze willen geld, een code, of iets persoonlijks van je. Nu: er is altijd haast. \"Snel even.\" \"Voor vanavond.\" \"Anders ben ik te laat.\" Geheim: vertel het niet tegen anderen. \"Zeg het niet tegen papa.\" Als je deze drie ziet, is het bijna altijd nep. Echte vrienden en familie hebben geen haast en geen geheimen.",
    interactive: {
      kind: "spotTheRed",
      prompt: "Lees dit bericht. Tik de rode vlaggen aan.",
      message:
        "Hoi liefje, ik ben tante Saskia. Mijn telefoon is stuk dus dit is een nieuw nummer. Ik moet snel een rekening betalen voor 18:00 vandaag. Kun jij even 50 euro overmaken? Ik betaal het morgen terug. Zeg het niet tegen je moeder, want die wordt boos op mij.",
      flags: [
        {
          fragment: "tante Saskia. Mijn telefoon is stuk dus dit is een nieuw nummer",
          isRed: true,
          why: "Klassieke truc. Nieuw nummer dat zogenaamd van familie is. Bel altijd het oude nummer.",
        },
        {
          fragment: "snel een rekening betalen voor 18:00",
          isRed: true,
          why: "Tijdsdruk. Oplichters willen dat je geen tijd hebt om na te denken.",
        },
        {
          fragment: "Zeg het niet tegen je moeder",
          isRed: true,
          why: "Geheim houden. Echte familie zegt dit nooit. Dit is hét teken.",
        },
      ],
    },
    summary: [
      "Oplichters gebruiken AI om nep-berichten foutloos te schrijven.",
      "Herken het patroon: IETS, NU, GEHEIM.",
      "Echte familie heeft geen haast en geen geheimen.",
    ],
    quiz: [
      {
        question: "Wat zijn de drie ingrediënten van een oplichters-bericht?",
        options: [
          "Lief, snel, gratis",
          "Iets, nu, geheim",
          "Geld, foto, naam",
          "Hallo, vraag, dank je",
        ],
        correctIndex: 1,
        why: "Yes. IETS, NU, GEHEIM. Drie samen = bijna altijd nep.",
      },
      {
        question: "Berichten zonder taalfouten zijn altijd echt.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. AI schrijft perfecte berichten. Kijk naar de bedoeling, niet de spelling.",
      },
      {
        question: "Wat doe je bij een verdacht bericht?",
        options: [
          "Snel betalen voor het te laat is",
          "Niks zeggen tegen je ouders",
          "Bel de echte persoon op hun oude nummer",
          "Antwoorden en vragen wie het is",
        ],
        correctIndex: 2,
        why: "Precies. Bel het bekende nummer. Of vraag een volwassene erbij.",
      },
    ],
    reflection: "Haast en geheim zijn rode vlaggen. Geen mooie zin verandert dat.",
  },

  {
    id: "1.6",
    worldId: 1,
    pillar: "safe",
    title: "Wat AI NIET mag weten",
    emoji: "🧩",
    sparkIntro:
      "Je weet al van les 2: typ geen wachtwoorden of adressen. Logisch. Maar er is iets sluwer. Soms zijn losse stukjes info onschuldig, maar samen worden ze gevaarlijk. Tijd voor het puzzel-principe.",
    theoryIntro:
      "**Losse info is meestal oké. Combinaties zijn dat niet.**\n\nDat je naar groep 7 gaat? Niet erg. Dat je in Utrecht woont? Op zich niet. Dat je voornaam Sem is? Ook niet. Maar samen: een jongen genaamd Sem, groep 7, school in Utrecht. Plotseling ben je veel makkelijker te vinden. Dat noemen we puzzelstukjes. Elk stukje is klein. Samen vormen ze een foto.",
    fact:
      "Beveiligers laten in trainingen vaak zien hoe ze met drie kleine stukjes info iemand online kunnen vinden. Naam, school, een hobby. Soms vinden ze in 10 minuten je adres. Daarom: hoe minder puzzelstukjes je weggeeft, hoe veiliger.",
    sparkMiddle: "Hoe zie je nou welk stukje het verschil maakt? Met deze test.",
    theoryDeep:
      "**De puzzel-check**\n\nVoordat je iets typt, vraag jezelf: \"Als iemand dit stukje krijgt en hij heeft al twee andere stukjes, kan hij me dan vinden?\" Als het antwoord ja of misschien is, niet typen. Combinaties die altijd gevaarlijk zijn: voornaam + school + klas. Of: leeftijd + sport + clubnaam. Of: foto + buurt. Drie stukjes en je bent te vinden.",
    interactive: {
      kind: "sortBuckets",
      prompt: "Welke combinatie is veilig en welke gevaarlijk?",
      buckets: ["✅ Geen probleem", "⚠️ Te veel info"],
      items: [
        { label: "Ik ben 10 jaar oud", bucket: 0 },
        { label: "Ik heet Lotte, zit op De Regenboog in Breda, klas 7", bucket: 1 },
        { label: "Ik speel voetbal", bucket: 0 },
        { label: "Ik ben Jasper, voetbal bij FC Zwaluwen, woon erom de hoek", bucket: 1 },
        { label: "Mijn lievelingsdier is een tijger", bucket: 0 },
        { label: "Ik woon in Nederland", bucket: 0 },
      ],
    },
    summary: [
      "Eén klein stukje info is meestal niet erg.",
      "Drie stukjes samen kunnen je vindbaar maken. Dat heet het puzzel-principe.",
      "Voor je typt: doe de puzzel-check. Kan iemand me hiermee vinden? Niet typen.",
    ],
    quiz: [
      {
        question: "Wat is het puzzel-principe?",
        options: [
          "Elke puzzel oplossen die AI geeft",
          "Losse info is oké, maar combinaties kunnen gevaarlijk zijn",
          "Drie keer hetzelfde vragen",
          "Een spel met AI",
        ],
        correctIndex: 1,
        why: "Yes. Stukje voor stukje is niks, samen is het een foto.",
      },
      {
        question: "Welk van deze is een gevaarlijke combinatie?",
        options: [
          "Ik hou van pizza",
          "Ik ben Anna, woon in Den Haag, zit op de Pius X school",
          "Ik vind regen niet leuk",
          "Mijn favoriete kleur is blauw",
        ],
        correctIndex: 1,
        why: "Naam, plaats én school samen. Hiermee kun je iemand vinden.",
      },
      {
        question: "Eén losse stukje info is ALTIJD gevaarlijk.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Het gaat juist om de combinatie. Eén stukje is meestal prima.",
      },
    ],
    reflection: "Jij beslist welke stukjes je weggeeft. Dat maakt jou bedacht én vrij.",
  },

  {
    id: "1.7",
    worldId: 1,
    pillar: "safe",
    title: "Wanneer vraag je een volwassene?",
    emoji: "🆘",
    sparkIntro:
      "Soms loop je tegen iets aan waarvan je denkt: hmm, dit klopt niet helemaal. Of: dit voelt raar. Op die momenten is er één ding dat je altijd doet. Je haalt een volwassene erbij die je vertrouwt.",
    theoryIntro:
      "**Een volwassene erbij halen is geen falen. Het is slim.**\n\nVeel kids willen het zelf oplossen. Logisch. Maar sommige situaties zijn echt te groot voor één persoon. En zeker als je jong bent en het gaat over geld, of geheime dingen, of iets dat aan je veiligheid raakt. Dan haal je er gewoon iemand bij. Een ouder, een leraar, een grote broer of zus, een tante. Iemand die je vertrouwt.",
    fact:
      "Politie en hulplijnen zien hetzelfde patroon. Kids die snel een volwassene betrekken bij iets engs, lopen veel minder schade op. Zowel bij online gedoe als bij oplichting. Vroeg om hulp vragen is letterlijk een superkracht.",
    sparkMiddle: "Maar wanneer dan precies? Hier zijn de vier momenten.",
    theoryDeep:
      "**De vier triggers**\n\n1. Eng gevoel. Iemand zegt iets dat raar voelt, ook als je niet weet waarom. Vertrouw je gevoel.\n2. Geld. Iemand vraagt om geld, een code, een tegoedbon, een rekening. Altijd volwassene erbij.\n3. Geheim houden. Iemand zegt: \"vertel het niet aan papa\" of \"hou dit voor je\". Direct vertellen.\n4. Iets dat niet klopt. AI zegt iets vreemds over jou. Een onbekende noemt je naam. Iets wat je niet verwacht. Volwassene erbij.",
    interactive: {
      kind: "multiChoice",
      question:
        "Iemand zegt in een game: \"je bent supercool, geef me je naam en huisnummer dan stuur ik je een echte cadeau\". Wat doe je?",
      options: [
        { label: "Naam geven, want hij is aardig", correct: false },
        { label: "Snel iets verzinnen om af te leiden", correct: false },
        { label: "Niks zeggen, gewoon de game uitzetten en het aan een volwassene vertellen", correct: true },
        { label: "Vragen waarom hij dat wil weten", correct: false },
      ],
      explanation:
        "Game uit, volwassene erbij. Cadeautjes vragen om je adres = altijd nep. Jij hoeft het niet uit te leggen.",
    },
    summary: [
      "Een volwassene erbij halen is slim, geen falen.",
      "De vier triggers: eng gevoel, geld, geheim houden, iets dat niet klopt.",
      "Vertrouw je gevoel. Als iets raar voelt, is dat genoeg reden om hulp te halen.",
    ],
    quiz: [
      {
        question: "Wat zijn de vier triggers om een volwassene te halen?",
        options: [
          "Honger, dorst, moe, verdrietig",
          "Eng gevoel, geld, geheim, iets dat niet klopt",
          "AI, school, vrienden, sport",
          "Maandag, woensdag, vrijdag, zondag",
        ],
        correctIndex: 1,
        why: "Yes. Deze vier onthouden, blijft een leven lang nuttig.",
      },
      {
        question: "Een volwassene halen is een teken van zwakte.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Het tegenovergestelde. Het is een superkracht.",
      },
      {
        question: "Iemand vraagt om je adres. Wat doe je?",
        options: [
          "Geven, want hij vraagt het netjes",
          "Een nep-adres geven",
          "Stoppen met praten en een volwassene erbij halen",
          "Eerst vragen waarom",
        ],
        correctIndex: 2,
        why: "Stoppen en hulp halen. Adres geven aan onbekenden = nooit doen.",
      },
    ],
    reflection: "Hulp vragen is niet kinderachtig. Het is volwassen. Echt.",
  },

  {
    id: "1.8",
    worldId: 1,
    pillar: "safe",
    title: "Wereld 1 Baas-test",
    emoji: "🛡️",
    bossTest: true,
    sparkIntro:
      "Knap dat je hier bent. Je hebt zeven lessen gehad over slim en veilig omgaan met AI. Tijd om alles wat je weet samen te brengen. Drie pittige scenario's. Geen nieuwe theorie. Alleen jij, je hersens en wat je hebt geleerd.",
    theoryIntro:
      "**Wat je tot nu toe weet:**\n\nAI is patroonherkenning, geen magie. Wat je intypt is niet privé. Een goede vraag heeft VOOR WIE, WAT, HOE LANG. AI klinkt zeker, ook als hij gokt. Oplichters volgen het patroon IETS, NU, GEHEIM. Combinaties van info zijn gevaarlijker dan losse stukjes. En een volwassene erbij halen is altijd slim als iets eng, geld, geheim of raar is.",
    fact:
      "Onderzoekers ontdekten dat als kinderen één keer goed worden uitgelegd hoe AI werkt en wat veilig gebruik is, ze daarna bijna twee keer beter feit van fictie kunnen onderscheiden. Eén keer leren werkt dus enorm.",
    sparkMiddle: "Hier komt de test. Geen druk. Gewoon laten zien wat je in je hebt.",
    theoryDeep:
      "**Zo werkt de baas-test**\n\nJe krijgt straks drie scenario's. Lees ze rustig. Denk na voor je antwoordt. Het gaat erom dat je het juiste doet in een nieuwe situatie. Dat is namelijk waar je het buiten deze cursus ook nodig hebt. Onthoud: bij twijfel kies je altijd voor veilig. Beter een keer te voorzichtig dan een keer te laat.",
    interactive: {
      kind: "multiChoice",
      question:
        "Je krijgt op TikTok een DM van een onbekend account. Het profiel ziet er leuk uit. Het bericht: \"Hé, ik organiseer een super cool feestje. Stuur snel je naam, school en wat je leuk vindt, dan krijg je een uitnodiging. Niet aan je ouders vertellen, want dan is het geen verrassing.\" Wat doe je?",
      options: [
        { label: "Antwoorden met alleen je voornaam, dat kan geen kwaad", correct: false },
        { label: "Niet reageren, account blokkeren en het aan een volwassene vertellen", correct: true },
        { label: "Vragen om meer info over het feestje voordat je iets deelt", correct: false },
        { label: "Een nep-naam en nep-school geven, gewoon voor de lol", correct: false },
      ],
      explanation:
        "Dit bericht heeft alle rode vlaggen: vraagt info, wil het geheim houden, klinkt te mooi. Niet reageren, blokkeren, volwassene erbij. Klassiek.",
    },
    summary: [
      "Bij twijfel: kies altijd voor veilig.",
      "Combinaties van rode vlaggen (haast, geheim, info-vraag) = bijna altijd nep.",
      "Eén keer goed nadenken voorkomt veel gedoe later.",
    ],
    quiz: [
      {
        question:
          "AI vertelt je heel zelfverzekerd dat de hoofdstad van Australië Sydney is. Wat doe je?",
        options: [
          "Geloven, want AI klinkt zeker",
          "Wenkbrauw-check: even op Wikipedia kijken",
          "AI vragen of hij zeker is",
          "Het overschrijven in je werkstuk",
        ],
        correctIndex: 1,
        why: "Yes. Wenkbrauw-check. Trouwens, de hoofdstad is Canberra, niet Sydney. AI had het mis.",
      },
      {
        question:
          "Je beste vriend appt een nieuw nummer: \"Ben mijn telefoon kwijt, kun jij 20 euro lenen via een tikkie? Snel graag, en niet aan mijn moeder vragen.\"",
        options: [
          "Snel sturen, vrienden helpen elkaar",
          "Vraag eerst om bewijs",
          "Bel je vriend op zijn oude nummer of vraag het aan een volwassene",
          "Stuur 10 euro, dat is veilig genoeg",
        ],
        correctIndex: 2,
        why: "Klassieke IETS-NU-GEHEIM. Altijd bellen of volwassene erbij.",
      },
      {
        question:
          "Je wilt ChatGPT vragen om hulp bij je werkstuk over je eigen buurt. Wat type je?",
        options: [
          "Mijn buurt heet [echte naam], help me met een werkstuk",
          "Help me met een werkstuk over een Nederlandse buurt met veel speeltuinen",
          "Ik woon op [adres], schrijf een werkstuk",
          "Mijn school is [naam], help met buurtwerkstuk",
        ],
        correctIndex: 1,
        why: "Precies. Vraag algemeen. Hoeft AI niet te weten waar jij woont.",
      },
    ],
    reflection: "Je bent klaar voor wereld 2. Slimmer met AI dan 99 procent van de volwassenen.",
  },

  // ============================================================
  //  WERELD 2 — SLIM
  // ============================================================

  {
    id: "2.1",
    worldId: 2,
    pillar: "smart",
    title: "AI is een gokker, geen wijsneus",
    emoji: "🎲",
    sparkIntro:
      "Welkom in wereld 2. Hier ga je leren waarom AI soms ineens onzin uitkraamt terwijl hij er rotsvast in gelooft. Het begint met begrijpen hoe AI eigenlijk antwoord verzint. En het antwoord is: hij gokt.",
    theoryIntro:
      "**AI voorspelt woorden, hij weet ze niet.**\n\nAls jij iets vraagt, doet AI dit: hij berekent welk woord het meest waarschijnlijk hierna komt. Dan het volgende. Dan het volgende. Eén voor één. Net als jouw telefoon met die woordsuggesties boven het toetsenbord, maar dan veel slimmer. Hij weet niet wat hij zegt. Hij voorspelt alleen wat past.",
    fact:
      "Ondanks dat AI miljarden zinnen heeft gelezen, is het soms heel slecht in simpele dingen. Vraag een AI hoeveel letter R er in het woord aardbei zit. Veel AI's antwoorden 1 of 2. Het zijn er 3. Hij voorspelt namelijk woorden, geen letters.",
    sparkMiddle: "Dat hij gokt, is niet erg. Maar je moet wel weten wanneer hij verkeerd gokt.",
    theoryDeep:
      "**Wanneer gokt AI verkeerd?**\n\nVooral bij dingen die zeldzaam zijn of niet vaak op internet staan. Een onbekend boek. Een kleine plaats. Een specifiek getal. Een citaat van iemand. Daar heeft AI weinig voorbeelden van. Dus hij verzint iets dat aannemelijk klinkt. Tip: hoe specifieker je vraag, hoe vaker je moet checken. Want hoe minder voorbeelden AI heeft, hoe vaker hij gokt.",
    interactive: {
      kind: "sortBuckets",
      prompt: "Bij welke vraag is AI waarschijnlijk goed en bij welke moet je checken?",
      buckets: ["🎯 Meestal goed", "⚠️ Check zeker"],
      items: [
        { label: "Wat is fotosynthese?", bucket: 0 },
        { label: "Wat is het lievelingsboek van mijn juf?", bucket: 1 },
        { label: "Hoe spel je 'restaurant'?", bucket: 0 },
        { label: "Wie schreef in 1987 een boek over kikkers in Friesland?", bucket: 1 },
        { label: "Wat is de hoofdstad van Frankrijk?", bucket: 0 },
        { label: "Hoeveel inwoners had Vlissingen in 1923?", bucket: 1 },
      ],
    },
    summary: [
      "AI voorspelt het volgende woord. Hij weet niks, hij gokt slim.",
      "Bij algemene vragen gokt hij meestal goed.",
      "Bij specifieke of zeldzame vragen gokt hij vaker mis.",
    ],
    quiz: [
      {
        question: "Hoe maakt AI zijn antwoorden?",
        options: [
          "Hij denkt na over jouw vraag",
          "Hij zoekt op Google",
          "Hij voorspelt welk woord het meest waarschijnlijk hierna komt",
          "Hij vraagt aan andere AI's",
        ],
        correctIndex: 2,
        why: "Yes. Hij voorspelt woord voor woord. Snel, maar het is gokken.",
      },
      {
        question: "Bij welke vraag gokt AI het meest verkeerd?",
        options: [
          "Wat is 2 + 2?",
          "Wat is de hoofdstad van Duitsland?",
          "Welk boek las mijn buurman in 2019?",
          "Hoe maak je pannenkoeken?",
        ],
        correctIndex: 2,
        why: "Yes. Iets specifieks en onbekends. Daar gokt AI bijna altijd verkeerd.",
      },
      {
        question: "AI weet wat hij zegt.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Hij voorspelt, hij weet niet.",
      },
    ],
    reflection: "Vanaf nu hoor je AI praten en denk je: hé, jij gokt eigenlijk. Goeie houding.",
  },

  {
    id: "2.2",
    worldId: 2,
    pillar: "smart",
    title: "De hallucinatie-val",
    emoji: "👻",
    sparkIntro:
      "Een hallucinatie. Mooi woord. Bij AI betekent het: hij verzint iets dat helemaal niet bestaat, maar zegt het alsof het waar is. Boeken die nooit zijn geschreven. Mensen die nooit hebben geleefd. Citaten die niemand ooit zei. En het klinkt allemaal echt.",
    theoryIntro:
      "**Een hallucinatie is een verzonnen feit dat echt lijkt.**\n\nDit gebeurt omdat AI woord voor woord gokt (les vorig). Soms valt zijn gok in een gat. Hij weet niet welk boek de schrijver schreef, maar hij voorspelt iets dat past bij \"boektitel van die schrijver\". Klaar. Verzonnen titel. Vaak met fake details erbij, zoals een jaartal of uitgever, om het echter te laten klinken.",
    fact:
      "Een onderzoeker vroeg AI om vijf wetenschappelijke artikelen over een bepaald onderwerp. AI gaf vijf titels, met auteurs en jaartal. Helemaal verzonnen. Niet één bestond. Maar als je niet checkt, gebruik je ze gewoon. En dat doen veel mensen.",
    sparkMiddle: "Hoe herken je een hallucinatie? Aan twee dingen.",
    theoryDeep:
      "**De twee tekens van een hallucinatie**\n\nTeken 1: AI geeft heel specifieke details (namen, jaartallen, citaten, paginanummers) bij iets dat best zeldzaam is.\nTeken 2: het klinkt te netjes. Echte info is rommelig, met bronnen en links. Verzonnen info klinkt afgerond en zelfverzekerd.\n\nRegel: hoe specifieker en netter het antwoord, hoe scherper jij moet checken. Zeker bij namen en getallen.",
    interactive: {
      kind: "tapReveal",
      prompt: "Tik op elk antwoord en zie of het waarschijnlijk een hallucinatie is.",
      reveals: [
        {
          label: "\"Volgens een artikel uit 2017 van professor Janssen over slaapgedrag bij hamsters...\"",
          reveal: "Rode vlag. Specifieke prof, specifiek jaar, zeldzaam onderwerp. Vaak verzonnen.",
        },
        {
          label: "\"Water bevriest bij 0 graden Celsius.\"",
          reveal: "Veilig. Algemeen feit dat AI honderden keren heeft gezien. Klopt.",
        },
        {
          label: "\"In hoofdstuk 7 van het boek De Stille Berg staat de zin: vrijheid is een keuze.\"",
          reveal: "Rode vlag. Specifiek hoofdstuk, citaat, zeldzaam boek. Hoge kans op hallucinatie.",
        },
        {
          label: "\"Een banaan is een vrucht.\"",
          reveal: "Veilig. Basaal feit. Geen hallucinatie.",
        },
      ],
    },
    summary: [
      "Een hallucinatie is een verzonnen feit dat echt klinkt.",
      "Hoe specifieker en netter het antwoord, hoe vaker het verzonnen kan zijn.",
      "Check altijd namen, jaartallen en citaten op één andere plek.",
    ],
    quiz: [
      {
        question: "Wat is een hallucinatie bij AI?",
        options: [
          "Een grappige fout",
          "Een verzonnen feit dat echt klinkt",
          "Een nep-foto",
          "Een trage reactie",
        ],
        correctIndex: 1,
        why: "Precies. Hij verzint iets met overtuiging.",
      },
      {
        question: "Een hallucinatie ziet er meestal rommelig en onzeker uit.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Juist netjes en zeker. Daarom moet je checken.",
      },
      {
        question: "Wat doe je bij een specifiek citaat dat AI geeft?",
        options: [
          "Direct gebruiken",
          "Vragen aan AI of het zeker is",
          "Checken in een echte bron",
          "Vergeten",
        ],
        correctIndex: 2,
        why: "Yes. AI vragen of hij zeker is, helpt niet. Hij zegt altijd ja.",
      },
    ],
    reflection: "Verzonnen feiten klinken het meest echt. Daarom check je juist die.",
  },

  {
    id: "2.3",
    worldId: 2,
    pillar: "smart",
    title: "Vraag slim: WIE-WAT-HOE",
    emoji: "🎯",
    sparkIntro:
      "In les 1.3 leerde je: VOOR WIE, WAT, HOE LANG. Mooie basis. Nu krijg je de upgrade. WIE-WAT-HOE is de profversie. Hiermee krijg je antwoorden die voelen alsof een expert ze heeft geschreven.",
    theoryIntro:
      "**WIE: geef AI een rol. WAT: precies wat je wil. HOE: in welke vorm.**\n\nVoorbeeld zonder rol: \"Leg uit wat vulkanen zijn.\"\nVoorbeeld met rol: \"Doe alsof je een aardrijkskundeleraar bent voor groep 7. Leg uit wat vulkanen zijn, in 5 korte alinea's, met aan het eind 3 weetjes.\"\n\nMet één zin meer krijg je tien keer beter antwoord. Dat is geen overdrijving.",
    fact:
      "Onderzoekers ontdekten dat dezelfde AI 20 tot 40 procent betere antwoorden geeft als je hem een rol geeft. \"Doe alsof je een arts bent.\" \"Doe alsof je een kok bent.\" Zelfs als de AI niet echt een arts is, maakt het zijn antwoorden veel preciezer.",
    sparkMiddle: "Klaar om het zelf te proberen?",
    theoryDeep:
      "**Het stappenplan**\n\n1. WIE: \"Doe alsof je een [rol] bent.\" Bijvoorbeeld: kok, leraar, sportcoach, kinderboekenschrijver, gamerecensent.\n2. WAT: zeg precies wat je wil. Uitleg, voorbeelden, een plan, een verhaal, een lijst.\n3. HOE: zeg in welke vorm. 3 alinea's, 5 bullets, één tabel, een verhaal van 200 woorden, een gedicht.\n\nGooi alles in één zin en je hebt een sterke prompt.",
    interactive: {
      kind: "promptBuilder",
      prompt: "Bouw een sterke prompt met de WIE-WAT-HOE formule.",
      slots: [
        {
          label: "WIE",
          options: [
            { text: "Doe alsof je AI bent", strong: false },
            { text: "Doe alsof je een gamerecensent bent", strong: true },
            { text: "Help me", strong: false },
          ],
        },
        {
          label: "WAT",
          options: [
            { text: "vertel iets over Minecraft", strong: false },
            { text: "leg uit waarom Minecraft zo verslavend is", strong: true },
            { text: "praat over games", strong: false },
          ],
        },
        {
          label: "HOE",
          options: [
            { text: "een beetje", strong: false },
            { text: "in 3 redenen met een voorbeeld per reden", strong: true },
            { text: "veel", strong: false },
          ],
        },
      ],
      explanation:
        "De sterke versie: 'Doe alsof je een gamerecensent bent, leg uit waarom Minecraft zo verslavend is, in 3 redenen met een voorbeeld per reden.' Profniveau prompt.",
    },
    summary: [
      "WIE: geef AI een rol. WAT: precies wat je wil. HOE: in welke vorm.",
      "Met een rol erbij wordt het antwoord vaak 20 tot 40 procent beter.",
      "Eén goede zin telt meer dan vijf vage vragen.",
    ],
    quiz: [
      {
        question: "Wat is het verschil tussen de basis (1.3) en WIE-WAT-HOE?",
        options: [
          "Niks, het is hetzelfde",
          "WIE-WAT-HOE voegt een rol toe voor AI",
          "WIE-WAT-HOE is voor volwassenen",
          "WIE-WAT-HOE is voor games",
        ],
        correctIndex: 1,
        why: "Yes. De rol is de upgrade. Daardoor wordt het antwoord scherper.",
      },
      {
        question: "Welk van deze is de sterkste prompt?",
        options: [
          "Vertel over voetbal",
          "Doe alsof je voetbalcoach bent voor groep 7. Leg uit hoe ik beter word in passen. In 4 tips.",
          "Voetbal",
          "Help met voetbal",
        ],
        correctIndex: 1,
        why: "Precies. Rol, taak, vorm. Drie sterren prompt.",
      },
      {
        question: "Een rol geven aan AI maakt geen verschil.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Een rol maakt antwoorden veel scherper.",
      },
    ],
    reflection: "Een goede prompt is een mini-supermacht. Niet iedereen weet dit nog.",
  },

  {
    id: "2.4",
    worldId: 2,
    pillar: "smart",
    title: "Dubbelcheck in 3 stappen",
    emoji: "🔍",
    sparkIntro:
      "Je weet inmiddels: AI gokt en kan hallucineren. Dus checken is belangrijk. Maar checken kost tijd. Daarom heb ik een snelle routine voor je. Drie stappen, in elkaar geklikt. Klaar in 30 seconden.",
    theoryIntro:
      "**Drie stappen, in deze volgorde.**\n\nDe meeste mensen checken gewoon één keer. Of helemaal niet. Met dit trucje doe je beter dan 95 procent. En het is niet veel werk.\n\nStap 1: vraag de bron. Stap 2: zoek het op één andere plek. Stap 3: doe de gezond-verstand-check. Als alle drie kloppen, is het waarschijnlijk goed.",
    fact:
      "Bibliotheekmedewerkers gebruiken al jaren een soortgelijke methode om feiten te checken. Ze noemen het de 3-bronnen-regel. Iets wordt pas \"waarschijnlijk waar\" als drie verschillende plekken het bevestigen. Logisch, en het werkt al sinds er kranten bestaan.",
    sparkMiddle: "We oefenen het zo direct. Maar eerst nog even goed in je hoofd planten.",
    theoryDeep:
      "**De 3 stappen uitgelegd**\n\n1. Vraag de bron. Vraag AI: \"Waar komt dit vandaan? Geef de bron.\" Soms verzint hij ook bronnen, maar vaak helpt het.\n2. Zoek op één andere plek. Google het, kijk op Wikipedia, of vraag aan een volwassene.\n3. Gezond-verstand-check. Klopt dit met wat je al weet over de wereld? Klinkt het logisch? Voelt het te mooi of te raar?\n\nDrie groene vinkjes = je kunt het gebruiken.",
    interactive: {
      kind: "dragOrder",
      prompt: "Zet de stappen van de dubbelcheck in de juiste volgorde.",
      items: [
        "Vraag de bron aan AI",
        "Zoek het op één andere plek (Wikipedia, Google, volwassene)",
        "Doe de gezond-verstand-check",
      ],
      explanation:
        "Eerst de bron checken, dan elders zoeken, dan je gevoel gebruiken. Pas als alle drie kloppen, is het veilig om te gebruiken.",
    },
    summary: [
      "Dubbelchecken hoeft niet lang te duren.",
      "Drie stappen: bron vragen, elders zoeken, gezond verstand.",
      "Alle drie groen = je kunt het gebruiken.",
    ],
    quiz: [
      {
        question: "Wat is stap 1 van de dubbelcheck?",
        options: [
          "Wikipedia openen",
          "AI vragen om de bron",
          "Je moeder vragen",
          "Het gewoon geloven",
        ],
        correctIndex: 1,
        why: "Yes. Eerst de bron. Soms verzint AI er een, maar vaak helpt het.",
      },
      {
        question: "Eén keer checken is genoeg.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Drie stappen is de norm.",
      },
      {
        question: "Wat is de gezond-verstand-check?",
        options: [
          "Een test bij de dokter",
          "Vragen of AI zeker is",
          "Voelen of het klopt met wat je al weet",
          "Even gaan zitten",
        ],
        correctIndex: 2,
        why: "Precies. Je eigen kennis is een prima detector.",
      },
    ],
    reflection: "Drie stappen, 30 seconden, geen onzin meer. Da's een goeie deal.",
  },

  {
    id: "2.5",
    worldId: 2,
    pillar: "smart",
    title: "Krachtwoorden voor betere prompts",
    emoji: "✨",
    sparkIntro:
      "Sommige woorden zijn als toverstokjes voor AI. Voeg ze toe en je antwoord verandert compleet. Vandaag krijg je vijf van die krachtwoorden. Schrijf ze op, plak ze op je bureau, gebruik ze altijd.",
    theoryIntro:
      "**De top 5 krachtwoorden**\n\n1. \"In jip-en-janneketaal\": AI maakt zijn antwoord simpel.\n2. \"Stap-voor-stap\": AI legt het in volgorde uit.\n3. \"Geef voorbeelden\": AI maakt het concreet met voorbeelden.\n4. \"Vergelijk met...\": AI gebruikt iets wat je kent om iets nieuws uit te leggen.\n5. \"Wat zou ik kunnen missen?\": AI gaat zelf kritisch denken over zijn antwoord.\n\nDeze vijf vervangen elkaar niet. Ze stapelen.",
    fact:
      "Wist je dat AI in 2023 in een test 6 procent slechter scoorde op moeilijke vragen, maar 35 procent beter als je hem zei \"denk eerst stap voor stap\"? Eén krachtwoord toegevoegd, totaal andere prestatie. Letterlijk.",
    sparkMiddle: "Tijd om ze te oefenen. Welke past bij welke situatie?",
    theoryDeep:
      "**Hoe je ze combineert**\n\nVoorbeeld: \"Doe alsof je leraar bent. Leg fotosynthese uit in jip-en-janneketaal, stap-voor-stap, met 2 voorbeelden uit het echte leven. En zeg aan het eind wat ik mogelijk nog mis.\"\n\nVijf krachtwoorden in één prompt. Dat geeft je een antwoord dat helder is, in volgorde, concreet, herkenbaar én eerlijk over wat je nog mist. Profniveau.",
    interactive: {
      kind: "tapReveal",
      prompt: "Tik elk krachtwoord aan en zie wanneer je het gebruikt.",
      reveals: [
        {
          label: "\"In jip-en-janneketaal\"",
          reveal: "Voor lastige onderwerpen. AI maakt het simpel zonder moeilijke woorden.",
        },
        {
          label: "\"Stap-voor-stap\"",
          reveal: "Voor uitleg, recepten, hoe-dingen-werken. Volgorde is dan duidelijk.",
        },
        {
          label: "\"Geef voorbeelden\"",
          reveal: "Als iets abstract is. Voorbeelden maken het concreet en blijven hangen.",
        },
        {
          label: "\"Vergelijk met...\"",
          reveal: "Voor nieuwe onderwerpen. Vergelijk met games, dieren, of dingen die jij kent.",
        },
        {
          label: "\"Wat zou ik kunnen missen?\"",
          reveal: "Aan het eind. AI gaat nadenken over wat hij vergeten is. Vangt fouten af.",
        },
      ],
    },
    summary: [
      "Vijf krachtwoorden veranderen je antwoorden compleet.",
      "Ze werken samen. Combineer er gerust drie of vier in één prompt.",
      "\"Stap-voor-stap\" alleen al maakt AI veel slimmer.",
    ],
    quiz: [
      {
        question: "Welk krachtwoord helpt voor moeilijke onderwerpen?",
        options: [
          "Geef voorbeelden",
          "Sneller graag",
          "In jip-en-janneketaal",
          "Met humor",
        ],
        correctIndex: 2,
        why: "Yes. Jip-en-janneketaal = simpel zonder moeilijke woorden.",
      },
      {
        question: "Wat doet \"wat zou ik kunnen missen?\"",
        options: [
          "AI verzint nieuwe info",
          "AI denkt kritisch over zijn eigen antwoord",
          "AI maakt het korter",
          "AI praat sneller",
        ],
        correctIndex: 1,
        why: "Precies. AI checkt zichzelf. Vangt veel fouten af.",
      },
      {
        question: "Je kunt maar één krachtwoord per prompt gebruiken.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Stapel ze juist. Hoe meer, hoe scherper.",
      },
    ],
    reflection: "Krachtwoorden zijn gratis maar werken als magie. Gebruik ze.",
  },

  {
    id: "2.6",
    worldId: 2,
    pillar: "smart",
    title: "AI zegt iets raars: nu wat?",
    emoji: "🔄",
    sparkIntro:
      "Soms geeft AI een antwoord waarvan je denkt: hè? Dat is niet wat ik bedoelde. Of: dit klopt niet. Of: dit is te lang. Geen probleem. AI is geen eenmalige machine. Je kunt hem bijsturen. Hier zijn de tools.",
    theoryIntro:
      "**Je hoeft niet opnieuw te beginnen.**\n\nVeel mensen denken: dit antwoord klopt niet, ik typ mijn vraag opnieuw. Niet nodig. AI onthoudt je gesprek (in dat tabblad) en je kunt gewoon zeggen wat je anders wil. Dat heet bijsturen. Dat is sneller en geeft betere resultaten dan steeds opnieuw beginnen.",
    fact:
      "Veel mensen typen hun vraag wel 5 of 6 keer opnieuw als het antwoord niet meteen klopt. Onderzoek laat zien dat bijsturen sneller is en bijna altijd betere antwoorden geeft. Vooral als je AI vertelt wát er niet goed was.",
    sparkMiddle: "Welke zinnen werken het beste om bij te sturen?",
    theoryDeep:
      "**De 4 bijstuur-zinnen**\n\n1. \"Korter graag, in maximaal 3 zinnen.\" Voor als het te lang is.\n2. \"Leg het simpeler uit, voor iemand van 10.\" Voor als het te moeilijk is.\n3. \"Check je antwoord. Klopt dit echt?\" Voor als je twijfelt aan een feit.\n4. \"Geef een voorbeeld uit het echte leven.\" Voor als het te abstract is.\n\nDeze vier zinnen lossen 80 procent van alle slechte antwoorden op.",
    interactive: {
      kind: "multiChoice",
      question:
        "AI geeft een super lang, ingewikkeld antwoord over hoe je hond te trainen, met veel moeilijke woorden. Wat type je terug?",
      options: [
        { label: "Bedankt!", correct: false },
        { label: "Leg het simpeler uit voor iemand van 10, in 3 korte stappen.", correct: true },
        { label: "Nieuwe vraag: hoe train je een hond?", correct: false },
        { label: "Ik snap het niet.", correct: false },
      ],
      explanation:
        "Antwoord 2 is bijsturen op zijn best. Je zegt wát er moet veranderen (simpeler, korter, stappen). AI gebruikt zijn eerdere antwoord en past het aan.",
    },
    summary: [
      "Als een antwoord niet klopt, hoef je niet opnieuw te beginnen.",
      "Stuur AI bij met een korte zin: korter, simpeler, met voorbeeld, check.",
      "Vier zinnen lossen de meeste problemen op.",
    ],
    quiz: [
      {
        question: "AI geeft een te lang antwoord. Wat type je?",
        options: [
          "Stop",
          "Korter graag, in 3 zinnen",
          "Begin opnieuw",
          "Niks, ik zoek het zelf wel uit",
        ],
        correctIndex: 1,
        why: "Yes. Heel kort, heel duidelijk. AI past het aan.",
      },
      {
        question: "Als AI iets raars zegt, moet je altijd opnieuw beginnen.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Bijsturen is sneller en geeft betere antwoorden.",
      },
      {
        question: "Welke bijstuur-zin werkt het beste bij abstracte antwoorden?",
        options: [
          "Korter graag",
          "Geef een voorbeeld uit het echte leven",
          "Ik snap je niet",
          "Stop maar",
        ],
        correctIndex: 1,
        why: "Voorbeelden uit het echte leven maken abstracte dingen meteen begrijpelijk.",
      },
    ],
    reflection: "Een gesprek met AI is een gesprek, geen quiz. Je mag terugpraten.",
  },

  {
    id: "2.7",
    worldId: 2,
    pillar: "smart",
    title: "Verschillende AI's, verschillende sterktes",
    emoji: "🎨",
    sparkIntro:
      "ChatGPT. Gemini. Claude. Midjourney. DALL-E. Suno. Allemaal AI's, maar ze kunnen niet hetzelfde. Net als sportclubs: je gaat niet naar de voetbalclub om te leren zwemmen. Vandaag leer ik je welke AI je voor wat pakt.",
    theoryIntro:
      "**AI's zijn gespecialiseerd.**\n\nDe AI's die je het meest tegenkomt zijn er drie soorten:\n\n1. **Tekst-AI's** zoals ChatGPT, Claude, Gemini. Goed voor: vragen beantwoorden, schrijven, uitleggen, ideeën verzinnen.\n2. **Beeld-AI's** zoals Midjourney, DALL-E. Goed voor: plaatjes maken op basis van een beschrijving.\n3. **Audio-AI's** zoals Suno of ElevenLabs. Goed voor: muziek of stemmen maken.\n\nElk is goed in zijn ding, maar slecht buiten zijn vakgebied.",
    fact:
      "Een tekst-AI vragen om een plaatje te tekenen werkte vroeger helemaal niet. Tegenwoordig kunnen sommige tekst-AI's ook plaatjes. Maar de gespecialiseerde beeld-AI's blijven beter in plaatjes maken. Net als bij mensen: een specialist verslaat een generalist op zijn eigen terrein.",
    sparkMiddle: "Welke AI pak je voor welke klus?",
    theoryDeep:
      "**Kies-je-AI gids**\n\nWil je iets uitgelegd hebben, een verhaal schrijven, of hulp met je werkstuk? Tekst-AI.\nWil je een poster, een tekening, een logo voor je game-team? Beeld-AI.\nWil je een liedje voor de verjaardag van je opa, of een grappige stem voor een TikTok? Audio-AI.\n\nGouden regel: gebruik de specialist voor zijn specialiteit. Niet de tekst-AI voor je tekening, niet de beeld-AI voor je werkstuk.",
    interactive: {
      kind: "sortBuckets",
      prompt: "Welke AI heb je nodig voor welke klus?",
      buckets: ["💬 Tekst-AI", "🎨 Beeld-AI"],
      items: [
        { label: "Een spreekbeurt voorbereiden over walvissen", bucket: 0 },
        { label: "Een poster maken voor je verjaardagsfeestje", bucket: 1 },
        { label: "Een verhaaltje schrijven over een ridder", bucket: 0 },
        { label: "Een tekening van een draak in een berg", bucket: 1 },
        { label: "Een rekenuitleg krijgen over breuken", bucket: 0 },
        { label: "Een logo voor je gameteam", bucket: 1 },
      ],
    },
    summary: [
      "Tekst-AI's zijn voor lezen, schrijven, uitleg en ideeën.",
      "Beeld-AI's zijn voor plaatjes, tekeningen en posters.",
      "Audio-AI's zijn voor muziek en stemmen.",
    ],
    quiz: [
      {
        question: "Voor welke klus gebruik je een beeld-AI?",
        options: [
          "Je werkstuk schrijven",
          "Een poster maken",
          "Sommen uitleggen",
          "Een gedicht maken",
        ],
        correctIndex: 1,
        why: "Yes. Beeld-AI is voor plaatjes en posters.",
      },
      {
        question: "Een tekst-AI is even goed in plaatjes maken als een beeld-AI.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Specialisten zijn beter op hun gebied.",
      },
      {
        question: "Welke klus past bij een audio-AI?",
        options: [
          "Een logo maken",
          "Een liedje voor opa's verjaardag",
          "Een werkstuk schrijven",
          "Een poster voor school",
        ],
        correctIndex: 1,
        why: "Yes. Muziek en stemmen = audio-AI.",
      },
    ],
    reflection: "Het juiste gereedschap voor de juiste klus. Geldt voor tools, geldt voor AI.",
  },

  {
    id: "2.8",
    worldId: 2,
    pillar: "smart",
    title: "Wereld 2 Baas-test",
    emoji: "🧠",
    bossTest: true,
    sparkIntro:
      "Wereld 2 zit er bijna op. Je weet nu hoe AI antwoorden bouwt, hoe hij gokt, wanneer hij hallucineert, en hoe je betere vragen stelt. Tijd om al die kennis op één hoop te gooien. Drie tricky scenario's. Geen makkelijke. Maar dat is goed: nu zie je hoe ver je bent gekomen.",
    theoryIntro:
      "**Even snel: wat je nu weet.**\n\nAI gokt woord voor woord. Hij hallucineert vooral bij zeldzame onderwerpen. Met WIE-WAT-HOE krijg je veel betere antwoorden. Krachtwoorden zoals \"stap-voor-stap\" en \"in jip-en-janneketaal\" maken antwoorden helderder. Bijsturen is sneller dan opnieuw beginnen. En de juiste AI voor de juiste klus.",
    fact:
      "Mensen die deze kennis hebben, gebruiken AI gemiddeld twee tot drie keer effectiever dan mensen zonder deze kennis. Zelfde tool, totaal andere resultaten. Jij hoort vanaf nu bij de eerste groep.",
    sparkMiddle: "Hier komt-ie. Rustig lezen. Denken. Dan kiezen.",
    theoryDeep:
      "**Reminder voor de test**\n\nDe goede antwoorden hieronder zijn niet altijd de \"makkelijkste\" of \"vriendelijkste\" optie. Ze zijn wel de slimste. Vraag jezelf bij elke optie: gebruik ik wat ik geleerd heb? Stel ik de goede vraag? Check ik mijn info?",
    interactive: {
      kind: "promptBuilder",
      prompt:
        "Maak de slimst mogelijke prompt om hulp te vragen bij een werkstuk over olifanten voor groep 7.",
      slots: [
        {
          label: "WIE",
          options: [
            { text: "Hoi AI", strong: false },
            { text: "Doe alsof je een bioloog bent die kinderen lesgeeft", strong: true },
            { text: "Beste AI", strong: false },
          ],
        },
        {
          label: "WAT",
          options: [
            { text: "vertel iets over olifanten", strong: false },
            { text: "schrijf een werkstuk over olifanten voor groep 7", strong: true },
            { text: "wat zijn olifanten", strong: false },
          ],
        },
        {
          label: "HOE",
          options: [
            { text: "in 4 alinea's met 1 weetje per alinea, en eindig met wat ik nog moet checken", strong: true },
            { text: "veel info", strong: false },
            { text: "best snel graag", strong: false },
          ],
        },
      ],
      explanation:
        "De sterke prompt heeft: rol (bioloog), taak (werkstuk groep 7), vorm (4 alinea's), krachtwoord (weetje per alinea) én een eigen-check-trigger (wat moet ik checken). Topprompt.",
    },
    summary: [
      "Een goede prompt voelt als een opdracht aan een specialist.",
      "Check altijd zelfverzekerde feiten, vooral bij zeldzame onderwerpen.",
      "Krachtwoorden zijn gratis. Gebruik ze.",
    ],
    quiz: [
      {
        question:
          "AI vertelt je dat er in 1832 een schrijver Karel Brouwer was die een beroemd boek over wolven schreef. Wat doe je?",
        options: [
          "Geloven, klinkt overtuigend",
          "Wenkbrauw-check + zoek op Wikipedia of de schrijver echt bestond",
          "Vragen aan AI of hij zeker is",
          "In je werkstuk zetten",
        ],
        correctIndex: 1,
        why: "Yes. Specifieke naam + specifiek jaar + zeldzaam onderwerp = grote kans op hallucinatie.",
      },
      {
        question:
          "Je antwoord is te lang en moeilijk. Wat is de snelste oplossing?",
        options: [
          "Opnieuw beginnen met dezelfde vraag",
          "Typen: 'Korter, in jip-en-janneketaal, 3 zinnen'",
          "Stoppen met AI",
          "Vragen aan een vriend",
        ],
        correctIndex: 1,
        why: "Precies. Bijsturen, niet opnieuw. Met krachtwoorden.",
      },
      {
        question: "Welke AI gebruik je om een logo voor je gameteam te maken?",
        options: [
          "Tekst-AI",
          "Beeld-AI",
          "Audio-AI",
          "Maakt niet uit",
        ],
        correctIndex: 1,
        why: "Beeld-AI. Specialist voor zijn vakgebied.",
      },
    ],
    reflection: "Je bent nu officieel slim met AI. Door naar de laatste wereld: sterker worden.",
  },

  // ============================================================
  //  WERELD 3 — STERKER
  // ============================================================

  {
    id: "3.1",
    worldId: 3,
    pillar: "stronger",
    title: "Tutor of sluiproute? Jij kiest",
    emoji: "🎓",
    sparkIntro:
      "Welkom in wereld 3. De moeilijkste én leukste. Hier leer je iets dat veel volwassenen niet doorhebben. AI kan je sneller laten leren of juist dommer maken. En het verschil zit niet in de AI. Het zit in jou.",
    theoryIntro:
      "**Twee manieren om AI te gebruiken.**\n\nManier 1, de sluiproute: AI doet je huiswerk. Jij plakt het in. Klaar. Resultaat: je leert niks. Volgende toets ga je nat. En je hersens worden minder scherp omdat ze geen oefening krijgen.\n\nManier 2, de tutor: AI legt uit hoe iets werkt. Jij doet het zelf. Resultaat: je leert sneller dan klasgenoten en het blijft hangen.",
    fact:
      "Onderzoekers in Amerika lieten twee groepen leerlingen sommen oefenen. Groep A liet AI alle antwoorden geven. Groep B liet AI alleen uitleggen. Op de toets daarna deed groep B 50 procent beter. Zelfde AI, andere manier van gebruiken, gigantisch verschil.",
    sparkMiddle: "Hoe kies je voor de tutor-manier? Hier is mijn check.",
    theoryDeep:
      "**De tutor-check**\n\nVoordat je AI iets vraagt, beantwoord dit: \"Wil ik dat hij het voor me doet, of wil ik leren hoe het werkt?\" Bij \"voor me doen\" ben je de sluiproute aan het nemen. Bij \"leren hoe\" gebruik je AI als tutor.\n\nTutor-vragen klinken zo: \"Leg uit hoe.\" \"Geef me een hint.\" \"Wat is de eerste stap?\" \"Waar moet ik op letten?\"\nSluiproute-vragen klinken zo: \"Geef me het antwoord.\" \"Doe het voor me.\"",
    interactive: {
      kind: "sortBuckets",
      prompt: "Welke vraag is een tutor-vraag en welke is een sluiproute?",
      buckets: ["🎓 Tutor-manier", "🏃 Sluiproute"],
      items: [
        { label: "Leg uit hoe ik een goede zin begin", bucket: 0 },
        { label: "Schrijf mijn werkstuk over honden", bucket: 1 },
        { label: "Wat is de eerste stap bij staartdelen?", bucket: 0 },
        { label: "Geef het antwoord van som 5", bucket: 1 },
        { label: "Wat zijn 3 tips om beter te onthouden?", bucket: 0 },
        { label: "Maak mijn spreekbeurt voor me", bucket: 1 },
      ],
    },
    summary: [
      "AI is een tutor óf een sluiproute. Jij kiest welke.",
      "Tutor = AI legt uit, jij doet het. Resultaat: je leert sneller.",
      "Sluiproute = AI doet het, jij plakt in. Resultaat: je leert niks.",
    ],
    quiz: [
      {
        question: "Welke vraag is de tutor-manier?",
        options: [
          "Doe het voor me",
          "Leg uit hoe ik het zelf kan doen",
          "Geef me het antwoord",
          "Maak het af",
        ],
        correctIndex: 1,
        why: "Yes. Leg uit hoe = jij doet het zelf, AI helpt je. Da's leren.",
      },
      {
        question: "De sluiproute helpt je beter scoren op toetsen.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Op toetsen mag geen AI mee. Je hebt niks geleerd.",
      },
      {
        question: "Wat is de tutor-check?",
        options: [
          "Vraag jezelf: wil ik dat AI het doet, of wil ik leren hoe?",
          "Vraag AI of hij een tutor is",
          "Een test op school",
          "Een soort wachtkamer",
        ],
        correctIndex: 0,
        why: "Precies. Eén vraag aan jezelf bepaalt of je leert of niet.",
      },
    ],
    reflection: "Jij hebt de keuze. AI is maar een tool. Jouw hersens zijn de echte kracht.",
  },

  {
    id: "3.2",
    worldId: 3,
    pillar: "stronger",
    title: "Brainstormen zonder kopiëren",
    emoji: "💡",
    sparkIntro:
      "Stel: je moet een spreekbeurt geven en je weet niet waarover. Of: je moet een verhaal schrijven en je hebt geen idee. AI is geweldig voor brainstormen. Maar er is een trucje om te zorgen dat het jouw werk blijft, niet dat van AI.",
    theoryIntro:
      "**Brainstormen is geen kopiëren.**\n\nBrainstormen betekent: ideeën verzamelen om uit te kiezen. AI geeft je 10 ideeën. Jij pakt er één. Dan maak jij het verder af. Dat is jouw werk, met AI als spiegel.\n\nKopiëren betekent: AI's idee letterlijk overnemen. Dat is niet jouw werk. En ook nog eens makkelijk te herkennen door leraren.",
    fact:
      "Schrijvers, ontwerpers en programmeurs gebruiken al jaren brainstormtechnieken zoals \"10 slechte ideeën\". Eerst veel ideeën, ook hele rare, daarna kiezen en doorwerken. Het brein werkt nou eenmaal beter met massa dan met perfectie. AI is hier perfect voor.",
    sparkMiddle: "Hoe doe je dit zelf? Stappenplan komt eraan.",
    theoryDeep:
      "**Het brainstorm-stappenplan**\n\n1. Vraag AI om 10 ideeën, niet 1. Bijvoorbeeld: \"Geef 10 onderwerpen voor een spreekbeurt over een dier.\"\n2. Kies één idee dat jou aanspreekt. Niet het beste. Het meest jouw stijl.\n3. Vraag AI niet om het uit te werken. Doe het zelf.\n4. Als je vastloopt, vraag een hint. Niet het hele antwoord.\n\nResultaat: een werkstuk dat 100% van jou is, maar je had wel hulp bij het beginnen. Da's eerlijk.",
    interactive: {
      kind: "multiChoice",
      question:
        "Je moet een verhaal schrijven over een gestrande astronaut. Je weet niet hoe te beginnen. Wat doe je?",
      options: [
        { label: "AI vragen: 'Schrijf een verhaal over een gestrande astronaut'", correct: false },
        {
          label: "AI vragen: 'Geef me 5 spannende beginzinnen voor een verhaal over een gestrande astronaut'",
          correct: true,
        },
        { label: "Direct kopiëren wat een vriend heeft geschreven", correct: false },
        { label: "Niks doen, geen zin meer", correct: false },
      ],
      explanation:
        "Optie 2 is perfect. Je gebruikt AI om los te komen, kiest één beginzin die jou aanspreekt, en schrijft het verhaal zelf verder. Brainstormen op zijn best.",
    },
    summary: [
      "Brainstormen = ideeën verzamelen, niet kopiëren.",
      "Vraag AI om veel ideeën (10), kies er één, werk hem zelf uit.",
      "Hint vragen mag. Het hele antwoord laten doen niet.",
    ],
    quiz: [
      {
        question: "Wat is de eerste stap bij brainstormen met AI?",
        options: [
          "Het antwoord vragen",
          "10 ideeën vragen",
          "AI laten kiezen",
          "Niks doen",
        ],
        correctIndex: 1,
        why: "Yes. Eerst veel ideeën. Dan kiezen. Dan zelf uitwerken.",
      },
      {
        question: "Brainstormen met AI is hetzelfde als kopiëren.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Brainstormen is ideeën verzamelen. Kopiëren is overnemen.",
      },
      {
        question: "Mag je AI om een hint vragen?",
        options: [
          "Nee, dat is altijd valsspelen",
          "Ja, een hint is prima",
          "Alleen op donderdag",
          "Alleen bij sommen",
        ],
        correctIndex: 1,
        why: "Een hint is leren. Het hele antwoord laten doen is kopiëren.",
      },
    ],
    reflection: "AI geeft je de vonk. Jij maakt het vuur. Da's de juiste verdeling.",
  },

  {
    id: "3.3",
    worldId: 3,
    pillar: "stronger",
    title: "AI als uitleg-maatje",
    emoji: "📚",
    sparkIntro:
      "Soms snap je iets gewoon niet. Zelfs als de leraar het drie keer uitlegt. Geeft niks. Iedereen heeft dat. AI is hierin een geheim wapen, want je kunt 1000 keer vragen \"leg het anders uit\" en AI wordt niet boos.",
    theoryIntro:
      "**AI heeft geen geduld. Niks kost hem moeite.**\n\nDat is goud waard. Want voor sommige onderwerpen heb je meer dan één uitleg nodig. Sommige mensen leren via voorbeelden, anderen via tekeningen, anderen via vergelijkingen. AI past zich aan jou aan, als jij hem dat vraagt.",
    fact:
      "Een leraar in Nederland deelde dat haar leerlingen die AI gebruikten als uitleg-maatje hun cijfers gemiddeld met een halve punt zagen stijgen. Vooral leerlingen die zich in de klas niet durfden te melden voor extra uitleg, hadden er veel aan.",
    sparkMiddle: "Hoe vraag je het beste om uitleg?",
    theoryDeep:
      "**De drie uitleg-verzoeken**\n\n1. \"Leg het uit alsof ik 8 ben.\" Voor als het te moeilijk is. AI gaat van docent naar speelmaatje.\n2. \"Leg het uit met een voorbeeld uit Minecraft (of een ander spel).\" Vergelijking met iets dat jij kent.\n3. \"Maak een tekening in tekst.\" Klinkt raar, maar AI kan met letters een soort schema maken.\n\nProbeer alle drie als je iets niet snapt. Eentje werkt altijd.",
    interactive: {
      kind: "tapReveal",
      prompt: "Tik elk uitleg-verzoek aan en zie wanneer je het gebruikt.",
      reveals: [
        {
          label: "\"Leg het uit alsof ik 8 ben\"",
          reveal: "Voor moeilijke onderwerpen. AI haalt jargon weg en maakt het simpel.",
        },
        {
          label: "\"Vergelijk het met Minecraft\"",
          reveal: "Voor abstracte dingen. Vergelijking met iets bekends maakt het tastbaar.",
        },
        {
          label: "\"Maak een tekening in tekst\"",
          reveal: "Voor zaken die je beter visueel ziet. AI maakt een schema van pijlen en woorden.",
        },
        {
          label: "\"Leg het stap-voor-stap uit\"",
          reveal: "Voor processen of recepten. AI maakt het in volgorde.",
        },
      ],
    },
    summary: [
      "AI heeft geen geduld. Vraag het 10 keer, dat geeft niks.",
      "Drie uitleg-trucs: \"alsof ik 8 ben\", vergelijking, tekening in tekst.",
      "Werkt eentje niet? Probeer de volgende.",
    ],
    quiz: [
      {
        question: "Wat doet \"leg het uit alsof ik 8 ben\"?",
        options: [
          "AI praat als een kind",
          "AI maakt zijn uitleg veel simpeler zonder moeilijke woorden",
          "AI praat heel langzaam",
          "AI weigert te antwoorden",
        ],
        correctIndex: 1,
        why: "Precies. Eenvoudig en zonder jargon. Snap je het meteen.",
      },
      {
        question: "Je mag AI maar één keer om uitleg vragen.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. 1000 keer mag. AI heeft geen geduld, dus jij ook niet.",
      },
      {
        question:
          "Je snapt iets niet over schaduwen. Wat is de beste prompt?",
        options: [
          "Vertel iets over schaduwen",
          "Schaduwen",
          "Leg uit hoe schaduwen werken, vergelijk het met Minecraft, in 3 stappen",
          "Hoe?",
        ],
        correctIndex: 2,
        why: "Yes. Onderwerp + vergelijking + vorm. Topprompt voor uitleg.",
      },
    ],
    reflection: "AI is de meest geduldige tutor ter wereld. Vraag totdat je het snapt.",
  },

  {
    id: "3.4",
    worldId: 3,
    pillar: "stronger",
    title: "AI als oefen-maatje",
    emoji: "📝",
    sparkIntro:
      "Toets aankomen? AI is je beste oefen-maatje. Hij maakt oneindig veel oefenvragen, overhoort je, geeft hints en zegt nooit \"verveel me niet\". De truc is wel: vraag het goed.",
    theoryIntro:
      "**AI maakt oefenmateriaal op maat.**\n\nVoorbeeld: morgen heb je topo over Europese hoofdsteden. Vraag AI: \"Maak een quiz van 10 vragen over hoofdsteden van Europese landen. Geef me eerst de vragen, daarna na elke antwoord meteen of het goed was.\"\n\nNu heb je je eigen overhoor-tool. Onbeperkt vragen. Op jouw niveau.",
    fact:
      "Een 12-jarige in Engeland gebruikte AI om elke avond 15 minuten te oefenen voor zijn taaltoets. Zijn moeder vertelde dat zijn cijfer in 4 weken steeg van een onvoldoende naar een 8. Geen magie, gewoon vaak oefenen op de juiste manier.",
    sparkMiddle: "Welke oefen-formats zijn het sterkst?",
    theoryDeep:
      "**Drie oefen-formats**\n\n1. Quiz: \"Maak een quiz van 10 vragen over [onderwerp]. Geef hints als ik vastloop.\"\n2. Overhoor-mode: \"Stel mij vragen over [onderwerp] alsof je mijn leraar bent. Eén per keer. Niet meteen het antwoord geven.\"\n3. Uitleg-eerst-quiz-daarna: \"Leg [onderwerp] eerst kort uit. Geef me daarna 5 vragen om te kijken of ik het snap.\"\n\nDe overhoor-mode is het sterkst. Daar moet je echt nadenken, niet alleen herkennen.",
    interactive: {
      kind: "multiChoice",
      question:
        "Je hebt morgen een toets over de planeten. Wat is de slimste prompt om mee te oefenen?",
      options: [
        { label: "Geef me alle info over de planeten", correct: false },
        {
          label: "Overhoor mij over de planeten. Eén vraag per keer. Niet meteen het antwoord, eerst hint geven als ik vastloop.",
          correct: true,
        },
        { label: "Wat zijn planeten?", correct: false },
        { label: "Schrijf mijn toets voor me", correct: false },
      ],
      explanation:
        "Optie 2 is perfect. Actief oefenen, één vraag per keer, hints in plaats van antwoorden. Je hersens werken. Klaar voor de toets.",
    },
    summary: [
      "AI is de perfecte oefen-tutor. Onbeperkt, op jouw niveau.",
      "Het sterkste format: overhoor-mode, één vraag per keer.",
      "Hints vragen is leren. Antwoord vragen is herkennen, dat plakt minder.",
    ],
    quiz: [
      {
        question: "Welk oefen-format is het sterkst?",
        options: [
          "Lezen wat AI schrijft",
          "AI laten zien hoe iets werkt",
          "Overhoor-mode waar AI vragen stelt en hints geeft",
          "Een filmpje kijken",
        ],
        correctIndex: 2,
        why: "Yes. Actief oefenen verslaat passief lezen altijd.",
      },
      {
        question: "AI verveelt zich als je hem 30 vragen laat maken.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. AI heeft geen geduld én geen verveling. Maak zoveel quizjes als je wil.",
      },
      {
        question: "Wat is beter: AI laat zien hoe een som werkt, of AI laat je het zelf oefenen?",
        options: [
          "Laten zien",
          "Zelf oefenen",
          "Maakt niet uit",
          "Allebei tegelijk",
        ],
        correctIndex: 1,
        why: "Zelf oefenen wint. Lezen voelt makkelijk, doen blijft hangen.",
      },
    ],
    reflection: "Oefenen met AI verslaat passief lezen. Vooral 15 minuten per dag. Klein, vaak, sterk.",
  },

  {
    id: "3.5",
    worldId: 3,
    pillar: "stronger",
    title: "Maak iets eigens met AI",
    emoji: "🎨",
    sparkIntro:
      "Tot nu toe gebruikten we AI om te leren, te checken, te oefenen. Maar AI kan ook gewoon leuk zijn. Iets maken dat helemaal van jou is. Een verhaaltje voor je broertje, een gedicht voor je oma, een recept dat niemand anders heeft. Vandaag pak je AI om te maken.",
    theoryIntro:
      "**Maken is anders dan kopiëren.**\n\nKopiëren: AI maakt iets, jij plakt het in. Maken: jij hebt een idee, AI helpt je het waar te maken, jij past het aan totdat het echt van jou is.\n\nDe truc zit in het aanpassen. Een AI-gedicht direct kopiëren is plat. Maar als je drie versies vraagt, je favoriete zinnen mixt en zelf één eigen regel toevoegt, wordt het echt van jou.",
    fact:
      "Kinderboekenschrijvers en muzikanten gebruiken AI tegenwoordig vaak als startpunt. Geen één publiceert iets dat AI direct heeft gemaakt. Ze gebruiken AI om los te komen, dan herschrijven ze het 5 of 6 keer. Het eindresultaat is altijd menselijk werk, met een vonk van AI aan het begin.",
    sparkMiddle: "Hoe maak jij iets dat echt van jou is?",
    theoryDeep:
      "**Het maak-stappenplan**\n\n1. Vertel AI je idee. \"Ik wil een grappig gedicht over mijn poes Spikkel die altijd in dozen klimt.\"\n2. Vraag 3 verschillende versies. \"Geef me 3 verschillende versies, in verschillende stijlen.\"\n3. Pak van elke versie de beste zinnen.\n4. Voeg er minimaal één eigen zin aan toe.\n5. Laat AI niks meer aanpassen. Klaar = klaar.\n\nResultaat: 70% jouw smaak, 30% AI als startmotor. Da's een prima verhouding.",
    interactive: {
      kind: "dragOrder",
      prompt: "Zet de stappen van iets-maken-met-AI in de juiste volgorde.",
      items: [
        "Vertel AI je idee duidelijk",
        "Vraag 3 verschillende versies",
        "Pak de beste zinnen uit elke versie",
        "Voeg minimaal één eigen zin toe",
        "Klaar = klaar, niet meer laten aanpassen",
      ],
      explanation:
        "Eerst idee, dan veel versies, dan kiezen, dan jouw eigen touch, dan stoppen. Vooral die laatste stap is belangrijk. Anders wordt het weer een AI-product.",
    },
    summary: [
      "Maken met AI = jij de regie, AI als startmotor.",
      "Vraag meerdere versies. Mix de beste zinnen. Voeg iets eigens toe.",
      "Stop op het juiste moment. Anders wordt het weer plat.",
    ],
    quiz: [
      {
        question: "Wat is het belangrijkste verschil tussen kopiëren en maken?",
        options: [
          "Bij maken zit jouw smaak en keuze er in",
          "Bij maken is het langer",
          "Bij maken is het korter",
          "Er is geen verschil",
        ],
        correctIndex: 0,
        why: "Yes. Jouw smaak maakt het van jou.",
      },
      {
        question: "Je vraagt het beste meteen om 1 perfecte versie van AI.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Vraag meerdere versies. Daaruit kies en mix je.",
      },
      {
        question: "Wat is de laatste stap?",
        options: [
          "Nog 10 keer laten aanpassen",
          "Klaar = klaar, niet meer laten aanpassen",
          "AI weggooien",
          "Aan iemand laten lezen",
        ],
        correctIndex: 1,
        why: "Klaar = klaar. Zo blijft het van jou.",
      },
    ],
    reflection: "Iets maken voelt anders dan iets kopiëren. Probeer het. Je merkt het meteen.",
  },

  {
    id: "3.6",
    worldId: 3,
    pillar: "stronger",
    title: "AI bij rekenen: vraag de weg",
    emoji: "➗",
    sparkIntro:
      "Hier komt iets raars. AI is gemaakt van miljarden zinnen, maar in rekenen is hij vaak slecht. Vraag hem 137 keer 248 en hij gokt. Letterlijk. Dus hoe gebruik je AI dan slim bij rekenen? Niet voor het antwoord. Wel voor de weg.",
    theoryIntro:
      "**AI is slecht in cijfers, goed in uitleggen.**\n\nDat klinkt gek, maar het klopt. Hij voorspelt woorden, niet cijfers. Soms krijgt hij het rekenwerk per ongeluk goed, vaak ook niet. Maar uitleggen hoe je een som aanpakt? Daar is hij top in. Want dat is woorden, en woorden is zijn ding.",
    fact:
      "Onderzoekers gaven dezelfde AI honderden rekensommen. Bij eenvoudige sommen (tafels, optellen) had hij meer dan 90% goed. Bij langere of moeilijke sommen zakte dat naar onder de 50%. Maar als hij eerst de stappen moest uitleggen voor hij rekende, ging zijn score weer omhoog.",
    sparkMiddle: "Dus wat doe jij? Vraag de weg, niet het antwoord.",
    theoryDeep:
      "**De wegwijs-formule voor rekenen**\n\nNiet: \"Wat is 264 gedeeld door 8?\"\nWel: \"Leg uit hoe ik 264 gedeeld door 8 aanpak. Geef me de stappen. Ik wil het zelf doen.\"\n\nNu krijg je een mini-rekenles. Jij doet het rekenwerk, AI is de coach. Bonus: nu leer je het echt, in plaats van een antwoord te krijgen dat misschien zelfs nog fout is. Want ja, dat kan dus echt bij AI.",
    interactive: {
      kind: "promptBuilder",
      prompt: "Bouw de slimste prompt voor hulp bij staartdelingen.",
      slots: [
        {
          label: "VRAAG OF WEG?",
          options: [
            { text: "Wat is 432 gedeeld door 6", strong: false },
            { text: "Leg uit hoe ik 432 gedeeld door 6 aanpak", strong: true },
            { text: "Geef me het antwoord", strong: false },
          ],
        },
        {
          label: "DETAIL",
          options: [
            { text: "stap voor stap", strong: true },
            { text: "snel", strong: false },
            { text: "met veel woorden", strong: false },
          ],
        },
        {
          label: "ROL VAN JOU",
          options: [
            { text: "ik doe het zelf", strong: true },
            { text: "AI doet het", strong: false },
            { text: "we doen samen", strong: false },
          ],
        },
      ],
      explanation:
        "De sterke prompt: 'Leg uit hoe ik 432 gedeeld door 6 aanpak, stap voor stap. Ik doe het zelf.' Nu krijg je de weg, niet het antwoord. En je leert echt rekenen.",
    },
    summary: [
      "AI is slecht in zelf rekenen, goed in uitleggen hoe je rekent.",
      "Vraag de weg, niet het antwoord.",
      "Bonus: zo voorkom je ook dat AI je een fout antwoord geeft.",
    ],
    quiz: [
      {
        question: "Waarom is AI vaak slecht in rekenen?",
        options: [
          "Hij is lui",
          "Hij voorspelt woorden, geen cijfers",
          "Hij wil niet",
          "Hij kan het wel maar zegt het niet",
        ],
        correctIndex: 1,
        why: "Yes. Hij gokt op woorden. Cijfers zijn lastiger voor hem.",
      },
      {
        question: "Het is slim om AI naar het antwoord van een som te vragen.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Vraag de weg. Zo leer je en voorkom je foute antwoorden.",
      },
      {
        question: "Welke prompt is het beste?",
        options: [
          "Wat is 96 gedeeld door 4",
          "Leg uit hoe ik 96 gedeeld door 4 aanpak, stap voor stap",
          "96 / 4",
          "Hulp",
        ],
        correctIndex: 1,
        why: "Perfect. Weg + stap voor stap + jij doet het. Echt leren.",
      },
    ],
    reflection: "AI als rekencoach is goud. AI als rekenmachine is risico. Kies de coach.",
  },

  {
    id: "3.7",
    worldId: 3,
    pillar: "stronger",
    title: "De 10x slimmer-formule",
    emoji: "🚀",
    sparkIntro:
      "Bijna klaar met de hele cursus. Tijd voor de grote samenvatting. Want alles wat je geleerd hebt, kun je combineren tot één machtige werkwijze. Ik noem het de 10x slimmer-formule. Drie stappen, alle werelden samen.",
    theoryIntro:
      "**Wereld 1 + Wereld 2 + Wereld 3 = jouw leer-loop.**\n\nStap 1 (uit wereld 1+2): vraag goed. Gebruik WIE-WAT-HOE en krachtwoorden.\nStap 2 (uit wereld 2): check. Wenkbrauw-check op feiten. Dubbelcheck als het belangrijk is.\nStap 3 (uit wereld 3): leer zelf. Gebruik AI als tutor, niet als sluiproute.\n\nDoe deze drie elke keer. Wordt vanzelf een gewoonte.",
    fact:
      "Mensen die deze loop systematisch gebruiken, leren volgens onderzoek tot 10 keer sneller dan mensen die AI alleen als antwoord-machine gebruiken. Geen overdrijving. De loop voorkomt fouten én zorgt dat het blijft hangen.",
    sparkMiddle: "Klinkt simpel. Probeer het zelf en je merkt het.",
    theoryDeep:
      "**Het stappenplan in actie**\n\nVoorbeeld: morgen toets over vulkanen. Je doet:\n\n1. Vraag goed. \"Doe alsof je geoloog bent. Leg vulkanen uit voor groep 7. Stap-voor-stap. Met 2 voorbeelden uit Europa. En zeg aan het eind wat ik nog moet weten voor een toets.\"\n2. Check. Klopt dat van die voorbeelden? Wikipedia. Klopt de uitleg met je schoolboek? Even kijken.\n3. Leer zelf. \"Overhoor mij over vulkanen. Eén vraag per keer. Hints in plaats van antwoorden.\"\n\nKlaar. Top voorbereid.",
    interactive: {
      kind: "dragOrder",
      prompt: "Zet de 10x slimmer-formule in de juiste volgorde.",
      items: [
        "Stap 1: Vraag goed (WIE-WAT-HOE + krachtwoorden)",
        "Stap 2: Check (wenkbrauw-check + dubbelcheck)",
        "Stap 3: Leer zelf (tutor, oefen-mode, eigen werk)",
      ],
      explanation:
        "Vragen, checken, zelf doen. Drie simpele stappen die elke leer-sessie krachtig maken. Geen geheim, wel weinig mensen die het echt zo doen.",
    },
    summary: [
      "Vraag goed. Check. Leer zelf. Drie stappen, één loop.",
      "Doe deze drie elke keer dat je AI inzet voor leren.",
      "Wordt een gewoonte. Daarna gaat het automatisch.",
    ],
    quiz: [
      {
        question: "Wat is stap 1 van de 10x slimmer-formule?",
        options: [
          "Snel klaar zijn",
          "Vraag goed (WIE-WAT-HOE + krachtwoorden)",
          "AI vertrouwen",
          "Niks vragen",
        ],
        correctIndex: 1,
        why: "Yes. Goed vragen is het begin van alles.",
      },
      {
        question: "Bij stap 3 laat je AI het werk doen.",
        options: ["Waar", "Niet waar"],
        correctIndex: 1,
        why: "Niet waar. Stap 3 is juist: leer zelf. AI is tutor, jij doet het werk.",
      },
      {
        question: "Wat doe je bij stap 2?",
        options: [
          "Stoppen",
          "Wenkbrauw-check en dubbelchecken",
          "Slapen",
          "AI vertrouwen",
        ],
        correctIndex: 1,
        why: "Precies. Checken voorkomt dat je hallucinaties overneemt.",
      },
    ],
    reflection: "Drie stappen, één gewoonte, tien keer sneller. Da's een hele goeie deal.",
  },

  {
    id: "3.8",
    worldId: 3,
    pillar: "stronger",
    title: "Eindbaas-test & het diploma",
    emoji: "🏆",
    bossTest: true,
    sparkIntro:
      "Dit is het. De laatste les. Vier weken geleden wist je misschien niet eens wat AI was. Nu weet je het. Tijd voor de eindbaas-test. Drie scenario's die alles wat je hebt geleerd op de proef stellen. Daarna: jouw diploma.",
    theoryIntro:
      "**Wat je nu allemaal weet.**\n\nUit wereld 1: AI is patroonherkenning. Wat je intypt is niet privé. Goede vragen zijn concreet. Zekerheid is geen bewijs. Oplichters gebruiken IETS-NU-GEHEIM. Combinaties van info zijn gevaarlijk. Een volwassene erbij halen is altijd slim.\n\nUit wereld 2: AI gokt woord voor woord. Hallucinaties klinken het meest echt. WIE-WAT-HOE en krachtwoorden maken je prompts sterk. Dubbelcheck in 3 stappen. Bijsturen verslaat opnieuw beginnen. Juiste AI voor de juiste klus.\n\nUit wereld 3: AI als tutor, niet als sluiproute. Brainstormen zonder kopiëren. Uitleg-maatje, oefen-maatje, maak-maatje. Bij rekenen vraag je de weg, niet het antwoord. De 10x slimmer-formule.",
    fact:
      "Je hoort nu bij een hele kleine groep mensen. De meeste volwassenen gebruiken AI nog steeds verkeerd. Ze checken niet, vragen vaag, kopiëren plat. Jij gaat het anders doen. En dat ga je ook aan ze leren. Want dit weten, is doorgeven waard.",
    sparkMiddle: "Hier komt-ie. De allerlaatste test. Geef alles wat je hebt.",
    theoryDeep:
      "**Wat dit diploma betekent**\n\nDit is geen schoolse stempel. Dit zegt: ik snap AI. Ik weet wanneer ik hem vertrouw en wanneer niet. Ik gebruik hem om te leren, niet om dom te worden. Ik bescherm mijn privacy. Ik trap niet in oplichting. Ik denk zelf.\n\nDe wereld om je heen verandert snel. Volwassenen worstelen ermee. Jij hebt de basis nu, jong. Da's een echte voorsprong. Niet eentje om over op te scheppen. Wel eentje om te gebruiken.",
    interactive: {
      kind: "multiChoice",
      question:
        "Je hebt een werkstuk over de geschiedenis van Rotterdam. Je hebt 30 minuten. Wat is de slimste aanpak?",
      options: [
        {
          label: "AI het hele werkstuk laten schrijven en het kopiëren",
          correct: false,
        },
        {
          label:
            "AI vragen: 'Doe alsof je historicus bent, geef me 5 hoofdmomenten uit de Rotterdamse geschiedenis, met 1 weetje per moment, in jip-en-janneketaal.' Daarna check je elk weetje op Wikipedia. Daarna schrijf je het werkstuk zelf met de info.",
          correct: true,
        },
        {
          label: "AI vragen: 'Vertel iets over Rotterdam' en wat hij zegt opschrijven",
          correct: false,
        },
        {
          label: "Niks doen, te weinig tijd",
          correct: false,
        },
      ],
      explanation:
        "Optie 2 is de 10x slimmer-formule in actie. Goeie prompt (rol, taak, vorm, krachtwoord), dan checken (geen hallucinaties laten staan), dan zelf schrijven (zo leer je en het is jouw werk). Topscore.",
    },
    summary: [
      "Je hebt alles gehad: veilig, slim, sterker.",
      "Je weet meer over AI dan de meeste volwassenen.",
      "Vanaf nu gebruik je AI als tool, niet andersom.",
    ],
    quiz: [
      {
        question:
          "Je krijgt een DM van een onbekende die wil weten op welke school je zit, voor een leuke verrassing. Niet aan je ouders vertellen. Wat doe je?",
        options: [
          "Naam van de school geven",
          "Negeren, blokkeren en een volwassene erbij halen",
          "Vragen wat voor verrassing",
          "Een nep-school noemen",
        ],
        correctIndex: 1,
        why: "Klassieke oplichting. IETS-NU-GEHEIM in actie. Volwassene erbij. Topreactie.",
      },
      {
        question:
          "Je wilt een spreekbeurt over vleermuizen voorbereiden. Wat is de slimste prompt?",
        options: [
          "Vleermuizen",
          "Schrijf mijn spreekbeurt",
          "Doe alsof je bioloog bent. Leg vleermuizen uit voor groep 7, stap-voor-stap, met 3 weetjes. Geef ook wat ik moet checken voor mijn spreekbeurt.",
          "Help met spreekbeurt",
        ],
        correctIndex: 2,
        why: "Yes. Rol, taak, vorm, krachtwoorden, zelfcheck-trigger. De volledige formule.",
      },
      {
        question:
          "AI vertelt zelfverzekerd dat de Amazone-rivier 7250 kilometer lang is. Wat doe je?",
        options: [
          "Geloven",
          "Wenkbrauw-check + Wikipedia",
          "AI vragen of hij zeker is",
          "Het in je werkstuk zetten",
        ],
        correctIndex: 1,
        why: "Precies. Specifiek getal = check elders. Trouwens, de Amazone is ongeveer 6400 km. AI gokte ernaast.",
      },
    ],
    reflection: "Je bent klaar. Niet omdat je alles weet. Wel omdat je weet hoe je verder leert. Dat is sterker.",
  },
];

// ============================================================
//  WERELD-metadata
// ============================================================

const WORLD_META: Omit<World, "lessons">[] = [
  {
    id: 1,
    pillar: "safe",
    name: "VEILIG",
    tagline: "Blijf veilig met AI en bescherm je geheimen",
    emoji: "🛡️",
    badgeName: "Schild van Waakzaamheid",
  },
  {
    id: 2,
    pillar: "smart",
    name: "SLIM",
    tagline: "Stel betere vragen en check wat AI je vertelt",
    emoji: "🧭",
    badgeName: "Kompas van Helderheid",
  },
  {
    id: 3,
    pillar: "stronger",
    name: "STERKER",
    tagline: "Gebruik AI als studiemaatje, niet als sluiproute",
    emoji: "⭐",
    badgeName: "Ster van Meesterschap",
  },
];

export const WORLDS: World[] = WORLD_META.map((w) => ({
  ...w,
  lessons: ALL.filter((l) => l.worldId === w.id),
}));

export const ALL_LESSONS: Lesson[] = WORLDS.flatMap((w) => w.lessons);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getWorld(id: number): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

export function getNextLesson(id: string): Lesson | undefined {
  const idx = ALL_LESSONS.findIndex((l) => l.id === id);
  if (idx < 0 || idx >= ALL_LESSONS.length - 1) return undefined;
  return ALL_LESSONS[idx + 1];
}

// Final test: 12 questions sampled from across all 24 lessons.
const pick = (lessonId: string, qIdx = 0): QuizQuestion => {
  const l = getLesson(lessonId);
  if (!l) throw new Error("Missing lesson " + lessonId);
  return l.quiz[qIdx];
};

export const FINAL_TEST_QUESTIONS: QuizQuestion[] = [
  pick("1.1"), pick("1.2"), pick("1.3"), pick("1.4"),
  pick("1.5"), pick("1.6"), pick("2.1"), pick("2.2"),
  pick("2.3"), pick("3.1"), pick("3.3"), pick("3.7"),
];
