# Virality Tracker

> A fixed-snapshot research interface for exploring how recurring post formats and hooks appear across a selected cohort of public X creators.

[View the project source](https://github.com/ActiveAngrily/virality-tracker) · [Independent research by Anant Jamuar](https://anantjamuar.me)

---

## Overview

Virality Tracker—called **Viral Format Radar** in the dataset and research artifacts—helps readers inspect recurring content patterns without reducing them to a single score. The interface compares first-use posts with each creator’s own earlier performance, shows adoption order within the observed cohort, and keeps source evidence and limitations close to every claim.

The application has two screens:

| Route | Purpose |
| --- | --- |
| `#/radar` | Browse tracked formats and hooks; filter by lifecycle or type; sort by default evidence order, recency, or median view lift. |
| `#/pattern/<pattern-id>` | Review one pattern’s evidence summary, interactive adoption timeline, creator records, representative source posts, and data limitations. |

Filter and sort state is retained when moving between the radar and a pattern detail page.

## Key features

- **Creator-relative evidence** — view lift compares a post with the median views of the same creator’s eligible earlier posts.
- **Formats and hooks** — the frozen codebook separates how a post is structured from how it opens.
- **Transparent lifecycle states** — patterns are presented as Emerging, Validated, Fading, or Insufficient Evidence using the frozen Stage 3 rules.
- **Interactive adoption timeline** — every event is a native button with creator, date, rank, adopter status, percentile where available, and later-adopter evidence.
- **Source-level traceability** — pattern details link back to the corresponding public X posts when a valid source URL is available.
- **Explicit unavailable states** — missing counts, young posts, limited baselines, and withheld medians remain visible instead of being converted to zero.
- **Deterministic local analysis** — the UI analyzes the bundled primary snapshot in memory; it has no backend, database, authentication, or runtime data collection.

## Methodology

The primary interface reads [`data/demo-data.json`](./data/demo-data.json), validates it, and passes it through the deterministic analysis in [`src/analysis.mjs`](./src/analysis.mjs).

| Research setting | Frozen value |
| --- | --- |
| Primary cohort | 30 public creators across B2B technology, startups, product, growth, venture, and developer tools |
| Primary post snapshot | 1,074 posts |
| Observation window | 23 June–21 September 2026 |
| Analysis date | 21 September 2026 |
| Creator history cap | 50 collected posts per creator |
| Performance eligibility | Post age of at least 168 hours at collection |
| Baseline | Median views from up to 20 eligible earlier posts by the same creator |
| Supported baseline | At least 10 eligible earlier posts |
| Supported breakout | At least `1.5×` the creator baseline with a supported baseline |
| Early-adopter boundary | Adoption percentile at or below `0.25` |
| Later-adoption window | 30 days after the creator’s first observed use |
| Validated-capture minimums | At least 4 distinct adopters and 2 later adopters, plus early-adopter and supported-breakout checks |
| Recent window | 7 days before the fixed analysis date |

These thresholds are data-contract values, not tunable controls in the interface. Stage 3 exposes the underlying counts, dates, source post IDs, numerators, denominators, and unavailable reasons used by the UI.

### Data limitations

> [!IMPORTANT]
> The results are observational within one selected cohort. “First observed” does not mean “originated,” later adoption does not establish influence or causation, and no result is a prediction or guarantee.

- Activity outside the fixed observation window is not represented, so earlier uses may be missing.
- Public engagement values are collection-time snapshots and may differ from current values on X.
- Three primary-roster creators have blocked or unavailable collection states; no replacement identities were inserted.
- Posts younger than seven days can contribute adoption evidence but not performance comparisons.
- Approximate timestamps preserve their recorded precision; tied order timestamps share an adoption position.
- All quote counts in the primary snapshot are unavailable. Amplification counts and rates that require them remain unavailable rather than becoming zero.
- Pattern-level medians are withheld when fewer than two qualifying first-use posts are available.

## Accessibility and interaction

- Semantic headings, landmarks, definition lists, ordered event lists, labeled controls, and descriptive external links.
- Native selects for filtering and sorting, and native buttons for every adoption event.
- Visible focus states and non-color selected states throughout the interface.
- Arrow-key, Home, and End navigation across timeline dots and textual events; Enter selects an event and Escape clears it.
- Hover and focus evidence cards on wider screens, plus a persistent selected-event summary for keyboard and touch use.
- A complete textual timeline remains the authoritative accessible equivalent of the visual timeline.
- Responsive layouts avoid page-level horizontal overflow, and `prefers-reduced-motion` disables the animated dither background and transitions.

## Project structure

```text
.
├── data/       frozen primary, expansion, combined, roster, and raw-post artifacts
├── planning/   stage contracts, implementation notes, and product specifications
├── public/     self-hosted Inter and Playfair Display font files and licenses
├── research/   metric research, source index, evaluation notes, and open questions
├── scripts/    dataset builders, validators, labeling support, and deterministic tests
├── src/        analysis engine, UI model, renderer, timeline interactions, and styles
├── tmp/        preserved labeling suggestions and review ledgers
├── index.html  Vite application entry point
└── package.json
```

| File | Responsibility |
| --- | --- |
| [`src/main.mjs`](./src/main.mjs) | Renders the radar and pattern-detail screens and binds route-level UI behavior. |
| [`src/analysis.mjs`](./src/analysis.mjs) | Validates datasets and computes baselines, performance, adoption, lifecycle, and evidence quality. |
| [`src/ui-model.mjs`](./src/ui-model.mjs) | Owns hash routes, filter state, deterministic sorting, display copy, and representative-post selection. |
| [`src/timeline.mjs`](./src/timeline.mjs) | Formats timeline evidence and synchronizes dot, summary, and textual-list interactions. |
| [`src/styles.css`](./src/styles.css) | Defines the responsive paper-and-ink visual system and accessibility states. |
| [`src/dither.mjs`](./src/dither.mjs) | Draws the background texture while respecting reduced-motion preferences. |

## Local setup

### Requirements

- Node.js `20.19.x` or `22.12+`
- npm

```bash
git clone https://github.com/ActiveAngrily/virality-tracker.git
cd virality-tracker
npm ci
npm run dev
```

Open [http://localhost:5173/#/radar](http://localhost:5173/#/radar). The interface does not require environment variables or a network request to analyze the bundled primary snapshot.

## Available npm scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Creates a production bundle in `dist/`. |
| `npm run preview` | Serves the production bundle locally for review. |
| `npm test` | Runs the Stage 3, Stage 4, and Stage 5 Node test files. |
| `npm run validate` | Validates the labeled source artifacts, review ledgers, frozen thresholds, source facts, and combined sensitivity dataset. |
| `npm run data:build` | Rebuilds `data/demo-data.expanded.json` from the preserved primary and expansion artifacts. |

## Testing and build

Run the deterministic test suite and production build:

```bash
npm test
npm run build
```

Run the separate artifact validation pass when source or derived data changes:

```bash
npm run validate
```

The tests cover dataset validation, frozen Stage 3 calculations, source traceability, routing, filtering, sorting, representative-post selection, tied timestamps, timeline labels and selection state, keyboard behavior, reduced motion, and primary-versus-expansion separation.

## Data and source notes

| Artifact | Role |
| --- | --- |
| [`data/demo-data.json`](./data/demo-data.json) | Primary application snapshot: 30 creators and 1,074 posts. |
| [`data/demo-data.expansion.json`](./data/demo-data.expansion.json) | Separate 30-creator expansion snapshot with 982 posts; not loaded by the UI. |
| [`data/demo-data.expanded.json`](./data/demo-data.expanded.json) | Preserved 60-creator, 2,056-post sensitivity artifact; validated separately and not loaded by the UI. |
| [`data/x-creators.json`](./data/x-creators.json) and [`data/x-creators.expansion.json`](./data/x-creators.expansion.json) | Frozen creator rosters for the primary and expansion cohorts. |
| [`data/x-posts.raw.json`](./data/x-posts.raw.json) and [`data/x-posts.expansion.raw.json`](./data/x-posts.expansion.raw.json) | Preserved source snapshots used to verify post-level facts. |
| [`tmp/jev-label-review-all.json`](./tmp/jev-label-review-all.json) | Completed review ledger for the combined labeled records. |

All three demo datasets use schema `vfr-x-schema-1.0`, codebook `vfr-x-codebook-1.0`, thresholds `vfr-x-thresholds-1.0`, and the same fixed analysis date. The expansion artifacts exist for sensitivity work; they are deliberately kept out of the product’s primary data flow.

For the research rationale and implementation record, start with [`research/00-research-index.md`](./research/00-research-index.md) and [`planning/implementation-progress.md`](./planning/implementation-progress.md).

## Project status

All five planned stages are marked complete in the repository’s implementation record. The current artifact is a review-ready, local research proof of concept built around the frozen original 30-creator snapshot; it is not a live monitoring or prediction service.
