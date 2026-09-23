import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMission } from "@/content/missions";
import { MissionPlayer } from "@/components/mission/MissionPlayer";

/** Teachers play any mission exactly as kids see it. Nothing is saved. */
const MissionPreview = () => {
  const { missionId = "" } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const mission = getMission(missionId);
  const [run, setRun] = useState(0);
  if (!mission) return <Navigate to="/teacher" replace />;
  return (
    <MissionPlayer
      key={`${mission.id}-${run}`}
      mission={mission}
      preview
      onExit={() => navigate("/teacher")}
      onComplete={() => undefined}
      onReplay={() => setRun((n) => n + 1)}
    />
  );
};

export default MissionPreview;
