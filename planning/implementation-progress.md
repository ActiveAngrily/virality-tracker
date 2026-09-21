# Viral Format Radar — Implementation Progress

> Overall status: all five stages complete; expanded snapshot frozen
>
> Updated: 2026-09-22
>
> Next action: none; review-ready package complete

## Dependency chain

```text
Stage 1: Product contract
          ↓
Stage 2: X dataset
          ↓
Stage 3: Analysis engine
          ↓
Stage 4: Radar interface
          ↓
Stage 5: QA and packaging
```

No stage begins before the preceding stage satisfies its exit criteria.

## Stage status

| Stage | Plan | Status | Deliverable | Dependency |
| --- | --- | --- | --- | --- |
| 1. Freeze product and data contract | [`stage-1-product-and-data-contract.md`](./stage-1-product-and-data-contract.md) | Complete | Frozen specification, roster/codebook/thresholds/dates, and valid data artifacts | Approved direction |
| 2. Collect and prepare X dataset | [`stage-2-x-dataset-collection.md`](./stage-2-x-dataset-collection.md) | Complete | 1,074 labeled base posts plus 982 labeled expansion posts; validated demo artifacts | Stage 1 complete |
| 3. Build and verify analysis engine | [`stage-3-analysis-engine.md`](./stage-3-analysis-engine.md) | Complete | Verified deterministic analysis module | Stage 2 complete |
| 4. Build product interface | [`stage-4-product-interface.md`](./stage-4-product-interface.md) | Complete | Functional two-screen local web app with research-led visual system | Stage 3 complete |
| 5. Integrate, audit, and package | [`stage-5-integrate-audit-package.md`](./stage-5-integrate-audit-package.md) | Complete | Review-ready frozen 60-creator proof of concept | Stage 4 complete |

## Status definitions

- **Not started:** prerequisites are known, but implementation has not begun.
- **In progress:** the stage is actively being implemented.
- **Needs review:** deliverables exist and await user approval or final checks.
- **Complete:** every exit criterion passed and the deliverable is frozen.
- **Blocked:** an earlier stage or required user decision is incomplete.

## Approved cross-stage decisions

- Product: Viral Format Radar.
- Platform: X only.
- Cohort: preserved original 30-creator snapshot plus the approved, disjoint
  30-creator expansion; the app uses a derived 60-creator snapshot.
- Sample: up to 50 contiguous recent original posts per creator.
- Collection: one-time Codex browser control through the rendered X UI.
- Dataset: preserved base and expansion artifacts plus one frozen derived local
  application dataset.
- Primary metric: public views captured at the fixed collection snapshot.
- Spread evidence: public repost-plus-quote amplification and amplification
  rate; likes and replies are supporting context.
- Core objects: concrete formats and hooks; creators are supporting evidence.
- Screens: Radar and Pattern Detail only.
- Architecture: local web app with deterministic analysis and no production
  data infrastructure.

## Explicitly excluded from all stages

- Backend or database.
- Authentication or team permissions.
- User-facing imports or dataset management.
- Live, scheduled, or recurring collection.
- Production scraper infrastructure.
- Machine-learning prediction or automated pattern discovery.
- Campaign management, creator outreach, payments, or marketplace workflows.
- Generic creator leaderboard.
- Hidden blended virality score.
- Multi-platform support.

## Stage 1 checklist

- [x] Audit and freeze the X product specification.
- [x] Approve the exact 30-creator roster.
- [x] Freeze the creator, raw-post, and final-dataset schemas.
- [x] Freeze format families and concrete format patterns.
- [x] Freeze hook patterns.
- [x] Freeze all baseline, view-lift, adoption, lifecycle, and evidence
  thresholds.
- [x] Freeze exact UTC analysis and observation dates.
- [x] Create and parse the empty JSON artifacts.
- [x] Mark Stage 1 complete and Stage 2 ready.

## Stage 2 checklist

- [x] Confirm Stage 1 artifacts are frozen.
- [x] Run the two-creator browser-control pilot.
- [x] Validate pilot timestamps, counts, URLs, and null handling.
- [x] Collect the remaining creators in resumable batches.
- [x] Normalize and deduplicate source records.
- [x] Apply the frozen codebook.
- [x] Complete manual source review and preserve the full review ledger.
- [x] Freeze `data/demo-data.json` and the separate expansion artifact.
- [x] Mark Stage 2 complete and Stage 3 ready.

## Pilot review

- Structural QA passed: 30 roster records, 100 unique canonical post URLs, 50
  posts per usable pilot creator, rendered timestamp precision preserved, and
  missing counts left null.
- Permalink spot-checks for one Lenny post and one Dave post confirmed the
  post IDs, authors, exact visible timestamps, and current engagement labels.
  Current counts were slightly higher than the saved profile-feed values
  (594,025 vs. 594,006 views; 7,095 vs. 7,094 views), so the saved values are
  retained as the collection snapshot rather than overwritten.
- Permalink QA normalized exact UTC timestamps for all 100 pilot posts and
  expanded the nine records that exposed “Show more” during the pass.
- Quote counts were not exposed in the profile cards; collection-time public
  counts remain unchanged because live permalink counts can drift.
- Decision: the pilot passed and the user approved scaling. Main collection
  batches 1–9 captured CR-005 through CR-030: 974 additional raw posts with no
  duplicate post IDs or canonical URLs, bringing the raw collection to 1,074
  records with no pending roster creators.

## Raw collection checkpoint

- All 30 frozen roster records were attempted: 27 complete, 0 partial, and 3
  blocked.
- Blocked records: CR-002 Katelyn Bourgoin (protected/mismatched profile),
  CR-003 April Dunford (no posts in the frozen window), and CR-024 Kelsey
  Hightower (rendered profile explicitly showed 0 posts). No substitute identity
  was silently inserted.
- Raw summary: 1,074 unique posts; 744 performance-eligible and 330
  adoption-only due to age; 0 excluded; 0 missing view counts.
- Collection timestamps span `2026-09-20T19:57:06Z` through
  `2026-09-20T20:24:56Z`; raw artifact status is
  `stage_2_raw_collection_complete`.

## Expansion collection checkpoint

- User-approved expansion cohort: 30 additional verified public creators,
  collected separately so the original roster and raw snapshot remain intact.
- Expansion summary: 30 complete creators; 982 unique posts; 0 duplicate IDs
  or URLs; 751 performance-eligible; 231 adoption-only due to age; 0 missing
  view counts.
- Expansion artifacts: `data/x-creators.expansion.json` and
  `data/x-posts.expansion.raw.json`; artifact status is
  `stage_2_expansion_collection_complete`.

## TypeSafe labeling checkpoint

- Installed `@typesafe-ai/sdk` and added `scripts/suggest-labels.mjs`.
- Ran live suggestions for all 2,021 posts with visible text; 35 records with
  no visible text were retained as explicit unclassified missing-evidence
  cases.
- The full review ledger is `tmp/jev-label-review-all.json`; the base frozen
  artifact is `data/demo-data.json` and the separate expansion artifact is
  `data/demo-data.expansion.json`.
- Final validation covered all 2,056 records, valid codebook IDs, source URLs,
  timestamps, counts, creator references, and the 50-post creator cap.

## Stage 3 checklist

- [x] Validate the frozen dataset.
- [x] Implement creator baselines and view lift.
- [x] Implement amplification counts and rates.
- [x] Implement adoption and later-adopter evidence.
- [x] Implement lifecycle and evidence-quality classifications.
- [x] Implement repeat-use evidence.
- [x] Add and pass the deterministic fixture.
- [x] Hand-check representative calculations.
- [x] Mark Stage 3 complete and Stage 4 ready.

## Stage 3 analysis checkpoint

- Added the deterministic analysis module in `src/analysis.mjs`; it accepts one
  dataset, validates it before calculation, and does not load or merge the
  separate expansion cohort.
- Base validation passed for 30 creators and 1,074 posts, including three
  blocked creators, the 50-post cap, 959 unclassified format posts, and all
  source nulls. The base result contains 13 tracked patterns, 3 Validated and
  10 Emerging, with 4 validated early-capture events.
- All 1,074 base quote counts are null, so amplification counts and rates are
  correctly unavailable rather than converted to zero.
- The deterministic fixture covers the exact 1.5x breakout boundary, zero and
  missing baselines, young posts, missing amplification inputs, approximate
  timestamp ties, the 30-day later-adopter window, all four lifecycle states,
  median withholding, blocked creators, repeat use, creator repeat evidence,
  and the 50-post cap.
- Hand verification matched the canonical FP-06 event for CR-016: 13 eligible
  prior posts have a median of 13,177 views; 35,714 / 13,177 =
  2.7103286028686346. FP-06 has five adopters and one validated event, so the
  frozen precedence classifies it as Validated.
- `npm test` passes all three deterministic Stage 3 tests. Repeated analysis is
  byte-stable as structured data, every ratio retains its source values and
  identifiers, and no UI, browser, network, TypeSafe, or mutable global state
  is used.

## Stage 4 checklist

- [x] Build the fixed context and Radar screen.
- [x] Add approved filters and sorting.
- [x] Build Pattern Detail.
- [x] Add adoption timeline and textual equivalent.
- [x] Add creator and representative-post evidence.
- [x] Implement missing and edge states.
- [x] Verify keyboard navigation and basic accessibility.
- [x] Mark Stage 4 complete and Stage 5 ready.

## Stage 4 interface checkpoint

- Technical approach: Vite with native JavaScript modules, semantic HTML, and
  one primary CSS file. `src/main.mjs` imports `data/demo-data.json` and calls
  the existing `analyzeDataset` function directly. `src/ui-model.mjs` contains
  presentation-only URL state, deterministic sorting/filtering, copy, timeline
  coordinates, and representative-post selection.
- Files added: `index.html`, `src/main.mjs`, `src/ui-model.mjs`,
  `src/styles.css`, and `scripts/test-stage4.mjs`. `package.json`,
  `package-lock.json`, `.gitignore`, and the Stage 4 planning/progress records
  were updated. No dataset, raw evidence, or Stage 3 analysis file changed.
- Dependency: Vite 8.3.0 was added as the only Stage 4 development dependency.
  No UI, chart, icon, CSS, state-management, or test framework was added.
- Verification: `npm test` passes all eight Stage 3 and Stage 4 Node tests;
  `npm run build` succeeds. The Vite development server ran locally and all 13
  Pattern Detail hash routes rendered without console errors or external
  network requests.
- Browser checks: all lifecycle/type filters and all three sort modes passed;
  Fading and Insufficient Evidence exercise the empty state; Radar state is
  preserved through Pattern Detail and back; every source link is a valid,
  descriptive X link; narrow and wide layouts have no horizontal overflow.
- Accessibility checks: one `main` and one `h1` per route, labeled native
  selects, visible focus, keyboard-only Radar-to-detail-to-back navigation,
  textual timeline events, non-color state labels, safe external-link
  attributes, and reduced-motion CSS all passed.
- Required states: canonical events visibly cover missing/limited baselines,
  provisional baselines, young posts, unclassified labels, missing quotes,
  and a withheld median. The Radar evidence-state guide documents the
  canonical-zero or fixture-only cases: zero baseline, missing views/reposts,
  Fading, insufficient evidence, and unavailable source links.
- Stage 5 resolved the known young-post limitation at the shared Stage 3
  performance calculation: young posts still count toward adoption, while view
  lift, amplification count, and amplification rate remain unavailable.
- Exit result: every Stage 4 criterion passed. Stage 4 is complete and Stage 5
  is ready.

## Visual redesign checkpoint

- Studied current patterns from Our World in Data, Google Trends, TikTok
  Creative Center, Pinterest Trends, Pew Research Center, The Pudding, and
  Exploding Topics before implementation.
- Reworked the Radar as a simple Trends-style discovery page with friendly
  labels, a three-pattern “Strong signals” spotlight, compact filters, and
  lighter cards for patterns still gaining traction.
- Moved methodology and source-level evidence to Pattern Detail, which now
  uses a modern research-note structure: Summary, Findings, Spread, Creators,
  Examples, Limits, and Methods. No brand treatment was copied.
- Kept the existing two screens, dataset, Stage 3 analysis, URL state,
  filters, sorting, source links, textual timeline, and edge-state copy.
- Verification: all eight tests pass, the production build succeeds, and
  desktop plus 390px browser checks show no horizontal overflow.

## Stage 5 checklist

- [x] Trace every visible metric to source data.
- [x] Audit ratios, samples, lifecycle, and evidence states.
- [x] Test missing, young, unclassified, and zero-baseline cases.
- [x] Verify representative source links.
- [x] Complete accessibility and claim-language audits.
- [x] Remove unused code and dependencies.
- [x] Verify clean setup, checks, and production build.
- [x] Add setup and demo instructions.
- [x] Freeze the final dataset and implementation.
- [x] Mark the project complete.

## Stage completion log

| Date | Stage | Change | Evidence |
| --- | --- | --- | --- |
| 2026-09-21 | Planning | Created the five-stage implementation structure | Stage plans and this tracker |
| 2026-09-21 | Stage 1 | Implemented the frozen X contract, 30-person roster, codebook, thresholds, exact UTC boundaries, and valid JSON artifacts | Product specification and `data/*.json`; awaiting roster approval |
| 2026-09-21 | Stage 1 | User approved the exact 30-person roster; Stage 1 completed and Stage 2 unblocked | Contract checks passed; Stage 2 pilot is next |
| 2026-09-21 | Stage 1 audit | Reopened Stage 1, repaired schema contradictions, and reblocked Stage 2 | Awaiting review of the repaired contract |
| 2026-09-21 | Stage 1 review | Post-fix audit passed; repaired contract approved and frozen | Stage 1 complete; Stage 2 ready |
| 2026-09-21 | Stage 2 pilot | Captured 50 rendered-feed records each for Lenny Rachitsky and Dave Gerhardt; marked Katelyn Bourgoin and April Dunford blocked for this pilot | `data/x-posts.raw.json`, `data/x-creators.json`; 100 unique raw posts |
| 2026-09-21 | Stage 2 pilot QA | Normalized all 100 pilot timestamps from rendered permalinks and expanded nine “Show more” records; preserved collection-time counts | `data/x-posts.raw.json`; validator passed |
| 2026-09-21 | Stage 2 main collection | Captured batch 1 for Amanda Natividad, Ross Simmonds, and Gaetano DiNardi; preserved rendered counts and exact timestamps | `data/x-posts.raw.json`, `data/x-creators.json`; 71 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 2 for Peep Laja, Rand Fishkin, and Brian Balfour; preserved rendered counts and exact timestamps | `data/x-posts.raw.json`, `data/x-creators.json`; 65 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 3 for Andrew Chen, Tomasz Tunguz, and Jason Lemkin; retried Andrew after initial profile load timeout | `data/x-posts.raw.json`, `data/x-creators.json`; 150 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 4 for Elad Gil, Dharmesh Shah, and Hiten Shah; preserved rendered counts and exact timestamps | `data/x-posts.raw.json`, `data/x-creators.json`; 123 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 5 for Jason Fried, Rob Walling, and Arvid Kahl; retried Rob after initial profile load timeout | `data/x-posts.raw.json`, `data/x-creators.json`; 102 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 6 for Pieter Levels, Sahil Lavingia, and Guillermo Rauch; retried Pieter after initial profile load timeout | `data/x-posts.raw.json`, `data/x-creators.json`; 113 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 7 for Swyx, Kelsey Hightower, and Cassidy Williams; Kelsey was visibly an inactive 0-post profile | `data/x-posts.raw.json`, `data/x-creators.json`; 100 additional unique raw posts |
| 2026-09-21 | Stage 2 main collection | Captured batch 8 for Kent C. Dodds, Simon Willison, and Wes Bos; all reached the 50-post cap | `data/x-posts.raw.json`, `data/x-creators.json`; 150 additional unique raw posts |
| 2026-09-21 | Stage 2 raw collection | Captured batch 9 for Justin Welsh and Greg Isenberg; completed roster attempt and ran final schema/window/deduplication checks | `data/x-posts.raw.json`, `data/x-creators.json`; 1,074 unique raw posts total |
| 2026-09-21 | Stage 2 expansion collection | Verified and collected 30 additional non-overlapping public creators in ten batches; kept expansion artifacts separate from the base snapshot | `data/x-creators.expansion.json`, `data/x-posts.expansion.raw.json`; 982 unique raw posts |
| 2026-09-21 | Stage 2 labeling and freeze | Ran Jev over 2,056 records, reviewed the full ledger, preserved 35 missing-text cases as unclassified, populated both labeled artifacts, and passed final Stage 2 validation | `tmp/jev-label-review-all.json`, `data/demo-data.json`, `data/demo-data.expansion.json`, `scripts/validate-stage2.mjs` |
| 2026-09-21 | Stage 3 analysis engine | Implemented and verified deterministic base-cohort validation, baselines, view lift, amplification, adoption, lifecycle, evidence quality, and repeat evidence without merging the expansion cohort | `src/analysis.mjs`, `scripts/test-stage3.mjs`; `npm test` passes |
| 2026-09-21 | Stage 4 product interface | Built and browser-verified the two-screen local Radar interface with native hash state, deterministic controls, complete evidence detail, responsive styling, accessible timelines, and explicit unavailable states | `index.html`, `src/main.mjs`, `src/ui-model.mjs`, `src/styles.css`, `scripts/test-stage4.mjs`; 8 tests and production build pass |
| 2026-09-22 | Stage 5 expanded integration | Validated disjoint source cohorts, built and froze the 60-creator derived snapshot, moved the app to it, fixed young-post performance eligibility, traced displayed values, completed accessibility/runtime/copy audits, and packaged reproducible validation and setup | `data/demo-data.expanded.json`, Stage 5 tests/validator, browser checks, clean install, production build |

## Reopening rule

A completed stage may be reopened only when a later stage uncovers a material
problem in its frozen artifact. Record the reason here, change dependent stages
back to Blocked, fix the owning artifact, rerun its exit checks, and then resume
the dependency chain.
