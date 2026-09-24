import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Privacy = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <SiteHeader />
    <article className="container max-w-3xl py-12">
      <h1 className="mb-2 text-5xl">Privacy</h1>
      <p className="mb-8 text-muted-foreground">Laatst bijgewerkt: 24 september 2026</p>

      <div className="space-y-8 text-[17px] leading-relaxed">
        <p>
          AI met Spark is gemaakt voor kinderen van 9 tot 12 jaar. We verzamelen zo min mogelijk: alleen wat nodig is om een
          account te laten werken en de voortgang te bewaren.
        </p>

        <section>
          <h2 className="mb-3 text-2xl">Wat we bewaren</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Een gebruikersnaam en wachtwoord om in te loggen (kinderen hebben geen e-mailadres nodig)</li>
            <li>Voornaam en leeftijd van het kind</li>
            <li>Bij een account thuis: het e-mailadres van de ouder en het moment waarop die toestemming gaf</li>
            <li>Bij een account met klassencode: in welke klas het kind zit</li>
            <li>Voortgang: gehaalde missies, sterren, XP en de score van de eindtoets</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Toestemming</h2>
          <p>
            Kinderen onder de 16 hebben toestemming van een ouder of verzorger nodig. Maakt een kind thuis een account, dan vult een
            ouder zijn of haar e-mailadres in en geeft toestemming. Doet een kind mee via een klassencode, dan regelt de school de
            toestemming, zoals ze dat ook voor andere leermiddelen doet.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Wat we nooit doen</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Kinderen volgen of tracken, of advertenties tonen</li>
            <li>Data verkopen of gebruiken om AI te trainen</li>
            <li>Kinderen laten chatten met een echte AI: alle teksten zijn vooraf geschreven</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Leerkrachten en klassen</h2>
          <p>
            Een leerkracht ziet alleen de leerlingen die met zijn of haar klassencode meedoen: voornaam, gebruikersnaam en voortgang.
            Nooit kinderen uit andere klassen. Een leerkracht kan een nieuw wachtwoord instellen voor een leerling in de eigen klas, of
            een leerling uit de klas halen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Je gegevens verwijderen</h2>
          <p>
            In de accountinstellingen kun je alle voortgang wissen of het hele account verwijderen. Dan wissen we alles direct en
            definitief. Lukt dat niet?{" "}
            <Link to="/contact" className="font-medium text-primary underline underline-offset-4">
              Neem contact met ons op
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
    <Footer />
  </div>
);

export default Privacy;
