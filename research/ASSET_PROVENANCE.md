# Zero-Day Rescue asset provenance

Checked 2026-08-16. The three shipped seeds are local project assets; no third-party disaster photograph is redistributed. Reference sources informed common materials and damage patterns, not composition-for-composition copying. No agency endorsement is implied.

| Scenario | Shipped asset | Research source | Rights/credit note | Visual facts used | Original redistributed? |
| --- | --- | --- | --- | --- | --- |
| Aftershock | `public/scenarios/aftershock/seed.png` | [USGS earthquake imagery](https://www.usgs.gov/programs/earthquake-hazards/multimedia-gallery) | USGS works are generally public domain unless an item says otherwise; individual-item rights must still be checked. | Localized concrete damage, spalling, exposed structure, restrained dust. | No source photo; approved project reference copied locally. |
| Rising Water | `public/scenarios/rising-water/seed.png` | [NOAA Photo Library](https://www.noaa.gov/noaa-collections/photo-library) | NOAA Digital Library images are generally public domain unless otherwise noted; credit NOAA and named photographers when an image is reused. | Shallow reflective water, wet concrete, plausible emergency access. | No; original image generated with built-in image generation. |
| Ember Front | `public/scenarios/ember-front/seed.png` | [USFA image gallery](https://www.usfa.fema.gov/gallery/) | USFA describes its gallery as copyright-free fire and life-safety imagery. | Smoke-reduced visibility, dry roadside fuel, defensible access route. | No; original image generated with built-in image generation. |

## Fast quality gate

| Scenario | Photorealism | Navigability | Landmark clarity | Scenario readability | Safety/rights | LingBot live stability |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Aftershock | 4 | 4 | 5 | 4 | 5 | Pending live credit-enabled preflight |
| Rising Water | 5 | 5 | 5 | 5 | 5 | Pending live credit-enabled preflight |
| Ember Front | 5 | 5 | 5 | 5 | 5 | Pending live credit-enabled preflight |

Generated seed prompts are the implementation-ready briefs in `BUILD_SPEC.md` sections 8.6 and 8.7. Built-in image generation was used; outputs were copied into the workspace and are consumed locally at runtime.

