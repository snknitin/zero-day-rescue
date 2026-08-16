import type { ChoiceDefinition, FieldActionDefinition, MissionChoice, ScenarioDefinition } from "@/lib/mission/types";

const choices: ChoiceDefinition[] = [
  { id: "scan", label: "Scan", shortcut: "1", scoreDelta: 100, feedback: "Gathered information before committing to the obstructed route." },
  { id: "assist", label: "Assist", shortcut: "2", scoreDelta: 80, feedback: "Prioritized the marked side route with higher exposure." },
  { id: "retreat", label: "Retreat", shortcut: "3", scoreDelta: 90, feedback: "Preserved operator safety and reported an incomplete search." },
];

const consequence = (landmarks: string): Record<MissionChoice, string> => ({
  scan: `A small amber survivor-location beacon is now visible beside the passable route. ${landmarks} remain fixed and recognizable; the settled obstruction is unchanged.`,
  assist: `A clear amber survivor-location beacon now glows at a sheltered position along the passable side route. ${landmarks} remain fixed and recognizable; the settled obstruction is unchanged.`,
  retreat: `The first-person viewpoint is oriented toward the clearer entry route. ${landmarks} and the settled hazard remain fixed and recognizable behind the safe withdrawal path.`,
});

const fieldActions = (subject: string, anchors: string, obstacle: string): FieldActionDefinition[] => [
  { id: "thermal-scan", label: "Thermal scan", description: "Reveal the stranded person", radioCue: `Thermal contact confirmed. ${subject}`, prompt: `A restrained amber thermal outline now identifies one stranded adult: ${subject}. The person remains in the same sheltered position, visibly conscious and signaling for help. ${anchors} remain fixed.` },
  { id: "deploy-beacon", label: "Deploy beacon", description: "Mark the rescue route", radioCue: "Beacon deployed. Rescue team has the route.", prompt: `A compact amber tripod rescue beacon now stands beside the passable route leading toward the stranded adult. Its light pulses visibly without readable text. ${anchors} remain fixed.` },
  { id: "create-obstacle", label: "Add obstacle", description: "Stress-test route planning", radioCue: "New obstruction detected. Recalculating the approach.", prompt: `${obstacle} now occupies half of the direct lane as a new temporary obstruction. A narrow safe edge remains visibly passable. The stranded adult stays sheltered and ${anchors} remain fixed.` },
  { id: "clear-obstacle", label: "Clear obstacle", description: "Remove the added obstruction", radioCue: "Temporary obstruction cleared. Route restored.", prompt: `The operator-added temporary obstruction is now absent and the direct lane is visibly clearer. The incident's original hazard remains, the stranded adult stays sheltered, and ${anchors} remain fixed.` },
];

export const scenarios: ScenarioDefinition[] = [
  {
    id: "aftershock", title: "Aftershock", eyebrow: "Featured demo · Seismic", hazardLabel: "AFTERSHOCK DETECTED",
    shortDescription: "A damaged transit corridor suffers a second shock that changes the direct route.",
    objective: "Assess the blocked corridor and choose a safe response.", seedPath: "/scenarios/aftershock/seed.png",
    landmarks: ["Red emergency door ahead", "Yellow rescue marker left", "Collapsed stairwell right"],
    prompt: {
      base: "An earthquake-damaged concrete transit service corridor. One conscious adult survivor in a gray jacket shelters beside the red door and signals for help. The world contains EXACTLY ONE red emergency door straight ahead, EXACTLY ONE yellow rescue marker on the left wall, and EXACTLY ONE partially collapsed stairwell on the right, all fixed. Cool emergency lighting reveals cracked concrete, restrained rubble, and suspended dust. Realistic rescue documentary imagery.",
      incident: {
        active: "A brief aftershock is happening now: the corridor shudders, fine dust falls from the ceiling, loose pebbles skip across the floor, and a small amount of fresh rubble drops near the red door. The yellow marker and damaged stairwell remain visible in their fixed locations. The central route remains partially traversable.",
        settled: "The brief aftershock has ended. Dust slowly settles through the emergency light. A fresh low pile of rubble now partially obstructs the direct path near the red door while a passable side route remains beside the yellow marker. The same red door, yellow marker, and damaged stairwell remain fixed and recognizable.",
      },
      consequences: consequence("The same red door, yellow rescue marker, and damaged stairwell"),
    },
    radio: { briefing: "Responder one, I am trapped beside the red emergency door. I can see your camera.", hazard: "Help! The corridor is shaking again!", settled: "I'm conscious. The direct route is blocked, but I can see space by the yellow marker." },
    fieldActions: fieldActions("beside the red emergency door", "the red door, yellow marker, and damaged stairwell", "A toppled wheeled maintenance cart"), choices,
  },
  {
    id: "rising-water", title: "Rising Water", eyebrow: "Flood response", hazardLabel: "SURGE DETECTED",
    shortDescription: "A flooded service level receives a sudden surge across the vehicle ramp.",
    objective: "Find the shallow route and preserve access to the stairwell.", seedPath: "/scenarios/rising-water/seed.png",
    landmarks: ["Amber stairwell door ahead", "Red hose cabinet left", "White rescue van right"],
    prompt: {
      base: "A flooded underground parking service level after extreme rainfall. One conscious maintenance worker in an orange vest stands on a raised step beside the amber door and signals for help. The world contains EXACTLY ONE amber stairwell door ahead, EXACTLY ONE red fire-hose cabinet left, and EXACTLY ONE white rescue van right, all fixed. Shallow reflective water covers the floor beneath cool emergency lights. Realistic rescue documentary imagery.",
      incident: {
        active: "A brief flash-flood surge is entering the same service level now: turbulent water pushes a few small floating objects across the floor and ripples around the utility van's tires. The amber stairwell door, red fire-hose cabinet, and white utility van remain visible in their fixed locations. The central route remains partly navigable.",
        settled: "The surge has slowed. Water is now moderately deeper across the direct ramp while a shallower route remains beside the amber stairwell door. Reflections settle around the same red fire-hose cabinet and white utility van, which remain fixed and recognizable.",
      },
      consequences: consequence("The same amber stairwell door, red fire-hose cabinet, and white utility van"),
    },
    radio: { briefing: "Rescue unit, I'm stranded on the raised step beside the amber stairwell door.", hazard: "The water is rising fast! Debris is crossing the ramp!", settled: "I'm stable. The water looks shallower along the stairwell side." },
    fieldActions: fieldActions("on the raised step beside the amber stairwell door", "the amber door, red hose cabinet, and white rescue van", "A floating blue plastic drum"), choices,
  },
  {
    id: "ember-front", title: "Ember Front", eyebrow: "Wildfire response", hazardLabel: "WIND SHIFT DETECTED",
    shortDescription: "A wind shift drives embers across an evacuation road and changes the route.",
    objective: "Maintain a viable evacuation lane through the ember front.", seedPath: "/scenarios/ember-front/seed.png",
    landmarks: ["Yellow evacuation gate ahead", "White utility truck left", "Stone water tank right"],
    prompt: {
      base: "A wildland–urban interface evacuation road under smoky late-afternoon light. One conscious evacuation marshal in a yellow helmet crouches beside the stone water tank and waves for assistance. The world contains EXACTLY ONE yellow evacuation gate ahead, EXACTLY ONE white utility truck left, and EXACTLY ONE round stone water tank right, all fixed. Dry vegetation, drifting smoke, ash, and a visible road create realistic rescue documentary imagery.",
      incident: {
        active: "A sudden wind shift crosses the same road now: smoke thickens briefly, glowing embers sweep sideways, and one small burning branch falls near the yellow gate. The white utility truck and stone water tank remain visible in their fixed locations, and part of the road remains passable.",
        settled: "The wind gust has passed. Smoke remains but visibility improves, and the fallen branch now partially obstructs the direct lane near the yellow gate while a passable edge remains beside the stone water tank. The same yellow gate, white utility truck, and stone water tank stay fixed and recognizable.",
      },
      consequences: consequence("The same yellow evacuation gate, white utility truck, and stone water tank"),
    },
    radio: { briefing: "Evacuation marshal calling. I'm pinned down beside the stone water tank.", hazard: "Wind shift! Embers are crossing the road now!", settled: "Visibility is improving. The right shoulder still looks passable." },
    fieldActions: fieldActions("crouched beside the stone water tank", "the yellow gate, white utility truck, and stone water tank", "A smoking fallen pine branch"), choices,
  },
];

export function getScenario(id: ScenarioDefinition["id"]) {
  const scenario = scenarios.find((item) => item.id === id);
  if (!scenario) throw new Error(`Unknown scenario: ${id}`);
  return scenario;
}
