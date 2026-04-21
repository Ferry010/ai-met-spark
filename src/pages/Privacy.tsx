import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <article className="container py-12 max-w-3xl prose prose-slate">
      <h1 className="font-display text-4xl mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      <p>AI met Spark is built for children. We collect the absolute minimum data needed to run the service: a child's first name, age, parent email, and lesson progress.</p>
      <h2 className="font-display text-2xl mt-8 mb-3">What we collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>First name (no last name)</li>
        <li>Age</li>
        <li>Parent email (for certificate delivery)</li>
        <li>Lesson progress and quiz scores</li>
      </ul>
      <h2 className="font-display text-2xl mt-8 mb-3">What we never do</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Sell data to third parties</li>
        <li>Use child data to train AI models</li>
        <li>Show ads</li>
        <li>Allow free-text chat with AI</li>
      </ul>
      <h2 className="font-display text-2xl mt-8 mb-3">Your rights</h2>
      <p>You can request deletion of all data at any time from the account settings page or by emailing us.</p>
    </article>
    <Footer />
  </div>
);
export default Privacy;
