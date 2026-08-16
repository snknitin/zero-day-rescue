"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { LingbotWorld2MainVideoView, useLingbotWorld2, useLingbotWorld2Message, type LingbotWorld2Message } from "@reactor-models/lingbot-world-2";
import { composeMissionPrompt } from "@/lib/mission/compose-mission-prompt";
import { initialMissionState, missionReducer } from "@/lib/mission/reducer";
import { getScenario, scenarios } from "@/lib/mission/scenarios";
import type { FieldActionId, IncidentPhase, MissionChoice } from "@/lib/mission/types";
import { SafetyDisclosure } from "@/components/mission/SafetyDisclosure";
import { invalidateReactorJwt } from "@/lib/reactor-token";
import { useMissionAudio } from "@/components/mission/useMissionAudio";

type MoveL = "idle" | "forward" | "back";
type MoveLat = "idle" | "strafe_left" | "strafe_right";
const activePhases = new Set(["exploring", "hazard_active", "hazard_settled", "consequence"]);

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function connectionErrorMessage(value: unknown) {
  const message = value instanceof Error ? value.message : String(value ?? "Connection failed");
  if (/429|no available capacity|no available servers/i.test(message)) {
    return "Reactor capacity is temporarily full. No session was started and no credits were used. Wait 20–30 seconds, then retry.";
  }
  if (/402|credit|billing/i.test(message)) return "Reactor credits are unavailable. Add credits or use an account with available balance, then retry.";
  if (/401|unauthori|authentication/i.test(message)) return "Reactor authentication failed. Check the server-side API key, restart the app, and retry.";
  if (/403|ICE servers/i.test(message)) return "Session authorization expired during WebRTC setup. A fresh session credential is ready; retry the mission.";
  return message;
}

export function MissionShell() {
  const lw2 = useLingbotWorld2();
  const { status, lastError, sendCommand, uploadFile } = lw2;
  const [mission, dispatch] = useReducer(missionReducer, initialMissionState);
  const scenario = mission.scenarioId ? getScenario(mission.scenarioId) : null;
  const audio = useMissionAudio(mission.scenarioId, mission.phase);
  const [hasImage, setHasImage] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [runtime, setRuntime] = useState<"WAITING" | "GENERATING" | "PAUSED">("WAITING");
  const [chunk, setChunk] = useState(0);
  const [stagingLabel, setStagingLabel] = useState("Securing session");
  const [error, setError] = useState<string | null>(null);
  const [settledAccepted, setSettledAccepted] = useState(false);
  const [mouseLook, setMouseLook] = useState(false);
  const [lastInputAt, setLastInputAt] = useState(Date.now());
  const [idleWarning, setIdleWarning] = useState(false);
  const [activeMove, setActiveMove] = useState("IDLE");
  const [toolStatus, setToolStatus] = useState<"idle" | "queued" | "applied">("idle");
  const stageRef = useRef<HTMLDivElement>(null);
  const stageStartedRef = useRef(false);
  const startSentRef = useRef(false);
  const finishingRef = useRef(false);
  const missionRef = useRef(mission);
  const scenarioRef = useRef(scenario);
  const pendingPromptRef = useRef<"base" | "active" | "settled" | "choice" | "tool" | null>(null);
  const announcedPhaseRef = useRef<string | null>(null);
  const moveLRef = useRef<Array<Exclude<MoveL, "idle">>>([]);
  const moveLatRef = useRef<Array<Exclude<MoveLat, "idle">>>([]);
  const lastLRef = useRef<MoveL>("idle");
  const lastLatRef = useRef<MoveLat>("idle");
  const lookHRef = useRef(0);
  const lookVRef = useRef(0);
  const pendingYawRef = useRef(0);
  const pendingPitchRef = useRef(0);
  const poseActiveRef = useRef(false);

  useEffect(() => { missionRef.current = mission; scenarioRef.current = scenario; }, [mission, scenario]);

  const incidentFor = useCallback((): IncidentPhase => {
    const phase = missionRef.current.phase;
    return phase === "hazard_active" ? "hazard_active" : phase === "hazard_settled" || phase === "consequence" ? "hazard_settled" : "normal";
  }, []);

  const sendPrompt = useCallback(async (kind: "base" | "active" | "settled" | "choice" | "tool", moving = moveLRef.current.length > 0 || moveLatRef.current.length > 0, fieldAction: FieldActionId | null = missionRef.current.fieldAction) => {
    const current = scenarioRef.current;
    if (!current || status !== "ready") return;
    pendingPromptRef.current = kind;
    await lw2.setPrompt({ prompt: composeMissionPrompt(current, moving, incidentFor(), missionRef.current.choice, fieldAction) });
  }, [incidentFor, sendCommand, status]);

  const pushMove = useCallback(() => {
    const longitudinal = moveLRef.current.at(-1) ?? "idle";
    const lateral = moveLatRef.current.at(-1) ?? "idle";
    if (longitudinal !== lastLRef.current) {
      lastLRef.current = longitudinal;
      if (status === "ready") lw2.setMoveLongitudinal({ move_longitudinal: longitudinal }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Movement command failed"));
    }
    if (lateral !== lastLatRef.current) {
      lastLatRef.current = lateral;
      if (status === "ready") lw2.setMoveLateral({ move_lateral: lateral }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Movement command failed"));
    }
    setActiveMove(longitudinal !== "idle" || lateral !== "idle" ? `${longitudinal} ${lateral}`.toUpperCase() : "IDLE");
    if (activePhases.has(missionRef.current.phase)) sendPrompt(pendingPromptRef.current ?? "base").catch(() => undefined);
  }, [sendCommand, sendPrompt, status]);

  const sendPose = useCallback(() => {
    if (status !== "ready") return;
    const yaw = Math.max(-0.2, Math.min(0.2, pendingYawRef.current * 0.0003 + lookHRef.current * 0.08));
    const pitch = Math.max(-0.2, Math.min(0.2, pendingPitchRef.current * 0.0003 + lookVRef.current * 0.08));
    pendingYawRef.current = 0;
    pendingPitchRef.current = 0;
    const active = mouseLook || lookHRef.current !== 0 || lookVRef.current !== 0 || yaw !== 0 || pitch !== 0;
    if (!active) {
      if (poseActiveRef.current) lw2.setCameraPose({ camera_pose: [] }).catch(() => undefined);
      poseActiveRef.current = false;
      return;
    }
    const pose = Array.from({ length: 3 }, () => [pitch, yaw, 0, 0, 0, 0]).flat();
    lw2.setCameraPose({ camera_pose: pose }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Look command failed"));
    poseActiveRef.current = true;
  }, [mouseLook, sendCommand, status]);

  const clearInputs = useCallback(() => {
    moveLRef.current = [];
    moveLatRef.current = [];
    lastLRef.current = "idle";
    lastLatRef.current = "idle";
    lookHRef.current = 0;
    lookVRef.current = 0;
    pendingYawRef.current = 0;
    pendingPitchRef.current = 0;
    setActiveMove("IDLE");
    if (status === "ready") {
      lw2.setMoveLongitudinal({ move_longitudinal: "idle" }).catch(() => undefined);
      lw2.setMoveLateral({ move_lateral: "idle" }).catch(() => undefined);
      lw2.setCameraPose({ camera_pose: [] }).catch(() => undefined);
    }
    poseActiveRef.current = false;
    if (document.pointerLockElement) document.exitPointerLock();
  }, [sendCommand, status]);

  const finish = useCallback(async (reason: "completed" | "timeout" | "retreat" | "error") => {
    if (finishingRef.current || missionRef.current.phase === "debrief") return;
    finishingRef.current = true;
    clearInputs();
    dispatch({ type: "FINISH", reason, now: Date.now() });
    try { if (status === "ready") await lw2.reset(); } catch { /* teardown continues */ }
    try { await lw2.disconnect(false); } catch { /* provider also owns unload cleanup */ }
    invalidateReactorJwt();
  }, [clearInputs, sendCommand, status]);

  const triggerHazard = useCallback(() => {
    if (missionRef.current.phase !== "exploring") return;
    dispatch({ type: "TRIGGER_HAZARD", chunk, now: Date.now() });
  }, [chunk]);

  const choose = useCallback((choice: MissionChoice) => {
    if (missionRef.current.phase !== "hazard_settled" || !settledAccepted) return;
    dispatch({ type: "CHOOSE", choice, now: Date.now() });
  }, [settledAccepted]);

  const applyFieldAction = useCallback(async (actionId: FieldActionId) => {
    const current = scenarioRef.current;
    const action = current?.fieldActions.find((item) => item.id === actionId);
    if (!action || status !== "ready" || !activePhases.has(missionRef.current.phase)) return;
    dispatch({ type: "FIELD_ACTION", action: actionId, label: action.label, now: Date.now() });
    setToolStatus("queued");
    audio.announce(action.radioCue);
    try { await sendPrompt("tool", undefined, actionId); } catch (e) { setError(e instanceof Error ? e.message : "Field tool failed"); }
  }, [audio, sendPrompt, status]);

  useLingbotWorld2Message((raw) => {
    const msg = raw as LingbotWorld2Message | { type: string; [key: string]: unknown };
    switch (msg.type) {
      case "image_accepted": setHasImage(true); setStagingLabel("Incident image accepted"); break;
      case "prompt_accepted": {
        setHasPrompt(true);
        if (pendingPromptRef.current === "settled") setSettledAccepted(true);
        if (pendingPromptRef.current === "tool") setToolStatus("applied");
        break;
      }
      case "conditions_ready": {
        const ready = msg as { has_image?: boolean; has_prompt?: boolean };
        setHasImage(Boolean(ready.has_image)); setHasPrompt(Boolean(ready.has_prompt)); setStagingLabel("Scenario conditions ready");
        break;
      }
      case "state": {
        const state = msg as { has_image?: boolean; has_prompt?: boolean; started?: boolean; running?: boolean; paused?: boolean };
        setHasImage(Boolean(state.has_image)); setHasPrompt(Boolean(state.has_prompt));
        setRuntime(state.paused ? "PAUSED" : state.started && state.running ? "GENERATING" : "WAITING");
        break;
      }
      case "generation_started":
        setRuntime("GENERATING");
        if (missionRef.current.phase === "staging") dispatch({ type: "START", now: Date.now() });
        break;
      case "chunk_complete": {
        const complete = msg as { chunk_index?: number };
        setChunk(complete.chunk_index ?? 0);
        if (missionRef.current.phase === "hazard_active") dispatch({ type: "CHUNK", now: Date.now() });
        sendPose();
        break;
      }
      case "generation_paused": setRuntime("PAUSED"); break;
      case "generation_resumed": setRuntime("GENERATING"); break;
      case "generation_reset": setRuntime("WAITING"); clearInputs(); break;
      case "command_error": {
        const commandError = msg as { command?: string; reason?: string };
        setError(`${commandError.command ?? "Model command"}: ${commandError.reason ?? "rejected"}`);
        break;
      }
      default: if (process.env.NODE_ENV === "development") console.debug("LingBot message", msg.type); break;
    }
  });

  useEffect(() => {
    if (mission.phase !== "connecting" || status !== "ready" || stageStartedRef.current || !scenario) return;
    stageStartedRef.current = true;
    dispatch({ type: "STAGE" });
    setStagingLabel("Loading incident image");
    (async () => {
      try {
        const response = await fetch(scenario.seedPath);
        if (!response.ok) throw new Error(`Local seed failed to load (${response.status})`);
        const blob = await response.blob();
        const file = new File([blob], `${scenario.id}-seed.png`, { type: blob.type || "image/png" });
        const ref = await uploadFile(file);
        await lw2.setImage({ image: ref });
        pendingPromptRef.current = "base";
        await lw2.setPrompt({ prompt: composeMissionPrompt(scenario, false, "normal", null) });
        setStagingLabel("Preparing scenario");
      } catch (e) { setError(e instanceof Error ? e.message : "Scenario staging failed"); }
    })();
  }, [mission.phase, scenario, sendCommand, status, uploadFile]);

  useEffect(() => {
    if (mission.phase !== "staging" || !hasImage || !hasPrompt || startSentRef.current || status !== "ready") return;
    startSentRef.current = true;
    setStagingLabel("World ready · starting generation");
    lw2.start().catch((e: unknown) => setError(e instanceof Error ? e.message : "Start failed"));
  }, [hasImage, hasPrompt, mission.phase, sendCommand, status]);

  useEffect(() => {
    if (mission.phase === "hazard_active") { setSettledAccepted(false); sendPrompt("active").catch((e) => setError(e.message)); }
    if (mission.phase === "hazard_settled") sendPrompt("settled").catch((e) => setError(e.message));
    if (mission.phase === "consequence") {
      sendPrompt("choice").catch((e) => setError(e.message));
      if (mission.choice === "retreat") window.setTimeout(() => finish("retreat"), 1600);
    }
  }, [finish, mission.choice, mission.phase, sendPrompt]);

  useEffect(() => {
    if (!scenario || !audio.enabled || announcedPhaseRef.current === mission.phase) return;
    const cue = mission.phase === "exploring" ? scenario.radio.briefing : mission.phase === "hazard_active" ? scenario.radio.hazard : mission.phase === "hazard_settled" ? scenario.radio.settled : null;
    if (cue) { announcedPhaseRef.current = mission.phase; audio.announce(cue); }
  }, [audio, mission.phase, scenario]);

  useEffect(() => {
    if (!lastError || !activePhases.has(mission.phase)) return;
    setError(lastError.recoverable ? `Live transport interrupted: ${lastError.message}. Your session can be reconnected.` : `Live transport ended: ${lastError.message}`);
  }, [lastError, mission.phase]);

  useEffect(() => {
    if (!mission.startedAtMs || mission.phase === "debrief") return;
    const id = window.setInterval(() => {
      const now = Date.now();
      dispatch({ type: "TICK", now });
      const elapsed = Math.floor((now - (missionRef.current.startedAtMs ?? now)) / 1000);
      if (elapsed >= 25 && missionRef.current.phase === "exploring") triggerHazard();
      if (elapsed >= 90) finish("timeout");
      const idle = Math.floor((now - lastInputAt) / 1000);
      setIdleWarning(idle >= 45);
      if (idle >= 60) finish("timeout");
    }, 1000);
    return () => clearInterval(id);
  }, [finish, lastInputAt, mission.phase, mission.startedAtMs, triggerHazard]);

  useEffect(() => {
    const typing = (target: EventTarget | null) => target instanceof HTMLElement && (["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName) || target.isContentEditable);
    const down = (event: KeyboardEvent) => {
      if (event.repeat || typing(event.target) || !activePhases.has(missionRef.current.phase)) return;
      setLastInputAt(Date.now()); setIdleWarning(false);
      const key = event.key.toLowerCase();
      const l = key === "w" ? "forward" : key === "s" ? "back" : null;
      const lat = key === "a" ? "strafe_left" : key === "d" ? "strafe_right" : null;
      if (l) { event.preventDefault(); if (!moveLRef.current.includes(l)) moveLRef.current.push(l); pushMove(); return; }
      if (lat) { event.preventDefault(); if (!moveLatRef.current.includes(lat)) moveLatRef.current.push(lat); pushMove(); return; }
      if (event.key.startsWith("Arrow")) { event.preventDefault(); if (document.pointerLockElement) document.exitPointerLock(); lookHRef.current = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0; lookVRef.current = event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0; sendPose(); return; }
      if (["1", "2", "3"].includes(event.key) && missionRef.current.phase === "hazard_settled") choose(({ "1": "scan", "2": "assist", "3": "retreat" } as const)[event.key as "1" | "2" | "3"]);
    };
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "s") { const value = key === "w" ? "forward" : "back"; moveLRef.current = moveLRef.current.filter((x) => x !== value); pushMove(); }
      if (key === "a" || key === "d") { const value = key === "a" ? "strafe_left" : "strafe_right"; moveLatRef.current = moveLatRef.current.filter((x) => x !== value); pushMove(); }
      if (event.key.startsWith("Arrow")) { lookHRef.current = 0; lookVRef.current = 0; sendPose(); }
    };
    const blur = () => clearInputs();
    const visibility = () => { if (document.hidden) clearInputs(); };
    window.addEventListener("keydown", down); window.addEventListener("keyup", up); window.addEventListener("blur", blur); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); document.removeEventListener("visibilitychange", visibility); clearInputs(); };
  }, [choose, clearInputs, pushMove, sendPose]);

  useEffect(() => {
    const change = () => { const locked = document.pointerLockElement === stageRef.current; setMouseLook(locked); if (!locked) sendPose(); };
    const move = (event: MouseEvent) => { if (document.pointerLockElement !== stageRef.current) return; pendingYawRef.current += event.movementX; pendingPitchRef.current += event.movementY; setLastInputAt(Date.now()); };
    document.addEventListener("pointerlockchange", change); document.addEventListener("mousemove", move);
    return () => { document.removeEventListener("pointerlockchange", change); document.removeEventListener("mousemove", move); };
  }, [sendPose]);

  const begin = async () => {
    if (!scenario || mission.phase !== "briefing") return;
    finishingRef.current = false; stageStartedRef.current = false; startSentRef.current = false; setHasImage(false); setHasPrompt(false); setError(null); setLastInputAt(Date.now());
    dispatch({ type: "CONNECT" }); setStagingLabel("Securing session");
    try {
      await lw2.connect();
    } catch (e) {
      setError(connectionErrorMessage(e));
      try { await lw2.disconnect(false); } catch { /* no session may exist */ }
      invalidateReactorJwt();
      dispatch({ type: "CONNECTION_FAILED" });
    }
  };

  const toggleAudio = async () => {
    const willEnable = !audio.enabled;
    await audio.toggle();
    if (willEnable && scenario) audio.announce(scenario.radio.briefing);
  };

  const recoverTransport = async () => {
    setError(null);
    try { await lw2.reconnect({ maxAttempts: 3 }); }
    catch (e) { setError(connectionErrorMessage(e)); }
  };

  const restart = () => {
    clearInputs(); void audio.disable(); finishingRef.current = false; stageStartedRef.current = false; startSentRef.current = false; setError(null); setSettledAccepted(false); setToolStatus("idle"); announcedPhaseRef.current = null; dispatch({ type: "RESTART" });
  };

  const connectionLabel = status === "ready" ? "READY" : status === "waiting" ? "WAITING FOR GPU" : status.toUpperCase();
  const selectedChoice = scenario?.choices.find((item) => item.id === mission.choice);
  const elapsed = mission.startedAtMs ? Math.max(0, 90 - mission.remainingSeconds) : 0;

  if (mission.phase === "scenario_selection") return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10 px-6 py-5"><div className="mx-auto max-w-7xl"><p className="text-xs tracking-[0.28em] text-amber-300">ZERO-DAY RESCUE</p><h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Incident rehearsal, generated live.</h1><p className="mt-3 max-w-2xl text-zinc-400">Choose a 90-second mission. One shared engine turns each response brief into a navigable world.</p></div></header>
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-8 md:grid-cols-3">
        {scenarios.map((item) => <button key={item.id} onClick={() => dispatch({ type: "SELECT", scenarioId: item.id })} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-left transition hover:-translate-y-1 hover:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-300">
          <div className="relative aspect-video overflow-hidden"><img src={item.seedPath} alt={`${item.title} incident seed`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-200">{item.eyebrow}</span></div>
          <div className="p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{item.title}</h2><span className="font-mono text-xs text-zinc-500">90 SEC</span></div><p className="mt-2 text-sm leading-6 text-zinc-400">{item.shortDescription}</p><p className="mt-4 text-xs uppercase tracking-wider text-amber-300">Open briefing →</p></div>
        </button>)}
      </section><footer className="mx-auto max-w-7xl px-6 pb-6"><SafetyDisclosure /></footer>
    </main>
  );

  if (mission.phase === "briefing" && scenario) return (
    <main className="min-h-screen bg-[#07090c] text-white"><div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-8 lg:grid-cols-[1.15fr_.85fr]">
      <div className="overflow-hidden rounded-2xl border border-white/10"><img src={scenario.seedPath} alt={scenario.title} className="aspect-video w-full object-cover"/></div>
      <div><button onClick={restart} className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white">← Incident library</button><p className="mt-7 text-xs uppercase tracking-[.25em] text-amber-300">{scenario.eyebrow}</p><h1 className="mt-2 text-5xl font-semibold">{scenario.title}</h1><p className="mt-4 text-lg text-zinc-300">{scenario.objective}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-zinc-500">CONTROLS</p><p className="mt-2 font-mono text-sm">WASD move · Arrows/mouse look</p><button onClick={toggleAudio} className={`mt-4 rounded-lg border px-3 py-2 text-xs ${audio.enabled ? "border-emerald-400/50 text-emerald-300" : "border-white/15 text-zinc-300"}`}>{audio.enabled ? "🔊 Mission audio on" : "🔇 Enable mission audio"}</button><p className="mt-2 text-[10px] text-zinc-500">Local ambience + radio voice cues</p></div><div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-zinc-500">LANDMARKS</p>{scenario.landmarks.map((l) => <p key={l} className="mt-1 text-sm">• {l}</p>)}</div></div>
        {error && <div role="alert" className="mt-6 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100"><p>{error}</p><p className="mt-2 text-xs text-amber-200/70">Capacity is assigned by Reactor; retrying creates a fresh request.</p></div>}
        <button onClick={begin} className="mt-7 w-full rounded-xl bg-amber-300 px-5 py-4 font-semibold text-black hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-white">{error ? "Retry mission" : "Start mission"}</button><div className="mt-5"><SafetyDisclosure /></div>
      </div></div>
    </main>
  );

  if (mission.phase === "debrief" && scenario) return (
    <main className="min-h-screen bg-[#07090c] px-6 py-8 text-white"><div className="mx-auto max-w-4xl"><p className="text-xs tracking-[.25em] text-amber-300">AFTER-ACTION DEBRIEF</p><h1 className="mt-2 text-4xl font-semibold">{scenario.title} complete</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-zinc-900 p-5"><p className="text-xs text-zinc-500">RESPONSE</p><p className="mt-2 text-2xl">{selectedChoice?.label ?? "No response"}</p></div><div className="rounded-xl border border-white/10 bg-zinc-900 p-5"><p className="text-xs text-zinc-500">SCENARIO SCORE</p><p className="mt-2 text-2xl">{selectedChoice?.scoreDelta ?? 0}</p></div><div className="rounded-xl border border-white/10 bg-zinc-900 p-5"><p className="text-xs text-zinc-500">RESPONSE TIME</p><p className="mt-2 text-2xl">{mission.choiceResponseMs !== null ? `${(mission.choiceResponseMs / 1000).toFixed(1)}s` : "—"}</p></div></div>
      <p className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-5 text-zinc-300">{selectedChoice?.feedback ?? `Mission ended: ${mission.terminalReason}. No model-generated safety judgment was used.`}</p>
      <div className="mt-6 rounded-xl border border-white/10 p-5"><h2 className="text-sm font-semibold uppercase tracking-wider">Event timeline</h2>{mission.eventLog.map((entry) => <div key={entry.id} className="mt-4 grid grid-cols-[64px_1fr] gap-3 border-t border-white/5 pt-4"><span className="font-mono text-xs text-amber-300">+{Math.round(entry.atMs / 1000)}s</span><div><p className="text-sm font-medium">{entry.title}</p><p className="text-xs text-zinc-500">{entry.detail}</p></div></div>)}</div>
      <button onClick={restart} className="mt-7 rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200">Run another incident</button><div className="mt-6"><SafetyDisclosure /></div>
    </div></main>
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#07090c] text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6"><div><span className="text-xs tracking-[.24em] text-amber-300">ZERO-DAY RESCUE</span><span className="ml-4 text-xs text-zinc-500">{scenario?.title.toUpperCase()} / LIVE WORLD</span></div><div className="flex items-center gap-4 font-mono text-xs"><button onClick={toggleAudio} className={audio.enabled ? "text-emerald-300" : "text-zinc-500"}>{audio.enabled ? "🔊 AUDIO" : "🔇 AUDIO"}</button><span className="text-xl text-white">{formatTime(mission.remainingSeconds)}</span><span className={status === "ready" ? "text-emerald-400" : "text-amber-300"}>● {connectionLabel}</span></div></header>
      <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section className="p-3 sm:p-5"><div ref={stageRef} onClick={() => activePhases.has(mission.phase) && stageRef.current?.requestPointerLock()} className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
          <LingbotWorld2MainVideoView videoObjectFit="contain" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>
          {(mission.phase === "connecting" || mission.phase === "staging") && <div className="absolute inset-0 grid place-items-center bg-black/75"><div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-300"/><p className="mt-4 text-sm">{status === "waiting" ? "Waiting for world engine" : stagingLabel}</p><button onClick={(e) => { e.stopPropagation(); finish("error"); }} className="mt-4 text-xs text-zinc-400 underline">Cancel</button></div></div>}
          {activePhases.has(mission.phase) && <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/65 px-3 py-2 font-mono text-[11px] text-zinc-300">{mouseLook ? "MOUSE LOOK ACTIVE · ESC TO RELEASE" : "CLICK VIEW FOR MOUSE LOOK"} · {activeMove}</div>}
          {mission.phase === "hazard_active" && <div className="absolute left-3 top-3 rounded bg-red-600/90 px-3 py-2 text-xs font-semibold tracking-wider">{scenario?.hazardLabel}</div>}
        </div><div className="mt-3 flex items-center justify-between gap-4"><SafetyDisclosure /><button onClick={() => finish("completed")} className="shrink-0 rounded border border-white/15 px-3 py-2 text-xs hover:bg-white/5">Finish mission</button></div></section>
        <aside className="border-t border-white/10 bg-zinc-950 p-5 lg:border-l lg:border-t-0"><p className="text-[10px] tracking-[.2em] text-zinc-500">CURRENT OBJECTIVE</p><p className="mt-2 text-lg font-medium">{scenario?.objective}</p>
          <div className="mt-6 border-t border-white/10 pt-5"><p className="text-[10px] tracking-[.2em] text-zinc-500">LANDMARKS</p>{scenario?.landmarks.map((l) => <p key={l} className="mt-2 text-sm text-zinc-300">◇ {l}</p>)}</div>
          <div className="mt-6 border-t border-white/10 pt-5"><p className="text-[10px] tracking-[.2em] text-zinc-500">INCIDENT</p><p className={`mt-2 font-mono text-sm ${mission.phase === "hazard_active" ? "text-red-400" : "text-amber-300"}`}>{mission.phase === "exploring" ? `MONITORING · T+${elapsed}s` : mission.phase === "hazard_active" ? `${scenario?.hazardLabel} · CHUNK ${mission.hazardChunks + 1}/2` : mission.phase === "hazard_settled" || mission.phase === "consequence" ? "ROUTE CHANGE SETTLED" : stagingLabel}</p>
            {mission.phase === "exploring" && <button onClick={triggerHazard} className="mt-3 rounded border border-amber-300/30 px-3 py-2 text-xs text-amber-200 hover:bg-amber-300/10">Trigger now</button>}</div>
          <div className="mt-6 border-t border-white/10 pt-5"><div className="flex items-center justify-between"><p className="text-[10px] tracking-[.2em] text-zinc-500">ROBOT FIELD TOOLS</p><span className="font-mono text-[9px] text-amber-300">{toolStatus === "queued" ? "NEXT CHUNK" : toolStatus === "applied" ? "APPLIED" : "READY"}</span></div><div className="mt-3 grid grid-cols-2 gap-2">{scenario?.fieldActions.map((action) => <button key={action.id} disabled={!activePhases.has(mission.phase) || status !== "ready"} onClick={() => applyFieldAction(action.id)} title={action.description} className={`rounded-lg border px-3 py-3 text-left text-xs hover:border-amber-300/50 disabled:opacity-35 ${mission.fieldAction === action.id ? "border-amber-300/60 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[.03]"}`}><span className="block font-medium">{action.label}</span><span className="mt-1 block text-[10px] text-zinc-500">{action.description}</span></button>)}</div></div>
          <div className="mt-6 border-t border-white/10 pt-5"><p className="text-[10px] tracking-[.2em] text-zinc-500">RESPONSE</p><div className="mt-3 grid gap-2">{scenario?.choices.map((choice) => <button key={choice.id} disabled={mission.phase !== "hazard_settled" || !settledAccepted || Boolean(mission.choice)} onClick={() => choose(choice.id)} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[.03] px-4 py-3 text-left text-sm hover:border-amber-300/50 disabled:cursor-not-allowed disabled:opacity-35"><span>{choice.label}</span><kbd className="font-mono text-zinc-500">{choice.shortcut}</kbd></button>)}</div></div>
          {idleWarning && <p role="alert" className="mt-5 rounded border border-amber-300/30 bg-amber-300/10 p-3 text-xs text-amber-100">No input for 45 seconds. Session will finish at 60 seconds idle.</p>}
          {error && <div role="alert" className="mt-5 rounded border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200"><p>{error}</p>{lastError?.recoverable ? <button onClick={recoverTransport} className="mt-2 underline">Retry transport (3 attempts)</button> : <button onClick={() => { setError(null); if (status === "disconnected") restart(); }} className="mt-2 underline">{status === "disconnected" ? "Return to library" : "Dismiss"}</button>}</div>}
          <div className="mt-6 text-[10px] text-zinc-600">MODEL {runtime} · CHUNK {chunk} · INPUTS {hasImage && hasPrompt ? "READY" : "STAGING"}</div>
        </aside>
      </div>
      <div aria-live="polite" className="sr-only">{mission.phase === "hazard_active" ? scenario?.hazardLabel : mission.phase === "hazard_settled" ? "Hazard settled. Response choices available." : ""}</div>
    </main>
  );
}
