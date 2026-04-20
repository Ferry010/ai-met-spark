const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

export const PaymentTestModeBanner = () => {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return (
    <div className="w-full bg-secondary/40 border-b border-secondary/60 px-4 py-1.5 text-center text-xs font-semibold text-secondary-foreground">
      🧪 Testmodus. Betalingen zijn hier geen echt geld.
    </div>
  );
};

export default PaymentTestModeBanner;
