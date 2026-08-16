"use client";

import { LingbotWorld2Provider } from "@reactor-models/lingbot-world-2";
import { MissionShell } from "@/components/mission/MissionShell";
import { getReactorJwt } from "@/lib/reactor-token";

const API_URL = process.env.NEXT_PUBLIC_COORDINATOR_URL ?? "https://api.reactor.inc";

export function LingbotWorld2App() {
  return <LingbotWorld2Provider apiUrl={API_URL} getJwt={getReactorJwt}><MissionShell /></LingbotWorld2Provider>;
}
