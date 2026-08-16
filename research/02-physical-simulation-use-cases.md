# Where a physical world-model simulation is actually justified

_Research brief for the Reactor world-model hackathon — 2026-08-16_

## Executive conclusion

A physical simulation is worth building when it changes a consequential decision **and** reality is a bad place to run the learning loop. The recurring reasons are:

1. **Expensive:** each physical trial consumes equipment, materials, labor, facility time, or a one-shot asset.
2. **Slow:** the outcome takes weeks, seasons, years, or an entire asset lifecycle to observe.
3. **Dangerous:** an error can injure a person, damage equipment, or worsen an emergency.
4. **Rare or inaccessible:** the important event is too uncommon, remote, regulated, or impossible to reproduce on demand.
5. **Combinatorial:** the system must be tested over many layouts, weather conditions, failures, people, and sensor states.

The most important finding for this hackathon is that **an interactive generative video model and a validated physical simulator are not the same product**. Current interactive world models are well suited to real-time scene creation, controllable perspective, visual counterfactuals, procedural rehearsal, and human decision training. They should not, on their own, be treated as a trustworthy predictor of forces, trajectories, physiology, crop yield, fire spread, or safety outcomes. Research benchmarks were created precisely because attractive generated video does not guarantee physics adherence ([PhyGenBench, ICML 2025](https://proceedings.mlr.press/v267/meng25c.html); [WorldModelBench, NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/4ec03ed08a3fcb59e1c815b5598beff1-Abstract-Datasets_and_Benchmarks_Track.html)). Even Google describes limitations in physical-property modeling, real-location accuracy, interaction length, and multi-agent behavior for Genie 3 ([DeepMind](https://deepmind.google/models/genie/)).

Therefore the best near-term architecture is usually:

> **Validated state/physics engine for what must be true + generative world model for what must feel varied and real + explicit measurements for what must be scored.**

### Best two-hour hackathon direction

**ZERO-DAY RESCUE — an endlessly variable disaster-site robot-operator rehearsal.** The player teleoperates a ground robot with WASD/arrow keys through a dynamically generated mine collapse, warehouse fire, earthquake ruin, or flooded structure; finds victims and hazards; manages battery/time; and receives an after-action report. The world model is essential because it creates a new, coherent, explorable incident and changes it in response to operator choices. A small deterministic state machine owns scoring, mission objectives, resource depletion, and event timing.

This is the strongest balance of the judging criteria:

| Criterion | Why it scores |
|---|---|
| **World-Model Native** | The product's core value is an effectively unbounded curriculum of unfamiliar, changing physical spaces, not a generated background or one-off clip. |
| **Real Time** | WASD/arrow navigation, look controls, and promptable events make the user-model feedback loop immediately visible. |
| **UX** | A familiar first-person/robot-camera view, three mission counters, and a final replay/score require almost no explanation. |
| **Technical Execution** | It demonstrates streaming generation, action handling, persistent state, event injection, scoring, and a clean separation between generated pixels and authoritative game state. |
| **Potential & Impact** | Emergency robots exist to reduce operator risk. NIST has more than 50 response-robot test methods and reports their use for procurement and operator training ([NIST ground robot tests](https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots/ground-robot-tests)). NIOSH already uses editable, collaborative VR scenarios for mine-rescue procedural and problem-solving training ([NIOSH VR-MRT](https://www.cdc.gov/niosh/mining/tools/vr-mrt.html)). |

The honest product claim is **scenario rehearsal and operator decision practice**, not robot certification, fire prediction, or autonomous-policy training.

---

## 1. The decision test: when is a world simulation necessary?

A simulation is not justified merely because an experience would look impressive. It should pass all four questions below.

### 1.1 Does it replace a genuinely bad real-world loop?

At least one must be material:

- A trial destroys or risks a valuable object.
- Feedback arrives too late to iterate.
- A novice cannot ethically learn on the real system.
- Relevant failures are rare but severe.
- The environment is inaccessible: Mars, deep ocean, active fire, radiation, collapsed building.
- Physical testing cannot cover the required combinations.

### 1.2 Is there a decision or skill to improve?

The output should affect a choice such as route, layout, operating procedure, resource allocation, control policy, treatment plan, or purchase. If the only output is “this looks like what might happen,” it is visualization, not decision simulation.

### 1.3 Can the relevant state and outcome be measured?

Examples include collision count, victim coverage, evacuation time, robot cycle time, thermal exposure, surgical errors, water use, yield interval, or energy consumption. A model that generates only pixels is hard to validate and hard to score.

### 1.4 Can fidelity be matched to the claim?

Fidelity is purpose-specific. Photorealism is often less important than the right causal behavior.

| Claim level | What the simulation may be used for | Minimum evidence | Role for a generative video world model |
|---|---|---|---|
| **Experience / concept** | Engagement, storytelling, empathy, design conversation | User test and content review | Can be the main engine |
| **Procedural rehearsal** | Search patterns, communication, prioritization, familiarity | Subject-matter review, repeatable tasks, transfer study | Can drive environment and interaction; explicit state should score actions |
| **Operational planning** | Compare routes, layouts, staffing, or response plans | Calibration to site data; uncertainty and sensitivity analysis | Visual/interface layer over an authoritative model |
| **Control or policy training** | Robot/vehicle controller development | Dynamics, contacts, sensors, latency, domain randomization, sim-to-real tests | Useful for appearance/sensor diversity, not as sole transition model |
| **Safety, clinical, or regulatory evidence** | Certify performance or support a high-stakes decision | Formal verification, validation, uncertainty quantification, traceability | Never the sole source of truth |

The validation burden is not theoretical. NIST's advanced-manufacturing work emphasizes verification, validation, and uncertainty quantification for trustworthy digital twins ([NIST](https://www.nist.gov/programs-projects/digital-twins-advanced-manufacturing)). The FDA applies a risk-informed credibility framework to computational models used in medical-device submissions ([FDA 2023 guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/assessing-credibility-computational-modeling-and-simulation-medical-device-submissions)). The FAA continuously qualifies flight simulation training devices under 14 CFR Part 60 rather than accepting realism by inspection ([FAA National Simulator Program](https://www.faa.gov/about/initiatives/nsp)).

---

## 2. Domain research: where physical simulation has real economic or safety value

## 2.1 Robotics and autonomy

### A. Autonomous-driving rare-event testing

**Why simulate:** Real road miles are expensive and expose the public to risk; severe edge cases are rare; weather, lighting, sensor, traffic, and actor behaviors create a huge test space. CARLA was built for development, training, and validation with configurable sensors and environmental conditions ([CARLA paper](https://arxiv.org/abs/1711.03938)). NHTSA's automated-driving research explicitly combines modeling/simulation, track testing, and open-road testing rather than relying on one method ([NHTSA reports](https://www.nhtsa.gov/automated-vehicles-safety/published-reports-and-documents)).

- **Buyer/user:** AV safety teams, simulation engineers, regulators, autonomy researchers.
- **Required fidelity:** Road geometry; vehicle dynamics; camera/lidar/radar models; traffic-agent behavior; occlusion; weather and illumination; deterministic replay; scenario coverage.
- **Validation burden:** Very high. Compare sensor and closed-loop behavior against track and road data, quantify scenario coverage, and show that generated agents do not create impossible behavior.
- **Hackathon wedge:** A **rare-event scenario director** in which the user drives through a prompt-generated road while an evaluator injects “child occluded by van,” black ice, glare, or emergency vehicle events. Score human hazard recognition and response, not vehicle safety.
- **Generative model role:** Strong for interactive appearance and scenario ideation; unsafe as the only vehicle/actor physics engine.

### B. Drone navigation and inspection before flight

**Why simulate:** Crashes cost hardware and can injure people; flight time, site access, airspace, weather, and battery constrain trials. AirSim research explicitly targets faster prototyping with less time, cost, and field-robotics risk ([AirSim Drone Racing Lab](https://proceedings.mlr.press/v123/madaan20a.html)).

- **Buyer/user:** Drone manufacturers, utilities, infrastructure inspectors, public-safety teams, robotics labs.
- **Required fidelity:** Six-degree-of-freedom dynamics, rotor response, wind, collision/contact, camera/IMU/GPS noise, rolling shutter, latency, battery, and the geometry of narrow spaces.
- **Validation burden:** High for autonomy; medium for operator rehearsal. Hardware-in-the-loop and real-flight transfer tests are required.
- **Hackathon wedge:** Pilot a camera drone through an unfamiliar post-disaster building, identify gas leaks/people/blocked routes, and cope with prompt-injected dust, darkness, or debris.
- **Generative model role:** Excellent for varied visual sites and human teleoperation practice; pair with a conventional flight simulator for policy learning.

### C. Warehouse AMRs and robot workcells

**Why simulate:** Production downtime is expensive, physical cells may not exist yet, and unsafe paths threaten workers and equipment. NIST identifies design, testing, commissioning, and operational reconfiguration as lifecycle uses of manufacturing robot digital twins ([NIST robot systems](https://www.nist.gov/publications/digital-twins-robot-systems-manufacturing)). A NIST workcell demonstration combines collaborative arms, a CNC tool, and a coordinate-measuring machine, while stressing standards and physical-model synchronization ([NIST robot workcell](https://www.nist.gov/publications/towards-digital-twin-robot-workcell-standards-and-methods)).

- **Buyer/user:** Plant automation teams, systems integrators, industrial engineers, robot vendors.
- **Required fidelity:** CAD-accurate geometry, joint limits, kinematics/dynamics, contact, safety zones, PLC/ROS timing, conveyors, human motion, and cycle-time distributions.
- **Validation burden:** High. Calibrate against robot logs and cycle times; collision and safety claims require conventional engineering verification.
- **Hackathon wedge:** Prompt-generate clutter and unexpected workers around a pick-and-place cell, then let an operator choose stop/reroute/continue and compare throughput versus risk.
- **Generative model role:** Scenario variation and supervisor training; not authoritative collision checking.

### D. Household-robot generalization

**Why simulate:** Every home has different furniture, lighting, people, pets, and clutter. A robot cannot safely learn grasping, navigation, or failure recovery by repeatedly breaking household objects.

- **Buyer/user:** Home-robot companies, embodied-AI researchers, assistive-technology teams.
- **Required fidelity:** Object permanence, affordances, articulated objects, contact/friction, deformables, people/pets, camera/depth sensor response.
- **Validation burden:** High for physical policy transfer; representative home distributions and extensive real-robot testing are necessary.
- **Hackathon wedge:** A user teaches a virtual home robot how to deliver medication or clear a blocked path across endlessly rearranged homes; score instruction clarity and recovery choices rather than grasp physics.
- **Generative model role:** Very world-model-native visually, but current action/object consistency is the core risk.

**Domain verdict:** Robotics is the canonical need, but the hackathon should target **operator rehearsal, scenario generation, or supervision UX**. Claiming sim-to-real robot training from a generative video stream would create the largest credibility gap.

## 2.2 Industrial systems and construction

### A. Virtual commissioning and plant reconfiguration

**Why simulate:** A factory line or energy plant is a significant capital purchase. Rework after installation is costly, and commissioning faults create downtime or safety exposure. NIST says synchronized twins can diagnose, predict, and optimize manufacturing, but also identifies lack of trustworthy standards and VVUQ as a major barrier ([NIST digital twins](https://www.nist.gov/digital-twins)). The U.S. Department of Energy documents Ford's use of a digital twin for a central energy plant to monitor systems, manage operational risk, and improve decisions ([DOE Better Buildings case](https://betterbuildingssolutioncenter.energy.gov/implementation-models/ford-motor-company-dearborn-campus-uses-digital-twin-tool-energy-plant/printpdf)).

- **Buyer/user:** Plant owners, EPC firms, process engineers, automation integrators.
- **Required fidelity:** Equipment performance curves, control logic, thermal/fluid/electrical behavior, maintenance states, alarms, and time synchronization.
- **Validation burden:** High and continuous; calibrate against sensors and acceptance tests, track model drift, and quantify uncertainty.
- **Hackathon wedge:** “First Shift” — an operator walks a not-yet-built plant and responds to alarm sequences while the environment changes with valve/pump choices. State and scoring come from a simple process graph.
- **Generative model role:** Compelling immersive operator interface and layout exploration, with a conventional process model underneath.

### B. Construction-robot path and sequence rehearsal

**Why simulate:** Construction sites change daily, contain people and heavy equipment, and rarely match design perfectly. Research on BIM-driven construction twins uses site scanning, interactive twins, and work-plan adjustment to resolve as-designed/as-built deviation ([peer-reviewed framework](https://www.sciencedirect.com/science/article/pii/S016636152400040X)).

- **Buyer/user:** General contractors, construction-robot vendors, BIM/VDC teams, safety managers.
- **Required fidelity:** Current site geometry, robot reach/load, collision, temporary structures, moving workers/equipment, schedule dependencies.
- **Validation burden:** High for robot motion; frequent LiDAR/RGB-D rescan and supervised field trials.
- **Hackathon wedge:** Drive a construction inspection robot through an evolving site, photograph discrepancies, and let the world rebuild from “day 12” to “day 40.”
- **Generative model role:** Excellent for temporal/layout variation and stakeholder walkthrough; poor substitute for CAD/BIM collision geometry.

### C. Hazardous maintenance and remote inspection

**Why simulate:** Nuclear, chemical, mining, offshore, and high-voltage sites can expose workers to radiation, toxic gas, fire, confined spaces, or explosive atmospheres. Access is costly and infrequent, so teams benefit from rehearsal on a site twin.

- **Buyer/user:** Asset owners, maintenance contractors, safety/training organizations, inspection-robot companies.
- **Required fidelity:** Site geometry and access constraints; tool interactions; PPE/procedure steps; hazard fields; communications; sometimes radiation, gas, or fluid transport.
- **Validation burden:** Medium for procedural training; very high if exposure or failure probability is predicted.
- **Hackathon wedge:** A remote-inspection mission in which the player must choose a route, instrument, and retreat threshold as visibility and alarms evolve.
- **Generative model role:** Strong for procedure rehearsal and scenario diversity. Keep dose/gas/time calculations deterministic and conspicuous.

### D. Additive-manufacturing and 3D-print design validation

**Why simulate:** Large or metal prints are expensive and slow; failure can emerge after hours of printing or during later loading. But the valuable simulator is normally a slicer plus thermal, residual-stress, material, and structural analysis—not an interactive video world.

- **Buyer/user:** Product engineers, service bureaus, aerospace/medical manufacturers.
- **Required fidelity:** Toolpath, machine kinematics, heat transfer, material phase/change or curing, shrinkage/warpage, supports, and structural loads.
- **Validation burden:** High; compare with coupons, in-process sensing, dimensional inspection, and destructive tests.
- **Hackathon wedge:** A generated first-person “inside the print” visualization that highlights a deterministic slicer's predicted hot spots/support failures and lets the user compare orientations.
- **Generative model role:** Explanation and design-review UX only. It should never invent the engineering result.

**Domain verdict:** Industrial simulation has strong willingness to pay, but a two-hour demo needs a narrow procedural or supervisory workflow. A full digital twin is neither feasible nor credible on the hackathon timeline.

## 2.3 Disaster response and public safety

### A. Response-robot operator rehearsal

**Why simulate:** Collapsed structures, bombs, fire, and hazardous materials are exactly where a robot should extend human reach. NIST defines response robots as remotely deployed systems that improve effectiveness while reducing operator risk and maintains repeatable test methods for terrain, sensing, manipulation, endurance, communications, and operator proficiency ([NIST](https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots/ground-robot-tests)).

- **Buyer/user:** Fire/rescue agencies, bomb squads, military EOD, robot vendors, training centers.
- **Required fidelity:** Terrain and mobility constraints, camera field of view, communications loss, battery, payload/tools, victim/hazard cues, and task metrics.
- **Validation burden:** Medium for cognitive rehearsal; high for capability or procurement claims. Anchor tasks to NIST/ASTM test methods and compare operator transfer on physical courses.
- **Hackathon wedge:** **ZERO-DAY RESCUE**, detailed in Section 4.
- **Generative model role:** Excellent. Unfamiliar spaces prevent memorization and make real-time exploration the core experience.

### B. Fire/smoke tactics and evacuation

**Why simulate:** Live burns are hazardous and expensive; rare layouts and ventilation choices matter. NIST's Fire Dynamics Simulator (FDS) explicitly simulates fire impact on buildings and ships with verification and validation guides ([FDS manuals](https://pages.nist.gov/fds/manuals.html)). NIST has compared ventilation experiments with FDS and reports prediction error bands that depend on correct geometry and boundaries ([NIST PPV research](https://www.nist.gov/el/fire-research-division-73300/firegov-fire-service/positive-pressure-ventilation)).

- **Buyer/user:** Fire departments, fire-protection engineers, building owners, emergency planners.
- **Required fidelity:** Geometry/materials, heat release, ventilation, smoke/toxic products, visibility, suppression, occupant movement, and stochastic evacuation behavior.
- **Validation burden:** Very high for tactical or code decisions. Fire appearance cannot substitute for heat/smoke transport.
- **Hackathon wedge:** A firefighter size-up trainer: walk around a generated structure, observe cues, choose entry/ventilation, then see a **clearly illustrative** world-model response while a rules engine scores procedure.
- **Generative model role:** High for immersive cue recognition; FDS or validated data would be needed for predictive claims.

### C. Multi-hazard planning and resource allocation

**Why simulate:** Communities cannot stage real earthquakes, floods, tsunamis, or hurricanes. FEMA's Hazus estimates damage and loss, supports mitigation planning, and explicitly documents uncertainty and scenario methodology ([FEMA Hazus documentation](https://www.fema.gov/tl/node/702362)).

- **Buyer/user:** Emergency-management agencies, cities, utilities, hospitals, insurers.
- **Required fidelity:** Hazard maps, asset inventories, fragility/damage functions, population, transport, critical facilities, uncertainty.
- **Validation burden:** High; use authoritative hazard and inventory data and communicate ranges. FEMA warns that baseline inputs have substantial uncertainty.
- **Hackathon wedge:** Enter a neighborhood type and hazard, explore an illustrative aftermath, then allocate three response teams and see outcomes from a transparent rules/data layer.
- **Generative model role:** Public communication and tabletop exercise immersion, not loss estimation.

### D. Wildfire evacuation decision practice

**Why simulate:** Wildfire spread is fast, uncertain, and unsafe to reproduce. NIST's ESCAPE program uses scenarios and real-world research for community and responder preparedness while explicitly warning users to follow local official information ([NIST ESCAPE](https://escape.nist.gov/)). USGS evaluation of FSim burn-probability maps demonstrates that even established wildfire models must be checked against observed fires ([USGS](https://pubs.usgs.gov/publication/70261922)).

- **Buyer/user:** Emergency managers, fire services, community planners, public educators.
- **Required fidelity:** Topography, fuels, weather, ignition/spread, road capacity, warning and human behavior.
- **Validation burden:** Very high for prediction; medium for tabletop decision training.
- **Hackathon wedge:** A no-notice evacuation where the player sees smoke/road cues, chooses when and where to leave, and receives a debrief based on established preparedness rules.
- **Generative model role:** Strong for urgency, diverse visuals, and promptable road conditions; never present generated fire spread as a forecast.

**Domain verdict:** Disaster response offers the best hackathon fit because the **need for variety and embodied rehearsal is real**, WASD control is natural, and the demo can be valuable without pretending to be an operational forecast.

## 2.4 Medicine and health

### A. Surgical skill training and rare-procedure rehearsal

**Why simulate:** Novices should not acquire first attempts on patients; operating-room time is scarce; some procedures have low case volume. Evidence is strongest for skill and operative-performance improvement, while evidence for patient outcomes is more limited. A meta-analysis of randomized trials found better performance and shorter operative time but scant direct patient-outcome evidence ([PubMed](https://pubmed.ncbi.nlm.nih.gov/32399730/)). A multicenter cataract-surgery trial found substantially higher competence and lower posterior-capsule rupture rates after simulation-based training ([trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC7645744/)).

- **Buyer/user:** Teaching hospitals, medical schools, surgical societies, device companies.
- **Required fidelity:** Anatomy and variation, tissue/tool interaction, force/haptics, bleeding/complications, procedure workflow, expert scoring.
- **Validation burden:** Very high. Establish construct validity, expert review, learning and transfer, and patient safety; do not equate visual realism with tissue mechanics.
- **Hackathon wedge:** A **cognitive rehearsal** for a rare emergency procedure: select steps/instruments while navigating anatomy, with explicit “educational prototype, not medical guidance” labeling.
- **Generative model role:** Anatomy variation and immersive explanation; not tissue simulation or clinical decision support.

### B. Patient-specific pre-operative planning

**Why simulate:** Surgeons may need to understand complex three-dimensional anatomy and compare access paths before an irreversible procedure. FDA lists surgery planning and intraoperative procedures among AR/VR medical-device uses, while warning about errors in anatomy location/depth, low contrast, overload, distraction, and other risks ([FDA AR/VR](https://www.fda.gov/medical-devices/digital-health-center-excellence/augmented-reality-and-virtual-reality-medical-devices)).

- **Buyer/user:** Hospitals, surgeons, imaging and medical-device companies.
- **Required fidelity:** Patient segmentation, geometry, registration, biomechanics if tissue moves, device interaction, and clinically meaningful measurements.
- **Validation burden:** Extremely high and patient-specific; requires image/measurement ground truth and regulatory-quality software processes.
- **Hackathon wedge:** An educational “anatomy route explainer” using synthetic anatomy, not a real patient and not a treatment recommendation.
- **Generative model role:** Communication/rendering. Generated anatomy must never silently alter the measured structures.

### C. Medical-device design and simulated use

**Why simulate:** Device prototypes and clinical trials are costly; some failure modes are hard to observe. FDA notes that computational fluid dynamics and finite-element analysis can identify designs that retain debris, while explicitly stating simulation cannot replace cleaning-validation laboratory tests ([FDA reprocessing research](https://www.fda.gov/medical-devices/reprocessing-reusable-medical-devices-information-manufacturers/computational-modeling-proposed-simulation-tool-designing-reusable-medical-devices-reprocessing)). FDA human-factors guidance also allows simulated-use testing for difficult or infrequent use scenarios ([FDA guidance PDF](https://www.fda.gov/files/medical%20devices/published/Applying-Human-Factors-and-Usability-Engineering-to-Medical-Devices---Guidance-for-Industry-and-Food-and-Drug-Administration-Staff.pdf)).

- **Buyer/user:** Medical-device manufacturers, human-factors teams, regulators, clinical educators.
- **Required fidelity:** Depends on claim: physics/biological conditions for performance; realistic users, tasks, environments, and failure cues for usability.
- **Validation burden:** Risk-informed, documented, and high.
- **Hackathon wedge:** A device-use error trainer that prompt-generates home, ambulance, and hospital contexts while a fixed task model tracks omitted/incorrect steps.
- **Generative model role:** Very useful for context-of-use variation, not device efficacy.

### D. Vein visualization from a webcam

This is **not primarily a world-model simulation**. It is perception plus medical AR: infer or image vasculature and register an overlay to a moving arm. A normal RGB webcam cannot reliably reveal subcutaneous vein geometry. A plausible system would need near-infrared imaging or ultrasound, calibration, tracking, clinical validation, failure handling, and regulatory analysis. FDA specifically identifies anatomy-location and depth-display errors as AR/VR risks ([FDA](https://www.fda.gov/medical-devices/digital-health-center-excellence/augmented-reality-and-virtual-reality-medical-devices)).

- **Hackathon-safe reframing:** A clearly fictional “anatomy education overlay” on a synthetic arm or printed phantom.
- **Verdict:** Do not choose this for a two-hour world-model hack unless the goal is artistic education, never vein access or medical guidance.

**Domain verdict:** The impact is enormous, but so is the validation burden. A hackathon entry should be explicitly educational or procedural and should avoid real-patient claims.

## 2.5 Agriculture and climate

### A. Crop, irrigation, and management what-if analysis

**Why simulate:** A bad farming decision may take an entire growing season to reveal itself. Trials depend on weather, soil, cultivar, irrigation, and management. USDA research links crop, surface-water, and groundwater models to compare historical and projected climate/management scenarios and outputs seasonal yield and irrigation use ([USDA ARS](https://www.ars.usda.gov/research/project/?accnNo=440443)). APSIM tutorials demonstrate 40-year strategy simulations rather than waiting through decades ([APSIM](https://docs.apsim.info/docs/user-tutorials/module5/modulefivetutorial)).

- **Buyer/user:** Growers, agronomists, irrigation districts, seed/input firms, agricultural lenders and researchers.
- **Required fidelity:** Local weather distribution, soil water/nutrients, cultivar, phenology, pests/disease where relevant, management actions, and uncertainty.
- **Validation burden:** High and site/crop specific. Calibrate on multiple seasons and communicate ranges; AgMIP emphasizes cascading uncertainty from climate through crop and economic models ([AgMIP](https://agmip.org/uncertainty/)).
- **Hackathon wedge:** **Garden Futures** — enter plant, location, pot/window exposure, and watering plan; scrub across weeks and compare two world-model-rendered trajectories. The numeric growth band comes from a transparent simple model or established crop model, not generated pixels.
- **Generative model role:** Excellent for understandable time-lapse and counterfactual visualization; not trustworthy yield prediction by itself.

### B. Greenhouse control

**Why simulate:** Greenhouses continuously trade crop growth against water, energy, humidity, disease risk, and actuator wear. A commercial greenhouse twin can combine crop physiology, climate models, sensors, and control; field mistakes can waste an entire crop. Research has used simulation plus real greenhouse deployment to optimize tomato control ([iGrow paper](https://arxiv.org/abs/2107.05464)).

- **Buyer/user:** Greenhouse operators, controlled-environment agriculture companies, controls vendors.
- **Required fidelity:** Heat/mass transfer, solar radiation, humidity/CO2, crop growth/transpiration, actuators, energy prices, and sensor drift.
- **Validation burden:** High; validate climate fast dynamics and crop slow dynamics separately, then closed-loop performance on real crops.
- **Hackathon wedge:** A real-time greenhouse operator view where keys change shade, vents, and irrigation and a world model visualizes the projected plant state while explicit gauges and a simple state model show energy/water tradeoffs.
- **Generative model role:** Strong visual feedback for slow processes; gauges/state must remain authoritative.

### C. Flood, drought, and wildfire risk communication

**Why simulate:** Climate hazards are slow to characterize but can be catastrophic; communities must compare infrastructure and evacuation choices before events occur. FEMA's Hazus and USGS's wildfire-model evaluation illustrate both the value and the uncertainty of model-based planning ([FEMA](https://www.fema.gov/tl/node/702362); [USGS](https://pubs.usgs.gov/publication/70261922)).

- **Buyer/user:** Cities, utilities, emergency managers, property owners, educators.
- **Required fidelity:** Hazard-specific numerical model, local terrain/assets, probabilities and confidence intervals.
- **Validation burden:** Very high if property-specific or operational; lower for education if clearly labeled.
- **Hackathon wedge:** Let a user walk a familiar type of street before/after a counterfactual mitigation—trees, drainage, defensible space—and connect the visuals to authoritative scenario data.
- **Generative model role:** High-impact communication. It cannot replace flood/fire/climate modeling.

**Domain verdict:** The potted-plant idea is one of the user's few concepts that genuinely meets the “slow feedback” criterion. It becomes credible only as a hybrid: agronomic state model + weather/soil inputs + world-model time-lapse.

## 2.6 Space and ocean

### A. Planetary rover mobility and remote operations

**Why simulate:** Mars/Moon hardware is expensive, mission opportunities are rare, repair may be impossible, and terrain/lighting/latency cannot be completely reproduced on Earth. JPL's ROAMS work uses virtual testbeds to supplement hardware tests and explore regimes impossible in physical testbeds ([JPL ROAMS](https://robotics.jpl.nasa.gov/what-we-do/research-tasks/roams-rover-modeling-and-simulation/)). NASA reports training the ERNEST rover in a high-fidelity virtual environment, running thousands of test hours over a weekend, then testing on physical obstacle courses ([NASA](https://www.nasa.gov/solar-system/moon/nasa-testing-advanced-capabilities-for-moon-mars-rovers/)).

- **Buyer/user:** Space agencies, rover/lander contractors, autonomy and mission-operations teams.
- **Required fidelity:** Wheel-regolith interaction, slope/slip, lighting/shadows, thermal/power, sensors, communication latency, terrain, fault modes.
- **Validation burden:** Extremely high; soil bins, regolith simulants, field analogs, hardware-in-loop, and mission data anchor the model.
- **Hackathon wedge:** A delayed-command lunar rover game: drive with intentionally delayed controls, conserve battery, and survey prompt-generated terrain before the sun angle changes.
- **Generative model role:** Superb for varied remote-world visuals and mission-ops experience; conventional mechanics must own traction and energy.

### B. Autonomous underwater vehicles and subsea robots

**Why simulate:** Ships, crews, deployment, recovery, and lost vehicles make ocean trials expensive. Deep water is inaccessible and dangerous; visibility, currents, buoyancy, and sonar complicate perception. Stonefish combines a physics engine with rendering for marine-robotics research ([Stonefish documentation](https://stonefish.readthedocs.io/)); recent work cites the cost and logistics of real subsea trials as the motivation for simulation ([ICRA 2025 paper](https://arxiv.org/abs/2502.11887)).

- **Buyer/user:** Offshore-energy firms, navies, ocean-science institutes, AUV manufacturers, subsea inspection companies.
- **Required fidelity:** Hydrodynamic drag, buoyancy, thrusters, currents, collision, tether if ROV, acoustic/sonar/camera sensors, turbidity and lighting.
- **Validation burden:** High; tank tests, tow tests, sea trials, and sensor-noise calibration are essential.
- **Hackathon wedge:** Teleoperate a subsea inspection robot through an endlessly generated wreck/pipeline environment, tag defects, and manage signal/battery before a current event arrives.
- **Generative model role:** Excellent for visual exploration and task variation; inadequate for hydrodynamics or sonar truth.

**Domain verdict:** Space/ocean are highly justified and visually memorable. The downside is a weaker near-term buyer story for a general hackathon team and a large sim-to-real validation gap.

## 2.7 High-risk training and education

### A. Aviation abnormal and emergency procedures

**Why simulate:** Engine failures, instrument failures, severe weather, and crew-coordination breakdowns are unsafe or impractical to create in flight. FAA says flight simulation supports training, design, performance/handling assessment, and safety evaluation without live-flight risk; it integrates dynamics, propulsion, avionics, visual/motion systems, atmosphere, and air traffic control ([FAA technical discipline](https://www.faa.gov/aircraft/air_cert/step/disciplines/flight_simulation_systems)).

- **Buyer/user:** Airlines, flight schools, aircraft manufacturers, regulators.
- **Required fidelity:** Aircraft-specific dynamics and systems, controls, cockpit, visual/motion/audio cues, weather and ATC, instructor controls.
- **Validation burden:** Extremely high and regulated through initial/continuing qualification.
- **Hackathon wedge:** An ATC/crew decision trainer for a diversional landing where the visual world changes in real time but the procedural branching and scoring are deterministic.
- **Generative model role:** Dynamic visual/ATC context; not a qualified flight model.

### B. Mine rescue and underground escape

**Why simulate:** Underground fires, rock falls, trapped workers, ventilation changes, and poor visibility are dangerous and difficult to reproduce. NIOSH's VR-MRT lets instructors generate/import mines, place hazards, modify ventilation, record the exercise, and conduct after-action review ([NIOSH](https://www.cdc.gov/niosh/mining/tools/vr-mrt.html)). Its older MEET software has been used to train more than 1,000 miners in emergency escape decision-making ([NIOSH](https://www.cdc.gov/niosh/bulletin/2016/mine-escape-tech.html)).

- **Buyer/user:** Mines, mine-rescue organizations, regulators, safety-training providers.
- **Required fidelity:** Mine layout, visibility, gas/ventilation, equipment/tools, roles, communications, escape procedure.
- **Validation burden:** Medium/high; procedures and team behavior can be evaluated before all hazard physics are modeled, but gas/fire claims need validated models.
- **Hackathon wedge:** A multiplayer-lite mine-rescue captain experience with prompt-generated obstacles, role instructions, victim search, and an after-action path replay.
- **Generative model role:** This is a proven category for editable virtual scenarios and one of the strongest impact stories.

### C. Dangerous lab and maintenance procedures

**Why simulate:** Chemical spills, arc flash, confined space, lockout/tagout, and contamination incidents are dangerous to stage. The learning objective is often sequencing, hazard recognition, communication, and equipment selection rather than high-precision physical prediction.

- **Buyer/user:** Industrial safety teams, vocational schools, universities, equipment manufacturers.
- **Required fidelity:** Correct apparatus, labels, tools, procedural constraints, hazard cues, consequences, and assessment rubric.
- **Validation burden:** Medium for training; expert review and transfer tests matter more than photorealism. Any quantitative exposure claim raises the burden.
- **Hackathon wedge:** Generate a new lab/workshop each run, identify hazards under a timer, and show a structured debrief.
- **Generative model role:** Strong for scenario diversity, as long as safety-critical labels and rules are overlaid from deterministic state.

**Domain verdict:** Training is the safest commercial bridge from generative worlds to physical-world value because human procedure and decisions can be measured before the model is trusted as physics.

---

## 3. Ranking hackathon ideas against the judging criteria

Scores are 1–5 and evaluate a **two-hour prototype**, not the eventual market.

| Rank | Concept | World-Model Native | Real Time | UX | Technical Execution | Potential & Impact | Total /25 | Main caveat |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | **ZERO-DAY RESCUE: teleoperate a robot through a changing disaster site** | 5 | 5 | 5 | 4 | 5 | **24** | Must be framed as rehearsal, not certified robotics/fire simulation |
| 2 | **Subsea Last Mile: inspect a wreck/pipeline before signal or battery fails** | 5 | 5 | 5 | 4 | 4 | **23** | Hydrodynamics and sonar are only illustrative |
| 3 | **Lunar Delay: rover exploration with communications delay and power budget** | 5 | 5 | 4 | 4 | 4 | **22** | Strong spectacle, narrower practical buyer story |
| 4 | **Garden Futures: compare months of plant care in minutes** | 4 | 4 | 5 | 4 | 4 | **21** | Needs a separate growth model; visual changes are not agronomic evidence |
| 5 | **Rare-event road hazard rehearsal** | 4 | 5 | 5 | 3 | 4 | **21** | Crowded category and high risk of overclaiming AV validation |
| 6 | **Mine-rescue team/captain decision trainer** | 4 | 5 | 4 | 4 | 4 | **21** | More procedural UI and domain knowledge needed |
| 7 | **Plant operator abnormal-situation trainer** | 4 | 4 | 3 | 4 | 5 | **20** | Harder to communicate visually in a short demo |
| 8 | **Rare-procedure cognitive surgical rehearsal** | 4 | 4 | 4 | 3 | 5 | **20** | Medical safety, anatomy, and content-validation burden |
| 9 | **Construction robot/site-change walkthrough** | 4 | 4 | 4 | 3 | 4 | **19** | BIM/geometry integration is too large for two hours |
| 10 | **Adaptive escape room** | 5 | 5 | 5 | 4 | 2 | **21** | Great media demo, but does not meet the physical-simulation necessity test |

The escape room scores as an experience but ranks low for the research objective because no expensive, slow, dangerous, or inaccessible real-world loop is being replaced.

---

## 4. Recommended concept in detail: ZERO-DAY RESCUE

### One-line pitch

> Every disaster is different. Practice the next one before it exists: teleoperate a rescue robot through an AI-generated incident, react to changing hazards in real time, and learn from an after-action replay.

### Why the world model is necessary

A fixed Unity level could demonstrate teleoperation, but it would quickly become memorized. The value of a world model is an **unbounded curriculum of unfamiliar layouts and visual conditions**, with events injected while the player is already inside the environment. That makes generation part of the product logic, not decoration.

### Two-hour MVP scope

Use one incident type for reliability: **collapsed industrial building after an earthquake**.

1. **Mission setup (15 seconds):** “Find two survivors and one gas leak; return before battery reaches zero.”
2. **World creation:** Start from a carefully authored prompt/reference image that specifies first-person rescue-robot camera, traversable corridors, rubble, emergency lighting, smoke/dust, and no graphic injury.
3. **Control:** WASD/arrow keys move; mouse/keys look; space scans/tags.
4. **Authoritative state:** A tiny local state machine tracks 90 seconds, battery, three objectives, scan events, and collisions/unsafe choices. This is independent of generated pixels.
5. **One real-time event:** At 45 seconds inject “aftershock: corridor ahead partially collapses; dust increases; alternate route opens.”
6. **Debrief:** Display completion, time, battery, objectives found, and a chronological event log. If recording is available, use a short generated replay, but do not make it required.

### Model-role mapping from the current Reactor catalogue

These recommendations now reflect the current hosted API documentation; account access, world-build time, action reliability, and latency still need event-environment preflight.

- **LingBot World 2:** First choice for ZERO-DAY RESCUE because navigation and arbitrary live prompt changes coexist, allowing a timed aftershock while the operator keeps moving.
- **Happy Oyster:** Strongest alternative. Adventure mode adds prompt-only world creation, diagonal movement/look, semantic/world-advertised action verbs, and persistent reopenable worlds. Test whether custom `Scan`, `Assist`, `Retreat`, and `Aftershock` verbs respond reliably. Directing mode has instructions/rewind but cannot be assumed to retain WASD.
- **LingBot:** Fallback if it has simpler or more reliable real-time action control.
- **Helios:** Candidate for continuous responsive hazard/weather/visibility changes.
- **LongLive 2:** Optional after-action/replay or incident-introduction sequence, not required for the interaction loop.
- **X2 / SANA-Streaming:** Better fit for live-camera transformation; not central to the rescue-robot concept.
- **LTX:** Optional speaking mission commander or debrief avatar. Its hosted endpoint generates a portrait's lip-synced video and voice from a script, not an explorable world, and conditions cannot change within a take.

### Technical boundary diagram

```text
keyboard input ──> action adapter ──> Reactor interactive world model ──> live frames
      │                    │
      └────────────> deterministic mission state ──> HUD + score + event log
                                   │
                                   └── timed/action-triggered prompt event
```

Do not infer success from whether the generated frame “looks like” a victim was found. In the MVP, place objective triggers in the mission script or ask the player to tag at designated moments/regions. The visual world is the scenario; the state machine is the judge.

### Demo script for judges (60–90 seconds)

1. “Real disaster sites are rare, dangerous, and never identical. Response-robot operators need unfamiliar scenarios.”
2. Start a newly generated industrial collapse.
3. Move with WASD, scan a victim, show the objective update.
4. Trigger the aftershock; the route/visibility changes live.
5. Choose whether to continue toward a second victim or return with low battery.
6. Show the after-action report.
7. State the boundary: “This prototype rehearses search decisions; certified mobility and hazard prediction would be anchored to NIST test methods and validated physics.”

### Success measures

- Input-to-visible-response latency.
- World coherence across a 90-second mission.
- Whether users understand the mission without instruction.
- Objective and event-state correctness.
- Scenario diversity across three seeds/prompts.
- Whether the debrief accurately reflects user actions.

### What not to build in two hours

- Autonomous robot training.
- Physically accurate fire, smoke, collapse, radio, or battery models.
- Multiple incident types before one is reliable.
- Multiplayer networking.
- Computer vision that tries to infer all objectives from generated frames.
- Any certification, procurement, or life-safety claim.

### Credible path after the hackathon

1. Convert NIST response-robot task apparatuses and metrics into mission templates.
2. Add a conventional mobility/sensor simulator and use the world model for visual domain randomization.
3. Invite emergency responders to author and review scenarios.
4. Compare operator performance on virtual scenarios with repeatable physical test courses.
5. Add instructor controls, session recording, path replay, and team communication.

---

## 5. Assessment of the user's personal ideas

| Idea | Does it truly need physical simulation? | Best use of the provided world models | Verdict |
|---|---|---|---|
| **Webcam shows veins in an arm** | No. It is sensing, image registration, and medical AR; real vein localization needs specialized imaging and clinical validation. | Fictional/synthetic anatomy education only. | **Do not pursue as a medical hack.** |
| **Potted-plant growth under a watering/sun/weather regimen** | Yes: outcomes are slow and combinatorial. | Render time-lapse counterfactuals while a separate crop/growth model produces numeric state and uncertainty. | **Strong second choice; consumer-friendly and defensible if labeled illustrative.** |
| **Future trip in specific weather with street view and itinerary changes** | Usually no. It is map/weather data, routing, and experience visualization, not physical simulation. | Let a user walk an illustrative destination in rain/snow/heat. | **Good travel UX, weak answer to “why simulate?”** |
| **3D-print design** | Yes for thermal/material/toolpath/structural failure, but those need engineering solvers. | Visualize deterministic solver results from inside/around a print. | **Valuable hybrid, infeasible as pure world model.** |
| **Simulated MDMA/mushroom visual experience through phone camera** | No physically predictive claim is possible; subjective effects vary and a VFX filter is not a drug simulation. | X2/SANA-style live camera transformation for an explicitly artistic effect. | **Media demo only; health/normalization concerns and weak physical-simulation rationale.** |
| **Adaptive escape room** | No physical-world necessity, but it is an excellent interactive-world application. | Generate rooms that remember choices and reconfigure around player actions. | **Strong entertainment entry, weak fit for this research thesis.** |

The best refinement of the plant concept is not “predict exactly what your plant will look like.” It is: **“Compare plausible care scenarios, see why they differ, and expose the uncertainty.”** The best refinement of the escape room is to attach it to a real training purpose—mine escape, robot search, lab safety—without making unsupported hazard predictions.

---

## 6. Findings that should govern the final idea selection

1. **The highest-value physical simulations are hybrids.** AV, robotics, medicine, agriculture, fire, space, and ocean all rely on domain equations, measured geometry, calibrated sensors, or explicit state. Generative worlds can multiply scenarios and improve interaction, but should not silently replace those foundations.
2. **Procedural training is the best entry point.** It needs variability, presence, and real-time consequences, but can be validated through human performance and transfer before the model is trusted for engineering prediction.
3. **The scoring layer must be outside the video model.** If the product cannot state what happened except by looking at its own generated frames, it will be difficult to debug, validate, or judge.
4. **Fidelity should follow the decision.** A photorealistic fire with wrong ventilation is dangerous; a visually modest drill with correct procedure and metrics can still train effectively.
5. **Communicate uncertainty and scope.** “Illustrative scenario,” “training prototype,” and “not for operational/clinical decisions” are product requirements, not footnotes.
6. **For the hackathon, optimize one memorable loop.** Generate → move → trigger a consequential event → adapt → score. This uses world-model strengths and is demonstrable inside 90 seconds.

## Recommended final choice

Build **ZERO-DAY RESCUE** first. If the Reactor SDK makes coherent navigation or event injection unreliable, fall back to **Garden Futures**, where short generated time slices can be compared without requiring a continuous 90-second world. The first has the strongest combination of world-model nativeness, real-time control, human impact, and judge-friendly UX; the second has the cleanest slow-feedback justification.
