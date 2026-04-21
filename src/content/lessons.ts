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
        sparkIntro: "Hoi! Leuk dat je er bent. Ik ga je iets vets laten zien. Denk eens aan de laatste keer dat TikTok precies dat ene filmpje liet zien dat je eigenlijk wilde zien. Bijna alsof TikTok kon raden wat je leuk vond. Dat is AI aan het werk. En ik ga het je vandaag helemaal uitleggen. Geen moeilijke woorden. Gewoon samen uitzoeken wat dat ding nou doet.",
        theoryIntro: "**AI is geen magie. Ook geen robot met gevoelens.**\n\nAI betekent Artificial Intelligence. In het Nederlands: kunstmatige intelligentie. Maar pas op met dat woord 'intelligentie', want het is een beetje misleidend. AI denkt niet zoals jij nadenkt.\n\nWat AI WEL doet: patronen zoeken in hele, hele, hele veel voorbeelden. Stel je voor, je laat een computer 10 miljoen foto's van katten zien. Na een tijdje zegt de computer 'hé, ik zie iets. Als er spitse oren en snorharen en vachtstreepjes op zitten, is het waarschijnlijk een kat.'\n\nHeeft die computer ooit een kat geaaid? Nee. Heeft ie een lievelingskat? Nee. Weet ie eigenlijk wat 'een kat' is? Ook nee.\n\nHij heeft alleen puntjes verbonden. Net zoals jij patronen ziet in een Minecraft-kaart. Jij weet: oranje blokje plus groene knop betekent redstone-circuit. Niet omdat die blokken 'denken', maar omdat jij het patroon kent.",
        fact: "De eerste keer dat een computer een mens versloeg met schaken was in 1997. De computer heette Deep Blue. Hij kon niet echt spelen zoals een mens. Hij kon alleen miljarden zetten vooruit rekenen en de beste kiezen. Dat is AI in één zin: ongelofelijk goed rekenen, nul begrip.",
        sparkMiddle: "Oké, de basis snap je. Nu komt het leuke deel: als AI zo simpel werkt, waarom lijkt het dan zo slim? Want als je ChatGPT een vraag stelt, komen er best goede antwoorden uit. Hoe kan dat? Laten we kijken.",
        theoryDeep: "**Waarom AI zo slim LIJKT**\n\nOmdat AI niet is getraind met 10 miljoen kattenfoto's, maar met bijna alle teksten op internet. Miljarden zinnen. Alle Wikipedia-artikelen, alle boeken, alle blogs, alle forums. Alles.\n\nAls jij een vraag stelt, gokt AI heel goed wat het beste antwoord is. Gebaseerd op alle zinnen die het ooit heeft gezien. Het KENT de antwoorden niet, het gokt ze op basis van patronen.\n\nSoms klopt het heel goed. Soms zit het ernaast. En dit is belangrijk, onthoud dit even: AI klinkt altijd zelfverzekerd. Ook als het gokt. Ook als het fout zit. Dus jij moet zelf blijven nadenken.\n\nEén ding om even te weten, gewoon zodat je het begrijpt: alle grote AI-bedrijven maken verschillende AI's. ChatGPT is van OpenAI. Claude van Anthropic. Gemini van Google. Allemaal anders getraind. Daarover later meer.",
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
        theoryDeep: "**De wachtkamer-test**\n\nVanaf nu, als je iets aan AI wilt typen, stel jezelf één vraag: zou ik dit ook hardop zeggen in een wachtkamer vol vreemden?\n\nJe voornaam? Ja, dat zou je wel doen. Oké dus.\n\nJe lievelingskleur? Natuurlijk. Prima.\n\nJe thuisadres? Nee, hè. Die roep je niet zomaar door een wachtkamer. Dus ook niet aan AI.\n\nJe wachtwoord? Sowieso niet. Ook niet als je ouders dat nooit expliciet hebben verteld, je weet zelf al dat dat geheim is.\n\nEen foto van jezelf? Dat ligt eraan. Een foto waarop je in je schooluniform staat bij de ingang van je school? Nee. Te veel info bij elkaar.\n\nHet is niet ingewikkeld. Gewoon: 'zou een vreemde dit mogen weten?' Als het antwoord nee is, typ het niet.",
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
        title: "Spot de nep: plaatjes",
        emoji: "🕵️",
        sparkIntro: "Hoi! Ik ga je iets raars vertellen. Een poosje geleden ging er een foto viral van de Paus in een enorme witte pufferjas. Zag er echt badass uit. Maar die foto was nep. Helemaal gemaakt door AI. Miljoenen mensen deelden het zonder te checken. Inclusief volwassenen die het beter hadden moeten weten. Vandaag leer jij iets wat de meeste volwassenen nog niet kunnen. Best wel cool toch?",
        theoryIntro: "**AI-plaatjes zijn overal. En ze worden steeds beter.**\n\nIedereen met een telefoon kan nu een AI-plaatje maken. In 30 seconden. Zonder tekenen te kunnen. Typ 'hond op skateboard in ruimtepak', en bam, plaatje.\n\nDat is leuk, maar ook een probleem. Want niet iedereen zegt erbij 'dit is door AI gemaakt'. Soms doen mensen alsof het echt is. Om aandacht te trekken. Om je belachelijk te maken. Om je iets te laten geloven.\n\nDus de vraag 'is dit echt?' is een vaardigheid geworden. Net zoals lezen en rekenen. En jij gaat het nu leren.",
        fact: "In 2023 dacht iemand op TikTok dat een AI-plaatje van Donald Trump die werd gearresteerd echt was. Het was gemaakt door een journalist als experiment. Hij had er netjes bij gezet 'dit is AI'. Mensen lazen het bijschrift niet. Binnen een dag hadden miljoenen mensen het gedeeld als 'nieuws'. Fake news is niet alleen tekst. Het is ook beeld. En het groeit.",
        sparkMiddle: "Ga je 100% van de AI-plaatjes spotten? Nee. Ik zelf ook niet, eerlijk gezegd. Maar ik ga je samen drie checks geven waarmee je 80% van de nep kunt oppakken. Dat is veel beter dan niks.",
        theoryDeep: "**De drie AI-checks**\n\nCheck 1: Handen en vingers. Dit is nog steeds het grootste zwakke punt van AI. Te veel vingers. Te weinig vingers. Vingers die kronkelen. Een hand die lijkt op een klauw. Altijd even naar de handen kijken.\n\nCheck 2: Tekst. Staat er een bord op de foto? Een letter op een T-shirt? Een naam op een winkel? AI kan niet goed schrijven in plaatjes. Het lijkt vaak op echte tekst, maar als je beter kijkt zijn het krabbels die letters imiteren.\n\nCheck 3: Té perfect. Dit is de lastige. Echte foto's hebben rommel. Een krasje. Haar dat niet helemaal zit. Een schaduw die onlogisch is. AI-plaatjes zijn vaak té glad. Te mooi. Alsof een filter erover is gegaan die alles heeft opgepoetst.\n\nEn een bonuscheck, gratis: als het beeld iets onwaarschijnlijks laat zien (de Paus in pufferjas, een kat die auto rijdt, de meester met twee hoofden), wees voorzichtig. Te gek om waar te zijn? Vaak AI.",
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
          "Drie checks: handen (klassieke fout), tekst (letters die geen echte woorden vormen), té perfect (geen natuurlijke rommel).",
          "Bonuscheck: als het onwaarschijnlijk is (te gek, te mooi, te raar), wees voorzichtig.",
        ],
        quiz: [
          {
            question: "Wat is meestal de beste eerste check op een AI-plaatje?",
            options: ["De achtergrond", "De handen en vingers", "De hemel", "Of er iemand lacht"],
            correctIndex: 1,
            why: "Handen. Nog steeds het grootste zwakke punt van AI.",
          },
          {
            question: "Welke zijn typische tekenen van een AI-plaatje?",
            options: [
              "Rare tekst op borden",
              "Normale schaduwen",
              "6 of meer vingers",
              "Té perfecte huid",
              "Een foto in de regen",
            ],
            correctIndex: 0,
            why: "Rare tekst, extra vingers en té gladde huid zijn klassiekers. (Juist: Rare tekst op borden, 6 of meer vingers, Té perfecte huid.)",
          },
          {
            question: "Als een plaatje er perfect uitziet, is het zeker echt.",
            options: ["Waar", "Niet waar"],
            correctIndex: 1,
            why: "Andersom vaak. Té perfect is een waarschuwing. Echte foto's hebben rommel.",
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
        sparkIntro: "Hoi! Heb je ooit een video gezien van een bekende voetballer die iets raars zegt? Of een YouTube-short waar Mr. Beast ineens gratis iPhones lijkt weg te geven? Grote kans dat het nep was. Deepfakes heet dat. En ze worden iedere maand beter. Ik ga je niet bang maken. Ik ga ons samen voorbereiden.",
        theoryIntro: "**Wat is een deepfake?**\n\nEen deepfake is een video of audio waarin iemand zijn gezicht of stem is vervangen door AI. Je ziet iemand die je kent, maar eigenlijk is die persoon dat niet.\n\nHoe werkt het? AI heeft heel veel filmpjes en foto's van die persoon bekeken. Daarna kan AI een nieuw filmpje maken waarin die persoon dingen doet en zegt die hij eigenlijk nooit heeft gedaan of gezegd. Een beetje zoals poppenspel, maar dan met een ander gezicht op de pop.\n\nSommige deepfakes zijn grappig. Iemand maakt een filmpje waarin Einstein raptekst zingt. Lol. Maar andere deepfakes zijn gemeen of gevaarlijk. Iemand maakt een nep-video waarin een leraar iets raars zegt. Die video gaat rond op school. De leraar krijgt gedoe voor iets wat hij nooit heeft gezegd.\n\nEn het belangrijkste voor jou: als er een video rondgaat van een bekend iemand die iets schokkends zegt, check het eerst voordat je het deelt.",
        fact: "De beste deepfakes van 2025 waren zó goed dat Europese politici er in trapten tijdens videogesprekken. Iemand belde ze via Zoom en leek sprekend op een andere politicus. Het was allemaal AI. Als zelfs Europese politici er in hun werk in trappen, is het logisch dat jij het ook niet altijd ziet. Dat ligt niet aan jou.",
        sparkMiddle: "Oké. Ik heb je wat bangmakerij laten zien. Maar je hoeft niet paranoïde te worden bij elke video die je bekijkt. Je hebt één simpele regel nodig. Die werkt bijna altijd.",
        theoryDeep: "**De belangrijkste regel: check bij een echte bron**\n\nAls je een video ziet waarvan je denkt 'huh, zou dat echt zijn?', doe één ding. Open je zoekmachine. Typ wat er in de video gebeurt. Kijk of een echte nieuwssite het óók meldt. NOS, NU.nl, RTL Nieuws. Als grote nieuwssites het NIET melden, is het waarschijnlijk nep.\n\nWant denk eens. Als Mr. Beast echt 1000 iPhones zou weggeven, zou dat wereldwijd nieuws zijn. Als een beroemde voetballer echt iets schokkends zou zeggen, staat dat op elke nieuwssite. Niet alleen op een TikTok-account met 12 volgers.\n\nEn twee kleinere tips voor in de video zelf:\nTip 1: let op de ogen. Knippert die persoon raar, of bijna niet? Dat is een klein teken.\nTip 2: let op hoe lippen bewegen bij woorden. Soms matchen ze niet precies met wat je hoort. Subtiel, maar zichtbaar als je goed kijkt.\n\nMaar de belangrijkste tip blijft: check bij een echte bron. Dat is 90% van het werk.",
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
          "Nooit doorsturen vóór checken. Zeker niet bij video's over mensen die je kent.",
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
            options: ["Waar", "Niet waar"],
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
            why: "Ogen, lipsync en een vlakke stem zijn drie klassieke teken-signalen. (Juist: Vreemd oogknipperen, Lippen die niet synchroon lopen, Een stem die raar vlak klinkt.)",
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

Voor AI Smart Kids geldt: wij gebruiken alleen AI die veilig is voor jouw leeftijd. Buiten deze app, als je thuis met AI werkt, altijd even checken met je ouders welke AI je gebruikt.`,
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
