# World-model physical simulation research package

**Research date:** 2026-08-16  
**Hackathon constraint:** two-hour build using Reactor credits/SDK  
**Judging criteria:** World-Model Native, Real Time, User Experience, Technical Execution, Potential & Impact

## Final recommendation

Build **ZERO-DAY RESCUE**.

The user teleoperates a small rescue robot through an AI-generated disaster site using WASD and look controls. The first mission, **Aftershock**, lasts 90 seconds: locate two survivors, scan hazards, manage battery/time, and retreat while a second collapse changes the environment. The React app owns mission state and scoring; LingBot World 2 owns the live visual world.

This is the best combination of:

- a strong reason to simulate—real sites are dangerous, rare, destructive, and expensive to stage;
- a world-model-native loop—move, observe, decide, inject event, observe the changed world;
- a clear live demo—one mission, three actions, one escalation, one debrief;
- honest claims—the prototype rehearses operator decisions and generates scenarios; it does not certify a robot, predict a collapse, or simulate validated physics.

Use **LingBot World 2** by default because ZERO-DAY RESCUE specifically needs navigation and arbitrary live hazard prompts in the same session. A/B test **Happy Oyster Adventure** before the event: it is the stronger semantic/persistent world system, with prompt-only creation, action verbs, and reopenable worlds, but free-text direction/rewind live in a separate non-WASD mode. If `Scan`, `Assist`, `Retreat`, and an aftershock action are reliable, Happy Oyster may be the stronger judge demo.

**LTX does not change the core choice.** Its current Reactor endpoint is a real-time talking portrait with synchronized generated voice, not a navigable world. It is optional for a mission commander brief/debrief after the core loop works. X2 and SANA-Streaming remain video editors; Helios is a continuous/branchable video generator; LongLive 2 is a live storyboard system.

## Why a world model is needed

A physical world model is justified when a user or agent must take actions inside many plausible futures, but collecting those experiences in reality is dangerous, slow, expensive, rare, inaccessible, or operationally disruptive.

The important boundary is:

> **Validated simulator/rules engine for what must be true + generative world model for what must feel varied and responsive + explicit measurements for what must be scored.**

The Reactor endpoints in scope output video pixels, not geometry, depth, object state, collisions, forces, measurements, physiology, or uncertainty. They are excellent interactive visual scenario generators. They are not stand-alone medical, structural, botanical, driving, robotics, or safety simulators.

## Package contents

| File | Use it for |
|---|---|
| [00-world-model-decision-framework.md](./00-world-model-decision-framework.md) | Decide where generative physical-world simulation is justified, where conventional simulation wins, and which claims are safe |
| [01-reactor-model-capabilities.md](./01-reactor-model-capabilities.md) | Exact current Reactor inputs, outputs, controls, timing, cost, API flow, model choice, and hosted-vs-upstream limitations |
| [02-physical-simulation-use-cases.md](./02-physical-simulation-use-cases.md) | Deep domain research across robotics, autonomy, industry, construction, disaster response, medicine, agriculture, climate, space, ocean, and high-risk training |
| [03-hackathon-idea-evaluation.md](./03-hackathon-idea-evaluation.md) | Scores for all six personal ideas and all 50 event-board ideas, plus eight finalists using the judging criteria |
| [04-recommended-concept-zero-day-rescue.md](./04-recommended-concept-zero-day-rescue.md) | Product brief, judge score, interaction loop, UI, prompts, MVP boundary, post-hackathon path, and demo script |
| [05-zero-day-rescue-two-hour-build-plan.md](./05-zero-day-rescue-two-hour-build-plan.md) | Technical architecture, state model, minute-by-minute implementation plan, acceptance tests, reliability checks, and fallbacks |

## Ranked shortlist

The scoring file explains the assumptions and full rubric. The strongest concepts are:

1. **ZERO-DAY RESCUE / Aftershock** — disaster-site robot-operator rehearsal.
2. **Rover Zero** — planetary rover route rehearsal under dust, battery, and communication constraints.
3. **BuildBefore** — walk an expensive proposed space under night, crowd, rain, and emergency conditions; use only for stakeholder pre-mortem discussion.
4. **The Building Fights Back** — an adaptive heist/escape room; safest and most entertaining fallback, but lower serious-world impact.
5. **Audience Reactor** — responsive public-speaking rehearsal; strong user value but less physical-world-model native.
6. **Garden Futures** — compare slow plant-care scenarios, only if a separate transparent growth model supplies outcomes and Reactor renders them.

## Assessment of the personal ideas

| Idea | Verdict |
|---|---|
| Webcam vein finder | **Do not build.** A generative overlay can hallucinate clinically plausible veins and cause harm. |
| Potted-plant regimen/time-lapse | Good slow-feedback problem, but the video model cannot predict growth. Keep only as a visualizer over a real plant model. |
| Future-weather trip planning | Useful as experiential rehearsal, not navigation or forecasting. Map/weather APIs and site fidelity add too much two-hour risk. |
| 3D-print design | Valuable expensive-iteration problem, but requires CAD/STL, slicing, tolerances, material, and stress analysis; Reactor can only previsualize appearance. |
| Drug-trip camera | Technically easy with X2/SANA, but it is a filter rather than a world-model simulation and has weak impact/claim positioning. |
| Escape room | Strong, fun, world-model-native finalist when combined with deterministic puzzle state; best fallback if live scenario coherence is unreliable. |

## One-minute judge explanation

> “A world model matters when the real learning loop is dangerous, slow, expensive, or impossible. Rescue robots are a perfect example, but real disaster sites are rare and cannot be reset. ZERO-DAY RESCUE gives an operator a new live incident every session. The user drives the robot with WASD, chooses Scan, Assist, or Retreat, and the generated world changes immediately. Our app—not the video model—owns battery, mission state, timing, and score. This is operator rehearsal and scenario generation, not a certified physics simulator. Without a world model we would have to author every site and every event branch; here the environment is generated as the operator acts.”

## Pre-build go/no-go

Before the two-hour clock begins, verify all of the following:

- Reactor account can start `lingbot-world-2`;
- Reactor account can build/reopen a Happy Oyster Adventure world, and its advertised/custom action verbs have been tested;
- API key and short-lived browser token flow work;
- a known-good seed image starts a stream;
- WASD/look commands visibly work in the event network/browser;
- live prompt swapping changes the next chunks without reset;
- credits are sufficient;
- one fallback model and a recorded fallback demo are ready.
- LTX is excluded from the critical path; if used, one warm avatar take and its audio/video playback are already proven.

If continuous navigable generation is unreliable, use **The Building Fights Back** with a shorter deterministic loop or **Garden Futures** with discrete visual stages. Do not retain robot-training or physical-accuracy claims after switching to a non-navigable editor/generator.
