import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") || "sandbox") as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Stripe event:", event.type, "env:", env);

    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;
      const userId = session.metadata?.userId;
      const amount = session.amount_total ?? 0;

      // Record payment
      await supabase.from("payments").upsert(
        {
          user_id: userId || null,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent ?? null,
          amount_cents: amount,
          currency: session.currency || "eur",
          status: session.payment_status || "paid",
          env,
        },
        { onConflict: "stripe_session_id" },
      );

      // Mark profile as paid
      if (userId && session.payment_status === "paid") {
        await supabase.from("profiles").update({ paid: true }).eq("id", userId);
        console.log("Marked user as paid:", userId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
