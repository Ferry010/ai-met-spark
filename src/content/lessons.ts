/**
 * AI Smart Kids — full lesson curriculum.
 * 3 worlds × 4 lessons = 12 lessons.
 */

export type Pillar = "safe" | "smart" | "stronger";

export type InteractiveStep =
  | {
      kind: "multiChoice";
      question: string;
      options: { label: string; correct: boolean }[];
      explanation: string;
    }
  | {
      kind: "tapReveal";
      prompt: string;
      reveals: { label: string; reveal: string }[];
    }
  | {
      kind: "sortBuckets";
      prompt: string;
      buckets: string[]; // 2 buckets
      items: { label: string; bucket: number }[];
    };

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  why: string;
}

export interface Lesson {
  id: string; // "1.1"
  worldId: 1 | 2 | 3;
  pillar: Pillar;
  title: string;
  emoji: string;
  fact: string;
  interactive: InteractiveStep;
  quiz: QuizQuestion[];
}

export interface World {
  id: 1 | 2 | 3;
  pillar: Pillar;
  name: string;
  tagline: string;
  emoji: string;
  lessons: Lesson[];
}

export const WORLDS: World[] = [
  {
    id: 1,
    pillar: "safe",
    name: "VEILIG",
    tagline: "Blijf veilig met AI",
    emoji: "🛡️",
    lessons: [
      {
        id: "1.1",
        worldId: 1,
        pillar: "safe",
        title: "Wat is AI eigenlijk?",
        emoji: "🤖",
        fact: "AI is een supersnelle gokker, geen denkend brein. Het leerde van miljoenen voorbeelden.",
        interactive: {
          kind: "multiChoice",
          question: "Hoe komt AI aan zijn antwoorden?",
          options: [
            { label: "Het zoekt feiten op in een groot boek", correct: false },
            { label: "Het gokt op basis van patronen uit voorbeelden", correct: true },
            { label: "Het denkt zoals een mensenbrein", correct: false },
          ],
          explanation: "AI voorspelt wat er komt met patronen die het leerde. Het begrijpt het niet echt!",
        },
        quiz: [
          {
            question: "AI kun je het beste omschrijven als:",
            options: ["Een denkend brein", "Een supersnelle patroon-gokker", "Een zoekmachine"],
            correctIndex: 1,
            why: "AI voorspelt patronen uit trainingsdata. Het redeneert niet zoals een mens.",
          },
          {
            question: "Waar leerde AI wat het weet?",
            options: ["Van een leraar", "Van miljoenen voorbeelden op internet", "Door magie"],
            correctIndex: 1,
            why: "AI is getraind op enorme stapels tekst en beelden.",
          },
        ],
      },
      {
        id: "1.2",
        worldId: 1,
        pillar: "safe",
        title: "AI kan fout zitten",
        emoji: "🤔",
        fact: "Soms verzint AI dingen. Dat heet 'hallucineren'. Check belangrijke dingen altijd.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap elk voorbeeld om te zien of AI het goed had:",
          reveals: [
            { label: "AI zegt: 'Haaien hebben botten.'", reveal: "❌ FOUT. Haaien hebben kraakbeen, geen botten." },
            { label: "AI zegt: 'De zon is een ster.'", reveal: "✅ WAAR. De zon is onze dichtstbijzijnde ster." },
            { label: "AI verzint een nep-boektitel", reveal: "❌ HALLUCINATIE. AI verzint soms dingen die echt klinken." },
          ],
        },
        quiz: [
          {
            question: "Als AI vol zelfvertrouwen iets verzint, heet dat:",
            options: ["Liegen", "Hallucineren", "Slapen"],
            correctIndex: 1,
            why: "Dat is het echte woord. Zelfs experts gebruiken het.",
          },
          {
            question: "Wat doe je met belangrijke AI-antwoorden?",
            options: ["Vertrouwen", "Dubbel checken", "Negeren"],
            correctIndex: 1,
            why: "AI klinkt zeker zelfs als het fout is, dus check altijd.",
          },
        ],
      },
      {
        id: "1.3",
        worldId: 1,
        pillar: "safe",
        title: "Houd je geheimen",
        emoji: "🤐",
        fact: "Geef AI nooit je volledige naam, school, adres, en deel geen foto's van jezelf.",
        interactive: {
          kind: "sortBuckets",
          prompt: "Sleep elk ding naar VEILIG of GEHEIM:",
          buckets: ["✅ VEILIG om te delen", "🔒 HOUD GEHEIM"],
          items: [
            { label: "Lievelingskleur", bucket: 0 },
            { label: "Je volledige naam", bucket: 1 },
            { label: "Een verzonnen personage", bucket: 0 },
            { label: "Je thuisadres", bucket: 1 },
            { label: "De naam van je school", bucket: 1 },
            { label: "Een rekensom", bucket: 0 },
          ],
        },
        quiz: [
          {
            question: "Wat moet je NOOIT aan een AI vertellen?",
            options: ["Een rekensom", "Je thuisadres", "Een mop"],
            correctIndex: 1,
            why: "Persoonlijke info blijft privé. Ook bij AI.",
          },
          {
            question: "Mag je een foto van jezelf uploaden naar een chat-AI?",
            options: ["Ja, prima", "Nee, houd je beeld privé", "Alleen als hij wazig is"],
            correctIndex: 1,
            why: "Jouw beeld is privé. Houd het zo.",
          },
        ],
      },
      {
        id: "1.4",
        worldId: 1,
        pillar: "safe",
        title: "Spot de nep",
        emoji: "🕵️",
        fact: "AI kan nepvideo's en foto's maken. Let op rare handen, vreemde achtergronden, te perfecte gezichten.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap elke aanwijzing die een door AI gemaakte foto verraadt:",
          reveals: [
            { label: "Handen met 6 vingers", reveal: "🚩 Klassieke AI-fout. Handen zijn lastig." },
            { label: "Letters op de achtergrond zijn wartaal", reveal: "🚩 AI worstelt met duidelijke tekst op achtergronden." },
            { label: "Gezichten zijn 'te glad'", reveal: "🚩 Huid zonder poriën of vlekjes is verdacht." },
            { label: "Oorbellen die niet matchen", reveal: "🚩 AI vergeet vaak symmetrie in kleine details." },
          ],
        },
        quiz: [
          {
            question: "Wat is een veelgebruikt verraadt in nep-AI-foto's?",
            options: ["Felle kleuren", "Rare handen of vingers", "Vierkante vorm"],
            correctIndex: 1,
            why: "Handen en vingers zijn berucht moeilijk voor AI.",
          },
          {
            question: "Als een video er te perfect uitziet, moet je:",
            options: ["Het geloven", "Een beetje wantrouwig zijn en de bron checken", "Overal delen"],
            correctIndex: 1,
            why: "Check altijd de bron voordat je iets vertrouwt of deelt.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    pillar: "smart",
    name: "SLIM",
    tagline: "Gebruik AI slim",
    emoji: "🧠",
    lessons: [
      {
        id: "2.1",
        worldId: 2,
        pillar: "smart",
        title: "Vraag als een pro",
        emoji: "💬",
        fact: "Duidelijke vragen = betere antwoorden. Zeg wat je nodig hebt, waarom, en hoe lang.",
        interactive: {
          kind: "multiChoice",
          question: "Welke is de BESTE prompt?",
          options: [
            { label: "Vertel me over de ruimte.", correct: false },
            { label: "Leg de ringen van Saturnus uit aan een 9-jarige in 3 zinnen.", correct: true },
            { label: "Ruimte-spul graag!", correct: false },
          ],
          explanation: "Duidelijke, specifieke en korte prompts geven de beste antwoorden.",
        },
        quiz: [
          {
            question: "Een goede prompt bevat:",
            options: ["Je lievelings-emoji", "Wat je nodig hebt, waarom, en hoe lang", "Slechts één woord"],
            correctIndex: 1,
            why: "Wees specifiek zodat AI weet wat je wilt.",
          },
          {
            question: "Welke is duidelijker?",
            options: ["'Help.'", "'Help me breuken begrijpen met één voorbeeld.'", "'Breuken?'"],
            correctIndex: 1,
            why: "Specifieke vragen winnen altijd.",
          },
        ],
      },
      {
        id: "2.2",
        worldId: 2,
        pillar: "smart",
        title: "Check altijd dubbel",
        emoji: "🔎",
        fact: "AI klinkt zeker, ook als het fout zit. Check met een boek, een leerkracht of een andere bron.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap elke goede manier om dubbel te checken:",
          reveals: [
            { label: "Vraag een leerkracht", reveal: "✅ Top, mensen kennen context." },
            { label: "Zoek het op in een echt boek", reveal: "✅ Boeken zijn meestal door experts gecheckt." },
            { label: "Vraag dezelfde AI nog een keer", reveal: "❌ Misschien herhaalt het zichzelf gewoon vol vertrouwen." },
            { label: "Zoek op een betrouwbare website", reveal: "✅ Met een bekende bron vergelijken helpt." },
          ],
        },
        quiz: [
          {
            question: "Als AI je een feit geeft, moet je:",
            options: ["Het vertrouwen", "Het checken met een andere bron", "Het vergeten"],
            correctIndex: 1,
            why: "AI kan fout zitten. Verifieer belangrijke info.",
          },
          {
            question: "Waarom klinkt AI zo zelfverzekerd?",
            options: ["Het weet echt alles", "Het is getraind om soepel te schrijven, niet om feiten te checken", "Het is aan het opscheppen"],
            correctIndex: 1,
            why: "AI is geweldig in goed klinken, ook als het niet klopt.",
          },
        ],
      },
      {
        id: "2.3",
        worldId: 2,
        pillar: "smart",
        title: "Helper, geen huiswerkmaker",
        emoji: "📚",
        fact: "AI helpt je begrijpen. AI's antwoord overschrijven is geen leren.",
        interactive: {
          kind: "sortBuckets",
          prompt: "Sorteer in HANDIG of KOPIËREN:",
          buckets: ["💡 HANDIG gebruik", "🚫 KOPIËREN (niet oké)"],
          items: [
            { label: "Vraag AI een moeilijk woord uit te leggen", bucket: 0 },
            { label: "Plak je opstelvraag en lever AI's antwoord in", bucket: 1 },
            { label: "Vraag AI je te testen met oefenvragen", bucket: 0 },
            { label: "Kopieer AI's huiswerkantwoord woord voor woord", bucket: 1 },
            { label: "Vraag AI om een voorbeeld van hoe iets werkt", bucket: 0 },
          ],
        },
        quiz: [
          {
            question: "AI gebruiken om een lastig idee uit te leggen is:",
            options: ["Spieken", "Een geweldige manier om te leren", "Lui"],
            correctIndex: 1,
            why: "Dat is precies waar AI voor is. Je helpen begrijpen.",
          },
          {
            question: "Een AI-antwoord overschrijven voor huiswerk:",
            options: ["Betekent dat je het leerde", "Slaat het leren over", "Is altijd toegestaan"],
            correctIndex: 1,
            why: "Je brein groeit niet als je kopieert.",
          },
        ],
      },
      {
        id: "2.4",
        worldId: 2,
        pillar: "smart",
        title: "Wanneer AI gebruiken",
        emoji: "✅",
        fact: "Top voor: brainstormen, uitleggen, oefenen. NIET voor: echte beslissingen, doen alsof het van jou is.",
        interactive: {
          kind: "sortBuckets",
          prompt: "Tap elke taak in de juiste bak:",
          buckets: ["👍 Goed gebruik van AI", "👎 Slecht gebruik van AI"],
          items: [
            { label: "Brainstormen over verhaalideeën", bucket: 0 },
            { label: "Beslissen wie je echte vrienden moeten zijn", bucket: 1 },
            { label: "Oefenen met een quiz", bucket: 0 },
            { label: "Doen alsof een AI-bericht van jou is", bucket: 1 },
            { label: "Een lastig woord uitleggen", bucket: 0 },
          ],
        },
        quiz: [
          {
            question: "AI is geweldig voor:",
            options: ["Grote levensbeslissingen voor jou nemen", "Brainstormen en oefenen", "Je vrienden vervangen"],
            correctIndex: 1,
            why: "AI is een hulpmiddel, geen beslisser.",
          },
          {
            question: "Doen alsof AI's woorden van jou zijn is:",
            options: ["Slim", "Eerlijk", "Niet eerlijk"],
            correctIndex: 2,
            why: "Wees altijd eerlijk over AI-hulp.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    pillar: "stronger",
    name: "STERKER",
    tagline: "Word onstuitbaar",
    emoji: "💪",
    lessons: [
      {
        id: "3.1",
        worldId: 3,
        pillar: "stronger",
        title: "Leer 10x sneller",
        emoji: "🚀",
        fact: "Vraag AI om alles uit te leggen. 'Leg zwaartekracht uit alsof ik 9 ben.'",
        interactive: {
          kind: "multiChoice",
          question: "Welke prompt laat AI dingen uitleggen op JOUW niveau?",
          options: [
            { label: "Vertel me over zwaartekracht", correct: false },
            { label: "Leg zwaartekracht uit alsof ik 9 ben, met één voorbeeld", correct: true },
            { label: "Zwaartekracht?", correct: false },
          ],
          explanation: "'Alsof ik 9 ben' toevoegen vertelt AI om simpele woorden te gebruiken.",
        },
        quiz: [
          {
            question: "Welke magische zin laat AI simpel uitleggen?",
            options: ["'Wees slim'", "'Alsof ik 9 ben'", "'Wees deftig'"],
            correctIndex: 1,
            why: "AI je niveau vertellen helpt het matchen.",
          },
          {
            question: "AI helpt je sneller leren door:",
            options: ["Je huiswerk te doen", "Dingen op verschillende manieren uit te leggen", "Je vrienden te kiezen"],
            correctIndex: 1,
            why: "AI kan een onderwerp 10 keer anders uitleggen tot het klikt.",
          },
        ],
      },
      {
        id: "3.2",
        worldId: 3,
        pillar: "stronger",
        title: "Uitleggen, niet oplossen",
        emoji: "🧩",
        fact: "Betere prompt: 'Help me begrijpen' in plaats van 'Geef me het antwoord.'",
        interactive: {
          kind: "multiChoice",
          question: "Welke prompt laat je brein meer groeien?",
          options: [
            { label: "Geef me het antwoord op vraag 5", correct: false },
            { label: "Help me begrijpen hoe ik vraag 5 oplos", correct: true },
            { label: "Vertel het gewoon", correct: false },
          ],
          explanation: "Begrijpen > antwoord krijgen. Altijd.",
        },
        quiz: [
          {
            question: "De slimmere prompt is:",
            options: ["'Geef me het antwoord'", "'Help me begrijpen'", "'Doe het maar gewoon'"],
            correctIndex: 1,
            why: "Begrip blijft hangen, antwoorden niet.",
          },
          {
            question: "Als AI gewoon het antwoord geeft, moet je:",
            options: ["Het kopiëren", "Vragen om uit te leggen hoe het er kwam", "Stoppen"],
            correctIndex: 1,
            why: "Vraag altijd 'waarom' of 'hoe' om te leren.",
          },
        ],
      },
      {
        id: "3.3",
        worldId: 3,
        pillar: "stronger",
        title: "Je oefenmaatje",
        emoji: "🎯",
        fact: "Gebruik AI om jezelf te testen, talen te oefenen, of samen verhalen te bouwen.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap elk goed oefenidee:",
          reveals: [
            { label: "'Quiz me over de planeten.'", reveal: "✅ Geweldige manier om jezelf te testen." },
            { label: "'Laten we samen een verhaal schrijven.'", reveal: "✅ Samen creëren bouwt creativiteit." },
            { label: "'Praat tegen me in het Spaans.'", reveal: "✅ Talen oefenen wanneer je wilt." },
            { label: "'Doe mijn huiswerk.'", reveal: "❌ Dat is kopiëren, geen oefenen." },
          ],
        },
        quiz: [
          {
            question: "AI is een geweldige oefenmaatje omdat het:",
            options: ["Nooit moe wordt", "Voetbalt", "Pizza eet"],
            correctIndex: 0,
            why: "AI kan je eindeloos overhoren zonder zich te vervelen.",
          },
          {
            question: "Wat is goed oefenen met AI?",
            options: ["Samen een verhaal schrijven", "Je huiswerk kopiëren", "Je adres delen"],
            correctIndex: 0,
            why: "Samen creëren is een briljant gebruik.",
          },
        ],
      },
      {
        id: "3.4",
        worldId: 3,
        pillar: "stronger",
        title: "Brein + AI = onverslaanbaar",
        emoji: "⚡",
        fact: "Jouw creativiteit + AI's snelheid = je superkracht. AI zonder jou is saai.",
        interactive: {
          kind: "multiChoice",
          question: "Wat is het geheime recept voor het BESTE werk?",
          options: [
            { label: "Alleen AI", correct: false },
            { label: "Alleen jij", correct: false },
            { label: "Jouw ideeën + AI's snelheid", correct: true },
          ],
          explanation: "Jij brengt de creativiteit. AI brengt de snelheid. Samen = magie.",
        },
        quiz: [
          {
            question: "AI alleen is:",
            options: ["Het slimste ooit", "Saai zonder jouw ideeën", "Altijd perfect"],
            correctIndex: 1,
            why: "AI heeft jouw richting nodig om iets cools te doen.",
          },
          {
            question: "Je superkracht is:",
            options: ["AI alles laten doen", "Jouw creativiteit combineren met AI's snelheid", "Wegduiken voor AI"],
            correctIndex: 1,
            why: "Jij + AI = onverslaanbaar team.",
          },
        ],
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = WORLDS.flatMap((w) => w.lessons);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getWorld(id: number): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

// Final test: 10 questions sampled from across all lessons
export const FINAL_TEST_QUESTIONS: QuizQuestion[] = [
  ALL_LESSONS[0].quiz[0],   // 1.1
  ALL_LESSONS[1].quiz[0],   // 1.2
  ALL_LESSONS[2].quiz[0],   // 1.3
  ALL_LESSONS[3].quiz[0],   // 1.4
  ALL_LESSONS[4].quiz[0],   // 2.1
  ALL_LESSONS[5].quiz[1],   // 2.2
  ALL_LESSONS[6].quiz[0],   // 2.3
  ALL_LESSONS[7].quiz[1],   // 2.4
  ALL_LESSONS[8].quiz[0],   // 3.1
  ALL_LESSONS[11].quiz[1],  // 3.4
];
