# Zero-Day Rescue — 90-second demo

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
| 0:08–0:18 | Briefing; enable audio; start mission | “The robot receives three persistent landmarks, a stranded survivor, and a ninety-second objective.” |
| 0:18–0:32 | World appears; walk forward and look toward the red door | Let the survivor radio cue play. Then: “This is generated live—not prerecorded footage.” |
| 0:32–0:43 | Click **Thermal scan**, then **Deploy beacon** | “Field tools rewrite the active world at chunk boundaries: locate the survivor, then mark a rescue route.” |
| 0:43–0:53 | Click **Add obstacle** | “We can inject a new obstruction to stress-test route planning while the same world and landmarks persist.” |
| 0:53–1:05 | Click **Trigger now**; wait for two chunks | Let the hazard radio cue play. Then: “An aftershock changes the route, forcing the operator to reassess.” |
| 1:05–1:14 | Click **Clear obstacle**, then choose **Assist** | “The operator clears the temporary obstacle and commits to an auditable response.” |
| 1:14–1:25 | Finish mission; show the after-action timeline | “Every incident, tool, choice, and response time becomes an after-action record.” |
| 1:25–1:30 | Hold on score/timeline | “Zero-Day Rescue: rehearse the impossible before it becomes real.” |

## Recording notes

- LingBot World 2 supplies video only. The app labels and generates ambience/radio speech locally in the browser; it does not claim model-native or synchronized audio.
- Tool changes are generative prompt updates, not deterministic physics. “NEXT CHUNK” changes to “APPLIED” only after Reactor acknowledges the prompt.
- Keep each movement or look input held long enough to cross a generation chunk boundary.
- If the data channel drops and Reactor marks it recoverable, click **Retry transport (3 attempts)**. Otherwise return to the library and start a fresh mission.
