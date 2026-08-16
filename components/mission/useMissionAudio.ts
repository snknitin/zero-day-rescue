"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MissionPhase, ScenarioId } from "@/lib/mission/types";

type AudioNodes = { context: AudioContext; gain: GainNode };

export function useMissionAudio(scenarioId: ScenarioId | null, phase: MissionPhase) {
  const nodesRef = useRef<AudioNodes | null>(null);
  const [enabled, setEnabled] = useState(false);

  const announce = useCallback((text: string) => {
    if (!nodesRef.current || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 0.9;
    utterance.volume = 0.92;
    window.speechSynthesis.speak(utterance);
  }, []);

  const disable = useCallback(async () => {
    window.speechSynthesis?.cancel();
    const nodes = nodesRef.current;
    nodesRef.current = null;
    setEnabled(false);
    if (nodes) await nodes.context.close().catch(() => undefined);
  }, []);

  const enable = useCallback(async () => {
    if (nodesRef.current) return;
    const context = new AudioContext();
    await context.resume();
    const master = context.createGain();
    master.gain.value = 0.055;
    master.connect(context.destination);

    const oscillator = context.createOscillator();
    oscillator.type = scenarioId === "aftershock" ? "sine" : "triangle";
    oscillator.frequency.value = scenarioId === "aftershock" ? 38 : scenarioId === "rising-water" ? 82 : 115;
    const lowGain = context.createGain();
    lowGain.gain.value = scenarioId === "aftershock" ? 0.42 : 0.12;
    oscillator.connect(lowGain).connect(master);
    oscillator.start();

    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = scenarioId === "ember-front" ? "bandpass" : "lowpass";
    filter.frequency.value = scenarioId === "rising-water" ? 620 : scenarioId === "ember-front" ? 1450 : 180;
    const noiseGain = context.createGain();
    noiseGain.gain.value = scenarioId === "aftershock" ? 0.13 : 0.3;
    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();

    nodesRef.current = { context, gain: master };
    setEnabled(true);
  }, [scenarioId]);

  const toggle = useCallback(async () => {
    if (nodesRef.current) await disable(); else await enable();
  }, [disable, enable]);

  useEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const intense = phase === "hazard_active";
    nodes.gain.gain.setTargetAtTime(intense ? 0.1 : 0.055, nodes.context.currentTime, 0.3);
  }, [phase]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); void nodesRef.current?.context.close(); }, []);

  return { enabled, toggle, announce, disable };
}
