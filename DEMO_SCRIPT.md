# Zero-Day Rescue — 90-second video of a 3-minute mission

## Before recording

1. Run `pnpm dev` and open `http://localhost:3000` in Vivaldi.
2. Select **Aftershock** and click **Enable mission audio**.
3. Start Windows Game Bar recording with `Win+Alt+R` (or use OBS if already configured).
4. Keep the browser near 16:9 and the app at 100% zoom.

The generated world is a live, billable Reactor session. If Reactor returns 429 capacity, wait 20–30 seconds and retry before recording.

## Recording timeline

| Time | On screen | Narration |
| --- | --- | --- |
| 0:00–0:08 | Scenario library; choose **Aftershock** | “Zero-Day Rescue turns a disaster brief into a live, navigable response rehearsal.” |
| 0:08–0:18 | Briefing; enable audio; start mission | “The robot receives three persistent landmarks, a stranded survivor, and a three-minute objective.” |
| 0:18–0:32 | World appears; walk forward and look toward the red door | Let the survivor radio cue play. Then: “This is generated live—not prerecorded footage.” |
| 0:32–0:43 | Click **Structural LiDAR**, then **Deploy shoring**; point out the telemetry overlay | “Robot interventions are deterministic robot state, so they update instantly without corrupting the visual world.” |
| 0:43–0:56 | Under **Scenario Director**, click **Ceiling collapse** | “The Director injects a plausible failure from existing ceiling damage—the robot never magically creates an obstacle.” |
| 0:56–1:08 | Wait at least six seconds (four or more active chunks) and one settled chunk; click **Dust suppression** | Let the queued survivor cue play. Then: “The event gets time to render, settles into a persistent route change, and the robot restores visibility.” |
| 1:08–1:17 | Choose **Shore and approach** | “Response choices are unique to the incident and produce an auditable consequence.” |
| 1:14–1:25 | Finish mission; show the after-action timeline | “Every incident, tool, choice, and response time becomes an after-action record.” |
| 1:25–1:30 | Hold on score/timeline | “Zero-Day Rescue: rehearse the impossible before it becomes real.” |

## Recording notes

- LingBot World 2 supplies video only. The app labels and generates ambience/radio speech locally in the browser; it does not claim model-native or synchronized audio.
- Robot interventions and response choices are deterministic app state shown in the HUD; only Scenario Director events alter the generated video.
- Settled radio narration waits until Reactor accepts the settled prompt and completes a rendered chunk, so audio does not outrun the scene.
- Keep each movement or look input held long enough to cross a generation chunk boundary.
- If the data channel drops and Reactor marks it recoverable, click **Retry transport (3 attempts)**. Otherwise return to the library and start a fresh mission.
