import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, ChevronLeft } from "lucide-react";

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
        // First-time issue: record certificate row
        supabase.from("certificates").insert({ user_id: user.id, score: attempt.score }).then(({ data }) => {
          if (data) setIssued(new Date().toISOString());
        });
      }
    });
  }, [user, profile]);

  const buildPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(245, 249, 255);
    doc.rect(0, 0, w, h, "F");

    // Border
    doc.setDrawColor(79, 195, 247);
    doc.setLineWidth(6);
    doc.roundedRect(24, 24, w - 48, h - 48, 18, 18);
    doc.setDrawColor(255, 213, 79);
    doc.setLineWidth(2);
    doc.roundedRect(40, 40, w - 80, h - 80, 14, 14);

    // Title
    doc.setTextColor(34, 50, 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.text("Certificate of AI Smart Kid", w / 2, 130, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(110, 110, 130);
    doc.text("This certifies that", w / 2, 175, { align: "center" });

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.setTextColor(255, 138, 101);
    doc.text(profile?.first_name ?? "Smart Kid", w / 2, 240, { align: "center" });

    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(34, 50, 80);
    doc.text(
      "has completed all 12 lessons and the final test,",
      w / 2,
      290,
      { align: "center" },
    );
    doc.text("learning to use AI safely, smartly, and to grow stronger.", w / 2, 315, { align: "center" });

    // Pillar badges
    doc.setFontSize(28);
    doc.text("🛡️   🧠   💪", w / 2, 380, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(110, 110, 130);
    doc.text("SAFE        SMART        STRONGER", w / 2, 405, { align: "center" });

    // Score + date
    doc.setFontSize(14);
    doc.setTextColor(34, 50, 80);
    doc.text(`Score: ${score ?? "—"} / 10`, w / 2, 470, { align: "center" });
    doc.text(`Issued: ${new Date(issued ?? Date.now()).toLocaleDateString()}`, w / 2, 490, { align: "center" });

    // Signature line
    doc.setDrawColor(180, 180, 200);
    doc.line(w / 2 - 100, 540, w / 2 + 100, 540);
    doc.setFontSize(12);
    doc.setTextColor(110, 110, 130);
    doc.text("AI Smart Kids", w / 2, 558, { align: "center" });

    return doc;
  };

  const downloadPdf = async () => {
    if (generatingRef.current || !user) return;
    generatingRef.current = true;
    try {
      const doc = buildPdf();
      doc.save(`AI-Smart-Kid-${profile?.first_name ?? "certificate"}.pdf`);

      // Upload to storage (private bucket; owner-folder path)
      const blob = doc.output("blob");
      const path = `${user.id}/certificate.pdf`;
      const { error } = await supabase.storage.from("certificates").upload(path, blob, {
        upsert: true,
        contentType: "application/pdf",
      });
      if (!error) {
        await supabase.from("certificates").update({ pdf_url: path }).eq("user_id", user.id);
      }
      toast({ title: "Downloaded!", description: "Saved to your device and your account." });
    } finally {
      generatingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 font-display">
          <ChevronLeft className="h-4 w-4" /> Dashboard
        </Link>

        <section className="rounded-3xl bg-gradient-hero border-2 border-primary p-8 text-center shadow-pop">
          <Spark size={140} mood="celebrating" />
          <h1 className="font-display text-4xl mt-4">Your Certificate</h1>
          <p className="text-muted-foreground mt-1">
            Personal · {new Date(issued ?? Date.now()).toLocaleDateString()}
          </p>

          <div className="my-8 mx-auto max-w-md rounded-2xl bg-card p-6 shadow-soft border border-border text-left">
            <div className="text-xs font-display text-muted-foreground uppercase tracking-wider">This certifies</div>
            <div className="font-display text-3xl text-accent mt-1">{profile?.first_name}</div>
            <div className="mt-3 text-sm">has completed all 12 lessons and passed the final test.</div>
            <div className="mt-4 flex gap-3 text-2xl">🛡️ 🧠 💪</div>
            <div className="mt-3 text-sm text-muted-foreground">Score: {score ?? "—"} / 10</div>
          </div>

          <Button onClick={downloadPdf} className="h-14 px-8 rounded-full font-display bg-primary shadow-pop gap-2">
            <Download className="h-5 w-5" /> Download PDF
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Show your parent or teacher 🎉
          </p>
        </section>
      </main>
    </div>
  );
};

export default Certificate;
