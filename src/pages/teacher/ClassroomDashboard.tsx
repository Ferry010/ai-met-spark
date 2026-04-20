import { useNavigate } from "react-router-dom";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { WelcomeBlock } from "@/components/classroom/WelcomeBlock";
import { ProgressJourney } from "@/components/classroom/ProgressJourney";
import { ClassOverviewCard } from "@/components/classroom/ClassOverviewCard";
import { WorldCard } from "@/components/classroom/WorldCard";
import { ActivityFeed } from "@/components/classroom/ActivityFeed";
import { ActionTile } from "@/components/classroom/ActionTile";
import { WORLDS } from "@/data/classroomMock";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Mail, Sparkles, Award } from "lucide-react";

const ClassroomDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const stub = (title: string) =>
    toast({ title: "Binnenkort", description: `${title} is in de maak.` });

  return (
    <ClassroomLayout>
      <WelcomeBlock />
      <ProgressJourney />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <ClassOverviewCard />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WORLDS.map((w) => (
              <WorldCard
                key={w.id}
                worldId={w.id}
                name={w.name}
                tagline={w.tagline}
                emoji={w.emoji}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 content-start">
          <ActionTile
            highlight
            icon={<Calendar className="h-5 w-5" />}
            title="Klassikale les van vandaag"
            body="Les 11, WIE-WAT-HOE methode. Klaar om te starten."
            cta="Open slides"
            onClick={() => stub("Klassikale slides")}
          />
          <ActionTile
            icon={<Mail className="h-5 w-5" />}
            title="Ouder-update"
            body="Laatste update: 3 dagen geleden."
            cta="Verstuur nieuwe update"
            onClick={() => stub("Ouder-update")}
          />
          <ActionTile
            icon={<Sparkles className="h-5 w-5" />}
            title="Off-screen activiteit"
            body="Kies een verwerkingsopdracht voor in de klas."
            cta="Bekijk opdrachten"
            onClick={() => stub("Off-screen activiteiten")}
          />
          <ActionTile
            icon={<Award className="h-5 w-5" />}
            title="Klasdiploma's"
            body="4 leerlingen hebben wereld 1 voltooid."
            cta="Bekijk diploma's"
            onClick={() => navigate("/teacher/class/settings")}
          />
        </div>
      </div>

      <ActivityFeed />
    </ClassroomLayout>
  );
};

export default ClassroomDashboard;
