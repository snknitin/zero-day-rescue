import type { FieldActionId, MissionChoice, MissionState, ScenarioId } from "@/lib/mission/types";

export type MissionAction =
  | { type: "SELECT"; scenarioId: ScenarioId }
  | { type: "CONNECT" }
  | { type: "CONNECTION_FAILED" }
  | { type: "STAGE" }
  | { type: "START"; now: number }
  | { type: "TICK"; now: number }
  | { type: "TRIGGER_HAZARD"; chunk: number; now: number }
  | { type: "CHUNK"; now: number }
  | { type: "FIELD_ACTION"; action: FieldActionId; label: string; now: number }
  | { type: "CHOOSE"; choice: MissionChoice; now: number }
  | { type: "FINISH"; reason: MissionState["terminalReason"]; now: number }
  | { type: "RESTART" };

export const initialMissionState: MissionState = { phase: "scenario_selection", scenarioId: null, startedAtMs: null, remainingSeconds: 90, hazardStartChunk: null, hazardChunks: 0, settledAtMs: null, choice: null, fieldAction: null, choiceResponseMs: null, eventLog: [], terminalReason: null };

const log = (state: MissionState, now: number, kind: MissionState["eventLog"][number]["kind"], title: string, detail: string) => [...state.eventLog, { id: `${now}-${state.eventLog.length}`, atMs: state.startedAtMs ? now - state.startedAtMs : 0, kind, title, detail }];

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case "SELECT": return { ...initialMissionState, phase: "briefing", scenarioId: action.scenarioId };
    case "CONNECT": return state.phase === "briefing" ? { ...state, phase: "connecting" } : state;
    case "CONNECTION_FAILED": return state.phase === "connecting" || state.phase === "staging" ? { ...state, phase: "briefing" } : state;
    case "STAGE": return state.phase === "connecting" ? { ...state, phase: "staging" } : state;
    case "START": return state.phase === "staging" ? { ...state, phase: "exploring", startedAtMs: action.now, eventLog: log(state, action.now, "system", "World online", "Mission clock started on generation confirmation.") } : state;
    case "TICK": {
      if (!state.startedAtMs || state.phase === "debrief") return state;
      return { ...state, remainingSeconds: Math.max(0, 90 - Math.floor((action.now - state.startedAtMs) / 1000)) };
    }
    case "TRIGGER_HAZARD": return state.phase === "exploring" ? { ...state, phase: "hazard_active", hazardStartChunk: action.chunk, hazardChunks: 0, eventLog: log(state, action.now, "incident", "Hazard active", "The environment changed in the current world session.") } : state;
    case "CHUNK": {
      if (state.phase !== "hazard_active") return state;
      const count = state.hazardChunks + 1;
      return count >= 2 ? { ...state, phase: "hazard_settled", hazardChunks: 2, settledAtMs: action.now, eventLog: log(state, action.now, "incident", "Hazard settled", "Persistent route change observed after two chunks.") } : { ...state, hazardChunks: count };
    }
    case "FIELD_ACTION": return ["exploring", "hazard_active", "hazard_settled", "consequence"].includes(state.phase) ? { ...state, fieldAction: action.action, eventLog: log(state, action.now, "tool", action.label, "Visual change queued for the next generated chunk.") } : state;
    case "CHOOSE": return state.phase === "hazard_settled" && !state.choice ? { ...state, phase: "consequence", choice: action.choice, choiceResponseMs: state.settledAtMs ? action.now - state.settledAtMs : 0, eventLog: log(state, action.now, "choice", `Response: ${action.choice}`, "One deterministic consequence prompt submitted.") } : state;
    case "FINISH": return state.phase === "debrief" ? state : { ...state, phase: "debrief", terminalReason: action.reason, eventLog: log(state, action.now, "outcome", "Mission ended", action.reason ?? "completed") };
    case "RESTART": return initialMissionState;
    default: return state;
  }
}
