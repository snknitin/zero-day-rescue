# Reactor model capability audit for a two-hour world-model hackathon

**Research date:** 2026-08-16  
**Scope:** the hosted Reactor endpoints available to the team: Happy Oyster, LingBot World 2, LingBot, Helios, LongLive 2, X2, SANA-Streaming, and LTX.

## Executive conclusion

**Use LingBot World 2 for ZERO-DAY RESCUE unless a preflight proves Happy Oyster's semantic actions are more reliable.** LingBot World 2 uniquely combines low-level movement/camera paths with live prompt replacement during navigation, which the proposed timed aftershock and blocked-route events require. A user can move forward/back, strafe, look, or submit a per-frame six-degree camera path; prompt changes take effect while the stream continues. Reactor advertises 16 fps, sub-one-second interaction latency, up to 960p, and minute-scale consistency.

**Happy Oyster is the strongest alternative and may be the better general world-model showcase.** Adventure mode creates a world from text alone or an optional image, supports first/third person, diagonal movement, look control, and built-in or world-advertised interaction verbs. Worlds receive persistent IDs and can be reopened. Its limitation for ZERO-DAY RESCUE is structural: Adventure has navigation/actions but no documented free-text `instruct`, while Directing has text instructions and rewind but no WASD. It is also much more expensive: Reactor currently shows a promotional ~$50/hour (regular $100/hour).

**Use X2 if demo reliability and immediate webcam spectacle matter more than “world model native.”** It has the simplest compelling interaction: publish webcam/video/still image, apply a prompt/reference image, and drag an edited subject. It returns 24 fps edited video. It is an editor, however, not an explorable simulated world.

**Use LTX only for a speaking character, instructor, or debrief.** Reactor's current LTX endpoint animates a portrait from a script and streams lip-synced video plus generated voice. It does not expose navigation, an explorable environment, or mid-take interaction, so it should not replace the world model in this project.

**Do not claim that any listed endpoint is a validated physics, medical, engineering, agricultural, or safety simulator.** The hosted contracts return pixels only. They expose no mesh, depth map, segmentation, object identities, collision state, force, material, weather, biological, or uncertainty outputs. LingBot’s action-conditioned video can produce visually plausible consequences, but visual plausibility is not numerical or causal validity. For safety-critical ideas, the correct architecture is a real simulator/rules engine as the source of truth and Reactor as the interactive renderer.

## What “world model” means in this catalog

The catalog combines four materially different products:

1. **Action-conditioned world video:** Happy Oyster, LingBot, and LingBot World 2 generate live worlds from prior frames plus movement/action controls. Happy Oyster adds semantic interaction verbs and persistent world IDs; LingBot World 2 adds low-level camera paths and live prompt changes. None exposes an inspectable 3D scene graph or physics state.
2. **Streaming video generation:** Helios and LongLive 2 generate coherent video over time and accept prompt/story changes. They do not expose WASD navigation or physical state.
3. **Streaming video editing:** X2 and SANA-Streaming transform an incoming camera/video stream. They preserve some source motion and appearance but do not roll out a counterfactual environment.
4. **Streaming avatar generation:** LTX turns a portrait, script, and scene prompt into a speaking take with synchronized voice and lip movement. This is useful generative media, but its current hosted control surface is neither a navigable world nor an interactive agent loop.

That taxonomy matters to judges. A prompt-controlled visual effect is real-time generative media; an action-conditioned future is closer to a world model; a physically trustworthy simulation additionally needs explicit state, calibrated dynamics, constraints, and validation that these APIs do not provide.

## Side-by-side capability matrix

| Model | Exact hosted inputs | Hosted output | Interactive controls exposed by Reactor | Hosted timing / consistency | Cost shown by Reactor | Honest category |
|---|---|---|---|---|---|---|
| **Happy Oyster** | Required text prompt; optional publicly reachable landscape starting-image URL; perspective or directing settings | Live interactive video; persistent encrypted world ID | **Adventure:** eight-direction movement, eight-direction look, stop, built-in/world-advertised interaction verbs. **Directing:** free-text instruction, pause/resume, rewind. Mode is fixed for a session. | Sub-second interactive latency, 480p/720p, minute-scale. World is built before travel and can be reopened later. Arbitrary instruction is not documented during Adventure navigation. | 139 credits/s, promotional ~$50.04/h for first two weeks; regular $100/h shown | Strongest semantic/persistent **navigable world** candidate |
| **LingBot World 2** | Required seed image + required text prompt; seed; control signals | `main_video` generated video track | Start/pause/resume/reset; live prompt swap; forward/back and independent left/right strafe; look up/down/left/right; rotation speed; explicit `[rx, ry, rz, tx, ty, tz]` camera path per step/frame; attention-window selection; KV-cache refresh | 16 fps, `<1 s`, 480p/960p, minute-level according to Reactor. Commands apply at the next chunk boundary. Attention-window and cache-reset controls explicitly trade responsiveness/stability and manage drift. | 33 credits/s, approximately $11.88/h | Best low-level/event-steerable **navigable world video** endpoint |
| **LingBot** | Required seed image + required text prompt; seed; control signals | `main_video` generated video track | Start/pause/resume/reset; live prompt swap; one movement state (idle/forward/back/strafe left/strafe right); look axes; rotation speed | 16 fps, `<1 s`, 480p/720p, minute-level. Controls persist until explicitly returned to idle and land at chunk boundaries. | 33 credits/s, approximately $11.88/h | Earlier navigable world video model |
| **Helios** | Text prompt required to start; optional reference image; Reactor’s info page also lists video | `main_video` continuous generated video | Prompt/image hot-swap; image strength; prompt scheduling by chunk; start/pause/resume/reset; random seed; 2x/4x super-resolution; save/list snapshots and rewind to branch from an earlier latent-history state | 24 fps, up to 1280x768, advertised infinite stream. Generates 33-frame chunks (about 1.4 s); commands apply at chunk boundaries. Snapshot buffer enables branching but is model history, not physical state. | 17 credits/s, approximately $6.12/h | Interactive **long-video generator**, not a navigable world |
| **LongLive 2** | Opening shot prompt, subsequent shot/scene prompts, seed | `main_video` generated video track | Soft `set_shot` changes preserve model memory; hard `scene_cut` wipes it; schedule either at exact session chunks; start/pause/resume/reset | Reactor markets real-time multi-shot generation and a hard-cut transition of about 150–300 ms; the public hosted page does not publish hosted fps/resolution. Upstream NVLabs benchmarks range from 24.8 to 45.7 fps depending on model/quantization, but those are **not evidence of Reactor endpoint throughput**. | 17 credits/s, approximately $6/h | Real-time storyboard / multi-shot video, not a world simulator |
| **X2** | Live webcam, playing clip, or repeated still-image video track; text edit prompt; optional reference image; pointer | `main_video` edited video track | Live prompt swap; reference-object/character insertion or replacement; normalized x/y active drag pointer; choose newest-frame dropping vs backlog consumption; reset | 24 fps; resolution follows and locks to source at run start. Default backlog dropping bounds delay; retaining all frames improves smoothness but delay grows. Published model latency is not stated. | 17 credits/s, approximately $6.12/h | Best interactive **video editor** and webcam demo |
| **SANA-Streaming** | Live `camera` track or uploaded clip of at least 33 frames; optional text edit prompt; seed | `main_video` edited video track | Live/file mode; prompt changes; start/pause/resume/reset; source re-anchoring interval to reduce edit drift | Fixed 1280x704; 24-frame chunks every about 1–1.5 s; about 1 s edit latency. Prompt changes land at the next chunk. Periodic re-anchoring fights drift but may cause a visible refresh. | 17 credits/s, approximately $6.12/h | High-resolution streaming **video editor** |
| **LTX** | Required portrait image and script; optional scene prompt, WPM, seed, explicit duration | `main_video` plus `main_audio`: talking portrait and generated voice | Configure while idle; start/stop/pause/resume/reset. Conditions changed mid-run queue for the next take rather than altering the current take. Same seed pins voice identity. | 24 fps at 640×352. Streams window-by-window; cold first take is slower than warm restarts. Conditions cannot change mid-take. | 300 credits/s, approximately $108/h | Real-time **talking-avatar generator**, not a world simulator |

Primary hosted sources: [Happy Oyster API](https://www.reactor.inc/models/happy-oyster/api) and [specs](https://www.reactor.inc/models/happy-oyster/info); [LingBot World 2 API](https://www.reactor.inc/models/lingbot-world-2/api) and [specs](https://www.reactor.inc/models/lingbot-world-2/info); [LingBot API](https://www.reactor.inc/models/lingbot/api) and [specs](https://www.reactor.inc/models/lingbot/info); [Helios API](https://www.reactor.inc/models/helios/api) and [specs](https://www.reactor.inc/models/helios/info); [LongLive 2 hosted page](https://www.reactor.inc/models/longlive-v2) and [typed package](https://www.npmjs.com/package/@reactor-models/longlive-v2); [X2 API](https://www.reactor.inc/models/x2/api) and [specs](https://www.reactor.inc/models/x2/info); [SANA-Streaming API](https://www.reactor.inc/models/sana-streaming/api) and [specs](https://www.reactor.inc/models/sana-streaming/info); [LTX API](https://www.reactor.inc/models/ltx/api), [specs](https://www.reactor.inc/models/ltx/info), and [launch post](https://www.reactor.inc/blog/ltx-on-reactor).

## Model-by-model implementation notes

### 1. LingBot World 2: strongest world-model-native choice

**Minimal flow**

```text
npx create-reactor-app my-app --model=lingbot-world-2
npm install @reactor-models/lingbot-world-2
connect JWT -> upload seed image -> setImage -> setPrompt -> wait for acknowledgements -> start
keydown/up -> setMoveLongitudinal / setMoveLateral / setLookHorizontal / setLookVertical
render main_video track
```

The browser must not receive the persistent Reactor API key. A server route exchanges it for a short-lived, model-scoped JWT; Reactor documents tokens as valid up to six hours. Commands are asynchronous, and success/error arrives as messages, so the UI should enable **Start** only after `image_accepted`/`conditions_ready`, and show `command_error` rather than assuming the method call succeeded.

World 2 improves materially on original LingBot for a demo:

- Longitudinal and lateral movement are independent, so diagonal WASD movement is possible; the original offers one mutually exclusive movement enum.
- `set_camera_pose` accepts a six-value relative rotation/translation tuple or per-frame tuples. This makes scripted camera paths, joystick control, or a “rehearse this route” feature possible.
- `set_attn_window` trades still-scene stability against moving-camera smoothness.
- KV-cache refresh acknowledges that accumulated history can drift; automatic/manual refresh can re-ground the stream on the initial image.
- Reactor supports prompt hot-swaps, but changing the seed image during generation requires reset/restart.

**Important upstream-vs-hosted gap:** the July 2026 upstream paper describes a 720p/60 fps distilled variant, combat/archery/spell/shooting actions, an agentic harness, and multiplayer ([paper](https://arxiv.org/abs/2607.07534), [repo](https://github.com/robbyant/lingbot-world-v2)). Reactor’s current public contract advertises 16 fps/up to 960p and exposes camera movement plus prompts, not those semantic action APIs. Build only against the hosted API surface; do not promise upstream-demo features.

**Two-hour feasibility:** high for one polished path: seed-image picker, prompt box, stream, WASD/arrows, status/latency indicator, reset. Low for robot training, multiplayer, generated collision logic, or accurate environment reconstruction.

### 2. Happy Oyster: strongest semantic world alternative

The typed package is `@reactor-models/happy-oyster`. Unlike LingBot World 2, a seed image is optional: `createWorld` accepts a text prompt and optional public landscape-image URL, builds the world, and returns an `encrypted_world_id` that can be saved and reopened with `attachWorld`.

Happy Oyster splits control into two session modes:

- **Adventure:** choose first- or third-person perspective, call `startTravel`, then use held `move` and `look` directions. `interact` accepts built-in verbs such as `Jump`, `Attack`, `Crouch`, and `Sprint`, plus arbitrary strings; `travel_state` advertises character and environment actions available in the current world.
- **Directing:** use free-text `instruct`, pause/resume, and rewind to a prior four-second boundary. This is strong for live storytelling and counterfactual branches.

The tradeoff is that the mode is fixed for the session. The hosted API does not document `instruct` in Adventure or WASD in Directing. Therefore Happy Oyster cannot be assumed to support both free navigation and arbitrary timed hazards in one run. For ZERO-DAY RESCUE, preflight whether `interact({ action: "Aftershock" })`, `Scan`, `Assist`, and `Retreat` create coherent visible consequences. If they do, Happy Oyster's semantic interactions and prompt-only world creation may make a stronger judge demo than LingBot. If they do not, retain LingBot World 2 and its documented live prompt swapping.

**Two-hour feasibility:** high for one Adventure world with WASD and a few discovered interaction verbs; medium for the exact scripted disaster sequence because world build time, advertised actions, and custom verb behavior must be measured. Cost is also much higher, so connect only for rehearsals and the demo.

### 3. LingBot: viable fallback, less expressive control

Integration is almost identical through `@reactor-models/lingbot`. It is cheaper in engineering time if a working starter already exists, but not in hosted credits. Its movement command is one of idle/forward/back/strafe-left/strafe-right, so diagonal motion is not directly expressible. It lacks World 2’s explicit camera-path, attention-window, and cache-reset endpoints. Use it only if World 2 capacity or starter reliability becomes a problem.

The original research describes an action-conditioned “world simulator stemming from video generation,” minute-level context, and sub-second interaction at 16 fps ([paper](https://arxiv.org/abs/2601.20540)). That wording does not establish calibrated physical accuracy.

### 4. Helios: best branching narrative, not WASD

The typed package is `@reactor-models/helios`. A prompt is required before `start`; an image is optional. Hot-swapped prompts/images apply on the next 33-frame chunk. The most differentiating Reactor-only UX is snapshot/rewind:

- save a model-history/RNG checkpoint;
- rewind to a checkpoint;
- apply a different prompt;
- generate a visible alternate branch.

That is strong for “what if?” storytelling or counterfactual **visualization**. It is not a physical counterfactual because the saved state is latent video history, not variables that a user can inspect or constrain. There is no WASD/camera-action interface in the hosted API. The upstream implementation also cautions that interactive functionality is under development and may not meet expectations ([official repository](https://github.com/PKU-YuanGroup/Helios)).

**Two-hour feasibility:** high for prompt/image branching with snapshot buttons; medium risk if a design assumes fine-grained direct manipulation. Each control change is chunk-delayed by about 1.4 seconds.

### 5. LongLive 2: storyboard, not simulation

The typed package is `@reactor-models/longlive-v2`. The smallest flow is `setShot(openingPrompt)` then `start`. Mid-stream:

- `setShot` is a soft change retaining motion/identity/world memory;
- `sceneCut` is a hard new scene, clearing memory with a documented one-time transition;
- `scheduleShot` and `scheduleSceneCut` place changes at session chunk indices.

This is excellent for live storyboarding, “show three futures,” product concept films, and a generated safety-training *video*. It provides no user movement, webcam, pointer, scene geometry, or physical state. The upstream [NVLabs repository](https://github.com/NVlabs/LongLive) confirms LongLive 2 is long-video generation infrastructure; do not mistake its multi-shot memory for world state.

**Two-hour feasibility:** high for a prompt timeline and generated montage, but its mismatch with “World-Model Native” makes it a weak primary choice for this event.

### 6. X2: easiest high-impact camera interaction

The typed package is `@reactor-models/x2`. Publish a browser `MediaStreamTrack` to `source`, set a prompt, and generation starts automatically; output arrives on `main_video` at 24 fps. A still image is supplied as a repeated canvas/video stream, not uploaded as a special still source.

Practical details from the [API](https://www.reactor.inc/models/x2/api):

- pointer coordinates are normalized 0–1 and sampled once per generated block; sending around 30 Hz is sufficient;
- `keep_backlog=false` drops stale camera frames and is right for live interaction;
- `keep_backlog=true` consumes every frame, giving smoother clip/drag animation but accumulating delay;
- output resolution locks when the run starts;
- a reference image can insert/swap an object or character; changing it can restart the generation stream;
- published model latency is absent, so measure it in the event environment rather than citing Reactor’s separate sub-50 ms network claim as inference latency.

**Two-hour feasibility:** very high. It has the fewest moving parts and produces an obvious before/after. It is a poor foundation for claims about future physical outcomes because it edits the present camera image.

### 7. SANA-Streaming: stronger preservation/editing, slower control loop

The documented low-risk JavaScript path uses base `@reactor-team/js-sdk` with model name `reactor/sana-streaming`, although a typed model package now also exists. In live mode publish `camera`; in file mode upload a video with at least 33 frames. Use `set_mode`, optional `set_prompt`, then `start`.

Its 24-frame chunks and approximately one-second edit latency are appropriate for live stylization but not twitch controls. `set_anchor_interval` periodically pulls the generated edit back toward the source because long edits can drift; that is useful evidence that even preservation-oriented video models are not exact transforms. A browser’s mid-stream camera resolution change can crash a live session, so request and hold a fixed resolution.

The official research reports 1280x704 at 24 end-to-end fps on an RTX 5090 ([project page](https://nvlabs.github.io/Sana/Streaming/), [paper](https://arxiv.org/abs/2605.30409)); the relevant demo latency remains the Reactor-hosted approximately 1–1.5 seconds per chunk.

### 8. LTX: real-time speaking avatar, not a world

The typed starter is `npx create-reactor-app my-ltx-app --model=ltx2`, and the core client is imported from `@reactor-models/ltx2/core`. The current hosted endpoint accepts a portrait, script, optional scene/motion prompt, speaking pace, seed, and optional fixed duration. It streams `main_video` and `main_audio` together at 24 fps, 640×352. The same seed keeps voice identity stable across takes.

The unit of interaction is a **take**, not a continuously steerable world. Conditions are committed at `start`; changes during a run queue for the next take. This makes LTX useful for:

- a mission commander delivering the brief or debrief;
- Einstein, a samurai mentor, or another speaking guide;
- a post-session coach reading authored feedback;
- interactive-film dialogue where an external LLM writes each next take.

It is not suitable for navigation, environment simulation, live hazard injection, or the main ZERO-DAY RESCUE loop. Reactor's LTX launch post discusses future real-time autoregressive world generation, but the currently documented hosted API is the portrait-to-talking-avatar product. Do not attribute future world controls to today's endpoint.

**Two-hour feasibility:** high for one prepared speaking avatar; low as an add-on to an already ambitious world-model demo. At approximately $108/hour it is also the most expensive listed endpoint. Add it only after the core mission is stable.

## Physical-accuracy boundary

### What these models can credibly do

- Rapid **experience prototypes**: “what might it feel/look like to navigate this scenario?”
- Visual ideation and previsualization before an expensive build, trip, shoot, room layout, or training exercise.
- Generate diverse visual edge cases for human discussion.
- Create an interactive interface around a separate, trusted state/rules/simulation engine.
- Provide a compelling front end for a digital twin when geometry and state come from another system.

### What they cannot credibly establish on their own

- Whether a robot policy is safe, collision-free, or transferable to hardware.
- Whether a 3D-printed part fits, bears load, prints successfully, or meets tolerances.
- Whether a treatment, vein location, drug effect, plant regimen, fire route, or structural decision is safe/effective.
- Quantitative future state after months of weather, watering, wear, traffic, chemistry, or biology.
- Exact geographic/street fidelity, object permanence, conservation laws, or repeatable causal outcomes.

The evidence is the API contract itself: every model’s server-to-client media output is a video track. None exposes measurements or a structured world-state channel. Seed reproducibility only makes the generator repeat a rollout under the same conditions; it does not validate the rollout against reality.

### Safe hybrid architecture

```text
real source data + deterministic/specialist simulator
                  |
          structured state and outcomes
                  |
        prompt/image/camera conditioning
                  v
        Reactor visual world or editor
                  |
          interactive video experience
```

For a two-hour build, the “simulator” can be a small transparent rules engine rather than pretending the generator knows the domain. Example: a hazard map owns doors, heat, smoke, time, and score; LingBot World 2 renders the user’s route and atmosphere. The demo should label generated imagery as illustrative.

## Fit to the supplied personal ideas

| Idea | Best listed model | Feasible honest framing | Critical limitation |
|---|---|---|---|
| Webcam shows veins | None for vein detection; X2/SANA only for a clearly fictional overlay | Camera UI/AR concept visualization using a supplied mask from a validated detector | RGB generative video cannot locate clinically usable veins; hallucination could cause injury |
| Months of potted-plant growth | Helios or LongLive 2 only as visualizer | External plant/weather/rules calculation chooses growth-stage prompts; model renders branches/timelapse | No numerical weather/light/watering inputs or botany validation; long video is not months of causal simulation |
| Trip planning in future weather | Happy Oyster or LingBot World 2 for experiential view; X2/SANA for source Street View stylization | External map, itinerary, and weather APIs own facts; Reactor visualizes “rainy/crowded/hot” ambiance | Generated streets can alter landmarks/routes; not navigational evidence |
| 3D-print design | None as validator; Helios/X2 only for appearance | Concept previsualization around a real CAD/STL/checker pipeline | No mesh/STL output, units, tolerances, slicing, stress, or collision checks |
| Visualize drug-trip aesthetics | X2 or SANA-Streaming | Entertainment/art filter with no medical claim | Cannot represent an individual’s neurophysiology or predict subjective effects; safety/age framing needed |
| Adaptive escape-room game | **Happy Oyster Adventure** if its world-advertised action verbs are reliable; otherwise LingBot World 2 | Generated navigable atmosphere plus a code-owned puzzle inventory/state machine | Do not rely on video pixels for exact clue persistence, locks, inventory, or solvability |

## Judging-criteria assessment

Scores are relative 1–5 estimates for a **two-hour** build, assuming an API key/credits are working before the clock starts.

| Model | World-Model Native | Real Time | User Experience | Technical Execution | Potential & Impact | Total | Rationale |
|---|---:|---:|---:|---:|---:|---:|---|
| **Happy Oyster** | 5 | 5 | 5 | 4 | 4 | **23** | Most complete semantic world UX: prompt-only creation, WASD/look, action verbs, persistent worlds, plus a separate directing/rewind mode; expensive and cannot combine both modes in one session |
| **LingBot World 2** | 5 | 4 | 5 | 4 | 4 | **22** | True action-conditioned navigable stream, WASD/arrows, typed scaffold; chunk delay and pixel-only state are the main limits |
| **X2** | 2 | 5 | 5 | 5 | 3 | **20** | Best live camera/direct-manipulation demo, but it edits a source rather than simulating an explorable future |
| **LingBot** | 4 | 4 | 4 | 4 | 4 | **20** | Native navigation but less expressive than World 2 at the same hosted price |
| **Helios** | 3 | 4 | 4 | 4 | 3 | **18** | Infinite coherent video and rewind/branching are compelling, but no action/navigation interface |
| **LongLive 2** | 1 | 4 | 4 | 4 | 3 | **16** | Excellent prompt storyboard, weak match for world simulation |
| **SANA-Streaming** | 1 | 4 | 4 | 4 | 3 | **16** | High-quality live editor, approximately one-second chunk delay, no generated-world controls |
| **LTX** | 1 | 4 | 5 | 4 | 3 | **17** | Strong synchronized speaking-avatar UX, but takes cannot be steered mid-run and there is no navigable world |

## Final recommendation for the two-hour build

1. **Primary for ZERO-DAY RESCUE:** LingBot World 2, one seed world, WASD + arrow controls, promptable environment events, and a visible objective/score owned by ordinary application code. It is the safer match for the exact mission because movement and live prompt changes coexist in the same mode.
2. **A/B preflight Happy Oyster:** build one Adventure world and test `Scan`, `Assist`, `Retreat`, and an aftershock/environment action. If the advertised/custom verbs produce reliable consequences, Happy Oyster may deliver the stronger world-model-native judge experience. Do not assume Directing's `instruct` or rewind is available while navigating.
3. **Keep scope strict:** one polished scenario, one interaction loop, no attempt to integrate robotics/medical/CAD/plant science in the two-hour window.
4. **Design for held/chunked control:** keydown sets movement and keyup releases it; show model status so response delay feels intentional.
5. **Preflight before the event:** token route, model-scoped JWT, session capacity, browser autoplay/WebRTC, world build/start latency, available action verbs, and at least ten minutes of sustained generation. Connect only while rehearsing or presenting.
6. **Fallback:** original LingBot for navigable video; X2 for the safest technical spectacle. Pitch X2 as interactive generative visualization, not physical simulation.
7. **Optional polish only:** LTX can deliver a spoken commander brief/debrief after the mission is stable. It should never displace the live navigation loop in the two-hour plan.

## Source notes and unresolved facts

- Reactor’s model pages and generated API schemas are the authority for the hosted endpoints. Upstream papers/repos describe model-family capabilities that may not be exposed by Reactor.
- Reactor currently publishes no model-latency number for X2 and no hosted fps/resolution specification for LongLive 2. Those fields should be measured, not guessed.
- Happy Oyster publishes sub-second latency but not a frame-rate figure. Custom Adventure verbs, world build time, and whether the desired disaster verbs are advertised must be tested in the actual account.
- LTX's current hosted endpoint is a talking-avatar take generator. Reactor's launch post mentions future autoregressive world generation; that is not an available control in the documented endpoint.
- “Infinite” and “minute-level consistency” describe generation horizon/visual coherence, not guaranteed object permanence or exact state.
- Pricing and endpoint behavior are current as of the research date and may change.

### Primary sources

- Reactor: [model catalog](https://www.reactor.inc/models), [platform/SDK overview](https://www.reactor.inc/)
- Reactor: [Happy Oyster API](https://www.reactor.inc/models/happy-oyster/api), [info](https://www.reactor.inc/models/happy-oyster/info)
- Reactor: [LingBot World 2 API](https://www.reactor.inc/models/lingbot-world-2/api), [info](https://www.reactor.inc/models/lingbot-world-2/info)
- Reactor: [LingBot API](https://www.reactor.inc/models/lingbot/api), [info](https://www.reactor.inc/models/lingbot/info)
- Reactor: [Helios API](https://www.reactor.inc/models/helios/api), [info](https://www.reactor.inc/models/helios/info)
- Reactor: [X2 API](https://www.reactor.inc/models/x2/api), [info](https://www.reactor.inc/models/x2/info)
- Reactor: [SANA-Streaming API](https://www.reactor.inc/models/sana-streaming/api), [info](https://www.reactor.inc/models/sana-streaming/info)
- Reactor/NPM: [LongLive 2 hosted page](https://www.reactor.inc/models/longlive-v2), [typed SDK package](https://www.npmjs.com/package/@reactor-models/longlive-v2)
- Reactor: [LTX API](https://www.reactor.inc/models/ltx/api), [info](https://www.reactor.inc/models/ltx/info), [launch post](https://www.reactor.inc/blog/ltx-on-reactor)
- Robbyant: [LingBot-World paper](https://arxiv.org/abs/2601.20540), [LingBot World 2 paper](https://arxiv.org/abs/2607.07534), [World 2 repository](https://github.com/robbyant/lingbot-world-v2)
- NVIDIA: [LongLive 2 repository](https://github.com/NVlabs/LongLive), [SANA-Streaming project](https://nvlabs.github.io/Sana/Streaming/), [SANA-Streaming paper](https://arxiv.org/abs/2605.30409)
- PKU YuanGroup: [Helios repository](https://github.com/PKU-YuanGroup/Helios), [project page](https://pku-yuangroup.github.io/Helios-Page/)
