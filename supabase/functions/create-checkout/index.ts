import { createClient } from "npm:@supabase/supabase-js@2.49.8";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod@3.24.1";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CheckoutBodySchema = z.object({
  priceId: z.string().min(1).max(120).regex(/^[a-zA-Z0-9_-]+$/),
  customerEmail: z.string().email().max(255).optional(),
  returnUrl: z.string().url().max(500).optional(),
});

const getStripeEnvironment = (): StripeEnv => {
  const raw = Deno.env.get("STRIPE_ENV")?.toLowerCase();
  return raw === "live" ? "live" : "sandbox";
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    const user = userData?.user;

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = CheckoutBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message ?? "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { priceId, customerEmail, returnUrl } = parsed.data;
    const env = getStripeEnvironment();
    const stripe = createStripeClient(env);

    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!prices.data.length) {
      return new Response(JSON.stringify({ error: "Price not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeOrigin = req.headers.get("origin") ?? new URL(req.url).origin;
    const safeReturnUrl = returnUrl?.startsWith(safeOrigin)
      ? returnUrl
      : `${safeOrigin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`;

    const stripePrice = prices.data[0];
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded",
      return_url: safeReturnUrl,
      customer_email: customerEmail ?? user.email ?? undefined,
      metadata: { userId: user.id, environment: env },
      payment_intent_data: { metadata: { userId: user.id, environment: env } },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(JSON.stringify({ error: "Unable to start checkout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
