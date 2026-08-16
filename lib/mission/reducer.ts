import { MISSION_DURATION_SECONDS, type FieldActionId, type IncidentId, type MissionChoice, type MissionState, type ScenarioId } from "@/lib/mission/types";

export type MissionAction =
  | { type: "SELECT"; scenarioId: ScenarioId }
  | { type: "CONNECT" }
  | { type: "CONNECTION_FAILED" }
  | { type: "STAGE" }
  | { type: "START"; now: number }
  | { type: "TICK"; now: number }
  | { type: "TRIGGER_HAZARD"; incidentId: IncidentId; label: string; chunk: number; now: number }
  | { type: "CHUNK"; now: number }
  | { type: "FIELD_ACTION"; action: FieldActionId; label: string; now: number }
  | { type: "CHOOSE"; choice: MissionChoice; label: string; scoreDelta: number; now: number }
  | { type: "CONTINUE"; now: number }
  | { type: "FINISH"; reason: MissionState["terminalReason"]; now: number }
  | { type: "RESTART" };

export const initialMissionState: MissionState = {
  phase: "scenario_selection",
  scenarioId: null,
  startedAtMs: null,
  remainingSeconds: MISSION_DURATION_SECONDS,
  incidentId: null,
  settledIncidents: [],
  hazardStartChunk: null,
  hazardStartedAtMs: null,
  hazardChunks: 0,
  settledAtMs: null,
  choice: null,
  lastChoice: null,
  fieldActions: [],
  score: 0,
  responseCount: 0,
  choiceResponseMs: null,
  eventLog: [],
  terminalReason: null,
};

const log = (state: MissionState, now: number, kind: MissionState["eventLog"][number]["kind"], title: string, detail: string) => [
  ...state.eventLog,
  { id: `${now}-${state.eventLog.length}`, atMs: state.startedAtMs ? now - state.startedAtMs : 0, kind, title, detail },
];

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case "SELECT": return { ...initialMissionState, phase: "briefing", scenarioId: action.scenarioId };
    case "CONNECT": return state.phase === "briefing" ? { ...state, phase: "connecting" } : state;
    case "CONNECTION_FAILED": return state.phase === "connecting" || state.phase === "staging" ? { ...state, phase: "briefing" } : state;
    case "STAGE": return state.phase === "connecting" ? { ...state, phase: "staging" } : state;
    case "START": return state.phase === "staging" ? { ...state, phase: "exploring", startedAtMs: action.now, eventLog: log(state, action.now, "system", "World online", "Three-minute mission clock started on generation confirmation.") } : state;
    case "TICK": {
      if (!state.startedAtMs || state.phase === "debrief") return state;
      return { ...state, remainingSeconds: Math.max(0, MISSION_DURATION_SECONDS - Math.floor((action.now - state.startedAtMs) / 1000)) };
    }
    case "TRIGGER_HAZARD": return state.phase === "exploring" ? {
      ...state,
      phase: "hazard_active",
      incidentId: action.incidentId,
      hazardStartChunk: action.chunk,
      hazardStartedAtMs: action.now,
      hazardChunks: 0,
      eventLog: log(state, action.now, "incident", action.label, "Scenario Director event queued as a full prompt update."),
    } : state;
    case "CHUNK": {
      if (state.phase !== "hazard_active") return state;
      const count = state.hazardChunks + 1;
      const heldLongEnough = state.hazardStartedAtMs !== null && action.now - state.hazardStartedAtMs >= 12000;
      return count >= 6 && heldLongEnough
        ? { ...state, phase: "hazard_settled", hazardChunks: count, settledAtMs: action.now, eventLog: log(state, action.now, "incident", "Environment stabilized", "The selected event remained active for at least twelve seconds and six rendered chunks before its settled prompt.") }
        : { ...state, hazardChunks: count };
    }
    case "FIELD_ACTION": {
      if (!["exploring", "hazard_active", "hazard_settled", "consequence"].includes(state.phase) || state.fieldActions.includes(action.action)) return state;
      return { ...state, fieldActions: [...state.fieldActions, action.action], eventLog: log(state, action.now, "tool", action.label, "Robot intervention applied to the live world prompt.") };
    }
    case "CHOOSE": return state.phase === "hazard_settled" && !state.choice ? {
      ...state,
      phase: "consequence",
      choice: action.choice,
      lastChoice: action.choice,
      score: state.score + action.scoreDelta,
      responseCount: state.responseCount + 1,
      choiceResponseMs: state.settledAtMs ? action.now - state.settledAtMs : 0,
      eventLog: log(state, action.now, "choice", action.label, "Scenario-specific response recorded in deterministic mission state."),
    } : state;
    case "CONTINUE": return state.phase === "consequence" && state.incidentId ? {
      ...state,
      phase: "exploring",
      settledIncidents: state.settledIncidents.includes(state.incidentId) ? state.settledIncidents : [...state.settledIncidents, state.incidentId],
      incidentId: null,
      hazardStartChunk: null,
      hazardStartedAtMs: null,
      hazardChunks: 0,
      settledAtMs: null,
      choice: null,
      eventLog: log(state, action.now, "system", "Operation continued", "Another Director event is available without an extra prompt rewrite."),
    } : state;
    case "FINISH": return state.phase === "debrief" ? state : { ...state, phase: "debrief", terminalReason: action.reason, eventLog: log(state, action.now, "outcome", "Mission ended", action.reason ?? "completed") };
    case "RESTART": return initialMissionState;
    default: return state;
  }
}
