# Stage 5 — Integrate, Audit, and Package the MVP

> Status: not started
>
> Depends on: Stage 4 functional interface
>
> Blocks: final delivery
>
> Authoritative product plan:
> [`viral-format-radar-product-design.md`](./viral-format-radar-product-design.md)

## 1. Objective

Verify that the complete Viral Format Radar is accurate, understandable,
accessible, locally reproducible, and honest about the limits of its X
evidence. Remove anything not required for the review-ready proof of concept.

Stage 5 should fix integration and presentation defects. It must not quietly
change the frozen dataset, codebook, thresholds, or product scope to produce
more attractive results.

## 2. Source-to-interface trace audit

For every visible summary and detail metric:

1. Identify the Stage 3 output field.
2. Identify the contributing post and creator IDs.
3. Trace those IDs to `data/demo-data.json`.
4. Confirm the source URL and collected value.
5. Recalculate a representative sample manually.

Audit at minimum:

- Summary lifecycle counts.
- Distinct and recent adopter counts.
- One creator baseline in each evidence-quality state.
- One view-lift ratio at or near the breakout threshold.
- One amplification count and rate.
- One pattern median and sample count.
- One early-adoption rank and percentile.
- One later-adopter count.
- Every validated early-capture event.
- Every representative post displayed in the product.

## 3. Dataset and analysis audit

- Re-run final dataset validation.
- Re-run the deterministic Stage 3 fixture.
- Confirm the creator count is exactly 30.
- Confirm no creator has more than 50 included posts.
- Confirm IDs and canonical URLs are unique.
- Confirm raw missing values remain null.
- Confirm excluded records do not enter analysis.
- Confirm young posts can affect adoption but not performance.
- Confirm zero baselines remain unclassifiable.
- Confirm unclassified posts can support baselines without becoming pattern
  evidence.
- Confirm tied or approximate timestamps follow the frozen ordering rule.
- Confirm all threshold and codebook version identifiers match.

## 4. Product-state audit

Exercise:

- Supported, Provisional, and Limited evidence.
- Emerging, Validated, Fading, and Insufficient Evidence lifecycle states.
- Missing view, repost, or quote counts.
- Missing and zero baselines.
- Young posts.
- Unclassified formats and hooks.
- Too few adopters.
- Empty filter results.
- Broken or unavailable X source links.

If a required state does not occur naturally in the frozen product dataset,
test it through the deterministic fixture or a development-only fixture. Do
not add synthetic evidence to the shipped dataset.

## 5. Claim and copy audit

Search all interface and documentation copy for unsupported language.

The product may say:

- Observed in this cohort.
- Followed by later adoption.
- Creator-relative view lift.
- Repost-plus-quote amplification and amplification rate.
- Emerging, Validated, Fading, or Insufficient Evidence under the frozen rules.
- Worth considering for a test.

The product must not say:

- Originated by.
- Caused.
- Guaranteed to go viral.
- Trending across X.
- Platform-wide.
- Predictive.
- Impression, reach, or engagement rate when those values were not collected.

Confirm every screen explains that view and engagement counts are fixed
collection-time snapshots with different post ages.

## 6. Source-link audit

- Open every representative source-post link.
- Sample additional evidence links from every displayed pattern.
- Confirm the linked creator and post match the record.
- Mark unavailable links explicitly.
- Never silently replace a deleted post with a different example.

## 7. Accessibility audit

- Navigate the entire product by keyboard.
- Confirm visible focus on every interactive element.
- Confirm controls have programmatic labels.
- Confirm semantic heading and landmark order.
- Confirm lifecycle and evidence states do not rely on color.
- Check text and UI contrast.
- Check the adoption timeline's textual equivalent.
- Check descriptive external-link labels.
- Check layout at narrow and wide viewport sizes.
- Check reduced-motion behavior if any motion exists.

Use automated accessibility checks already available in the project when
present, but do not add a large testing dependency for this small static app.

## 8. Integration and runtime audit

- Start from a clean local checkout or equivalent clean install state.
- Follow the documented setup command exactly.
- Confirm the application runs without network services.
- Confirm the production build succeeds.
- Confirm the browser console has no errors or warnings requiring action.
- Confirm internal navigation and direct Pattern Detail URLs work.
- Confirm no collection credentials, cookies, raw browser state, or personal
  secrets are committed.
- Confirm only the frozen final dataset is loaded by the application.

## 9. Simplicity audit

Remove:

- Unused dependencies.
- Dead components and styles.
- Duplicate calculation or formatting logic.
- Unused raw data copied into the shipped bundle.
- Placeholder routes and speculative configuration.
- Commented-out experiments.
- Abstractions with only one unnecessary implementation.

Do not replace simple working code with a framework or generalized system
during final cleanup.

## 10. Documentation and demo package

Add concise setup and demo instructions covering:

- Prerequisites.
- Install command, if any.
- Local development command.
- Production build command.
- Test or validation command.
- Where the frozen dataset lives.
- The intended two-screen demo path.
- Dataset and metric limitations.

Prepare a short demo sequence:

1. Open Radar and explain the fixed X cohort.
2. Identify one Emerging or Validated pattern.
3. Open Pattern Detail.
4. Trace adoption, view lift, amplification, and representative source posts.
5. Show the limitation language.

## 11. Final freeze

After all audits pass:

- Freeze `data/demo-data.json`.
- Record dataset, codebook, threshold, and application versions.
- Record the final analysis-as-of and collection-completed timestamps.
- Run validation, fixture, and production build one last time.
- Update the progress tracker with results and known limitations.
- Do not make post-freeze content changes without reopening the affected stage.

## 12. Deliverable

A polished, review-ready Viral Format Radar proof of concept with verified
source traceability, accurate calculations, accessible interactions, a frozen
X dataset, and reproducible local setup instructions.

## 13. Exit criteria

Stage 5 is complete only when:

- Every visible value can be traced to source data.
- Ratios, medians, ranks, sample sizes, and lifecycle states pass audit.
- Required missing and edge states have been tested.
- Representative X source links have been verified.
- Keyboard navigation and basic visual accessibility pass.
- Unsupported causal or platform-wide claims are absent.
- Production build and deterministic checks pass.
- Unnecessary code and dependencies have been removed.
- Setup and demo instructions work from a clean start.
- The final dataset and implementation are frozen.
- The progress tracker marks all five stages complete.

## 14. Explicitly excluded

Stage 5 does not add new product features, creators, posts, thresholds,
patterns, screens, infrastructure, or data sources. A material issue in a
frozen upstream artifact reopens the stage that owns it.
