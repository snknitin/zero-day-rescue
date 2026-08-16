import type { FieldActionId, IncidentId, IncidentPhase, MissionChoice, ScenarioDefinition } from "@/lib/mission/types";

const camera = {
  static: "First-person viewpoint. While controls are idle, hold position, heading, exposure, foreground, and landmark geometry steady.",
  dynamic: "First-person viewpoint. Respond smoothly only to held movement or look controls; preserve exposure, foreground, and landmark identity.",
};

export function composeMissionPrompt(
  scenario: ScenarioDefinition,
  moving: boolean,
  incidentPhase: IncidentPhase,
  incidentId: IncidentId | null,
  settledIncidentIds: IncidentId[] = [],
  fieldActionIds: FieldActionId[] = [],
  choice: MissionChoice | null = null,
) {
  const parts = [scenario.prompt.base, moving ? camera.dynamic : camera.static];
  // Keep only the most recent settled event in model conditioning. The app
  // retains the complete exercise history without overloading the video model.
  for (const settledId of settledIncidentIds.slice(-1)) {
    const settled = scenario.incidents.find((item) => item.id === settledId);
    if (settled) parts.push(settled.prompt.settled);
  }
  const incident = scenario.incidents.find((item) => item.id === incidentId);
  if (incidentPhase === "hazard_active" && incident) parts.push(incident.prompt.active);
  if (incidentPhase === "hazard_settled" && incident) parts.push(incident.prompt.settled);
  const latestAction = scenario.fieldActions.find((item) => item.id === fieldActionIds.at(-1));
  if (latestAction) parts.push(latestAction.prompt);
  const response = scenario.choices.find((item) => item.id === choice);
  if (response) parts.push(response.prompt);
  const prompt = parts.join(" ").trim();
  if (prompt.length >= 2000) throw new Error(`Mission prompt exceeds 2,000 characters (${prompt.length})`);
  return prompt;
}
