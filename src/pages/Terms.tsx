import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Terms = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <SiteHeader />
    <article className="container max-w-3xl py-12">
      <h1 className="mb-2 text-5xl">Voorwaarden</h1>
      <p className="mb-8 text-muted-foreground">Laatst bijgewerkt: 24 september 2026</p>

      <div className="space-y-8 text-[17px] leading-relaxed">
        <p>
          Fijn dat je AI met Spark gebruikt. Dit zijn de afspraken, in gewone taal. Voor wat we met gegevens doen, lees je de{" "}
          <Link to="/privacy" className="font-medium text-primary underline underline-offset-4">
            privacypagina
          </Link>
          .
        </p>

        <section>
          <h2 className="mb-3 text-2xl">Altijd gratis</h2>
          <p>
            AI met Spark is gratis en blijft gratis, voor kinderen, ouders, leerkrachten en scholen. Er is geen proefperiode, geen
            abonnement, geen betaalde versie en geen reclame. Je hoeft nergens voor te tekenen, ook niet als school.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Je account</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Een account is voor één kind. Deel je account niet met anderen.</li>
            <li>Kinderen onder de 16 hebben toestemming nodig van een ouder of verzorger, of doen mee via hun school.</li>
            <li>Leerkrachten maken een eigen account en zien alleen de leerlingen uit hun eigen klas.</li>
            <li>Je kunt je account altijd zelf verwijderen via Account en klas.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Netjes gebruiken</h2>
          <p>
            Gebruik AI met Spark om te leren, thuis of in de klas. Probeer de website niet te hacken of te verstoren, en kies een
            gebruikersnaam die niet kwetsend is. Accounts die dat niet doen, kunnen we verwijderen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">De lesstof</h2>
          <p>
            We doen ons best om te zorgen dat alles klopt en veilig is. AI verandert snel, dus soms loopt iets achter. Zie je een fout? Laat het ons
            weten, dan passen we het aan. Scholen mogen de missies vrij gebruiken in hun lessen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl">Vragen</h2>
          <p>
            Heb je een vraag over deze voorwaarden?{" "}
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

export default Terms;
