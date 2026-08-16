export const MISSION_DURATION_SECONDS = 180;

export type ScenarioId = "aftershock" | "rising-water" | "ember-front";
export type MissionChoice = "scan" | "assist" | "retreat";
export type FieldActionId =
  | "structural-scan" | "acoustic-listen" | "deploy-shoring" | "dust-suppression"
  | "depth-map" | "isolate-power" | "deploy-float-line" | "activate-pump"
  | "thermal-sweep" | "deploy-wet-line" | "ember-shield" | "mark-escape-route";
export type IncidentId =
  | "ceiling-collapse" | "metal-groan" | "dust-surge"
  | "water-surge" | "floating-debris" | "electrical-short"
  | "wind-shift" | "ember-shower" | "branch-fall";
export type IncidentPhase = "normal" | "hazard_active" | "hazard_settled";
export type MissionPhase =
  | "scenario_selection"
  | "briefing"
  | "connecting"
  | "staging"
  | "exploring"
  | "hazard_active"
  | "hazard_settled"
  | "consequence"
  | "debrief";

export type MissionLogEntry = {
  id: string;
  atMs: number;
  kind: "system" | "incident" | "tool" | "choice" | "outcome";
  title: string;
  detail: string;
};

export type ChoiceDefinition = {
  id: MissionChoice;
  label: string;
  description: string;
  shortcut: "1" | "2" | "3";
  feedback: string;
  scoreDelta: number;
  prompt: string;
};

export type FieldActionDefinition = {
  id: FieldActionId;
  label: string;
  description: string;
  prompt: string;
  radioCue: string;
};

export type IncidentDefinition = {
  id: IncidentId;
  label: string;
  description: string;
  alertLabel: string;
  prompt: { active: string; settled: string };
  radio: { active: string; settled: string };
};

export type ScenarioDefinition = {
  id: ScenarioId;
  title: string;
  eyebrow: string;
  shortDescription: string;
  objective: string;
  seedPath: string;
  landmarks: [string, string, string];
  prompt: { base: string };
  radio: { briefing: string };
  defaultIncidentId: IncidentId;
  incidents: IncidentDefinition[];
  fieldActions: FieldActionDefinition[];
  choices: ChoiceDefinition[];
};

export type MissionState = {
  phase: MissionPhase;
  scenarioId: ScenarioId | null;
  startedAtMs: number | null;
  remainingSeconds: number;
  incidentId: IncidentId | null;
  settledIncidents: IncidentId[];
  hazardStartChunk: number | null;
  hazardStartedAtMs: number | null;
  hazardChunks: number;
  settledAtMs: number | null;
  choice: MissionChoice | null;
  lastChoice: MissionChoice | null;
  fieldActions: FieldActionId[];
  score: number;
  responseCount: number;
  choiceResponseMs: number | null;
  eventLog: MissionLogEntry[];
  terminalReason: "completed" | "timeout" | "retreat" | "error" | null;
};
