# ZERO-DAY RESCUE — implementation build specification

> Status: implementation-ready MVP specification  
> Primary model: Reactor LingBot World 2  
> Product slice: a three-incident scenario library with **Aftershock** as the featured 90-second mission  
> Repository: `snknitin/zero-day-rescue`  
> Last model-contract verification: 2026-08-16

## 0. Instructions for the implementing Codex session

Implement this specification in the existing repository. Use the `reactor-world-models` skill and refresh the current LingBot World 2 overview, schema, prompt guide, and tutorial before changing SDK-facing code.

Preserve the working Reactor reference integration. Refactor it incrementally into the product; do not replace the provider, token route, video track, layered prompt composition, or keyboard/camera-pose logic with an untested rewrite.

Required working rules:

1. Inspect the repository and run the current build before editing.
2. Never read, print, transmit, commit, or expose the value in `.env` or `.env.local`.
3. Preserve unrelated user changes. The current worktree may contain a deliberate deletion of `.env.example`; recreate only a placeholder example without touching `.env`.
4. Keep the Reactor API key server-side. Browser code receives only a scoped JWT.
5. Treat the model's `state` snapshot as authoritative and `command_error` as separate from SDK/transport errors.
6. Keep all key-down controls paired with key-up, blur, reset, and unmount cleanup.
7. Complete the Must Ship scope and its acceptance tests before attempting stretch work.
8. Run `pnpm build` after implementation. Perform a live smoke test only when the configured Reactor key and credits allow it.
9. Do not deploy or make the repository public unless the user separately authorizes it.

Suggested goal invocation:

```text
/goal Implement BUILD_SPEC.md using the reactor-world-models skill. Complete and verify every Must Ship acceptance criterion. Preserve secrets and existing working Reactor behavior.
```

## 1. Outcome

Build a polished browser product in which a user selects one of three realistic disaster incidents, teleoperates a rescue robot through the continuously generated site, experiences a hazard that visibly changes the world without a scene cut, selects a response, and receives a deterministic after-action debrief.

The product must feel like a reusable incident-rehearsal platform rather than a single prompt demo. Scenario content is data-driven: each scenario contributes a source-backed visual brief, an original photorealistic seed image, fixed landmarks, prompt phases, response choices, and debrief copy to one shared runtime.

The product should communicate this loop in under 90 seconds:

> Choose incident → connect → enter generated site → navigate → hazard changes the route → choose Scan, Assist, or Retreat → observe a visual consequence → finish → debrief.

The world model is the live visual environment. The application owns mission timing, objectives, choices, scoring, safety copy, and event sequencing. No outcome is inferred from generated pixels.

### One-line pitch

**Turn real disaster patterns into explorable response scenarios—without constructing a new 3D level for every incident or branch.**

### Must Ship

- Three selectable, complete scenarios: **Aftershock**, **Rising Water**, and **Ember Front**.
- One shared scenario engine; no duplicated page/controller implementation per scenario.
- Three original, photorealistic seed images grounded in documented real-world references.
- A scenario-selection screen with high-quality image cards and concise hazard briefs.
- Prepared scenario seeds loaded locally from the repository; no runtime dependency on remote image URLs.
- LingBot World 2 connection, conditions, generation, and cleanup.
- Working WASD navigation and existing arrow/mouse look behavior.
- Full replacement prompt transition for each scenario's brief active hazard.
- Automatic transition from transient hazard motion to a settled, persistently changed environment.
- Three deterministic response choices: Scan, Assist, Retreat.
- Mission timer, objective rail, event log, debrief, restart, and visible error recovery.
- Persistent disclosure: generated rehearsal, not a map, digital twin, structural model, or safety certification.
- Responsive keyboard-and-mouse UX suitable for a laptop judging demo.

### Non-goals

- Validated physics, structural prediction, fire/smoke propagation, or medical simulation.
- Computer-vision scoring of where the player looked or what the video contains.
- Real facility geometry, floor-plan accuracy, mapping, localization, or collision guarantees.
- Accounts, multiplayer, database, cloud persistence, instructor networking, or an LLM curriculum.
- Procedural mission authoring, HappyOyster, LTX, voice input, or an avatar.
- Replacing the generated stream with a prerecorded video while retaining world-model claims.
- Claiming that the prototype trains or certifies real emergency-response competence.

## 2. Existing baseline and constraints

The repository is the official LingBot World 2 Next.js reference frontend plus Zero-Day Rescue research and assets.

Current stack:

- Next.js 15 App Router
- React 19 and TypeScript
- `pnpm`
- `@reactor-models/lingbot-world-2` currently resolved to `0.2.5`
- `@reactor-team/js-sdk` currently resolved to `2.12.0`
- `@reactor-team/ui`
- Tailwind CSS and existing shadcn-style components

Current reusable implementation:

- `app/api/reactor/token/route.ts`: server-side, model-scoped JWT broker.
- `app/LingbotWorld2App.tsx`: typed provider, status bar, video view, controller shell.
- `components/lingbot-world-2/LingbotWorldController.tsx`: proven lifecycle, input stacks, camera pose, layered prompt changes, state messages, reset, and errors.
- `lib/lingbot-world-prompts.ts`: layered prompt composition.
- `components/SnapClip.tsx`: optional clip capture; retain only if it does not distract from the mission.
- `assets/lingbot-world-2/zero-day-rescue-corridor-reference.png`: approved seed image.

Implementation should retain the lockfile and use exact installed versions. If `package.json` ranges are changed, pin the current verified versions rather than upgrading during the hackathon. Do not upgrade Reactor packages unless required by a documented incompatibility.

## 3. Model decision record

| Field | Decision |
| --- | --- |
| Chosen model | LingBot World 2 |
| Model ID | `reactor/lingbot-world-2` |
| Typed package | `@reactor-models/lingbot-world-2` |
| Inputs | Required reference image, required prompt, persistent movement/look/camera commands |
| Output | Receive-only `main_video`; current docs state 1664 × 960 at 48 fps |
| Runtime | Connection `disconnected → connecting → waiting → ready`; model `WAITING → GENERATING ↔ PAUSED`, `reset → WAITING` |
| Interaction timing | Commands and prompt replacements become visible at chunk boundaries |
| Product match | Image-anchored world, two-axis navigation, native look/camera controls, and live prompt replacement coexist in one session |

Nearest alternatives are rejected for the MVP:

- **HappyOyster Adventure:** persistent worlds and semantic actions are attractive, but free-form direction and rewind belong to a separate Directing mode. It does not currently prove the exact combination of arbitrary live aftershock injection and Adventure navigation required here.
- **LingBot:** similar navigation shape but lacks LingBot World 2's richer two-axis and native camera-pose surface.
- **Helios:** supports continuous prompt-driven generation but is not the same WASD-navigable experience.
- **LTX:** talking-avatar generator, suitable only for optional briefing/debrief media.

Official references:

- [LingBot World 2 overview](https://docs.reactor.inc/model-api-reference/lingbot-world-2/overview)
- [Schema](https://docs.reactor.inc/model-api-reference/lingbot-world-2/schema)
- [Prompt guide](https://docs.reactor.inc/model-api-reference/lingbot-world-2/prompt-guide)
- [Tutorial](https://docs.reactor.inc/model-api-reference/lingbot-world-2/tutorial)
- [Reference frontend](https://github.com/reactor-team/js-sdk/tree/main/examples/lingbot-world-2)

### Documentation-drift plan

- Treat the current live schema and runtime capabilities as authoritative.
- Keep the model ID in one server/client configuration point.
- Preserve the typed SDK boundary.
- Log unknown model messages in development and ignore them safely.
- Record the resolved SDK package versions and model capabilities in the final handoff.

## 4. User journey

### 4.1 Scenario selection

Open on a strong incident library, not a generic landing page. Show exactly three large cards:

| Scenario | Setting | Live hazard | Visual identity |
| --- | --- | --- | --- |
| **Aftershock** | Earthquake-damaged transit service corridor | A second shock drops dust and fresh rubble across the direct route | Cold concrete interior, red emergency door, yellow wall marker, broken stairwell |
| **Rising Water** | Underground parking/service level after extreme rainfall | A flash-flood surge raises water and obstructs the vehicle ramp | Reflective floodwater, amber stairwell door, red fire cabinet, white rescue van |
| **Ember Front** | Wildland–urban interface evacuation road | A wind shift drives smoke and embers across the road and drops a burning branch | Smoky golden daylight, yellow evacuation gate, white utility truck, stone water tank |

Each card uses its actual LingBot seed image as the preview, shows a 90-second duration, and has a one-sentence objective. The selected card opens its briefing. Mark Aftershock as **Featured demo**, not as the only working mission.

### 4.2 Briefing

The initial screen immediately explains:

- Mission-specific setting, objective, hazard, and landmark hints.
- Controls: WASD to move; arrows or mouse to look.
- Duration: 90 seconds.
- Boundary: generated rehearsal, not a validated simulator.

Primary button: **Start mission**.

Starting performs connection and staging in a visible sequence. Do not imply that the world is ready while the connection is waiting for a GPU.

### 4.3 Staging

Display concise progress states:

1. Securing session
2. Waiting for world engine
3. Loading incident image
4. Preparing scenario
5. World ready

On `ready`, upload the selected scenario's bundled seed, set image, set its initial composed prompt, wait for the corresponding state/acceptance signals, and start generation. The mission clock begins on `generation_started`, not on button click or connection readiness.

### 4.4 Explore

The user navigates the corridor. The HUD shows:

- LIVE WORLD status
- mission time remaining
- current objective
- three scenario-specific landmark hints
- compact controls reminder

At 25 elapsed mission seconds, inject the selected scenario's hazard automatically. Include a development-only or visibly secondary **Trigger now** control so the live judge demo can fire the event early. It must be idempotent.

### 4.5 Hazard and decision

Every scenario event has two visual phases:

1. `hazard_active`: the visible transient hazard; active for exactly two observed `chunk_complete` ticks.
2. `hazard_settled`: the transient motion ends, a persistent consequence remains, and the same three landmarks stay anchored.

When the settled prompt is accepted, reveal the response choices:

- `1` / **Scan** — inspect from a safe position; reveals a weak survivor beacon near the side route.
- `2` / **Assist** — approach the marked side route; reveals a clearer survivor indicator but consumes more mission time.
- `3` / **Retreat** — turn back toward the safe entry route; prioritizes withdrawal.

Each choice:

- can be submitted only once;
- creates exactly one event-log entry;
- applies exactly one full replacement consequence prompt;
- updates deterministic mission state and authored feedback;
- never asks the model to judge safety or correctness.

### 4.6 Debrief

End the mission when any of these occurs:

- 90 seconds elapsed;
- Retreat consequence has completed;
- user selects **Finish mission**;
- a non-recoverable error ends the live session.

Debrief content:

- selected response;
- selected incident;
- response time from settled hazard to choice;
- event timeline;
- deterministic outcome label and authored explanation;
- explicit generated-rehearsal disclosure;
- **Run again** button.

On debrief entry, clear all held input, reset model state as legal, and terminate the owned Reactor session non-recoverably so billing does not continue behind the debrief.

## 5. Product UI

### 5.1 Desktop composition

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZERO-DAY RESCUE   AFTERSHOCK / LIVE WORLD     01:04     CONNECTION: READY   │
├───────────────────────────────────────────────────┬─────────────────────────┤
│                                                   │ CURRENT OBJECTIVE       │
│                                                   │ Assess the blocked      │
│             GENERATED MAIN_VIDEO                  │ corridor and respond.   │
│                                                   ├─────────────────────────┤
│                                                   │ INCIDENT                │
│                                                   │ AFTERSHOCK DETECTED     │
│                                                   ├─────────────────────────┤
│                                                   │ [1 Scan]                │
│                                                   │ [2 Assist]              │
│                                                   │ [3 Retreat]             │
├───────────────────────────────────────────────────┴─────────────────────────┤
│ WASD Move · Arrows/Mouse Look · Generated rehearsal, not a safety model     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Visual direction

- Dark incident-command interface, not a generic AI dashboard.
- Video is the dominant surface and stays 16:9 with `object-fit: contain`.
- Slate/black base, warm amber warning, limited red for active hazards, green only for confirmed connection/complete state.
- High-contrast, concise operational typography.
- Subtle overlays; never obscure more than a small edge of the stream.
- Use existing icon/components where available; avoid new decorative dependencies.

### 5.3 Responsive behavior

- Desktop: video plus right mission rail.
- Narrow screens: video first, mission rail beneath it.
- On-screen action buttons remain usable without keyboard.
- Do not promise touch navigation in the MVP; display keyboard requirement when no hardware keyboard is detected only if simple to implement.

### 5.4 Remove from the primary experience

- Quick Start scene gallery.
- Custom scene upload/editor.
- Layered prompt editor.
- Advanced attention/cache knobs.
- Jump, crouch, roll, orbit, and experimental controls.
- Visible raw prompt inspector.

Do not delete the proven underlying movement/camera code until the mission works. Unused debug/editor surfaces may remain behind `?debug=1` in development, but must not appear in the judge-facing route.

## 6. State architecture

Keep three state machines separate.

### 6.1 Reactor connection state

| State | UI | Allowed operations |
| --- | --- | --- |
| `disconnected` | Start/retry | fetch JWT, `connect()` |
| `connecting` | Securing session | cancel/disconnect only |
| `waiting` | Waiting for world engine | cancel/disconnect; no model commands |
| `ready` | Connected | uploads, conditions, lifecycle and control commands |

### 6.2 LingBot runtime state

| Product label | Authoritative condition | Allowed operations |
| --- | --- | --- |
| `model_waiting` | ready connection; `started=false`, `running=false` | set image, prompt, seed, start after conditions |
| `model_generating` | `started=true`, `running=true`, `paused=false` | movement, camera pose, set prompt, pause, reset |
| `model_paused` | `paused=true` | prompt, resume, reset |
| `model_resetting` | reset sent, awaiting snapshot/event | no product action except disconnect |

Do not infer runtime state from a resolved command promise. Reduce the full `state` message into local runtime state.

### 6.3 Mission state

```text
briefing
  ← scenario_selection
  → connecting
  → staging
  → exploring
  → hazard_active
  → hazard_settled
  → decision_submitted
  → consequence
  → debrief
  ↘ recoverable_error → retry
  ↘ terminal_error → debrief
```

Recommended discriminated union:

```ts
type MissionPhase =
  | "scenario_selection"
  | "briefing"
  | "connecting"
  | "staging"
  | "exploring"
  | "hazard_active"
  | "hazard_settled"
  | "decision_submitted"
  | "consequence"
  | "debrief";

type MissionChoice = "scan" | "assist" | "retreat";

type ScenarioId = "aftershock" | "rising-water" | "ember-front";

type MissionState = {
  phase: MissionPhase;
  scenarioId: ScenarioId | null;
  startedAtMs: number | null;
  remainingSeconds: number;
  hazardStartedChunk: number | null;
  choice: MissionChoice | null;
  choiceResponseMs: number | null;
  eventLog: MissionLogEntry[];
  terminalReason: "completed" | "timeout" | "retreat" | "error" | null;
};
```

Mission time and choices are app state. They must not be embedded only in model prompts.

## 7. Reactor media and control contract

### 7.1 Track contract

| Name | Direction | Kind | Rendering | Lifecycle |
| --- | --- | --- | --- | --- |
| `main_video` | receive-only | video | Existing `LingbotWorld2MainVideoView`, muted, contained in 16:9 stage | Subscribe/render early; provider owns cleanup |

LingBot World 2 has no inbound media track for this experience. The seed is uploaded as a file and commands carry all controls.

### 7.2 Launch sequence

Use the reference controller's legal ordering:

1. Clear all local held-key stacks and send idle/empty pose when legal.
2. If a previous run exists, `reset()` and wait for the reset/state transition.
3. Fetch bundled seed image as a `File`/`Blob`.
4. `uploadFile(seed)` only after connection `ready`.
5. `setImage({ image: ref })`.
6. `setPrompt({ prompt: composeMissionPrompt(...) })`.
7. Wait until authoritative state/acceptance indicates both image and prompt are present.
8. `start()`.
9. Start mission clock on `generation_started`.

Avoid arbitrary delays when an acknowledgement/state guard is available. Retain a small bounded compatibility delay only if the current reference app requires it and document why.

### 7.3 Command contract

| Product action | Typed SDK / command | Guard | Expected confirmation | Visible timing |
| --- | --- | --- | --- | --- |
| Connect | `connect()` | disconnected | connection reaches `ready` | GPU wait is variable |
| Stage image | `uploadFile`, `setImage` | connection ready; model waiting | `image_accepted`, `conditions_ready`, `state` | before start |
| Stage/update prompt | `setPrompt({ prompt })` | connection ready | `prompt_accepted`, `state` | next chunk while generating |
| Start | `start()` | image + prompt acknowledged; model waiting | `generation_started`, `state` | stream begins after backend work |
| W/S press | preserve reference `setMoveLongitudinal` mapping | generating | state/chunk | next chunk |
| W/S release | send longitudinal `idle` | generating or cleanup path | state/chunk | next chunk |
| A/D press/release | preserve reference `setMoveLateral` mapping | generating | state/chunk | next chunk |
| Look | preserve existing `setCameraPose` subsystem | generating | state/chunk | chunk-granular |
| Release look | `setCameraPose({ camera_pose: [] })` once | pose was active | state | next chunk |
| Trigger hazard | selected scenario's full replacement `setPrompt` | exploring; idempotent | `prompt_accepted` then chunk | next chunk |
| Settle hazard | selected scenario's full replacement `setPrompt` | two chunks since active event | `prompt_accepted` | next chunk |
| Submit choice | full replacement consequence prompt | settled; no prior choice | `prompt_accepted`; local event logged | next chunk |
| Finish | clear controls, reset if legal, `disconnect(false)` | any active session | disconnected | immediate cleanup |

Persistent controls are state, not pulses. Key auto-repeat must not resend identical values. On `keyup`, `window.blur`, `visibilitychange`, reset, mission finish, component unmount, or error transition, return both movement axes to idle and clear camera pose.

### 7.4 Message reducer

Handle at minimum:

- `state`: authoritative runtime snapshot.
- `conditions_ready`: staging progress only; reconcile with full state.
- `image_accepted` and `prompt_accepted`: progress/telemetry.
- `generation_started`: mission clock start.
- `chunk_complete`: chunk index, event timing, and two-chunk active-to-settled hazard transition.
- `generation_paused`, `generation_resumed`, `generation_complete`, `generation_reset`.
- `command_error`: visible actionable model error without transport reconnect.
- SDK `error`: separate transport/auth/recovery path.
- Unknown message: development log and safe ignore.

Never advance the mission merely because `setPrompt()` resolved. Advance event phases when prompt acceptance/state and the required chunk boundary have been observed.

## 8. Scenario, asset, and prompt specification

### 8.1 Real-world visual research and rights-safe asset pipeline

The production seeds must look like documentary photographs of plausible response sites, not fantasy concept art. Achieve this with a controlled two-stage process:

1. Build a small reference board from authoritative disaster imagery and record provenance.
2. Generate a new, original, navigable seed image informed by common real-world visual patterns, then preflight it in LingBot World 2.

Preferred research sources:

- [USGS media](https://www.usgs.gov/media/images): earthquake, flood, landslide, and infrastructure-damage references. Use only items whose individual page explicitly says **Public Domain**; USGS warns that some third-party images on its sites remain copyrighted.
- [NOAA Digital Photo Collection](https://www.noaa.gov/noaa-collections/photo-library): flood, severe-weather, coastal, and wildfire references. NOAA states its Digital Library images are generally public domain unless an item notes otherwise; credit NOAA and the named photographer and avoid identifiable people.
- [U.S. Fire Administration Image Gallery](https://www.usfa.fema.gov/gallery/): copyright-free, high-resolution fire and life-safety stock imagery suitable for training materials.
- [NIST Disaster and Failure Studies](https://www.nist.gov/disaster-and-failure-studies): strong technical context and damage-pattern references. Check each item's credit; NIST's repository can include third-party copyrighted materials.
- FEMA Media Library items only when the individual asset is marked released and its Photo Usage Guidelines allow the intended use.

Create `research/ASSET_PROVENANCE.md` with, for every consulted image:

- scenario ID;
- source-page URL, not only the image URL;
- agency and photographer/credit;
- public-domain/license statement copied as a short factual summary;
- what visual facts were used as inspiration;
- whether the original file is redistributed in the repository;
- date checked.

Rights and safety rules:

- Do not scrape news, social media, commercial stock sites, or random search-result images.
- Do not use images containing visible casualties, identifying faces, readable license plates, home addresses, or private medical information.
- Do not use agency logos or imply government endorsement.
- Do not modify a government photograph and then present it as an official photo.
- Default to using source imagery as research only. Ship newly generated seeds unless a specific public-domain photo is an unusually strong, navigable first frame and its provenance is recorded.
- Credit source agencies in `ASSET_PROVENANCE.md`; the scenario UI may say “Visual research informed by public disaster archives” without agency logos.

### 8.2 Original seed generation requirements

Use the `imagegen` skill to create one final seed per scenario. Real-world sources establish damage patterns, materials, light, and operational plausibility; they are not copied composition-for-composition.

Every final seed must:

- be an original photorealistic image with documentary response-photography character;
- use a wide first-person, eye-level or low robot-camera perspective;
- contain a clear navigable route extending into depth;
- include exactly three separated, promptable landmarks;
- avoid people, bodies, blood, readable text, logos, watermarks, extreme gore, and sensational destruction;
- avoid motion blur, cinematic lens distortion, impossible architecture, blocked full-frame rubble, and excessive particles;
- be cropped/validated to a consistent near-16:9 frame; prefer 1664 × 960 when feasible;
- keep key landmarks away from the outermost crop edges;
- pass visual inspection and a LingBot navigation preflight before being accepted.

Asset locations:

```text
public/scenarios/aftershock/seed.png
public/scenarios/rising-water/seed.png
public/scenarios/ember-front/seed.png
```

Also store a lightweight WebP card image when useful, derived from the same approved seed rather than separately generated:

```text
public/scenarios/<scenario-id>/card.webp
```

The existing approved corridor image is the Aftershock candidate source:

```text
assets/lingbot-world-2/zero-day-rescue-corridor-reference.png
```

Copy it non-destructively to the public scenario directory. Keep the original research asset.

### 8.3 Asset quality gate

Score each candidate from 1–5 on:

| Dimension | Pass condition |
| --- | --- |
| Photorealism | Materials, lighting, scale, and damage resemble documentary photography; score ≥4 |
| Navigability | A clear route and depth cues exist; score ≥4 |
| Landmark clarity | Exactly three unique landmarks are spatially separated; score 5 |
| Scenario readability | Hazard category is understandable in two seconds; score ≥4 |
| Safety/rights | No sensitive identity, logo, watermark, or uncertain source use; score 5 |
| LingBot stability | Idle, W/release, look/release, and 20-second landmark persistence pass; score ≥4 |

Reject and regenerate any seed that fails safety/rights, landmark count, or navigability even if it looks dramatic. Generate at most two focused iterations per scenario before selecting the strongest candidate; prompt iteration should fix one observed defect at a time.

### 8.4 Shared prompt composition

Retain layered composition. The wire receives one full prose string, but the application derives it from the selected scenario and mission state:

```ts
type MissionPromptState = {
  scenarioId: ScenarioId;
  movement: "idle" | "moving";
  incident: "normal" | "hazard_active" | "hazard_settled";
  consequence: MissionChoice | null;
};
```

Composition order:

1. selected scenario base world identity;
2. selected static/dynamic camera and movement variant;
3. selected incident phase;
4. optional selected consequence.

Recompute from state. Do not append/remove text by mutating the previous prompt.

Shared static camera contract:

```text
Strict first-person rescue-robot view. The viewpoint remains stationary when no movement input is held. Look-input is the only source of camera rotation; the three fixed landmarks retain their relative positions.
```

Shared dynamic camera contract:

```text
Strict first-person rescue-robot view. Movement input advances through the site only while held; look-input changes heading. The three named landmarks remain persistent spatial anchors as the viewpoint travels.
```

### 8.5 Scenario A — Aftershock

Reference profile: earthquake-damaged public/transit interior; concrete spalling, exposed rebar, dust, localized—not total—collapse.

Landmarks:

- exactly one red emergency door straight ahead;
- exactly one yellow rescue marker on the left wall;
- exactly one partially collapsed stairwell on the right.

Base:

```text
An earthquake-damaged concrete transit service corridor. The world contains EXACTLY ONE red emergency door straight ahead at a fixed position, EXACTLY ONE yellow rescue marker on the left wall at a fixed position, and EXACTLY ONE partially collapsed stairwell on the right at a fixed position. Cool emergency lighting reveals cracked concrete, exposed rebar, restrained rubble, and fine suspended dust. Realistic disaster-response documentary imagery.
```

Active hazard, exactly two chunks:

```text
A brief aftershock is happening now: the corridor shudders, fine dust falls from the ceiling, loose pebbles skip across the floor, and a small amount of fresh rubble drops near the red door. The yellow marker and damaged stairwell remain visible in their fixed locations. The central route remains partially traversable.
```

Settled hazard:

```text
The brief aftershock has ended. Dust slowly settles through the emergency light. A fresh low pile of rubble now partially obstructs the direct path near the red door while a passable side route remains beside the yellow marker. The same red door, yellow marker, and damaged stairwell remain fixed and recognizable.
```

### 8.6 Scenario B — Rising Water

Reference profile: underground parking/service level after extreme rainfall; reflective shallow water, wet concrete, floating light debris, drainage stress, plausible emergency lighting.

Seed composition and landmarks:

- exactly one amber stairwell door straight ahead;
- exactly one red fire-hose cabinet on the left wall;
- exactly one white rescue utility van parked on the right;
- shallow water with a visible central driving path.

Seed-generation brief for the `imagegen` skill:

```text
Use case: photorealistic-natural. Asset type: 16:9 world-model seed and scenario card. Create an original documentary-style first-person rescue-robot view inside a realistic underground parking service level after extreme rainfall. Shallow reflective floodwater covers the floor but a central navigable path remains obvious. EXACTLY ONE amber stairwell door is straight ahead, EXACTLY ONE red fire-hose cabinet is on the left wall, and EXACTLY ONE white rescue utility van is parked on the right. Eye-level wide perspective, strong depth, wet concrete, cool emergency lighting, restrained floating debris, physically plausible water reflections. No people, faces, bodies, readable text, logos, watermarks, motion blur, fantasy styling, total obstruction, or duplicated landmarks.
```

Base:

```text
A flooded underground parking service level after extreme rainfall. The world contains EXACTLY ONE amber stairwell door straight ahead at a fixed position, EXACTLY ONE red fire-hose cabinet on the left wall at a fixed position, and EXACTLY ONE white rescue utility van parked on the right at a fixed position. Shallow reflective water covers the concrete floor beneath cool emergency lights, with restrained floating debris and a visible central route. Realistic emergency-response documentary imagery.
```

Active hazard, exactly two chunks:

```text
A brief flash-flood surge is entering the same service level now: turbulent water pushes a few small floating objects across the floor and ripples around the utility van's tires. The amber stairwell door, red fire-hose cabinet, and white utility van remain visible in their fixed locations. The central route remains partly navigable.
```

Settled hazard:

```text
The surge has slowed. Water is now moderately deeper across the direct ramp while a shallower route remains beside the amber stairwell door. Reflections settle around the same red fire-hose cabinet and white utility van, which remain fixed and recognizable.
```

### 8.7 Scenario C — Ember Front

Reference profile: wildland–urban interface evacuation road; smoke-reduced visibility, dry vegetation, airborne embers, utility infrastructure, no wall of flames filling the frame.

Seed composition and landmarks:

- exactly one yellow evacuation gate straight ahead;
- exactly one white utility truck on the left shoulder;
- exactly one round stone water tank on the right;
- drivable road remains visible between the landmarks.

Seed-generation brief for the `imagegen` skill:

```text
Use case: photorealistic-natural. Asset type: 16:9 world-model seed and scenario card. Create an original documentary-style first-person rescue-vehicle view along a wildland–urban interface evacuation road during a nearby wildfire. A clear drivable road extends into depth. EXACTLY ONE yellow evacuation gate is straight ahead, EXACTLY ONE white utility truck is on the left shoulder, and EXACTLY ONE round stone water tank is on the right. Smoky late-afternoon light, dry vegetation, restrained drifting ash, distant muted fire glow, realistic infrastructure and scale. No people, faces, bodies, readable text, logos, watermarks, motion blur, wall of flames, fantasy colors, total obstruction, or duplicated landmarks.
```

Base:

```text
A wildland–urban interface evacuation road under smoky late-afternoon light. The world contains EXACTLY ONE yellow evacuation gate straight ahead at a fixed position, EXACTLY ONE white utility truck on the left shoulder at a fixed position, and EXACTLY ONE round stone water tank on the right at a fixed position. Dry vegetation, restrained drifting smoke, scattered ash, and a visible drivable road create realistic wildfire-response documentary imagery.
```

Active hazard, exactly two chunks:

```text
A sudden wind shift crosses the same road now: smoke thickens briefly, glowing embers sweep sideways, and one small burning branch falls near the yellow gate. The white utility truck and stone water tank remain visible in their fixed locations, and part of the road remains passable.
```

Settled hazard:

```text
The wind gust has passed. Smoke remains but visibility improves, and the fallen branch now partially obstructs the direct lane near the yellow gate while a passable edge remains beside the stone water tank. The same yellow gate, white utility truck, and stone water tank stay fixed and recognizable.
```

### 8.8 Shared response consequences

Consequence prose must be adapted to the scenario's landmark nouns. The semantic pattern is shared:

- **Scan:** a small amber survivor-location beacon becomes visible near the passable route; environment and landmarks remain unchanged.
- **Assist:** the beacon becomes clearer near a sheltered position along the passable route; obstruction and landmarks remain unchanged.
- **Retreat:** the viewpoint is oriented toward the clearer entry route; the settled hazard and landmarks remain recognizable.

Store explicit authored strings in every scenario definition rather than performing naive noun substitution at runtime.

### 8.9 Prompt requirements

- Use full replacement prompts for every phase.
- Keep image and text aligned.
- Keep exactly three explicit landmarks with count and fixed location.
- Bind movement and camera motion to actual input.
- Do not put autonomous camera movement in the base layer.
- Do not use negative noun lists in production prompts.
- Do not ask the model to calculate structural safety, water depth, fire spread, casualty condition, mission correctness, distance, collision, or score.
- Keep the worst-case composed prompt below approximately 2,000 characters.

## 9. Deterministic mission logic

Create one typed scenario registry and one definition per incident:

```ts
type MissionChoiceDefinition = {
  id: MissionChoice;
  label: string;
  shortcut: "1" | "2" | "3";
  feedback: string;
  scoreDelta: number;
};

type ScenarioDefinition = {
  id: ScenarioId;
  title: string;
  shortDescription: string;
  objective: string;
  seedPath: string;
  landmarks: [string, string, string];
  prompt: {
    base: string;
    camera: { static: string; dynamic: string };
    incident: { active: string; settled: string };
    consequences: Record<MissionChoice, string>;
  };
  choices: MissionChoiceDefinition[];
};

type MissionLogEntry = {
  id: string;
  atMs: number;
  kind: "system" | "incident" | "choice" | "outcome";
  title: string;
  detail: string;
};
```

Authored outcomes:

| Choice | Score | Debrief framing |
| --- | ---: | --- |
| Scan | 100 | Gathered information before committing to the obstructed route |
| Assist | 80 | Prioritized approach to the marked side route with higher exposure |
| Retreat | 90 | Preserved operator/robot safety and reported an incomplete search |

Scores are transparent scenario design, not model judgment. Label them **scenario score**, not safety rating.

Timer behavior:

- 90 seconds total.
- Starts at `generation_started`.
- Selected scenario hazard scheduled at elapsed second 25.
- Secondary trigger can fire earlier but never twice.
- Timer pauses only if the product explicitly pauses model generation; otherwise network stalls do not silently grant or remove time.
- `Assist` may apply a deterministic 10-second time penalty only if clearly shown before selection. For the first MVP, omit the penalty unless the rest of the loop is stable.

## 10. Component and module plan

Adapt names when existing modules offer a cleaner boundary.

### Keep and adapt

- `app/api/reactor/token/route.ts`
  - Keep server-only key exchange and model allowlist.
  - Never return or log the API key.
  - Return actionable 401/402/429/5xx-safe errors without Reactor secrets.
- `app/LingbotWorld2App.tsx`
  - Keep the typed provider and output view.
  - Replace the reference-demo layout with mission shell.
- `components/lingbot-world-2/LingbotWorldController.tsx`
  - Extract or adapt connection/runtime/control logic.
  - Preserve keyboard stacks, camera pose, blur/unmount cleanup, state handling, and error handling.
- `lib/lingbot-world-prompts.ts`
  - Reuse or wrap its pure composition patterns.

### Add

- `components/mission/MissionShell.tsx`
  - Overall selection/briefing/live/debrief phase switch.
- `components/mission/ScenarioLibrary.tsx`
  - Three high-impact incident cards using approved scenario assets.
- `components/mission/WorldStage.tsx`
  - Video, loading overlay, connection status, incident banner.
- `components/mission/MissionRail.tsx`
  - Objective, timer, landmark hints, incident, actions.
- `components/mission/DecisionPanel.tsx`
  - One-shot Scan/Assist/Retreat controls and shortcuts.
- `components/mission/Debrief.tsx`
  - Choice, response time, event log, scenario score, restart.
- `components/mission/SafetyDisclosure.tsx`
  - Persistent generated-rehearsal disclosure.
- `lib/mission/types.ts`
  - Mission state and scenario types.
- `lib/mission/scenarios/index.ts`
  - Typed registry and lookup with all scenario IDs exhaustively handled.
- `lib/mission/scenarios/aftershock.ts`
  - Earthquake scenario, landmarks, prompts, choices, feedback, asset path.
- `lib/mission/scenarios/rising-water.ts`
  - Flood scenario, landmarks, prompts, choices, feedback, asset path.
- `lib/mission/scenarios/ember-front.ts`
  - Wildfire scenario, landmarks, prompts, choices, feedback, asset path.
- `lib/mission/reducer.ts`
  - Pure deterministic mission reducer.
- `lib/mission/compose-mission-prompt.ts`
  - Pure full-prompt derivation and length guard.
- `public/scenarios/aftershock/seed.png`
  - Browser-servable copy of approved reference.
- `public/scenarios/rising-water/seed.png`
  - Approved original flood seed.
- `public/scenarios/ember-front/seed.png`
  - Approved original wildfire seed.
- `research/ASSET_PROVENANCE.md`
  - Source pages, rights status, credits, inspiration notes, and validation date.

### Optional debug-only

- Preserve the original prompt inspector or advanced controls behind `process.env.NODE_ENV === "development"` and `?debug=1`.

### Remove or stop rendering

- `Header` content that brands the app as a generic LingBot demo.
- Quick Start examples and custom-scene controls from the main route.
- Jump/crouch/roll/orbit controls and hints.

Do not perform broad deletion until the final product route builds and the live vertical slice works.

## 11. Authentication, trust boundaries, and session ownership

### Browser

- Never has `REACTOR_API_KEY`.
- Receives only a short-lived JWT scoped to `reactor/lingbot-world-2` sessions.
- Does not choose an arbitrary model ID.
- Does not persist JWTs to localStorage, logs, analytics, or URLs.

### Next.js server

- Reads `REACTOR_API_KEY` from `.env`/deployment secret.
- Calls Reactor `/tokens` with explicit `authorization_details`.
- Returns only JWT and expiry/cache behavior needed by the provider.
- Rate-limits or otherwise caps repeated token issuance if exposed publicly; a simple per-process guard is acceptable for the hackathon, but must not be presented as distributed production protection.

### Session ownership

- Single user/controller.
- The browser-created connection owns the Reactor session.
- No adopters or viewer sharing in this MVP.
- Use normal non-recoverable disconnect at mission finish, idle termination, and abandonment.
- Use recoverable reconnect only for one bounded attempt when continuity is worth the ongoing billing.

### Secret hygiene

- `.env` and `.env.local` remain ignored.
- Recreate `.env.example` with only `REACTOR_API_KEY=rk_your_api_key_here` and optional coordinator placeholder; never copy the real value.
- Before commit, run a focused secret scan such as `git diff --cached` plus `rg` patterns that do not print environment-file contents.

## 12. Reliability, errors, and cost controls

### Visible error categories

| Category | Example | UX |
| --- | --- | --- |
| Configuration | API key absent server-side | Setup screen with local env instructions |
| Authentication | token endpoint 401/expired | Retry with fresh scoped token |
| Credits/quota | 402/429 | Explain credits/session capacity; do not loop |
| Waiting | GPU assignment delay | Honest waiting state and Cancel button |
| Upload/moderation | seed rejected | Replace/retry seed manually; no automatic rejection loop |
| Model command | `command_error` | Toast/banner naming failed action; keep connection |
| Transport | SDK/WebRTC error | One bounded recoverable retry when indicated, otherwise clean restart |
| Runtime timeout | mission/session cap | Finish to debrief and terminate session |

### Required guardrails

- One active model session per browser tab.
- Prevent duplicate connect/start caused by React rerenders.
- Disable commands until connection and model guards permit them.
- Clear all persistent controls on every exit path.
- Begin billable-session timer at `ready` for diagnostics.
- Warn after 45 seconds of no user input during an active mission.
- Finish and disconnect after 60 seconds idle or 120 seconds total ready time, whichever comes first, unless actively showing the 90-second mission.
- Disconnect immediately on explicit Cancel/Finish.
- Do not treat pausing the output video element as pausing generation or billing.
- Do not silently use recoverable disconnect as normal teardown.

## 13. Observability

No external analytics service is required. In development, retain a bounded in-memory diagnostic log with:

- connection-state transitions and timestamps;
- time to ready;
- time from ready to first `main_video` frame if observable;
- model state snapshots relevant to guards;
- image/prompt acceptance;
- command name, send time, acceptance/error, and next visible chunk;
- selected scenario, hazard trigger chunk, and settle chunk;
- choice and response time;
- session finish reason and ready-duration estimate;
- SDK/WebRTC error code and recoverability, without tokens or media URLs.

Production UI shows only concise product-safe statuses. A `?debug=1` panel may expose sanitized diagnostics.

## 14. Accessibility and interaction details

- All buttons have visible labels and focus styles.
- Action shortcuts `1`, `2`, `3` work only when decision phase is active and focus is not inside an input/button that would conflict.
- Do not capture WASD or arrows while the user is typing or interacting with a form control.
- Incident changes are announced through an `aria-live="polite"` region.
- Active errors use `role="alert"`.
- Timer is visible but should not announce every second; announce only thresholds such as 30 and 10 seconds.
- Respect `prefers-reduced-motion` for UI animation. This does not change the generated video.
- Provide an explicit click-to-enable mouse-look cue rather than unexpectedly locking the pointer.

## 15. Test matrix

### 15.1 Static and build verification

- `pnpm install --frozen-lockfile`
- `pnpm build`
- TypeScript passes.
- No secret-bearing env file is tracked.
- No new unbounded dependency range is introduced.

### 15.2 Pure logic tests

If a test runner is already present, add tests. If not, prefer keeping implementation small over adding a large test stack, but keep reducers/composers pure and manually verify:

- legal mission phase transitions;
- every scenario hazard fires once;
- two chunk completions cause one settle transition;
- one choice creates one log item and consequence;
- timer ends exactly once;
- restart creates initial state;
- prompt composition selects correct static/dynamic/incident/consequence layers;
- all composed prompts stay below the chosen length guard.

### 15.3 Mocked integration

- No upload or command is sent before `ready`.
- Seed upload → image accepted → prompt accepted → conditions ready → start.
- `command_error` does not trigger transport reconnect.
- unknown messages do not crash the reducer.
- reconnect rehydrates from the first full `state` snapshot.
- duplicate keydown does not duplicate persistent commands.
- keyup, blur, reset, finish, and unmount all send idle/empty pose cleanup.

### 15.4 Live smoke test

With credits and API key configured:

1. Connect to `reactor/lingbot-world-2` and inspect runtime capabilities.
2. Confirm receive-only `main_video` and first frame.
3. Confirm the exact bundled seed is accepted.
4. Hold W long enough to cross a chunk boundary, then release; movement begins and stops.
5. Test look, then release; rotation stops.
6. Run each scenario at least once and confirm its correct local seed, three landmarks, and base prompt are used.
7. Trigger the selected hazard; prompt changes without reset or scene cut.
8. Observe the active hazard for two chunks and settled state afterward.
9. Submit Scan; consequence fires once and event log updates once.
10. Finish mission; session disconnects and debrief remains usable.
11. Run again with a different scenario; no stale image, prompt, held key, choice, event, or timer survives.
12. Trigger one intentionally invalid command only in debug mode and verify visible `command_error` handling without disconnect.

### 15.5 Browser checks

Must verify the judge browser, normally current Chrome/Edge:

- autoplay/rendering works after user Start gesture;
- pointer-lock/mouse-look affordance is understandable;
- background tab or lost focus clears held controls;
- layout remains usable at 1366×768 and 1920×1080;
- narrow layout does not place decision buttons off-screen;
- network loss produces a visible recovery path.

## 16. Measurable acceptance criteria

All Must Ship criteria are required:

- [ ] A first-time user can identify the mission and Start action within five seconds.
- [ ] The API key is absent from client bundles, browser logs, URLs, repository history, and responses.
- [ ] Browser JWT is scoped only to `reactor/lingbot-world-2` sessions.
- [ ] No model upload or command is sent before connection `ready`.
- [ ] Start is impossible until both prompt and image are authoritatively acknowledged.
- [ ] `main_video` renders in the dominant 16:9 stage.
- [ ] Pressing and releasing W produces forward then idle commands exactly once per transition.
- [ ] Lost focus clears longitudinal, lateral, and camera-pose inputs.
- [ ] Scenario library presents three visually distinct incidents using their actual approved seeds.
- [ ] All three scenarios complete the same connect, navigate, hazard, choice, consequence, and debrief loop.
- [ ] Every hazard is a live full-prompt replacement and does not reset the session.
- [ ] Every active hazard lasts exactly two observed chunk completions before settling.
- [ ] Every scenario names exactly three fixed landmarks in base, active, settled, and consequence prompts.
- [ ] Decision buttons remain disabled until settled hazard phase.
- [ ] Each shipped seed passes the documented asset quality gate and has an entry in `research/ASSET_PROVENANCE.md`.
- [ ] One decision produces one consequence prompt, one log entry, and one deterministic debrief result.
- [ ] Mission ends at 90 seconds, Retreat completion, Finish, or terminal error without duplicate teardown.
- [ ] Finish and idle timeout terminate the owned session non-recoverably.
- [ ] `command_error` appears visibly without forcing SDK reconnect.
- [ ] Missing key, rejected seed, insufficient credits/quota, and connection loss each have actionable UI.
- [ ] Restart begins with clean mission state and no stale held controls.
- [ ] Persistent disclosure is visible during briefing, live mission, and debrief.
- [ ] The final app does not call itself a digital twin, structural simulator, robot certifier, or validated training tool.
- [ ] `pnpm build` succeeds from a clean install.

## 17. Delivery phases and stop conditions

### Phase 0 — baseline and safety

- Inspect worktree and preserve user changes.
- Verify env file exists without reading its value.
- Run baseline build.
- Refresh current Reactor schema/package documentation.
- Recreate safe `.env.example` placeholder if missing.

Stop when the existing reference app still builds and no secret is tracked.

### Phase 1 — scenario vertical slice

- Add scenario registry, mission types, reducer, and prompt composer.
- Add browser-servable Aftershock seed and one button/function that launches it using the current provider/controller.
- Confirm world starts with seed and prompt.

Stop when a user can navigate the corridor and trigger one live aftershock prompt without reset.

### Phase 1B — visual asset and scenario library

- Build and document the three real-world reference boards.
- Generate and inspect Rising Water and Ember Front seeds with the `imagegen` skill.
- Preflight all three seeds and prompts in LingBot.
- Add data-driven definitions and selection cards for all scenarios.

Stop when every scenario independently loads the correct seed, starts generation, navigates, triggers and settles its hazard, accepts one response, and reaches debrief.

### Phase 2 — product shell

- Build briefing, live world stage, mission rail, actions, event log, and debrief.
- Remove reference-demo surfaces from primary route.
- Add timer and automatic/manual event trigger.

Stop when the entire 90-second loop is understandable and completable.

### Phase 3 — hardening

- Separate connection/runtime/mission state.
- Complete cleanup paths, command guards, visible errors, idle/max timers, and restart.
- Add accessibility behaviors and responsive layout.

Stop when all non-live acceptance criteria pass.

### Phase 4 — live verification

- Run the legal command sequence against LingBot World 2.
- Tune prompt layers only from observed failures.
- Verify event active/settled transition and all three choices.
- Capture a short fallback clip only after live flow works.

Stop when the judge demo succeeds twice in succession from a fresh page load.

### Phase 5 — optional deployment

Do not begin until the local live loop passes. Deploy only with separate user authorization and only to a platform that supports:

- server-side secrets;
- the Next.js token route;
- WebRTC browser traffic;
- non-cached private JWT responses;
- prompt session cleanup.

## 18. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Prompt change visually drifts or duplicates landmarks | Align image/prompt, use exact counts and fixed positions, keep full prompt under limit, test one change at a time |
| A hazard appears continuous | Limit active event to two `chunk_complete` ticks, then replace with its explicit settled prompt |
| Key tap is missed | Treat controls as held state and explain chunk-granular reaction; require visible hold duration |
| Movement becomes stuck | Preserve input stacks; force idle/empty pose on every release and exit path |
| Start races image/prompt acceptance | Gate on authoritative conditions/state instead of promise completion alone |
| A reference image cannot be fetched | Serve every approved seed locally from `public/scenarios/<id>/seed.png` |
| Extra scenarios dilute technical execution | Implement one shared typed engine; scenarios are data and assets, not separate controllers |
| Real-disaster photos create rights/privacy risk | Use official source pages, record per-item rights, avoid identifiable people, and ship original generated seeds by default |
| Generated seeds look like concept art | Use documentary photography language, real-world material references, strict quality scoring, and regenerate only the failed dimension |
| Billing continues on debrief | Explicit non-recoverable disconnect and idle/max-duration guards |
| Live output is unreliable during judging | Rehearse twice, retain visible recovery UI, capture a short fallback recording after live success |
| Product overclaims simulation fidelity | Persistent disclosure and deterministic app rules; no pixel-derived safety claims |
| SDK beta drift | Typed package boundary, pinned lockfile, live schema/capability probe, unknown-message tolerance |

## 19. Final handoff checklist

- [ ] Summarize files added/changed.
- [ ] Report resolved Reactor SDK/model package versions.
- [ ] Report `pnpm build` result.
- [ ] Report live smoke-test steps actually completed; distinguish untested items.
- [ ] Confirm `.env`/`.env.local` were never read or committed.
- [ ] Confirm repository status and list any preserved user changes.
- [ ] Document remaining risks and the exact next action.
- [ ] Do not mark the goal complete until every Must Ship acceptance criterion is implemented and all safely runnable verification has passed.

## 20. Judge demo script

Use this 60–90 second flow:

1. “Repeated disaster drills are expensive and dangerous to stage. Zero-Day Rescue creates a new interactive rehearsal world from one reference image.”
2. Show the three realistic incident cards: earthquake, flood, and wildfire. Say that each is a complete mission built from a scenario definition rather than a handcrafted level.
3. Select Aftershock, start mission, and navigate toward the red emergency door.
4. Trigger Aftershock early if needed.
5. “This is not a video cut—the prompt changes while I remain inside the same navigable session.”
6. Wait for dust and rubble to settle, then choose Scan.
7. Show the amber survivor beacon consequence and finish.
8. Show response time, event timeline, and authored scenario score; return to the library so judges see the reusable product surface.
9. “The model renders open-ended visual variation across real incident patterns; deterministic app logic owns each exercise. This is generated rehearsal, not structural prediction or safety certification.”
