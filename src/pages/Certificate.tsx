import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import jsPDF from "jspdf";
import { Download, ChevronLeft, Shield, Compass, Rocket } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFinalTest } from "@/hooks/useFinalTest";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ALL_MISSIONS } from "@/content/missions";

// Brand colors for the PDF (jsPDF needs RGB).
const INK: [number, number, number] = [26, 23, 51];
const VIOLET: [number, number, number] = [107, 79, 240];
const WORLD_RGB: [number, number, number][] = [
  [26, 143, 234],
  [255, 194, 26],
  [240, 67, 107],
];
const WORLD_BADGES = [
  { name: "Schild van Veilig", icon: Shield, cls: "bg-safe text-safe-foreground" },
  { name: "Kompas van Slim", icon: Compass, cls: "bg-smart text-smart-foreground" },
  { name: "Ster van Sterker", icon: Rocket, cls: "bg-stronger text-stronger-foreground" },
];

export const Certificate = () => {
  const { user, profile } = useAuth();
  const final = useFinalTest();
  const { toast } = useToast();
  const [issued, setIssued] = useState<string | null>(null);
  const busy = useRef(false);

  const name = profile?.first_name || "AI Smart Kid";
  const score = final.bestScore;
  const date = new Date(issued ?? Date.now()).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" });

  // Record the certificate server-side once (keeps the first issue date).
  useEffect(() => {
    if (!user || !final.passed) return;
    supabase.rpc("create_or_refresh_certificate").then(({ data }) => {
      if (data?.issued_at) setIssued(data.issued_at);
    });
  }, [user, final.passed]);

  if (!final.isLoading && !final.passed) return <Navigate to="/final-test" replace />;

  const buildPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, h, "F");
    doc.setFillColor(...VIOLET);
    doc.rect(0, 0, w, 150, "F");
    // world color stripe
    WORLD_RGB.forEach((c, i) => {
      doc.setFillColor(...c);
      doc.rect((w / 3) * i, 150, w / 3, 10, "F");
    });

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(46);
    doc.text("Diploma", w / 2, 88, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("AI SMART KID", w / 2, 116, { align: "center", charSpace: 4 });

    doc.setTextColor(...INK);
    doc.setFontSize(15);
    doc.text("Hierbij verklaren wij dat", w / 2, 220, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.text(name, w / 2, 280, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text(`alle ${ALL_MISSIONS.length} missies en de eindtoets heeft gehaald`, w / 2, 318, { align: "center" });
    doc.text("en weet hoe je AI veilig, slim en sterk gebruikt.", w / 2, 340, { align: "center" });

    const names = WORLD_BADGES.map((b) => b.name);
    names.forEach((n, i) => {
      const cx = w / 2 + (i - 1) * 190;
      doc.setFillColor(...WORLD_RGB[i]);
      doc.circle(cx, 400, 16, "F");
      doc.setFontSize(12);
      doc.setTextColor(...INK);
      doc.text(n, cx, 432, { align: "center" });
    });

    doc.setFontSize(11);
    doc.setTextColor(90, 88, 110);
    doc.text(`Score eindtoets: ${score ?? "-"}/10`, 60, h - 50);
    doc.text(`Uitgegeven: ${date}`, w - 60, h - 50, { align: "right" });
    doc.setTextColor(...VIOLET);
    doc.setFont("helvetica", "bold");
    doc.text("AI met Spark", w / 2, h - 50, { align: "center" });
    return doc;
  };

  const download = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const doc = buildPdf();
      doc.save(`Diploma-AI-met-Spark-${name}.pdf`);
      if (user) {
        const path = `${user.id}/diploma.pdf`;
        const { error } = await supabase.storage.from("certificates").upload(path, doc.output("blob"), { upsert: true, contentType: "application/pdf" });
        if (!error) await supabase.rpc("attach_certificate_pdf", { _path: path });
      }
      toast({ title: "Diploma gedownload" });
    } finally {
      busy.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Mijn missies
        </Link>

        <div className="tile overflow-hidden">
          <div className="bg-primary px-6 py-8 text-center text-primary-foreground sm:py-10">
            <div className="mx-auto mb-3 w-fit rounded-full bg-background/15 p-2">
              <Spark size={72} mood="celebrating" />
            </div>
            <h1 className="text-5xl sm:text-6xl">Diploma</h1>
            <p className="mt-1 text-sm font-semibold tracking-[0.3em] opacity-90">AI SMART KID</p>
          </div>
          <div className="grid grid-cols-3" aria-hidden>
            <span className="h-2 bg-safe" />
            <span className="h-2 bg-smart" />
            <span className="h-2 bg-stronger" />
          </div>

          <div className="px-6 py-8 text-center sm:px-10">
            <p className="text-muted-foreground">Hierbij verklaren wij dat</p>
            <p className="my-2 font-display text-5xl sm:text-6xl">{name}</p>
            <p className="mx-auto max-w-md text-lg">
              alle {ALL_MISSIONS.length} missies en de eindtoets heeft gehaald, en weet hoe je AI veilig, slim en sterk gebruikt.
            </p>

            <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
              {WORLD_BADGES.map((b) => (
                <div key={b.name} className="flex flex-col items-center gap-2">
                  <span className={`grid h-14 w-14 place-items-center rounded-full ${b.cls}`}>
                    <b.icon className="h-7 w-7" />
                  </span>
                  <span className="text-xs font-medium leading-tight">{b.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-8 text-sm text-muted-foreground">
              <span>
                Score: <strong className="text-foreground">{score ?? "–"}/10</strong>
              </span>
              <span>
                Uitgegeven: <strong className="text-foreground">{date}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button size="lg" onClick={download}>
            <Download className="h-5 w-5" /> Download als PDF
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">Laat het zien aan je ouder of juf!</p>
        </div>
      </main>
    </div>
  );
};

export default Certificate;
