# Stage 1 — Freeze the Product and Data Contract

> Status: complete
>
> Depends on: approved product direction
>
> Blocks: Stage 2 data collection
>
> Authoritative product plan:
> [`viral-format-radar-product-design.md`](./viral-format-radar-product-design.md)

## 1. Objective

Turn the approved Viral Format Radar direction into an exact, internally
consistent X MVP contract before collecting data or writing application code.

Stage 1 ends with an approved product specification, a frozen 30-creator
roster, a frozen codebook and threshold set, exact snapshot dates, and empty
machine-readable data files that Stage 2 can populate without changing their
shape.

## 2. Already approved

These decisions are not reopened in Stage 1 unless the user explicitly changes
them:

- X is the only platform.
- The cohort contains exactly 30 individual B2B technology/startup creators.
- Stage 2 collects up to 50 contiguous recent original posts per creator.
- Collection uses Codex browser control through the rendered X UI.
- The product uses one frozen local dataset.
- Formats and hooks are the primary product objects; creators are evidence.
- Performance uses public views captured at the fixed collection snapshot.
- Public repost and quote counts provide spread evidence; likes and replies are
  supporting context.
- The application has two screens: Radar and Pattern Detail.
- The MVP has no backend, database, authentication, imports, live collection,
  scheduler, machine learning, or campaign-management workflow.

## 2A. Frozen implementation decisions

Stage 1 uses the following exact contract values:

```text
schema_version = vfr-x-schema-1.0
codebook_version = vfr-x-codebook-1.0
threshold_version = vfr-x-thresholds-1.0
cohort_id = x-b2b-tech-creators-2026-09
planned_collection_date_utc = 2026-09-21T12:00:00Z
observed_from_utc = 2026-06-23T12:00:00Z
observed_to_utc = 2026-09-21T12:00:00Z
analysis_as_of_utc = 2026-09-21T12:00:00Z
```

The observation interval is inclusive and exactly 90 days. `observed_to_utc`
and `analysis_as_of_utc` are identical. The planned collection timestamp is
the fixed snapshot boundary; completion remains null until Stage 2 finishes.
Posts before the observation start are not collected or used for baselines.
Posts younger than 168 hours may support adoption evidence but not view-lift
performance. Approximate dates tie at their displayed precision.

The machine-readable contract is implemented in:

```text
data/x-creators.json
data/x-posts.raw.json
data/demo-data.json
```

The exact field definitions, enums, nullability, threshold algorithms, and
codebook entries are authoritative in the product specification and repeated
in the JSON artifact `schema` and metadata objects. The 30-person roster is
implemented with all collection statuses set to `pending` and approved. The
repaired contract passed review and Stage 2 is ready.

## 3. Workstream A — Freeze the product boundary

Review the authoritative product plan from beginning to end and resolve every
remaining placeholder or contradiction.

Confirm:

- Product name and one-sentence definition.
- Primary user and job-to-be-done.
- Included and excluded functionality.
- The two-screen information architecture.
- The permitted product claims and required limitation language.
- The visible metrics and interface states.
- The five-stage dependency order.

The specification must consistently say X, views, posts, reposts, quotes, and
observed cohort. It must contain no active LinkedIn, reactions, documents,
carousels, or historical seven-day snapshot requirements.

## 4. Workstream B — Freeze the creator cohort

Create the exact 30-person roster Stage 2 will use.

For each creator, record:

```text
creator_id
creator_name
creator_handle
profile_url
role_or_category
inclusion_reason
collection_status
```

Roster requirements:

- Exactly 30 unique individual creators.
- Primarily English-language X content.
- Relevant to B2B technology, startups, AI, developer tools, product, growth,
  or venture investing.
- A reasonable mixture of founders, operators, marketers, investors, and
  technical creators.
- No company pages.
- No duplicate people or aliases.
- A canonical X profile URL for every creator.
- `collection_status = "pending"` for all records at Stage 1 exit.

Do not collect posts in Stage 1. Profile verification is allowed only to
confirm identity, relevance, and whether a usable activity feed exists.

## 5. Workstream C — Freeze the data contract

Define three files:

```text
data/x-creators.json
data/x-posts.raw.json
data/demo-data.json
```

### Creator file

Contains dataset metadata plus the frozen 30-person roster and collection
checkpoint fields.

### Raw-post file

Contains browser-visible source facts exactly as collected, normalized values
when safely derivable, nulls for unavailable values, and exclusion metadata.
It contains no analysis results.

### Final demo file

Contains the frozen metadata, creators, codebook, thresholds, labeled eligible
posts, and no precomputed UI-specific presentation state. Stage 3 derives
Radar results from this file.

The exact field names, primitive types, nullability, enum values, uniqueness
rules, and cross-file references must be documented in the product plan and
represented in empty valid JSON files.

Required contract rules:

- IDs are stable strings.
- Timestamps are UTC ISO 8601 strings or null where explicitly permitted.
- Engagement counts are non-negative integers or null.
- Missing is never silently converted to zero.
- Raw display labels are preserved beside parsed values.
- Post URLs and post IDs are unique in the final dataset.
- Every post references one rostered creator.
- No creator has more than 50 included posts.
- Derived metrics are absent from raw collection records.

## 6. Workstream D — Freeze the codebook

Finalize one versioned codebook before collection performance is inspected.

The codebook must contain:

- Format families used only for navigation and context.
- Six to ten concrete format patterns used for analysis.
- The approved hook patterns.
- A stable ID, name, definition, inclusion rule, exclusion rule, and one
  positive and one negative example for every concrete pattern.
- An explicit `unclassified` option for formats and hooks.
- One primary format and at most one primary hook per scored post.
- X-native media types kept separate from format patterns.

The codebook must not encode creator identity, topic, or performance. Pattern
names cannot be changed after performance results are calculated merely to
improve the output.

## 7. Workstream E — Freeze thresholds and algorithms

Record one versioned threshold object covering:

- Maximum collected posts per creator.
- Maximum baseline-history posts.
- Minimum post age for performance eligibility.
- Minimum prior-post counts for Provisional and Supported baselines.
- Supported breakout view-lift threshold.
- Pattern episode length.
- Recent-adoption window.
- Minimum adopter count.
- Early-adoption percentile boundary.
- Minimum later-adopter count.
- Fading minimum age.
- Minimum sample required to display pattern median view lift or amplification
  rate.

Freeze the deterministic definitions for:

- Creator baseline.
- View lift.
- Amplification count and amplification rate from reposts and quotes.
- First adoption.
- Adoption rank and percentile, including ties.
- Later adopters.
- Validated early capture.
- Emerging, Validated, Fading, and Insufficient Evidence.
- Supported, Provisional, and Limited evidence quality.
- Repeat use and creator repeat evidence.

Every threshold must have one canonical name. The product plan, JSON metadata,
analysis implementation, and test fixture must use the same names.

## 8. Workstream F — Freeze time boundaries

Record exact UTC values for:

```text
observed_from_utc
observed_to_utc
analysis_as_of_utc
planned_collection_date_utc
```

The observation window must be common to all 30 creators. The planned default
is 90 days, but Stage 1 must replace the relative duration with exact dates.

The contract must explain:

- Whether `observed_to_utc` and `analysis_as_of_utc` are identical.
- How posts near the start boundary can be used for baselines.
- How posts younger than seven days can count toward adoption but not
  performance.
- How approximate X timestamps affect adoption ties.
- That view and engagement counts are snapshot values collected in Stage 2,
  not reconstructed historical seven-day counts.

## 9. Empty deliverables

Stage 1 creates these empty but valid artifacts:

```text
data/x-creators.json
data/x-posts.raw.json
data/demo-data.json
```

“Empty” means they contain frozen metadata, schema version information,
thresholds and codebook where applicable, and empty creator/post arrays. The
creator file is then populated only with the approved 30-person roster; no post
records are collected.

Also update:

```text
planning/viral-format-radar-product-design.md
planning/implementation-progress.md
```

## 10. Verification

Before approval:

- Search all active planning files for stale platform and metric terminology.
- Confirm the creator roster contains exactly 30 unique IDs and URLs.
- Parse all three JSON files successfully.
- Confirm enum values and threshold names match the product specification.
- Confirm raw and final post arrays are empty.
- Confirm no application code or collection data was added.
- Confirm every Stage 2 field can be stored without another schema decision.
- Confirm every Stage 3 calculation has the inputs it requires.

## 11. Exit criteria

Stage 1 is complete only when:

- The authoritative product specification is marked frozen and approved.
- X is the only active platform in the contract.
- The exact 30-creator roster is approved.
- The maximum of 50 posts per creator is fixed.
- The full data schema and nullability rules are fixed.
- The format and hook codebook is fixed and versioned.
- Every analysis threshold and lifecycle rule is fixed and versioned.
- Exact analysis and observation dates are recorded.
- The three empty JSON artifacts parse and satisfy the contract.
- The progress tracker marks Stage 1 complete and Stage 2 ready.

## 12. Explicitly deferred

Do not perform any of the following in Stage 1:

- Collect X posts or engagement values.
- Build browser automation helpers.
- Implement analysis functions.
- Build interface components.
- Add a backend, database, authentication, or import system.
- Create synthetic product evidence.

Stage 2 starts only after all Stage 1 exit criteria pass.
