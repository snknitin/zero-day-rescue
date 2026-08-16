# World-model hackathon idea evaluation

**Decision:** build **ZERO-DAY RESCUE**, a rescue-robot operator drill whose first mission is codenamed **Aftershock**. The environment changes after each response decision. It is the best intersection of world-model-native interaction, visible real-time responsiveness, a credible need for dangerous-scenario rehearsal, and a two-hour MVP.

**Runner-up:** **Rover Zero**, a planetary rover route-rehearsal experience. It is almost as strong, has fewer sensitivity concerns, and makes the “too dangerous/remote/expensive to trial physically” argument immediately obvious.

This ranking is optimized for a **two-hour build**, not for the eventual size of the market.

---

## 1. The crucial product distinction

A world model is justified when the experience needs a user to take an action, see a plausible next state immediately, and try another action inside a world that would be expensive, slow, inaccessible, or dangerous to reproduce physically.

That is different from merely generating a video. It is also different from a trustworthy engineering simulator.

For this event, the available models are strongest as **interactive visual scenario generators**:

- Happy Oyster creates a persistent navigable world from text and an optional starting image. Adventure mode supports WASD/look plus built-in or world-advertised interaction verbs; Directing mode instead supports free-text direction and rewind. This strengthens generated games and operator-rehearsal concepts, but the two control modes cannot be assumed to work simultaneously. [Official Happy Oyster API](https://www.reactor.inc/models/happy-oyster/api)
- LingBot World 2 accepts a seed image and prompt, generates a continuously navigable stream, maps WASD/arrow input to movement/look, and allows live prompt changes. That is the most direct fit for first-person exploration and rehearsal. [Official LingBot World 2 API](https://www.reactor.inc/models/lingbot-world-2/api)
- X2 edits webcam/video/image input at 24 fps, supports a reference image, live re-prompting, and drag-pointer control. It is strongest for live transformation, not causal simulation. [Official X2 API](https://www.reactor.inc/models/x2/api)
- SANA-Streaming edits webcam or uploaded video in chunks and supports mid-stream re-prompting. It is a visual editor, not a navigable world. [Official SANA-Streaming API](https://www.reactor.inc/models/sana-streaming/api)
- Helios makes an infinite autoregressive video stream that can be steered with prompt and reference-image changes. It suits reactive scenes and audiences, but does not expose WASD navigation. [Official Helios API](https://www.reactor.inc/models/helios/api)
- LongLive 2 is optimized for coherent multi-shot/storyboard video. It is useful for a replay or cinematic outcome, but it is not the primary interaction engine. [Official LongLive 2 page](https://www.reactor.inc/models/longlive-v2)
- LTX turns a portrait and script into a real-time speaking take with synchronized generated voice and lip movement. It materially helps mentor, guide, and character concepts, but it has no navigable environment and changes queue for the next take rather than steering the current one. [Official LTX API](https://www.reactor.inc/models/ltx/api)

Current research still treats action conditioning, long-horizon consistency, physical plausibility, and sim-to-real transfer as hard problems. A recent robot world-simulator result required a domain-specific interaction dataset and evaluated correlation against real robot performance; that is a very different evidence bar from prompting a general video model. [Interactive World Simulator paper](https://arxiv.org/abs/2603.08546) Research comparing video generators with physical laws likewise warns against assuming visually plausible video is a valid physical simulator. [Physical-law evaluation](https://openreview.net/forum?id=ZyLkNVHBZF)

**Therefore:** describe the hack as a **scenario rehearsal, pre-mortem, or counterfactual visualization prototype**. Do not call it a validated fire, structural, medical, biological, autonomous-driving, or robot-training simulator.

---

## 2. Scoring rubric

The event's five official criteria are primary. The event brief supplied the criteria but did not specify weights, so this analysis uses the following explicit working weights. Each idea receives a 1–10 score on each dimension, converted to 100:

| Criterion | Weight | What earns a 9–10 |
|---|---:|---|
| World-Model Native | 30% | The core loop is action → generated next state → next action; the experience collapses without a world model. |
| Real Time | 20% | Continuous output and user input visibly change the stream during the demo. |
| User Experience | 15% | The premise is understood in seconds; controls and goal are obvious; there is a beginning, tension, and outcome. |
| Technical Execution | 15% | A stable two-hour MVP can be built directly on exposed model events without training, custom 3D assets, or fragile integrations. |
| Potential & Impact | 20% | Solves an expensive, slow, inaccessible, or dangerous rehearsal need, or creates a compelling new medium. |

Secondary tie-breakers were feasibility within two hours, demo “wow,” safety/claim exposure, data/input burden, WASD/arrow fit, and differentiation from a thin model playground.

Scores are directional product judgments, not empirical measurements. A high-impact robotics idea can score below a game because this particular model/API cannot produce robot actions, contacts, labels, or validated physics in two hours.

---

## 3. Shortlist: strongest concepts

| Rank | Concept | Source idea(s) | WM Native | Real Time | UX | Execution | Impact | Weighted /100 |
|---:|---|---|---:|---:|---:|---:|---:|---:|
| 1 | **ZERO-DAY RESCUE: Aftershock mission** | 23, 37 | 10 | 9 | 9 | 8 | 10 | **93.5** |
| 2 | **Fireline: fireground size-up rehearsal** | 31 | 10 | 9 | 8 | 8 | 10 | **92.0** |
| 3 | **Rover Zero: planetary route rehearsal** | 29 | 10 | 9 | 9 | 8 | 9 | **91.5** |
| 4 | **BuildBefore: costly-space pre-mortem** | 46, partial 34/49 | 9 | 9 | 9 | 8 | 9 | **88.5** |
| 5 | **The Building Fights Back: adaptive heist/escape room** | Personal 6, 8 | 10 | 10 | 9 | 9 | 6 | **87.0** |
| 6 | **Audience Reactor: responsive public-speaking rehearsal** | 43 | 8 | 9 | 9 | 8 | 9 | **85.5** |
| 7 | **Infinite Road: the road invents hazards as you drive** | 5 | 10 | 10 | 9 | 9 | 4 | **83.0** |
| 8 | **SignScape: hands-free world building** | 18, 16 | 8 | 9 | 8 | 6 | 9 | **80.5** |

### 1) ZERO-DAY RESCUE — recommended build

**One-line pitch:** “Teleoperate a rescue robot through the first 90 seconds of an AI-generated disaster zone; every decision changes what its camera sees next.”

Why it wins:

- A collapsed building, aftershock, chemical leak, or blocked egress is dangerous and expensive to stage repeatedly.
- WASD navigation is part of the task rather than decoration.
- Live prompt swaps make consequences immediately visible: smoke thickens, a corridor collapses, lighting fails, or a survivor appears.
- The judge sees a complete loop: brief → enter → inspect → decide → consequence → score/debrief.
- It can be framed honestly as low-cost **operator/tabletop visual rehearsal**, not robot certification or autonomous-policy training.

Two-hour MVP flow:

1. Show a 10-second mission card: “Locate two survivors; do not enter unstable zones; 90 seconds.”
2. Start LingBot World 2 from one curated disaster seed image.
3. Let the user move with WASD/arrows. Keep three large action buttons/keys: `Q Scan`, `E Assist`, `R Retreat`.
4. Each action updates a deterministic app state and score, then sends a prepared prompt change such as “aftershock; dust; stairwell now blocked; maintain the same rescue site.”
5. At 60 seconds trigger one guaranteed escalation. At 90 seconds freeze and show rescued people, hazards noticed, unsafe decisions, and time.

Implementation risks and containment:

- **Model may not preserve exact layout.** Use a short 60–90 second run and one visual landmark; never ask the judge to navigate back through a precise floor plan.
- **No semantic event callback from generated pixels.** Do not attempt collision/hazard recognition. Trigger events from explicit keys, timer, and a deterministic state machine.
- **Safety claim risk.** Put “AI-generated rehearsal; not predictive, certified, or for operational decisions” directly in the UI.
- **Prompt latency/drift.** Prepare three short prompts, use a fixed seed/reference, and rehearse one golden path.

### 2) Fireline

**Pitch:** a firefighter trainee performs a 360-degree visual size-up while conditions deteriorate.

MVP: choose residential/warehouse fire, explore, mark visible hazards using three buttons, then switch prompts to wind shift/flashover risk/blocked exit. Score only the user's recognition choices; do not score “correct physics.”

Why it is slightly below Aftershock: it has exceptional need and demo tension, but “firefighter training” invites stronger accuracy/certification scrutiny. Present it as a **scenario authoring and discussion tool** for instructors.

Main risks: unrealistic flame/smoke behavior, layout drift, and the temptation to claim training efficacy. Avoid any operational advice.

### 3) Rover Zero

**Pitch:** “Rehearse a route on a world humans cannot safely visit, then survive a dust storm and communications delay.”

MVP: start with a Mars/lunar terrain seed; WASD drive/walk; allow `Scan`, `Sample`, and `Return`; track battery and communications deterministically; re-prompt a dust storm or rockfall after the sample. NASA/JPL rover operations genuinely use simulation and terrain models for route planning and command/state checking, which makes the category easy to defend—although this prototype is visual, not mission-grade. [JPL Mars mobility lessons](https://www-robotics.jpl.nasa.gov/media/documents/Townsend_2024LSIC_MarsMobility_Poster_v1.pdf)

Risks: the video model cannot estimate traction, energy, geometry, or actual route safety. Label it “mission rehearsal fiction / scenario ideation.”

### 4) BuildBefore

**Pitch:** “Before spending millions or waiting a year, walk the proposed space under the conditions the render never shows.”

MVP: upload one architect render as seed; walk it; toggle `Night`, `Heavy rain`, `Crowded`, and `Emergency lighting`; pin observations to a side panel; export a short concern list.

The world-model-native part is not the base walkthrough—conventional 3D can do that—but the immediate, asset-free counterfactual restaging of the space. The app should explicitly say it evaluates **experience and stakeholder questions**, not dimensions, code compliance, evacuation time, lighting lux, flood behavior, or structural safety.

Risks: exact geometry will drift and prompt changes may redesign the building. Limit the claim to “design conversation starter,” and use a distinctive landmark in the seed.

### 5) The Building Fights Back

**Pitch:** an escape/heist room watches your choices and redesigns the next obstacle to counter your strategy.

MVP: show a goal (“steal the blue artifact”), enter with WASD, and offer three contextual actions. Every action changes deterministic flags (`alarm`, `tool`, `time`) and re-prompts the next state. A final success/failure screen proves there is game logic outside the video stream.

Happy Oyster Adventure is now the first model to preflight for this concept because world-advertised interaction verbs and reopenable worlds fit a game better than raw camera controls. Keep puzzle/inventory truth in code, and fall back to LingBot World 2 if custom verbs or visual continuity are unreliable.

Why it is strong: extremely world-model-native, low safety risk, easy to understand, and likely to produce the most reliable stage demo. Why it does not rank first: weaker real-world need and many teams may build adaptive games.

Risks: visual continuity and unclear object interaction. Never require pixel-perfect object pickup; use explicit action buttons and state overlays.

### 6) Audience Reactor

**Pitch:** “Practice the same talk against a friendly room, a bored boardroom, or a hostile press audience that reacts as you speak.”

MVP: Helios generates the audience from a room reference; the browser measures only simple local audio features (silence duration and volume); thresholds switch among three prepared audience prompts; the debrief shows speaking time, long pauses, and environment level.

There is credible evidence that simulated exposure is useful in this domain: a meta-analysis of 11 studies/508 participants found significant reductions in public-speaking anxiety from VR exposure versus control. That does **not** validate this hack as therapy, so market it as practice, not treatment. [Meta-analysis](https://journals.sagepub.com/doi/10.1177/0145445521991102)

Risks: audience reactions may be visually unstable; audio metrics are not coaching quality. Avoid emotion diagnosis, anxiety measurement, or therapeutic claims.

### 7) Infinite Road

**Pitch:** the world invents a new road and hazard every few seconds while the player drives.

MVP: LingBot World 2 + WASD/arrows, score distance survived, and inject a deterministic sequence of fog, flood, animals, and roadworks through prompt changes.

Why it works: near-perfect control/model fit and a strong live demo. Why it ranks lower: it is close to the default “walk/drive through generated world” demo and has little defensible impact. Differentiate with a visible “scenario director” timeline and replay card.

Risk: do not frame it as autonomous-vehicle validation; it produces no vehicle telemetry, labels, closed-loop driving policy, or reliable edge-case physics.

### 8) SignScape

**Pitch:** a small vocabulary of signs/gestures creates and changes a navigable world without speech or typing.

MVP: recognize only four rehearsed gestures locally, map them to known prompts (`forest`, `rain`, `mountains`, `home`), and show the recognized token before it changes the world. Navigate with large on-screen controls or a second gesture set only if time permits.

Why it is interesting: it turns accessibility-oriented input into live generative agency. Risk: sign language is a full language; four gesture tokens must not be described as sign-language understanding. A false recognition on stage also makes this materially less reliable than the top seven.

---

## 4. Full evaluation of all submitted ideas

The number is the weighted official-criteria score out of 100. “Prototype only” means the idea has long-term merit, but the current Reactor models or two-hour window cannot support the implied claim.

### Personal ideas

| ID | Idea | Score | Verdict for this hackathon |
|---|---|---:|---|
| P1 | Webcam reveals arm veins | 30 | **Reject.** X2 could hallucinate plausible veins, making a medical-looking output unsafe and potentially misleading. It is an image transformation, not vein detection or physical simulation. |
| P2 | Plant growth from watering/sun/weather regimen | 47 | **Prototype only.** A visually pleasing time-lapse is possible, but the models cannot predict species-specific growth over months. Inputs and biological calibration overwhelm a two-hour build. |
| P3 | Future-weather trip/street-view rehearsal | 64 | **Conditional.** Good experiential what-if, but exact place/weather/date claims are brittle, map/street-view ingestion adds burden, and geometry will drift. Frame as inspiration, not a forecast or safety tool. |
| P4 | 3D-print design/failure simulation | 51 | **Prototype only.** Valuable expensive-iteration problem, but a video model cannot validate tolerances, supports, warping, load, or printability. A conventional slicer/physics tool is essential. |
| P5 | Drug-trip camera visualization | 56 | **Visually feasible, strategically weak.** X2/SANA fit well, but it is a filter, not a world model; need and impact are weak and responsible framing is awkward. |
| P6 | Interactive escape room | 81 | **Shortlist when merged with #8.** Strong, clear, controllable demo; add deterministic game state so it is more than free exploration. |

### Event board: Interactive Media (1–20)

| # | Idea | Score | Verdict for this hackathon |
|---:|---|---:|---|
| 1 | Walk through reactive Ancient Rome | 76 | Strong visual exploration, but “as it actually was” creates historical-accuracy claims and Rome asset/research burden. Say “inspired reconstruction.” |
| 2 | Raise a dragon that remembers teaching | 79 | Charming and sticky, but durable memory/character behavior requires an external state/LLM layer; feasible only with 2–3 remembered facts. |
| 3 | Haunted house adapts to fear | 82 | Excellent demo if adaptation comes from explicit choices; webcam emotion inference adds risk and fragility. |
| 4 | Einstein explains relativity live | 64 | LTX now supplies a strong real-time speaking avatar, but an external LLM/grounding layer still does the teaching and the explorable world remains ornamental. |
| 5 | Racing game where road builds itself | 83 | Shortlist. Near-perfect real-time/control fit, but common and low-impact. |
| 6 | Paint a world, then enter | 84 | Excellent world-model-native creative tool; seed-image upload to LingBot is direct. Slightly less real need than top concepts. |
| 7 | Forest grows from sound | 75 | Beautiful audio-reactive installation; simple thresholds can drive prompts, but “growth” is visual rather than causal. |
| 8 | Heist where building redesigns after each move | 87 | Shortlist. Strong stateful game loop and differentiation; combine with personal escape-room idea. |
| 9 | Explore human body at cell size | 65 | Visually compelling education, but anatomy accuracy is unreliable and free navigation may mutate structures. |
| 10 | Living evolving aquarium | 62 | Model can depict evolution but not maintain a measurable ecosystem; weak action/outcome loop unless game rules live outside the model. |
| 11 | World runs backward | 78 | Distinct creative mechanic, but reliable causal reversal is difficult. Keep interactions symbolic and deterministic. |
| 12 | Samurai mentor reshapes world | 69 | LTX can deliver the speaking mentor and Happy Oyster can provide the world, but dialogue intelligence, lesson state, and cross-model orchestration still exceed a safe two-hour scope. |
| 13 | Voice sculpts mountains/rivers/weather | 76 | Strong creative UX with speech-to-prompt; exact sculpting is unlikely, so treat voice as scene direction. |
| 14 | Mirror world with opposite consequence | 75 | Original concept but requires an authored mapping of opposites; model alone will not preserve causal logic. |
| 15 | Detective story changes with theory | 76 | Good branched narrative; needs external story state/LLM and can become incoherent. Use only three theory buttons. |
| 16 | Webcam/gaze/expression controls world | 77 | Visibly real time, but webcam CV integration and false emotion inference add risk. Gesture/gaze should be explicit controls, not psychological diagnosis. |
| 17 | Ambient sound changes gameplay | 75 | Easy audio-feature integration and good stage interaction; lower need and unpredictable demo environment. |
| 18 | Sign language builds worlds | 79 | Impactful and differentiated, but full sign-language recognition is impossible in scope. A four-token gesture prototype is honest and feasible. |
| 19 | Every song becomes a walkable place | 74 | Attractive creative demo; copyright, audio analysis, and weak causal connection reduce score. Use user-provided/humming audio. |
| 20 | Interactive film characters remember conversations | 63 | LTX removes much of the avatar/lip-sync burden, but speech input, LLM characters, durable memory, multiple takes, and narrative state remain too much for two hours. |

### Event board: Robotics and Simulation (21–40)

| # | Idea | Score | Verdict for this hackathon |
|---:|---|---:|---|
| 21 | Train warehouse robot in infinite factories | 52 | Huge real value, wrong two-hour stack: no robot observations/actions, contacts, rewards, labels, or policy training. Demo would overclaim. |
| 22 | Drone practices city navigation | 60 | Visually plausible operator rehearsal, but no flight dynamics, depth, sensor model, or policy interface. Reframe as first-person route ideation only. |
| 23 | Disaster zones for rescue robots | 92 | **Top category when reframed as human/operator scenario rehearsal.** True robot policy training is out of scope. |
| 24 | Household robot learns a new home first | 53 | Compelling long-term use case, but needs spatial reconstruction and robot action conditioning. A generated look-alike home is not a digital twin. |
| 25 | Thousands of road conditions for self-driving | 57 | High-value research category, but a pretty video is not AV simulation: missing calibrated sensors, labels, trajectories, closed-loop policy, and validation. |
| 26 | Humanoid practices social interaction | 49 | Needs multi-agent action and language models plus safety/evaluation. Visual generation alone is insufficient. |
| 27 | Different-patient surgical simulator | 40 | **Reject.** Highest accuracy and harm stakes; anatomy, tissue mechanics, instruments, and haptics are absent. |
| 28 | Robot arms practice nonexistent factories | 48 | Needs kinematics, collision/contact physics, task objects, and policy actions. Current model is not a substitute for a robotics simulator. |
| 29 | Planetary exploration before rover mission | 92 | **Shortlist.** Ideal dangerous/remote premise and great WASD fit; keep all route/physics claims explicitly fictional. |
| 30 | Warehouses adapt as robots improve | 48 | Same missing robotics stack as #21 plus an environment-optimization loop. Too ambitious. |
| 31 | Firefighters in changing emergencies | 92 | **Shortlist.** Excellent danger/repetition rationale; instructor-led scenario visualization only, not certified training. |
| 32 | Logistics simulator with evolving cities | 50 | Logistics outcomes are numeric/network-based; video adds theater but cannot model demand, capacity, or routing. |
| 33 | Robot chef practices world kitchens | 45 | Requires manipulation, deformable food physics, tools, heat, and safety. Not feasible with navigable video. |
| 34 | Construction robots rehearse buildings | 44 | High-value but accuracy-critical; needs BIM, kinematics, scheduling, and collision/structural simulation. |
| 35 | Farming sim with natural weather/crop evolution | 50 | A game is possible, but agronomic prediction is not. Long horizon and many hidden variables undermine the implied benefit. |
| 36 | Airport digital twin for autonomous vehicles | 51 | “Digital twin” requires faithful geometry, operations data, agents, and validation. Generated video is not enough. |
| 37 | Search-and-rescue with AI-generated disasters | 94 | **Best source idea.** Human decision rehearsal produces a complete, honest MVP; autonomous-agent training does not. |
| 38 | Underwater autonomous exploration | 58 | Strong inaccessible-world premise and visual wow; lacks vehicle/sensor dynamics. Could be a Rover Zero visual variant. |
| 39 | Humanoids safely alongside humans | 47 | Impact is enormous, but multi-agent contact/safety validation is far beyond this stack and timeline. |
| 40 | New robotics environments every minute | 49 | Visually demonstrable but not usable robot training data without action interfaces, labels, geometry, and validation. |

### Event board: Learning, Research, and Creative Tools (41–50)

| # | Idea | Score | Verdict for this hackathon |
|---:|---|---:|---|
| 41 | Any textbook becomes an explorable world | 68 | Strong long-term idea, but ingestion, grounding, scene planning, and factual QA exceed two hours. Use one prepared paragraph if attempted. |
| 42 | Learn history by walking reconstructed civilizations | 75 | Great visual learning, but similar to #1 and accuracy-heavy. Use guided questions and disclose reconstruction uncertainty. |
| 43 | Public speaking in dynamic audiences | 86 | **Shortlist.** Real-time, understandable, and evidence-adjacent; avoid therapy/emotion-analysis claims. |
| 44 | Chemistry by shrinking into molecules/reactions | 48 | Visual metaphor can teach, but a generative video is not a molecular or reaction simulator; high misconception risk. |
| 45 | Biology lab with safely simulated experiments | 45 | Safe experimentation is a great need, but biology outcomes require validated domain models and structured variables. |
| 46 | Architects walk buildings before construction | 89 | **Shortlist.** Strong costly-purchase/delayed-outcome story; world model adds instant conditions, but cannot preserve exact BIM geometry. |
| 47 | Research paper becomes 3D simulation | 54 | “Any paper” is too broad; extraction and scientific validation dominate. One curated concept visualization is feasible. |
| 48 | Therapist builds calming environment from feelings | 62 | Pleasant and feasible as wellness ambiance; therapeutic and inferred-emotion claims create risk, and navigation may be unnecessary. |
| 49 | City digital twins test infrastructure | 53 | Excellent eventual market, but exact city data, multiple agents, infrastructure physics, metrics, and validation are absent. |
| 50 | Describe dream, wake inside it | 78 | Very natural world-model experience and low data burden; high wow, but lower need and differentiation than danger/cost rehearsal. |

---

## 5. Why many “important” simulations rank poorly

The strongest eventual physical-AI markets are not necessarily the strongest hackathon demos.

| Claim the idea needs | What a credible simulator would require | What the Reactor visual prototype can honestly show |
|---|---|---|
| “This robot policy will work” | Robot action/observation interface, contact dynamics, rewards, repeatability, sim-to-real validation | A human-steered visual scenario |
| “This building/route is safe” | Exact geometry, material/flow models, calibrated conditions, standards | Stakeholder experience and questions under imagined conditions |
| “This plant/patient will respond this way” | Validated biological model, longitudinal/domain data, uncertainty | A speculative visual outcome |
| “This AV handles rare hazards” | Multi-sensor simulation, labels, trajectory/occupancy truth, closed-loop policy evaluation | A generated first-person road scene |
| “This is where the vein is” | Medical imaging/sensing and clinical validation | An unsafe hallucinated overlay |

This is not a criticism of the ideas. It is a boundary around what can be proven in two hours with action-controlled generative video.

---

## 6. Recommended implementation pattern

The stable pattern is **deterministic state, generative rendering**:

```text
User input (WASD + 3 explicit actions)
          │
          ├──> deterministic app state
          │      timer, score, flags, mission phase, win/loss
          │
          └──> LingBot movement/look + prepared prompt update
                         │
                         └──> live generated video
```

Do not ask the model to remember the score, decide whether an object was collected, infer a collision, or guarantee the next plot beat. The React app owns truth; the world model renders the experience.

### Minimal build order for Aftershock

Before the two-hour clock, compare LingBot World 2's live prompt events with Happy Oyster Adventure's semantic action verbs. Lock the model before implementation; do not build two world integrations during the event.

1. Scaffold the official LingBot World 2 starter and confirm token/video output, or reopen one preflighted Happy Oyster world if its mission verbs proved stronger.
2. Wire WASD/arrows; do not change the generated SDK code.
3. Add a mission overlay, 90-second timer, three action buttons, and deterministic score.
4. Add exactly three prepared prompt transitions and one curated seed image.
5. Add debrief and safety label.
6. Rehearse a 75-second golden path and record a fallback capture.

Avoid map APIs, live weather, speech recognition, object detection, LLM orchestration, a database, user accounts, and multi-player in the two-hour version.

### Demo script

1. “Real disasters are dangerous and expensive to stage repeatedly.”
2. “This is an AI-generated rehearsal, not certified operational training.”
3. Enter the scene and move immediately so real-time control is undeniable.
4. Make one safe decision and show the world react.
5. Make one intentionally bad decision and trigger deterioration.
6. Finish on a debrief with deterministic facts: time, selected actions, score, and flags.

The visual model supplies surprise; the product supplies purpose and a finish line.

---

## 7. Final recommendation

Build **ZERO-DAY RESCUE** if winning against the official judging criteria is the priority; use **Aftershock** as its first mission. Build **Rover Zero** if the team wants a safer claim surface and a cleaner “impossible to test in the real world” story. Build **The Building Fights Back** if API reliability and stage entertainment matter more than social impact.

For ZERO-DAY RESCUE, LingBot World 2 remains the default implementation because WASD and arbitrary live prompt changes coexist. Happy Oyster is the preflight challenger because its persistent worlds and semantic actions may look more natively interactive. LTX is optional character/debrief polish, not the simulation engine.

Do not lead with the vein finder, plant predictor, drug-trip filter, or true robot/AV/surgery simulator. The first is unsafe, the next two are not world-model-native enough, and the robotics/medical claims require validation and interfaces that the supplied models do not expose.
