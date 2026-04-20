/**
 * AI Smart Kids , full lesson curriculum.
 * 3 worlds × 8 lessons = 24 lessons. Voor kids van 9 tot 11 jaar.
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
      buckets: string[]; // 2 buckets
      items: { label: string; bucket: number }[];
      hints?: string[];
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
  /** STAP 1, Spark's intro line. */
  sparkIntro?: string;
  /** STAP 2, eerste theorieblok (optioneel). */
  theoryIntro?: string;
  /** STAP 3, wist-je-dat. */
  fact: string;
  /** STAP 4, tweede theorieblok (optioneel). */
  theoryDeep?: string;
  /** STAP 5, oefening. */
  interactive: InteractiveStep;
  /** STAP 6, samenvatting in bullets (optioneel). */
  summary?: string[];
  /** STAP 7, oefenvragen. */
  quiz: QuizQuestion[];
  /** Optional reflection line for Spark at the "Verdien je ster" step. */
  reflection?: string;
  /** True for the Wereld Baas-test lessons (1.8, 2.8) and the eindbaas (3.8). */
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

// ---------- Helper to keep the data block readable ----------
const mc = (
  question: string,
  options: { label: string; correct: boolean }[],
  explanation: string,
  hints?: string[],
): InteractiveStep => ({ kind: "multiChoice", question, options, explanation, hints });

const tap = (
  prompt: string,
  reveals: { label: string; reveal: string }[],
  hints?: string[],
): InteractiveStep => ({ kind: "tapReveal", prompt, reveals, hints });

const sort = (
  prompt: string,
  buckets: string[],
  items: { label: string; bucket: number }[],
  hints?: string[],
): InteractiveStep => ({ kind: "sortBuckets", prompt, buckets, items, hints });

// =================================================================
// WERELD 1 , VEILIG (Schild van Waakzaamheid)
// =================================================================
const WORLD_1: Lesson = null as any; // placeholder so the file compiles in steps below

export const WORLDS: World[] = [
  {
    id: 1,
    pillar: "safe",
    name: "VEILIG",
    tagline: "Blijf veilig met AI en bescherm je geheimen",
    emoji: "🛡️",
    badgeName: "Schild van Waakzaamheid",
    lessons: [
      // ---------- Les 1 ----------
      {
        id: "1.1",
        worldId: 1,
        pillar: "safe",
        title: "Wat is AI eigenlijk?",
        emoji: "🤖",
        sparkIntro: "Hoi! Ik ben Spark. Denk jij dat AI nadenkt zoals jij? Spoiler: nee. En dat is juist het hele punt.",
        fact: "AI is geen tovenaar en geen denkend brein. Het is een patroon-herkenner die leerde van miljoenen voorbeelden.",
        interactive: sort(
          "Tik op de juiste bak voor elk kaartje: is het AI of niet?",
          ["🤖 Dit is AI", "📦 Dit is geen AI"],
          [
            { label: "ChatGPT", bucket: 0 },
            { label: "Een rekenmachine", bucket: 1 },
            { label: "TikTok-video-voorstellen", bucket: 0 },
            { label: "Een oud telefoonboek", bucket: 1 },
            { label: "Snapchat-filters die je gezicht herkennen", bucket: 0 },
            { label: "Een kookwekker", bucket: 1 },
          ],
          [
            "AI 'leert' van voorbeelden. Een rekenmachine doet altijd dezelfde sommen.",
            "Apps die JOU iets voorstellen of HERKENNEN gebruiken meestal AI.",
            "Letterlijk: ChatGPT en TikTok-voorstellen zijn AI. De rest niet.",
          ],
        ),
        quiz: [
          {
            question: "Wat doet AI eigenlijk?",
            options: [
              "Het denkt nét als een mens",
              "Het herkent patronen uit heel veel voorbeelden",
              "Het weet altijd het juiste antwoord",
              "Het voelt wat jij voelt",
            ],
            correctIndex: 1,
            why: "AI leert door patronen te zien in miljoenen voorbeelden. Het denkt niet zoals jij denkt.",
          },
          {
            question: "Heeft AI gevoelens, net als jij en ik?",
            options: ["Ja, soms wel", "Nee, het is gewoon code"],
            correctIndex: 1,
            why: "AI kan doen alsof, maar voelt niks. Net zoals je rekenmachine niks voelt bij een som.",
          },
          {
            question: "Wat gebruikt AI om dingen te leren?",
            options: ["Magie", "Voorbeelden, patronen en data", "Gevoelens"],
            correctIndex: 1,
            why: "Voorbeelden, patronen en data. Dat is het hele geheim achter AI.",
          },
        ],
        reflection: "Je weet nu wat AI écht is. Vanaf nu zie je het voor wat het is: geen magie.",
      },
      // ---------- Les 2 ----------
      {
        id: "1.2",
        worldId: 1,
        pillar: "safe",
        title: "Jouw geheimen zijn van jou",
        emoji: "🤐",
        sparkIntro: "Vraagje. Zou je je adres op een bord in de stad hangen? Nee toch? Dan ook niet aan AI.",
        fact: "Alles wat je tegen AI zegt, kan worden opgeslagen. Soms voor altijd. Daarom: geheim = geheim.",
        interactive: sort(
          "Zou je dit aan AI vertellen?",
          ["✅ Dat is oké", "🔒 Nope, geheim"],
          [
            { label: "Naam van je lievelingsdier", bucket: 0 },
            { label: "Je volledige naam en adres", bucket: 1 },
            { label: "Je hobby", bucket: 0 },
            { label: "Het wachtwoord van je ouders", bucket: 1 },
            { label: "Een vraag over dino's", bucket: 0 },
            { label: "Een selfie in je schooluniform", bucket: 1 },
          ],
          [
            "Wachtwoorden, adres en foto's van jou zijn ALTIJD geheim.",
            "Een hobby of vraag over dieren mag prima.",
            "Vraag jezelf: zou ik dit aan een vreemde op straat zeggen?",
          ],
        ),
        quiz: [
          {
            question: "Welk van deze mag je NOOIT tegen AI zeggen?",
            options: [
              "Wat is de hoofdstad van Japan?",
              "Mijn wachtwoord is Kat123",
              "Leg breuken uit",
              "Verzin een naam voor mijn teddybeer",
            ],
            correctIndex: 1,
            why: "Wachtwoorden NOOIT. Niet aan AI, niet aan een website, niet aan iemand op school.",
          },
          {
            question: "Wat is GEHEIM?",
            options: ["Je favoriete kleur", "Je telefoonnummer", "De naam van je klas"],
            correctIndex: 1,
            why: "Telefoonnummer, adres en volledige naam zijn altijd geheim.",
          },
          {
            question: "AI onthoudt het, ook als je zegt 'dit is geheim'.",
            options: ["Waar", "Niet waar , het is GEEN dagboekvriendje"],
            correctIndex: 1,
            why: "Wat je tegen AI zegt kan worden opgeslagen. Beter: deel het gewoon niet.",
          },
        ],
        reflection: "Je geheimen zijn van jou. Punt. Dat is je eerste superkracht.",
      },
      // ---------- Les 3 ----------
      {
        id: "1.3",
        worldId: 1,
        pillar: "safe",
        title: "Spot de nep: plaatjes",
        emoji: "🕵️",
        sparkIntro: "AI maakt nu plaatjes waar veel volwassenen in trappen. Maar niet jij. Niet na vandaag.",
        fact: "AI heeft drie zwakke plekken in plaatjes: handen, tekst en schaduwen. Daar betrap je 'm.",
        interactive: tap(
          "Tap elke aanwijzing die een door AI gemaakte foto verraadt:",
          [
            { label: "Een hand met 6 vingers", reveal: "🚩 Klassieke AI-fout. Handen zijn lastig." },
            { label: "Letters op de achtergrond zijn wartaal", reveal: "🚩 AI worstelt met duidelijke tekst." },
            { label: "Schaduw die niet klopt met het licht", reveal: "🚩 Lichtrichting fout = vaak AI." },
            { label: "Oorbellen of oren die niet matchen", reveal: "🚩 AI vergeet vaak symmetrie." },
          ],
          [
            "Begin altijd bij de handen , dat is AI's grootste zwakke plek.",
            "Kijk dan naar tekst op borden of kleren.",
            "Klopt de schaduw met de kant waar het licht vandaan komt?",
          ],
        ),
        quiz: [
          {
            question: "Waar kan AI het SLECHTST tegen?",
            options: ["Mooie luchten", "Handen en vingers goed tekenen", "Kleuren kiezen"],
            correctIndex: 1,
            why: "Handen zijn AI's grootste nachtmerrie. Eerste check bij twijfel.",
          },
          {
            question: "Welk van deze is een typische AI-fout?",
            options: ["Natuurlijke schaduwen", "6 vingers aan een hand", "Normale oren"],
            correctIndex: 1,
            why: "Extra of missende vingers: klassieker.",
          },
          {
            question: "Als een plaatje er perfect uitziet, is het zeker echt.",
            options: ["Waar", "Niet waar , 'te perfect' is juist verdacht"],
            correctIndex: 1,
            why: "Te gladde huid en glimmend haar zonder één plekje? Argwaan.",
          },
        ],
        reflection: "Je hebt nu een detective-oog voor plaatjes. Gebruik het.",
      },
      // ---------- Les 4 ----------
      {
        id: "1.4",
        worldId: 1,
        pillar: "safe",
        title: "Spot de nep: video's en stemmen",
        emoji: "🎭",
        sparkIntro: "Vandaag wordt het pittig. We hebben het over deepfakes , video's en stemmen die nep zijn.",
        fact: "Deepfakes verraden zich vaak door rare ogen, slechte lipsync en stemmen zonder echte emotie.",
        interactive: tap(
          "Tap elk teken van een mogelijke deepfake:",
          [
            { label: "Vreemd of bijna geen oogknipperen", reveal: "🚩 Echte mensen knipperen vaker." },
            { label: "Lippen lopen niet synchroon met geluid", reveal: "🚩 Lipsync is moeilijk voor AI." },
            { label: "Stem zonder echte emotie, té vlak", reveal: "🚩 AI-stemmen klinken vaak plat." },
            { label: "Rare overgang in achtergrond bij hoofd", reveal: "🚩 Rand van het gezicht 'blurt'." },
          ],
          [
            "Let als eerste op de OGEN , knipperen ze normaal?",
            "Daarna: lopen de lippen mee met het geluid?",
            "Klinkt de stem 'gevoelig' of platter dan normaal?",
          ],
        ),
        quiz: [
          {
            question: "Wat is een deepfake?",
            options: [
              "Een hele oude film",
              "Een video die door AI is namaakt of aangepast",
              "Een tekenfilm",
            ],
            correctIndex: 1,
            why: "'Deep' komt van 'deep learning', een soort AI.",
          },
          {
            question: "Welke is een teken van deepfake?",
            options: ["Normale stem", "Lippen lopen niet synchroon", "Goede belichting"],
            correctIndex: 1,
            why: "Slechte lipsync is een klassieker.",
          },
          {
            question: "Beroemdheid zegt iets raars in een video , wat doe je?",
            options: ["Direct delen", "Eerst checken bij betrouwbare bron"],
            correctIndex: 1,
            why: "Altijd checken bij NOS, nu.nl of een volwassene voordat je het gelooft.",
          },
        ],
        reflection: "Je bent nu officieel een deepfake-detective. Petje af.",
      },
      // ---------- Les 5 ----------
      {
        id: "1.5",
        worldId: 1,
        pillar: "safe",
        title: "Scams en oplichting met AI",
        emoji: "⚠️",
        sparkIntro: "Oplichters waren al smerig. Met AI zijn ze geniepiger. Maar je kunt ze spotten.",
        fact: "Drie tekenen van scam: HAAST, EMOTIE en de vraag om GELD of INFO. Alle drie? Bijna altijd oplichting.",
        interactive: sort(
          "Scam of echt? Tik op de juiste bak voor elk bericht:",
          ["🚨 Scam", "✅ Lijkt echt"],
          [
            { label: "'Stuur je adres snel snel snel!'", bucket: 0 },
            { label: "'Mam zei dat je mee mag met Sara'", bucket: 1 },
            { label: "'Je hebt een iPhone gewonnen! Klik hier'", bucket: 0 },
            { label: "'Oma heeft een ongeluk! Stuur €200 nu!'", bucket: 0 },
            { label: "'Verjaardagsuitnodiging op zaterdag'", bucket: 1 },
          ],
          [
            "Zit er HAAST in? Eerste alarmbel.",
            "Wordt er om GELD of een WACHTWOORD gevraagd? Tweede alarmbel.",
            "Speelt het in op heftige EMOTIE? Derde alarmbel.",
          ],
        ),
        quiz: [
          {
            question: "Iemand appt 'help, stuur snel geld, noodgeval'. Wat doe je?",
            options: ["Snel geld sturen", "Ouders meteen laten zien", "Terugappen met vragen"],
            correctIndex: 1,
            why: "Ouders erbij. Echte familie in nood belt via bekende kanalen.",
          },
          {
            question: "Welk van deze is een scam-teken?",
            options: ["Een rustige vraag", "Enorme haast", "Een normale dag-vraag"],
            correctIndex: 1,
            why: "Haast is een van de drie scam-klassiekers.",
          },
          {
            question: "Stem aan de telefoon klinkt als opa , dan is het zeker opa.",
            options: ["Waar", "Niet waar , bel terug op bekend nummer"],
            correctIndex: 1,
            why: "AI kan stemmen nabootsen. Altijd terugbellen op het bekende nummer.",
          },
        ],
        reflection: "Je hebt vandaag één van de belangrijkste skills van 2026 geleerd. Echt waar.",
      },
      // ---------- Les 6 ----------
      {
        id: "1.6",
        worldId: 1,
        pillar: "safe",
        title: "Wat AI NIET mag weten",
        emoji: "🛑",
        sparkIntro: "Kleine oefening: welke 3 dingen mag AI NOOIT van jou weten? Denk maar even. Ik wacht.",
        fact: "Onthoud de STOP-lijst: Straat, Telefoon, Ouders-info, Pasjes. Nooit in een AI-chat.",
        interactive: sort(
          "Hoort dit in de STOP-zone of de Oké-zone?",
          ["🛑 STOP-zone", "✅ Oké"],
          [
            { label: "Je lievelingskleur", bucket: 1 },
            { label: "Je schooladres", bucket: 0 },
            { label: "Welk land je woont", bucket: 1 },
            { label: "Foto's van je familie", bucket: 0 },
            { label: "Wat je vandaag at", bucket: 1 },
            { label: "Wachtwoord van ouders", bucket: 0 },
            { label: "Telefoonnummer", bucket: 0 },
            { label: "Je favoriete game", bucket: 1 },
          ],
          [
            "STOP = Straat, Telefoon, Ouders, Pasjes.",
            "Algemene info zoals 'kleur' of 'eten' mag prima.",
            "Foto's en adressen NOOIT.",
          ],
        ),
        quiz: [
          {
            question: "Waar staat de S in de STOP-lijst voor?",
            options: ["Snoepjes", "Straat waar je woont", "School", "Stickers"],
            correctIndex: 1,
            why: "Straat (samen met huisnummer en postcode). Nooit in AI.",
          },
          {
            question: "Wat hoort in de STOP-zone?",
            options: ["Favoriete eten", "Telefoonnummer", "Hobby"],
            correctIndex: 1,
            why: "Telefoon, adres, wachtwoorden: altijd STOP.",
          },
          {
            question: "Mijn voornaam mag ik altijd veilig aan AI vertellen.",
            options: ["Waar", "Niet waar , vraag jezelf altijd: is het nodig?"],
            correctIndex: 1,
            why: "Voornaam alléén kan vaak wel, maar als het niet hoeft: laat 'm weg.",
          },
        ],
        reflection: "STOP-lijst zit in je hoofd. Dit is je levenslange checklist.",
      },
      // ---------- Les 7 ----------
      {
        id: "1.7",
        worldId: 1,
        pillar: "safe",
        title: "Wanneer vraag je een volwassene?",
        emoji: "🙋",
        sparkIntro: "Slimme mensen vragen om hulp. Niet domme mensen. Onthoud dat.",
        fact: "5 momenten om STOP te roepen: enge tekst, vraag om geld, onbekende AI, raar gevoel, of installatie-vraag.",
        interactive: sort(
          "Ga verder of haal een volwassene?",
          ["▶️ Ga verder", "🚨 Haal volwassene"],
          [
            { label: "AI legt breuken uit", bucket: 0 },
            { label: "AI zegt ineens iets gemeens", bucket: 1 },
            { label: "AI vraagt creditcardgegevens", bucket: 1 },
            { label: "AI helpt met een verhaal", bucket: 0 },
            { label: "AI wil iets installeren", bucket: 1 },
            { label: "AI geeft uitleg over de ruimte", bucket: 0 },
          ],
          [
            "Geld, installatie of enge content = ALTIJD volwassene.",
            "Gewone uitleg over school = gewoon doorgaan.",
            "Twijfel je? Volwassene erbij.",
          ],
        ),
        quiz: [
          {
            question: "AI begint ineens gemene dingen te zeggen. Wat doe je?",
            options: ["Terug gemeen doen", "Scherm dichtklappen en volwassene halen", "Doorgaan"],
            correctIndex: 1,
            why: "Scherm dicht, volwassene erbij. Je hoeft dat niet alleen op te lossen.",
          },
          {
            question: "Wanneer ALTIJD een volwassene halen?",
            options: ["Bij een rekensom", "Als AI om geld of betaling vraagt", "Bij een gedicht"],
            correctIndex: 1,
            why: "Geld, installatie en enge content: altijd volwassene.",
          },
          {
            question: "Hulp vragen betekent dat je dom bent.",
            options: ["Waar", "Niet waar , het betekent juist dat je slim bent"],
            correctIndex: 1,
            why: "Zelfs volwassenen vragen elkaar om hulp.",
          },
        ],
        reflection: "Hulp vragen is een superkracht. Niet zwak, maar slim.",
      },
      // ---------- Les 8 , Baas-test ----------
      {
        id: "1.8",
        worldId: 1,
        pillar: "safe",
        title: "Wereld 1 Baas-test",
        emoji: "🏅",
        bossTest: true,
        sparkIntro: "Dit is je grote moment. Alles van wereld 1 komt nu samen. Ademen, lezen, kiezen. Ik weet dat je dit kunt.",
        fact: "Geen nieuwe stof. Je showcase. Slaag en je verdient het Schild van Waakzaamheid.",
        interactive: mc(
          "Welke uitspraak klopt het BEST?",
          [
            { label: "AI denkt zoals mensen", correct: false },
            { label: "AI herkent patronen uit voorbeelden", correct: true },
            { label: "AI heeft gevoelens", correct: false },
            { label: "AI weet altijd de waarheid", correct: false },
          ],
          "Patroon-herkenner. Niet meer, niet minder.",
          ["Denk terug aan les 1.", "Geen denker, geen voeler.", "Hint: 'patronen'."],
        ),
        quiz: [
          {
            question: "Wat hoort in de STOP-zone?",
            options: ["Lievelingsdier", "Adres", "Voornaam van klasgenoot"],
            correctIndex: 1,
            why: "Adres, telefoon, wachtwoord. Altijd STOP.",
          },
          {
            question: "Stem in een telefoontje klinkt als opa , dus is het opa.",
            options: ["Waar", "Niet waar , terugbellen op bekend nummer"],
            correctIndex: 1,
            why: "AI kan stemmen nabootsen.",
          },
          {
            question: "AI zegt iets gemeens , wat doe je eerst?",
            options: ["Terug gemeen doen", "Scherm dicht en volwassene halen", "Het delen"],
            correctIndex: 1,
            why: "Stop. Volwassene erbij. Jij hoeft niks terug te zeggen.",
          },
        ],
        reflection: "Wereld 1 gehaald. Je verdient het Schild van Waakzaamheid. VEILIG-baas!",
      },
    ],
  },

  // =================================================================
  // WERELD 2 , SLIM (Kompas van Helderheid)
  // =================================================================
  {
    id: 2,
    pillar: "smart",
    name: "SLIM",
    tagline: "Stel betere vragen en check wat AI je vertelt",
    emoji: "🧭",
    badgeName: "Kompas van Helderheid",
    lessons: [
      // ---------- Les 9 ----------
      {
        id: "2.1",
        worldId: 2,
        pillar: "smart",
        title: "AI is een gokker, geen wijsneus",
        emoji: "🎲",
        sparkIntro: "Ken je die ene klasgenoot die overal een mening over heeft, ook over wat ie niet kent? Zo is AI soms.",
        fact: "AI voorspelt woord voor woord wat WAARSCHIJNLIJK komt. Het weet niks zeker, maar klinkt altijd zelfverzekerd.",
        interactive: sort(
          "Zeker-of-Gok? Waar zou AI hier op gokken?",
          ["📚 Vrij zeker", "🎲 AI gokt waarschijnlijk"],
          [
            { label: "Parijs is de hoofdstad van Frankrijk", bucket: 0 },
            { label: "Er wonen precies 2.847.333 mensen in Parijs", bucket: 1 },
            { label: "Honden hebben 4 poten", bucket: 0 },
            { label: "Wat er gisteren in het nieuws was", bucket: 1 },
            { label: "Wie de wedstrijd vorige week won", bucket: 1 },
            { label: "De zon is een ster", bucket: 0 },
          ],
          [
            "Algemene feiten = vaak goed.",
            "Precieze cijfers en actueel nieuws = vaak gokken.",
            "AI is getraind op oude tekst , vandaag weet ie niet.",
          ],
        ),
        quiz: [
          {
            question: "Hoe geeft AI een antwoord?",
            options: [
              "Het weet alles",
              "Het voorspelt woord voor woord wat waarschijnlijk komt",
              "Het zoekt in een boek",
            ],
            correctIndex: 1,
            why: "Woord voor woord voorspellen. Soms raak, soms mis.",
          },
          {
            question: "AI klinkt heel zeker , dus klopt het zeker.",
            options: ["Waar", "Niet waar , toon ≠ waarheid"],
            correctIndex: 1,
            why: "AI klinkt ALTIJD zeker. Ook als het fout zit.",
          },
          {
            question: "Waar is AI het MINST betrouwbaar?",
            options: ["Algemene verhalen", "Precieze cijfers en datums", "Spellen verzinnen"],
            correctIndex: 1,
            why: "Cijfers, actueel nieuws en precieze namen: daar struikelt AI.",
          },
        ],
        reflection: "AI is een zelfverzekerde gokker. Nu je dat weet, ben je de baas.",
      },
      // ---------- Les 10 ----------
      {
        id: "2.2",
        worldId: 2,
        pillar: "smart",
        title: "De hallucinatie-val",
        emoji: "🌫️",
        sparkIntro: "AI vertelt soms over boeken die niet bestaan en mensen die nooit hebben geleefd. Dat heet hallucineren.",
        fact: "Hallucineren = AI verzint iets dat klinkt als waarheid. Tip: te specifiek? Check het.",
        interactive: sort(
          "Echt of verzonnen door AI?",
          ["✅ Echt", "🌫️ Hallucinatie"],
          [
            { label: "In 1969 landden mensen op de maan", bucket: 0 },
            { label: "Konijnen kunnen 10 meter hoog springen", bucket: 1 },
            { label: "Nederland heeft 14 provincies", bucket: 1 },
            { label: "De Eiffeltoren staat in Parijs", bucket: 0 },
            { label: "Boek 'De Roze Maan' van Jan de Vries (1987)", bucket: 1 },
          ],
          [
            "Zoek het op als je twijfelt.",
            "Klopt het met wat je al weet?",
            "Te specifiek of nooit van gehoord = vaak hallucinatie.",
          ],
        ),
        quiz: [
          {
            question: "Wat is een hallucinatie bij AI?",
            options: [
              "Een grapje van AI",
              "Iets verzinnen dat klinkt alsof het klopt",
              "Een plaatje laten zien",
            ],
            correctIndex: 1,
            why: "Iets verzinnen dat klinkt als waarheid. Die valstrik heet hallucinatie.",
          },
          {
            question: "Wat doe je bij twijfel over een AI-antwoord?",
            options: ["Meteen geloven", "Checken via zoekmachine of boek", "Doorsturen"],
            correctIndex: 1,
            why: "Check via zoekmachine, boek of een echte website.",
          },
          {
            question: "AI geeft altijd toe als het iets niet weet.",
            options: ["Waar", "Niet waar , AI probeert altijd een antwoord te geven"],
            correctIndex: 1,
            why: "Jij moet de check doen, AI doet het niet voor je.",
          },
        ],
        reflection: "Je bent nu een hallucinatie-jager. AI kan jou niet meer bedotten.",
      },
      // ---------- Les 11 ----------
      {
        id: "2.3",
        worldId: 2,
        pillar: "smart",
        title: "Vraag slim: WIE-WAT-HOE",
        emoji: "🎯",
        sparkIntro: "Vage vraag, vaag antwoord. Scherpe vraag, scherp antwoord. Zo simpel.",
        fact: "WIE (voor wie is het?) + WAT (wat precies?) + HOE (in welke vorm?) = 5x beter antwoord.",
        interactive: mc(
          "Welke vraag is het BEST volgens WIE-WAT-HOE?",
          [
            { label: "Leg sterren uit", correct: false },
            { label: "Sterren?", correct: false },
            { label: "Leg sterren uit aan mij, kind van 10, in 3 zinnen met voorbeeld", correct: true },
            { label: "Vertel over sterren alsjeblieft", correct: false },
          ],
          "Alle drie erin: WIE (kind van 10), WAT (leg sterren uit), HOE (3 zinnen + voorbeeld).",
          [
            "Zit er een leeftijd of doelgroep in? Dat is de WIE.",
            "Hoe lang of in welke vorm? Dat is de HOE.",
            "Het langste, meest specifieke antwoord wint hier.",
          ],
        ),
        quiz: [
          {
            question: "Waar staat WIE-WAT-HOE voor?",
            options: [
              "Leuk klinkende woorden",
              "Voor wie, wat precies, en in welke vorm",
              "Wie heeft het gemaakt",
            ],
            correctIndex: 1,
            why: "Voor wie, wat precies, en in welke vorm. Drie ankers.",
          },
          {
            question: "Wat hoort in een slimme prompt?",
            options: ["Gewoon raar doen", "Hoeveel stappen of zinnen", "Een emoji"],
            correctIndex: 1,
            why: "Hoeveel zinnen, welke stijl, welke vorm: hoe meer detail, hoe beter.",
          },
          {
            question: "Korte vage vragen geven meestal het BESTE antwoord.",
            options: ["Waar", "Niet waar , vaag in, vaag uit"],
            correctIndex: 1,
            why: "Detail in, detail uit. Andersom ook.",
          },
        ],
        reflection: "Je vraagt nu als een prof. Dit is je grootste AI-wapen.",
      },
      // ---------- Les 12 ----------
      {
        id: "2.4",
        worldId: 2,
        pillar: "smart",
        title: "Dubbelcheck in 3 stappen",
        emoji: "🔍",
        sparkIntro: "Je wil niet uren checken bij elk antwoord. Daarom heb je de 3-check. Snel en doeltreffend.",
        fact: "De 3-check: 1) Klinkt het LOGISCH? 2) Tweede BRON? 3) Wat zegt je GEVOEL? Twijfel = verder checken.",
        interactive: tap(
          "De 3-check stap voor stap:",
          [
            { label: "Stap 1: Klinkt het logisch met wat ik al weet?", reveal: "✅ Eerste filter. Je eigen brein is altijd je eerste check." },
            { label: "Stap 2: Andere bron , zoekmachine, boek, mens", reveal: "✅ Vergelijk met een betrouwbare bron." },
            { label: "Stap 3: Wat zegt mijn gevoel?", reveal: "✅ 'Te mooi om waar te zijn' = alarm." },
          ],
          [
            "Stap 1 is altijd: gebruik je EIGEN brein.",
            "Stap 2 is altijd: een ANDERE bron erbij halen.",
            "Stap 3 is altijd: wat zegt je gevoel?",
          ],
        ),
        quiz: [
          {
            question: "Wat is stap 1 van de 3-check?",
            options: [
              "Vraag aan vriendjes",
              "Klinkt het logisch met wat ik al weet?",
              "Delen op sociale media",
            ],
            correctIndex: 1,
            why: "Eerst je eigen logica. Kost 2 seconden, levert veel op.",
          },
          {
            question: "Wat is een GOEDE 'andere bron'?",
            options: ["Een andere AI die alles bevestigt", "Een echte website over het onderwerp", "Roddelpraat"],
            correctIndex: 1,
            why: "Echte websites, boeken of een expert. Een AI als check telt niet.",
          },
          {
            question: "Als AI iets zegt dat perfect klopt met wat ik wil horen, hoef ik niet te checken.",
            options: ["Waar", "Niet waar , JUIST dan wel"],
            correctIndex: 1,
            why: "'Te mooi om waar te zijn' is één van de grootste alarmbellen.",
          },
        ],
        reflection: "3-check in je vingers. Je gaat niet meer in valkuilen trappen.",
      },
      // ---------- Les 13 ----------
      {
        id: "2.5",
        worldId: 2,
        pillar: "smart",
        title: "Krachtwoorden voor betere prompts",
        emoji: "✨",
        sparkIntro: "Vandaag een mini-cheatsheet: 5 krachtwoorden die elk antwoord beter maken.",
        fact: "5 krachtwoorden: 'alsof ik 10 ben', 'geef 3 voorbeelden', 'maak een lijstje', 'waarom?', 'eenvoudiger?'",
        interactive: mc(
          "Welke zin gebruikt een krachtwoord-truc?",
          [
            { label: "Wat is het?", correct: false },
            { label: "Hm", correct: false },
            { label: "Leg uit alsof ik 10 ben, met 3 voorbeelden", correct: true },
            { label: "Gewoon vertellen", correct: false },
          ],
          "Twee krachtwoorden in één: 'alsof ik 10 ben' én '3 voorbeelden'. Scherp.",
          [
            "Welke zin is het LANGST en specifiekst?",
            "Welke zegt iets over leeftijd OF over hoeveelheid?",
            "Combinatie van twee krachtwoorden = winnaar.",
          ],
        ),
        quiz: [
          {
            question: "Welke is een krachtwoord?",
            options: ["Euhh", "Geef 3 voorbeelden", "Gewoon vertel"],
            correctIndex: 1,
            why: "'Geef voorbeelden' maakt antwoord concreet ipv vaag.",
          },
          {
            question: "Welk krachtwoord helpt als iets te moeilijk blijft?",
            options: ["'Wees deftig'", "'Kun je eenvoudiger?'", "'Maak het lang'"],
            correctIndex: 1,
            why: "Vraag om versimpeling , een echte krachtwoord-zin.",
          },
          {
            question: "Krachtwoord toevoegen maakt vraag langer maar meestal beter.",
            options: ["Waar", "Niet waar"],
            correctIndex: 0,
            why: "Slimme extra woorden = beter antwoord.",
          },
        ],
        reflection: "Je hebt nu een mini-toolkit. Gebruik 'm.",
      },
      // ---------- Les 14 ----------
      {
        id: "2.6",
        worldId: 2,
        pillar: "smart",
        title: "AI zegt iets raars: nu wat?",
        emoji: "🤨",
        sparkIntro: "Eerste regel: vertrouw je onderbuikgevoel. Als het raar voelt, is het vaak raar.",
        fact: "4-stappen plan: 1) Vraag opnieuw 2) Dubbelcheck 3) Volwassene erbij 4) STOP bij enge content.",
        interactive: sort(
          "Wat-zou-jij-doen?",
          ["🔁 Vraag opnieuw of check", "🚨 Stop & volwassene"],
          [
            { label: "AI zegt: 'Olifanten kunnen vliegen'", bucket: 0 },
            { label: "AI zegt iets griezeligs of dreigend", bucket: 1 },
            { label: "AI vraagt creditcardgegevens", bucket: 1 },
            { label: "AI begrijpt je vraag verkeerd", bucket: 0 },
            { label: "Antwoord klinkt onlogisch", bucket: 0 },
            { label: "AI begint over geweld of enge dingen", bucket: 1 },
          ],
          [
            "Onlogisch = vraag opnieuw of check.",
            "Eng of dreigend = stop, volwassene.",
            "Geld of betaling = altijd volwassene.",
          ],
        ),
        quiz: [
          {
            question: "AI zegt iets dat niet logisch voelt. Wat is stap 1?",
            options: ["Het geloven", "Vraag nog eens, met andere woorden", "Boos worden"],
            correctIndex: 1,
            why: "Soms snapt AI je vraag verkeerd. Eerst anders vragen.",
          },
          {
            question: "Welke hoort in je plan bij rare AI-antwoorden?",
            options: ["Gewoon geloven", "Dubbelcheck in zoekmachine", "Doorsturen naar vrienden"],
            correctIndex: 1,
            why: "Dubbelcheck en bij iets serieus: volwassene erbij.",
          },
          {
            question: "Bij gemene of dreigende AI moet je eerst antwoorden.",
            options: ["Waar", "Niet waar , scherm dicht, volwassene"],
            correctIndex: 1,
            why: "Jij hoeft je niet te verdedigen tegen een AI.",
          },
        ],
        reflection: "Je hebt nu een noodplan. AI is niet de baas, jij bent.",
      },
      // ---------- Les 15 ----------
      {
        id: "2.7",
        worldId: 2,
        pillar: "smart",
        title: "Verschillende AI's, verschillende sterktes",
        emoji: "🌐",
        sparkIntro: "Mensen zeggen vaak 'de AI'. Maar er zijn er heel veel , net als scholen.",
        fact: "Bekende AI's: ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Copilot (Microsoft).",
        interactive: sort(
          "Is dit een AI of een gewone app?",
          ["🤖 Een AI", "📱 Een app (geen AI zelf)"],
          [
            { label: "ChatGPT", bucket: 0 },
            { label: "WhatsApp", bucket: 1 },
            { label: "Claude", bucket: 0 },
            { label: "Gmail", bucket: 1 },
            { label: "Gemini", bucket: 0 },
            { label: "Minecraft", bucket: 1 },
            { label: "Copilot", bucket: 0 },
          ],
          [
            "ChatGPT, Claude, Gemini, Copilot zijn AI's.",
            "WhatsApp en Gmail zijn apps die soms AI gebruiken.",
            "Een spel als Minecraft is geen AI.",
          ],
        ),
        quiz: [
          {
            question: "Welke is een AI?",
            options: ["WhatsApp", "Claude", "Gmail", "Een pen"],
            correctIndex: 1,
            why: "Claude is een AI, gemaakt door Anthropic.",
          },
          {
            question: "Welke is een bekende AI?",
            options: ["Roblox", "Gemini", "Minecraft"],
            correctIndex: 1,
            why: "Gemini is van Google.",
          },
          {
            question: "Alle AI's geven altijd exact hetzelfde antwoord.",
            options: ["Waar", "Niet waar , ze verschillen"],
            correctIndex: 1,
            why: "Ze zijn verschillend getraind. Vergelijken kan slim zijn.",
          },
        ],
        reflection: "Je kent de AI-familie. Vergelijk ze voor betere antwoorden.",
      },
      // ---------- Les 16 , Baas-test ----------
      {
        id: "2.8",
        worldId: 2,
        pillar: "smart",
        title: "Wereld 2 Baas-test",
        emoji: "🧭",
        bossTest: true,
        sparkIntro: "Je hebt heel wat in je gereedschapskist: WIE-WAT-HOE, 3-check, krachtwoorden, hallucinatie-radar. Tijd om het te laten zien.",
        fact: "Geen nieuwe stof. Slaag en je verdient het Kompas van Helderheid.",
        interactive: mc(
          "Wat is een hallucinatie?",
          [
            { label: "Een droom", correct: false },
            { label: "AI die iets verzint dat niet klopt", correct: true },
            { label: "Een soort plaatje", correct: false },
            { label: "Een grappige film", correct: false },
          ],
          "AI verzint iets dat klinkt alsof het klopt. Valstrik nr. 1.",
          ["Denk terug aan les 2.2.", "Het komt door HOE AI werkt: gokken.", "Eindigt op '-natie'."],
        ),
        quiz: [
          {
            question: "Wat gebruik je voor een SLIMME vraag?",
            options: ["Huilen", "WIE-WAT-HOE", "Stampvoeten"],
            correctIndex: 1,
            why: "WIE (voor wie), WAT (wat precies), HOE (in welke vorm).",
          },
          {
            question: "AI klinkt zelfverzekerd , dus klopt het altijd.",
            options: ["Waar", "Niet waar , toon zegt niks over waarheid"],
            correctIndex: 1,
            why: "Altijd checken, ook bij zelfverzekerde antwoorden.",
          },
          {
            question: "Goede tweede bron om mee te checken?",
            options: ["Een echte website of boek", "Een andere AI die alles bevestigt", "Roddel"],
            correctIndex: 0,
            why: "Echte bronnen, niet AI op AI.",
          },
        ],
        reflection: "Wereld 2 uit. Je verdient het Kompas van Helderheid. SLIM-baas!",
      },
    ],
  },

  // =================================================================
  // WERELD 3 , STERKER (Ster van Meesterschap)
  // =================================================================
  {
    id: 3,
    pillar: "stronger",
    name: "STERKER",
    tagline: "Gebruik AI als studiemaatje, niet als sluiproute",
    emoji: "⭐",
    badgeName: "Ster van Meesterschap",
    lessons: [
      // ---------- Les 17 ----------
      {
        id: "3.1",
        worldId: 3,
        pillar: "stronger",
        title: "Tutor of sluiproute? Jij kiest",
        emoji: "🛤️",
        sparkIntro: "Eerlijke vraag: ooit AI je huiswerk laten doen? Geen oordeel. Maar dan leert je brein niks.",
        fact: "Tutor-gebruik = jij denkt mee, AI helpt. Sluiproute = AI denkt, jij kopieert. Alleen tutor maakt slimmer.",
        interactive: sort(
          "Tutor of sluiproute?",
          ["🧑‍🏫 Tutor (slim)", "🏃 Sluiproute (lui)"],
          [
            { label: "Ik kopieer wat AI schreef", bucket: 1 },
            { label: "Ik vraag AI om uitleg en schrijf zelf", bucket: 0 },
            { label: "Ik vraag AI om voorbeelden voor mijn eigen versie", bucket: 0 },
            { label: "Ik laat AI mijn werkstuk maken", bucket: 1 },
            { label: "Ik gebruik AI als oefenmaatje", bucket: 0 },
            { label: "Ik typ AI-antwoord over op het toetsblad", bucket: 1 },
          ],
          [
            "Doe IK het denken? = Tutor.",
            "Doet AI het werk en kopieer ik? = Sluiproute.",
            "Eén check: leer ik er iets van?",
          ],
        ),
        quiz: [
          {
            question: "Verschil tutor vs sluiproute?",
            options: [
              "Tutor kost geld",
              "Bij tutor leer je zelf, bij sluiproute niet",
              "Geen verschil",
            ],
            correctIndex: 1,
            why: "Tutor = jij denkt mee. Sluiproute = AI denkt, jij kopieert.",
          },
          {
            question: "Welke is tutor-gebruik?",
            options: ["Kopieer AI's antwoord", "Vraag AI om uitleg, maak zelf", "Laat AI je huiswerk doen"],
            correctIndex: 1,
            why: "Alles waar JIJ nog denkt = tutor.",
          },
          {
            question: "AI laat verhaal schrijven en inleveren = ik leer iets.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Je leerde alleen 'kopieer'. Volgende keer: vraag om hulp, schrijf zelf.",
          },
        ],
        reflection: "Je hebt zonet een levensles geleerd, niet alleen een AI-les.",
      },
      // ---------- Les 18 ----------
      {
        id: "3.2",
        worldId: 3,
        pillar: "stronger",
        title: "Brainstormen zonder kopiëren",
        emoji: "💡",
        sparkIntro: "AI is een ideeën-kraan. Jij bent de kok. De kraan vult je kom, jij maakt het eten.",
        fact: "3 brainstorm-trucs: vraag VEEL ideeën, vraag GEKKE variaties, kies JOUW favoriet en maak 'm eigen.",
        interactive: mc(
          "Hoe gebruik je AI HET BEST om te brainstormen?",
          [
            { label: "Vraag 1 idee en neem dat", correct: false },
            { label: "Vraag veel ideeën, kies je favoriet, maak die eigen", correct: true },
            { label: "Vraag het hele werkstuk", correct: false },
            { label: "Kopieer alles", correct: false },
          ],
          "Veel ideeën, jouw keuze, jouw twist. Zo word je een eigen maker.",
          [
            "Hoe meer ideeën, hoe meer keuze.",
            "Maar niet kopiëren!",
            "JIJ moet de favoriet kiezen en eigen maken.",
          ],
        ),
        quiz: [
          {
            question: "Wat maakt een brainstorm goed?",
            options: ["Stop na 1 idee", "Vraag om hoeveelheid en gekke variaties", "Kopieer letterlijk"],
            correctIndex: 1,
            why: "Veel + gek + jouw keuze.",
          },
          {
            question: "Wat doe je nadat AI je 10 ideeën gaf?",
            options: ["Letterlijk kopiëren", "Kies wat JIJ leuk vindt en maak eigen", "Niks"],
            correctIndex: 1,
            why: "Pak de kern, voeg jouw draai toe.",
          },
          {
            question: "AI-ideeën mag je altijd 1-op-1 kopiëren.",
            options: ["Waar", "Niet waar , dan is het niet jouw idee"],
            correctIndex: 1,
            why: "Kopiëren = niet jouw werk.",
          },
        ],
        reflection: "Je bent een brainstorm-ninja. Gebruik AI als startsein, niet als eindpunt.",
      },
      // ---------- Les 19 ----------
      {
        id: "3.3",
        worldId: 3,
        pillar: "stronger",
        title: "AI als uitleg-maatje",
        emoji: "📖",
        sparkIntro: "In een klas van 30 krijg je 1 uitleg. Met AI krijg je er 10. Op jouw tempo. Geen oordelen.",
        fact: "Uitleg-formule: 'Leg [onderwerp] uit alsof ik 10 ben, met voorbeeld uit het echte leven, in 4 zinnen.'",
        interactive: mc(
          "Je snapt breuken niet. Wat is je BESTE eerste vraag?",
          [
            { label: "Opgeven", correct: false },
            { label: "Geef gewoon het antwoord", correct: false },
            { label: "Leg breuken uit alsof ik 10 ben, met voorbeeld", correct: true },
            { label: "Bij AI klagen", correct: false },
          ],
          "Maak het specifiek. Leeftijd + voorbeeld. Beste zet.",
          [
            "Vraag NIET om het antwoord.",
            "Vraag om UITLEG, op jouw niveau.",
            "Met een 'voorbeeld' wordt het concreet.",
          ],
        ),
        quiz: [
          {
            question: "Welke is een goede uitleg-vraag?",
            options: ["'Zeg maar wat'", "'Leg stap voor stap uit'", "'Doe maar'"],
            correctIndex: 1,
            why: "Specifiek en stapsgewijs werkt.",
          },
          {
            question: "Wat doe je als je de eerste uitleg niet snapt?",
            options: ["Opgeven", "Vraag: 'Leg eenvoudiger uit, met ander voorbeeld'", "Boos worden"],
            correctIndex: 1,
            why: "Je bepaalt het tempo. Vraag opnieuw.",
          },
          {
            question: "Als ik de eerste uitleg niet snap, ben ik dom.",
            options: ["Waar", "Niet waar , vraag een andere uitleg"],
            correctIndex: 1,
            why: "Jouw brein is prima. AI moet anders uitleggen.",
          },
        ],
        reflection: "AI is nu je oneindig-geduldige tutor. Geen klas ter wereld heeft dat.",
      },
      // ---------- Les 20 ----------
      {
        id: "3.4",
        worldId: 3,
        pillar: "stronger",
        title: "AI als oefen-maatje",
        emoji: "🎯",
        sparkIntro: "Proefwerk morgen? Laat AI je overhoren. Gratis bijles zonder afspraak.",
        fact: "Oefen-formule: 'Geef me 5 vragen over X. Stel ze één voor één en wacht op mijn antwoord voor je feedback geeft.'",
        interactive: mc(
          "Hoe vraag je AI om jou te overhoren?",
          [
            { label: "'Geef het antwoord'", correct: false },
            { label: "'Doe iets leuks'", correct: false },
            { label: "'Stel me 5 vragen over X en wacht op mijn antwoord'", correct: true },
            { label: "'Maak mijn werk'", correct: false },
          ],
          "Vragen eerst, antwoord van jou, feedback daarna. De hele truc.",
          [
            "JIJ moet eerst antwoorden, niet AI.",
            "Het draait om feedback NA jouw poging.",
            "Een aantal vragen, niet één.",
          ],
        ),
        quiz: [
          {
            question: "Waarom werkt overhoren beter dan alleen lezen?",
            options: ["Het is makkelijker", "Je doet iets actief en merkt wat je niet weet", "Je raadt lekker"],
            correctIndex: 1,
            why: "Actief, zelfkennis, beter geheugen.",
          },
          {
            question: "Een vraag fout hebben bij AI is...",
            options: ["Slecht", "Leren , elke fout is een les", "Eng"],
            correctIndex: 1,
            why: "Fouten maken IS leren.",
          },
          {
            question: "Ik mag AI vragen mij te overhoren over schoolwerk.",
            options: ["Ja, super idee", "Nee, dat is spieken"],
            correctIndex: 0,
            why: "Overhoren = oefenen. Top tutor-gebruik.",
          },
        ],
        reflection: "Je hebt nu een gratis bijlesdocent 24/7. Cash dat in.",
      },
      // ---------- Les 21 ----------
      {
        id: "3.5",
        worldId: 3,
        pillar: "stronger",
        title: "Maak iets eigens met AI",
        emoji: "🎨",
        sparkIntro: "Hier komt het mooie deel: SAMEN maken met AI. Niet AI iets laten maken, maar samen.",
        fact: "Maker-formule: 1) Jij hebt het IDEE. 2) AI geeft BOUWSTENEN. 3) Jij KIEST. 4) Jij MAAKT het zelf.",
        interactive: mc(
          "Wie is de echte maker als jij met AI een verhaal maakt?",
          [
            { label: "AI", correct: false },
            { label: "Niemand", correct: false },
            { label: "Jij, als jij kiest en zelf schrijft", correct: true },
            { label: "Je ouders", correct: false },
          ],
          "Jij. Omdat jij kiest, combineert en er iets eigens van maakt. AI is gereedschap.",
          [
            "Wie heeft de keuzes gemaakt?",
            "Wie heeft het uiteindelijk geschreven?",
            "Een schilder die verf van iemand anders gebruikt is nog steeds de schilder.",
          ],
        ),
        quiz: [
          {
            question: "Wat hoort bij 'samen maken met AI'?",
            options: ["Jij kopieert alles", "Jij hebt het idee en AI geeft bouwstenen", "AI doet alles"],
            correctIndex: 1,
            why: "Idee van jou, bouwstenen van AI, jij maakt eigen.",
          },
          {
            question: "Wat is GEEN onderdeel van 'samen maken'?",
            options: ["Jij schrijft zelf", "Jij kiest en combineert", "Jij kopieert letterlijk"],
            correctIndex: 2,
            why: "Kopiëren is geen maken.",
          },
          {
            question: "AI gaf bouwstenen, ik koos en schreef zelf , is het van mij?",
            options: ["Ja, jouw werk", "Nee"],
            correctIndex: 0,
            why: "Net als een schilder met verf van een ander. Nog steeds jouw werk.",
          },
        ],
        reflection: "Je bent een mede-maker, geen kopieer-kid. Groot verschil.",
      },
      // ---------- Les 22 ----------
      {
        id: "3.6",
        worldId: 3,
        pillar: "stronger",
        title: "AI bij rekenen: vraag de weg",
        emoji: "🧮",
        sparkIntro: "Eerlijk: AI kán je sommen oplossen. Maar dan leert je brein niks , en het komt terug op de toets.",
        fact: "Rekenen-regel: NOOIT het antwoord, ALTIJD de weg. Vraag 'hoe?' in plaats van 'wat is?'.",
        interactive: sort(
          "Tutor-vraag of sluiproute-vraag bij rekenen?",
          ["🧑‍🏫 Tutor", "🏃 Sluiproute"],
          [
            { label: "'Hoe los ik 34+29 op?'", bucket: 0 },
            { label: "'Wat is 34+29?'", bucket: 1 },
            { label: "'Leg uit met stappen'", bucket: 0 },
            { label: "'Doe het voor me'", bucket: 1 },
            { label: "'Kun je checken of mijn antwoord klopt?'", bucket: 0 },
            { label: "'Geef het antwoord op vraag 5'", bucket: 1 },
          ],
          [
            "'Hoe' en 'leg uit' = tutor.",
            "'Wat is' en 'doe' = sluiproute.",
            "Check vragen mag , dat is geen kopiëren.",
          ],
        ),
        quiz: [
          {
            question: "Wat is de rekenen-regel bij AI?",
            options: ["Altijd antwoord vragen", "Vraag de weg, niet het antwoord", "Nooit AI gebruiken"],
            correctIndex: 1,
            why: "De weg. Stappen. Daar groeit je brein van.",
          },
          {
            question: "Welke is een tutor-vraag?",
            options: ["'Doe het voor me'", "'Leg uit met stappen'", "'Wat is het antwoord?'"],
            correctIndex: 1,
            why: "Stappen leren = tutor.",
          },
          {
            question: "AI mijn antwoord laten checken = kopiëren.",
            options: ["Waar", "Niet waar , checken is slim, dat is tutor"],
            correctIndex: 1,
            why: "Jij rekent, AI controleert. Slim.",
          },
        ],
        reflection: "Je bent nu een rekenen-baas die AI op de slimme manier gebruikt.",
      },
      // ---------- Les 23 ----------
      {
        id: "3.7",
        worldId: 3,
        pillar: "stronger",
        title: "De 10x slimmer-formule",
        emoji: "🚀",
        sparkIntro: "Tijd voor je cheat-kaart. Onthoud dit ene ding en je zit goed. Dit is 'm.",
        fact: "10x-formule (4 stappen): DOEL → VRAAG → DOE ZELF → CHECK. Elke keer als je AI gebruikt.",
        interactive: tap(
          "De 4 stappen van de 10x-formule:",
          [
            { label: "1) DOEL , wat wil ik leren?", reveal: "✅ Zonder doel is AI gebruiken een gokwerkje." },
            { label: "2) VRAAG , WIE-WAT-HOE + krachtwoord", reveal: "✅ Slimme vraag = slim antwoord." },
            { label: "3) DOE ZELF , schrijf/los zelf op", reveal: "✅ Jouw brein moet werken." },
            { label: "4) CHECK , klopt het wat AI zei?", reveal: "✅ 3-check erbij." },
          ],
          [
            "Stap 1 begint altijd bij JOUW doel.",
            "Pas daarna stel je een vraag.",
            "Eindig altijd met een check.",
          ],
        ),
        quiz: [
          {
            question: "Wat is de EERSTE stap in de 10x-formule?",
            options: ["Een vraag stellen", "Beslissen wat je wilt leren (doel)", "Antwoord kopiëren"],
            correctIndex: 1,
            why: "Doel eerst. Anders is elke AI-interactie gokken met je tijd.",
          },
          {
            question: "Wat zit er in de formule?",
            options: ["Klagen", "Doel, Vraag, Doe zelf, Check", "Doel en Klaar"],
            correctIndex: 1,
            why: "4 stappen. Geen klagen, niet stoppen na 1.",
          },
          {
            question: "De 10x-formule werkt alleen bij rekenen.",
            options: ["Waar", "Niet waar , werkt overal"],
            correctIndex: 1,
            why: "Rekenen, schrijven, leren, maken. Universeel.",
          },
        ],
        reflection: "Als je deze formule elke keer gebruikt, word je echt 10x slimmer. Geen grapje.",
      },
      // ---------- Les 24 , Eindbaas ----------
      {
        id: "3.8",
        worldId: 3,
        pillar: "stronger",
        title: "Eindbaas-test & het diploma",
        emoji: "🏆",
        bossTest: true,
        sparkIntro: "Dit is het. Laatste level. Je bent iemand anders dan toen je begon. Echt waar.",
        fact: "Slaag deze eindbaas en je verdient de Ster van Meesterschap én je diploma op naam.",
        interactive: mc(
          "Wat is AI, in één zin?",
          [
            { label: "Een denkend wezen met gevoelens", correct: false },
            { label: "Een patroon-herkenner die woord voor woord voorspelt", correct: true },
            { label: "Een magische doos", correct: false },
            { label: "Een zoekmachine", correct: false },
          ],
          "De kern, in één zin. Onthoud 'm voor altijd.",
          ["Denk terug aan les 1.1.", "Geen brein, geen magie.", "Hint: 'patroon'."],
        ),
        quiz: [
          {
            question: "Welke 3 superkrachten heb je geleerd?",
            options: ["Veilig, Rijk, Slim", "Veilig, Slim, Sterker", "Veilig, Beroemd, Sterker"],
            correctIndex: 1,
            why: "De drie werelden. Jouw superkrachten.",
          },
          {
            question: "Wie is de baas: jij of AI?",
            options: ["AI is de baas", "Ik ben de baas over AI"],
            correctIndex: 1,
            why: "Honderd procent. Dat is wat je hebt geleerd.",
          },
          {
            question: "Wat is de eerste stap van de 10x-formule?",
            options: ["Vraag stellen", "Doel kiezen", "Check"],
            correctIndex: 1,
            why: "Altijd doel eerst.",
          },
        ],
        reflection: "GEFELICITEERD! Je bent officieel een AI Smart Kid. Je diploma wacht.",
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

export function getNextLesson(id: string): Lesson | undefined {
  const idx = ALL_LESSONS.findIndex((l) => l.id === id);
  if (idx < 0 || idx >= ALL_LESSONS.length - 1) return undefined;
  return ALL_LESSONS[idx + 1];
}

// Final test: 12 questions sampled from across all 24 lessons.
export const FINAL_TEST_QUESTIONS: QuizQuestion[] = [
  ALL_LESSONS[0].quiz[0],   // 1.1
  ALL_LESSONS[1].quiz[0],   // 1.2
  ALL_LESSONS[2].quiz[0],   // 1.3
  ALL_LESSONS[3].quiz[0],   // 1.4
  ALL_LESSONS[4].quiz[0],   // 1.5
  ALL_LESSONS[5].quiz[0],   // 1.6
  ALL_LESSONS[8].quiz[0],   // 2.1
  ALL_LESSONS[9].quiz[0],   // 2.2
  ALL_LESSONS[10].quiz[0],  // 2.3
  ALL_LESSONS[16].quiz[0],  // 3.1
  ALL_LESSONS[18].quiz[0],  // 3.3
  ALL_LESSONS[22].quiz[0],  // 3.7
];
