import type { FieldActionId, IncidentPhase, MissionChoice, ScenarioDefinition } from "@/lib/mission/types";

const camera = {
  static: "Strict first-person rescue-robot view. The viewpoint remains stationary when no movement input is held. Look-input is the only source of camera rotation; the three fixed landmarks retain their relative positions.",
  dynamic: "Strict first-person rescue-robot view. Movement input advances through the site only while held; look-input changes heading. The three named landmarks remain persistent spatial anchors as the viewpoint travels.",
};

export function composeMissionPrompt(scenario: ScenarioDefinition, moving: boolean, incident: IncidentPhase, choice: MissionChoice | null, fieldAction: FieldActionId | null = null) {
  const parts = [scenario.prompt.base, moving ? camera.dynamic : camera.static];
  if (incident === "hazard_active") parts.push(scenario.prompt.incident.active);
  if (incident === "hazard_settled") parts.push(scenario.prompt.incident.settled);
  if (choice) parts.push(scenario.prompt.consequences[choice]);
  if (fieldAction) parts.push(scenario.fieldActions.find((item) => item.id === fieldAction)?.prompt ?? "");
  const prompt = parts.join(" ").trim();
  if (prompt.length >= 2000) throw new Error(`Mission prompt exceeds 2,000 characters (${prompt.length})`);
  return prompt;
}
