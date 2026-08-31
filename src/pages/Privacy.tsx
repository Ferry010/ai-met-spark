import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <article className="container py-12 max-w-3xl prose prose-slate">
      <h1 className="font-display text-4xl mb-6">Privacy</h1>
      <p className="text-muted-foreground mb-4">Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}</p>

      <p>
        AI met Spark is gemaakt voor kinderen. We verzamelen zo min mogelijk: alleen wat nodig is om
        een account te laten werken en de voortgang te bewaren.
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Wat we bewaren</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Voornaam van het kind (geen achternaam)</li>
        <li>Leeftijd</li>
        <li>E-mail van de ouder (voor het diploma en accountherstel)</li>
        <li>Een inlog-e-mail en wachtwoord voor het account</li>
        <li>Lesvoortgang, sterren en quizscores</li>
      </ul>

      <h2 className="font-display text-2xl mt-8 mb-3">Wat we nooit doen</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Kinderen volgen of tracken</li>
        <li>Advertenties tonen</li>
        <li>Data verkopen of gebruiken om AI te trainen</li>
        <li>Vrij chatten met een AI toestaan</li>
      </ul>

      <h2 className="font-display text-2xl mt-8 mb-3">Leerkrachten en klassen</h2>
      <p>
        Sluit een kind zich met een klassencode aan bij een klas? Dan kan alleen de eigen leerkracht van
        die klas de voortgang van dat kind zien — niemand anders. Een leerkracht ziet nooit kinderen uit
        andere klassen.
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Je gegevens verwijderen</h2>
      <p>
        Je kunt op elk moment vragen om het account en alle gegevens te verwijderen, via de
        accountinstellingen of door ons te mailen. We wissen het dan volledig, geen vragen gesteld.
      </p>

      <h2 className="font-display text-2xl mt-8 mb-3">Vragen?</h2>
      <p>Mail ons gerust — we leggen graag uit hoe het werkt.</p>
    </article>
    <Footer />
  </div>
);
export default Privacy;
