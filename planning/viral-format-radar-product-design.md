# Viral Format Radar — X MVP Product Specification

> Status: Stage 1 contract frozen and approved; Stage 2 ready.
>
> Updated: 2026-09-21

This document is the authoritative product and implementation specification.
The earlier [`creator-signal-map.md`](./creator-signal-map.md) remains a
historical research and decision record.

## 1. Executive summary

**Viral Format Radar** is a small research tool that shows which social content
formats and hooks are beginning to spread within a defined creator cohort,
whether their first adopters outperformed their own normal results, and which
source posts support the signal.

The proof of concept uses one fixed X dataset assembled through a
one-time browser-assisted collection pass over publicly visible creator posts.
Collection is a research step, not a user-facing product feature. The product
has no import flow, live collection, machine learning, campaign management, or
creator marketplace.

The product must demonstrate four things:

1. A post can be compared with its creator's normal performance.
2. A format or hook can be tracked across creators over time.
3. Early adoption can be separated from ordinary high performance.
4. Every result can be traced to understandable rules and source posts.

The central product question is:

> Which formats and hooks show momentum in this observation window, how are
> they spreading, and which creators provide the strongest evidence?

The word *viral* is the product framing, not a scientific claim. Public view,
repost, and quote counts captured at the fixed collection snapshot measure
creator-relative traction and observed amplification; they do not establish
platform-wide origin or causal influence.

## 2. Decision history

| ID | Decision | Rationale | Status |
| --- | --- | --- | --- |
| D-001 | Build Viral Format Radar instead of a creator leaderboard or launch planner | It most directly answers the request to track shifts in viral formats | Approved |
| D-002 | Make formats and hooks the primary objects; use creators as evidence | This keeps the product focused on content-pattern change | Approved |
| D-003 | Design first for a Sociall Capital content or launch strategist | This is a job-application proof of concept for Sociall Capital | Approved |
| D-004 | Use one fixed X cohort and a preloaded dataset | A proof of concept does not need a production collection system | Restored and expanded by D-019 |
| D-005 | Remove user-facing imports and data management | They do not help a reviewer evaluate the core product idea | Approved |
| D-006 | Use manual labels and deterministic rules | The small dataset does not justify automated classification or machine learning | Approved |
| D-007 | Use seven-day likes and creator-relative medians | This keeps post-age and creator-size comparisons understandable | Superseded by D-016 |
| D-008 | Require early timing, a creator-relative breakout, and later adoption for validation | No single signal is sufficient on its own | Approved |
| D-009 | Use Radar and Pattern Detail as the only primary screens | They cover discovery and verification without adding workflow overhead | Approved |
| D-010 | Show repeat creator evidence as counts, not qualitative creator classes | Creator labels would pull the product back toward a generic creator-ranking tool | Applied in audit |
| D-011 | Separate pattern lifecycle state from evidence quality | Missing baselines should not be confused with lack of adoption | Applied in audit |
| D-012 | Treat broad format labels as families and score concrete patterns | Broad categories such as “explainer” are too stable to detect format shifts | Applied in audit |
| D-013 | Remove the date-window control from the proof of concept | The dataset and analysis snapshot are fixed; changing dates would imply recalculation support | Applied in audit |
| D-014 | Keep one small deterministic logic check | The signal rules are non-trivial, but a full test suite is unnecessary for the proof of concept | Approved |
| D-015 | Pivot the fixed cohort from X to LinkedIn and use one-time browser-assisted public-data collection | LinkedIn is more relevant to B2B launch and content strategy; a bounded cohort keeps collection manageable | Superseded by D-019 |
| D-016 | Use visible reactions captured at one collection snapshot for posts at least seven days old | Historical seven-day LinkedIn reactions cannot be reconstructed; the snapshot metric is obtainable and honest about its limits | Superseded by D-020 |
| D-017 | Collect up to 50 recent posts from each of 30 LinkedIn creators using Codex browser control | The larger fixed sample provides ordinary history and cross-creator adoption evidence without adding collection infrastructure to the product | Superseded by D-019 |
| D-018 | Implement the MVP through five gated stages: contract, dataset, analysis, interface, and final audit | Each stage freezes the artifact required by the next and prevents collection, logic, and UI concerns from being mixed | Approved 2026-09-21 |
| D-019 | Return the fixed 30-creator cohort and one-time Codex browser collection workflow to X | X exposes stronger public diffusion evidence and is easier to collect manually while retaining the B2B creator focus | Approved 2026-09-21 |
| D-020 | Use public view lift as the primary breakout measure; show repost-plus-quote amplification and amplification rate as spread evidence; retain likes and replies as context | This uses X's stronger public signals without creating a hidden blended score | Approved 2026-09-21 |

The earlier proposal for a CSV/JSON upload flow is superseded.

## 3. Product definition

### Product name

Viral Format Radar

### One-sentence definition

> An evidence-backed radar that surfaces emerging content formats and hooks,
> explains their observed spread, and shows which creators and posts support
> each signal.

### Primary user

A Sociall Capital content or launch strategist researching which content
directions may be worth testing.

The broader future audience could include startup, agency, and brand content
teams, but the proof of concept should optimize for the Sociall Capital use
case.

### Primary job-to-be-done

> When I am researching what content to create next, help me identify formats
> and hooks that gained momentum in a relevant creator cohort, so I can choose
> what to test based on evidence rather than isolated examples or intuition.

### Supporting jobs

The product should help the user:

1. See whether a pattern spread across distinct creators.
2. See whether early uses outperformed each creator's normal results.
3. Identify early and later adopters within the observed cohort.
4. Avoid overreacting to one unusually successful post.
5. Open representative source posts quickly.
6. Understand the limits of the evidence.

### Product promise

The product promises:

- Faster pattern research.
- Structured comparison across creators.
- Transparent evidence.
- Clear separation between emerging and validated signals.

It does not promise:

- Guaranteed viral performance.
- Live or complete platform coverage.
- Platform-wide trend origin.
- Causal influence.
- Automatic content creation.
- Automatic creator selection.

## 4. Proof-of-concept boundary

### Included

- X only.
- One fixed cohort of exactly 30 B2B technology/startup creators.
- One local seed dataset.
- One-time browser-assisted collection of publicly visible post data.
- Up to 50 contiguous recent original posts per creator.
- A fixed analysis date and observation window.
- Manual format and hook labels.
- Public view, like, reply, repost, and quote counts captured at the fixed
  collection snapshot.
- A minimum post age of seven days for performance comparison.
- Creator-relative post performance.
- Pattern adoption order and later-adopter evidence.
- Pattern lifecycle and evidence-quality labels.
- Radar screen.
- Pattern Detail screen.
- Source-post links and limitations.

### Explicitly excluded

- User-facing imports.
- In-product, scheduled, or recurring collection.
- Login-wall, CAPTCHA, rate-limit, or anti-bot bypasses.
- Multi-platform support.
- Automated pattern discovery.
- Machine-learning prediction.
- Blended virality scores.
- User-configurable thresholds.
- Authentication or team permissions.
- Notifications.
- Campaign briefs or campaign monitoring.
- Hook generation.
- Creator recommendations, outreach, contracting, or payments.
- Generic creator leaderboards.
- Production-grade data infrastructure.

## 5. Fixed demo dataset

### Dataset purpose

The dataset exists to demonstrate the analysis and product experience. It is
not intended to represent all of X.

Use:

- Exactly 30 public individual creators in the frozen cohort.
- A fixed B2B technology/startup cohort.
- Coverage from each pattern's first observed use through the earlier of its
  30-day episode end or `analysis_as_of_utc`; Emerging patterns may have open
  episodes.
- Up to 50 recent posts collected per creator; the analysis still uses only
  the 20 most recent eligible prior posts for each baseline.
- Ordinary posting history, not only successful posts.
- Real source-post URLs for evidence.
- Enough examples to demonstrate Emerging, Validated, and at least one Fading
  or Insufficient-evidence pattern.

Use real public posts for product evidence. Synthetic records may be used only
inside the calculation check and must never be presented as real creator data.

### Storage shape

The shipped application uses one local `data/demo-data.json` file containing
metadata, creators, codebook, thresholds, and labeled post records. Stage 2 may
retain separate roster and raw-collection files for resumability and source
review. A database and user-facing ingestion system are unnecessary.

#### Required dataset metadata

```text
analysis_as_of_utc
schema_version
platform
cohort_id
cohort_description
observed_from_utc
observed_to_utc
response_type
collection_completed_at_utc
minimum_post_age_hours
codebook_version
threshold_version
```

Approved defaults:

```text
platform = X
response_type = public_views_at_collection
minimum_post_age_hours = 168
baseline_history_cap = 20
provisional_baseline_minimum = 5
supported_baseline_minimum = 10
view_breakout_threshold = 1.5
pattern_episode_days = 30
recent_window_days = 7
fading_age_minimum_days = 14
minimum_validated_adopters = 4
minimum_later_adopters = 2
early_adoption_percentile_max = 0.25
minimum_pattern_metric_sample = 2
```

These are versioned MVP conventions, not universal truths.

#### Required creator fields

```text
creator_id
creator_name
creator_handle
profile_url
role_or_category
inclusion_reason
collection_status
posts_collected
collection_started_at_utc
collection_completed_at_utc
stop_reason
notes
```

The final cohort contains exactly 30 unique creators. Collection checkpoint
fields may change during Stage 2; identity and inclusion fields are frozen at
the end of Stage 1.

#### Required post fields

```text
post_id
creator_id
creator_handle
posted_at_raw
posted_at_utc
posted_at_precision
post_url
text_excerpt
post_type
format_pattern_id
format_pattern_name
format_family_id
hook_pattern_id
hook_pattern_name
views_at_collection
likes_at_collection
replies_at_collection
reposts_at_collection
quotes_at_collection
collected_at_utc
post_age_hours_at_collection
baseline_eligible
exclusion_reason
```

X post-media types use one frozen enum:

```text
text
image
video
poll
link
article
other
```

Reviewed posts that do not match a frozen pattern use the explicit
`FP-UNCLASSIFIED`, `FF-UNCLASSIFIED`, or `HP-UNCLASSIFIED` IDs. Pattern fields
may be null only for records not yet labeled or used solely as baseline
history. `exclusion_reason` is required for excluded raw records; it must be
null on every retained final post.

Optional context fields such as topic, follower count, or collection notes may
be retained, but they must not become hidden ranking inputs. Missing public
counts must not be inferred.

### Browser-assisted collection workflow

Collection will be completed through Codex browser control. It is a one-time
dataset-building task, not part of the shipped application.

1. Freeze the 30-creator roster before collection.
2. Visit each creator's public activity feed and collect up to 50 recent
   original posts within the common observation window.
3. Record only fields visible in the rendered interface: creator, URL,
   published time, excerpt, media type, views, likes, replies, reposts, and
   quotes when shown.
4. Record `collected_at_utc` for every post and calculate its age at collection.
5. Exclude posts younger than seven days from performance comparisons; they
   may still contribute to recent-adoption evidence.
6. Deduplicate by canonical post URL, review the exported records manually,
   apply the codebook, and freeze the resulting local JSON.

Do not build proxy rotation, CAPTCHA solving, stealth fingerprinting, private
endpoint calls, or credential harvesting. If the interface blocks collection,
stop that run and use manual entry for the remaining small sample.

### Data eligibility rules

- Candidate and baseline posts must use the same primary metric and collection
  method.
- Performance-classifiable posts must be at least 168 hours old when collected.
- Baseline posts must occur strictly before the candidate post.
- Use the most recent eligible posts, never the best-performing posts.
- Only posts marked `baseline_eligible` enter the baseline.
- A missing response is missing, not zero.
- A zero median baseline makes the ratio unclassifiable.
- A post with an unclassified format or hook may still be baseline-eligible.
- Analysis must use only information available on or before
  `analysis_as_of_utc`.

### Dataset quality warning

If the dataset contains only notable or high-performing posts, the
creator-relative analysis is invalid. The interface must not compensate for
biased collection with stronger language.

## 6. Pattern codebook

### Pattern dimensions

The codebook separates:

- **Format pattern:** the specific structure or delivery pattern being tracked.
- **Format family:** a broad grouping used for browsing, not scoring.
- **Hook pattern:** the opening claim, tension, or reason to keep reading.
- **Topic:** what the post discusses; context only.

This distinction matters because broad categories such as “explainer” or
“story” are usually too common and stable to reveal an emerging shift. The
Radar scores concrete patterns such as “live product teardown,” while
“comparison / teardown” is only its family.

### Format families

| ID | Family | Definition |
| --- | --- | --- |
| FF-01 | Explainer / breakdown | Teaches how or why something works |
| FF-02 | Product demo / workflow | Shows a product, tool, or workflow in use |
| FF-03 | Story / case study | Uses an event, build update, or result as the structure |
| FF-04 | Opinion / argument | Presents a thesis and supporting reasoning |
| FF-05 | List / framework | Organizes advice or observations into a reusable structure |
| FF-06 | Comparison / teardown | Compares alternatives or examines something critically |

The Stage 1 candidate set includes:

- Live product teardown.
- Before-and-after workflow demo.
- Step-by-step technical breakdown.
- Build-in-public milestone story.
- Myth-busting argument.
- Tool-stack list.
- Old-way versus new-way comparison.

Stage 1 must freeze 6–10 concrete format patterns before post collection. Stage
2 uses `unclassified` rather than inventing new labels during collection. If
the two-creator pilot reveals that the frozen codebook is structurally unusable,
pause Stage 2 and formally reopen Stage 1 before collecting the main cohort.

### Hook patterns

| ID | Pattern | Definition |
| --- | --- | --- |
| HP-01 | Contrarian claim | Challenges a common belief or expected approach |
| HP-02 | Specific result / proof | Opens with a concrete outcome, number, or artifact |
| HP-03 | Pain / problem | Starts from a recognizable problem or failure |
| HP-04 | Curiosity / open loop | Creates an unanswered question or delayed reveal |
| HP-05 | Personal lesson | Leads with an individual experience, mistake, or changed belief |
| HP-06 | Prediction / urgency | Frames the post around what may happen next or why timing matters |

### Labeling rules

- Assign one primary concrete format pattern per scored post.
- Assign one primary hook pattern when identifiable.
- Use `unclassified` rather than forcing an uncertain label.
- Store the format family separately from the concrete format pattern.
- Do not encode topic, creator identity, or performance in a pattern label.
- Do not create a separate pattern for every format–hook combination.
- Freeze the codebook before inspecting which labels produce the strongest
  results.
- Keep a short definition and positive/negative example for every concrete
  format pattern used in the dataset.

## 7. Signal model

The same pattern-level adoption logic applies to concrete format patterns and
hook patterns. Creator repeat evidence counts format patterns only, preventing
one post's format and hook from being counted as two independent creator
successes.

### 7.1 Creator-relative post traction

For candidate post `p`, use the creator's most recent eligible prior posts,
strictly before `p`, capped at 20:

```text
prior_count = count(eligible prior posts)
baseline = median(prior eligible public view counts)
view_lift = candidate public views / baseline
```

Classification:

```text
prior_count < 5       → not_classifiable
5 <= prior_count < 10 → provisional
prior_count >= 10     → supported
baseline = 0          → not_classifiable
supported and view_lift >= 1.5 → supported_breakout
```

Always show the candidate views, collection date, post age, baseline, prior
count, ratio, and evidence quality together. The ratio alone is not enough.

Calculate public spread evidence separately:

```text
amplification_count = reposts + quotes
amplification_rate = amplification_count / views
```

`amplification_count` is available only when repost and quote counts are both
available. `amplification_rate` additionally requires positive public views.
Likes and replies remain supporting context. None of these signals are blended
into one score.

### 7.2 Observed-cohort adoption

For each tracked pattern:

1. Find each creator's first observed post using the pattern.
2. Sort those first uses by timestamp.
3. Set `adoption_rank` to one plus the number of creators with an earlier
   timestamp, so equal timestamps receive the same rank.
4. Calculate normalized adoption position:

```text
adoption_percentile = (adoption_rank - 1) / (distinct_adopters - 1)
```

When there is only one adopter, the percentile is unavailable.

A creator is early within the observed cohort when:

```text
distinct_adopters >= 4
adoption_percentile <= 0.25
```

Creators tied at the qualifying boundary share early status.

### 7.3 Later-adopter evidence

For creator `c` and pattern `t`:

```text
later_adopters = distinct other creators whose first use of t occurs
                 after c's first use, within the 30-day episode,
                 and on or before analysis_as_of_utc
```

Later adoption shows subsequent spread in the observed cohort. It does not
show that creator `c` caused the spread.

### 7.4 Validated early-capture event

A creator-pattern event is validated when all conditions pass:

```text
distinct_adopters >= 4
creator is early within the observed cohort
creator's first-adoption post is a supported_breakout
later_adopters >= 2
```

Every component must remain visible in the interface. Do not collapse them
into a blended virality score.

### 7.5 Pattern-level performance

For each pattern, calculate creator-relative view lift only from classifiable
first-adoption posts:

```text
pattern_median_lift = median(classifiable first-adoption view_lifts)
pattern_lift_sample = count(classifiable first-adoption view_lifts)
pattern_median_amplification_rate = median(classifiable first-adoption
                                            amplification_rates)
pattern_amplification_sample = count(classifiable first-adoption
                                     amplification_rates)
```

Show either median on the Radar only when its sample is at least 2. Otherwise
show `—` and explain the limited sample on Pattern Detail.

### 7.6 Repeat use

A creator's first use determines adoption timing. Later posts using the same
pattern may contribute to a repeat-use count, but they do not improve adoption
rank or create additional validated captures for that creator-pattern pair.

### 7.7 Creator repeat evidence

For contextual creator evidence, count distinct validated **format** patterns:

```text
validated_format_count = count(distinct format patterns with a validated event)
```

Display the count and supporting patterns. Do not assign labels such as
“Promising experimenter” or “Trend scout,” and do not create a creator ranking
in the proof of concept.

## 8. Pattern lifecycle and evidence quality

Lifecycle state and evidence quality are separate fields.

### 8.1 Lifecycle state

Define:

```text
recent_adopters = distinct creators whose first use occurred during the
                  7 days ending at analysis_as_of_utc
pattern_age_days = analysis_as_of_utc - first_observed_at
```

Assign exactly one lifecycle state in this order:

#### Validated

At least one validated early-capture event exists for the pattern.

#### Emerging

```text
not Validated
distinct_adopters >= 2
recent_adopters >= 1
```

#### Fading

```text
not Validated
distinct_adopters >= 2
recent_adopters = 0
pattern_age_days >= 14
```

#### Insufficient evidence

Use when none of the preceding states applies. This includes one observed
adopter and patterns that are too young to interpret.

A Validated pattern remains Validated when recent activity slows. Show its
last-observed date rather than rewriting the historical validation result.
Fading is descriptive and does not mean a pattern cannot return.

### 8.2 Evidence quality

Assign evidence quality independently:

```text
Supported   → at least one first-adoption post has a supported baseline
Provisional → no supported baseline, but at least one has a provisional baseline
Limited     → no classifiable first-adoption baseline
```

A pattern may therefore be Emerging with Limited performance evidence. The
interface must show both labels rather than turning missing performance data
into a lifecycle conclusion. A recent adoption may count toward lifecycle
state before it reaches the minimum post age; its performance remains missing
until it is eligible for the fixed collection snapshot.

## 9. Information architecture

The proof of concept has two primary screens:

```text
Radar → Pattern Detail
```

There is no settings area, import flow, dataset manager, campaign workspace,
or standalone creator screen.

## 10. Radar screen

### Purpose

Answer:

> Which formats and hooks show momentum in this fixed analysis snapshot?

### Fixed context bar

Show:

- Platform: X.
- Cohort description and creator count.
- Observation window.
- Analysis-as-of date.
- Primary metric: public views at collection for posts at least seven days old.
- Spread evidence: repost-plus-quote amplification and amplification rate.
- Collection-completed date.
- Codebook version.

### Summary strip

Show only:

- Emerging pattern count.
- Validated pattern count.
- Fading pattern count.
- Tracked creator count.

### Pattern list

Each row or card shows:

- Concrete pattern name.
- Pattern type: format or hook.
- Format family when applicable.
- One-line description.
- Lifecycle state.
- Evidence quality.
- Distinct adopters / cohort size.
- Recent adopter count.
- Median creator-relative view lift and sample count, or `—`.
- Median amplification rate and sample count, or `—`.
- Validated early-capture count.
- Last-observed date.

Example:

> Live product teardown · Emerging · Supported  
> 5 of 30 creators · 3 recent adopters · 1.7× median view lift (n=4)

Each result includes a plain-language reason derived from visible facts.

### Default ordering

Use explicit lexicographic sorting, not a hidden score:

1. Emerging.
2. Validated.
3. Fading.
4. Insufficient evidence.
5. Recent adopter count, descending.
6. Distinct adopter count, descending.
7. Median view lift, descending, with unavailable values last.
8. Pattern name, alphabetical tie-break.

### Controls

Provide only:

- Lifecycle-state filter.
- Pattern-type filter.
- Sort by default, recency, or performance.

Do not include a date-window control. The proof of concept represents one fixed
analysis snapshot.

## 11. Pattern Detail screen

### Purpose

Answer:

> Is this pattern spreading, performing, and worth considering for a test?

### 11.1 Header

Show:

- Concrete pattern name.
- Pattern type and family.
- Plain-language definition.
- Lifecycle state.
- Evidence quality.
- First- and last-observed dates.
- Analysis-as-of date.

### 11.2 Signal explanation

Generate one sentence from visible facts. For example:

> Emerging because three creators first used this format in the last seven
> days; it has not yet met the later-adoption validation rule.

Avoid marketing language and causal claims.

### 11.3 Evidence metrics

Show:

- Distinct adopters / cohort size.
- Recent adopters.
- Early adopters.
- Later-adopter counts.
- Median creator-relative view lift and sample count.
- Median amplification rate and sample count.
- Supported breakout count.
- Validated early-capture count.
- Repeat-use count.

### 11.4 Adoption timeline

Show:

- First observed cohort use.
- Early adopters.
- Later adopters.
- Recent activity.

Use “first observed in this cohort,” never “originated by.” Provide a textual
event list in addition to any visual timeline.

### 11.5 Creator evidence

For each relevant creator, show:

- Creator name or X handle.
- First-use date.
- Adoption rank and percentile.
- Early-within-cohort status.
- Public views, reposts, and quotes on the first-adoption post; likes and
  replies as supporting context.
- Collection date and post age.
- Creator baseline and prior-history count.
- View lift and baseline quality.
- Amplification count and rate when available.
- Later-adopter count.
- Other validated format count, when nonzero.

Creators are supporting evidence. They are not ranked globally.

### 11.6 Representative posts

Show two or three posts with:

- Creator.
- Date.
- Short excerpt.
- Concrete format and hook labels.
- Public views, reposts, and quotes at collection; likes and replies as
  supporting context.
- Creator baseline.
- View lift.
- Amplification rate when available.
- Source link.

### 11.7 Limitations

Show:

- Cohort size.
- Usable performance sample.
- Baseline quality.
- Observation-window completeness.
- Left-censoring risk.
- Missing metrics.
- What the result does not establish.

## 12. Required interface states

The proof of concept must handle:

- Missing creator baseline.
- Provisional baseline.
- Zero baseline.
- Missing public view count.
- Missing repost or quote count.
- Post younger than seven days at collection.
- Unclassified content pattern.
- Too few pattern adopters.
- Young pattern with insufficient elapsed time.
- No patterns matching active filters.
- Broken or unavailable source link.

Do not display missing values as zero.

## 13. Accessibility and interaction requirements

- Do not use color as the only state indicator.
- Provide text labels for lifecycle and evidence quality.
- Ensure keyboard access to filters, rows, links, and navigation.
- Use semantic headings, tables, lists, and buttons.
- Maintain readable contrast and visible focus states.
- Give the adoption timeline a textual equivalent.
- Use descriptive source-link labels rather than repeated “View post” text.

## 14. Minimal technical design

### Architecture

- Keep the seed dataset inside the application.
- Import the local JSON directly.
- Run one deterministic analysis module when the application loads.
- Keep thresholds in one constants object.
- Pass derived results to presentational components.
- Do not duplicate signal logic inside UI components.

The dataset is small enough that a backend, database, cache, queue, worker, or
state-management framework is unnecessary.

### Suggested calculation units

```text
calculateBaseline(post, priorPosts)
calculateViewLift(post, baseline)
calculateAmplification(post)
calculatePatternAdoption(patternId, posts, analysisAsOf)
calculateValidatedCapture(event)
calculateCreatorRepeatEvidence(creatorId, events)
classifyPatternLifecycle(patternEvidence)
classifyEvidenceQuality(patternEvidence)
```

### Development-time data validation

Before rendering, fail clearly on:

- Duplicate post IDs.
- Missing creator IDs or timestamps.
- Unknown codebook IDs.
- Negative response counts.
- Performance-classifiable posts younger than the minimum age.
- Source posts dated after `analysis_as_of_utc`.

This validation is developer-facing. It is not an import product feature.

### Small runnable check

Add one deterministic fixture or assertion-based test covering:

- A supported 1.5× breakout.
- A pattern that becomes Validated after two later adopters.
- A recent two-adopter pattern that remains Emerging.
- A single successful post that does not create creator repeat evidence.

No testing framework or large fixture suite is required unless the existing
project already uses one.

## 15. Five-stage implementation sequence

Implementation follows one gated dependency chain:

```text
Product contract
      ↓
X dataset
      ↓
Analysis engine
      ↓
Radar interface
      ↓
QA and final packaging
```

### Stage 1 — Freeze product and data contract

Freeze the exact 30-creator roster, schemas, X codebook, thresholds,
analysis date, and common observation window. Create empty valid data artifacts
without collecting posts or writing application code.

Plan: [`stage-1-product-and-data-contract.md`](./stage-1-product-and-data-contract.md)

### Stage 2 — Collect and prepare the X dataset

Use Codex browser control to gather up to 50 contiguous recent original posts
per creator, retain raw evidence, normalize and label the records, manually
review them, and freeze the final local JSON dataset. Do not calculate Radar
results in this stage.

Plan: [`stage-2-x-dataset-collection.md`](./stage-2-x-dataset-collection.md)

### Stage 3 — Build and verify the analysis engine

Validate the frozen dataset and implement baselines, view lift, amplification,
adoption, later-adopter evidence, lifecycle, evidence quality, and repeat
evidence independently from the UI. Verify the rules with one small
deterministic fixture.

Plan: [`stage-3-analysis-engine.md`](./stage-3-analysis-engine.md)

### Stage 4 — Build the product interface

Build Radar and Pattern Detail using only the verified analysis output. Add the
approved filters, sorting, source evidence, limitation copy, edge states, and
accessibility behavior.

Plan: [`stage-4-product-interface.md`](./stage-4-product-interface.md)

### Stage 5 — Integrate, audit, and package

Trace all UI values to source records, audit calculations and claims, test edge
states and accessibility, remove unnecessary code, document setup and demo
steps, and freeze the review-ready proof of concept.

Plan: [`stage-5-integrate-audit-package.md`](./stage-5-integrate-audit-package.md)

Progress: [`implementation-progress.md`](./implementation-progress.md)

## 16. Acceptance criteria

The proof of concept is complete when:

- It opens directly to the fixed Radar snapshot.
- No login, import, or configuration is required.
- At least one pattern is Emerging.
- At least one pattern is Validated.
- At least one pattern is Fading or has Insufficient evidence.
- Lifecycle and evidence quality are both visible.
- Every pattern explains why it received its state.
- Every pattern opens a Pattern Detail view.
- Pattern Detail shows adoption timing, creator-relative performance, and
  representative source posts.
- Every ratio shows its numerator, baseline, and history count.
- Median view lift and amplification rate show their sample counts.
- Missing evidence is not displayed as zero.
- The UI uses “observed cohort” language consistently.
- No hidden blended score is used.
- The deterministic calculation check passes.
- A reviewer can understand the concept without a verbal walkthrough.

## 17. Known risks and mitigations

| Risk | Consequence | MVP mitigation |
| --- | --- | --- |
| Bounded selected cohort | Results may not generalize beyond the 30 creators | State the cohort and denominator everywhere |
| Biased post collection | Baselines and lifts become invalid | Include ordinary posting history and explicit exclusions |
| Broad labels | Stable categories masquerade as trends | Score concrete patterns; use broad labels only as families |
| Subjective labels | Adoption order may depend on annotation | Freeze definitions and keep examples with the codebook |
| Different post ages at collection | Older posts have had more time to gather views and engagement | Require a seven-day minimum, show post age, and describe the metric as snapshot traction rather than a fixed-horizon response |
| Fixed snapshot | The demo cannot claim live freshness | Show observation and analysis dates prominently |
| Public views and amplification used as traction | Counts may be incomplete or differently aged | Show the source counts, collection time, post age, and sample size; avoid structural-virality claims |
| Browser-assisted collection is blocked or challenged | Some creator records may be incomplete | Collect in resumable batches, use manual entry for affected records, and never bypass access controls |
| Later adoption | It may be mistaken for causal influence | Use “followed by later adoption,” never “caused” |
| Left-censored patterns | Apparent first adopters may not be first | Flag the limitation and withhold earliness claims when material |

## 18. Stage 1 contract-review checklist

Before Stage 2 begins, the Stage 1 review confirms these concrete contract
inputs:

- Exact 30-creator roster and canonical X profile URLs.
- Observation start, end, planned collection, and analysis-as-of timestamps.
- Final concrete format-pattern names, definitions, and examples.
- Final hook-pattern definitions and examples.
- Schema, codebook, and threshold version identifiers.
- Exact field types, nullability, enum values, and uniqueness rules.
- Empty valid creator, raw-post, and final-dataset JSON artifacts.

## 19. Frozen Stage 1 contract

Stage 1 freezes the following values for the X MVP. These values are the
authoritative contract for the data files and later implementation stages.

### 19.1 Versions and time boundaries

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
and `analysis_as_of_utc` are identical. `planned_collection_date_utc` is the
fixed collection snapshot; `collection_completed_at_utc` remains null until
Stage 2 actually finishes. Posts after `observed_to_utc` are not part of this
dataset.

Posts before `observed_from_utc` are not collected and cannot enter a creator
baseline. A candidate near the start boundary can therefore have an
insufficient baseline. Posts younger than 168 hours at collection may count
for first adoption and recent activity, but cannot be performance-eligible.
Views and engagement counts are snapshot values captured at collection, not
reconstructed historical seven-day values. Approximate displayed dates use the
displayed precision as a tie: the analysis never invents ordering inside the
same known day or hour.

### 19.2 Frozen thresholds and deterministic rules

```json
{
  "max_collected_posts_per_creator": 50,
  "baseline_history_cap": 20,
  "minimum_post_age_hours": 168,
  "provisional_baseline_minimum": 5,
  "supported_baseline_minimum": 10,
  "view_breakout_threshold": 1.5,
  "pattern_episode_days": 30,
  "recent_window_days": 7,
  "minimum_validated_adopters": 4,
  "minimum_later_adopters": 2,
  "early_adoption_percentile_max": 0.25,
  "fading_age_minimum_days": 14,
  "minimum_pattern_metric_sample": 2
}
```

For a candidate post, the baseline is the median of the creator's 20 most
recent earlier posts that are `baseline_eligible` and have a public view
count. Baseline quality is `supported` at 10–20 prior posts, `provisional` at
5–9, and `limited` below 5 or when the median is zero. `view_lift` is candidate
views divided by the positive median; it is null when either input is missing,
the baseline is zero, or the history is limited. A supported breakout requires
`view_lift >= 1.5`.

`amplification_count` is reposts plus quotes only when both counts are present.
`amplification_rate` is that count divided by positive views. Missing counts
stay null and never become zero.

For each concrete format or hook, the first use by each creator inside the
30-day episode is retained. Adoption rank is one plus the number of strictly
earlier first-use timestamps; ties share a rank. Adoption percentile is
`(rank - 1) / (distinct_adopters - 1)` when at least two creators adopted.
An early adopter requires at least four distinct adopters and a percentile at
or below `0.25`. Later adopters are distinct creators whose first use is later
than the candidate creator's first use and no later than the episode end or
`analysis_as_of_utc`, whichever comes first. A validated early-capture event
requires early status, a supported breakout, and at least two later adopters.

Lifecycle precedence is `Validated`, then `Emerging`, then `Fading`, then
`Insufficient Evidence`. `Emerging` means at least two distinct adopters and
at least one adopter in the seven-day recent window. `Fading` means at least
two adopters, no recent adopter, and pattern age of at least 14 days.
Evidence quality is independent: `Supported` means at least one first-use post
has a supported baseline, `Provisional` means none are supported but at least
one is provisional, and `Limited` means no first-use post has a classifiable
baseline. Repeat use counts later posts by the same creator and pattern;
repeat use does not change adoption rank or create a second capture event.

### 19.3 Frozen schemas and nullability

All IDs are stable strings. All UTC timestamps use RFC 3339 `Z` notation.
Counts are non-negative integers or null. Raw display labels are preserved
beside normalized values. Raw records contain source facts and collection
eligibility only; they contain no derived view lift, lifecycle, adoption, or
amplification metrics.

`data/x-creators.json` contains `metadata`, `schema`, and `creators`. Each
creator has `creator_id`, `creator_name`, `creator_handle`, `profile_url`,
`role_or_category`, `inclusion_reason`, `collection_status`,
`posts_collected`, `collection_started_at_utc`,
`collection_completed_at_utc`, `stop_reason`, and `notes`. The 30 identity
records and their profile URLs are frozen at Stage 1; checkpoint fields are
mutable during Stage 2. `collection_status` is one of `pending`,
`in_progress`, `complete`, `partial`, or `blocked`.

`data/x-posts.raw.json` contains `metadata`, `schema`, and `posts`. A raw post
has `post_id`, `creator_id`, `creator_handle`, `post_url`, `posted_at_raw`,
`posted_at_utc`, `posted_at_precision`, `collected_at_utc`,
`post_age_hours_at_collection`, `full_visible_text`, `post_type`,
`views_raw`, `views_at_collection`, `likes_raw`, `likes_at_collection`,
`replies_raw`, `replies_at_collection`, `reposts_raw`,
`reposts_at_collection`, `quotes_raw`, `quotes_at_collection`,
`baseline_eligible`, `exclusion_reason`, and `collection_notes`.
`posted_at_precision` is one of `exact_time`, `hour`, `day`, or `unknown`.
`post_type` is one of `text`, `image`, `video`, `poll`, `link`, `article`, or
`other`. Normalized timestamps and counts may be null when not safely
derivable; the raw labels remain required.

`data/demo-data.json` contains `metadata`, `schema`, `thresholds`,
`codebook`, `creators`, and `posts`. Final creators use the creator schema in
`data/x-creators.json`, and the two creator arrays must match exactly.
Final posts use `post_id`, `creator_id`, `creator_handle`, `posted_at_utc`,
`posted_at_raw`, `posted_at_precision`, `post_url`, `text_excerpt`, `post_type`, `format_pattern_id`,
`format_pattern_name`, `format_family_id`, `hook_pattern_id`,
`hook_pattern_name`, `topic`, `views_at_collection`, `likes_at_collection`,
`replies_at_collection`, `reposts_at_collection`, `quotes_at_collection`,
`collected_at_utc`, `post_age_hours_at_collection`, `baseline_eligible`, and
`exclusion_reason`. `posted_at_utc` is required in final posts; records without
a usable normalized timestamp remain raw-only. Pattern and topic fields may be
null for unlabelled baseline history, while reviewed unclassifiable posts use
the explicit unclassified IDs. `baseline_eligible=false` is allowed for
retained young or missing-view posts. `exclusion_reason` must be null on final
posts because excluded records remain raw-only.

The final post array contains retained original posts only, including young
posts that remain useful for adoption. Replies, pure reposts, automated items,
duplicates, and posts outside the observation window remain in raw evidence
only with an exclusion reason. Final post IDs and canonical URLs are unique;
every final post references one rostered creator; and no creator has more than
50 final posts. A baseline-eligible final post must have a usable public view
count and be at least 168 hours old. A final post's `creator_handle` must match
its referenced creator. Non-null format and hook IDs must exist in the frozen
codebook; stored names must match those IDs; and `format_family_id` must match
the referenced format pattern's family.

### 19.4 Frozen cohort and codebook

The frozen cohort is the 30 individual creators in `data/x-creators.json`.
They are a mixed B2B technology/startup sample covering founders, operators,
marketers, investors, and technical creators. They are evidence sources, not a
leaderboard. Stage 2 must confirm identity and usable activity through the
rendered public X UI before collection and may replace an inaccessible record
only before that creator's collection begins.

The six navigation-only format families are `FF-01` Explainer / breakdown,
`FF-02` Product demo / workflow, `FF-03` Story / case study,
`FF-04` Opinion / argument, `FF-05` List / framework, and `FF-06`
Comparison / teardown, plus `FF-UNCLASSIFIED`.

The seven scored format patterns are `FP-01` Live product teardown,
`FP-02` Before-and-after workflow demo, `FP-03` Step-by-step technical
breakdown, `FP-04` Build-in-public milestone story, `FP-05` Myth-busting
argument, `FP-06` Tool-stack list, and `FP-07` Old-way versus new-way
comparison, plus `FP-UNCLASSIFIED`. The six scored hook patterns are `HP-01`
Contrarian claim, `HP-02` Specific result / proof, `HP-03` Pain / problem,
`HP-04` Curiosity / open loop, `HP-05` Personal lesson, and `HP-06`
Prediction / urgency, plus `HP-UNCLASSIFIED`. Each codebook entry includes a
definition, inclusion and exclusion rules, and positive and negative examples
in `data/demo-data.json`. One primary format and at most one primary hook are
allowed per scored post. Uncertain labels use the unclassified entry.

The authoritative machine-readable artifacts are:

```text
data/x-creators.json
data/x-posts.raw.json
data/demo-data.json
```

## 20. Future extensions

Only after the proof of concept is useful:

- Scheduled or recurring collection.
- User-triggered dataset refresh.
- Live APIs or in-product scraping.
- Larger or multiple cohorts.
- Cross-platform comparison.
- Better annotation-agreement workflow.
- Time-ordered holdout evaluation.
- Launch-specific relevance filters.
- Campaign planning based on validated radar evidence.

None of these should influence the first build.

## 21. Audit corrections applied

This audit fixed the following inconsistencies in the previous draft:

- Removed duplicated planning and final-spec sections.
- Marked the fixed dataset as authoritative and removed stale import steps.
- Replaced the unrecoverable historical seven-day-like requirement with X
  public view, repost, quote, like, and reply counts captured at one fixed
  collection snapshot.
- Corrected the primary user to the Sociall Capital work-sample context.
- Changed “right now” language to fixed-snapshot language.
- Separated concrete patterns from broad format families.
- Applied the same adoption logic to format and hook patterns.
- Removed qualitative creator classifications and retained repeat evidence.
- Separated lifecycle state from evidence quality.
- Defined Fading and Insufficient evidence deterministically.
- Added `analysis_as_of_utc`, collection-snapshot metadata, and data eligibility
  rules.
- Defined pattern-level median view lift, amplification rate, and their minimum
  display samples.
- Removed the date-window filter from the fixed proof of concept.
- Added explicit accessibility and developer-facing validation requirements.

## 22. Approval state

The X product direction, exact 30-person roster, and repaired Stage 1 contract
are approved and frozen. The post-fix contract audit passes, Stage 1 is
complete, and Stage 2 is ready to begin.
