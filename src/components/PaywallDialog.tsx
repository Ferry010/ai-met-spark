import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spark } from "./Spark";
import { supabase } from "@/integrations/supabase/client";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, stripeEnvironment, SMART_KIDS_PRICE_ID } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Lock } from "lucide-react";

interface PaywallProps {
  open: boolean;
  onClose: () => void;
}

export const PaywallDialog = ({ open, onClose }: PaywallProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchClientSecret = async () => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId: SMART_KIDS_PRICE_ID,
        customerEmail: profile?.parent_email || user?.email,
        userId: user?.id,
        environment: stripeEnvironment,
        returnUrl: `${window.location.origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if (error || !data?.clientSecret) throw new Error(error?.message || "Checkout failed");
    return data.clientSecret as string;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Speel alle 12 lessen vrij
          </DialogTitle>
        </DialogHeader>

        {!showCheckout ? (
          <div className="text-center py-4">
            <Spark size={120} mood="happy" />
            <div className="mt-4 mb-2 inline-block rounded-2xl bg-gradient-sunshine px-6 py-3">
              <span className="font-display text-4xl text-secondary-foreground">€14</span>
              <span className="font-display text-secondary-foreground/80 ml-2">eenmalig</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Voor altijd toegang tot alle 3 werelden, de eindtoets en een persoonlijk diploma dat naar de ouder gemaild wordt.
            </p>
            <Button
              onClick={() => {
                if (!user) {
                  onClose();
                  navigate("/auth?mode=signup");
                  return;
                }
                setShowCheckout(true);
              }}
              className="h-14 px-8 rounded-full font-display text-base bg-primary shadow-pop"
            >
              🚀 Nu vrijspelen
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">14 dagen niet-goed-geld-terug · Geen abonnementen</p>
          </div>
        ) : (
          <div className="min-h-[400px]" id="checkout">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaywallDialog;
