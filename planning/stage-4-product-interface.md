# Stage 4 — Build the Product Interface

> Status: complete
>
> Depends on: Stage 3 verified analysis engine
>
> Blocks: Stage 5 final audit and packaging
>
> Authoritative product plan:
> [`viral-format-radar-product-design.md`](./viral-format-radar-product-design.md)

## 1. Objective

Build the two-screen local Viral Format Radar MVP on top of the verified Stage
3 analysis output. The interface should let a reviewer discover a pattern on
the Radar and verify its evidence on Pattern Detail without a walkthrough.

## 2. Inputs

- Frozen X dataset from Stage 2.
- Verified analysis module and output contract from Stage 3.
- Product copy, states, sorting rules, and accessibility requirements from the
  authoritative product specification.

The UI must not calculate baselines, adoption, lifecycle, or evidence quality.

## 3. Application shell

Build only:

```text
Radar → Pattern Detail
```

The app opens directly to Radar. It requires no login, setup, upload,
configuration, or network request.

The fixed context should show:

- Product name.
- X as the platform.
- Cohort description and 30-creator denominator.
- Observation window.
- Analysis-as-of date.
- Collection-completed date.
- Public-view snapshot metric and repost-plus-quote spread definition.
- Codebook and threshold versions where useful.

## 4. Radar screen

### Purpose

Answer which concrete formats and hooks show momentum in the fixed observed
cohort.

### Summary

Show:

- Emerging pattern count.
- Validated pattern count.
- Fading pattern count.
- Tracked creator count.

Do not add a composite score or vanity dashboard metrics.

### Pattern list

Each pattern row or card shows:

- Pattern name and type.
- Format family when applicable.
- One-line definition.
- Lifecycle state.
- Evidence quality.
- Distinct adopters out of 30.
- Recent adopter count.
- Median creator-relative view lift and sample size, or an unavailable
  state.
- Median amplification rate and sample size when available.
- Validated early-capture count.
- Last-observed date.
- A plain-language reason for its state.

Selecting a pattern opens Pattern Detail.

### Controls

Provide only:

- Lifecycle filter.
- Pattern-type filter.
- Sort by default, recency, or performance.

The default sort is the frozen explicit lexicographic order from the product
specification. Do not add search, date controls, saved views, or configurable
thresholds.

## 5. Pattern Detail screen

### Header

Show:

- Pattern name, type, and family.
- Definition.
- Lifecycle and evidence-quality labels.
- First- and last-observed dates.
- Analysis-as-of date.

### Signal explanation

Generate one factual sentence from visible analysis output. Use observed-cohort
language. Never say a creator originated, caused, or predicted a trend.

### Evidence metrics

Show:

- Distinct adopters out of 30.
- Recent and early adopters.
- Later-adopter counts.
- Median view lift and sample size.
- Amplification count and rate where available.
- Supported breakout count.
- Validated early-capture count.
- Repeat-use count.

### Adoption timeline

Show first observed cohort use, early adopters, later adopters, and recent
activity. Include a textual event list so the information does not depend on a
visual chart.

### Creator evidence

For each relevant creator, show:

- Name or X handle.
- First-use date.
- Adoption rank and percentile where available.
- Early-within-cohort status.
- Public views, reposts, and quotes on the first-adoption post; likes and
  replies as supporting context.
- Collection date and post age.
- Baseline, prior-history count, view lift, and baseline quality.
- Amplification count and rate when available.
- Later-adopter count.
- Other validated format count when nonzero.

Creators provide evidence and are not globally ranked.

### Representative posts

Show two or three source posts with creator, date, excerpt, format and hook
labels, public views, reposts, quotes, supporting likes and replies, baseline,
view lift, and a descriptive X source link.

### Limitations

Show cohort size, usable performance sample, baseline quality,
observation-window completeness, timestamp precision, left-censoring risk,
missing values, and the claims the result does not establish.

## 6. Required states

Design and implement:

- Loading only if local calculation is not instantaneous.
- Missing creator baseline.
- Provisional baseline.
- Zero baseline.
- Missing view count.
- Missing repost or quote count.
- Post younger than the performance minimum age.
- Unclassified format or hook.
- Too few adopters.
- Young pattern with insufficient evidence.
- Empty filter result.
- Broken or unavailable source link.

Never display missing values as zero.

## 7. Interaction and navigation

- Use ordinary links or minimal local routing.
- Preserve active Radar filters when returning from Pattern Detail if this can
  be done with native URL state or a few lines of local state.
- Make the whole pattern title/action clearly operable without turning every
  card into an inaccessible click target.
- Open external X source posts with clear labeling.
- Do not add editing, favoriting, sharing, export, notifications, or accounts.

## 8. Accessibility

- Use semantic landmarks and heading order.
- Provide keyboard access to all controls and links.
- Maintain visible focus states.
- Associate labels with every control.
- Do not use color as the only state indicator.
- Meet readable contrast requirements.
- Provide textual equivalents for the adoption timeline.
- Use descriptive link text rather than repeated “View post.”
- Respect reduced-motion preferences if motion is used at all.

## 9. Visual direction

The product should feel like a focused research instrument rather than a
campaign dashboard. Prioritize dense but readable evidence, obvious state
labels, and source traceability.

Use one restrained visual system. Avoid decorative charts, gradients,
animation systems, component libraries, and design tokens beyond what the two
screens require.

## 10. Verification

- Run the app entirely from local files.
- Compare visible values with the Stage 3 analysis output.
- Exercise every filter and sort.
- Open every Pattern Detail route.
- Check representative source links.
- Navigate both screens using only the keyboard.
- Check missing, provisional, zero-baseline, young-post, and empty-filter
  states.
- Confirm the interface contains no unsupported causation or platform-wide
  claims.
- Confirm the browser console has no errors.

## 11. Deliverable

A functional local two-screen web app using only the frozen dataset and the
verified analysis engine.

## 12. Exit criteria

Stage 4 is complete only when:

- Radar and Pattern Detail satisfy the product specification.
- All required states are implemented.
- Filters and sorting are deterministic.
- Every visible metric comes from Stage 3 output.
- Source posts and limitations are accessible from Pattern Detail.
- Keyboard navigation and basic visual accessibility pass.
- No excluded workflow has been added.
- The progress tracker marks Stage 4 complete and Stage 5 ready.

## 13. Explicitly deferred

Do not add a backend, database, user accounts, imports, live X
collection, campaign workflow, creator marketplace, content generation,
notifications, configurable thresholds, or additional primary screens.
