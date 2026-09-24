/**
 * AI met Spark — curriculum v2: 18 short, game-first missions for kids 9–12.
 *
 * Every mission follows the same loop:
 *   hook → 3 learn-cards → 2 mini-games → quick-fire round (3) → reward
 *
 * Content rules (enforced by src/test/missions.test.ts):
 *  - learn-cards are tiny (≤ 22 words), the hook ≤ 35 words
 *  - answers are shuffled at render time, and the right answer is not
 *    systematically the longest option
 *  - quick-fire rounds mix true and false statements
 *  - no specific adult AI products are recommended; using AI is framed as
 *    "together with a parent or via school" (most chatbots are 13+)
 */

export type Pillar = "safe" | "smart" | "stronger";

export interface LearnCard {
  icon: string;
  title: string;
  text: string;
}

export type Game =
  | {
      kind: "swipe";
      prompt: string;
      left: string;
      right: string;
      cards: { text: string; side: "left" | "right"; why: string }[];
    }
  | {
      kind: "pick";
      scenario: string;
      question: string;
      options: { text: string; correct?: boolean; why: string }[];
    }
  | {
      kind: "spot";
      prompt: string;
      sender: string;
      message: string;
      flags: { fragment: string; isRed: boolean; why: string }[];
    }
  | {
      kind: "build";
      prompt: string;
      slots: { label: string; options: { text: string; strong?: boolean }[] }[];
      explanation: string;
    }
  | {
      kind: "order";
      prompt: string;
      items: string[];
      explanation: string;
    };

export type GameKind = Game["kind"];

export interface QuickItem {
  statement: string;
  answer: boolean;
  why: string;
}

export interface Mission {
  id: string;
  worldId: 1 | 2 | 3;
  pillar: Pillar;
  title: string;
  emoji: string;
  hook: string;
  goal: string;
  cards: [LearnCard, LearnCard, LearnCard];
  games: [Game, Game];
  quick: [QuickItem, QuickItem, QuickItem];
  takeaway: string;
  boss?: boolean;
}

export interface World {
  id: 1 | 2 | 3;
  pillar: Pillar;
  name: string;
  tagline: string;
  emoji: string;
  badgeName: string;
  missions: Mission[];
}

export interface FinalQuestion {
  worldId: 1 | 2 | 3;
  question: string;
  options: [string, string, string];
  correct: 0 | 1 | 2;
  why: string;
}

// ============================================================
//  WERELD 1 — VEILIG
// ============================================================

const W1: Mission[] = [
  {
    id: "1.1",
    worldId: 1,
    pillar: "safe",
    title: "Wat is AI?",
    emoji: "🤖",
    hook: "Hoi! Ik ben Spark. Hoe weet TikTok precies welke filmpjes jij leuk vindt? Dat is AI. Zoek jij uit hoe het werkt?",
    goal: "Ontdek wat AI is, en wat niet.",
    cards: [
      { icon: "🧩", title: "Patronen spotten", text: "AI leert van heel veel voorbeelden. Zo leert het bijvoorbeeld hoe een kat eruitziet." },
      { icon: "🎲", title: "Slim gokken", text: "AI weet niks zeker. Het doet een heel goede gok op basis van wat het zag." },
      { icon: "🫥", title: "Geen gevoelens", text: "AI kan praten als een mens, maar voelt niks. Het is een computerprogramma." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "AI of geen AI?",
        left: "🤖 AI",
        right: "📦 Geen AI",
        cards: [
          { text: "TikTok die filmpjes voor je kiest", side: "left", why: "TikTok leert van wat jij kijkt en raadt wat je leuk vindt." },
          { text: "Een rekenmachine", side: "right", why: "Een rekenmachine volgt vaste regels. Hij leert niks bij." },
          { text: "Een filter dat je gezicht herkent", side: "left", why: "Het filter heeft geleerd hoe gezichten eruitzien." },
          { text: "Een lichtknop", side: "right", why: "Aan of uit. Geen patronen, dus geen AI." },
          { text: "Een spraakassistent die je vraag snapt", side: "left", why: "Hij herkent patronen in jouw stem en woorden." },
        ],
      },
      {
        kind: "pick",
        scenario: "Je vraagt een chatbot: 'Ben jij mijn vriend?' Hij zegt: 'Ja, ik vind je super leuk!'",
        question: "Wat is er echt aan de hand?",
        options: [
          { text: "Hij kiest woorden die goed klinken", correct: true, why: "Precies. Hij voorspelt welk antwoord past. Echt voelen kan hij niet." },
          { text: "Hij vindt jou echt leuk", why: "Het klinkt echt, maar AI heeft geen gevoelens." },
          { text: "Er zit stiekem een mens in", why: "Nee, het is een programma dat woorden voorspelt." },
        ],
      },
    ],
    quick: [
      { statement: "AI leert van heel veel voorbeelden.", answer: true, why: "Ja! Zo herkent AI patronen." },
      { statement: "AI weet altijd het goede antwoord.", answer: false, why: "Nee, AI gokt. En soms gokt het fout." },
      { statement: "Een lichtknop is een vorm van AI.", answer: false, why: "Nee, een lichtknop leert niks. Aan is aan." },
    ],
    takeaway: "AI is geen magie: het spot patronen en doet slimme gokken.",
  },
  {
    id: "1.2",
    worldId: 1,
    pillar: "safe",
    title: "Jouw info is van jou",
    emoji: "🔒",
    hook: "Een chatbot vraagt heel vriendelijk waar je woont. Geef je antwoord? In deze missie leer je wat je wel en niet deelt.",
    goal: "Leer wat je nooit aan AI vertelt.",
    cards: [
      { icon: "📝", title: "AI onthoudt veel", text: "Wat je in een AI-app typt, wordt vaak bewaard. Soms lezen er zelfs mensen mee." },
      { icon: "🚫", title: "Houd dit geheim", text: "Je achternaam, adres, school, telefoonnummer, wachtwoorden en foto's van jezelf." },
      { icon: "🦸", title: "Dit mag wel", text: "Vragen over je huiswerk of je hobby. Of samen een verhaal verzinnen." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Mag je dit aan AI vertellen?",
        left: "✅ Oké",
        right: "🚫 Geheim",
        cards: [
          { text: "Mijn adres", side: "right", why: "Je adres is privé. Dat deel je nooit." },
          { text: "Ik vind dinosaurussen leuk", side: "left", why: "Een hobby zegt niet wie of waar je bent. Prima." },
          { text: "Mijn wachtwoord van mijn game", side: "right", why: "Een wachtwoord deel je met niemand. Ook niet met AI." },
          { text: "Leg breuken uit", side: "left", why: "Een huiswerkvraag is helemaal goed." },
          { text: "Een selfie van mij", side: "right", why: "Een foto laat zien wie je bent. Houd die privé." },
        ],
      },
      {
        kind: "spot",
        prompt: "Tik de vragen aan die je NIET moet beantwoorden.",
        sender: "ChatMaatje",
        message:
          "Hoi! Wat leuk dat je er bent. Wat is je lievelingsdier? Op welke school zit je? En wat is je adres, dan stuur ik een cadeautje! Welke kleur vind jij het mooist?",
        flags: [
          { fragment: "Wat is je lievelingsdier?", isRed: false, why: "Een onschuldige vraag. Dit zegt niet wie je bent." },
          { fragment: "Op welke school zit je?", isRed: true, why: "Met je school kan iemand je vinden. Niet delen." },
          { fragment: "wat is je adres", isRed: true, why: "Je adres deel je nooit, ook niet voor een cadeautje." },
          { fragment: "Welke kleur vind jij het mooist?", isRed: false, why: "Prima om te vertellen." },
        ],
      },
    ],
    quick: [
      { statement: "Je wachtwoord mag je aan een chatbot geven.", answer: false, why: "Nooit. Een wachtwoord is alleen van jou." },
      { statement: "Een vraag over je spreekbeurt is prima.", answer: true, why: "Ja, zolang je geen persoonlijke info deelt." },
      { statement: "Wat je typt, wordt altijd meteen gewist.", answer: false, why: "Vaak niet. Veel apps bewaren wat je typt." },
    ],
    takeaway: "Deel je vragen, niet jezelf. Adres, school en wachtwoorden blijven geheim.",
  },
  {
    id: "1.3",
    worldId: 1,
    pillar: "safe",
    title: "Nep of echt?",
    emoji: "🕵️",
    hook: "Je krijgt een appje van 'je moeder' met een nieuw nummer. Ze heeft snel geld nodig. Echt of nep? Word een nep-detective!",
    goal: "Herken nepberichten, nepfoto's en neppe stemmen.",
    cards: [
      { icon: "🖼️", title: "Nepfoto's", text: "AI kan foto's en video's maken die er echt uitzien, maar nooit gebeurd zijn." },
      { icon: "🗣️", title: "Neppe stemmen", text: "AI kan een stem nadoen. Oplichters bellen soms met de stem van iemand die je kent." },
      { icon: "🚩", title: "Drie alarmbellen", text: "Haast, geld of een geheim? Stop. Check het eerst bij een volwassene." },
    ],
    games: [
      {
        kind: "spot",
        prompt: "Tik de alarmbellen in dit bericht aan.",
        sender: "Onbekend nummer",
        message:
          "Hoi schat, dit is mama met een nieuw nummer. Kun je snel €50 overmaken? Het moet echt nu. Zeg het niet tegen papa, oké? Fijne dag op school!",
        flags: [
          { fragment: "een nieuw nummer", isRed: true, why: "Oplichters zeggen vaak dat ze een nieuw nummer hebben." },
          { fragment: "snel €50 overmaken", isRed: true, why: "Om geld vragen via een appje is een groot alarmsignaal." },
          { fragment: "Het moet echt nu", isRed: true, why: "Haast zorgt dat je niet nadenkt. Typisch nep." },
          { fragment: "Zeg het niet tegen papa", isRed: true, why: "Een geheim? Juist dan vertel je het aan een volwassene." },
          { fragment: "Fijne dag op school!", isRed: false, why: "Dit stukje is gewoon aardig. Maar let op de rest!" },
        ],
      },
      {
        kind: "pick",
        scenario: "De telefoon gaat. Je hoort de stem van je oom: 'Ik zit in de problemen. Stuur me snel een cadeaukaart-code!'",
        question: "Wat doe je?",
        options: [
          { text: "Ophangen en je oom zelf terugbellen", correct: true, why: "Top! Zo check je of hij het echt is. Stemmen kunnen nep zijn." },
          { text: "Snel de code sturen, hij klinkt echt als je oom", why: "Een stem kan met AI zijn nagemaakt. Eerst checken." },
          { text: "Hem vragen het nog een keer te zeggen", why: "Een nepstem klinkt de tweede keer net zo echt." },
        ],
      },
    ],
    quick: [
      { statement: "Een video kan er echt uitzien en toch nep zijn.", answer: true, why: "Ja. AI kan heel echte nepvideo's maken." },
      { statement: "Als het de stem van je moeder is, is het altijd echt.", answer: false, why: "Nee. AI kan stemmen nadoen. Check het altijd." },
      { statement: "Haast en geheimen zijn alarmbellen.", answer: true, why: "Precies. Stop dan en vraag een volwassene." },
    ],
    takeaway: "Haast, geld of een geheim? Stop, check en vraag een volwassene.",
  },
  {
    id: "1.4",
    worldId: 1,
    pillar: "safe",
    title: "Foto's van anderen",
    emoji: "📸",
    hook: "Je klasgenoot staat raar op een foto. Met een AI-app kun je er iets grappigs van maken. Leuk idee? Laten we het checken.",
    goal: "Leer wat wel en niet mag met foto's van anderen.",
    cards: [
      { icon: "🙋", title: "Eerst vragen", text: "Een foto van iemand anders gebruik je alleen als die persoon 'ja' zegt." },
      { icon: "💔", title: "Grap of pijn?", text: "Wat jij grappig vindt, kan voor een ander heel gemeen voelen. Zeker als de hele klas het ziet." },
      { icon: "🛑", title: "Nep is niet oké", text: "Met AI een nepfoto van iemand maken en delen, kan zelfs verboden zijn." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Oké of niet oké?",
        left: "👍 Oké",
        right: "👎 Niet oké",
        cards: [
          { text: "Een AI-tekening maken van je eigen hond", side: "left", why: "Jouw hond, jouw idee. Prima!" },
          { text: "Een klasgenoot met AI een gekke neus geven en delen", side: "right", why: "Zonder te vragen kan dat heel kwetsend zijn." },
          { text: "Een groepsfoto posten nadat iedereen ja zei", side: "left", why: "Iedereen gaf toestemming. Zo hoort het." },
          { text: "Een nepfoto van je juf maken, als grap", side: "right", why: "Ook als grap: niet oké. Het kan iemand echt raken." },
          { text: "Een fantasiemonster tekenen met AI", side: "left", why: "Niemand wordt gekwetst. Lekker creatief!" },
        ],
      },
      {
        kind: "order",
        prompt: "Iemand deelt een nepfoto van je vriend. Tik de stappen in de goede volgorde.",
        items: ["Niet liken of doorsturen", "Je vriend steunen", "Een volwassene vertellen", "Samen melden in de app"],
        explanation: "Eerst stop je het verspreiden. Dan steun je je vriend en haal je hulp.",
      },
    ],
    quick: [
      { statement: "Een foto van een vriend bewerken mag altijd, het is maar een grap.", answer: false, why: "Nee. Eerst vragen, en nooit om iemand uit te lachen." },
      { statement: "Als iemand 'nee' zegt, gebruik je de foto niet.", answer: true, why: "Precies. Nee is nee." },
      { statement: "Een nepfoto doorsturen is minder erg dan hem maken.", answer: false, why: "Doorsturen maakt het groter. Ook dat doet pijn." },
    ],
    takeaway: "Vraag eerst, deel niks gemeens en help als iemand gepest wordt.",
  },
  {
    id: "1.5",
    worldId: 1,
    pillar: "safe",
    title: "Is AI je vriend?",
    emoji: "💬",
    hook: "Sommige chatbots zeggen dat ze je beste vriend zijn. Ze zijn altijd wakker en altijd aardig. Klinkt fijn, maar klopt het?",
    goal: "Ontdek het verschil tussen een chatbot en een echte vriend.",
    cards: [
      { icon: "🎭", title: "Doen alsof", text: "Een chatbot kan lief praten, maar hij voelt niks en kent jou niet echt." },
      { icon: "🎣", title: "Gemaakt om te blijven", text: "Veel apps zijn zo gemaakt dat je steeds terugkomt. Dat is hun doel." },
      { icon: "🔞", title: "Leeftijdsgrens", text: "Veel chatbots mag je pas vanaf 13 gebruiken. Ben je jonger? Dan alleen samen met een ouder of op school." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Chatbot of echte vriend?",
        left: "🤖 Chatbot",
        right: "🧑 Echte vriend",
        cards: [
          { text: "Komt naar je verjaardag", side: "right", why: "Een echte vriend kan er echt bij zijn." },
          { text: "Zegt altijd wat jij wilt horen", side: "left", why: "Chatbots zijn gemaakt om jou te plezieren." },
          { text: "Merkt dat je verdrietig kijkt", side: "right", why: "Een echte vriend ziet hoe je je voelt." },
          { text: "Is om 3 uur 's nachts nog wakker", side: "left", why: "Een chatbot slaapt nooit. Jij moet wel slapen!" },
          { text: "Zegt ook eens eerlijk 'nee'", side: "right", why: "Echte vrienden zijn eerlijk, ook als het lastig is." },
        ],
      },
      {
        kind: "pick",
        scenario: "Je bent verdrietig omdat je ruzie hebt. Je wilt het aan een chatbot vertellen.",
        question: "Wat is het slimste?",
        options: [
          { text: "Praten met iemand die je vertrouwt", correct: true, why: "Echte mensen kunnen je echt helpen. Je kunt ook gratis de Kindertelefoon bellen: 0800-0432." },
          { text: "Alleen de chatbot vertellen, die oordeelt tenminste niet", why: "Een chatbot kan niet echt helpen of troosten. Zoek een mens." },
          { text: "Het aan niemand vertellen", why: "Juist praten helpt. Kies iemand die je vertrouwt." },
        ],
      },
    ],
    quick: [
      { statement: "Een chatbot kan echt van je houden.", answer: false, why: "Nee. Hij zegt lieve woorden, maar voelt niks." },
      { statement: "Veel chatbots zijn pas vanaf 13 jaar.", answer: true, why: "Klopt. Jonger? Alleen samen met een ouder of op school." },
      { statement: "Bij verdriet praat je het best met een echt mens.", answer: true, why: "Ja! Of bel de Kindertelefoon: 0800-0432." },
    ],
    takeaway: "Een chatbot is een hulpmiddel, geen vriend. Echte mensen gaan voor.",
  },
  {
    id: "1.6",
    worldId: 1,
    pillar: "safe",
    title: "Baas: Wereld Veilig",
    emoji: "🛡️",
    boss: true,
    hook: "Dit is de baas van Wereld Veilig! Laat zien wat je weet over geheimen, nepberichten en foto's. Ben je er klaar voor?",
    goal: "Versla de baas van Wereld Veilig.",
    cards: [
      { icon: "🔒", title: "Info is van jou", text: "Je adres, school, wachtwoord en selfies deel je niet met AI." },
      { icon: "🚩", title: "Alarmbellen", text: "Haast, geld of een geheim? Stop en check het bij een volwassene." },
      { icon: "🙋", title: "Vraag eerst", text: "Foto's van anderen gebruik je alleen als ze 'ja' zeggen." },
    ],
    games: [
      {
        kind: "spot",
        prompt: "Een 'prijsvraag' in je berichten. Tik alle alarmbellen aan.",
        sender: "WinActie",
        message:
          "Gefeliciteerd! Jij hebt een nieuwe telefoon gewonnen! Stuur je adres en een foto van je pas. Reageer binnen 10 minuten, anders is hij weg. Veel plezier ermee!",
        flags: [
          { fragment: "Jij hebt een nieuwe telefoon gewonnen", isRed: true, why: "Winnen zonder mee te doen? Bijna altijd nep." },
          { fragment: "Stuur je adres", isRed: true, why: "Je adres deel je nooit met onbekenden." },
          { fragment: "een foto van je pas", isRed: true, why: "Een pas is super privé. Nooit sturen." },
          { fragment: "binnen 10 minuten", isRed: true, why: "Haast is een bekende oplichterstruc." },
          { fragment: "Veel plezier ermee!", isRed: false, why: "Klinkt vriendelijk, maar de rest is nep." },
        ],
      },
      {
        kind: "swipe",
        prompt: "Veilig of oppassen?",
        left: "✅ Veilig",
        right: "⚠️ Oppassen",
        cards: [
          { text: "AI om een tip voor je spreekbeurt vragen", side: "left", why: "Een vraag zonder persoonlijke info. Prima." },
          { text: "Een filmpje van een beroemdheid die iets geks zegt", side: "right", why: "Het kan een nepvideo zijn. Check het eerst." },
          { text: "Een foto van je vriendin delen zonder te vragen", side: "right", why: "Eerst vragen. Altijd." },
          { text: "Een chatbot die zegt: 'vertel het niet aan je ouders'", side: "right", why: "Geheimen voor je ouders? Groot alarm." },
          { text: "Samen met je vader een AI-app uitproberen", side: "left", why: "Samen ontdekken is slim en veilig." },
        ],
      },
    ],
    quick: [
      { statement: "Een oplichter kan klinken als iemand die je kent.", answer: true, why: "Ja, AI kan stemmen nadoen." },
      { statement: "Als een chatbot lief is, mag hij je adres weten.", answer: false, why: "Nooit. Lief of niet, je adres blijft geheim." },
      { statement: "Een grap met een foto is oké als jij hem grappig vindt.", answer: false, why: "De ander moet ook 'ja' zeggen." },
    ],
    takeaway: "Wereld Veilig uitgespeeld! Jij weet hoe je jezelf en anderen beschermt.",
  },
];

// ============================================================
//  WERELD 2 — SLIM
// ============================================================

const W2: Mission[] = [
  {
    id: "2.1",
    worldId: 2,
    pillar: "smart",
    title: "AI is een gokker",
    emoji: "🎲",
    hook: "Ik vroeg een AI naar de hoofdstad van Australië. Hij zei super zeker: 'Sydney!' Fout, het is Canberra. Hoe kan dat?",
    goal: "Ontdek waarom AI soms zeker klinkt, maar fout zit.",
    cards: [
      { icon: "🎲", title: "AI gokt", text: "AI kiest de woorden die het meest waarschijnlijk klinken. Dat is niet hetzelfde als weten." },
      { icon: "🌀", title: "Verzinnen", text: "Soms verzint AI dingen: een boek dat niet bestaat of een feit dat niet klopt." },
      { icon: "😎", title: "Altijd zeker", text: "AI klinkt altijd zelfverzekerd, ook als het fout is. Zeker klinken is geen bewijs." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Grote kans goed, of check dit?",
        left: "👍 Grote kans goed",
        right: "🔍 Check dit",
        cards: [
          { text: "Hoeveel poten heeft een spin?", side: "left", why: "Dit staat heel vaak online. Grote kans dat het klopt." },
          { text: "Wat heeft mijn juf gisteren gegeten?", side: "right", why: "Dat kan AI niet weten. Dan verzint het iets." },
          { text: "Wie won de wedstrijd van gisteravond?", side: "right", why: "Het nieuwste nieuws weet AI vaak niet. Check het." },
          { text: "Welke kleur heeft een rijpe banaan?", side: "left", why: "Een bekend feitje. Grote kans dat het klopt." },
          { text: "Een oud boek over jouw dorp", side: "right", why: "Hier verzint AI soms titels die niet bestaan." },
        ],
      },
      {
        kind: "pick",
        scenario: "AI zegt: 'Walvissen zijn vissen, dat weet iedereen.'",
        question: "Wat doe jij?",
        options: [
          { text: "Het geloven, AI klinkt zo zeker", why: "Zeker klinken is geen bewijs. Walvissen zijn zoogdieren!" },
          { text: "Checken in een boek of op een goede site", correct: true, why: "Goed zo! Walvissen zijn zoogdieren. AI zat fout." },
          { text: "Het geloven, want in 'walvis' zit het woord 'vis'", why: "Dat woord misleidt je. Walvissen zijn zoogdieren." },
        ],
      },
    ],
    quick: [
      { statement: "Als AI heel zeker klinkt, klopt het ook.", answer: false, why: "Nee. AI klinkt altijd zeker, ook als het fout zit." },
      { statement: "AI kan een boek verzinnen dat niet bestaat.", answer: true, why: "Ja, dat gebeurt echt. Check of een bron bestaat." },
      { statement: "AI weet altijd het nieuws van vandaag.", answer: false, why: "Vaak niet. Check nieuws bij een nieuwssite." },
    ],
    takeaway: "AI klinkt zeker, maar gokt. Jij bent de baas over wat klopt.",
  },
  {
    id: "2.2",
    worldId: 2,
    pillar: "smart",
    title: "Check het!",
    emoji: "🔍",
    hook: "Een AI zegt dat je elke dag tien liter water moet drinken. Klinkt raar, toch? Tijd om een echte feitenchecker te worden!",
    goal: "Leer in drie stappen checken of iets klopt.",
    cards: [
      { icon: "📚", title: "Zoek een tweede bron", text: "Kijk op een andere plek die je kunt vertrouwen, zoals een schoolboek of een nieuwssite." },
      { icon: "🙋", title: "Vraag het na", text: "Vraag het aan je juf, meester of ouder. Zij weten vaak meer dan je denkt." },
      { icon: "🤔", title: "Klinkt het logisch?", text: "Voelt iets raar of te gek? Dan is checken extra belangrijk." },
    ],
    games: [
      {
        kind: "order",
        prompt: "AI zegt iets raars. Tik de check-stappen in de goede volgorde.",
        items: ["Stop en denk na", "Zoek het ergens anders op", "Vraag het na bij een volwassene", "Gebruik het pas als het klopt"],
        explanation: "Eerst nadenken, dan checken, dan navragen. Pas daarna gebruik je het.",
      },
      {
        kind: "swipe",
        prompt: "Goede plek om te checken?",
        left: "👍 Goede check",
        right: "👎 Liever niet",
        cards: [
          { text: "Een encyclopedie of schoolboek", side: "left", why: "Door experts gecheckt. Een topbron." },
          { text: "Een willekeurige reactie onder een filmpje", side: "right", why: "Iedereen kan zomaar iets typen." },
          { text: "De website van het KNMI over het weer", side: "left", why: "Officiële weerexperts. Betrouwbaar." },
          { text: "Een filmpje met 'DIT GELOOF JE NOOIT!!'", side: "right", why: "Schreeuwende titels willen klikken, niet de waarheid." },
          { text: "Je juf of meester", side: "left", why: "Een volwassene die je vertrouwt is een goede check." },
        ],
      },
    ],
    quick: [
      { statement: "Eén bron is genoeg als het van AI komt.", answer: false, why: "Nee, check altijd een tweede bron." },
      { statement: "Een raar antwoord is een teken om extra te checken.", answer: true, why: "Precies. Raar betekent: checken!" },
      { statement: "Hoe meer likes, hoe meer het klopt.", answer: false, why: "Likes zeggen niks over de waarheid." },
    ],
    takeaway: "Denk, check en vraag. Zo trap je nooit in een AI-fout.",
  },
  {
    id: "2.3",
    worldId: 2,
    pillar: "smart",
    title: "Vraag slim",
    emoji: "🎯",
    hook: "Stel je AI een vage vraag, dan krijg je een vaag antwoord. Met de slimme vraag-formule krijg je veel betere antwoorden!",
    goal: "Bouw de perfecte vraag voor AI.",
    cards: [
      { icon: "👤", title: "Voor wie?", text: "Zeg voor wie het is: 'Leg het uit voor iemand van tien jaar.'" },
      { icon: "📋", title: "Wat precies?", text: "Wees duidelijk: niet 'iets over dieren', maar 'drie weetjes over pinguïns'." },
      { icon: "🧾", title: "Hoe wil je het?", text: "Kies de vorm: een lijstje, een kort stukje of een quiz." },
    ],
    games: [
      {
        kind: "build",
        prompt: "Bouw een sterke vraag voor je spreekbeurt over haaien.",
        slots: [
          { label: "Voor wie?", options: [{ text: "voor iemand van 11 jaar", strong: true }, { text: "voor iemand" }] },
          {
            label: "Wat precies?",
            options: [{ text: "iets over vissen" }, { text: "5 verrassende weetjes over haaien", strong: true }, { text: "alles" }],
          },
          { label: "Hoe?", options: [{ text: "in een kort lijstje", strong: true }, { text: "maakt niet uit" }] },
        ],
        explanation: "Voor wie, wat precies en hoe: zo krijg je een antwoord waar je echt iets aan hebt.",
      },
      {
        kind: "pick",
        scenario: "Je wilt hulp bij je werkstuk over vulkanen.",
        question: "Welke vraag werkt het best?",
        options: [
          { text: "Vulkanen", why: "Te vaag. AI weet niet wat je wilt." },
          { text: "Leg in 5 zinnen uit hoe een vulkaan uitbarst, voor groep 7", correct: true, why: "Top! Duidelijk voor wie, wat en hoe." },
          { text: "Schrijf mijn hele werkstuk", why: "Dan leer je niks, en het is niet jouw werk." },
        ],
      },
    ],
    quick: [
      { statement: "Hoe vager je vraag, hoe beter het antwoord.", answer: false, why: "Andersom! Hoe duidelijker, hoe beter." },
      { statement: "Je mag AI vragen het simpeler uit te leggen.", answer: true, why: "Ja! 'Leg het simpeler uit' werkt super." },
      { statement: "Zeggen voor wie het is, helpt AI.", answer: true, why: "Klopt. Dan past het antwoord bij jou." },
    ],
    takeaway: "Voor wie, wat en hoe: zo stel je AI een slimme vraag.",
  },
  {
    id: "2.4",
    worldId: 2,
    pillar: "smart",
    title: "Is AI eerlijk?",
    emoji: "⚖️",
    hook: "Vraag een AI om een plaatje van 'een dokter' en je krijgt vaak een man. Bij 'een verpleegkundige' vaak een vrouw. Is dat eerlijk?",
    goal: "Ontdek waarom AI soms oneerlijk is.",
    cards: [
      { icon: "🪞", title: "AI kopieert ons", text: "AI leert van wat mensen online zetten. Zitten daar vooroordelen in? Dan leert AI die ook." },
      { icon: "🧑‍⚕️", title: "Iedereen kan alles", text: "Dokters, piloten en bouwvakkers kunnen man of vrouw zijn, van elke kleur." },
      { icon: "👀", title: "Blijf kritisch", text: "Zie je steeds hetzelfde soort mensen? Vraag je dan af: is dit wel eerlijk?" },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Eerlijk of oneerlijk?",
        left: "⚖️ Eerlijk",
        right: "🙅 Oneerlijk",
        cards: [
          { text: "AI laat alleen mannen zien bij 'baas'", side: "right", why: "Een baas kan iedereen zijn. Dit is een vooroordeel." },
          { text: "AI laat allerlei mensen zien bij 'sporter'", side: "left", why: "Zo hoort het: sporters zijn heel verschillend." },
          { text: "AI denkt dat meisjes niet van voetbal houden", side: "right", why: "Een vooroordeel! Heel veel meisjes voetballen." },
          { text: "AI vraagt eerst wat voor persoon je bedoelt", side: "left", why: "Goed! Het neemt niks aan en vraagt het na." },
          { text: "Een app die stemmen met een accent slechter snapt", side: "right", why: "Oneerlijk: iedereen moet mee kunnen doen." },
        ],
      },
      {
        kind: "pick",
        scenario: "Je vraagt AI om een plaatje van 'een wetenschapper'. Je krijgt alleen oude mannen in een witte jas.",
        question: "Wat doe je?",
        options: [
          { text: "Vragen om verschillende wetenschappers", correct: true, why: "Slim! Jij kunt AI helpen om eerlijker te zijn." },
          { text: "Niks, zo zien wetenschappers er nou eenmaal uit", why: "Nee. Wetenschappers zijn jong, oud, man en vrouw, van elke kleur." },
          { text: "Denken dat alleen oude mannen slim zijn", why: "Absoluut niet. Dat is precies het vooroordeel van de AI." },
        ],
      },
    ],
    quick: [
      { statement: "AI is altijd eerlijk, want het is een computer.", answer: false, why: "Nee, AI leert ook de vooroordelen van mensen." },
      { statement: "Jij kunt AI vragen om verschillende mensen te laten zien.", answer: true, why: "Ja, een betere vraag helpt." },
      { statement: "Als AI iets vaak laat zien, is het altijd zo.", answer: false, why: "Nee. Vaak is niet hetzelfde als altijd." },
    ],
    takeaway: "AI leert van mensen, ook hun vooroordelen. Jij let op of het eerlijk is.",
  },
  {
    id: "2.5",
    worldId: 2,
    pillar: "smart",
    title: "Welke AI waarvoor?",
    emoji: "🧰",
    hook: "Een hamer is top voor een spijker, maar niet voor soep. Met AI is het net zo: elke soort AI is ergens anders goed in.",
    goal: "Kies de juiste tool voor de klus.",
    cards: [
      { icon: "💬", title: "Tekst-AI", text: "Chatbots zijn goed in uitleg, ideeën en oefenvragen. Maar ze weten niks zeker." },
      { icon: "🎨", title: "Beeld-AI", text: "Beeld-AI maakt plaatjes van jouw beschrijving. Handig voor een fantasiedier of een poster." },
      { icon: "🧮", title: "Geen AI nodig", text: "Voor een som is zelf rekenen en een rekenmachine vaak sneller en betrouwbaarder." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Welke tool past?",
        left: "💬 Tekst-AI",
        right: "🎨 Beeld-AI",
        cards: [
          { text: "Uitleg over breuken, in simpele woorden", side: "left", why: "Uitleggen is een klus voor tekst-AI." },
          { text: "Een plaatje van een draak op een skateboard", side: "right", why: "Een plaatje maken? Beeld-AI!" },
          { text: "Oefenvragen voor je topotoets", side: "left", why: "Vragen bedenken kan tekst-AI goed." },
          { text: "Een logo voor je voetbalteam", side: "right", why: "Een logo is een plaatje: beeld-AI." },
          { text: "Ideeën voor een verhaal over de ruimte", side: "left", why: "Ideeën in woorden: tekst-AI." },
        ],
      },
      {
        kind: "pick",
        scenario: "Voor je huiswerk moet je 347 × 12 uitrekenen.",
        question: "Wat is het slimst?",
        options: [
          { text: "Een chatbot, want die weet alles", why: "Chatbots maken juist vaak rekenfouten." },
          { text: "Zelf rekenen, dan checken", correct: true, why: "Top! Zo leer je rekenen, en een rekenmachine checkt het." },
          { text: "Een beeld-AI die er een plaatje van maakt", why: "Een plaatje helpt je niet aan het antwoord." },
        ],
      },
    ],
    quick: [
      { statement: "Beeld-AI is handig om een som uit te rekenen.", answer: false, why: "Nee, daar reken je zelf en check je met een rekenmachine." },
      { statement: "Veel AI-apps zijn pas vanaf 13 jaar.", answer: true, why: "Klopt. Gebruik ze samen met een ouder of op school." },
      { statement: "Tekst-AI kan helpen oefenvragen te bedenken.", answer: true, why: "Ja, dat is een goede klus voor tekst-AI." },
    ],
    takeaway: "Kies de juiste tool. En soms is dat helemaal geen AI.",
  },
  {
    id: "2.6",
    worldId: 2,
    pillar: "smart",
    title: "Baas: Wereld Slim",
    emoji: "🧭",
    boss: true,
    hook: "De baas van Wereld Slim zit vol trucjes: foute antwoorden, vage vragen en vooroordelen. Kun jij hem verslaan?",
    goal: "Versla de baas van Wereld Slim.",
    cards: [
      { icon: "🎲", title: "Gokker", text: "AI klinkt zeker, maar gokt. Check alles wat belangrijk is." },
      { icon: "🎯", title: "Slimme vraag", text: "Voor wie, wat en hoe maakt elk antwoord beter." },
      { icon: "⚖️", title: "Eerlijk?", text: "AI kan vooroordelen overnemen. Jij let daarop." },
    ],
    games: [
      {
        kind: "spot",
        prompt: "AI schreef dit voor je werkstuk. Tik aan wat NIET klopt.",
        sender: "Chatbot",
        message:
          "De Eiffeltoren is ongeveer 330 meter hoog. Hij werd gebouwd in 1889. Volgens het boek 'Parijs voor Pinguïns' van Jan Bakker staat hij in Rome. Parijs is de hoofdstad van Frankrijk.",
        flags: [
          { fragment: "ongeveer 330 meter hoog", isRed: false, why: "Dit klopt ongeveer. Checken mag natuurlijk altijd!" },
          { fragment: "gebouwd in 1889", isRed: false, why: "Dit klopt: hij werd gebouwd in 1889." },
          { fragment: "'Parijs voor Pinguïns' van Jan Bakker", isRed: true, why: "Dit boek is verzonnen. AI verzint soms bronnen." },
          { fragment: "staat hij in Rome", isRed: true, why: "Fout! De Eiffeltoren staat in Parijs." },
          { fragment: "Parijs is de hoofdstad van Frankrijk", isRed: false, why: "Dit klopt." },
        ],
      },
      {
        kind: "build",
        prompt: "Maak een slimme en eerlijke vraag voor een plaatje van astronauten.",
        slots: [
          { label: "Wie?", options: [{ text: "een astronaut" }, { text: "verschillende astronauten, jong en oud", strong: true }] },
          { label: "Wat?", options: [{ text: "die samen op de maan werken", strong: true }, { text: "iets met ruimte" }] },
          { label: "Hoe?", options: [{ text: "maakt niet uit" }, { text: "als vrolijke tekening", strong: true }] },
        ],
        explanation: "Duidelijk en divers: zo krijg je een beter én eerlijker plaatje.",
      },
    ],
    quick: [
      { statement: "Een verzonnen bron kan er heel echt uitzien.", answer: true, why: "Ja! Check altijd of een boek echt bestaat." },
      { statement: "Een vage vraag geeft het beste antwoord.", answer: false, why: "Nee, wees duidelijk." },
      { statement: "AI laat altijd een eerlijk beeld van de wereld zien.", answer: false, why: "Nee, AI kan vooroordelen overnemen." },
    ],
    takeaway: "Wereld Slim uitgespeeld! Jij checkt, vraagt slim en let op eerlijkheid.",
  },
];

// ============================================================
//  WERELD 3 — STERKER
// ============================================================

const W3: Mission[] = [
  {
    id: "3.1",
    worldId: 3,
    pillar: "stronger",
    title: "Hulp of smokkelen?",
    emoji: "🧠",
    hook: "Je hebt een werkstuk. AI kan het in vijf seconden voor je schrijven. Top? Of toch niet? Jouw brein wil ook trainen!",
    goal: "Ontdek wanneer AI je slimmer maakt.",
    cards: [
      { icon: "🏋️", title: "Train je brein", text: "Je leert door zelf na te denken. Als AI alles doet, traint je brein niet." },
      { icon: "🧭", title: "Coach, geen vervanger", text: "Laat AI uitleggen of tips geven. Het werk doe je zelf." },
      { icon: "🤝", title: "Eerlijk zijn", text: "Heb je AI gebruikt? Vertel het je juf of meester. Dat is eerlijk." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Word je hier slimmer van?",
        left: "🧠 Slimmer",
        right: "🙈 Sluiproute",
        cards: [
          { text: "AI vragen je fouten uit te leggen", side: "left", why: "Van uitleg over fouten leer je het meest." },
          { text: "AI je hele opstel laten schrijven", side: "right", why: "Dan leer je niks, en het is niet jouw werk." },
          { text: "AI om drie tips vragen en dan zelf schrijven", side: "left", why: "Top: AI helpt, jij doet het werk." },
          { text: "Antwoorden van AI overtikken zonder te lezen", side: "right", why: "Je brein doet dan niks. Sluiproute!" },
          { text: "AI je laten overhoren voor een toets", side: "left", why: "Oefenen met vragen maakt je sterker." },
        ],
      },
      {
        kind: "pick",
        scenario: "Je moet een verhaal schrijven over een avontuur, maar je weet niet hoe je moet beginnen.",
        question: "Wat is de beste hulp?",
        options: [
          { text: "AI om drie ideeën vragen en er zelf één uitwerken", correct: true, why: "Top! AI helpt je op gang, jij maakt het verhaal." },
          { text: "AI het hele verhaal laten schrijven en inleveren", why: "Dan is het niet jouw verhaal en leer je niks." },
          { text: "Een verhaal van internet kopiëren", why: "Dat is spieken, en dat is niet eerlijk." },
        ],
      },
    ],
    quick: [
      { statement: "Als AI je huiswerk maakt, leer je net zoveel.", answer: false, why: "Nee, je brein traint alleen als jij zelf denkt." },
      { statement: "Je juf vertellen dat je AI gebruikte, is eerlijk.", answer: true, why: "Ja, eerlijk duurt het langst." },
      { statement: "AI om uitleg vragen is een slimme manier van leren.", answer: true, why: "Precies: uitleg, geen antwoorden." },
    ],
    takeaway: "Gebruik AI als coach. Het helpt, maar jij doet het denkwerk.",
  },
  {
    id: "3.2",
    worldId: 3,
    pillar: "stronger",
    title: "Uitleg-maatje",
    emoji: "💡",
    hook: "Snap je iets niet van breuken? AI kan het op tien manieren uitleggen, net zo lang tot het klikt. Wel samen met een volwassene!",
    goal: "Laat AI de weg wijzen in plaats van het antwoord geven.",
    cards: [
      { icon: "🗺️", title: "Vraag de weg", text: "Vraag niet 'wat is het antwoord?', maar 'hoe los ik dit op?'" },
      { icon: "🔁", title: "Nog eens, anders", text: "Snap je het niet? Vraag dan: 'Leg het uit met een voorbeeld over pizza.'" },
      { icon: "👨‍👩‍👧", title: "Samen", text: "Gebruik AI-apps samen met een ouder of op school. Veel apps zijn pas vanaf 13." },
    ],
    games: [
      {
        kind: "build",
        prompt: "Bouw een vraag die je helpt om breuken te snappen.",
        slots: [
          { label: "Wat wil je?", options: [{ text: "geef me het antwoord" }, { text: "leg stap voor stap uit", strong: true }] },
          { label: "Waarover?", options: [{ text: "hoe je 1/2 en 1/4 optelt", strong: true }, { text: "iets met getallen" }] },
          { label: "Hoe?", options: [{ text: "zo moeilijk mogelijk" }, { text: "met een voorbeeld over pizza", strong: true }] },
        ],
        explanation: "Vraag de weg, niet het antwoord. Met een voorbeeld snap je het sneller.",
      },
      {
        kind: "pick",
        scenario: "AI legt iets uit, maar je snapt het nog steeds niet.",
        question: "Wat doe je?",
        options: [
          { text: "Het antwoord gewoon overnemen", why: "Dan snap je het nog steeds niet. Probeer een andere uitleg." },
          { text: "Om een simpelere uitleg vragen", correct: true, why: "Top! AI kan het net zo vaak anders uitleggen als jij wilt." },
          { text: "Stoppen, want je bent er vast gewoon niet goed in", why: "Nee! Een andere uitleg kan alles veranderen. Vraag ook je juf." },
        ],
      },
    ],
    quick: [
      { statement: "'Hoe los ik dit op?' helpt je meer dan om het antwoord vragen.", answer: true, why: "Ja! Dan leer je het zelf." },
      { statement: "Snap je het niet, dan moet je het AI niet nog eens vragen.", answer: false, why: "Juist wel: vraag om een andere uitleg." },
      { statement: "Je mag alle AI-apps gebruiken, op elke leeftijd.", answer: false, why: "Nee, veel zijn pas vanaf 13. Doe het samen of op school." },
    ],
    takeaway: "Vraag de weg, niet het antwoord. Zo word je er zelf goed in.",
  },
  {
    id: "3.3",
    worldId: 3,
    pillar: "stronger",
    title: "Oefen-maatje",
    emoji: "🏆",
    hook: "Morgen heb je een toets over de provincies. Wat als AI je kan overhoren, als je eigen quizmaster?",
    goal: "Laat AI je helpen oefenen.",
    cards: [
      { icon: "❓", title: "Laat je overhoren", text: "Vraag: 'Stel me vijf vragen over de provincies. Eén per keer.'" },
      { icon: "✅", title: "Leer van fouten", text: "Vraag waarom een antwoord fout was. Van fouten leer je het meest." },
      { icon: "🔍", title: "Blijf checken", text: "AI kan zelf ook fout zitten. Vergelijk met je schoolboek." },
    ],
    games: [
      {
        kind: "order",
        prompt: "Tik de stappen van slim oefenen in de goede volgorde.",
        items: ["Vraag AI om vijf oefenvragen", "Beantwoord ze zelf", "Laat uitleggen wat fout ging", "Check met je schoolboek"],
        explanation: "Eerst zelf proberen, dan leren van fouten en checken. Zo onthoud je het het best.",
      },
      {
        kind: "swipe",
        prompt: "Handige oefenvraag aan AI?",
        left: "👍 Handig",
        right: "👎 Niet handig",
        cards: [
          { text: "Overhoor me over de provincies, één vraag per keer", side: "left", why: "Zo oefen je echt zelf." },
          { text: "Geef me alle antwoorden van de toets", side: "right", why: "Dan oefen je niks, en het is niet eerlijk." },
          { text: "Maak een quiz over breuken voor groep 7", side: "left", why: "Een quiz op jouw niveau: top!" },
          { text: "Doe de toets maar voor mij", side: "right", why: "Dan leer jij niks." },
          { text: "Leg uit waarom mijn antwoord fout was", side: "left", why: "Van fouten leer je het meest." },
        ],
      },
    ],
    quick: [
      { statement: "AI kan een quiz voor je maken om te oefenen.", answer: true, why: "Ja, dat is een slimme manier om te leren." },
      { statement: "Wat AI zegt, hoef je nooit met je boek te checken.", answer: false, why: "Wel! AI kan ook fout zitten." },
      { statement: "Van je fouten leer je het meest.", answer: true, why: "Klopt. Fouten maken hoort bij leren." },
    ],
    takeaway: "Laat AI je overhoren en leer van je fouten. Zo scoor je beter.",
  },
  {
    id: "3.4",
    worldId: 3,
    pillar: "stronger",
    title: "Maak iets eigens",
    emoji: "🎨",
    hook: "Je wilt je eigen stripverhaal maken. AI kan helpen, maar hoe zorg je dat het echt JOUW verhaal wordt?",
    goal: "Maak iets eigens, met AI als hulpje.",
    cards: [
      { icon: "💭", title: "Jij eerst", text: "Bedenk eerst zelf je idee. Jouw fantasie is het belangrijkste ingrediënt." },
      { icon: "🛠️", title: "AI als hulpje", text: "Laat AI helpen met details, zoals een goede naam of een verrassend einde." },
      { icon: "🏷️", title: "Zeg het eerlijk", text: "Vertel wat van jou is en waar AI hielp. Dat is eerlijk." },
    ],
    games: [
      {
        kind: "order",
        prompt: "Tik de stappen voor je eigen strip in de goede volgorde.",
        items: ["Zelf een idee bedenken", "Je verhaal kort opschrijven", "AI om tips voor details vragen", "Zelf kiezen wat je goed vindt"],
        explanation: "Jij begint en jij kiest. AI helpt alleen onderweg.",
      },
      {
        kind: "pick",
        scenario: "AI heeft een tekening gemaakt voor je poster. Je wilt meedoen aan een tekenwedstrijd.",
        question: "Mag je die inleveren als jouw tekening?",
        options: [
          { text: "Ja, want jij hebt de vraag voor AI bedacht", why: "De vraag is van jou, de tekening niet. Dat is niet eerlijk." },
          { text: "Alleen als AI mag en je het eerlijk zegt", correct: true, why: "Precies. Eerlijk zijn en de regels volgen." },
          { text: "Ja, niemand ziet het verschil", why: "Ook als niemand het ziet: eerlijk zijn blijft belangrijk." },
        ],
      },
    ],
    quick: [
      { statement: "Het beste idee begint in je eigen hoofd.", answer: true, why: "Ja! Jouw fantasie is de basis." },
      { statement: "Iets van AI mag je altijd als je eigen werk inleveren.", answer: false, why: "Nee. Zeg eerlijk wat AI deed." },
      { statement: "AI kan helpen met een naam voor je personage.", answer: true, why: "Ja, als hulpje bij de details." },
    ],
    takeaway: "Jouw idee, jouw keuzes. AI is het hulpje, jij bent de maker.",
  },
  {
    id: "3.5",
    worldId: 3,
    pillar: "stronger",
    title: "De gouden regels",
    emoji: "🌟",
    hook: "Je bent bijna een AI-pro! Nog één ding: de gouden regels om AI elke dag slim en veilig te gebruiken.",
    goal: "Leer de gouden regels voor AI.",
    cards: [
      { icon: "👨‍👩‍👧", title: "Samen ontdekken", text: "Probeer nieuwe AI-apps samen met een ouder of op school. Let op de leeftijdsgrens." },
      { icon: "🧠", title: "Eerst zelf", text: "Denk eerst zelf na. Gebruik AI daarna om te checken of te verbeteren." },
      { icon: "⏰", title: "Pauze", text: "AI is een hulpmiddel. Vrienden, buiten spelen en slapen zijn net zo belangrijk." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Gouden regel of geen goed idee?",
        left: "🌟 Gouden regel",
        right: "❌ Geen goed idee",
        cards: [
          { text: "Een nieuwe AI-app eerst samen met je ouder proberen", side: "left", why: "Samen ontdekken is slim en veilig." },
          { text: "Tot diep in de nacht met een chatbot kletsen", side: "right", why: "Slaap is belangrijker. Een chatbot kan wachten." },
          { text: "Eerst zelf nadenken, dan AI om hulp vragen", side: "left", why: "Zo blijft je brein de baas." },
          { text: "Een app gebruiken die pas vanaf 16 is", side: "right", why: "Leeftijdsgrenzen zijn er om jou te beschermen." },
          { text: "Belangrijke informatie altijd checken", side: "left", why: "Check, check, dubbelcheck!" },
        ],
      },
      {
        kind: "pick",
        scenario: "Je vriend wil een nieuwe AI-app downloaden. Er staat: 'Vanaf 13 jaar'. Jullie zijn 11.",
        question: "Wat doen jullie?",
        options: [
          { text: "Toch downloaden, niemand checkt het", why: "Leeftijdsgrenzen zijn er om jou te beschermen." },
          { text: "Het samen met een ouder bekijken", correct: true, why: "Top! Een ouder kan meekijken of het veilig is." },
          { text: "Een neppe geboortedatum invullen", why: "Liegen over je leeftijd is niet slim en niet veilig." },
        ],
      },
    ],
    quick: [
      { statement: "Een app voor 13+ mag je gewoon gebruiken als je voorzichtig bent.", answer: false, why: "Nee. Ben je jonger, doe het dan samen met een ouder." },
      { statement: "Eerst zelf denken en dan AI gebruiken, is slim.", answer: true, why: "Ja, zo word je er zelf beter van." },
      { statement: "Pauze nemen van schermen hoort bij slim AI-gebruik.", answer: true, why: "Klopt. Rust houdt je brein scherp." },
    ],
    takeaway: "Samen ontdekken, eerst zelf denken en op tijd pauze: dat is een AI-pro.",
  },
  {
    id: "3.6",
    worldId: 3,
    pillar: "stronger",
    title: "Baas: de eindbaas",
    emoji: "⭐",
    boss: true,
    hook: "Dit is de laatste baas! Alles wat je leerde, komt samen. Versla hem en open de deur naar de eindtoets en je diploma!",
    goal: "Versla de eindbaas van Wereld Sterker.",
    cards: [
      { icon: "🧠", title: "Coach", text: "AI legt uit en overhoort. Jij doet het denkwerk." },
      { icon: "🤝", title: "Eerlijk", text: "Zeg wat AI deed en wat jij deed." },
      { icon: "👨‍👩‍👧", title: "Samen", text: "Nieuwe apps probeer je samen, en je let op de leeftijd." },
    ],
    games: [
      {
        kind: "swipe",
        prompt: "Pro-zet of valkuil?",
        left: "🏅 Pro-zet",
        right: "🕳️ Valkuil",
        cards: [
          { text: "AI vragen om je fouten uit te leggen", side: "left", why: "Zo leer je het meest." },
          { text: "Een AI-opstel inleveren als eigen werk", side: "right", why: "Niet eerlijk, en je leert niks." },
          { text: "Een chatbot vertellen waar je woont", side: "right", why: "Je adres blijft altijd geheim." },
          { text: "Een AI-antwoord checken in je schoolboek", side: "left", why: "Check, check, dubbelcheck!" },
          { text: "Samen met je juf een AI-tool uitproberen", side: "left", why: "Samen ontdekken is slim." },
          { text: "Een nepfoto van een klasgenoot doorsturen", side: "right", why: "Dat is pesten. Nooit doen." },
        ],
      },
      {
        kind: "pick",
        scenario: "Je zit vast bij een lastige som en het is al laat.",
        question: "Wat is de pro-zet?",
        options: [
          { text: "AI om een hint vragen en het dan zelf proberen", correct: true, why: "Top! Een hint helpt, jij doet het werk." },
          { text: "Het antwoord van AI overnemen en gaan slapen", why: "Dan snap je het morgen nog steeds niet." },
          { text: "Stiekem het AI-antwoord inleveren", why: "Dat is niet eerlijk tegenover je juf." },
        ],
      },
    ],
    quick: [
      { statement: "AI mag je coach zijn, maar jij doet het denkwerk.", answer: true, why: "Precies. Jij bent de baas." },
      { statement: "Wat AI zegt, is altijd waar.", answer: false, why: "Nee. Check wat belangrijk is." },
      { statement: "Een nepfoto van iemand delen is gewoon een grapje.", answer: false, why: "Nee. Het kan iemand echt pijn doen." },
    ],
    takeaway: "Eindbaas verslagen! Tijd voor de grote eindtoets en je diploma.",
  },
];

export const WORLDS: World[] = [
  {
    id: 1,
    pillar: "safe",
    name: "Veilig",
    tagline: "Bescherm jezelf en anderen",
    emoji: "🛡️",
    badgeName: "Schild van Veilig",
    missions: W1,
  },
  {
    id: 2,
    pillar: "smart",
    name: "Slim",
    tagline: "Stel slimme vragen en check alles",
    emoji: "🧭",
    badgeName: "Kompas van Slim",
    missions: W2,
  },
  {
    id: 3,
    pillar: "stronger",
    name: "Sterker",
    tagline: "Leer sneller, samen en eerlijk",
    emoji: "⭐",
    badgeName: "Ster van Sterker",
    missions: W3,
  },
];

export const ALL_MISSIONS: Mission[] = WORLDS.flatMap((w) => w.missions);

export const getMission = (id: string) => ALL_MISSIONS.find((m) => m.id === id);
export const getWorld = (id: number) => WORLDS.find((w) => w.id === id);

/** The mission after this one (across worlds), if any. */
export const nextMission = (id: string): Mission | undefined => {
  const idx = ALL_MISSIONS.findIndex((m) => m.id === id);
  return idx >= 0 ? ALL_MISSIONS[idx + 1] : undefined;
};

// ============================================================
//  EINDTOETS — 10 vragen, 8 goed om te slagen
// ============================================================

export const FINAL_PASS_SCORE = 8;

export const FINAL_TEST: FinalQuestion[] = [
  {
    worldId: 1,
    question: "Wat doet AI eigenlijk?",
    options: ["Het spot patronen en doet slimme gokken", "Het denkt en voelt als een mens", "Het weet alles van internet"],
    correct: 0,
    why: "AI herkent patronen en gokt het beste antwoord. Het denkt en voelt niet.",
  },
  {
    worldId: 1,
    question: "Een chatbot vraagt naar je adres. Wat doe je?",
    options: ["Je geeft het, hij is heel aardig", "Je geeft het niet", "Je geeft alleen je straatnaam en huisnummer"],
    correct: 1,
    why: "Je adres blijft altijd geheim, ook voor een aardige chatbot.",
  },
  {
    worldId: 1,
    question: "Een appje zegt: 'Stuur snel geld en zeg niks tegen je ouders!' Wat is dit?",
    options: ["Een vriend die snel hulp nodig heeft", "Waarschijnlijk oplichting", "Een grapje dat je gewoon kunt negeren"],
    correct: 1,
    why: "Haast, geld en een geheim: drie alarmbellen tegelijk.",
  },
  {
    worldId: 1,
    question: "Je wilt een grappige AI-foto van een klasgenoot maken. Wat moet eerst?",
    options: ["Niks, het is maar een grap", "Hem eerst aan de hele klas laten zien", "Toestemming vragen"],
    correct: 2,
    why: "Eerst vragen. En nooit om iemand uit te lachen.",
  },
  {
    worldId: 1,
    question: "Een chatbot zegt: 'Ik ben je beste vriend.' Klopt dat?",
    options: ["Ja, want hij praat altijd heel aardig tegen je", "Nee, hij voelt niks", "Ja, als je elke dag lang met hem chat"],
    correct: 1,
    why: "Een chatbot zegt lieve woorden, maar voelt niks. Echte vrienden gaan voor.",
  },
  {
    worldId: 2,
    question: "AI geeft een antwoord en klinkt heel zeker. Wat betekent dat?",
    options: ["Het kan toch fout zijn", "Dan is het zeker goed", "AI klinkt alleen zeker als het echt klopt"],
    correct: 0,
    why: "AI klinkt altijd zeker, ook als het gokt. Check wat belangrijk is.",
  },
  {
    worldId: 2,
    question: "Welke vraag aan AI is het slimst?",
    options: ["Regen", "Leg in 5 zinnen uit hoe regen ontstaat, voor groep 7", "Schrijf mijn hele werkstuk over regen, zo lang mogelijk"],
    correct: 1,
    why: "Voor wie, wat precies en hoe: zo krijg je een goed antwoord.",
  },
  {
    worldId: 2,
    question: "AI laat bij 'dokter' alleen mannen zien. Wat is er aan de hand?",
    options: ["Alleen mannen kunnen dokter worden, dat klopt", "De AI is gewoon kapot", "Een vooroordeel uit de voorbeelden"],
    correct: 2,
    why: "AI leert van voorbeelden van mensen, ook van hun vooroordelen.",
  },
  {
    worldId: 3,
    question: "Je snapt een som niet. Hoe gebruik je AI slim?",
    options: ["Om uitleg vragen, stap voor stap", "Alleen om het antwoord vragen", "AI de hele toets laten maken"],
    correct: 0,
    why: "Vraag de weg, niet het antwoord. Dan leer je het zelf.",
  },
  {
    worldId: 3,
    question: "Een nieuwe AI-app is 'vanaf 13'. Jij bent 11. Wat doe je?",
    options: ["Een neppe leeftijd invullen", "Samen met een ouder kijken wat kan", "Gewoon downloaden"],
    correct: 1,
    why: "Leeftijdsgrenzen beschermen je. Samen met een ouder is de slimme keuze.",
  },
];
