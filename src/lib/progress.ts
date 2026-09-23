import { ALL_MISSIONS, WORLDS, getWorld, type Mission } from "@/content/missions";

/** A world opens once every mission of the previous world is done. */
export const isWorldUnlocked = (worldId: number, completed: Set<string>) =>
  worldId === 1 || (WORLDS[worldId - 2]?.missions.every((m) => completed.has(m.id)) ?? false);

/** A mission opens once the one before it (in the same world) is done. */
export const isMissionUnlocked = (mission: Mission, completed: Set<string>) => {
  if (!isWorldUnlocked(mission.worldId, completed)) return false;
  const world = getWorld(mission.worldId);
  const idx = world?.missions.findIndex((m) => m.id === mission.id) ?? -1;
  return idx <= 0 || completed.has(world!.missions[idx - 1].id);
};

/** The first mission that isn't done yet (always unlocked), or undefined when all are done. */
export const nextUpMission = (completed: Set<string>) => ALL_MISSIONS.find((m) => !completed.has(m.id));

export const TOTAL_MISSIONS = ALL_MISSIONS.length;
