import { loadStripe, type Stripe } from "@stripe/stripe-js";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
export const stripeEnvironment: "sandbox" | "live" =
  clientToken?.startsWith("pk_live_") ? "live" : "sandbox";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!clientToken) throw new Error("VITE_PAYMENTS_CLIENT_TOKEN missing");
    stripePromise = loadStripe(clientToken);
  }
  return stripePromise;
}

export const SMART_KIDS_PRICE_ID = "smart_kids_lifetime_eur";
