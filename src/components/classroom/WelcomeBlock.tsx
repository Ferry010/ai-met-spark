import { teacher, overallClassProgressPct, worldProgress } from "@/data/classroomMock";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 6) return "Goedenacht";
  if (h < 12) return "Goedemorgen";
  if (h < 18) return "Goedemiddag";
  return "Goedenavond";
};

export const WelcomeBlock = () => {
  const w1 = worldProgress(1);
  const overall = overallClassProgressPct();
  return (
    <section className="mb-8">
      <h1 className="font-fraunces text-2xl sm:text-3xl md:text-4xl text-classroom-dark">
        {greeting()}, {teacher.firstName}.
      </h1>
      <p className="mt-2 text-classroom-muted text-base sm:text-lg">
        Je klas is {w1.completedAvg}% door wereld 1. Totaal: {overall}% van het curriculum.
      </p>
    </section>
  );
};
