# Recommended build: ZERO-DAY RESCUE

> **One-line pitch:** Teleoperate a rescue robot through an endlessly variable disaster site: explore with WASD, make a rescue decision, and watch the world escalate in real time.

**Aftershock** is the first 90-second mission: enter an earthquake-damaged building, locate survivors, and retreat before a second collapse.

## Why this is the best two-hour bet

ZERO-DAY RESCUE sits in the useful overlap between the judging rubric and what the available models can genuinely do.

- It is **world-model native**: the core experience is a continuously generated, action-conditioned scene, not a static video, filter, chatbot, or dashboard.
- It is **real-time**: navigation and event changes occur during the session.
- It has an immediately legible **user experience**: enter a scenario, use familiar movement controls, choose an action, survive/debrief.
- It is technically bounded: one Reactor model, one streamed video view, keyboard controls, three or four scenario buttons, and a simple event log.
- It has a credible path beyond the hackathon as a scenario-authoring and rehearsal layer for workplace safety, first-responder familiarization, schools, event venues, and industrial onboarding.
- The real-world alternative—repeated live emergency exercises—is disruptive and cannot safely reproduce fires, structural failures, smoke, panic, or mass-casualty variation.

High-fidelity VR reviews support the value of safe, repeatable emergency rehearsal but also say it should complement, not replace, live simulation: [first-responder systematic review](https://pubmed.ncbi.nlm.nih.gov/38328887/). OSHA emphasizes emergency plans, worker roles, and practice drills: [OSHA emergency preparedness](https://www.osha.gov/emergency-preparedness/getting-started).

## The hackathon demo

### Narrow scenario

Use **an earthquake-damaged public building during an aftershock**. It is visually obvious, dangerous to stage, well matched to reconnaissance, and avoids clinical-treatment claims.

1. The user takes the role of a search-and-rescue robot operator with a simple mission: identify two survivors and retreat before the next aftershock.
2. App loads a prepared damaged-building reference image and scenario prompt.
3. The user enters the world and navigates with WASD/arrow keys.
4. At timed checkpoints, the app or a second “instructor” control injects an event:
   - an aftershock fills the corridor with dust;
   - emergency lights fail;
   - a survivor calls from a side room;
   - falling debris blocks the obvious return path;
   - a suspected gas leak forces an early retreat decision.
5. The user chooses a response from three large action buttons: **Scan**, **Assist**, or **Retreat**.
6. The choice is logged; the model is re-prompted with the visible consequence; the scene continues without leaving the experience.
7. After 60–90 seconds, a debrief timeline shows the user's decisions and makes clear that the exercise is for rehearsal, not certified safety instruction.

## What the model does versus what the app does

| Layer | Responsibility |
|---|---|
| LingBot World 2 | Primary visual engine: generates the navigable world, responds to camera movement, and accepts live prompt changes for timed hazards while navigation continues |
| Happy Oyster | Preflight alternative: Adventure mode adds prompt-only world creation, diagonal movement, semantic/world-advertised action verbs, and reopenable worlds; use it only if `Scan`, `Assist`, `Retreat`, and environment events work reliably without Directing mode |
| Scenario director | Holds the ordered event cards and converts each event/action into a concise prompt update |
| Training logic | Logs elapsed time and selected actions; optionally applies transparent, scenario-specific rules |
| UI | Streams video, captures WASD/arrow input, exposes three action buttons, shows the current objective and timer |
| Safety boundary | Labels output as generated rehearsal; never claims accurate fire spread, exact building layout, or certification |

This division is deliberate. Reactor's LingBot World 2 API exposes a seed image, prompt, live prompt replacement, movement/look controls, and a continuous output track. That is sufficient for a polished demo without inventing a physics or mapping API the model does not have: [official API reference](https://www.reactor.inc/models/lingbot-world-2/api).

Happy Oyster is a serious A/B candidate, not a generic fallback. Its [Adventure API](https://www.reactor.inc/models/happy-oyster/api) is arguably more world-model-native because the world advertises interaction verbs and persists across sessions. However, free-text `instruct` and rewind belong to separate Directing sessions, so the API does not guarantee the exact combination this mission needs: WASD plus arbitrary timed event injection. Preflight both models, then lock one before the two-hour clock.

LTX is not a world engine. Its current endpoint can optionally render a portrait-based commander briefing or debrief with synchronized generated voice, but adding a second expensive model weakens execution reliability unless the entire core loop is already finished: [official LTX API](https://www.reactor.inc/models/ltx/api).

## Judging rubric score

Scores are out of 10 and assume a reliable, visually polished implementation.

| Criterion | Score | Why |
|---|---:|---|
| World-Model Native | 9.5 | Unscripted visual world, navigation, scenario variation, and live event injection are the product—not decoration. |
| Real Time | 9 | Movement and hazard changes happen in-session; the only caveat is model chunk latency. |
| User Experience | 9 | Familiar controls, a single objective, obvious hazard cards, visible timer, and a short debrief create a complete loop. |
| Technical Execution | 8.5 | Uses the model's strongest documented capabilities and can be completed from Reactor's scaffold. Keep scoring simple to preserve reliability. |
| Potential & Impact | 9 | Response robots keep people away from unstable scenes; real training and procurement are established needs, but validation and expert-authored procedures are required after the prototype. |
| **Total** | **45 / 50** | Strong balance of model fit, demo clarity, and honest impact. |

## Why it could not be the same experience without a world model

A conventional authored VR drill can reproduce one carefully built facility and a fixed set of branches. DrillScape's core promise is different:

- a new visual environment can begin from a reference image rather than a modeled 3D level;
- weather, visibility, damage, crowds, obstructions, and atmosphere can be changed by language during the exercise;
- the scene continues to be synthesized in response to navigation rather than playing a pre-rendered clip;
- scenario authors can create new variations as event cards rather than asset pipelines.

It is true that a production safety simulator could be built with a game engine. The specifically world-model-native part is **open-ended, real-time scenario creation and continuation without pre-authoring each world and branch**.

## UX layout

```text
┌──────────────────────────────────────────────────────────────────┐
│ ZERO-DAY RESCUE   Aftershock Mission • 90 sec       01:12         │
├───────────────────────────────────────────┬──────────────────────┤
│                                           │ CURRENT OBJECTIVE    │
│                                           │ Locate survivors and │
│          LIVE GENERATED WORLD             │ retreat before the   │
│                                           │ next aftershock.     │
│             WASD to move                  ├──────────────────────┤
│          Arrow keys to look               │ EVENT                │
│                                           │ Return path blocked  │
│                                           ├──────────────────────┤
│                                           │ [Scan]               │
│                                           │ [Assist]             │
│                                           │ [Retreat]            │
├───────────────────────────────────────────┴──────────────────────┤
│ Generated rehearsal — not a map, twin, or safety certification   │
└──────────────────────────────────────────────────────────────────┘
```

## Prompt design

### Initial world prompt

```text
First-person camera view from a compact tracked rescue robot inside the accessible edge of an
earthquake-damaged public building. Dust in the air, damaged walls, emergency
lighting, and a clear route back outside. Maintain a stable navigable scene. No
text overlays, no cinematic cuts, no third-person camera.
```

### Event update

```text
Continue the same damaged building and viewpoint. A strong aftershock shakes
the scene; dust falls and loose debris now blocks the corridor ahead. A side
route remains visibly passable. Keep the event continuous and do not cut to
another location.
```

### Action consequence

```text
Continue the same scene. The user chose to scan from a safe position. A faint
survivor signal becomes visible from the side room while the damaged corridor
ahead remains unsafe. Preserve continuity and first-person navigation.
```

Prompts should describe observable scene changes, not ask the model to calculate structural safety, rescue correctness, or casualty outcomes.

## MVP versus optional polish

### Must ship

- prepared seed image;
- one preflighted navigable model connection and video output—LingBot World 2 by default, Happy Oyster Adventure only if its action verbs are proven;
- working WASD and look controls;
- one 60–90 second scenario with three timed event changes;
- three response buttons and an event log;
- restart button and a clear generated-rehearsal disclaimer.

### Add only if the core loop is stable

- instructor mode on a second panel;
- microphone narration or spoken choices;
- rule-based end score;
- two additional scenarios;
- recording/export;
- a comparison replay using the same seed.
- an LTX commander avatar reading the final authored debrief; treat this as post-core polish, not part of the required build.

## What not to build in the two hours

- authentication or user accounts;
- an LLM-based training curriculum;
- a real facility digital twin;
- multiplayer networking;
- exact fire propagation;
- computer vision scoring of what the user looked at;
- a database;
- claims that the drill improves safety outcomes.

## Post-hackathon path

1. Pair the generated visual layer with expert-authored objectives and scoring rubrics.
2. Use real floor plans only through a geometry-preserving simulation layer; do not assume a reference image preserves the site.
3. Add an instructor console, replay, and objective performance measures such as action order and decision time. A disaster-training review specifically recommends measurable accuracy, time, and action order: [systematic review](https://pubmed.ncbi.nlm.nih.gov/36566227/).
4. Validate each training module with safety professionals and compare it with tabletop/live drills.
5. Evolve toward a hybrid architecture: deterministic spatial state and rules underneath, world-model rendering and open-ended variation on top.

## Demo script for judges

> “Real disaster scenes are dangerous, rare, and expensive to stage repeatedly. ZERO-DAY RESCUE lets me teleoperate a robot through a new incident every session. Here an aftershock blocks my return path. I scan, choose the side route, and the world continues from that decision. This is not a structural predictor or robot certifier—it is an infinite operator-rehearsal and scenario-authoring layer. The model is not generating a clip after the fact; it is the environment I am acting inside right now.”

Then perform exactly one event injection, one navigation decision, and show the debrief. The live cause-and-effect moment is the proof for all five judging criteria.
