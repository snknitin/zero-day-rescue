# Zero-Day Rescue

Zero-Day Rescue is a browser-based disaster-response rehearsal demo powered by Reactor LingBot World 2. Choose **Aftershock**, **Rising Water**, or **Ember Front**, navigate the generated site, trigger a live hazard, select a deterministic response, and review the after-action debrief.

## Run on Windows

Prerequisites: Node.js and `pnpm`, plus a Reactor API key with available credits.

From PowerShell in this repository:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and set the server-only key:

```text
REACTOR_API_KEY=rk_your_real_key
```

Then install and start the development server:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Select a scenario and click **Start mission**. Starting creates a remote Reactor session and uses account credits.

For a judge-ready recording, follow [DEMO_SCRIPT.md](./DEMO_SCRIPT.md). Mission audio is opt-in and generated locally by the browser (ambient synthesis plus dispatch/survivor speech). LingBot World 2 exposes a video track but no audio track, so the app labels this instead of presenting it as model-native output.

Controls:

- `WASD`: movement
- Arrow keys: look
- Click the video: mouse look; `Esc` releases it
- `1`, `2`, `3`: Scan, Assist, Retreat when the response phase unlocks

## Production check

Do not run this while `pnpm dev` is still running, because both commands use `.next`:

```powershell
pnpm build
pnpm start
```

Use either the development pair (`pnpm dev`) or the production pair (`pnpm build` then `pnpm start`), not both simultaneously in the same workspace.

## Repair a missing `.next` chunk

An error such as `Cannot find module './299.js'` means the generated Next.js cache is stale or was replaced while a server was running.

1. Stop the running server with `Ctrl+C`.
2. Remove only the generated cache:

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
```

3. Restart:

```powershell
pnpm dev
```

Never remove `app`, `components`, `lib`, `public`, or your environment files for this repair.

## Reactor connection errors

- `429 no available capacity`: Reactor currently has no free model server. No session started; wait 20–30 seconds and use **Retry mission**.
- `403` during session polling or ICE setup: reload once, then retry. The app keeps one scoped JWT for all requests belonging to a session and rotates it after teardown or failure.
- `402`: the Reactor account needs credits.

## Architecture

- [`components/mission/MissionShell.tsx`](components/mission/MissionShell.tsx): shared mission UI, Reactor lifecycle, controls, timer, hazard sequencing, errors, and teardown.
- [`lib/mission/scenarios/index.ts`](lib/mission/scenarios/index.ts): the three typed scenario definitions.
- [`lib/mission/reducer.ts`](lib/mission/reducer.ts): deterministic mission state machine.
- [`lib/mission/compose-mission-prompt.ts`](lib/mission/compose-mission-prompt.ts): full replacement prompt composition.
- [`app/api/reactor/token/route.ts`](app/api/reactor/token/route.ts): server-side exchange for a short-lived JWT scoped only to `reactor/lingbot-world-2`.
- [`public/scenarios`](public/scenarios): local seed images; no runtime image URL dependency.
- [`research/ASSET_PROVENANCE.md`](research/ASSET_PROVENANCE.md): source and asset-quality notes.

The browser never receives `REACTOR_API_KEY`. The product provides generated rehearsal, not a map, structural model, digital twin, safety certification, or validated training tool.
