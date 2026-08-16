# Zero-Day Rescue

Zero-Day Rescue is a browser-based disaster-response rehearsal demo powered by Reactor LingBot World 2. Choose **Aftershock**, **Rising Water**, or **Ember Front**, operate scenario-specific robot equipment, inject a plausible environmental event as the Scenario Director, select an incident-specific response, and review the after-action debrief.

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
- `1`, `2`, `3`: the three scenario-specific response decisions shown after an event settles

Each mission lasts three minutes. Robot interventions and Director events are deliberately separate: the robot can deploy shoring, pumps, tethers, wet lines, sensors, and shields as deterministic mission state shown in the telemetry HUD. These controls do not recondition the generated video. Environmental changes come only from scenario-grounded Director events such as a cracked ceiling failure, existing flood debris, or a scorched branch fall. Director events remain probabilistic full-prompt replacements applied at LingBot chunk boundaries, not deterministic game-engine physics.

There is no separate idle shutdown. A live session runs until the three-minute mission clock ends, the operator presses **Finish mission**, or an unrecoverable transport error requires teardown. Recoverable WebRTC interruptions use the existing session, restore its scenario conditions, and resume generation.

For long-session quality, every composed prompt restates seed-backed landmarks, only the most recent settled event remains in model conditioning, movement/tools/responses never resend the prompt, and Director events hold their active state for at least six seconds and four rendered chunks before an explicit settled state. `set_kv_cache_reset` stays in `auto`; abrupt one-shot cache resets are not used during an event. Radio cues queue locally, and settled narration waits for a settled video chunk. Once a visibly bad frame has entered an autoregressive stream it may persist; finish and start a clean mission before recording rather than evaluating prompt changes from an already degraded run.

This is a cinematic visual-rehearsal layer, not robot-training data. A real training stack needs a deterministic simulator such as Isaac Sim or Gazebo, a ROS control loop, repeatable geometry/physics, and sensor ground truth. LingBot is useful for incident ideation and presentation, not for validating a navigation or rescue policy.

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
- [`lib/mission/scenarios/index.ts`](lib/mission/scenarios/index.ts): three typed scenario definitions, each with four robot interventions, three Director events, and three unique responses.
- [`lib/mission/reducer.ts`](lib/mission/reducer.ts): deterministic mission state machine.
- [`lib/mission/compose-mission-prompt.ts`](lib/mission/compose-mission-prompt.ts): full replacement prompt composition.
- [`app/api/reactor/token/route.ts`](app/api/reactor/token/route.ts): server-side exchange for a short-lived JWT scoped only to `reactor/lingbot-world-2`.
- [`public/scenarios`](public/scenarios): local seed images; no runtime image URL dependency.
- [`research/ASSET_PROVENANCE.md`](research/ASSET_PROVENANCE.md): source and asset-quality notes.

The browser never receives `REACTOR_API_KEY`. The product provides generated rehearsal, not a map, structural model, digital twin, safety certification, or validated training tool.
