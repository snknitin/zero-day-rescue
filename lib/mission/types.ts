export type ScenarioId = "aftershock" | "rising-water" | "ember-front";
export type MissionChoice = "scan" | "assist" | "retreat";
export type FieldActionId = "thermal-scan" | "deploy-beacon" | "create-obstacle" | "clear-obstacle";
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
  shortcut: "1" | "2" | "3";
  feedback: string;
  scoreDelta: number;
};

export type FieldActionDefinition = {
  id: FieldActionId;
  label: string;
  description: string;
  prompt: string;
  radioCue: string;
};

export type ScenarioDefinition = {
  id: ScenarioId;
  title: string;
  eyebrow: string;
  shortDescription: string;
  objective: string;
  hazardLabel: string;
  seedPath: string;
  landmarks: [string, string, string];
  prompt: {
    base: string;
    incident: { active: string; settled: string };
    consequences: Record<MissionChoice, string>;
  };
  radio: { briefing: string; hazard: string; settled: string };
  fieldActions: FieldActionDefinition[];
  choices: ChoiceDefinition[];
};

export type MissionState = {
  phase: MissionPhase;
  scenarioId: ScenarioId | null;
  startedAtMs: number | null;
  remainingSeconds: number;
  hazardStartChunk: number | null;
  hazardChunks: number;
  settledAtMs: number | null;
  choice: MissionChoice | null;
  fieldAction: FieldActionId | null;
  choiceResponseMs: number | null;
  eventLog: MissionLogEntry[];
  terminalReason: "completed" | "timeout" | "retreat" | "error" | null;
};
