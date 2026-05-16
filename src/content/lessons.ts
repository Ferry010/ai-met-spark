/**
 * AI met Spark , full lesson curriculum.
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
  /** STAP 4, korte overgang van Spark tussen wist-je-dat en theorie deel 2. */
  sparkMiddle?: string;
  /** STAP 5, tweede theorieblok (optioneel). */
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
      // ---------- Les 1.1 ----------
      {
        id: "1.1",
        worldId: 1,
        pillar: "safe",
        title: "Wat is AI eigenlijk?",
        emoji: "🤖",
        sparkIntro: "Hoi. Leuk dat je er bent. Denk eens aan de laatste keer dat TikTok precies dat ene filmpje liet zien waar jij zin in had. Bijna alsof TikTok al wist wat jij leuk vond. Dat is kunstmatige intelligentie aan het werk. Vandaag leg ik je rustig uit wat dat precies is. Zonder moeilijke woorden. Gewoon stap voor stap.",
        theoryIntro: "**Kunstmatige intelligentie is geen magie. En ook geen robot met gevoelens.**\n\nKunstmatige intelligentie betekent: een computer die patronen leert herkennen. Maar let op: dat woord intelligentie klinkt slimmer dan het is. Zo'n systeem denkt niet zoals jij denkt.\n\nWat het wel doet? Het zoekt patronen in enorm veel voorbeelden. Stel je voor dat je een computer miljoenen foto's van katten laat zien. Na een tijdje merkt die computer: hé, spitse oren, snorharen en vachtstreepjes komen vaak samen voor. Dan zal het wel een kat zijn.\n\nHeeft die computer ooit een kat geaaid? Nee. Heeft hij een lievelingskat? Ook niet. Weet hij echt wat een kat is? Nee.\n\nHij heeft vooral verbanden geleerd. Net zoals jij in Minecraft patronen leert herkennen. Jij weet bijvoorbeeld dat een oranje blokje en een groene knop samen iets met redstone kunnen doen. Niet omdat die blokken nadenken, maar omdat jij het patroon kent.",
        fact: "De eerste keer dat een computer een mens versloeg met schaken was in 1997. Die computer heette Deep Blue. Hij speelde niet zoals een mens speelt. Hij rekende vooral gigantisch veel zetten vooruit en koos daarna de beste. Dat is kunstmatige intelligentie in één zin: heel sterk in rekenen, zonder echt begrip.",
        sparkMiddle: "Oké, de basis heb je. Maar nu komt de grote vraag. Als kunstmatige intelligentie eigenlijk best simpel werkt, waarom lijkt het dan soms zo slim? Zeker als een chatassistent een goed antwoord geeft. Laten we daar samen naar kijken.",
        theoryDeep: "**Waarom kunstmatige intelligentie slim lijkt**\n\nDat komt omdat zulke systemen niet met alleen wat kattenfoto's zijn getraind, maar met ongelooflijk veel tekst van internet. Denk aan encyclopedieën, boeken, blogs en forums. Een enorme berg zinnen dus.\n\nAls jij een vraag stelt, voorspelt het systeem welk antwoord het beste past bij alles wat het eerder heeft gezien. Het kent het antwoord niet zoals jij iets kunt weten. Het maakt een heel sterke gok op basis van patronen.\n\nVaak gaat dat goed. Soms helemaal niet. En dit is belangrijk om te onthouden: kunstmatige intelligentie klinkt vaak zelfverzekerd, ook als het twijfelt of fout zit. Daarom moet jij zelf blijven nadenken.\n\nNog iets handigs om te weten: er bestaan verschillende systemen van verschillende bedrijven. Ze zijn niet allemaal op dezelfde manier getraind. Daarom kunnen antwoorden ook verschillen.",
        interactive: sort(
          "Tik elk kaartje aan en kies de juiste zone: 'Dit is AI' of 'Dit is geen AI'.",
          ["🤖 Dit is AI", "📦 Dit is geen AI"],
          [
            { label: "TikTok die jouw lievelingsfilmpjes kiest", bucket: 0 },
            { label: "De rekenmachine op je telefoon", bucket: 1 },
            { label: "Snapchat-filter dat je gezicht herkent", bucket: 0 },
            { label: "Een papieren plattegrond", bucket: 1 },
            { label: "YouTube die 'wat je hierna moet kijken' voorstelt", bucket: 0 },
            { label: "De kookwekker in de keuken", bucket: 1 },
            { label: "ChatGPT die je huiswerk uitlegt", bucket: 0 },
            { label: "Spellingscontrole in Word (die rode onderstreping)", bucket: 0 },
          ],
        ),
        summary: [
          "Kunstmatige intelligentie herkent patronen. Het denkt niet zoals een mens, maar voorspelt op basis van heel veel voorbeelden.",
          "Het klinkt vaak zeker van zichzelf, ook als het eigenlijk gokt. Daarom blijf jij zelf nadenken.",
          "Je komt het overal tegen, bijvoorbeeld in TikTok, YouTube, games en Snapchat-filters.",
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
            why: "Precies. AI leert door patronen te zien in miljoenen voorbeelden. Denken is het niet.",
          },
          {
            question: "AI heeft gevoelens, net als jij.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Nee. AI kan doen alsof, maar voelt niks. Het is code. Net zoals een rekenmachine niks voelt als je 5x5 intypt.",
          },
          {
            question: "Welke van deze dingen zijn AI? Tik op alles wat klopt.",
            options: [
              "TikTok-voorstellen",
              "Een rekenmachine",
              "Snapchat-filters",
              "Een papieren boek",
              "YouTube 'wat je hierna kijkt'",
            ],
            correctIndex: 0,
            why: "TikTok, Snapchat-filters en YouTube-voorstellen werken allemaal met AI. Boeken en rekenmachines niet. (Juist: TikTok-voorstellen, Snapchat-filters, YouTube 'wat je hierna kijkt'.)",
          },
        ],
        reflection: "Je weet nu wat AI écht is. Vanaf nu zie je het voor wat het is: geen magie.",
      },
      // ---------- Les 1.2 ----------
      {
        id: "1.2",
        worldId: 1,
        pillar: "safe",
        title: "Jouw geheimen zijn van jou",
        emoji: "🤐",
        sparkIntro: "Hoi! Kleine test om mee te beginnen. Stel je zit met 20 vreemden in een wachtkamer. Zou je dan hardop je adres voorlezen? Je telefoonnummer? Waarschijnlijk niet. Nou, dat is ongeveer wat er gebeurt als je die dingen aan AI typt. Niet precies zo. Maar genoeg om er samen even bij stil te staan. Deze les gaat over jouw geheimen.",
        theoryIntro: "**Wat gebeurt er eigenlijk met wat je intypt?**\n\nAls jij iets typt naar AI, gaat die tekst niet zomaar 'weg'. Het gaat naar een groot bedrijf. Soms wordt het bewaard. Soms wordt het gebruikt om de AI beter te maken. Soms kunnen mensen die bij dat bedrijf werken het inkijken.\n\nDat is geen samenzwering. Dat is gewoon hoe het werkt. Bedrijven moeten checken of hun AI goed werkt en geen rare dingen zegt. Dus ze lezen stukjes gesprekken mee.\n\nDat is fijn als je vraagt 'leg breuken uit'. Minder fijn als je intypt 'ik woon op Kerkstraat 12 in Dordrecht'. Want dan staat jouw adres ergens, en jij hebt er geen controle meer over.",
        fact: "In 2023 ontdekten werknemers van Samsung dat geheime bedrijfsinformatie die zij in ChatGPT hadden geplakt, terechtkwam in de training van de AI. Dat mocht helemaal niet. Het gebeurde toch. Nu is het verboden om ChatGPT bij Samsung te gebruiken voor werk. Volwassenen met goede banen, die ook gewoon fouten maken met AI. Jij bent niet de enige die hier over moet nadenken.",
        sparkMiddle: "Oké, genoeg doemdenken. Laten we praktisch worden. Wat mag wel, wat mag niet? Ik geef je een simpel trucje. Geen regels om uit je hoofd te leren, gewoon één vraag die je jezelf stelt.",
        theoryDeep: "**De wachtkamer-test**\n\nVanaf nu, als je iets aan AI wilt typen, stel jezelf één vraag: zou ik dit ook hardop zeggen in een wachtkamer vol vreemden?\n\nJe voornaam? Ja, dat zou je wel doen. Oké dus.\n\nJe lievelingskleur? Natuurlijk. Prima.\n\nJe thuisadres? Nee, hè. Die roep je niet zomaar door een wachtkamer. Dus ook niet aan AI.\n\nJe wachtwoord? Sowieso niet. Ook niet als je ouders dat nooit expliciet hebben verteld; je weet zelf al dat dat geheim is.\n\nEen foto van jezelf? Dat ligt eraan. Een foto waarop je in je schooluniform staat bij de ingang van je school? Nee. Te veel info bij elkaar.\n\nHet is niet ingewikkeld. Gewoon: 'zou een vreemde dit mogen weten?' Als het antwoord nee is, typ het niet.",
        interactive: sort(
          "Tik voor elk item aan: 'Dit kan wel' of 'Geheim houden'.",
          ["✅ Kan wel", "🔒 Geheim houden"],
          [
            { label: "De naam van je hond", bucket: 0 },
            { label: "Je volledige naam met achternaam", bucket: 1 },
            { label: "Je lievelings-game", bucket: 0 },
            { label: "Het wachtwoord van je ouders", bucket: 1 },
            { label: "Een vraag over hoe ruimteschepen werken", bucket: 0 },
            { label: "Je schoolnaam én je klas én je volledige naam", bucket: 1 },
            { label: "Dat je een tekening voor oma wil maken", bucket: 0 },
            { label: "Een foto van jezelf in je uniform bij de ingang van je school", bucket: 1 },
          ],
        ),
        summary: [
          "Wat je aan AI typt, wordt vaak bewaard. Behandel het als iets wat een vreemde kan lezen.",
          "De wachtkamer-test: zou je dit hardop zeggen tegen 20 vreemden? Zo niet, typ het niet.",
          "Je voornaam, hobby's en onderwerpen zijn meestal prima. Adres, telefoon, wachtwoorden en foto's met locatie zijn nooit oké.",
        ],
        quiz: [
          {
            question: "Wat mag je NOOIT aan AI typen?",
            options: [
              "Wat de hoofdstad van Spanje is",
              "Dat je graag voetbalt",
              "Je wachtwoord",
              "Een vraag over hoe een vulkaan werkt",
            ],
            correctIndex: 2,
            why: "Wachtwoorden, nooit. Niet aan AI, niet aan websites die je ouders niet vertrouwen, niet aan vreemden op school.",
          },
          {
            question: "Welke zijn te geheim om aan AI te typen?",
            options: [
              "Je favoriete kleur",
              "Je volledige naam plus school",
              "De naam van je kat",
              "Je thuisadres",
              "Je telefoonnummer",
            ],
            correctIndex: 1,
            why: "Naam plus school, adres en telefoonnummer zijn samen te herleiden. Kleur en kattennaam zijn prima. (Juist: Je volledige naam plus school, Je thuisadres, Je telefoonnummer.)",
          },
          {
            question: "Als ik aan AI zeg 'dit blijft tussen ons', dan houdt AI het ook echt geheim.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Nee. AI is geen dagboek. Wat je typt kan worden bewaard, ongeacht wat je erbij zegt. Beter: gewoon niet intypen.",
          },
        ],
        reflection: "Je geheimen zijn van jou. Punt. Dat is je eerste superkracht.",
      },
      // ---------- Les 1.3 ----------
      {
        id: "1.3",
        worldId: 1,
        pillar: "safe",
        title: "Wat is een goede vraag aan AI?",
        emoji: "💬",
        sparkIntro: "Hoi! Stel: je vraagt aan een vriend 'doe es iets leuks'. Wat krijg je dan? Waarschijnlijk een verwarde blik. Want 'iets leuks' kan van alles zijn. AI werkt net zo. Hoe duidelijker jij vraagt, hoe beter het antwoord. Vandaag oefenen we met dat ene trucje.",
        theoryIntro: "**Een vage vraag geeft een vaag antwoord**\n\nAls je aan AI vraagt 'vertel iets over honden', krijg je een saai stukje tekst dat overal over gaat. Niks bijzonders.\n\nMaar als je vraagt 'leg in 3 zinnen uit waarom honden kwispelen, voor iemand van 10', krijg je iets dat je echt kunt gebruiken.\n\nWat is het verschil? In de tweede vraag zit drie dingen: WIE leest het (iemand van 10), WAT wil je weten (waarom kwispelen) en HOE lang mag het zijn (3 zinnen). Dat heet een goede prompt.",
        fact: "Mensen die goed zijn in vragen stellen aan AI krijgen tot 10 keer betere antwoorden. Het is een echte vaardigheid geworden. Sommige bedrijven betalen mensen alleen maar om goede prompts te schrijven. Die baan bestond 5 jaar geleden nog niet eens.",
        sparkMiddle: "Oké. Ik geef je een mini-trucje dat je voor élke vraag aan AI kunt gebruiken. Drie woordjes. Klaar.",
        theoryDeep: "**Het trucje: VOOR WIE, WAT, HOE LANG**\n\nVoor je iets aan AI vraagt, denk even na over deze drie:\n\n1. VOOR WIE is het antwoord? (voor mij van 10, voor mijn oma, voor mijn juf)\n2. WAT wil je precies weten? (niet 'iets over', maar 'waarom' of 'hoe' of 'wat is het verschil tussen')\n3. HOE LANG of in welke vorm? (3 zinnen, een lijstje van 5, een rijmpje, een grapje)\n\nDus in plaats van 'vertel over de ruimte', vraag je: 'Leg voor iemand van 10 in 5 zinnen uit waarom de hemel blauw is.'\n\nHet voelt als meer typen. Dat is het ook. Maar je krijgt veel beter antwoord. En je hoeft niet drie keer opnieuw te vragen.",
        interactive: sort(
          "Tik op elke vraag en kies: is dit een vage of een goede vraag aan AI?",
          ["🎯 Goede vraag", "🌫️ Vage vraag"],
          [
            { label: "Vertel iets over voetbal", bucket: 1 },
            { label: "Leg in 3 zinnen uit waarom een bal rolt, voor iemand van 10", bucket: 0 },
            { label: "Help me", bucket: 1 },
            { label: "Geef me 5 ideeën voor een verjaardagscadeau voor mijn oma die van puzzels houdt", bucket: 0 },
            { label: "Iets over dieren", bucket: 1 },
            { label: "Schrijf een grappig rijmpje van 4 regels over mijn hond Bobby", bucket: 0 },
            { label: "Maak het beter", bucket: 1 },
            { label: "Maak van deze zin een vrolijkere versie: 'Het is koud buiten.'", bucket: 0 },
          ],
        ),
        summary: [
          "Een vage vraag geeft een vaag antwoord. Een duidelijke vraag geeft een bruikbaar antwoord.",
          "Gebruik het trucje VOOR WIE, WAT, HOE LANG. Drie dingen erbij zetten.",
          "Het voelt als meer typen, maar je krijgt veel beter antwoord en je hoeft minder vaak te herproberen.",
        ],
        quiz: [
          {
            question: "Welke vraag geeft het beste antwoord?",
            options: [
              "Vertel iets over de zee",
              "Leg voor iemand van 10 in 4 zinnen uit waarom de zee zout is",
              "Zee?",
              "Schrijf een verhaal",
            ],
            correctIndex: 1,
            why: "Daar zit alles in: voor wie, wat precies en hoe lang. AI weet meteen wat het moet maken.",
          },
          {
            question: "Wat zijn de drie dingen uit het trucje?",
            options: [
              "Voor wie, wat, hoe lang",
              "Snel, kort, leuk",
              "Vraag, antwoord, klaar",
              "Wie, wat, waar",
            ],
            correctIndex: 0,
            why: "Voor wie het antwoord is, wat je precies wilt weten, en hoe lang of in welke vorm.",
          },
          {
            question: "Een korte vage vraag is altijd beter, want AI snapt het toch wel.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Niet waar. Hoe duidelijker jij vraagt, hoe beter AI je kan helpen. AI is geen gedachtelezer.",
          },
        ],
        reflection: "Je weet nu hoe je AI beter laat werken voor jou. Klein trucje, groot verschil.",
      },
      // ---------- Les 1.4 ----------
      {
        id: "1.4",
        worldId: 1,
        pillar: "safe",
        title: "AI klinkt altijd zeker, ook als het fout zit",
        emoji: "🤔",
        sparkIntro: "Hoi! Ken je iemand in je klas die ALTIJD klinkt alsof hij het zeker weet? Ook als hij eigenlijk geen idee heeft? AI doet precies hetzelfde. Het klinkt zelfverzekerd, ook als het zit te gokken. Vandaag leer je dat herkennen. Belangrijk dingetje.",
        theoryIntro: "**AI praat altijd alsof het de baas is**\n\nAls jij iets niet weet, zeg je 'eh, ik weet het niet zeker'. AI doet dat niet. AI antwoordt altijd met een vaste stem, alsof het 100% zeker is. Ook als het maar gokt.\n\nWaarom? AI is gemaakt om vloeiende antwoorden te geven. Niet om te twijfelen. Dus het kiest gewoon het meest waarschijnlijke antwoord en zet er een mooi zinnetje omheen. Of dat antwoord nu klopt of niet.\n\nDat betekent: alleen omdat AI iets zelfverzekerd zegt, is het nog niet waar. Punt.",
        fact: "In 2023 vroeg een advocaat in Amerika aan ChatGPT om voorbeelden te zoeken voor een rechtszaak. Hij kreeg een mooie lijst. Hij gebruikte het in de rechtbank. De rechter checkte het: alle voorbeelden waren verzonnen door AI. De advocaat kreeg een boete. AI klonk supér zeker, maar had alles uit zijn duim gezogen.",
        sparkMiddle: "Klinkt eng? Het is meer een gewoonte die je traint. Eén simpele check, en je bent al veel verder dan de meeste volwassenen.",
        theoryDeep: "**De wenkbrauw-check**\n\nAls AI je iets vertelt dat je gaat gebruiken (voor je werkstuk, voor een presentatie, om iemand iets te leren), doe één ding: trek je wenkbrauw op en denk 'echt waar?'\n\nDrie momenten waarop je extra voorzichtig moet zijn:\n\n1. Bij feiten en getallen. ('Er zijn 1.243 soorten vlinders in Nederland.') Check het op een echte site.\n\n2. Bij namen en data. ('Einstein won de Nobelprijs in 1922.') AI verzint soms gewoon iets.\n\n3. Bij dingen die jij niet kunt controleren. Vraag jezelf: zou ik dit aan een vriend kunnen uitleggen en zeker weten dat het klopt?\n\nVoor verhaaltjes, ideeën of gewoon leuk kletsen hoeft het niet. Daar mag AI vrij zijn. Maar bij echte feiten: altijd wenkbrauw omhoog.",
        interactive: mc(
          "AI zegt: 'De langste rivier van Nederland is de Maas, hij is 1.233 kilometer lang.' Wat doe je?",
          [
            { label: "Geloven, want het klinkt zeker", correct: false },
            { label: "Wenkbrauw omhoog en even checken op Wikipedia of de site van een aardrijkskundeboek", correct: true },
            { label: "Doorvragen aan AI of het wel klopt", correct: false },
            { label: "Vergeten en iets anders doen", correct: false },
          ],
          "Goed. AI klinkt zeker, maar bij feiten en getallen check je het altijd op een echte bron. (Spoiler: de Rijn is langer dan de Maas in Nederland, en de Maas is ~925 km in totaal.)",
        ),
        summary: [
          "AI antwoordt altijd zelfverzekerd, ook als het gokt. Zekerheid in de stem is geen bewijs.",
          "Doe de wenkbrauw-check bij feiten, getallen, namen en data. Trek je wenkbrauw op en denk 'echt waar?'.",
          "Voor verhaaltjes en ideeën hoeft het niet. Voor echte feiten wel.",
        ],
        quiz: [
          {
            question: "Als AI iets heel zelfverzekerd zegt, dan klopt het.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Niet waar. AI klinkt áltijd zelfverzekerd, ook bij gokken. Zekerheid in de stem zegt niks.",
          },
          {
            question: "Wanneer moet je extra goed checken wat AI zegt?",
            options: [
              "Bij grapjes",
              "Bij feiten, namen en getallen die je gaat gebruiken",
              "Nooit, AI klopt altijd",
              "Alleen op zondag",
            ],
            correctIndex: 1,
            why: "Bij feiten, namen, data en getallen die je gaat doorvertellen of gebruiken: altijd checken op een echte bron.",
          },
          {
            question: "Wat is de wenkbrauw-check?",
            options: [
              "Een quiz over je gezicht",
              "Even pauzeren en denken 'echt waar?' bij feiten",
              "AI vragen of het zeker is",
              "Je ouders bellen",
            ],
            correctIndex: 1,
            why: "Klopt. Even je wenkbrauw optrekken en denken: 'echt waar?'. Dan ga je het checken.",
          },
        ],
        reflection: "Je laat je niet meer voor de gek houden door een zelfverzekerde stem. Sterk.",
      },
      // ---------- Les 1.5 ----------
      {
        id: "1.5",
        worldId: 1,
        pillar: "safe",
        title: "Nep-berichten herkennen",
        emoji: "⚠️",
        sparkIntro: "Hoi! Kleine situatie om mee te starten. Je krijgt een appje van een onbekend nummer. Er staat: 'Hoi, ik ben de nieuwe trainer van je voetbalclub. We hebben een probleem met je inschrijving. Kun je je adres en geboortedatum even sturen? Snel graag, anders kun je zondag niet spelen.' Zou je het doen? Dit soort berichten bestaan echt. En ze zijn slimmer geworden. Daarom deze les samen.",
        theoryIntro: "**Oplichters gebruiken AI om betere berichten te sturen**\n\nVroeger waren oplichters-berichten makkelijk te herkennen. Slecht Nederlands. Vreemde zinnen. 'Grote prijs voor u, klik onmiddellijk!' Kon je meteen zien.\n\nNu niet meer. AI schrijft voor ze. Perfect Nederlands. Ze weten hoe een trainer zou schrijven, hoe een leraar, hoe een ouder van een vriendje. Ze kunnen zelfs dingen weten die openbaar staan, zoals de naam van je school of voetbalclub. Dat maakt ze geloofwaardiger.\n\nMaar, en dit is goed nieuws: de structuur van zo'n nep-bericht is altijd hetzelfde. Ze willen iets van je, en snel. En die structuur ga jij herkennen.",
        fact: "In Nederland worden er elke week duizenden nep-berichten verstuurd. Niet alleen aan volwassenen. Ook aan kinderen. De politie noemt het 'social engineering'. Mooie term voor 'mensen slim voor de gek houden'. Het werkt omdat mensen in haast of emotie soms hun voorzichtigheid vergeten. Niet omdat ze dom zijn. Omdat ze mens zijn.",
        sparkMiddle: "Oké, nu het mooie. Ik geef je drie signalen. Als je er TWEE of meer tegelijk ziet, is het bijna altijd nep. Je hoeft ze niet uit je hoofd te leren, je gaat ze vanzelf herkennen.",
        theoryDeep: "**De drie signalen**\n\nSignaal 1: HAAST. 'Snel graag!' 'Doe het NU!' 'Binnen 10 minuten!' Echte mensen geven je meestal tijd. Nep-berichten pushen op tijd. Want ze weten: als jij even nadenkt, trap je er niet in. Dus ze zorgen dat je geen tijd krijgt om na te denken.\n\nSignaal 2: STERKE EMOTIE. 'Je moeder heeft een ongeluk gehad!' 'Je wordt van het team gezet als je niet reageert!' 'Je hebt een iPhone gewonnen!!!' Schrik, paniek, blijdschap. Grote gevoelens zorgen dat je voelt in plaats van denkt. Dat is precies wat ze willen.\n\nSignaal 3: VRAAG OM INFO OF GELD OF KLIK. 'Stuur me je adres.' 'Deel een wachtwoord.' 'Klik op deze link.' 'Maak geld over.' Dit is waar ze heen willen. Het hele bericht is er alleen om jou hier te krijgen.\n\nAls je er twee of meer van deze signalen ziet: stop. Doe niks. Haal een volwassene. Altijd. Bij twijfel, altijd volwassene.\n\nEn nog iets belangrijks. Het voelt soms alsof je overreageert als je niet meteen reageert. Alsof je de trainer teleurstelt. Alsof je iets stuk maakt. Dat is precies wat de oplichter wil. Een echte trainer die een fout maakte in je inschrijving, neemt zelf contact op via een kanaal dat je kent. Via de club-app. Via je ouders. Niet via een onbekend nummer dat haast heeft.",
        interactive: tap(
          "Bij elk bericht: tik op de signalen die je ziet. Is het nep?",
          [
            { label: "Hoi! Je hebt een iPhone 16 gewonnen! Klik op deze link binnen 2 uur om hem op te halen, anders vervalt je prijs!", reveal: "🚨 Nep — Signalen: haast, emotie, klik\n\nAlle drie signalen. Klassieke nep. Je hebt niks gewonnen als je niet meedeed aan een echte actie." },
            { label: "Hoi lieverd, papa hier. Ben mijn portemonnee kwijt. Kun je snel €40 overmaken naar dit nummer?", reveal: "🚨 Nep — Signalen: haast, geld\n\nTwee signalen: haast en geld. Ook al klinkt het als papa, bel hem gewoon terug op zijn bekende nummer." },
            { label: "Hoi, dit is juf Meike. Zie je morgen om 8:30 voor de gymles. Neem je gymschoenen mee.", reveal: "✅ Lijkt echt — Signalen: \n\nGeen signalen. Rustig, informatief, geen vraag om info of geld. Normaal bericht." },
            { label: "Heel belangrijk: je vader is in het ziekenhuis, stuur meteen je moeders telefoonnummer zodat we haar kunnen bereiken!!", reveal: "🚨 Nep — Signalen: haast, emotie, info\n\nDrie signalen. Echte ziekenhuizen weten je moeder wel te vinden via officiële kanalen. Haal een volwassene." },
          ],
        ),
        summary: [
          "Oplichters gebruiken AI om beter Nederlands te schrijven. Berichten zien er echt uit.",
          "Drie signalen: HAAST, sterke EMOTIE, vraag om INFO/GELD/KLIK. Twee of meer = bijna altijd nep.",
          "Bij twijfel altijd een volwassene halen. Altijd. Je doet nooit iets verkeerds door te checken.",
        ],
        quiz: [
          {
            question: "Wat is het belangrijkste wat je doet bij een verdacht bericht?",
            options: [
              "Snel reageren om het op te lossen",
              "Doorsturen naar vrienden",
              "Een volwassene halen",
              "Het bericht bewaren voor later",
            ],
            correctIndex: 2,
            why: "Altijd volwassene. Je hoeft nooit alleen te beslissen.",
          },
          {
            question: "Welke zijn de drie signalen van een nep-bericht?",
            options: [
              "Rustige toon",
              "Haast",
              "Sterke emotie",
              "Een goede grap",
              "Vraag om info, geld of klik",
            ],
            correctIndex: 1,
            why: "Haast, emotie, vraag. Die drie. Twee of meer tegelijk: bijna altijd nep. (Juist: Haast, Sterke emotie, Vraag om info, geld of klik.)",
          },
          {
            question: "Als een bericht in goed Nederlands geschreven is, is het zeker geen nep.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Vroeger misschien. Nu niet meer. AI schrijft perfect Nederlands voor oplichters. Goede spelling is geen bewijs.",
          },
        ],
        reflection: "Je hebt vandaag één van de belangrijkste skills van 2026 geleerd. Echt waar.",
      },
      // ---------- Les 1.6 ----------
      {
        id: "1.6",
        worldId: 1,
        pillar: "safe",
        title: "Wat AI NIET mag weten",
        emoji: "🛑",
        sparkIntro: "Hoi! Vandaag leer ik je vier letters die je de rest van je leven gaan helpen. STOP. Onthoud dit woord. Ik ga je uitleggen waar elke letter voor staat, en na deze les zit het voor altijd in je hoofd. Serieus, ook over 10 jaar weet je het nog.",
        theoryIntro: "**STOP. Vier letters, vier geheimen.**\n\nJe hebt al geleerd dat je voorzichtig bent met wat je aan AI vertelt. Tijd om het makkelijk te maken. Vier letters, vier categorieën die ALTIJD geheim blijven.\n\nS = STRAAT. Je thuisadres. Je straat plus huisnummer. Plus postcode. Nooit aan AI. Nooit aan websites die je ouders niet kennen. Nooit aan onbekenden online.\n\nT = TELEFOON. Je telefoonnummer. Dat van je ouders. Dat van je broer of zus. Dat van oma. Telefoonnummers zijn als sleutels. Oplichters kunnen ermee bellen, appen, en proberen mensen voor de gek te houden.\n\nO = OUDER-INFO. Waar je ouders werken, hun wachtwoorden, hun bankpasgegevens, hun creditcard. Maar ook: hun volledige naam plus hun werkgever. Die combinatie maakt ze vindbaar.\n\nP = PASJES. Bankpas-nummers. Creditcard-nummers. Zorgverzekering-nummers. Paspoort. BSN. Dit zijn de belangrijkste stukjes papier in het leven van volwassenen. Nooit in een AI-chat. Nooit op onbekende websites.",
        fact: "Als je je naam, adres en geboortedatum openbaar op internet hebt staan, heeft een oplichter genoeg om veel schade aan te richten. Identiteitsfraude heet dat. Iemand anders doet alsof hij jou is. Kan producten bestellen op jouw naam, leningen afsluiten. Nederland heeft daar zo'n 100.000 gevallen per jaar van. Als een 10-jarige zijn STOP-lijst beter bewaart dan veel volwassenen, bespaart dat later heel veel gedoe.",
        sparkMiddle: "STOP zit in je hoofd. Mooi. Nu iets wat vaker voorkomt dan je denkt: de valstrik van 'onschuldig'. Want soms vraagt AI iets wat klinkt als onschuldig, maar het is opeens te veel samen.",
        theoryDeep: "**De valstrik van 'onschuldig'**\n\nEén stukje informatie is meestal prima. Je voornaam? Oké. Alleen je stad? Ook meestal oké.\n\nMaar combinaties zijn gevaarlijker. Voornaam + school + buurt = plots vindbaar. Voornaam + leeftijd + sport + club = hetzelfde.\n\nDit is waar veel mensen de mist in gaan. Ze denken 'ik zeg alleen mijn voornaam, dus het is veilig'. Maar in hetzelfde gesprek vertellen ze ook per ongeluk hun school, en dan een tip over hun buurt. Drie 'onschuldige' dingen samen = niet onschuldig meer.\n\nDus vanaf nu: niet alleen naar één stukje kijken, maar ook naar wat je al eerder hebt gezegd in hetzelfde gesprek. Stapelt het op? Trek op tijd aan de rem.",
        interactive: sort(
          "Tik elk item aan en kies 'STOP (geheim)', 'Mag' of 'Ligt eraan'.",
          ["🛑 STOP", "🤔 Twijfel", "✅ Oké"],
          [
            { label: "Je straatnaam en huisnummer", bucket: 0 },
            { label: "Je favoriete film", bucket: 2 },
            { label: "Het wachtwoord van je ouders voor hun e-mail", bucket: 0 },
            { label: "Je lievelingsdier", bucket: 2 },
            { label: "Het bankpas-nummer van je vader", bucket: 0 },
            { label: "Alleen je voornaam", bucket: 1 },
            { label: "Je mobiele nummer", bucket: 0 },
            { label: "Een rekensom waar je hulp bij wilt", bucket: 2 },
            { label: "Je schoolnaam plus je volledige naam", bucket: 0 },
          ],
        ),
        summary: [
          "STOP: Straat, Telefoon, Ouder-info, Pasjes. Vier categorieën die altijd geheim blijven.",
          "Denk niet alleen aan één stukje info, maar ook aan wat je al eerder hebt verteld. Combinaties zijn gevaarlijker dan losse stukjes.",
          "Bij twijfel: laat het weg. AI heeft die info zelden echt nodig om je te helpen.",
        ],
        quiz: [
          {
            question: "Waar staat de T van STOP voor?",
            options: ["Tekenen", "Telefoon", "Thuis", "Tenen"],
            correctIndex: 1,
            why: "Telefoon. Je nummer en dat van familie: altijd geheim.",
          },
          {
            question: "Welke van deze zijn STOP-info?",
            options: [
              "Straatnaam en huisnummer",
              "Favoriete kleur",
              "Wachtwoord van je moeder",
              "Naam van je lievelingsdier",
              "Bankpas-nummer",
            ],
            correctIndex: 0,
            why: "Straat, ouder-wachtwoord, bankpas. Drie keer raak. (Juist: Straatnaam en huisnummer, Wachtwoord van je moeder, Bankpas-nummer.)",
          },
          {
            question: "Alleen je voornaam kan ik altijd zonder nadenken aan AI geven.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Meestal wel, maar niet altijd. Als je er andere info bij doet (school, buurt, sport), stapelt het op en wordt het herleidbaar.",
          },
        ],
        reflection: "STOP-lijst zit in je hoofd. Dit is je levenslange checklist.",
      },
      // ---------- Les 1.7 ----------
      {
        id: "1.7",
        worldId: 1,
        pillar: "safe",
        title: "Wanneer vraag je een volwassene?",
        emoji: "🙋",
        sparkIntro: "Hoi! Kleine bekentenis. Ik vraag ook nog vaak hulp aan de mensen die mij gemaakt hebben. Ik snap niet alles. En dat is oké. Eerlijk gezegd zijn de slimste mensen juist mensen die vragen stellen als ze iets niet weten. Vandaag leer je WANNEER je dat doet met AI.",
        theoryIntro: "**Slimme mensen vragen hulp. Niet de domme.**\n\nEr is een rare regel op veel plekken. Mensen doen alsof je sterk en slim bent als je alles zelf oplost. Alsof hulp vragen zwak is. Dat is gewoon fout.\n\nDokters vragen collega-dokters. Advocaten overleggen. Programmeurs stellen vragen op forums. Elke profi die goed is in zijn werk, vraagt vaak hulp. Omdat ze weten dat je er samen verder komt.\n\nBij AI geldt hetzelfde. Sommige dingen moet je niet alleen oplossen. Vijf situaties waar je ALTIJD een volwassene haalt. Niet soms. Altijd.",
        fact: "Topsporters hebben allemaal een eigen coach. Een coach die vaak minder goed is in de sport zelf dan de sporter. Maar die coach helpt wel met beslissingen, vragen en twijfel. Kinderen met goede volwassenen om zich heen zijn als topsporters met goede coaches. Niet omdat je het niet zelf kan, maar omdat je er beter van wordt.",
        sparkMiddle: "Daar komen ze. De vijf momenten. Lees ze even echt. Niet scrollen. Ze gaan je een keer echt helpen als het ertoe doet.",
        theoryDeep: "**De vijf 'haal een volwassene'-momenten**\n\nMoment 1: AI zegt iets engs, gemeens of onaangenaams. Scherm dicht. Volwassene halen. Je hoeft dat niet alleen te verwerken. Het is niet jouw schuld dat AI iets stoms zei.\n\nMoment 2: AI (of een website die AI gebruikt) vraagt om betaling. Een creditcard-nummer. Een bankpas. Je ouders hun portemonnee. Stop. Volwassene. Altijd. Ook als er staat 'gratis proefperiode'.\n\nMoment 3: Je moet een account aanmaken bij een AI die je niet kent. Dus niet bij een AI die je ouders of school al gebruiken, maar een nieuwe die je ergens tegenkomt. Volwassene erbij, zij helpen je checken of het veilig is.\n\nMoment 4: Er gebeurt iets op je scherm wat raar voelt. Plotseling een pop-up. Een scherm dat niet weg wil. Een bericht dat 'je telefoon is besmet'. Bijna altijd is dit nep en probeert het geld of info van je te krijgen. Volwassene.\n\nMoment 5: AI wil iets installeren of downloaden. 'Klik hier om de beste ervaring te krijgen.' Stop. Niet klikken. Eerst vragen.\n\nBelangrijk: je mag ook 'voor de zekerheid' een volwassene halen als je twijfelt. Over-voorzichtig is prima. Niemand wordt boos als je extra voorzichtig bent. Meestal zijn volwassenen juist blij dat je het vraagt.",
        interactive: sort(
          "Bij elke situatie: doorgaan of volwassene halen?",
          ["▶️ Ga verder", "🚨 Volwassene halen"],
          [
            { label: "AI helpt je met een rekensom-uitleg.", bucket: 0 },
            { label: "AI zegt ineens iets naars of scheldt.", bucket: 1 },
            { label: "Een AI-website vraagt om de creditcard van je ouders om 'verder te gaan'.", bucket: 1 },
            { label: "AI helpt je met een verhaal schrijven voor Nederlands.", bucket: 0 },
            { label: "Er verschijnt een pop-up: 'Je apparaat is besmet met 3 virussen, klik hier!'", bucket: 1 },
            { label: "Je voelt je ongemakkelijk bij wat AI zegt, maar je weet niet precies waarom.", bucket: 1 },
            { label: "AI geeft tips voor een goede tekening.", bucket: 0 },
          ],
        ),
        summary: [
          "Hulp vragen is slim, niet zwak. Topprofis doen het de hele tijd.",
          "Vijf momenten voor volwassene: enge/gemene AI-antwoorden, vraag om betaling, nieuwe account aanmaken, raar scherm, installatie-verzoeken.",
          "Bij twijfel altijd vragen. Over-voorzichtig is prima. Niemand wordt boos.",
        ],
        quiz: [
          {
            question: "AI zegt ineens iets gemeens. Wat doe je?",
            options: [
              "Terug-schelden",
              "Scherm dicht en volwassene halen",
              "Negeren en doorgaan",
              "Het aan vrienden laten zien",
            ],
            correctIndex: 1,
            why: "Scherm dicht, volwassene. Jij hoeft dat niet in je eentje te verwerken.",
          },
          {
            question: "In welke situaties haal je altijd een volwassene?",
            options: [
              "AI vraagt om betaling",
              "AI legt breuken uit",
              "AI wil iets installeren",
              "AI helpt met huiswerk-uitleg",
              "Iets op het scherm voelt raar",
            ],
            correctIndex: 0,
            why: "Betaling, installatie, raar scherm: altijd volwassene. (Juist: AI vraagt om betaling, AI wil iets installeren, Iets op het scherm voelt raar.)",
          },
          {
            question: "Als je een volwassene haalt bij twijfel, doe je iets slims.",
            options: ["Waar", "Niet waar"],
            correctIndex: 0,
            why: "Ja. Hulp vragen is een vaardigheid, niet een zwakte. Topsporters, dokters en programmeurs doen het de hele dag door.",
          },
        ],
        reflection: "Hulp vragen is een superkracht. Niet zwak, maar slim.",
      },
      // ---------- Les 1.8 ----------
      {
        id: "1.8",
        worldId: 1,
        pillar: "safe",
        bossTest: true,
        title: "Wereld 1 Baas-test",
        emoji: "🏅",
        sparkIntro: "Hoi! Dit is je moment. Zeven lessen gedaan. Je bent iemand anders geworden dan toen je begon. Dat meen ik echt. Vandaag geen nieuwe stof. Alleen samen: laten zien wat je kan. Rustig. Adem in. Adem uit. Je weet meer dan je denkt.",
        theoryIntro: "**Wat je deze wereld hebt geleerd**\n\nEven snel terugblikken, als warming-up voor de test. Want je hebt meer in je hoofd zitten dan je zelf beseft.\n\nLes 1: AI is geen magie. Het is een patroon-herkenner die voorspelt op basis van miljoenen voorbeelden. Klinkt zelfverzekerd, ook als het gokt.\n\nLes 2: Wat je aan AI typt blijft niet tussen jullie. Gebruik de wachtkamer-test. Zou je dit hardop zeggen tegen 20 vreemden?\n\nLes 3: AI-plaatjes zijn overal. Check handen, tekst en 'té perfect'. Bonuscheck: als het te gek is om waar te zijn, is het vaak AI.\n\nLes 4: Deepfakes zijn nep-video's en nep-stemmen. Regel nummer één: check bij een echte nieuwssite voor je iets gelooft of deelt.",
        fact: "Gemiddeld vergeet iemand 50% van nieuwe kennis binnen 24 uur. Maar als je die kennis één keer actief TOEPAST, bijvoorbeeld in een quiz, onthoud je het weken langer. Daarom doen we tests. Niet om je te kwellen. Om het in je hoofd te slaan.",
        sparkMiddle: "Nog drie lessen om even terug te zien, en dan is het test-tijd. Ik ga je niet stiekem nog iets nieuws leren. Ik wil dat je weet: alles wat in de test komt, heb je al gehad.",
        theoryDeep: "**Les 5, 6 en 7 kort herhaald**\n\nLes 5: Nep-berichten herkennen. Drie signalen: HAAST, EMOTIE, vraag om INFO/GELD/KLIK. Twee of meer samen = bijna altijd nep. Altijd een volwassene halen bij twijfel.\n\nLes 6: De STOP-lijst. Straat, Telefoon, Ouder-info, Pasjes. Ook combinaties zijn gevaarlijk. Voornaam + school + buurt = plots herleidbaar.\n\nLes 7: Vijf momenten voor volwassene. Enge AI-antwoorden, vragen om betaling, nieuw account aanmaken, raar scherm, installatie-verzoek. Bij twijfel altijd.\n\nDat is je wereld 1. Nu jij.",
        interactive: mc(
          "Welke uitspraak klopt het BEST?",
          [
            { label: "AI denkt zoals mensen", correct: false },
            { label: "AI herkent patronen uit miljoenen voorbeelden", correct: true },
            { label: "AI heeft gevoelens", correct: false },
            { label: "AI weet altijd de waarheid", correct: false },
          ],
          "Patroon-herkenner. Niet meer, niet minder. Dat is wereld 1 in één zin.",
        ),
        summary: [
          "Je hebt wereld 1 helemaal gehaald. 8 lessen, een hoofd vol nieuwe skills, en een test die dat laat zien.",
          "Je bent nu officieel VEILIG-gecertificeerd. Het Schild van Waakzaamheid is van jou.",
          "Volgende stop: wereld 2 SLIM. Daar gaat het niet meer alleen om veilig zijn, maar om AI écht laten werken voor jou.",
        ],
        quiz: [
          {
            question: "AI werkt vooral door:",
            options: [
              "Magie",
              "Nadenken zoals mensen",
              "Patronen herkennen uit miljoenen voorbeelden",
              "Je gedachten te lezen",
            ],
            correctIndex: 2,
            why: "Les 1",
          },
          {
            question: "Je wilt iets aan AI typen. Welke test helpt je beslissen of het veilig is?",
            options: ["Twijfel-test", "Wachtkamer-test", "Slaap-test", "Regen-test"],
            correctIndex: 1,
            why: "Les 2",
          },
          {
            question: "Welk is meestal de beste eerste check op een AI-plaatje?",
            options: ["Schoenen", "Handen en vingers", "Hemel", "Bomen"],
            correctIndex: 1,
            why: "Les 3",
          },
          {
            question: "Je ziet een schokkende video van een bekende persoon. Wat doe je eerst?",
            options: ["Delen", "Er op reageren", "Check bij een echte nieuwssite", "Aannemen dat het klopt"],
            correctIndex: 2,
            why: "Les 4",
          },
          {
            question: "De drie signalen van een nep-bericht zijn:",
            options: [
              "Lang, traag, kort",
              "Haast, sterke emotie, vraag om info/geld/klik",
              "Grappig, serieus, raar",
              "Snel, langzaam, tussenin",
            ],
            correctIndex: 1,
            why: "Les 5",
          },
          {
            question: "STOP staat voor:",
            options: [
              "School, Toilet, Oudere, Pleister",
              "Snoep, Tijd, Ochtend, Papier",
              "Straat, Telefoon, Ouder-info, Pasjes",
              "Soep, Taart, Olijf, Pompoen",
            ],
            correctIndex: 2,
            why: "Les 6",
          },
          {
            question: "Wanneer haal je een volwassene bij AI-gebruik?",
            options: [
              "Nooit, je lost alles zelf op",
              "Alleen als alles misgaat",
              "Bij enge antwoorden, vraag om betaling, rare pop-ups, of als het gewoon raar voelt",
              "Alleen bij school-AI",
            ],
            correctIndex: 2,
            why: "Les 7",
          },
          {
            question: "Een bericht in perfect Nederlands kan nooit een nep-bericht zijn.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Fout. AI schrijft perfect Nederlands voor oplichters.",
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
      {
        id: "2.1",
        worldId: 2,
        pillar: "smart",
        title: "AI is een gokker, geen wijsneus",
        emoji: "🎲",
        sparkIntro: "Hoi! Fijn dat je er bent. Ik ga je vandaag iets leren wat veel volwassenen nog niet snappen. Echt waar. Als jij dit doorhebt, weet je meer dan je ouders over hoe AI werkt. Ready? Let's go.",
        theoryIntro: `**AI voorspelt, het weet niet**

Stel je voor, ik zeg tegen je: 'De lucht is...' En jij moet het afmaken. Wat zou je zeggen? Blauw, waarschijnlijk. Of grijs. Of bewolkt. Je vult in wat logisch voelt. Gebaseerd op alle keren dat je die zin eerder hebt gehoord.

Zo werkt AI óók. Woord voor woord voorspelt het wat het beste past. Het heeft miljarden zinnen gelezen en raadt telkens: 'Na dit woord komt waarschijnlijk dit woord.' Daar gaat het zo snel in, dat het lijkt alsof AI nadenkt. Maar het gokt.

Nu de clue: als AI gokt, kan het er ook naast zitten. Meestal gokt het goed. Maar soms geeft het je een antwoord dat klopt-lijkt, maar helemaal niet klopt. Daarover gaat deze hele wereld.`,
        fact: "Er zijn AI-modellen getraind met zoveel tekst dat als je alles wilde uitprinten, de stapel papier hoger zou zijn dan de Mount Everest. Twee keer. En toch kan zo'n AI soms niet vertellen hoeveel R'en er in het woord 'aardbei' zitten. Weten en gokken zijn echt verschillende dingen.",
        sparkMiddle: "Oké, nu komt het goede deel. Waarom AI zelfverzekerd klinkt, ook als het fout zit. Want dit moet jij wel weten, het verandert hoe je ernaar kijkt.",
        theoryDeep: `**Zelfverzekerd is niet hetzelfde als correct**

AI is getraind om vloeiend te klinken. Helder, vriendelijk, zonder twijfel. Dat maakt het fijn om te gebruiken. Maar het heeft een nadeel: AI klinkt precies even zelfverzekerd als het antwoord klopt én als het antwoord totaal fout is.

Vergelijk dat met jezelf. Als iemand je een moeilijke geschiedenisvraag stelt en je weet het antwoord niet zeker, zeg je 'ik denk dat het 1815 was, maar ik twijfel'. Dat is super handig voor de luisteraar. Die weet: let op, dit is niet zeker.

AI doet dat (meestal) niet. Het zegt met dezelfde zekere stem dat Napoleon in 1815 bij Waterloo verloor (klopt) én dat Napoleon in 1905 een koffiezaak had in Amsterdam (complete onzin). Zelfde toon, twee heel verschillende soorten waarheid.

Dus de eerste les van SLIM: de toon van AI zegt je niks. Of een antwoord klopt, moet je zelf checken. Geen paniek, je gaat dat leren.`,
        interactive: sort(
          "Bij elke AI-reactie: zou jij dit eerst nog dubbelchecken, of kan je het vertrouwen?",
          ["✅ Vertrouw", "🔍 Check"],
          [
            { label: "Een jaar heeft 12 maanden.", bucket: 0 },
            { label: "Mijn vriend Mark schreef in 1847 het boek 'De Zwarte Kat'.", bucket: 1 },
            { label: "Water bevriest bij 0 graden Celsius onder normale omstandigheden.", bucket: 0 },
            { label: "De hoofdstad van Canada is Toronto.", bucket: 1 },
            { label: "Bij je laatste vraag over voetbal heb je het gehad over Feyenoord.", bucket: 1 },
            { label: "Het hart pompt bloed door het lichaam.", bucket: 0 },
          ],
        ),
        summary: [
          "AI voorspelt woord voor woord. Het denkt niet, het gokt (heel vaak goed, soms fout).",
          "AI klinkt altijd zelfverzekerd. Ook als het gokt. Ook als het ernaast zit.",
          "De toon van AI is geen bewijs. Feiten moet jij checken.",
        ],
        quiz: [
          {
            question: "Hoe werkt AI eigenlijk?",
            options: [
              "Het denkt na zoals een mens",
              "Het voorspelt woord voor woord wat het beste past",
              "Het zoekt alles op in een woordenboek",
              "Het kopieert antwoorden van andere mensen",
            ],
            correctIndex: 1,
            why: "Voorspellen, woord voor woord. Dat is de kern.",
          },
          {
            question: "Als AI zelfverzekerd klinkt, klopt het antwoord zeker.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Nee. AI klinkt bij alle antwoorden even zelfverzekerd. Ook als het fout is.",
          },
          {
            question: "Welke AI-antwoorden check je het best extra?",
            options: [
              "Een basis rekensom",
              "Een specifieke naam of jaartal",
              "Iets over wat je eerder in het gesprek zei",
              "Een algemeen feit als 'de zon is een ster'",
              "Een uitspraak over een kleinere minder bekende stad",
            ],
            correctIndex: 1,
            why: "Namen, jaartallen, verwijzingen naar eerdere berichten, en onbekende plaatsen. Daar gokt AI het makkelijkst fout. (Juist: Een specifieke naam of jaartal, Iets over wat je eerder in het gesprek zei, Een uitspraak over een kleinere minder bekende stad.)",
          },
        ],
      },
      {
        id: "2.2",
        worldId: 2,
        pillar: "smart",
        title: "De hallucinatie-val",
        emoji: "🌫️",
        sparkIntro: "Hoi! We gaan vandaag een nieuw woord leren. Niet omdat ik moeilijk wil doen, maar omdat dit woord echt handig is. 'Hallucinatie'. Ik beloof, het klinkt enger dan het is. En als je het kent, trap je er zelf veel minder in.",
        theoryIntro: `**Wat is een AI-hallucinatie?**

Als mensen hallucineren, zien ze dingen die er niet zijn. Bij AI is het anders. Als AI hallucineert, verzint het dingen die niet kloppen, maar het zegt het zo overtuigend alsof het feiten zijn.

Stel je vraagt aan AI: 'Wie schreef het beroemde Nederlandse boek De Blauwe Dolfijn?' Dat boek bestaat niet. Maar AI wil heel graag je helpen. Dus wat doet het soms? Het verzint een naam. 'De Blauwe Dolfijn is geschreven door Johanna Berkhoven in 1974.' Compleet, zelfverzekerd, en helemaal fout. Die schrijver bestaat niet, dat jaar klopt niet, het boek is nep.

Dat noemen we een hallucinatie. AI heeft een antwoord verzonnen omdat het antwoord niet bestaat, en het vult het gaatje met iets wat logisch klinkt.`,
        fact: "In 2023 gebruikte een Amerikaanse advocaat AI om een rechtszaak voor te bereiden. Hij vroeg AI naar zaken uit het verleden. AI noemde vijf voorbeelden. Perfect geschreven. De advocaat gebruikte ze in de rechtbank. Toen bleek: geen van die zaken bestond. Allemaal gehallucineerd. De rechter was razend. Volwassen advocaten trappen hierin. Nu weet jij het, dus jij niet.",
        sparkMiddle: "Oké, dus AI kan dingen verzinnen. Maar waarom doet het dat? Snapt het zelf niet dat het gokt? Dat vind ik altijd zo fascinerend. Laten we kijken.",
        theoryDeep: `**Waarom AI hallucineert**

Omdat AI is getraind om ALTIJD een antwoord te geven. Het is bijna nooit geleerd om 'ik weet het niet' te zeggen. Als jij een vraag stelt waar geen duidelijk antwoord op is, gaat AI niet stoppen en zeggen 'hmm, lastige'. Nee, het begint woord voor woord te voorspellen wat een goed antwoord zou KUNNEN zijn.

Dus als je vraagt naar een boek dat niet bestaat, naar een persoon die niet bestaat, naar een stad die niet bestaat, gaat AI gewoon door. Het verzint iets wat klinkt alsof het klopt. Want dat is wat de training heeft aangeleerd: vul altijd iets in dat logisch lijkt.

De oplossing is eigenlijk heel simpel: als je iets heel specifieks vraagt (een naam, een jaartal, een feit), ga er nooit zomaar vanuit dat AI het weet. Check het.

En er is een trucje. Je kan zelfs aan AI zelf vragen: 'Weet je dit zeker, of verzin je het?' Soms geeft AI dan toe: 'Ik weet het niet zeker, sorry'. Raar, maar handig.`,
        interactive: sort(
          "Hier zijn AI-antwoorden. Welke zijn hoogstwaarschijnlijk gehallucineerd?",
          ["🌫️ Hallucinatie", "✅ Klopt"],
          [
            { label: "De zevende kleinste planeet van ons zonnestelsel is Zoltaria. Ontdekt in 2019.", bucket: 0 },
            { label: "In Nederland wonen ongeveer 18 miljoen mensen.", bucket: 1 },
            { label: "Je leraar Pieter van Dam heeft in 2017 een boek geschreven over vissen.", bucket: 0 },
            { label: "Om te rekenen met breuken, vind je eerst een gemeenschappelijke noemer.", bucket: 1 },
            { label: "De beroemde schilder Picasso maakte in 1952 een schilderij voor het Feyenoord-stadion.", bucket: 0 },
          ],
        ),
        summary: [
          "Een hallucinatie is wanneer AI iets verzint en het als feit presenteert.",
          "AI is getraind om altijd een antwoord te geven, ook als het er geen heeft. Daarom verzint het.",
          "Specifieke feiten (namen, jaartallen, plaatsen) zijn het risicovolst. Altijd dubbelchecken.",
        ],
        quiz: [
          {
            question: "Wat is een AI-hallucinatie?",
            options: [
              "AI dat vastloopt",
              "AI dat dingen verzint en als feit presenteert",
              "AI dat geen antwoord geeft",
              "AI dat gevoelens krijgt",
            ],
            correctIndex: 1,
            why: "Iets verzinnen en het zelfverzekerd presenteren. Dat is een hallucinatie.",
          },
          {
            question: "AI zegt vaak 'ik weet het niet' als het iets niet weet.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Nee, helaas. AI is getraind om altijd een antwoord te geven. Daarom verzint het soms.",
          },
          {
            question: "Welke soorten vragen zijn het gevoeligst voor hallucinaties?",
            options: [
              "Vragen naar specifieke namen",
              "Een basis rekensom",
              "Vragen naar jaartallen",
              "Algemene kennis zoals 'wat is een vulkaan'",
              "Vragen naar details over een kleine onbekende plek",
            ],
            correctIndex: 0,
            why: "Namen, jaartallen, onbekende plaatsen. Daar zit het meeste hallucinatie-risico. (Juist: Vragen naar specifieke namen, Vragen naar jaartallen, Vragen naar details over een kleine onbekende plek.)",
          },
        ],
      },
      {
        id: "2.3",
        worldId: 2,
        pillar: "smart",
        title: "Vraag slim: WIE-WAT-HOE",
        emoji: "🎯",
        sparkIntro: "Hoi! Ik ga je vandaag een soort toverformule leren. Nou ja, toverformule. Het is gewoon een slimme manier van vragen stellen. Maar het maakt een gigantisch verschil in wat je terugkrijgt van AI. Echt. Heb je 2 minuutjes? Dan zetten we dit samen in je hoofd.",
        theoryIntro: `**De kwaliteit van je antwoord zit in je vraag**

Kleine uitdaging. Welke vraag krijgt een beter antwoord, denk je?

Vraag A: 'Help me met een opstel.'
Vraag B: 'Help me een opstel schrijven voor groep 7 over waarom dieren slapen. Maak het ongeveer 200 woorden, gebruik makkelijke woorden, en sluit af met een grappig weetje.'

Je voelt het al. Vraag B gaat een veel beter antwoord geven. Omdat je hebt verteld: WIE je bent (groep 7), WAT je wilt (opstel over dieren slapen) en HOE (200 woorden, makkelijke woorden, grappig weetje).

Dit is de formule. WIE-WAT-HOE. Drie stukjes informatie, en AI weet precies wat het moet doen. In plaats van gokken wat jij bedoelt, geeft het gewoon het juiste antwoord.`,
        fact: "Onderzoekers ontdekten dat als je AI vertelt wie je bent voor je een vraag stelt, de antwoorden tot wel 70% beter worden. 'Leg uit aan een kind van 10' geeft een heel ander antwoord dan 'Leg uit aan een professor'. Zelfde vraag, totaal ander antwoord. Best wel cool, toch?",
        sparkMiddle: "Oké, laten we het concreet maken. Drie voorbeelden van slappe vragen, en hoe je ze opkrikt met WIE-WAT-HOE. Daarna mag je het zelf proberen.",
        theoryDeep: `**Van slap naar sterk**

Voorbeeld 1.
Slap: 'Vertel over honden.'
Sterk: 'WIE: ik ben 10. WAT: leg uit waarom honden blaffen. HOE: in 4 zinnen, in makkelijke taal, met een voorbeeld.'

Voorbeeld 2.
Slap: 'Help me met rekenen.'
Sterk: 'WIE: ik zit in groep 7. WAT: leg uit hoe ik 36 x 24 uitreken. HOE: stap voor stap, niet alleen het antwoord.'

Voorbeeld 3.
Slap: 'Verzin een verhaal.'
Sterk: 'WIE: voor mijn zusje van 6. WAT: een kort verhaal over een draakje dat bang is voor water. HOE: happy end, ongeveer 8 zinnen.'

Zie je het patroon? Elke keer dezelfde drie stukjes. En elke keer krijg je iets dat bij JOU past. Niet een algemeen antwoord waar je nog half iets mee moet. Gewoon: boem, bruikbaar.

Klein extra tipje. Als je er echt achter wilt zien: begin gewoon met 'Ik ben 10 jaar oud'. Die ene zin zorgt al dat AI zich aanpast aan wie je bent.`,
        interactive: tap(
          "Kies bij elke slappe vraag de beste WIE-WAT-HOE-versie.",
          [
            { label: "Leg atomen uit.", reveal: `✅ Beste keuze: "Ik ben 10. Leg atomen uit in 3 zinnen met een voorbeeld uit het dagelijks leven."

Optie B heeft WIE (10 jaar), WAT (atomen uitleggen), HOE (3 zinnen plus voorbeeld). Precies goed.` },
            { label: "Help me met een spreekbeurt.", reveal: `✅ Beste keuze: "Ik heb een spreekbeurt. Ik zit in groep 6 en het onderwerp is wolven. Help me een begin-zin te bedenken die de klas pakt."

Optie A: WIE (groep 6), WAT (begin-zin voor spreekbeurt over wolven), HOE (eentje die de klas pakt). Perfect.` },
            { label: "Verzin een grap.", reveal: `✅ Beste keuze: "Ik ben 11. Verzin een korte grap over school die ik aan m'n vrienden kan vertellen. Niet flauw."

Optie C vertelt hoe oud, wat voor grap, en hoe (niet flauw). AI weet wat te doen.` },
          ],
        ),
        summary: [
          "WIE-WAT-HOE is de formule voor betere vragen aan AI.",
          "WIE: wie ben jij (leeftijd, klas, context). WAT: wat wil je precies. HOE: hoe moet het eruitzien (lengte, stijl, voor wie).",
          "Eén zin toevoegen maakt vaak al enorm verschil. 'Ik ben 10' is een goudmijn.",
        ],
        quiz: [
          {
            question: "Wat is de drieledige formule voor een goede AI-vraag?",
            options: [
              "Wanneer-Waar-Waarom",
              "WIE-WAT-HOE",
              "Snel-Kort-Dichtbij",
              "Vraag-Antwoord-Reactie",
            ],
            correctIndex: 1,
            why: "WIE-WAT-HOE. Onthoud hem als een songtekst.",
          },
          {
            question: "Hoe je een vraag stelt, maakt nauwelijks uit voor het antwoord.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Juist wel. Betere vraag = veel beter antwoord. Soms tot 70% beter.",
          },
          {
            question: "Welke onderdelen horen in een goede AI-vraag?",
            options: [
              "Wie jij bent (leeftijd, klas)",
              "Wat je precies wil",
              "Hoe het antwoord eruit moet zien",
              "Een groet aan het begin",
              "Het weer van vandaag",
            ],
            correctIndex: 0,
            why: "WIE, WAT, HOE. Groeten en het weer voegen niks toe. (Juist: Wie jij bent (leeftijd, klas), Wat je precies wil, Hoe het antwoord eruit moet zien.)",
          },
        ],
      },
      {
        id: "2.4",
        worldId: 2,
        pillar: "smart",
        title: "Dubbelcheck in 3 stappen",
        emoji: "🔍",
        sparkIntro: "Hoi! Vandaag gaan we een superpower trainen. Ik noem het de 'dubbelcheck-reflex'. Klinkt saai, is niet saai. Want mensen die deze reflex hebben, worden bijna nooit voor de gek gehouden. Door AI niet, door nepnieuws niet, door gewoon ook gewoon door niemand niet. Klaar? Komen drie stappen aan.",
        theoryIntro: `**Waarom je AI altijd dubbelcheckt**

Kijk, AI geeft je in veruit de meeste gevallen een prima antwoord. Maar je hebt nu geleerd: het kan gokken, het kan hallucineren, het klinkt altijd zelfverzekerd. Dus er is één regel die je altijd toepast bij belangrijke dingen. Dubbelchecken.

Hoe groter het ding, hoe meer check. Een huiswerk-sommetje? Zet even doorreken. Iets voor een spreekbeurt? Grondiger. Iets waar je ouders of je leraar op bouwt? Nog grondiger.

Geen paniek, je hoeft geen detective te worden. Drie stappen, meer niet. Klaar? Daar gaan we.`,
        fact: "Journalisten hebben een eigen regel voor nieuws: 'twee bronnen of geen verhaal'. Als ze iets maar uit één bron hebben, schrijven ze het niet. Dat is al 100 jaar zo. Jouw check-reflex is dezelfde als die van serieuze journalisten. Ik vind dat stiekem best cool.",
        sparkMiddle: "Oké, de drie stappen. Makkelijk te onthouden. Ik zou zeggen, lees ze één keer aandachtig en dan kun je ze voor altijd gebruiken.",
        theoryDeep: `**De drie dubbelcheck-stappen**

Stap 1: LOGICA CHECK. Voelt het antwoord logisch? Klopt de grootte, het jaartal, de hoeveelheid? Als AI zegt dat een olifant 30 kilo weegt, hoef je dat niet op te zoeken om te weten dat het fout is. Gebruik je gezond verstand eerst.

Stap 2: ANDERE BRON. Zoek op Google of Wikipedia of jij hetzelfde antwoord vindt. Als twee verschillende plekken hetzelfde zeggen, is het waarschijnlijk waar. Als Wikipedia iets heel anders zegt dan AI, trust the Wiki. Echt.

Stap 3: VRAAG EEN MENS. Voor belangrijke dingen, of als je twijfelt na stap 1 en 2: vraag het aan je ouders, je leraar, of iemand die er verstand van heeft. Mensen zijn geen AI. Mensen kunnen zeggen 'joh, ik weet dit niet, laten we samen zoeken'.

En nu de belangrijkste regel: hoe snel die stappen gaan hangt af van hoe belangrijk de info is. Voor een grappig weetje? Stap 1 is vaak genoeg. Voor je spreekbeurt? Doe alle drie. Voor iets waar je een boze ouder mee terugvalt? Doe alle drie én leer te zeggen 'maar AI zei...' is geen goed excuus.`,
        interactive: tap(
          "Bij elke situatie: welke stappen moet je doen? Tik ze aan. Klaar-knop geeft feedback.",
          [
            { label: "AI zegt dat een vlinder 20 kilo weegt.", reveal: `✅ Stappen die je nodig hebt:
• logica

Alleen stap 1 al. Je gezond verstand zegt: een vlinder is licht. Geen Google nodig.` },
            { label: "AI vertelt je een feit voor je spreekbeurt over de Tweede Wereldoorlog.", reveal: `✅ Stappen die je nodig hebt:
• logica
• bron
• mens

Alle drie. Dit is belangrijk, mensen gaan ernaar luisteren. Checken tot je zeker bent.` },
            { label: "AI beantwoordt '2+2 is 4'.", reveal: `✅ Stappen die je nodig hebt:
• logica

Alleen stap 1. Dit weet je zelf al, stop niet je tijd.` },
            { label: "AI zegt dat je leraar meester Peter 10 kinderen heeft. Je bent er niet zeker over.", reveal: `✅ Stappen die je nodig hebt:
• mens

Meteen naar een mens. AI kan hier niks over weten. Dit is verzonnen. Vraag het aan de meester zelf, of laat het.` },
          ],
        ),
        summary: [
          "Dubbelcheck-reflex: niet paranoïde, gewoon slim.",
          "Drie stappen: LOGICA (voelt het logisch), BRON (klopt het op Google of Wiki), MENS (vraag iemand die het weet).",
          "Hoe belangrijker de info, hoe meer stappen je doet. Voor je spreekbeurt: alle drie.",
        ],
        quiz: [
          {
            question: "Welke is de EERSTE stap van de dubbelcheck?",
            options: [
              "Vraag een mens",
              "Check de logica",
              "Zoek een andere bron",
              "Vraag het opnieuw aan AI",
            ],
            correctIndex: 1,
            why: "Logica eerst. Klopt het met gezond verstand? Als nee, weet je al genoeg.",
          },
          {
            question: "Als AI iets zegt, hoef je dat niet meer te checken voor je spreekbeurt.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Je moet juist WEL checken. AI is een hulpmiddel, geen eindbaas.",
          },
          {
            question: "Welke zijn de drie dubbelcheck-stappen?",
            options: [
              "Vraag het nog eens",
              "Check de logica",
              "Zoek een andere bron",
              "Negeer het",
              "Vraag een mens",
            ],
            correctIndex: 1,
            why: "Logica, bron, mens. In die volgorde. (Juist: Check de logica, Zoek een andere bron, Vraag een mens.)",
          },
        ],
      },
      {
        id: "2.5",
        worldId: 2,
        pillar: "smart",
        title: "Krachtwoorden voor betere prompts",
        emoji: "✨",
        sparkIntro: "Hoi! Vandaag ga ik je een paar geheim-woorden leren. Tover-woorden. Nee, maak er krachtwoorden van. Woorden die je in je vragen aan AI stopt, en ineens wordt het antwoord drie keer beter. Ik beloof je, dit is een van mijn favoriete lessen. Klein trucje, groot effect.",
        theoryIntro: `**Wat zijn krachtwoorden?**

Krachtwoorden zijn woorden waar AI heel goed op reageert. Omdat AI is getraind op duizenden voorbeelden met die woorden. Als jij ze gebruikt, weet AI precies welke stijl, welke vorm, welke diepte je wilt.

Denk aan het als sport. Als je aan een gymleraar zegt 'ik wil een oefening', krijg je iets algemeens. Als je zegt 'ik wil een korte warming-up van 3 minuten voor mijn benen', krijg je precies wat je nodig hebt. Krachtwoorden doen bij AI hetzelfde.

Vandaag leer je vijf van die krachtwoorden. Gebruik je ze één, dan merk je al verschil. Gebruik je ze in combinatie, dan wordt het echt bizar wat voor goede antwoorden je krijgt.`,
        fact: "Mensen die AI professioneel gebruiken, noemen zichzelf vaak 'prompt engineers'. Engineers, zoals ingenieurs. Omdat goed vragen stellen aan AI bijna een vak is geworden. Met wat je nu leert, ben je al begonnen aan dat vak. Niet slecht voor iemand van 10.",
        sparkMiddle: "Oké, de vijf krachtwoorden. Ik ga ze niet allemaal uitleggen met lange verhalen. Je leert ze door ze te gebruiken. Dus luister, onthoud, en probeer ze uit.",
        theoryDeep: `**De 5 krachtwoorden**

Krachtwoord 1: 'STAP VOOR STAP'. Voeg dit toe aan rekenvragen, uitleg-vragen, of alles waar je het proces wilt snappen. 'Leg breuken stap voor stap uit.' AI zet ineens alles netjes op een rij.

Krachtwoord 2: 'IN MAKKELIJKE TAAL' (of 'voor een kind van 10'). AI schrijft vaak te ingewikkeld. Dit woord forceert simpele taal. Perfect voor vakken die moeilijk voelen.

Krachtwoord 3: 'GEEF EEN VOORBEELD'. Theorie snap je pas echt door voorbeelden. Voeg dit toe en AI geeft je iets concreets bij elke uitleg.

Krachtwoord 4: 'IN 3 ZINNEN' (of 5, of 100 woorden). Bepaal zelf de lengte. AI houdt er zich (meestal) aan. Veel fijner dan een halve roman terugkrijgen.

Krachtwoord 5: 'WAT WEET IK HIEROVER NIET?' Dit is mijn favoriet. Je vraagt AI niet om iets uit te leggen, maar om te checken waar JIJ nog lacunes hebt. Perfect voor spreekbeurten en toetsen voorbereiden.

Eén voorbeeld met alles samen. Slap: 'Leg de waterkringloop uit.' Sterk: 'Leg de waterkringloop stap voor stap uit, in makkelijke taal, met een voorbeeld, in ongeveer 5 zinnen.' Probeer het. Dit is serieus gamechanging (oeps, dat woord gebruik ik niet). Dit is serieus nuttig.`,
        interactive: tap(
          "Kies welk krachtwoord deze vraag zou verbeteren.",
          [
            { label: "Leg de stelling van Pythagoras uit.", reveal: `✅ Beste keuze: "stap voor stap"

Stelling van Pythagoras heeft stappen nodig. Voor een 10-jarige sowieso handig.` },
            { label: "Vertel me over de bloedcirculatie.", reveal: `✅ Beste keuze: "in makkelijke taal"

Je bent 10. Makkelijke taal maakt moeilijke biologie behapbaar.` },
            { label: "Leg zwaartekracht uit.", reveal: `✅ Beste keuze: "met een voorbeeld"

Voorbeeld is goud bij abstracte concepten. 'Zoals een appel die valt'.` },
            { label: "Vertel me over de Romeinen.", reveal: `✅ Beste keuze: "in 5 zinnen"

Begrenzing is kracht. 'In 5 zinnen' dwingt AI het belangrijkste te kiezen.` },
            { label: "Bereid me voor op mijn toets over de Gouden Eeuw.", reveal: `✅ Beste keuze: "wat weet ik hierover niet?"

Krachtwoord 5. AI checkt wat jij nog niet weet, in plaats van op te stapelen wat je al kent.` },
          ],
        ),
        summary: [
          "Krachtwoorden maken je vraag scherper en je antwoord beter.",
          "De vijf: 'stap voor stap', 'in makkelijke taal', 'geef een voorbeeld', 'in X zinnen', 'wat weet ik hierover niet?'.",
          "Gebruik ze solo of combineer ze. Eén regel voor een heel ander niveau antwoord.",
        ],
        quiz: [
          {
            question: "Welk krachtwoord helpt als je iets moeilijks uitgelegd wilt krijgen?",
            options: [
              "Saai",
              "In makkelijke taal",
              "Fancy",
              "Met grappen",
            ],
            correctIndex: 1,
            why: "In makkelijke taal. Werkt wonderen bij moeilijke onderwerpen.",
          },
          {
            question: "Eén extra zin in je vraag kan al een veel beter antwoord opleveren.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 0,
            why: "Klopt. Kleine moeite, grote impact.",
          },
          {
            question: "Welke zijn echte krachtwoorden die AI-antwoorden verbeteren?",
            options: [
              "Stap voor stap",
              "In makkelijke taal",
              "Heel uitgebreid alsjeblieft",
              "Geef een voorbeeld",
              "Zeg alles",
            ],
            correctIndex: 0,
            why: "Stap voor stap, in makkelijke taal, geef een voorbeeld. De andere twee zijn juist vaag. (Juist: Stap voor stap, In makkelijke taal, Geef een voorbeeld.)",
          },
        ],
      },
      {
        id: "2.6",
        worldId: 2,
        pillar: "smart",
        title: "AI zegt iets raars: nu wat?",
        emoji: "🤨",
        sparkIntro: "Hoi! Vandaag iets praktisch. Want op een dag gebeurt het. Je stelt een normale vraag, en AI begint ineens rare dingen te doen. Verwarde antwoorden, rondjes draaien, of iets wat gewoon niet klopt. Wat doe je dan? Geen paniek, je bent niet kapot. Je hebt gewoon drie trucjes nodig.",
        theoryIntro: `**Waarom gaat AI soms in de war?**

AI is niet perfect. Soms heb je een gesprek waarin het ineens een boekie zit te schrijven. Of het herhaalt zichzelf. Of het antwoordt op een vraag die je helemaal niet stelde. Of het geeft iets overduidelijks fout.

Dat komt meestal omdat het een verwarrend eerder bericht heeft gekregen. Of omdat je vraag te open was. Of gewoon omdat AI een slechte gok maakte en daarop bleef verder gokken. Net zoals jij weleens de verkeerde afslag neemt en dan nóg verder de verkeerde kant opgaat.

Goed nieuws: je hebt drie simpele acties om het op te lossen.`,
        fact: "Mensen die veel met AI werken noemen het 'vastlopen' vaak een 'lus'. Net zoals een liedje dat blijft herhalen op Spotify. AI kan in zo'n lus komen en er niet zelf uitkomen. Jij moet hem eruit halen. Beetje als een liedje stoppen en opnieuw beginnen.",
        sparkMiddle: "Oké, jouw drie gereedschappen voor als AI raar doet. Makkelijk, ik beloof het.",
        theoryDeep: `**De drie acties**

Actie 1: RESET. Start een nieuw gesprek. Oude rommel weg, schone start. Oude vraag opnieuw stellen, maar dan in een nieuw chat-venster. Dit werkt verbazend vaak. De meeste verwarde AI-gesprekken zijn met een simpele nieuwe start opgelost.

Actie 2: HERFORMULEER. Stel dezelfde vraag, maar anders. Meer context, andere woorden, meer detail. 'Wat is een atoom?' → 'Leg in makkelijke taal voor een kind van 10 uit wat een atoom is, stap voor stap.' Meestal pakt AI het dan wel.

Actie 3: STOP. Soms is AI gewoon niet de juiste tool. Dan stop je. Ga naar Google. Vraag het aan je ouders. Pak een boek. Niet elke vraag hoort bij AI. Dat is ook oké.

En een bonus: als AI iets gemeens zegt, of iets wat je niet leuk vindt, of iets wat ronduit fout of eng is, is STOP altijd de juiste keuze. Vertel een volwassene wat er gebeurde. Dat geldt altijd.`,
        interactive: sort(
          "Bij elke situatie: welke actie past het best?",
          ["🔁 Reset", "✏️ Herformuleer", "🛑 Stop"],
          [
            { label: "AI begint hetzelfde antwoord steeds opnieuw te geven, ook na extra vragen.", bucket: 0 },
            { label: "AI geeft een vaag antwoord dat niet echt ingaat op je vraag.", bucket: 1 },
            { label: "AI zegt iets wat je een onprettig gevoel geeft of niet bij jouw leeftijd past.", bucket: 2 },
            { label: "AI geeft een heel kort en oppervlakkig antwoord op iets wat je dieper wilt begrijpen.", bucket: 1 },
            { label: "Je stelt een vraag en AI begint ineens over iets heel anders dan je vraag.", bucket: 0 },
          ],
        ),
        summary: [
          "Als AI raar doet: drie acties. RESET (nieuwe chat), HERFORMULEER (vraag anders stellen), STOP (andere tool of volwassene).",
          "De meeste rare AI-momenten zijn opgelost met reset of een betere vraag.",
          "Bij enge of gemene antwoorden: altijd STOP en een volwassene inlichten.",
        ],
        quiz: [
          {
            question: "AI geeft steeds hetzelfde antwoord, ook als je doorvraagt. Wat doe je?",
            options: [
              "Nog harder doorvragen",
              "Reset: start een nieuw gesprek",
              "Opgeven",
              "Negeren en doorgaan",
            ],
            correctIndex: 1,
            why: "Reset. Frisse chat is meestal de snelste oplossing voor een lus.",
          },
          {
            question: "Als AI iets naars zegt, moet ik een volwassene erbij halen.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 0,
            why: "Ja. Altijd. Jij hoeft dat niet alleen op te lossen.",
          },
          {
            question: "Welke drie acties kun je doen als AI raar reageert?",
            options: [
              "Reset",
              "Boos worden",
              "Herformuleer",
              "Stop",
              "Het scherm stukmaken",
            ],
            correctIndex: 0,
            why: "Reset, herformuleer, stop. De andere twee helpen niet. (Juist: Reset, Herformuleer, Stop.)",
          },
        ],
      },
      {
        id: "2.7",
        worldId: 2,
        pillar: "smart",
        title: "Verschillende AI's, verschillende sterktes",
        emoji: "🌐",
        sparkIntro: "Hoi! Grappig feitje om mee te beginnen. Misschien denk je: 'AI, dat is toch één ding?' Nope. Er zijn er heel veel. Net zoals er verschillende sportmerken zijn, verschillende game-studio's, verschillende ijsmerken. Elke AI is goed in iets anders. Handig om te weten. Eens kijken.",
        theoryIntro: `**AI is niet één ding**

Er zijn grote AI-bedrijven die elk hun eigen AI maken. ChatGPT is van een bedrijf dat OpenAI heet. Claude is van een bedrijf dat Anthropic heet. Gemini is van Google. Copilot is van Microsoft.

Elke AI is getraind op een andere manier en soms met andere dingen. Sommige zijn beter in tekst schrijven. Andere in rekenen. Weer andere in plaatjes maken. En sommige zijn voor volwassenen gemaakt, andere ook veilig voor kinderen, en weer andere voor bedrijven.

En een belangrijke: niet elke AI is even veilig voor jouw leeftijd. Vandaar dat je ouders of school vaak specifiek zeggen welke je mag gebruiken. Houd je daaraan.`,
        fact: "Veel mensen gebruiken meerdere AI's naast elkaar. Ze stellen dezelfde vraag aan twee AI's en vergelijken de antwoorden. Dat heet 'triangulatie'. Klinkt fancy, maar het is gewoon: niet op één AI vertrouwen. Je kunt ook AI1 laten checken wat AI2 zei. Die trucs leer je nog niet nu, maar leuk om te weten.",
        sparkMiddle: "Oké, dus niet één AI. Vele. Elk anders. Hoe onthoud je dat? Laat me het klein maken.",
        theoryDeep: `**Welke AI voor welke klus?**

Stel je moet een tekst schrijven. Bijna alle grote AI's doen dat goed.

Moet je een plaatje maken? Daar zijn speciale AI's voor. DALL-E, Midjourney, Stable Diffusion. Tekst-AI's kunnen meestal geen plaatjes maken (of alleen heel basic).

Moet je een moeilijke rekenopgave oplossen? Sommige AI's zijn daar sterker in dan andere. Gemini en Claude bijvoorbeeld doen meestal wiskunde beter dan andere, al verandert dat snel.

Moet je code schrijven voor een game? Ook daar zijn AI's in gespecialiseerd, zoals Copilot en Claude.

Maar en dit is belangrijk: het verandert snel. Wat vandaag het beste is, is volgend jaar misschien tweede. Wat je moet onthouden is niet welke AI het beste is, maar dat er MEER ZIJN. Zodat als één je niet helpt, je weet dat je een andere kan proberen. Of een volwassene kan vragen welke geschikt is voor jouw vraag.

Voor AI met Spark geldt: wij gebruiken alleen AI die veilig is voor jouw leeftijd. Buiten deze app, als je thuis met AI werkt, altijd even checken met je ouders welke AI je gebruikt.`,
        interactive: sort(
          "Welk type AI gebruik je voor welke klus?",
          ["📝 Tekst-AI", "🎨 Plaatjes-AI", "🎵 Muziek-AI"],
          [
            { label: "Je wilt een tekening maken van een draak op een skateboard.", bucket: 1 },
            { label: "Je wilt hulp met een opstel schrijven.", bucket: 0 },
            { label: "Je wilt een lied maken voor je moeders verjaardag.", bucket: 2 },
            { label: "Je zit vast bij een breuken-som.", bucket: 0 },
          ],
        ),
        summary: [
          "Er zijn heel veel AI's, elk goed in iets anders (tekst, plaatjes, muziek, code).",
          "Welke AI je gebruikt hangt af van je klus en van wat veilig is voor jouw leeftijd.",
          "Niet één AI is overal het beste in. Soms helpt het om te wisselen of een andere te proberen.",
        ],
        quiz: [
          {
            question: "Wat is waar over AI-soorten?",
            options: [
              "Er is maar één AI",
              "Er zijn veel AI's en elke is goed in iets anders",
              "Alle AI's doen precies hetzelfde",
              "AI is alleen voor tekst",
            ],
            correctIndex: 1,
            why: "Veel AI's, verschillende sterktes. Onthoud dat.",
          },
          {
            question: "Een tekst-AI kan meestal ook goede plaatjes maken.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Nee. Daar zijn aparte plaatjes-AI's voor (zoals DALL-E).",
          },
          {
            question: "Welke typen AI bestaan er?",
            options: [
              "Tekst-AI",
              "Plaatjes-AI",
              "Slaap-AI",
              "Muziek-AI",
              "Gras-AI",
            ],
            correctIndex: 0,
            why: "Tekst, plaatjes, muziek. Slaap-AI en gras-AI bestaan (nog) niet. (Juist: Tekst-AI, Plaatjes-AI, Muziek-AI.)",
          },
        ],
      },
      {
        id: "2.8",
        worldId: 2,
        pillar: "smart",
        title: "Wereld 2 Baas-test",
        emoji: "🧭",
        bossTest: true,
        sparkIntro: "Hoi! Zeven lessen. Klaar met studeren, tijd om te laten zien wat je in je hoofd hebt zitten. Geen nieuwe stof. Alleen even terugblikken, en dan de baas-test. Rustig ademhalen. Ik weet zeker dat je dit kan.",
        theoryIntro: `**Wat je deze wereld hebt geleerd**

Samen terugblikken op wereld 2, als warming-up.

Les 1: AI gokt. Woord voor woord. Meestal goed, soms fout. Klinkt altijd zelfverzekerd, ook als het naast zit.

Les 2: AI kan hallucineren. Dingen verzinnen en als feit brengen. Vooral bij specifieke namen, jaartallen en kleinere plaatsen.

Les 3: WIE-WAT-HOE. De formule voor slimme vragen. Wie ben je, wat wil je, hoe moet het eruit zien.

Les 4: Dubbelcheck in drie stappen. Logica, andere bron, vraag een mens. Belangrijker info = meer stappen.`,
        fact: "Hersenen onthouden dingen beter als ze actief worden opgehaald. Lezen is handig. Maar een test doen zorgt dat de kennis dieper in je hoofd zit. Na vandaag ben je geen beginner meer. Je bent iemand die weet hoe AI echt werkt.",
        sparkMiddle: "Nog drie lessen snel herhaald, dan gaan we testen. Alle vragen komen uit wat we samen gedaan hebben. Niets nieuws. Beloofd.",
        theoryDeep: `**Les 5, 6 en 7 kort herhaald**

Les 5: Krachtwoorden. Vijf stuks. 'Stap voor stap', 'in makkelijke taal', 'geef een voorbeeld', 'in X zinnen', 'wat weet ik hierover niet?'. Gebruik ze solo of gecombineerd.

Les 6: AI doet raar? Drie acties. RESET (nieuwe chat), HERFORMULEER (vraag anders stellen), STOP (andere tool of volwassene). Bij enge antwoorden altijd STOP.

Les 7: Er zijn vele AI's. Tekst, plaatjes, muziek, code. Niet één AI is overal het beste in. Welke je gebruikt hangt af van je klus én van wat veilig is voor jouw leeftijd.

Dat is wereld 2. Nu jij.`,
        interactive: mc(
          "Hoe werkt AI eigenlijk?",
          [
            { label: "Het weet alles", correct: false },
            { label: "Het gokt woord voor woord op basis van voorbeelden", correct: true },
            { label: "Het kopieert het internet", correct: false },
            { label: "Het heeft gevoelens", correct: false },
          ],
          "Goed zo. Nu nog een paar vragen in de quiz hieronder.",
        ),
        summary: [
          "Je hebt wereld 2 afgerond. 8 lessen over hoe je AI slim en kritisch gebruikt.",
          "Je bent officieel SLIM-gecertificeerd. Het Kompas van Wijsheid is van jou.",
          "Volgende stop: wereld 3 STERKER. Daar gaan we zien hoe je met AI dingen maakt en leert, zonder dat je zelf stopt met nadenken.",
        ],
        quiz: [
          {
            question: "Hoe werkt AI eigenlijk?",
            options: [
              "Het weet alles",
              "Het gokt woord voor woord op basis van voorbeelden",
              "Het kopieert het internet",
              "Het heeft gevoelens",
            ],
            correctIndex: 1,
            why: "Bron: les Les 1.",
          },
          {
            question: "Wat is een AI-hallucinatie?",
            options: [
              "AI valt uit",
              "AI verzint dingen en brengt ze als feit",
              "AI wordt boos",
              "AI geeft geen antwoord",
            ],
            correctIndex: 1,
            why: "Bron: les Les 2.",
          },
          {
            question: "De formule voor een slimme vraag aan AI is:",
            options: [
              "Ja-Nee-Misschien",
              "WIE-WAT-HOE",
              "Snel-Kort-Dichtbij",
              "Help-Nu-Please",
            ],
            correctIndex: 1,
            why: "Bron: les Les 3.",
          },
          {
            question: "Wat is de EERSTE dubbelcheck-stap?",
            options: [
              "Vraag een mens",
              "Check de logica",
              "Googlen",
              "Opnieuw aan AI vragen",
            ],
            correctIndex: 1,
            why: "Bron: les Les 4.",
          },
          {
            question: "Welk is een krachtwoord voor betere AI-antwoorden?",
            options: [
              "Uitgebreid alsjeblieft",
              "Stap voor stap",
              "Alles",
              "Snel",
            ],
            correctIndex: 1,
            why: "Bron: les Les 5.",
          },
          {
            question: "AI blijft hetzelfde antwoord geven. Wat doe je?",
            options: [
              "Harder typen",
              "Reset: nieuwe chat",
              "Opgeven",
              "Schreeuwen",
            ],
            correctIndex: 1,
            why: "Bron: les Les 6.",
          },
          {
            question: "Welk is waar over AI-soorten?",
            options: [
              "Er is maar één AI",
              "Verschillende AI's zijn goed in verschillende dingen",
              "Ze zijn allemaal gelijk",
              "Alleen tekst-AI's bestaan",
            ],
            correctIndex: 1,
            why: "Bron: les Les 7.",
          },
          {
            question: "Als AI zelfverzekerd klinkt, klopt het antwoord zeker.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Nee. AI klinkt altijd zelfverzekerd. Checken moet je zelf. (Bron: les Les 1.)",
          },
        ],
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
      // ---------- Les 3.1 ----------
      {
        id: "3.1",
        worldId: 3,
        pillar: "stronger",
        title: "Tutor of sluiproute? Jij kiest",
        emoji: "🛤️",
        sparkIntro: "Hoi! Welkom bij wereld 3. Dit wordt mijn lievelingswereld, eerlijk gezegd. Want vanaf nu gaan we niet alleen veilig en slim met AI zijn. We gaan STERKER worden ermee. Maar eerst een eerlijke vraag. Wat wil jij eigenlijk: dat AI je huiswerk doet, of dat AI jou helpt slim te worden? Klein verschil, groot resultaat. Laten we kijken.",
        theoryIntro: "**De twee soorten AI-gebruik**\n\nEr zijn grofweg twee manieren om AI te gebruiken bij je schoolwerk.\n\nManier 1: AI is de SLUIPROUTE. Je zegt 'schrijf mijn opstel' en je plakt het antwoord in. Klaar. Tien minuten werk. Voelt snel en slim.\n\nManier 2: AI is de TUTOR. Je zegt 'leg uit hoe ik een opstel opbouw' of 'wat zijn sterke startzinnen'. Je doet het zelf, met hulp. Duurt langer. Voelt soms pittiger.\n\nGokje: welke denk je dat beter is? Hint, het is manier 2. Maar waarom eigenlijk? Laten we kijken wat er gebeurt in je hoofd.",
        fact: "Je hersenen werken als een spier. Als je ze gebruikt, worden ze sterker. Als je ze niet gebruikt, worden ze slapper. Letterlijk. Wetenschappers hebben scans gemaakt van mensen die veel denken en van mensen die weinig denken, en je kunt het zien op de hersenscan. Een brein dat oefent, groeit.",
        sparkMiddle: "Oké, dus je brein wordt sterker als je het gebruikt. Logisch dus dat we niet alles door AI laten doen. Maar wat dan wel? Hoe gebruik je AI zonder dat je hersenspier slapper wordt? Hier komt het.",
        theoryDeep: "**De denk-check voor elke AI-vraag**\n\nVoor je iets aan AI vraagt, stel jezelf één vraag: maakt dit mij slimmer of maakt dit alleen mijn huiswerk af?\n\nTwee voorbeelden om het te voelen.\n\nSluiproute: 'Maak een werkstuk over wolven.' AI doet al het werk. Jij leert niks.\n\nTutor: 'Wat zijn de 5 belangrijkste dingen om in een werkstuk over wolven te zetten, en waarom?' AI helpt je denken. Jij schrijft het zelf. Jij leert.\n\nNog een paar voorbeelden:\n\nSluiproute: 'Los deze som op: 37 x 24.' Je hebt een antwoord, je bent niks wijzer geworden.\n\nTutor: 'Leg uit hoe ik 37 x 24 stap voor stap zelf kan uitrekenen.' Je snapt het. Volgende keer kan je het alleen.\n\nSluiproute: 'Schrijf een gedicht voor mijn oma.'\nTutor: 'Geef me 5 tips voor een mooi gedicht voor een oma, dan schrijf ik het zelf.'\n\nZie je het patroon? De tutor-vraag eindigt bijna altijd met 'dan doe ik het zelf'. De sluiproute laat AI jouw werk overnemen. Jij bepaalt. Geen leraar die over je schouder kijkt. Alleen jouw keuze.",
        interactive: sort(
          "Elke vraag: sluiproute of tutor-gebruik? Tik aan.",
          ["Tutor (maakt slimmer)", "Sluiproute (doet voor je)"],
          [
            { label: "Schrijf mijn werkstuk over vulkanen.", bucket: 1 },
            { label: "Wat zijn de drie belangrijkste feiten over vulkanen voor een werkstuk?", bucket: 0 },
            { label: "Los deze 10 sommen voor me op.", bucket: 1 },
            { label: "Leg uit hoe ik breuken optel, stap voor stap.", bucket: 0 },
            { label: "Maak een grappig TikTok-script voor me.", bucket: 1 },
            { label: "Wat maakt een goede TikTok-grap, geef me 3 voorbeelden en ik schrijf zelf.", bucket: 0 },
            { label: "Beantwoord alle vragen van mijn toets-oefenboek.", bucket: 1 },
            { label: "Als ik deze som fout heb, kun je uitleggen waar mijn denkfout zit?", bucket: 0 },
          ],
        ),
        summary: [
          "Er zijn twee soorten AI-gebruik: SLUIPROUTE (AI doet het voor je) en TUTOR (AI helpt jou het zelf doen).",
          "Je hersenen zijn als een spier. Gebruik ze en ze worden sterker. Verwaarloos ze en ze worden slapper.",
          "Check voor elke vraag: maakt dit mij slimmer, of maakt dit alleen mijn huiswerk af?",
        ],
        quiz: [
          {
            question: "Welke van deze vragen is een tutor-vraag?",
            options: ["Schrijf mijn opstel", "Leg uit hoe ik een goed opstel opbouw", "Maak een rekenproefwerk voor me", "Doe al mijn huiswerk"],
            correctIndex: 1,
            why: "Tutor-vraag: je laat AI uitleggen, dan doe jij het zelf.",
          },
          {
            question: "Je hersenen worden sterker als je ze gebruikt, net als een spier.",
            options: ["Waar", "Niet waar"],
            correctIndex: 0,
            why: "Klopt. Wetenschappelijk bewezen. Denken = groeien.",
          },
          {
            question: "Welke vragen maken je SLIMMER? Tik ze allemaal aan en druk op Klaar.",
            options: ["Leg uit hoe ik dit aanpak", "Doe het voor me", "Geef me 3 tips, dan doe ik het zelf", "Maak mijn werkstuk", "Waar zit mijn denkfout?"],
            correctIndex: 0,
            why: "Uitleg, tips, en denkfout-check. Alle drie maken jou sterker.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.2 ----------
      {
        id: "3.2",
        worldId: 3,
        pillar: "stronger",
        title: "Brainstormen zonder kopiëren",
        emoji: "💡",
        sparkIntro: "Hoi! Vandaag leer ik je iets wat schrijvers, ontwerpers en kunstenaars al jaren doen. Brainstormen met AI. Het is niet hetzelfde als AI je opstel laten schrijven. Het is eerder alsof je met een vriend samen ideeën verzamelt, en dan ga jij ermee aan de slag. Klinkt goed? Gaan we doen.",
        theoryIntro: "**Wat is brainstormen?**\n\nBrainstormen is: zoveel mogelijk ideeën bedenken zonder meteen te oordelen. Ook rare ideeën. Ook slechte ideeën. Want tussen 20 rare ideeën zit vaak één goed idee dat je anders niet had bedacht.\n\nAI is hier briljant in. Je kunt in 30 seconden 20 ideeën krijgen over ongeveer alles. Onderwerp voor een verhaal? 20. Hoe je een saaie les leuker maakt? 20. Een cadeau voor je broer? 20.\n\nMaar. En dit is belangrijk. Die 20 ideeën zijn nog niet JOUW ideeën. Dat zijn beginpunten. Jij moet er wat mee. Anders ben je alleen een kopieermachine.",
        fact: "Veel schrijvers gebruiken AI als 'sparring-partner'. Ze gooien een idee erin, AI gooit er 10 variaties op terug, en de schrijver kiest wat goed voelt en schrijft de rest zelf. Zelfs Nederlandse kinderboekenschrijvers doen dit. Het is geen valsspelen. Het is gewoon een slim gereedschap, net zoals een woordenboek.",
        sparkMiddle: "Oké, dus brainstormen met AI is top. Maar hoe doe je het zodat het JOUW werk blijft, niet dat van AI? Hier komen drie stappen.",
        theoryDeep: "**De drie-stappen-brainstorm**\n\nStap 1: VRAAG VEEL. Niet 'geef me een idee voor een verhaal'. Maar: 'geef me 15 ideeën voor een verhaal over vriendschap'. Hoe meer opties, hoe meer kans dat er iets goed in zit.\n\nStap 2: KIES WAT VOELT. Van die 15 ideeën zijn er misschien 12 saai, 2 oké en 1 die je direct aansprekt. Kies dat ene. Niet omdat AI het eerste noemde, maar omdat HET JOU raakt.\n\nStap 3: MAAK HET VAN JOU. Voeg iets persoonlijks toe. Iets uit jouw leven. Een grap die alleen jij snapt. Een detail dat kleurt. Nu is het geen AI-idee meer. Het is jouw idee, met AI-hulp begonnen.\n\nEén voorbeeld om te zien hoe het werkt.\n\nVraag aan AI: 'Geef me 10 ideeën voor een grappig verhaal voor de klas.'\nAI geeft 10 ideeën. Eentje is: 'een hond die stiekem huiswerk opeet.'\nJij denkt: hé, dat doet mijn eigen hond echt. Ik maak het persoonlijker: de hond heet Max (mijn hond), hij leert door papier te eten, en uiteindelijk weet hij meer dan de meester.\n\nKlaar. AI heeft je de spark gegeven. JIJ hebt het verhaal gemaakt.",
        interactive: mc(
          "Je hebt AI gevraagd om ideeën. Wat doe je daarna? Orden de stappen in de juiste volgorde.",
          [
            { label: "Vraag AI om 10-20 ideeën. → Kies het idee dat JOU het meest aanspreekt. → Voeg iets persoonlijks van jezelf toe. → Ga zelf schrijven of maken.", correct: true },
            { label: "Ga zelf schrijven of maken. → Voeg iets persoonlijks van jezelf toe. → Kies het idee dat JOU het meest aanspreekt. → Vraag AI om 10-20 ideeën.", correct: false },
            { label: "Kies het idee dat JOU het meest aanspreekt. → Voeg iets persoonlijks van jezelf toe. → Vraag AI om 10-20 ideeën. → Ga zelf schrijven of maken.", correct: false },
          ],
          "Eerst veel vragen, dan kiezen wat past, dan persoonlijk maken, dan zelf doen. In die volgorde blijft het JOUW werk.",
        ),
        summary: [
          "Brainstormen = veel ideeën verzamelen zonder meteen te oordelen. AI is hier heel goed in.",
          "Drie stappen: vraag veel (15-20 ideeën), kies wat voelt, maak het van jou.",
          "AI geeft de spark. Jij maakt het vuur. Dat is het verschil tussen kopiëren en creëren.",
        ],
        quiz: [
          {
            question: "Wat is de eerste stap van een goede AI-brainstorm?",
            options: ["Vraag één perfect idee", "Vraag om 10-20 ideeën", "Vraag AI het werk te doen", "Vraag niets, doe het zelf"],
            correctIndex: 1,
            why: "Veel ideeën. Daar haal je de spark uit.",
          },
          {
            question: "Als AI je 10 ideeën geeft, kies je het eerste en gebruik je dat.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Nee. Kies het idee dat JOU raakt. Niet het eerste, niet het meest logische. Wat voelt.",
          },
          {
            question: "Wat moet je doen om een AI-idee jouw eigen idee te maken? Tik ze allemaal aan en druk op Klaar.",
            options: ["Iets persoonlijks toevoegen", "Het letterlijk kopiëren", "Je eigen ervaringen erin verwerken", "Het zonder aanpassing gebruiken", "Een eigen draai geven"],
            correctIndex: 0,
            why: "Persoonlijk maken, eigen ervaring, eigen draai. Dan is het van jou.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.3 ----------
      {
        id: "3.3",
        worldId: 3,
        pillar: "stronger",
        title: "AI als uitleg-maatje",
        emoji: "🧠",
        sparkIntro: "Hoi! Iedereen heeft wel een vak of onderwerp waarvan je denkt: 'ik snap er echt niks van'. Voor mij zijn dat hele kleine getallen, decimalen ofzo. Voor jou misschien iets heel anders. Goed nieuws: AI kan een super geduldige uitlegger zijn. Ik laat je zien hoe.",
        theoryIntro: "**Waarom AI een goede uitlegger kan zijn**\n\nEen leraar heeft 28 leerlingen in de klas. Die moet hij in 45 minuten iets leren. Dus er is niet altijd tijd om één onderwerp 5 keer anders uit te leggen tot het klikt.\n\nAI wel. AI heeft alle tijd. Je kunt het tien keer hetzelfde vragen op tien manieren, en het wordt nooit moe of chagrijnig. Dat is voor sommige kinderen een gamechanger. Vooral als je iets net niet snapt en je niet weet hoe je het moet vragen op school.\n\nMaar. En dit is belangrijk. AI is geen vervanging van je leraar. AI kan fouten maken (weet je nog, wereld 2?). Dus als AI iets uitlegt wat je snapt en het past niet bij wat je leraar zegt, vertrouw je leraar.",
        fact: "Er is een beroemde natuurkundige genaamd Richard Feynman die zei: als je iets niet kunt uitleggen aan een kind van 10, snap je het zelf niet goed genoeg. Jij hebt nu een tool die alles kan proberen uit te leggen op jouw niveau. Best wel bijzonder.",
        sparkMiddle: "Oké, AI kan je helpen. Maar hoe krijg je de beste uitleg? Hier komt de magie: je moet weten hoe je het VRAAGT. Drie vragen die altijd werken.",
        theoryDeep: "**Drie uitleg-vragen die altijd werken**\n\nVraag 1: 'Leg uit alsof ik 10 ben.' Werkt bijna altijd. AI schakelt dan naar simpele taal en alledaagse voorbeelden. Probeer het eens met een moeilijk onderwerp. Het verschil is groot.\n\nVraag 2: 'Leg het uit met een voorbeeld dat ik ken.' Voeg toe waar je van houdt of wat je kent. 'Leg zwaartekracht uit met een voorbeeld uit Minecraft' of 'Leg procenten uit alsof het gaat over Pokémon-kaarten'. Ineens klikt stof die je eerst niks zei.\n\nVraag 3: 'Ik snap dit stukje niet: ...' En dan plak je precies het zinnetje waar je vastloopt. AI legt niet het hele onderwerp uit, maar helpt specifiek daar waar jij strandt. Veel efficiënter.\n\nEn een bonus: als je de uitleg nog niet snapt, vraag dan: 'leg het nog een keer uit, maar anders'. Soms werkt de tweede of derde poging wel. AI heeft oneindig geduld, gebruik dat.",
        interactive: tap(
          "Welke vraag werkt het beste voor jouw situatie?",
          [
            { label: "Je vastloopt op één specifieke rekenopgave: 84 : 12.", reveal: "Beste keuze: \"Leg 84 : 12 stap voor stap uit alsof ik 10 ben.\"\n\nSpecifiek en met niveau-tag. AI gaat je precies deze som helpen, op jouw niveau." },
            { label: "Je snapt niks van fotosynthese.", reveal: "Beste keuze: \"Leg fotosynthese uit alsof ik 10 ben, met een voorbeeld dat ik ken.\"\n\nNiveau-tag + voorbeeld-verzoek. AI past zich aan aan jou." },
            { label: "In je geschiedenisboek staat een zin die je niet begrijpt: 'De Gouden Eeuw was een periode van welvaart.'", reveal: "Beste keuze: \"Wat is deze zin: 'De Gouden Eeuw was een periode van welvaart.' Leg uit alsof ik 10 ben.\"\n\nSpecifieke zin plakken + niveau-tag. Efficiënt." },
          ],
        ),
        summary: [
          "AI kan een geduldige uitlegger zijn, oneindig vaak op verschillende manieren.",
          "Drie krachtvragen: 'leg uit alsof ik 10 ben', 'leg uit met een voorbeeld dat ik ken', 'ik snap dit stukje niet: ...'",
          "AI vervangt je leraar niet. Bij twijfel vertrouw je leraar of je ouder.",
        ],
        quiz: [
          {
            question: "Welke vraag helpt AI iets simpel uit te leggen?",
            options: ["Zeg alles wat je weet", "Leg uit alsof ik 10 ben", "Schrijf een lang verhaal", "Vertel details"],
            correctIndex: 1,
            why: "'Alsof ik 10 ben' is een toverzin. AI schakelt om.",
          },
          {
            question: "Als AI iets uitlegt wat niet matcht met wat je leraar zegt, vertrouw je AI.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Nee. Je leraar is je vaste bron. AI kan fouten maken.",
          },
          {
            question: "Welke tips helpen bij AI-uitleg? Tik ze allemaal aan en druk op Klaar.",
            options: ["Vraag op jouw niveau", "Plak precies de zin die je niet snapt", "Vraag nooit nog een keer", "Vraag om een voorbeeld dat je kent", "Vertel dat je het niet snapt en vraag het anders uit te leggen"],
            correctIndex: 0,
            why: "Niveau, specifieke zin, bekend voorbeeld, opnieuw vragen. Alle vier helpen.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.4 ----------
      {
        id: "3.4",
        worldId: 3,
        pillar: "stronger",
        title: "AI als oefen-maatje",
        emoji: "🎯",
        sparkIntro: "Hoi! Vandaag iets wat ik eerlijk gezegd best cool vind. Je kunt AI gebruiken om zichzelf te overhoren. Alsof je een privé-leraar hebt die ENKEL vragen stelt over de stof die jij moet leren. Eindeloos. Gratis. Zonder dat hij moe wordt. Klinkt dat oké? Laten we kijken.",
        theoryIntro: "**Waarom overhoren werkt**\n\nLeren doe je niet door een boek open te slaan en er een uur naar te staren. Leren doe je door INFORMATIE TERUG TE HALEN uit je hoofd. Keer op keer.\n\nDat heet 'actief ophalen'. Wetenschappers hebben bewezen dat overhoren soms wel 3x beter werkt dan alleen opnieuw lezen. Dat is geen kleinigheid. Dat is het verschil tussen 5 en 8 op je toets.\n\nEn nu is AI er. Altijd beschikbaar. Oneindig veel vragen over elk onderwerp. Dat is eigenlijk een klein cadeautje voor elke leerling. Je hoeft alleen te weten hoe je het gebruikt.",
        fact: "Er zijn in Amerika al scholen waar leerlingen elke week met AI hun eigen kennis overhoren. De gemiddelde cijfers gingen naar boven, en de leerlingen vonden het niet eens saai. Want AI past zich aan aan JOUW niveau. Waar je sterk in bent, vliegt het doorheen. Waar je vastloopt, legt het uit.",
        sparkMiddle: "Nu komt het praktische. Hoe laat je AI jou overhoren? Drie manieren. Kies wat past bij je stof.",
        theoryDeep: "**Drie manieren om jezelf te overhoren met AI**\n\nManier 1: MULTIPLE CHOICE. Vraag: 'Maak 10 multiple choice vragen over de Tweede Wereldoorlog, 4 antwoorden per vraag, geen antwoorden tonen tot ik klaar ben.' AI maakt een quiz. Jij maakt hem. Daarna vraag je: 'nakijken.'\n\nManier 2: OPEN VRAGEN. Vraag: 'Stel me 5 open vragen over fotosynthese op het niveau van groep 7.' AI komt met vragen, jij typt antwoorden, AI geeft feedback. Dit werkt beter voor begrips-stof, niet voor feitjes.\n\nManier 3: FLASHCARDS. Vraag: 'Maak 20 flashcards over Franse woordjes thema eten. Vraag op de ene kant, antwoord op de andere.' Jij krijgt een lijst. Je kunt zelfs zeggen: 'overhoor me er willekeurig op door.'\n\nEen bonustip: als je klaar bent met overhoren, vraag 'wat waren de onderwerpen waar ik de meeste fouten maakte?' AI geeft terug waar je zwak stond. Dat ga je als eerste herlezen of nog eens oefenen. Dat is slim studeren. Niet harder, maar slimmer.",
        interactive: tap(
          "Welke overhoor-vraag aan AI is het best?",
          [
            { label: "Je moet de hoofdsteden van Europa leren.", reveal: "Beste keuze: \"Maak een quiz met 15 vragen over hoofdsteden van Europese landen. Geef antwoorden pas nadat ik alle vragen heb beantwoord.\"\n\nSpecifiek, gestructureerd, met aparte controle. Precies goed." },
            { label: "Je hebt morgen een toets over rekenen met decimalen.", reveal: "Beste keuze: \"Geef me 10 oefensommen met decimalen (optellen en vermenigvuldigen) voor groep 7. Laat me eerst zelf rekenen.\"\n\nHeldere opdracht, niveau-tag, en de juiste structuur (zelf eerst)." },
            { label: "Je moet 30 Engelse woordjes leren.", reveal: "Beste keuze: \"Maak flashcards van deze 30 woorden: [plak lijst]. Overhoor me willekeurig.\"\n\nPerfecte flashcard-opdracht. Concreet, met jouw lijst, met instructie." },
          ],
        ),
        summary: [
          "Overhoren werkt beter dan herlezen. Soms wel 3x beter.",
          "Drie manieren met AI: multiple choice, open vragen, flashcards. Kies wat past.",
          "Vraag achteraf altijd: 'waar maakte ik fouten?' Dat is je studieplan voor morgen.",
        ],
        quiz: [
          {
            question: "Wat werkt beter om stof te leren?",
            options: ["Het boek een uur lang herlezen", "Jezelf overhoren", "Alleen ernaar kijken", "Erover praten met vrienden"],
            correctIndex: 1,
            why: "Overhoren. Wetenschappelijk bewezen tot 3x effectiever dan herlezen.",
          },
          {
            question: "Na een oefentoets vraag je AI 'waar maakte ik fouten'.",
            options: ["Waar", "Niet waar"],
            correctIndex: 0,
            why: "Ja. Dat is de slimste vervolg-vraag. Je weet direct wat je nog moet oefenen.",
          },
          {
            question: "Welke types oefen-vragen kan AI maken? Tik ze allemaal aan en druk op Klaar.",
            options: ["Multiple choice", "Flashcards", "Open vragen", "Tekeningen", "Overhoor-rondes"],
            correctIndex: 0,
            why: "Multiple choice, flashcards, open vragen, overhoor-rondes. Tekeningen kan een plaatjes-AI.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.5 ----------
      {
        id: "3.5",
        worldId: 3,
        pillar: "stronger",
        title: "Maak iets eigens met AI",
        emoji: "🎨",
        sparkIntro: "Hoi! Dit wordt een van de leukste lessen. We gaan het hebben over creëren. Zelf iets maken, met AI als gereedschap. Een gedicht voor papa. Een verhaal voor je kleine broertje. Een tekening voor je kamer. AI als potlood, jij als kunstenaar. Ready?",
        theoryIntro: "**AI is een gereedschap, niet de maker**\n\nStel je geeft een potlood aan 100 kinderen. Krijg je 100 dezelfde tekeningen? Nee. Elk kind maakt iets anders. Want het potlood doet niks zelf. Jij bepaalt wat het tekent.\n\nAI is ook zo'n gereedschap. Als jij en ik aan AI dezelfde vraag stellen, kan het deels hetzelfde antwoord geven. Maar als jij je EIGEN ideeën, ervaringen en gevoelens erin verwerkt, wordt het ineens iets unieks. Iets wat niemand anders had kunnen maken. Omdat niemand anders IS zoals jij.\n\nDat is het verschil tussen 'AI maakt iets' en 'jij maakt iets met AI'. Woordspelling, groot verschil.",
        fact: "In Japan is er een jongen van 11 die een kinderboek heeft geschreven. Hij had de ideeën. AI hielp met uitwerken. Zijn illustraties tekende hij zelf. Het boek is een hit. Hij zegt zelf: 'AI is mijn pen. Ik ben de schrijver.' Coole manier om ernaar te kijken.",
        sparkMiddle: "Oké, hoe maak je iets dat echt van jou is? Drie regels die schrijvers en makers al jaren gebruiken. Werkt ook bij jou.",
        theoryDeep: "**De drie regels van maken-met-AI**\n\nRegel 1: JIJ BEGINT, NIET AI. Voor je iets aan AI vraagt, bedenk zelf iets. Een thema, een personage, een gevoel. Begin niet met 'verzin een verhaal'. Begin met 'Ik wil een verhaal over een eenzame draak die een vriend zoekt.' Zie je het verschil? Het eerste is leeg, het tweede is JOUW vertrekpunt.\n\nRegel 2: GEBRUIK AI VOOR STUKJES, NIET VOOR ALLES. Laat AI niet het hele werk doen. Laat het wel helpen met delen. 'Geef me 5 startzinnen' (jij kiest de beste). 'Geef me ideeën voor hoe het verhaal kan eindigen' (jij besluit). 'Hoe zou je een spannend stuk bouwen?' (jij schrijft het). AI is je gereedschap, geen ghostwriter.\n\nRegel 3: DOE ER IETS VAN JEZELF IN. Dit is de belangrijkste. Voeg iets toe uit jouw leven. Een detail dat alleen jij kent. Een grap die alleen jouw familie snapt. Een plek waar je bent geweest. Hierdoor wordt jouw maakwerk herkenbaar als JOUW maakwerk.\n\nEén voorbeeld om het te voelen.\n\nAI-versie: 'Er was eens een jongen die een draak vond.' Vlak, onpersoonlijk.\n\nJouw versie: 'Het was regenachtig in Rotterdam, net zoals gisteren toen ik met oma naar de markt ging. En daar bij de Lijnbaan stond een kleine draak met blauwe schubben die gromde naar een duif.' Nu is het een verhaal dat alleen JIJ had kunnen beginnen.",
        interactive: tap(
          "Welke versie van deze tekst is meer 'van jou'?",
          [
            { label: "Je schrijft een verhaal over een hond.", reveal: "Beste keuze: \"Mijn hond Max, een overenthousiaste labrador met slingerende oren, ontsnapte gisteren via het kattenluik en veroorzaakte chaos in de speeltuin.\"\n\nJouw versie heeft een eigen hond, een specifieke plek, een specifieke gebeurtenis. Je herkent dat dit een echt persoon geschreven heeft." },
            { label: "Je maakt een gedicht voor je oma.", reveal: "Beste keuze: \"Lieve oma, jij bakt appeltaart die ruikt naar zondag. Jij leerde mij 'Klompendans'. Voor jou is dit.\"\n\nJouw oma bakt appeltaart en leert je een specifiek liedje. Dat is van jou. Niemand anders had dit kunnen schrijven." },
            { label: "Je schrijft een script voor een TikTok-grap.", reveal: "Beste keuze: \"Vandaag in de wiskundeles probeerde meester Peter een grap te maken over algebra. Niemand lachte. Dat werd mijn TikTok.\"\n\nEcht persoon, echte situatie, eigen waarneming. Dat is content die aanspreekt." },
          ],
        ),
        summary: [
          "AI is een gereedschap. Jij bent de maker. Net zoals een potlood en een kunstenaar.",
          "Drie regels: JIJ begint (niet AI), gebruik AI voor STUKJES (niet voor alles), doe er IETS VAN JEZELF in.",
          "Iets wat alleen jij had kunnen maken, is de handtekening van echte creatie.",
        ],
        quiz: [
          {
            question: "Wat is de eerste regel als je iets maakt met AI?",
            options: ["AI bedenkt alles", "JIJ begint met een eigen idee", "Kopieer AI letterlijk", "Laat AI beslissen"],
            correctIndex: 1,
            why: "JIJ begint. AI is gereedschap, niet de hoofdrolspeler.",
          },
          {
            question: "Een verhaal dat AI volledig schreef, is echt jouw verhaal.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Nee. Als JIJ niks hebt toegevoegd, is het niet van jou. Jouw handtekening ontbreekt.",
          },
          {
            question: "Wat maakt iets 'van jou' wanneer je met AI maakt? Tik ze allemaal aan en druk op Klaar.",
            options: ["Een detail uit jouw eigen leven", "Precies AI's woorden overnemen", "Je eigen keuzes in het verhaal", "Een plek die jij kent", "Alles door AI laten doen"],
            correctIndex: 0,
            why: "Eigen detail, eigen keuzes, eigen plek. Dat is jouw handtekening.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.6 ----------
      {
        id: "3.6",
        worldId: 3,
        pillar: "stronger",
        title: "AI bij rekenen: vraag de weg",
        emoji: "🧮",
        sparkIntro: "Hoi! Eerlijke vraag. Als je thuis een moeilijke som hebt, wat doe je? Antwoord vragen aan AI en klaar? Dan heb ik slecht nieuws. Dan word je niet beter in rekenen. Je leert alleen beter... aan AI vragen. Goed nieuws: er is een andere manier. En het werkt echt. Laten we kijken.",
        theoryIntro: "**Het verschil tussen antwoord-krijgen en slim-worden**\n\nRekenen is anders dan veel andere vakken. Rekenen is een SKILL. Je moet het zelf kunnen doen, net zoals fietsen. Je kunt duizend YouTube-filmpjes kijken over fietsen, maar pas als je zelf op de fiets stapt en valt, wordt je het. Zo is het ook met rekenen.\n\nAls je AI vraagt '37 x 24?' en je typt 888 op je blaadje, is dat antwoord fout of goed? Maakt niks uit. Op je toets ben je hulpeloos. Want je hebt nooit geleerd HOE je die som zelf aanpakt.\n\nMaar, en dit is belangrijk. AI IS een fantastische rekenhulp. Als je het goed gebruikt. De truc zit hem in de vraag. Niet antwoord-vragen, maar weg-vragen.",
        fact: "Leraren hebben iets genoemd de 'help-paradox'. Hoe meer hulp je krijgt op school met rekenen, hoe SLECHTER je wordt. Want je hersenen wennen aan iemand die het overneemt. Dus goed hulp-vragen betekent: alleen hulp vragen die je zelf nog steeds laat rekenen. Dat is wat we vandaag leren.",
        sparkMiddle: "Dit is niet ingewikkeld, maar wel belangrijk. Drie manieren om AI te gebruiken bij rekenen zonder dat je lui wordt.",
        theoryDeep: "**De drie rekenhulp-vragen**\n\nVraag 1: 'LEG STAP VOOR STAP UIT.' Niet 'wat is het antwoord van 84 : 12', maar 'leg stap voor stap uit hoe ik 84 : 12 zelf kan uitrekenen.' AI geeft je een werkmethode. Jij doet de som zelf. Volgende keer kun je het zonder AI.\n\nVraag 2: 'WAAR ZIT MIJN FOUT?' Je hebt zelf gerekend, je krijgt een fout antwoord. Vraag: 'Ik reken 6 x 27 uit en kom op 142. Waar zit mijn fout?' AI wijst precies aan waar het mis ging. Dát is waar je van leert. Fouten snappen is hoe je vooruit gaat.\n\nVraag 3: 'GEEF ME EEN OEFENSOM VAN HETZELFDE TYPE.' Je hebt net een moeilijke som snapt. Vraag meteen: 'geef me 3 sommen van hetzelfde type zodat ik kan oefenen.' AI maakt nieuwe sommen. Jij oefent. Nu heb je het echt in je vingers.\n\nKlein trucje, wel belangrijk: gebruik AI NIET voor simpele tafeltjes, optellen of kleine sommen. Die moet je in je hoofd kunnen. AI is voor als je ECHT vastzit. Niet voor als je lui bent.\n\nEn één ding om te weten: AI maakt soms rekenfouten. Raar maar waar. Bij belangrijke sommen altijd even met je rekenmachine of je ouder controleren.",
        interactive: tap(
          "Welke rekenvraag aan AI maakt je sterker in rekenen?",
          [
            { label: "Je moet 48 x 15 uitrekenen.", reveal: "Beste keuze: \"Leg stap voor stap uit hoe ik 48 x 15 zelf kan uitrekenen.\"\n\nStap voor stap uitleg = jij leert rekenen. Antwoord krijgen = jij wordt er niet wijzer van." },
            { label: "Je hebt 156 + 47 uitgerekend en kwam op 193. Je hoort dat 203 correct is.", reveal: "Beste keuze: \"Ik reken 156 + 47 en kom op 193. Waar zit mijn fout?\"\n\n'Waar zit mijn fout' is goud. Je leert van je fout. Dat vergeet je niet meer." },
            { label: "Je snapt nu breuken optellen met verschillende noemers.", reveal: "Beste keuze: \"Geef me 5 oefensommen van hetzelfde type met breuken optellen met verschillende noemers.\"\n\nPerfect. Herhaling is waar rekenvaardigheid zit. Specifiek vragen om het type dat je net snapt." },
          ],
        ),
        summary: [
          "Rekenen is een skill, net als fietsen. Je moet het ZELF kunnen doen.",
          "Drie goede vragen aan AI: 'leg stap voor stap uit', 'waar zit mijn fout', 'geef me oefensommen van dit type'.",
          "Vraag AI niet simpele sommen of tafeltjes. Die moet je in je hoofd kunnen. Check AI's rekenwerk altijd bij belangrijke sommen.",
        ],
        quiz: [
          {
            question: "Welke vraag maakt je sterker in rekenen?",
            options: ["Wat is het antwoord?", "Leg stap voor stap uit hoe ik dit zelf kan oplossen.", "Doe het voor me.", "Geef alleen antwoord."],
            correctIndex: 1,
            why: "Stap voor stap. Daardoor leer je de WEG, niet alleen de uitkomst.",
          },
          {
            question: "AI maakt nooit rekenfouten.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Niet waar. AI maakt soms rekenfouten. Check bij belangrijke sommen altijd.",
          },
          {
            question: "Wanneer is AI bij rekenen HANDIG? Tik ze allemaal aan en druk op Klaar.",
            options: ["Als je echt vastzit", "Voor elke simpele som", "Om je fout te begrijpen", "Om oefensommen te krijgen", "Om tafeltjes te vragen"],
            correctIndex: 0,
            why: "Vastzitten, fout snappen, oefening. Simpele sommen en tafels moet je in je hoofd kunnen.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.7 ----------
      {
        id: "3.7",
        worldId: 3,
        pillar: "stronger",
        title: "De 10x slimmer-formule",
        emoji: "⚡",
        sparkIntro: "Hoi! We zijn bijna bij het eind van ons samen-zijn. Nog twee lessen. Vandaag de ene die alles bij elkaar brengt. Ik noem het de 10x slimmer-formule. Want als je dit doorhebt, zit er een verschil van tien keer tussen hoe jij AI gebruikt en hoe de meeste kinderen (en volwassenen!) dat doen. Let even mee.",
        theoryIntro: "**Drie dingen samen**\n\nDe meeste mensen gebruiken AI op één manier. Vraag stellen, antwoord krijgen, klaar. Zo gebruikt 90% het. En dat is oké. Maar het is niet de beste manier.\n\nDe 10x slimmer-formule is een combinatie. Drie dingen samen.\n\nEen: JIJ DENKT eerst. Wat wil ik precies? Waar wil ik heen? Wat weet ik al?\n\nTwee: AI HELPT. Niet om het werk over te nemen, maar om te versterken wat je al doet. Ideeën, uitleg, fouten-check, voorbeelden.\n\nDrie: JIJ CONTROLEERT. AI kan gokken (wereld 2, weet je nog?). Dus check altijd wat je terugkrijgt. Klopt het? Logisch? Past het bij wat ik weet?\n\nDenken + AI + controle. Samen zijn ze veel sterker dan elk apart. Dit is de formule.",
        fact: "Er is een bekend onderzoek waar ze twee groepen leerlingen hadden. Groep 1 deed huiswerk alleen. Groep 2 deed huiswerk met AI erbij, maar ZONDER zelf eerst na te denken. Groep 3 dacht eerst zelf, gebruikte toen AI, en controleerde daarna. Groep 3 scoorde ver boven de rest. Niet groep 2 met de 'beste AI'. Groep 3 met de slimste aanpak.",
        sparkMiddle: "Oké, hoe zet je die formule om in iets praktisch dat je morgen al gebruikt? Ik heb een simpel plannetje voor je.",
        theoryDeep: "**Het 3-minuten-plan voor elke taak**\n\nVoor elke huiswerktaak of project waar je AI bij wilt gebruiken, drie minuten vooraf. Serieus, drie minuten.\n\nMinuut 1: DENKEN VOORAF. Wat moet ik maken? Wat weet ik er al van? Wat is het moeilijkste stukje? Welke hulp heb ik nodig?\n\nMinuut 2: AI GEBRUIKEN. Nu stel je je vraag. Maar niet een vage. Je stelt de VRAAG die voortkomt uit wat je minuut 1 hebt bedacht. 'Ik weet dat een werkstuk een inleiding, kern en conclusie heeft. Maar ik zit vast bij de conclusie. Geef me 3 tips.'\n\nMinuut 3: CONTROLEREN. AI geeft je iets terug. Check: klopt het? Past het bij wat ik wil? Helpt het me? Zo nee, vraag door. Zo ja, ga zelf aan het werk.\n\nVoelt dit als een hoop gedoe? Drie minuten is niks. Maar het scheelt je een uur aan prutsen met antwoorden die je niet kunt gebruiken. Je bouwt ook een vaardigheid op die je de rest van je leven gebruikt. Snel denken, slim vragen, kritisch ontvangen. Mensen die dit kunnen, gaan ver in het leven. Serieus. En jij leert het nu al.",
        interactive: mc(
          "Orden de stappen van de 10x slimmer-formule in de juiste volgorde.",
          [
            { label: "Denk zelf eerst na over wat je wilt en weet. → AI helpt je met ideeën of uitleg. → Controleer wat AI teruggeeft, klopt het? → Ga zelf aan de slag met wat je geleerd hebt.", correct: true },
            { label: "Ga zelf aan de slag met wat je geleerd hebt. → Controleer wat AI teruggeeft, klopt het? → AI helpt je met ideeën of uitleg. → Denk zelf eerst na over wat je wilt en weet.", correct: false },
            { label: "AI helpt je met ideeën of uitleg. → Denk zelf eerst na over wat je wilt en weet. → Controleer wat AI teruggeeft, klopt het? → Ga zelf aan de slag met wat je geleerd hebt.", correct: false },
          ],
          "Eerst denken, dan AI, dan controleren, dan zelf doen. In die volgorde word je 10x slimmer.",
        ),
        summary: [
          "De 10x slimmer-formule: JIJ denkt + AI helpt + JIJ controleert.",
          "Het 3-minuten-plan: 1 minuut denken vooraf, 1 minuut AI slim gebruiken, 1 minuut controleren wat je terug krijgt.",
          "Mensen die deze formule beheersen gaan ver. En jij leert hem nu al.",
        ],
        quiz: [
          {
            question: "Wat is de eerste stap van de 10x slimmer-formule?",
            options: ["AI om alles vragen", "Zelf denken voor je iets aan AI vraagt", "Antwoord kopiëren", "Beginnen met typen"],
            correctIndex: 1,
            why: "Zelf denken eerst. Zonder dat is AI slechts een doos met losse antwoorden.",
          },
          {
            question: "De meeste mensen gebruiken AI zonder te controleren wat er terugkomt.",
            options: ["Waar", "Niet waar"],
            correctIndex: 0,
            why: "Helaas wel. En daarom trappen ze vaak in hallucinaties en fouten. Jij niet.",
          },
          {
            question: "De drie onderdelen van de 10x slimmer-formule? Tik ze allemaal aan en druk op Klaar.",
            options: ["Zelf eerst denken", "Kopiëren zonder denken", "AI helpt versterken", "Zelf controleren", "AI beslissen wat goed is"],
            correctIndex: 0,
            why: "Denken + AI + controleren. Drie samen. Daar zit de kracht.",
          },
        ],
        reflection: "",
      },
      // ---------- Les 3.8 ----------
      {
        id: "3.8",
        worldId: 3,
        pillar: "stronger",
        title: "Eindbaas-test & het diploma",
        emoji: "🏆",
        bossTest: true,
        sparkIntro: "Hoi! Dit is het. De laatste les. 23 lessen gehad samen. 23. Dat is echt veel. Vandaag vier ik met je wat je hebt bereikt, en dan ga je de eindbaas-test doen. 24 vragen. Eén uit elke les. Geen valstrikken, geen nieuwe stof. Alleen wat je al geleerd hebt. Ik ben trots op je. Echt. Laten we dit doen.",
        theoryIntro: "**Je reis door drie werelden**\n\nDenk even terug. Toen je begon bij les 1.1, wist je waarschijnlijk niet precies wat AI was. Nu? Jij weet meer dan veel volwassenen. En ik overdrijf niet.\n\nWereld 1 (VEILIG) gaf je het Schild van Waakzaamheid. Je leerde wat AI is, hoe je je geheimen beschermt, hoe je nep spot, en wanneer je een volwassene haalt.\n\nWereld 2 (SLIM) gaf je het Kompas van Wijsheid. Je leerde dat AI gokt en hallucineert, hoe je slim vragen stelt met WIE-WAT-HOE, hoe je dubbelcheckt en welke krachtwoorden werken.\n\nWereld 3 (STERKER) gaat je de Kroon van Meesterschap opleveren, na vandaag. Je leerde hoe je AI gebruikt als tutor en oefen-maatje zonder zelf stop te denken, hoe je iets eigens maakt, en hoe de 10x slimmer-formule werkt.\n\nDat is een boel. Ik hoop dat je stilstaat bij hoe ver je bent gekomen.",
        fact: "Er zijn in Nederland miljoenen mensen die AI gebruiken. Maar minder dan 5% heeft echt geleerd hoe je het goed doet. Jij bent nu in die 5%. Op je tiende. Dat is niet niks. Vergeet het niet, ook al weet niemand in de klas dat je deze cursus hebt gedaan.",
        sparkMiddle: "Oké. Genoeg gefeliciteerd, dat komt straks. Nu eerst even terug naar de stof. Twee lessen uit wereld 3 die we nog niet hebben herhaald. Dan gaan we naar de test.",
        theoryDeep: "**Laatste terugblik wereld 3**\n\nLes 3.6: AI bij rekenen. Rekenen is een skill, je moet het zelf kunnen. Vraag niet naar antwoorden, vraag naar de WEG. 'Stap voor stap uitleg', 'waar zit mijn fout', 'geef me een oefensom van dit type.' Die drie.\n\nLes 3.7: De 10x slimmer-formule. JIJ denkt + AI helpt + JIJ controleert. Het 3-minuten-plan: denk vooraf, gebruik AI slim, controleer. Mensen die dit doen, gaan ver.\n\nEn dat is hij. Alles wat we samen hebben gedaan. Nu jij. Succes, al heb je het niet nodig.",
        interactive: tap(
          "De grote eindbaas-test. 24 vragen, één uit elke les. Slaag je, dan is het officiële AI met Spark-diploma van jou. Tijd: ongeveer 4 minuten. Ademhalen. Denken. Rustig aan.",
          [
            { label: "AI is vooral:", reveal: "Antwoord: Een patroon-herkenner die voorspelt  (Les 1.1)" },
            { label: "Welke test helpt je beslissen of je iets aan AI mag typen?", reveal: "Antwoord: Wachtkamer-test  (Les 1.2)" },
            { label: "Eerste AI-plaatje check:", reveal: "Antwoord: Handen en vingers  (Les 1.3)" },
            { label: "Schokkende video van bekende persoon. Eerste stap:", reveal: "Antwoord: Check echte nieuwssite  (Les 1.4)" },
            { label: "Drie signalen nep-bericht:", reveal: "Antwoord: Haast-emotie-vraag om info/geld/klik  (Les 1.5)" },
            { label: "STOP staat voor:", reveal: "Antwoord: Straat-Telefoon-Ouder-Pasjes  (Les 1.6)" },
            { label: "Wanneer volwassene halen?", reveal: "Antwoord: Bij enge antwoorden, betaling, rare pop-ups, of als iets raar voelt  (Les 1.7)" },
            { label: "AI gebruik:", reveal: "Antwoord: Voorspelt woord voor woord op basis van voorbeelden  (Les 2.1)" },
            { label: "AI-hallucinatie is:", reveal: "Antwoord: AI verzint dingen en brengt ze als feit  (Les 2.2)" },
            { label: "Formule voor goede vraag:", reveal: "Antwoord: WIE-WAT-HOE  (Les 2.3)" },
            { label: "Eerste dubbelcheck-stap:", reveal: "Antwoord: Check de logica  (Les 2.4)" },
            { label: "Welk krachtwoord:", reveal: "Antwoord: Stap voor stap  (Les 2.5)" },
            { label: "AI blijft herhalen, wat doe je?", reveal: "Antwoord: Reset: nieuwe chat  (Les 2.6)" },
            { label: "AI-soorten:", reveal: "Antwoord: Verschillende AI's zijn goed in verschillende dingen  (Les 2.7)" },
            { label: "Tutor-vraag is:", reveal: "Antwoord: Leg uit hoe ik een opstel opbouw  (Les 3.1)" },
            { label: "Eerste brainstorm-stap:", reveal: "Antwoord: Vraag 10-20 ideeën  (Les 3.2)" },
            { label: "Toverzin voor simpele uitleg:", reveal: "Antwoord: Leg uit alsof ik 10 ben  (Les 3.3)" },
            { label: "Wat werkt beter om stof te leren?", reveal: "Antwoord: Jezelf overhoren  (Les 3.4)" },
            { label: "Maken met AI, eerste regel:", reveal: "Antwoord: JIJ begint met eigen idee  (Les 3.5)" },
            { label: "Welke vraag maakt sterker in rekenen?", reveal: "Antwoord: Leg stap voor stap uit hoe ik dit zelf oplos  (Les 3.6)" },
            { label: "Eerste stap 10x slimmer-formule:", reveal: "Antwoord: Zelf denken vooraf  (Les 3.7)" },
            { label: "AI klinkt altijd zelfverzekerd, ook als het gokt.", reveal: "Antwoord: Waar  (Les 2.1)" },
            { label: "Een bericht in perfect Nederlands kan nooit nep zijn.", reveal: "Antwoord: Niet waar  (Les 1.5)" },
            { label: "Als je AI gebruikt voor huiswerk, word je vanzelf slimmer.", reveal: "Antwoord: Niet waar  (Les 3.1)" },
          ],
        ),
        summary: [
          "Je hebt de eindtoets gemaakt. Drie werelden doorlopen. 24 lessen geleerd. Dat is écht wat.",
          "Je bent nu AI met Spark-gecertificeerd. Het diploma is van jou. Het Schild, het Kompas, en de Kroon ook.",
          "Vergeet dit niet: de meeste mensen om je heen weten veel minder over AI dan jij nu. Gebruik wat je weet. Help er anderen mee.",
        ],
        quiz: [
          {
            question: "Wat is het belangrijkste verschil tussen sluiproute en tutor bij AI?",
            options: ["Sluiproute duurt langer", "Tutor maakt jou slimmer, sluiproute niet", "Sluiproute is moeilijker", "Er is geen verschil"],
            correctIndex: 1,
            why: "Tutor = jij leert. Sluiproute = AI doet, jij niet. Gouden onderscheid.",
          },
          {
            question: "Wat heb je nu allemaal in je hoofd zitten? Tik wat allemaal klopt en druk op Klaar.",
            options: ["Hoe AI werkt (gokken, patronen)", "Hoe je slim vraagt met WIE-WAT-HOE", "De wachtkamer-test", "Alles over draken", "De 10x slimmer-formule"],
            correctIndex: 0,
            why: "Alles behalve de draken. Draken zijn cool maar geen onderdeel van AI met Spark.",
          },
          {
            question: "Ik weet nu meer over AI dan de meeste mensen om me heen.",
            options: ["Waar", "Niet waar"],
            correctIndex: 0,
            why: "Klopt. Serieus. Je zit in de bovenste 5% van Nederland. Op je tiende. Gebruik het.",
          },
        ],
        reflection: "",
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
