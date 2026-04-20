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
      // ---------- Les 1.1 ----------
      {
        id: "1.1",
        worldId: 1,
        pillar: "safe",
        title: "Wat is AI eigenlijk?",
        emoji: "🤖",
        sparkIntro: "Oké, eerlijke vraag om mee te beginnen. Denk aan de laatste keer dat TikTok precies dat ene filmpje liet zien dat je wilde zien. Voelde bijna alsof TikTok kon ruiken wat je leuk vond, toch? Dat is AI. En dat ga ik je vandaag uitleggen. Geen moeilijke computerpraat. Gewoon: wat doet dat ding eigenlijk?",
        theoryIntro: "**AI is geen magie. Ook geen robot met gevoelens.**\n\nAI betekent Artificial Intelligence. Kunstmatige intelligentie. Maar pas op dat woord 'intelligentie', dat is misleidend. AI denkt niet zoals jij nadenkt.\n\nWat AI WEL doet: patronen zoeken in hele, hele, hele veel voorbeelden. Stel je voor, je laat een computer 10 miljoen foto's van katten zien. Na een tijdje zegt de computer 'hé, ik zie iets. Als er spitse oren en snorharen en vachtstreepjes op zitten, is het waarschijnlijk een kat.'\n\nHeeft die computer ooit een kat geaaid? Nee. Heeft ie een lievelingskat? Nee. Weet ie überhaupt wat 'een kat' is? Ook nee.\n\nHij heeft alleen puntjes verbonden. Net zoals jij patronen ziet in een Minecraft-kaart. Jij weet: oranje blokje plus groene knop betekent redstone-circuit. Niet omdat die blokken 'denken', maar omdat jij het patroon herkent.",
        fact: "De eerste keer dat een computer een mens versloeg met schaken was in 1997. De computer heette Deep Blue. Hij kon niet spelen zoals een mens. Hij kon alleen miljarden zetten vooruit rekenen en de beste kiezen. Dat is AI in één zin: ongelofelijk goed rekenen, nul begrip.",
        sparkMiddle: "Check, de basis snap je. Nu het gave deel: als AI zo dom is, waarom lijkt het dan zo slim? Want als je ChatGPT vraagt naar huiswerk, geeft het best wel goede antwoorden. Hoe kan dat?",
        theoryDeep: "**Waarom AI zo slim LIJKT**\n\nOmdat AI niet met 10 miljoen kattenfoto's is getraind, maar met bijna alle teksten op internet. Miljarden zinnen. Alle Wikipedia-artikelen, alle boeken, alle blogs, alle forums. Alles.\n\nAls jij een vraag stelt, gokt AI heel goed wat het beste antwoord is. Gebaseerd op alle zinnen die het ooit heeft gezien. Het KENT de antwoorden niet, het gokt ze op basis van patronen.\n\nSoms klopt het super goed. Soms zit het ernaast. En dit is belangrijk, onthoud dit: AI klinkt altijd zelfverzekerd. Ook als het gokt. Ook als het fout zit. Dus jij moet zelf blijven nadenken.\n\nEén ding om te weten, gewoon zodat je het begrijpt: alle grote AI-bedrijven maken verschillende AI's. ChatGPT is van OpenAI. Claude van Anthropic. Gemini van Google. Allemaal anders getraind. Daarover later meer.",
        interactive: sort(
          "Sleep elk kaartje naar de juiste zone: 'Dit is AI' of 'Dit is geen AI'.",
          ["🤖 Dit is AI", "📦 Dit is geen AI"],
          [
              { label: "TikTok die jouw lievelingsfilmpjes kiest", bucket: 0 },
              { label: "De rekenmachine op je telefoon", bucket: 1 },
              { label: "Snapchat-filter dat je gezicht herkent", bucket: 0 },
              { label: "Een papieren plattegrond", bucket: 1 },
              { label: "YouTube die 'wat je hierna moet kijken' voorstelt", bucket: 0 },
              { label: "De kookwekker in de keuken", bucket: 1 },
              { label: "ChatGPT die je huiswerk uitlegt", bucket: 0 },
              { label: "Spellingscontrole in Word (die rode streepje-ding)", bucket: 0 },
          ],
        ),
        summary: [
          "AI is een patroon-herkenner. Het denkt niet. Het voorspelt op basis van heel veel voorbeelden.",
          "AI klinkt altijd zelfverzekerd. Ook als het gokt. Jij blijft zelf nadenken.",
          "AI zit overal: TikTok, YouTube, games, snapchat-filters. Niet op magische plekken, maar in apps die jij al gebruikt.",
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
            why: "Exact. AI leert door patronen te zien in miljoenen voorbeelden. Denken is het niet.",
          },
          {
            question: "AI heeft gevoelens, net als jij.",
            options: [
              "Waar",
              "Niet waar",
            ],
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
        sparkIntro: "Kleine test. Stel je zit met 20 vreemden in een wachtkamer. Zou je dan hardop je adres voorlezen? Je telefoonnummer? Nou, dat is wat er ongeveer gebeurt als je die dingen aan AI typt. Niet precies zo. Maar genoeg om even op te letten. Dit gaat over jouw geheimen.",
        theoryIntro: "**Wat gebeurt er eigenlijk met wat je intypt?**\n\nAls jij iets typt naar AI, gaat die tekst niet zomaar 'weg'. Het gaat naar een groot bedrijf. Soms wordt het bewaard. Soms wordt het gebruikt om de AI beter te maken. Soms kunnen mensen die bij dat bedrijf werken het inkijken.\n\nDat is geen samenzwering. Dat is gewoon hoe het werkt. Bedrijven moeten checken of hun AI goed werkt en niet rare dingen zegt. Dus ze lezen stukken van gesprekken mee.\n\nDat is fijn als je vraagt 'leg breuken uit'. Minder fijn als je intypt 'ik woon op Kerkstraat 12 in Dordrecht'. Want dan staat jouw adres ergens, en jij hebt er geen controle meer over.",
        fact: "In 2023 vonden werknemers van Samsung uit dat geheime bedrijfsinformatie die zij in ChatGPT hadden geplakt, terechtkwam in de training van de AI. Dat mocht helemaal niet. Het gebeurde toch. Nu is het verboden om ChatGPT bij Samsung te gebruiken voor werk. Volwassenen met goede banen, die ook gewoon fouten maken met AI. Jij bent niet alleen.",
        sparkMiddle: "Oké, doemdenken over. Laten we praktisch worden. Wat mag wel, wat mag niet? Ik ga je een simpel kader geven. Geen regels om uit je hoofd te leren, gewoon één vraag die je jezelf stelt.",
        theoryDeep: "**De wachtkamer-test**\n\nVanaf nu als je iets aan AI typt, stel jezelf één vraag: zou ik dit ook hardop zeggen in een wachtkamer vol vreemden?\n\nJe voornaam? Ja, dat zou je wel zeggen. Oké.\n\nJe lievelingskleur? Natuurlijk. Prima.\n\nJe thuisadres? Nee, hè. Die zeg je niet zomaar in een wachtkamer. Dus ook niet aan AI.\n\nJe wachtwoord? Sowieso niet. Ook niet als je ouders je dat nooit expliciet hebben verteld, je weet dat zelf al.\n\nEen foto van jezelf? Dat ligt eraan. Een foto waarop je in je schooluniform staat voor je school, bij de ingang? Nee. Teveel herleidbaar.\n\nHet is niet ingewikkeld. Het is gewoon: 'zou een vreemde dit mogen weten?' Als het antwoord nee is, typ het niet.",
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
              { label: "Een foto van jezelf in je uniform bij de schoolingang", bucket: 1 },
          ],
        ),
        summary: [
          "Wat je aan AI typt, wordt vaak bewaard. Behandel het als iets wat een vreemde kan lezen.",
          "De wachtkamer-test: zou je dit hardop zeggen tegen 20 vreemden? Zo niet, typ het niet.",
          "Je voornaam, hobby's en onderwerpen zijn meestal prima. Adres, telefoon, wachtwoorden, foto's-met-locatie zijn nooit oké.",
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
            why: "Naam plus school, adres en telefoonnummer zijn samen te herleidbaar. Kleur en kattennaam zijn prima. (Juist: Je volledige naam plus school, Je thuisadres, Je telefoonnummer.)",
          },
          {
            question: "Als ik aan AI zeg 'dit blijft tussen ons', dan houdt AI het ook echt geheim.",
            options: [
              "Waar",
              "Niet waar",
            ],
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
        title: "Spot de nep: plaatjes",
        emoji: "🕵️",
        sparkIntro: "Ik ga je iets raars vertellen. Een poosje geleden ging er een foto viral van de Paus in een enorme witte pufferjas. Zag er badass uit. Nou, die foto was nep. Helemaal gemaakt door AI. Miljoenen mensen deelden het zonder te checken. Inclusief volwassenen die het beter hadden moeten weten. Vandaag leer je iets wat de meeste volwassenen nog niet kunnen.",
        theoryIntro: "**AI-plaatjes zijn overal. En ze worden steeds beter.**\n\nIedereen met een telefoon kan nu een AI-plaatje maken. In 30 seconden. Zonder tekenen te kunnen. Typ 'hond op skateboard in ruimtepak', en bam, plaatje.\n\nDat is leuk, maar ook een probleem. Want niet iedereen zegt erbij 'dit is door AI gemaakt'. Soms doen mensen alsof het echt is. Om aandacht te trekken. Om je belachelijk te maken. Om je iets te laten geloven.\n\nDus de vraag 'is dit echt?' is een vaardigheid geworden. Net zoals lezen en rekenen. En jij gaat het nu leren.",
        fact: "In 2023 dacht iemand op TikTok dat een AI-plaatje van Donald Trump die werd gearresteerd echt was. Het was gemaakt door een journalist als experiment. Hij had er bij gezet 'dit is AI'. Mensen lazen het bijschrift niet. Binnen een dag hadden miljoenen mensen het gedeeld als 'nieuws'. Fake news is niet alleen tekst. Het is ook beeld. En het groeit.",
        sparkMiddle: "Gaat het je lukken om 100% van de AI-plaatjes te spotten? Nee. Ik zelfs niet altijd. Maar ik ga je drie checks geven waarmee je 80% van de nep kunt oppakken. Dat is veel beter dan niks.",
        theoryDeep: "**De drie AI-checks**\n\nCheck 1: Handen en vingers. Dit is nog steeds het grootste zwakke punt van AI. Te veel vingers. Te weinig vingers. Vingers die kronkelen. Een hand die lijkt op een klauw. Altijd even naar de handen kijken.\n\nCheck 2: Tekst. Staat er een bord op de foto? Een letter op een T-shirt? Een naam op een winkel? AI kan niet goed schrijven in plaatjes. Het lijkt vaak op echte tekst, maar als je beter kijkt zijn het krabbels die letters imiteren.\n\nCheck 3: Te perfect. Dit is de tricky. Echte foto's hebben rommel. Een krasje. Haar wat niet helemaal zit. Een schaduw die onlogisch is. AI-plaatjes zijn vaak té glad. Te mooi. Alsof een filter erover is gegaan die alles heeft opgepoetst.\n\nEn een bonuscheck, gratis: als het beeld past bij iets onwaarschijnlijks (de Paus in pufferjas, een kat die auto rijdt, de meester met twee hoofden), wees skeptisch. Te gek om waar te zijn? Vaak AI.",
        interactive: tap(
          "Bij elk plaatje: spot de AI-tell. Welke check gebruikte je?",
          [
              { label: "Plaatje: een meisje dat een ijsje eet. Ze heeft 7 vingers aan haar rechterhand.", reveal: "Klassieke AI-fout. Altijd als eerste naar handen kijken." },
              { label: "Plaatje: een hotel met een naambord waarop staat 'GRRND HOTEL AVIENR'.", reveal: "Nep tekst. AI kan vaak woorden nabootsen maar niet spellen." },
              { label: "Plaatje: een gezicht dat ongelofelijk glad is, geen enkele porie, haar dat perfect ligt.", reveal: "Te perfect. Echte huid heeft textuur. Echt haar zit nooit perfect." },
              { label: "Plaatje: een vlekkeloze foto van je eigen hond die slaapt.", reveal: "Waarschijnlijk echt. Niks onwaarschijnlijks, handen/tekst niet in beeld, normale foto." },
              { label: "Plaatje: een koe die skiet op een besneeuwde berg.", reveal: "Bonuscheck. Te gek om waar te zijn. Vrijwel zeker AI." },
          ],
        ),
        summary: [
          "AI-plaatjes zijn overal. Spotten wordt een vaardigheid, net als lezen.",
          "Drie checks: handen (klassieke fout), tekst (letters die geen echte woorden vormen), te perfect (geen natuurlijke rommel).",
          "Bonuscheck: als het onwaarschijnlijk is (te gek, te mooi, te raar), wees skeptisch.",
        ],
        quiz: [
          {
            question: "Wat is meestal de beste eerste check op een AI-plaatje?",
            options: [
              "De achtergrond",
              "De handen en vingers",
              "De hemel",
              "Of er iemand lacht",
            ],
            correctIndex: 1,
            why: "Handen. Nog steeds het grootste zwakke punt van AI.",
          },
          {
            question: "Welke zijn typische tekenen van een AI-plaatje?",
            options: [
              "Rare tekst op borden",
              "Normale schaduwen",
              "6 of meer vingers",
              "Te perfecte huid",
              "Een foto in de regen",
            ],
            correctIndex: 0,
            why: "Rare tekst, extra vingers en té gladde huid zijn klassiekers. (Juist: Rare tekst op borden, 6 of meer vingers, Te perfecte huid.)",
          },
          {
            question: "Als een plaatje er perfect uitziet, is het zeker echt.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 1,
            why: "Omgekeerd vaak. Té perfect is een rode vlag. Echte foto's hebben rommel.",
          },
        ],
        reflection: "Je hebt nu een detective-oog voor plaatjes. Gebruik het.",
      },
      // ---------- Les 1.4 ----------
      {
        id: "1.4",
        worldId: 1,
        pillar: "safe",
        title: "Spot de nep: video's en stemmen",
        emoji: "🎭",
        sparkIntro: "Ooit een video gezien van een bekende voetballer die iets raars zegt? Of een YouTube-short waar Mr. Beast ineens gratis iPhones lijkt weg te geven? Grote kans dat het nep was. Deepfakes heet dat. En ze worden iedere maand beter. Ik ga je niet bang maken. Ik ga je voorbereid maken.",
        theoryIntro: "**Wat is een deepfake?**\n\nEen deepfake is een video of audio waar iemand zijn gezicht of stem is vervangen door AI. Je ziet iemand die je kent, maar eigenlijk is die persoon dat niet.\n\nHoe werkt het? AI heeft heel veel filmpjes en foto's van die persoon bekeken. Daarna kan AI een nieuw filmpje maken waarin die persoon dingen doet en zegt die hij eigenlijk nooit heeft gedaan of gezegd. Zoals poppenspel, maar dan met een ander gezicht op de pop.\n\nSommige deepfakes zijn grappig. Iemand maakt een filmpje waarin Einstein raptekst zingt. Lol. Maar andere deepfakes zijn gemeen of gevaarlijk. Iemand maakt een nep-video waarin een leraar iets raars zegt. Die video gaat rond op school. De leraar krijgt gedoe voor iets wat hij nooit heeft gezegd.\n\nEn belangrijkste voor jou: als er een video rondgaat van een bekend iemand die iets schokkends zegt, check het eerst voordat je het deelt.",
        fact: "De beste deepfakes van 2025 waren zó goed dat Europese politici er in trapten tijdens videogesprekken. Iemand belde ze via Zoom en leek sprekend op een andere politicus. Het was allemaal AI. Als zelfs Europese politici in hun werk erin trappen, is het logisch dat jij het ook niet altijd zult zien.",
        sparkMiddle: "Oké. Ik heb je wat bangmakerij laten zien. Maar je hoeft niet paranoïde te worden van alle video's die je bekijkt. Je hebt één simpele regel nodig. Die werkt bijna altijd.",
        theoryDeep: "**De belangrijkste regel: check bij een echte bron**\n\nAls je een video ziet waarvan je denkt 'huh, zou dat echt zijn?', doe één ding. Open je zoekmachine. Typ wat er in de video gebeurt. Kijk of een echte nieuwssite het óók meldt. NOS, NU.nl, RTL Nieuws. Als grote nieuwssites het níet melden, is het waarschijnlijk nep.\n\nWant denk eens. Als Mr. Beast echt 1000 iPhones zou weggeven, zou dat wereldwijd nieuws zijn. Als een beroemde voetballer iets echt schokkends zou zeggen, staat dat op elke nieuwssite. Niet alleen op een TikTok-account met 12 volgers.\n\nEn twee kleinere tips voor in de video zelf:\nTip 1: let op de ogen. Knippert die persoon raar, of bijna niet? Dat is een tel-teken.\nTip 2: let op hoe lippen bewegen bij woorden. Soms matchen ze niet precies met wat je hoort. Subtiel, maar zichtbaar als je goed kijkt.\n\nMaar de belangrijkste tip blijft: check bij een echte bron. Dat is 90% van het werk.",
        interactive: tap(
          "Bij elke situatie: wat doe je? Kies het beste antwoord.",
          [
              { label: "Een vriend stuurt je een video waarin een populaire YouTuber ineens heel lelijke dingen zegt over een andere YouTuber.", reveal: "• Meteen doorsturen naar de rest van je klas\n✅ Zoek op Google of echte nieuwssites er iets over hebben\n• Er een reactie op zetten\n• Aannemen dat het klopt\n\nCheck bij een echte bron. Als grote YouTubers drama hebben, staat het binnen een dag op nieuwssites en grote kanalen." },
              { label: "Op TikTok staat een video waarin je favoriete voetballer iets raars zegt over zijn team. Je bent even in shock.", reveal: "• Geloof het en word boos\n• Deel direct met teamgenoten\n✅ Check NOS en Voetbal International, als het echt is staat het daar\n• Negeer het\n\nEchte voetbal-schandalen staan binnen uren op officiële nieuwssites. Als alleen TikTok het heeft, is het zeer waarschijnlijk nep." },
              { label: "Iemand stuurt een filmpje van je eigen meester waarin hij iets onaardigs zou zeggen over een leerling.", reveal: "• Meteen delen in de klas-appgroep\n✅ Niet delen, eerst je meester of een ouder vragen\n• Woorden gaan halen met je meester\n• Op social media posten\n\nNooit doorsturen zonder check. Een deepfake over een echte meester kan iemands leven verpesten. Eerst bij de persoon zelf." },
          ],
        ),
        summary: [
          "Deepfakes zijn video's of audio waar AI iemand anders' gezicht of stem heeft gebruikt. Worden iedere maand beter.",
          "Belangrijkste reflex: check bij een echte nieuwssite. Als het nergens anders staat, is het waarschijnlijk nep.",
          "Nooit doorsturen voor checken. Zeker niet van mensen die je kent.",
        ],
        quiz: [
          {
            question: "Je ziet een schokkende video van een bekende voetballer. Wat doe je?",
            options: [
              "Meteen delen met je vrienden",
              "Geloven en boos worden",
              "Check bij een echte nieuwssite of het klopt",
              "Er een reactie onder zetten",
            ],
            correctIndex: 2,
            why: "Altijd checken bij een betrouwbare bron voordat je iets gelooft of deelt.",
          },
          {
            question: "Als een video iets groots laat zien en het staat niet op NOS of andere nieuwssites, is het heel waarschijnlijk nep.",
            options: [
              "Waar",
              "Niet waar",
            ],
            correctIndex: 0,
            why: "Klopt. Echt groot nieuws haalt binnen uren de grote nieuwssites. Niet alleen TikTok.",
          },
          {
            question: "Wat zijn tekenen van een mogelijke deepfake?",
            options: [
              "Vreemd oogknipperen",
              "Goede lichtkwaliteit",
              "Lippen die niet synchroon lopen",
              "Een stem die raar vlak klinkt",
              "Een heldere hemel",
            ],
            correctIndex: 0,
            why: "Ogen, lipsync en een vlakke stem zijn drie klassieke tell-tekens. (Juist: Vreemd oogknipperen, Lippen die niet synchroon lopen, Een stem die raar vlak klinkt.)",
          },
        ],
        reflection: "Je bent nu officieel een deepfake-detective. Petje af.",
      },
      // ---------- Les 1.5 ----------
      {
        id: "1.5",
        worldId: 1,
        pillar: "safe",
        title: "Nep-berichten herkennen",
        emoji: "⚠️",
        sparkIntro: "Kleine situatie. Je krijgt een appje van een onbekend nummer. Er staat: 'Hoi, ik ben de nieuwe trainer van je voetbalclub. We hebben een probleem met je inschrijving. Kun je je adres en geboortedatum even sturen? Snel graag, anders kun je zondag niet spelen.' Zou je het doen? Dit soort berichten bestaan nu echt. En ze zijn slimmer geworden. Daarom deze les.",
        theoryIntro: "**Oplichters gebruiken AI om betere berichten te sturen**\n\nVroeger waren oplichters-berichten makkelijk te herkennen. Slecht Nederlands. Vreemde zinnen. 'Grote prijs voor u, klik onmiddellijk!' Kon je meteen zien.\n\nNu niet meer. AI schrijft voor ze. Perfect Nederlands. Ze weten hoe een trainer zou schrijven, hoe een leraar, hoe een ouder van een vriendje. Ze kunnen zelfs dingen weten die publiek staan, zoals de naam van je school of voetbalclub. Dat maakt ze geloofwaardiger.\n\nMaar, en dit is goed nieuws: de structuur van zo'n nep-bericht is altijd hetzelfde. Ze willen iets van je, en snel. En die structuur ga je herkennen.",
        fact: "In Nederland worden er elke week duizenden nep-berichten verstuurd. Niet aan volwassenen alleen. Ook aan kinderen. De politie noemt het 'social engineering'. Mooie term voor 'mensen slim voor de gek houden'. Het werkt omdat mensen in haast of emotie soms hun voorzichtigheid vergeten. Niet omdat ze dom zijn. Omdat ze mens zijn.",
        sparkMiddle: "Oké, nu het mooie. Ik ga je drie signalen geven. Als je er TWEE of meer tegelijk ziet, is het bijna altijd nep. Je hoeft ze niet uit je hoofd te leren, je gaat ze vanzelf herkennen.",
        theoryDeep: "**De drie signalen**\n\nSignaal 1: HAAST. 'Snel graag!' 'Doe het NU!' 'Binnen 10 minuten!' Echte mensen geven je tijd. Nep-berichten pushen tijd. Want ze weten: als jij even nadenkt, trap je er niet in. Dus ze zorgen dat je geen tijd krijgt om na te denken.\n\nSignaal 2: STERKE EMOTIE. 'Je moeder heeft een ongeluk gehad!' 'Je wordt van het team gezet als je niet reageert!' 'Je hebt een iPhone gewonnen!!!' Schrik, paniek, blijdschap. Grote gevoelens zorgen dat je voelt in plaats van denkt. Dat is precies wat ze willen.\n\nSignaal 3: VRAAG OM INFO OF GELD OF KLIK. 'Stuur me je adres.' 'Deel een wachtwoord.' 'Klik op deze link.' 'Maak geld over.' Dit is waar ze heen willen. Het hele bericht is er alleen om jou hier te krijgen.\n\nAls je er twee of meer van deze signalen ziet: stop. Doe niks. Haal een volwassene. Altijd. Bij twijfel, altijd volwassene.\n\nEn dan nog iets belangrijks. Het voelt soms alsof je overreageert als je niet meteen reageert. Alsof je de trainer teleurstelt. Alsof je iets stuks doet. Dat is precies wat de oplichter wil. Een echte trainer die een fout maakte in je inschrijving, neemt zelf contact op via een kanaal dat je kent. Via de club-app. Via je ouders. Niet via een onbekend nummer dat haast heeft.",
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
            options: [
              "Waar",
              "Niet waar",
            ],
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
        sparkIntro: "Vier letters die je de rest van je leven helpen. STOP. Onthoud dit woord. Ik ga je uitleggen waar elke letter voor staat, en na deze les zit het voor altijd in je hoofd. Serieus, ook over 10 jaar weet je het nog.",
        theoryIntro: "**STOP. Vier letters, vier geheimen.**\n\nJe hebt al geleerd dat je voorzichtig bent met wat je aan AI vertelt. Tijd om het makkelijk te maken. Vier letters, vier categorieën die ALTIJD geheim blijven.\n\nS = STRAAT. Je thuisadres. Je straat plus huisnummer. Plus postcode. Nooit aan AI. Nooit aan websites die je ouders niet kennen. Nooit aan onbekenden online.\n\nT = TELEFOON. Je telefoonnummer. Dat van je ouders. Dat van je broer of zus. Dat van oma. Telefoonnummers zijn als sleutels. Oplichters kunnen ermee bellen, appen, en proberen mensen voor de gek te houden.\n\nO = OUDER-INFO. Waar je ouders werken, hun wachtwoorden, hun bankpasgegevens, hun creditcard. Maar ook: hun volledige naam plus hun werkgever. Die combinatie maakt ze vindbaar.\n\nP = PASJES. Bankpas-nummers. Creditcard-nummers. Zorgverzekering-nummers. Paspoort. BSN. Dit zijn de belangrijkste stukjes papier in het leven van volwassenen. Nooit in een AI-chat. Nooit op onbekende websites.",
        fact: "Als je je naam, adres en geboortedatum openbaar hebt staan op internet, heeft een oplichter genoeg om veel schade aan te richten. Identiteitsfraude heet dat. Iemand anders doet alsof hij jou is. Kan producten bestellen op jouw naam, leningen afsluiten. Nederland heeft 100.000 gevallen per jaar. Als een 10-jarige zijn STOP-lijst beter bewaart dan veel volwassenen, bespaart dat later heel veel gedoe.",
        sparkMiddle: "STOP zit in je hoofd. Goed. Nu iets wat vaker voorkomt dan je denkt: de valstrik van 'onschuldig'. Want soms vraag AI iets wat klinkt als onschuldig, maar het is opeens te veel.",
        theoryDeep: "**De valstrik van 'onschuldig'**\n\nEén stukje informatie is meestal prima. Je voornaam? Oké. Alleen je stad? Ook meestal oké.\n\nMaar combinaties zijn gevaarlijk. Voornaam + school + buurt = plots vindbaar. Voornaam + leeftijd + sport + club = hetzelfde.\n\nDit is waar veel mensen de mist in gaan. Ze denken 'ik zeg alleen mijn voornaam, dus het is veilig'. Maar in hetzelfde gesprek vertellen ze ook per ongeluk hun school, en dan een tip over hun buurt. Drie 'onschuldige' dingen samen = niet onschuldig meer.\n\nDus vanaf nu: niet alleen naar één stukje kijken, maar ook naar wat je al eerder hebt gezegd in hetzelfde gesprek. Stapelt het op? Trek op tijd de stekker eruit.",
        interactive: sort(
          "Sleep elk item naar 'STOP (geheim)' of 'Mag' — of naar 'Ligt eraan'.",
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
            options: [
              "Tekenen",
              "Telefoon",
              "Thuis",
              "Tenen",
            ],
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
            options: [
              "Waar",
              "Niet waar",
            ],
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
        sparkIntro: "Kleine bekentenis. Ik vraag ook nog vaak hulp aan de mensen die mij gemaakt hebben. Ik snap niet alles. En dat is oké. Eerlijk gezegd zijn de slimste mensen juist mensen die vragen om hulp als ze iets niet weten. Vandaag leer je WANNEER je dat doet met AI.",
        theoryIntro: "**Slimme mensen vragen hulp. Niet de domme.**\n\nEr is een rare regel op veel plekken. Mensen doen alsof je sterk en slim bent als je alles zelf oplost. Alsof hulp vragen zwak is. Dat is gewoon fout.\n\nDokters vragen collega-dokters. Advocaten overleggen. Programmeurs stellen vragen op forums. Elke profi die goed is in zijn werk, vraagt vaak hulp. Omdat ze weten dat je er samen verder komt.\n\nBij AI geldt hetzelfde. Sommige dingen moet je niet alleen oplossen. Vijf situaties waar je ALTIJD een volwassene haalt. Niet soms. Altijd.",
        fact: "Topsporters hebben elk hun eigen coach. Een coach die vaak minder goed is in de sport zelf dan de sporter. Maar die coach helpt wel met beslissingen, vragen en twijfel. Kinderen met goede volwassenen om zich heen zijn als topsporters met goede coaches. Niet omdat je het niet zelf kan, maar omdat je er beter van wordt.",
        sparkMiddle: "Daar komen ze. De vijf momenten. Lees ze even echt. Niet scrollen. Ze helpen je een keer echt als het ertoe doet.",
        theoryDeep: "**De vijf 'haal een volwassene'-momenten**\n\nMoment 1: AI zegt iets engs, gemeens of onaangenaams. Scherm dicht. Volwassene halen. Je hoeft dat niet alleen te verwerken. Het is niet jouw schuld dat AI iets stoms zei.\n\nMoment 2: AI (of een website die AI gebruikt) vraagt om betaling. Een creditcard-nummer. Een bankpas. Je ouders hun portemonnee. Stop. Volwassene. Altijd. Ook als er staat 'gratis proefperiode'.\n\nMoment 3: Je moet een account aanmaken bij een AI die je niet kent. Dus niet bij een AI die je ouders of school al gebruiken, maar een nieuwe die je ergens tegenkomt. Volwassene erbij, zij helpen je checken of het veilig is.\n\nMoment 4: Er gebeurt iets op je scherm wat raar voelt. Plotseling een pop-up. Een scherm dat niet weg wil. Een bericht dat 'je telefoon is besmet'. Bijna altijd is dit nep en is het probeert geld of info van je te krijgen. Volwassene.\n\nMoment 5: AI wil iets installeren of downloaden. 'Klik hier om de beste ervaring te krijgen.' Stop. Niet klikken. Eerst vragen.\n\nBelangrijk: je mag ook 'voor de zekerheid' een volwassene halen als je twijfelt. Over-voorzichtig is prima. Niemand wordt boos als je extra voorzichtig bent. Meestal zijn volwassenen juist blij dat je het vraagt.",
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
            options: [
              "Waar",
              "Niet waar",
            ],
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
        sparkIntro: "Oké. Dit is je moment. Zeven lessen gedaan. Je bent iemand anders geworden dan toen je begon. Ik meen dat. Vandaag geen nieuwe stof. Alleen: laten zien wat je kan. Rustig. Ademhalen. Je weet meer dan je denkt.",
        theoryIntro: "**Wat je deze wereld hebt geleerd**\n\nEven snel terugblikken, als warm-up voor de test. Want je hebt meer in je hoofd zitten dan je zelf beseft.\n\nLes 1: AI is geen magie. Het is een patroon-herkenner die voorspelt op basis van miljoenen voorbeelden. Klinkt zelfverzekerd, ook als het gokt.\n\nLes 2: Wat je aan AI typt blijft niet tussen jullie. Gebruik de wachtkamer-test. Zou je dit hardop zeggen tegen 20 vreemden?\n\nLes 3: AI-plaatjes zijn overal. Check handen, tekst en 'te perfect'. Bonuscheck: als het te gek is om waar te zijn, is het vaak AI.\n\nLes 4: Deepfakes zijn nep-video's en nep-stemmen. Regel nummer één: check bij een echte nieuwssite voor je iets gelooft of deelt.",
        fact: "Gemiddeld vergeet iemand 50% van nieuwe kennis binnen 24 uur. Maar als je die kennis één keer actief TOEPAST, bijvoorbeeld in een quiz, onthoud je het weken langer. Daarom doen we tests. Niet om je te kwellen. Om het in je hoofd te slaan.",
        sparkMiddle: "Nog drie lessen om even terug te zien, en dan is het test-tijd. Ik ga je niet toch nog snel iets nieuws leren. Ik wil dat je weet: alles wat in de test komt, heb je al gehad.",
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
          "Volgende stop: wereld 2 SLIM. Daar gaat het niet meer alleen om veilig zijn, maar om AI echt laten werken voor jou.",
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
            options: [
              "Twijfel-test",
              "Wachtkamer-test",
              "Slaap-test",
              "Regen-test",
            ],
            correctIndex: 1,
            why: "Les 2",
          },
          {
            question: "Welk is meestal de beste eerste check op een AI-plaatje?",
            options: [
              "Schoenen",
              "Handen en vingers",
              "Hemel",
              "Bomen",
            ],
            correctIndex: 1,
            why: "Les 3",
          },
          {
            question: "Je ziet een schokkende video van een bekende persoon. Wat doe je eerst?",
            options: [
              "Delen",
              "Er op reageren",
              "Check bij een echte nieuwssite",
              "Aannemen dat het klopt",
            ],
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
            options: [
              "Waar",
              "Niet waar",
            ],
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
