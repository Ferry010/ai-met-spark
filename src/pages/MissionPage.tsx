import { useCallback, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMission, getWorld, nextMission } from "@/content/missions";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGameStats } from "@/hooks/useGameStats";
import { isMissionUnlocked } from "@/lib/progress";
import { MissionPlayer, type MissionResult } from "@/components/mission/MissionPlayer";

export const MissionPage = () => {
  const { missionId = "" } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const mission = getMission(missionId);
  const { completed, finishLesson, isLoading } = useUserProgress();
  const { addXp } = useGameStats();
  const [run, setRun] = useState(0);

  const onComplete = useCallback(
    async (r: MissionResult) => {
      if (!mission) return;
      await finishLesson({ lessonId: mission.id, stars: r.stars }).catch(() => {});
      try {
        const x = await addXp({ amount: r.xp, combo: r.bestCombo });
        return { leveledUp: x.leveledUp, newLevel: x.newLevel };
      } catch {
        return {};
      }
    },
    [mission, finishLesson, addXp],
  );

  if (!mission) return <Navigate to="/dashboard" replace />;
  // Don't let a locked mission be opened via a link.
  if (!isLoading && !isMissionUnlocked(mission, completed)) {
    return <Navigate to={`/world/${mission.worldId}`} replace />;
  }

  const upcoming = nextMission(mission.id);
  const next =
    mission.id === "3.6"
      ? { label: "Naar de eindtoets", onClick: () => navigate("/final-test") }
      : upcoming && upcoming.worldId === mission.worldId
        ? { label: "Volgende missie", onClick: () => navigate(`/mission/${upcoming.id}`) }
        : upcoming
          ? { label: `Naar Wereld ${getWorld(upcoming.worldId)?.name}`, onClick: () => navigate(`/world/${upcoming.worldId}`) }
          : undefined;

  return (
    <MissionPlayer
      key={`${mission.id}-${run}`}
      mission={mission}
      onExit={() => navigate(`/world/${mission.worldId}`)}
      onComplete={onComplete}
      onReplay={() => setRun((n) => n + 1)}
      next={next}
    />
  );
};

export default MissionPage;
