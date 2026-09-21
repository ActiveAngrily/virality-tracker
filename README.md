# Viral Format Radar

A research tool and proof of concept for tracking shifts in social content formats and hooks across a defined creator cohort on X, measuring creator-relative lift and spread evidence without black-box scores or causal claims.

---

## Overview

**Viral Format Radar** demonstrates how content strategists can monitor emerging format patterns across creators over time:

1. **Creator-relative baseline comparison**: Evaluates posts against each creator's normal baseline (median view count from matured posts at least 7 days old) rather than misleading raw impression counts.
2. **Concrete format & hook tracking**: Categorizes content into actionable format patterns (teardowns, before/after comparisons, tactical workflows) and hook patterns (contrarian claims, concrete numbers, curiosity gaps) via a frozen codebook.
3. **Early adoption vs. normal performance**: Distinguishes true breakout patterns (≥ 1.5× creator baseline followed by later adopters within 30 days) from ordinary creator reach.
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
│   ├── demo-data.json    # Frozen MVP dataset (30 creators, 1,074 labeled posts)
│   ├── x-creators.json   # Base creator cohort metadata
│   ├── x-posts.raw.json  # Raw collected post snapshot records
│   ├── demo-data.expansion.json      # Secondary validation cohort (30 creators, 982 posts)
│   ├── x-creators.expansion.json    # Expansion creator cohort metadata
│   └── x-posts.expansion.raw.json   # Raw expansion snapshot records
├── scripts/
│   ├── test-stage3.mjs               # Deterministic fixture tests for analysis engine
│   ├── test-stage4.mjs               # UI model, sorting, filtering, and routing tests
│   ├── validate-stage2.mjs           # Integrity check for datasets, codebook, and review ledgers
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

- **Node.js** (v18+ recommended; supports native `node --test` runner)
- **npm**

### Installation

```bash
git clone <repo-url>
cd socap_assignment
npm install
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

Validate dataset integrity, codebook conformity, and audit ledgers:

```bash
node scripts/validate-stage2.mjs
```

---

## Architecture & Design Principles

- **Deterministic & Local**: All metric calculations (medians, view lifts, breakout ratios, lifecycle classifications) execute synchronously in memory from the frozen dataset with zero cloud or database dependencies.
- **Pure Web Standards**: Built with modern vanilla ES Modules, native DOM manipulation, and responsive CSS with CSS custom properties.
- **Honest Metrics**: Avoids opaque virality scores. Clearly highlights when data is limited, baseline sample sizes are provisional, or quote counts are unavailable.
- **Accessible**: Semantic landmarks, keyboard navigation, high-contrast visual states, and automatic canvas suspension for `prefers-reduced-motion`.
