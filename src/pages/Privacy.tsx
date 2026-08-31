import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <article className="container py-12 max-w-3xl prose prose-slate">
      <h1 className="font-display text-4xl mb-6">Privacy</h1>
      <p className="text-muted-foreground mb-4">Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}</p>

      <p>
        AI met Spark is gemaakt voor kinderen. Daarom houden we het zo simpel en veilig mogelijk:
        <strong> je hebt geen account nodig en we verzamelen geen persoonlijke gegevens.</strong>
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Wat we bewaren</h2>
      <p>
        De voortgang van je kind — welke lessen af zijn, sterren, punten en de streak — wordt
        <strong> alleen in de browser van dit apparaat bewaard</strong> (via <em>localStorage</em>).
        Die informatie blijft op het apparaat en wordt nooit naar ons of naar iemand anders verstuurd.
      </p>
      <p>
        Vul je kind een naam in voor op het diploma? Ook die naam blijft alleen in de browser en wordt
        alleen gebruikt om het diploma te maken.
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Wat we nooit doen</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Een account of inlog vragen</li>
        <li>Persoonlijke gegevens opslaan op een server</li>
        <li>Kinderen volgen of tracken</li>
        <li>Advertenties tonen</li>
        <li>Data verkopen of gebruiken om AI te trainen</li>
        <li>Vrij chatten met een AI toestaan</li>
      </ul>

      <h2 className="font-display text-2xl mt-8 mb-3">Voortgang wissen</h2>
      <p>
        Alles staat op het apparaat, dus jij hebt de controle. Kies <strong>"Opnieuw beginnen"</strong> in
        het menu, of wis de browsergegevens van je kind. Daarmee is de voortgang weg. Wij hebben niets
        om te verwijderen, want wij bewaren niets.
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Scholen</h2>
      <p>
        Werkt een school met een eigen leerkrachten-omgeving? Dan gelden aparte afspraken die we
        rechtstreeks met de school maken. Neem daarvoor contact met ons op.
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Vragen?</h2>
      <p>Mail ons gerust — we leggen graag uit hoe het werkt.</p>
    </article>
    <Footer />
  </div>
);
export default Privacy;
