import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export const Terms = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <article className="container py-12 max-w-3xl">
      <h1 className="font-display text-4xl mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      <p>By using AI met Spark you agree to use the app for personal, non-commercial purposes. Student access is free, and school use may require a separate agreement for classroom rollout and support.</p>
      <h2 className="font-display text-2xl mt-8 mb-3">Refunds</h2>
      <p>If you are discussing a school rollout or paid support arrangement, refund terms will be shared in writing before anything starts.</p>
      <h2 className="font-display text-2xl mt-8 mb-3">Account use</h2>
      <p>Accounts are for one child. Sharing accounts is not permitted. Schools must use a school account.</p>
    </article>
    <Footer />
  </div>
);
export default Terms;
