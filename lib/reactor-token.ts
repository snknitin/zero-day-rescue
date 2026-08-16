"use client";

type CachedToken = { jwt: string; expiresAt: number };

let cachedToken: CachedToken | null = null;
let pendingToken: Promise<CachedToken> | null = null;

export function invalidateReactorJwt() {
  cachedToken = null;
  pendingToken = null;
}

export async function getReactorJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.jwt;
  if (pendingToken) return (await pendingToken).jwt;

  pendingToken = (async () => {
    const response = await fetch("/api/reactor/token", { cache: "no-store" });
    const body = (await response.json().catch(() => ({}))) as {
      jwt?: string;
      expiresAt?: number;
      error?: string;
    };
    if (!response.ok || !body.jwt || !body.expiresAt) {
      throw new Error(body.error ?? `Session token failed (${response.status})`);
    }
    cachedToken = { jwt: body.jwt, expiresAt: body.expiresAt };
    return cachedToken;
  })();

  try {
    return (await pendingToken).jwt;
  } finally {
    pendingToken = null;
  }
}

