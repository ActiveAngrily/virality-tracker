# Viral Format Radar

A local research proof of concept for reviewing formats and hooks observed in a fixed, expanded cohort of 60 X creators. It reports creator-relative view lift and later adoption without black-box scores or causal claims.

---

## Overview

**Viral Format Radar** demonstrates how content strategists can monitor emerging format patterns across creators over time:

1. **Creator-relative baseline comparison**: Evaluates posts against each creator's normal baseline (median view count from matured posts at least 7 days old) rather than comparing raw view counts across creators.
2. **Concrete format & hook tracking**: Categorizes content into actionable format patterns (teardowns, before/after comparisons, tactical workflows) and hook patterns (contrarian claims, concrete numbers, curiosity gaps) via a frozen codebook.
3. **Early adoption vs. normal performance**: Identifies qualifying events at ≥1.5× creator baseline that were followed by later adopters within 30 days.
4. **Transparent, verifiable evidence**: Every displayed metric, lifecycle state, and pattern directly links to public source posts on X and raw snapshot metrics.

---

## Project Structure

```text
socap_assignment/
├── src/
│   ├── main.mjs          # Two-screen application UI (Radar Overview & Pattern Detail)
│   ├── analysis.mjs      # Deterministic analysis engine (baselines, lift, lifecycle)
│   ├── ui-model.mjs      # URL routing, sorting, filtering, and metric presentation
│   ├── styles.css        # Responsive editorial theme & typography
│   └── dither.mjs        # Retro Bayer dither background with reduced-motion support
├── data/
│   ├── demo-data.json    # Preserved original snapshot (30 creators, 1,074 posts)
│   ├── demo-data.expanded.json       # Shipped derived snapshot (60 creators, 2,056 posts)
│   ├── x-creators.json   # Base creator cohort metadata
│   ├── x-posts.raw.json  # Raw collected post snapshot records
│   ├── demo-data.expansion.json      # Preserved expansion snapshot (30 creators, 982 posts)
│   ├── x-creators.expansion.json    # Expansion creator cohort metadata
│   └── x-posts.expansion.raw.json   # Raw expansion snapshot records
├── scripts/
│   ├── test-stage3.mjs               # Deterministic fixture tests for analysis engine
│   ├── test-stage4.mjs               # UI model, sorting, filtering, and routing tests
│   ├── validate-stage2.mjs           # Integrity check for source datasets and review ledgers
│   ├── validate-stage5.mjs           # Expanded snapshot, source-fact, and disjointness checks
│   ├── build-expanded-dataset.mjs    # Deterministically rebuilds the derived snapshot
│   ├── review-and-build-stage2.mjs   # Dataset assembly and manual review script
│   └── suggest-labels.mjs            # TypeSafe AI labeling assistant
├── planning/             # Specifications, stage contracts, and progress tracking
├── research/             # Metric taxonomy, creator consistency, and literature index
├── public/fonts/         # Self-hosted typography (Inter & Playfair Display)
└── tmp/                  # Audit ledgers and label suggestions from Stage 2
```

---

## Quick Start

### Prerequisites

- **Node.js** 20.19+ or 22.12+
- **npm**

### Installation

```bash
npm ci
```

### Local Development

Start the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build & Preview

```bash
npm run build
npm run preview
```

### Running Tests & Validation

Run unit tests covering the deterministic analysis engine and UI model:

```bash
npm test
```

Validate both preserved source snapshots and the derived expanded snapshot:

```bash
npm run validate
```

Rebuild the derived snapshot only when either preserved source artifact changes:

```bash
npm run data:build
```

## Dataset snapshots

- `data/demo-data.json` is the recoverable original 30-creator snapshot: 1,074 posts, collected through `2026-09-20T20:24:56Z`.
- `data/demo-data.expansion.json` is the separate 30-creator expansion snapshot: 982 posts, collected through `2026-09-20T20:57:12Z`.
- `data/demo-data.expanded.json` is the deterministic combined application input: exactly 60 creators and 2,056 posts. The app imports this file locally; it makes no dataset network request.

All three use schema `vfr-x-schema-1.0`, codebook `vfr-x-codebook-1.0`, thresholds `vfr-x-thresholds-1.0`, and analysis date `2026-09-21T12:00:00Z`. The original snapshot is not overwritten.

## Two-screen demo

1. Open `#/radar` and note the “expanded 60-creator snapshot” label, lifecycle summary, filters, and cohort context.
2. Open any pattern card to visit `#/pattern/<pattern-id>`.
3. Review its adoption timeline, creator-relative view lift, source-post evidence, and limitations; use “back to radar” to confirm filter state is retained.

---

## Architecture & Design Principles

- **Deterministic & Local**: All metric calculations execute synchronously in memory from the frozen expanded dataset with no cloud, database, or runtime network dependency.
- **Pure Web Standards**: Built with modern vanilla ES Modules, native DOM manipulation, and responsive CSS with CSS custom properties.
- **Honest Metrics**: Avoids opaque virality scores. Clearly highlights when data is limited, baseline sample sizes are provisional, or quote counts are unavailable.
- **Accessible**: Semantic landmarks, keyboard navigation, visible focus, textual timeline equivalents, non-color state labels, responsive layout, and automatic canvas suspension for `prefers-reduced-motion`.

## Limits

This is one selected, fixed cohort—not a platform-wide sample. Counts were captured at different post ages, all quote counts are unavailable, and missing values remain `null`. Young posts can contribute adoption evidence but cannot contribute performance metrics. “First observed” is bounded by the observation window and does not establish origin or causation; results are descriptive, not predictive or guaranteed.
