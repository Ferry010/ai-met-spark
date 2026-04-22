import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "@fontsource/caveat/700.css";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, ChevronLeft, Star } from "lucide-react";

const GOLD = "#D4AF37";
const GOLD_RGB: [number, number, number] = [212, 175, 55];
const INDIGO_RGB: [number, number, number] = [29, 27, 71];
const INDIGO_LIGHT_RGB: [number, number, number] = [60, 47, 132];

export const Certificate = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [score, setScore] = useState<number | null>(null);
  const [issued, setIssued] = useState<string | null>(null);
  const generatingRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("final_test_attempts").select("score").eq("user_id", user.id).eq("passed", true).order("attempted_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("certificates").select("*").eq("user_id", user.id).maybeSingle(),
    ]).then(([{ data: attempt }, { data: cert }]) => {
      if (attempt) setScore(attempt.score);
      if (cert) setIssued(cert.issued_at);
      else if (attempt && user && profile) {
        supabase.rpc("create_or_refresh_certificate").then(({ data, error }) => {
          if (!error && data) {
            setIssued(data.issued_at);
            setScore(data.score);
          }
        });
      }
    });
  }, [user, profile]);

  const buildPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background — indigo gradient (faked with two layers)
    doc.setFillColor(...INDIGO_RGB);
    doc.rect(0, 0, w, h, "F");
    doc.setFillColor(...INDIGO_LIGHT_RGB);
    doc.rect(0, 0, w, h * 0.55, "F");

    // Decorative gold border (double line)
    doc.setDrawColor(...GOLD_RGB);
    doc.setLineWidth(4);
    doc.roundedRect(28, 28, w - 56, h - 56, 14, 14);
    doc.setLineWidth(1);
    doc.roundedRect(40, 40, w - 80, h - 80, 10, 10);

    // Corner ornaments
    const corner = (cx: number, cy: number, sx: number, sy: number) => {
      doc.setLineWidth(1.2);
      doc.line(cx, cy, cx + 22 * sx, cy);
      doc.line(cx, cy, cx, cy + 22 * sy);
      doc.circle(cx + 4 * sx, cy + 4 * sy, 2, "S");
    };
    corner(48, 48, 1, 1);
    corner(w - 48, 48, -1, 1);
    corner(48, h - 48, 1, -1);
    corner(w - 48, h - 48, -1, -1);

    // Title block
    doc.setTextColor(...GOLD_RGB);
    doc.setFont("times", "bold");
    doc.setFontSize(54);
    doc.text("DIPLOMA", w / 2, 110, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setCharSpace(6);
    doc.text("AI SMART KID", w / 2, 138, { align: "center" });
    doc.setCharSpace(0);

    // Decorative star line
    doc.setDrawColor(...GOLD_RGB);
    doc.setLineWidth(0.8);
    doc.line(w / 2 - 80, 152, w / 2 - 14, 152);
    doc.line(w / 2 + 14, 152, w / 2 + 80, 152);
    doc.setFontSize(16);
    doc.text("★", w / 2, 156, { align: "center" });

    // "Hierbij verklaren wij"
    doc.setFontSize(13);
    doc.setTextColor(230, 224, 200);
    doc.text("Hierbij verklaren wij dat", w / 2, 195, { align: "center" });

    // Name (script-feel via large oblique). jsPDF only ships standard fonts.
    doc.setFont("times", "italic");
    doc.setFontSize(60);
    doc.setTextColor(...GOLD_RGB);
    doc.text(profile?.first_name ?? "Smart Kid", w / 2, 260, { align: "center" });

    // Underline under name
    doc.setLineWidth(0.6);
    const nameW = Math.min(360, doc.getTextWidth(profile?.first_name ?? "Smart Kid") + 40);
    doc.line(w / 2 - nameW / 2, 274, w / 2 + nameW / 2, 274);

    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(245, 240, 220);
    doc.text("heeft alle 24 lessen en de eindbaas-test gehaald", w / 2, 305, { align: "center" });
    doc.text("en is officieel een AI Smart Kid.", w / 2, 322, { align: "center" });

    // Three world badges
    const badgeY = 388;
    const badges: { emoji: string; name: string; sub: string }[] = [
      { emoji: "🛡️", name: "Schild van", sub: "Waakzaamheid" },
      { emoji: "🧭", name: "Kompas van", sub: "Helderheid" },
      { emoji: "⭐", name: "Ster van", sub: "Meesterschap" },
    ];
    const gap = 180;
    badges.forEach((b, i) => {
      const cx = w / 2 - gap + i * gap;
      doc.setDrawColor(...GOLD_RGB);
      doc.setLineWidth(1.2);
      doc.circle(cx, badgeY, 28, "S");
      doc.setFontSize(28);
      doc.text(b.emoji, cx, badgeY + 9, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(...GOLD_RGB);
      doc.text(b.name, cx, badgeY + 50, { align: "center" });
      doc.text(b.sub, cx, badgeY + 64, { align: "center" });
    });

    // Footer info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(220, 214, 190);
    const date = new Date(issued ?? Date.now()).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });
    doc.text(`Score: ${score ?? "·"} / 12`, w / 2 - 120, h - 70, { align: "center" });
    doc.text(`Uitgegeven: ${date}`, w / 2 + 120, h - 70, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(13);
    doc.setTextColor(...GOLD_RGB);
    doc.text("AI met Spark", w / 2, h - 50, { align: "center" });

    return doc;
  };

  const downloadPdf = async () => {
    if (generatingRef.current || !user) return;
    generatingRef.current = true;
    try {
      const doc = buildPdf();
      doc.save(`AI-Smart-Kid-${profile?.first_name ?? "diploma"}.pdf`);
      const blob = doc.output("blob");
      const path = `${user.id}/diploma.pdf`;
      const { error } = await supabase.storage.from("certificates").upload(path, blob, {
        upsert: true,
        contentType: "application/pdf",
      });
      if (!error) {
        const { data } = await supabase.rpc("attach_certificate_pdf", { _path: path });
        if (data) {
          setIssued(data.issued_at);
          setScore(data.score);
        }
      }
      toast({ title: "Gedownload!", description: "Opgeslagen op je apparaat en in je account." });
    } finally {
      generatingRef.current = false;
    }
  };

  const date = new Date(issued ?? Date.now()).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 font-display">
          <ChevronLeft className="h-4 w-4" /> Dashboard
        </Link>

        {/* Diploma — screen version with 3D tilt + gold border */}
        <div className="diploma-tilt-wrap mx-auto" style={{ perspective: "1500px" }}>
          <div
            className="diploma-card relative rounded-3xl p-5 sm:p-8 md:p-12 text-center shadow-pop overflow-hidden transition-transform duration-500"
            style={{
              background:
                "linear-gradient(135deg, hsl(248 60% 14%) 0%, hsl(260 55% 22%) 50%, hsl(248 60% 12%) 100%)",
              border: `2px solid ${GOLD}`,
              boxShadow: `inset 0 0 0 8px hsl(248 60% 10%), inset 0 0 0 9px ${GOLD}55, 0 30px 80px -20px hsla(248,60%,10%,0.6)`,
              color: "#F5EFD8",
            }}
          >
            {/* Glint */}
            <span aria-hidden className="absolute inset-0 pointer-events-none diploma-glint" />

            {/* Top mark */}
            <div className="flex items-center justify-center gap-3 mb-3 text-[var(--diploma-gold)]" style={{ color: GOLD }}>
              <span className="h-px w-10 sm:w-16 bg-[currentColor] opacity-60" />
              <Star className="h-5 w-5 fill-current" />
              <span className="h-px w-10 sm:w-16 bg-[currentColor] opacity-60" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide" style={{ color: GOLD, fontFamily: "'Times New Roman', serif", letterSpacing: "0.1em" }}>
              DIPLOMA
            </h1>
            <p className="mt-1 text-[10px] sm:text-xs md:text-sm tracking-[0.4em] opacity-80">AI · SMART · KID</p>

            <p className="mt-6 sm:mt-8 text-sm opacity-80">Hierbij verklaren wij dat</p>

            <div
              className="mt-3 mx-auto w-fit px-4 sm:px-6 py-2 max-w-full"
              style={{
                fontFamily: "'Caveat', 'Brush Script MT', cursive",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 12vw, 5rem)",
                lineHeight: 1,
                color: GOLD,
                borderBottom: `1px solid ${GOLD}66`,
              }}
            >
              {profile?.first_name ?? "Smart Kid"}
            </div>

            <p className="mt-5 sm:mt-6 max-w-md mx-auto leading-snug text-sm sm:text-base">
              heeft alle <strong>24 lessen</strong> en de <strong>eindbaas-test</strong> gehaald
              en is officieel een <em>AI Smart Kid</em>.
            </p>

            {/* 3 world badges */}
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
              {[
                { emoji: "🛡️", name: "Schild van Waakzaamheid" },
                { emoji: "🧭", name: "Kompas van Helderheid" },
                { emoji: "⭐", name: "Ster van Meesterschap" },
              ].map((b) => (
                <div
                  key={b.name}
                  className="rounded-2xl px-2 py-3 sm:px-3 sm:py-4 text-center"
                  style={{ border: `1px solid ${GOLD}55`, background: "rgba(255,255,255,0.04)" }}
                >
                  <div className="text-2xl sm:text-3xl">{b.emoji}</div>
                  <div className="text-[10px] sm:text-[11px] mt-1 leading-tight" style={{ color: GOLD }}>{b.name}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4 text-xs sm:text-sm opacity-80 max-w-md mx-auto">
              <div>Score: <strong>{score ?? "·"} / 12</strong></div>
              <div>Uitgegeven: <strong>{date}</strong></div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={downloadPdf} className="h-14 px-8 rounded-full font-display bg-primary shadow-pop gap-2">
            <Download className="h-5 w-5" /> Download PDF
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">Laat het aan je ouder of leerkracht zien 🎉</p>
        </div>
      </main>

      <style>{`
        @keyframes diploma-glint {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(120%); }
        }
        .diploma-glint {
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
          animation: diploma-glint 4s ease-in-out infinite;
        }
        @media (hover: hover) and (pointer: fine) {
          .diploma-card:hover { transform: rotateY(-2deg) rotateX(2deg); }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
