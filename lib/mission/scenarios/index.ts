import type { ScenarioDefinition } from "@/lib/mission/types";

export const scenarios: ScenarioDefinition[] = [
  {
    id: "aftershock",
    title: "Aftershock",
    eyebrow: "Featured demo · Seismic rescue",
    shortDescription: "Inspect a damaged transit corridor, stabilize its approach, and reach a trapped survivor through evolving structural hazards.",
    objective: "Assess structural cues, stabilize one approach, and choose how to reach the survivor.",
    seedPath: "/scenarios/aftershock/seed.png",
    landmarks: ["Red emergency door ahead", "Rectangular yellow wall box left", "Collapsed stairwell right"],
    prompt: {
      base: "First-person robot view in the same damaged gray concrete corridor as the reference: one red door straight ahead, one small rectangular yellow box on the bare left wall, and one collapsed stairwell on the right. Stable neutral lighting, clean lens, and stable geometry.",
    },
    radio: { briefing: "Responder one, I am behind the red emergency door. The ceiling outside keeps making noise." },
    defaultIncidentId: "ceiling-collapse",
    incidents: [
      { id: "ceiling-collapse", label: "Ceiling collapse", description: "Shift rubble from existing damage", alertLabel: "CEILING FAILURE", prompt: { active: "Only the existing gray rubble below the collapsed stairwell shifts slightly and releases a low pale dust cloud along the right floor edge. The corridor, red door, and rectangular yellow wall box stay unchanged.", settled: "The pale dust clears. Existing gray rubble rests slightly farther into the right floor edge. The center-left path remains open; the door stays red and the wall box stays rectangular and yellow." }, radio: { active: "Ceiling failure! Concrete is coming down near the stairwell!", settled: "It stopped. The left side still looks open." } },
      { id: "metal-groan", label: "Metal groan", description: "Expose a stressed overhead support", alertLabel: "SUPPORT STRAIN", prompt: { active: "One existing exposed steel brace above the right stairwell bends slightly. The corridor, red door, and yellow wall box remain unchanged.", settled: "The single steel brace remains slightly bowed and still above the right stairwell. The floor route and all three landmarks remain unchanged." }, radio: { active: "That overhead brace is bending—I can hear it moving!", settled: "The noise stopped, but the brace is still bowed." } },
      { id: "dust-surge", label: "Dust surge", description: "Temporarily cut corridor visibility", alertLabel: "VISIBILITY LOSS", prompt: { active: "Light gray concrete dust drifts slowly from the collapsed stairs across the floor. The corridor geometry, red door, and yellow wall box remain visible and unchanged.", settled: "The light dust settles on the floor. The red door, rectangular yellow wall box, and collapsed stairwell are clear in their original positions." }, radio: { active: "I can't see through the dust outside! Keep your beacon on!", settled: "Visibility is coming back. I can see the yellow marker." } },
    ],
    fieldActions: [
      { id: "structural-scan", label: "Structural LiDAR", description: "Project a crack-and-support survey", prompt: "A thin green lidar grid briefly scans the existing walls and rubble; nothing else changes.", radioCue: "Structural scan mapped. Left-wall approach shows the lowest visible damage." },
      { id: "acoustic-listen", label: "Acoustic array", description: "Place vibration sensors", prompt: "Two small orange vibration sensors now sit on the corridor floor beside the right rubble; everything else stays fixed.", radioCue: "Acoustic sensors deployed. Monitoring the overhead brace and stairwell wall." },
      { id: "deploy-shoring", label: "Deploy shoring", description: "Stabilize the left approach", prompt: "One yellow rescue support post is now braced vertically against the damaged ceiling on the left edge; the red door and corridor stay fixed.", radioCue: "Portable shoring locked. The left approach is marked for rescue entry." },
      { id: "dust-suppression", label: "Dust suppression", description: "Improve visibility with fine mist", prompt: "A low white water mist sprays only over the existing right-side rubble and clears the gray dust; corridor colors and landmarks stay unchanged.", radioCue: "Dust suppression active. Optical visibility is improving." },
    ],
    choices: [
      { id: "scan", label: "Shore and approach", description: "Commit through the stabilized left edge", shortcut: "1", scoreDelta: 100, prompt: "The robot advances slowly along the clear left edge toward the red emergency door beside the yellow support post.", feedback: "You matched the response to observed structural strain and used the stabilized approach." },
      { id: "assist", label: "Guide survivor left", description: "Beacon the survivor toward the marker", shortcut: "2", scoreDelta: 85, prompt: "Three small amber floor beacons form a clear path from the red door along the safe left corridor edge.", feedback: "You established a visible egress route, accepting controlled exposure near the damaged header." },
      { id: "retreat", label: "Mark and withdraw", description: "Preserve robot access and flag exclusion", shortcut: "3", scoreDelta: 75, prompt: "A single red exclusion beacon appears beside the right rubble while the robot backs away slowly.", feedback: "You avoided further exposure and left an auditable exclusion marker, but rescue remained incomplete." },
    ],
  },
  {
    id: "rising-water",
    title: "Rising Water",
    eyebrow: "Flood response · Utility rescue",
    shortDescription: "Map water depth, manage electrical risk, and establish a tethered route to a stranded maintenance worker.",
    objective: "Control electrical exposure and establish a shallow, tethered path to the stairwell.",
    seedPath: "/scenarios/rising-water/seed.png",
    landmarks: ["Amber stairwell door ahead", "Red hose cabinet left", "White rescue van right"],
    prompt: {
      base: "First-person rescue robot in the same flooded gray garage as the reference: one amber stairwell ahead, one red hose cabinet left, and one white van right. Shallow reflective water, neutral fluorescent light, clean lens, and the same compact robot hood retaining its exact size and shape at the bottom edge.",
    },
    radio: { briefing: "Rescue unit, I'm above the open amber stairwell. I don't know how deep the flooded level is below me." },
    defaultIncidentId: "water-surge",
    incidents: [
      { id: "water-surge", label: "Water surge", description: "Raise the established flood flow", alertLabel: "SURGE ENTERING", prompt: { active: "Brown floodwater ripples across the floor and rises visibly around the lower tires of the single white van. The amber stairwell and red hose cabinet remain unchanged.", settled: "The brown water becomes calm but remains visibly deeper around the single white van. A shallow strip remains open toward the amber stairwell; all landmarks stay unchanged." }, radio: { active: "The ramp is surging again—water is at the van wheels!", settled: "It slowed. The wall side still looks shallower." } },
      { id: "floating-debris", label: "Debris drift", description: "Move existing flood debris through the route", alertLabel: "DEBRIS FLOW", prompt: { active: "Three small existing leaves drift slowly across the brown water toward the single white van. The garage, robot hood, stairwell, cabinet, van, lighting, and colors remain unchanged.", settled: "The three small leaves rest beside the right tire of the single white van. The shallow route to the amber stairwell and every landmark remain unchanged." }, radio: { active: "Debris is crossing between us!", settled: "It collected by the van. The stairwell side is clear." } },
      { id: "electrical-short", label: "Electrical short", description: "Introduce a visible wall-level electrical fault", alertLabel: "ELECTRICAL ARC", prompt: { active: "One brief white electrical spark flickers at the conduit beside the red hose cabinet, safely above the water. The garage, water, robot hood, van, stairwell, lighting, and colors remain unchanged.", settled: "The conduit beside the red hose cabinet is dark and still. The shallow route, single van, amber stairwell, robot hood, lighting, and colors remain unchanged." }, radio: { active: "Sparks by the hose cabinet! Keep away from that wall!", settled: "The sparking stopped. Stay on the stairwell side." } },
    ],
    fieldActions: [
      { id: "depth-map", label: "Depth sonar", description: "Mark the shallowest route", prompt: "A narrow cyan sonar path appears on the water from the robot to the amber stairwell; all landmarks stay fixed.", radioCue: "Depth map complete. Stairwell wall route is shallowest." },
      { id: "isolate-power", label: "Isolate power", description: "Lock out the wet electrical zone", prompt: "The conduit light beside the red hose cabinet switches off and a small red lockout lamp remains visible above the water.", radioCue: "Local circuit isolated. Hose-cabinet wall remains an exclusion zone." },
      { id: "deploy-float-line", label: "Deploy float line", description: "Create a tether to the raised step", prompt: "One bright orange floating rescue line now runs across the water from the robot to the amber stairwell step.", radioCue: "Floating tether deployed to the stairwell step." },
      { id: "activate-pump", label: "Activate pump", description: "Lower water near the stairwell", prompt: "One compact yellow pump sits at the stairwell edge and the water visibly lowers around the bottom step.", radioCue: "Portable pump running. Water is receding locally." },
    ],
    choices: [
      { id: "scan", label: "Throw tether", description: "Give the worker a secured float line", shortcut: "1", scoreDelta: 95, prompt: "The orange floating tether reaches the raised amber stairwell step and becomes taut across the shallow water.", feedback: "You created a direct safety connection before asking the worker to enter moving water." },
      { id: "assist", label: "Guide through shallows", description: "Escort along the depth-marked wall route", shortcut: "2", scoreDelta: 100, prompt: "The robot moves slowly along the cyan shallow-water route toward the amber stairwell while the orange tether stays visible.", feedback: "You combined depth mapping, tethering, and the raised stairwell route into a coherent evacuation." },
      { id: "retreat", label: "Hold dry threshold", description: "Isolate the zone and await flood team", shortcut: "3", scoreDelta: 80, prompt: "A red exclusion beacon lights beside the wet hose-cabinet wall while the robot remains at the dry threshold.", feedback: "You controlled electrical exposure and avoided uncertain depth, but delayed extraction." },
    ],
  },
  {
    id: "ember-front",
    title: "Ember Front",
    eyebrow: "Wildfire response · Evacuation lane",
    shortDescription: "Track heat, protect an evacuation marshal, and preserve one tenable shoulder through shifting smoke and embers.",
    objective: "Build a protected escape corridor and choose when to move the evacuation marshal.",
    seedPath: "/scenarios/ember-front/seed.png",
    landmarks: ["Yellow evacuation gate ahead", "White utility truck left", "Stone water tank right"],
    prompt: {
      base: "Parked low dashboard viewpoint matching the reference composition. Keep three large landmarks continuously visible: the single white utility truck in the left foreground, the yellow rectangular gate spanning the road ahead, and the round stone water tank in the right foreground. The viewpoint and landmarks remain stationary until movement input. Dry grass, pine trees, pale gray smoke, clean windshield, and stable natural warm color.",
    },
    radio: { briefing: "Evacuation marshal calling from behind the stone water tank. Smoke is cutting off the road." },
    defaultIncidentId: "wind-shift",
    incidents: [
      { id: "wind-shift", label: "Wind shift", description: "Drive existing smoke across the lane", alertLabel: "WIND REVERSAL", prompt: { active: "Only the existing pale gray smoke drifts slowly from left to right across the road. Natural warm color, the single white truck, yellow gate, stone tank, road, and windshield remain unchanged.", settled: "The pale gray smoke becomes still and slightly thinner over the right shoulder. The single white truck, yellow gate, stone tank, road, windshield, and natural warm color remain unchanged." }, radio: { active: "Wind shift! The smoke is crossing toward the tank!", settled: "The right shoulder is clearing. I can move if you cover me." } },
      { id: "ember-shower", label: "Ember shower", description: "Ignite small spots in existing dry grass", alertLabel: "EMBER SHOWER", prompt: { active: "Three tiny orange embers glow above the dry grass on the left shoulder. The road, clean windshield, natural warm color, single truck, yellow gate, and stone tank remain unchanged.", settled: "Three tiny orange embers fade above the left grass. The clean right shoulder, road, windshield, natural warm color, single truck, yellow gate, and stone tank remain unchanged." }, radio: { active: "Ember shower! Spot fires on the truck side!", settled: "The tank side still has a clear strip." } },
      { id: "branch-fall", label: "Branch fall", description: "Drop an existing scorched limb", alertLabel: "BRANCH DOWN", prompt: { active: "One dark scorched branch falls from the existing left-side pine onto the left road edge near the yellow gate. The right lane and all three landmarks remain unchanged.", settled: "The single dark branch rests on the left road edge near the yellow gate. The right lane beside the stone tank stays open; the truck, gate, tank, windshield, and colors remain unchanged." }, radio: { active: "Branch coming down by the gate!", settled: "It blocked the left lane. The tank side is still open." } },
    ],
    fieldActions: [
      { id: "thermal-sweep", label: "Thermal sweep", description: "Reveal heat along both shoulders", prompt: "A thin green thermal scan line sweeps once across the road and highlights the cooler right shoulder beside the stone tank.", radioCue: "Thermal sweep complete. Lowest heat is along the stone-tank shoulder." },
      { id: "deploy-wet-line", label: "Lay wet line", description: "Dampen the escape shoulder", prompt: "A dark wet strip now follows the right road shoulder from the robot toward the round stone tank.", radioCue: "Wet line established along the right shoulder." },
      { id: "ember-shield", label: "Ember shield", description: "Protect the marshal's movement", prompt: "One small silver rescue shield stands on the right shoulder beside the stone tank; truck and gate stay unchanged.", radioCue: "Portable ember shield deployed between the marshal and the fire front." },
      { id: "mark-escape-route", label: "Escape beacons", description: "Mark the tenable shoulder", prompt: "Three small amber beacons mark the right road shoulder from the stone tank toward the robot.", radioCue: "Escape route marked. Follow the amber beacons on the tank side." },
    ],
    choices: [
      { id: "scan", label: "Shield the route", description: "Hold the ember barrier before movement", shortcut: "1", scoreDelta: 90, prompt: "The silver rescue shield moves into position along the marked right shoulder while landmarks remain fixed.", feedback: "You improved the route's tenability before exposing the marshal to the road." },
      { id: "assist", label: "Escort right shoulder", description: "Move behind the wet line and shield", shortcut: "2", scoreDelta: 100, prompt: "The robot advances slowly along the wet right shoulder toward the stone tank, following the three amber beacons.", feedback: "You combined thermal information, a wet line, and shielding into a protected evacuation." },
      { id: "retreat", label: "Fallback behind tank", description: "Shelter until the ember front passes", shortcut: "3", scoreDelta: 85, prompt: "The robot backs slowly toward the round stone tank as pale smoke remains over the road.", feedback: "You selected a defensible fallback when the road could not be trusted." },
    ],
  },
];

export function getScenario(id: ScenarioDefinition["id"]) {
  const scenario = scenarios.find((item) => item.id === id);
  if (!scenario) throw new Error(`Unknown scenario: ${id}`);
  return scenario;
}
