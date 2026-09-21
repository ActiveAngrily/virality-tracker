# Data and Evaluation Requirements

## Minimal study design

Use one fixed comparison cohort on X and collect all eligible posts, not only
successful or trend-labeled examples. The study needs:

- a cohort roster and observation boundaries;
- all posts needed for candidate events and creator baselines;
- one fixed-horizon response metric;
- a versioned pattern codebook;
- two-person quality checks on a subset of labels;
- 30-day pattern episodes allowed to finish before scoring;
- a later, globally time-ordered holdout for evaluation.

The dataset supports retrospective observed-cohort claims. It cannot establish
platform-wide first use, feed exposure, diffusion paths, or causal influence.

## Minimum dataset schema

Three small CSV tables are sufficient. A database is unnecessary for the
prototype.

### `creators.csv`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `creator_id` | string | yes | Stable pseudonymous or platform identifier |
| `cohort_id` | string | yes | Fixed comparison cohort |
| `observed_from_utc` | timestamp | yes | Start of complete collection for this creator |
| `observed_to_utc` | timestamp | yes | End of complete collection for this creator |
| `account_url` | string | optional | Audit link; avoid if identifiers must be minimized |
| `followers_observed` | integer | optional | Descriptive only |
| `followers_observed_at_utc` | timestamp | required with followers | Prevents timeless follower snapshots |

### `posts.csv`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `post_id` | string | yes | Unique within platform |
| `creator_id` | string | yes | Must resolve to `creators.csv` |
| `posted_at_utc` | timestamp | yes | UTC; preserve source precision |
| `post_url` | string | recommended | Audit trail |
| `primary_response_type` | enum | yes | One frozen choice per analysis run, default `likes` |
| `primary_response_value` | nonnegative integer | yes for eligible outcomes | Never combine likes, replies, reposts, and views |
| `response_observed_at_utc` | timestamp | yes with response | Needed to verify post age |
| `response_horizon_hours` | number | yes with response | `observed_at - posted_at` |
| `baseline_eligible` | boolean | yes | Same metric and horizon; ordinary history included |
| `exclusion_reason` | string | required when excluded | Controlled reason, not free deletion |

### `pattern_labels.csv`

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `post_id` | string | yes | Resolves to `posts.csv` |
| `pattern_id` | string | nullable | Null means no tracked pattern |
| `pattern_name` | string | required with ID | Human-readable versioned codebook label |
| `pattern_type` | enum | required with ID | `format`, `hook`, or `topic`; format is primary |
| `pattern_family` | string | optional | Used only for descriptive family breadth |
| `codebook_version` | string | yes | Locks label meaning |
| `coder_id` | string | yes | Supports audit and agreement checks |
| `coded_at_utc` | timestamp | yes | Label provenance |
| `adjudication_status` | enum | yes | `single`, `agreed`, `adjudicated` |
| `label_notes` | string | optional | Brief evidence for ambiguous cases |

If a post may have multiple patterns, store one row per post–pattern pair. All
formulas use the creator's first post for each `pattern_id`.

## Analysis constants

The run must store these values in a small manifest or result header:

| Constant | MVP value |
| --- | --- |
| Platform | X |
| Response type | Likes |
| Response horizon | 168 hours |
| Horizon tolerance | ±12 hours |
| Prior history cap | 20 posts |
| Provisional history minimum | 5 posts |
| Supported history minimum | 10 posts |
| Breakout threshold | 1.5× creator median |
| Pattern episode length | 30 days |
| Early seed window | First two observed adopters within 7 days of first observed use |
| Provisional pattern breadth | 5 distinct creators |
| Supported pattern breadth | 8 distinct creators |
| Later-validation minimum | 3 distinct later creators |
| Creator ranking gate | \(n\ge3,k\ge2,D\ge2,S\ge30\) days |
| Wilson interval | 95%, \(z=1.96\) |

These are versioned product parameters, not discovered truths. A run must not
change them after inspecting the resulting winners.

## Eligibility and quality rules

### Post response

- The response type is identical across the candidate and its prior baseline.
- Response age is 156–180 hours for a 168±12-hour protocol.
- The post is not an advertisement or pinned repost if those are excluded by
  the codebook; exclusions are applied consistently to candidates and history.
- Counts are nonnegative and source links or screenshots are retained where
  collection policy permits.

### Creator baseline

- Prior posts occur strictly before the candidate timestamp.
- Use the most recent eligible posts, never the best-performing posts.
- At least five are required to display a ratio and ten for a supported event.
- A zero median makes the ratio not classifiable.

### Pattern episode

- Cohort membership is frozen before computing ranks.
- Collection covers the whole 30-day episode for every included creator.
- The pattern is not known to predate the collection boundary; otherwise mark
  it left-censored.
- An early-candidate flag uses only adoption order and the seven-day seed
  window. At least five distinct adopters are required before a provisional
  capture is displayed; at least eight are required for supported later
  validation.

### Manual labels

- The codebook defines positive, negative, and borderline examples for each
  format or hook.
- A second coder independently labels at least 20% of labeled posts or 50
  posts, whichever is larger within the available dataset; if the dataset has
  fewer than 50 posts, double-code all of it.
- Report raw agreement and Cohen's \(\kappa\) for nominal pattern-presence
  decisions. Kappa adjusts observed agreement for chance agreement [AN-01],
  but its value remains sensitive to label prevalence.
- Resolve disagreements before production scoring while preserving original
  coder rows.

No universal kappa cutoff is imposed. Low agreement is a codebook problem to
inspect, not a number to conceal with adjudication.

## Missing and insufficient data

Use explicit states rather than zeros.

| Condition | Stored/returned state | Effect |
| --- | --- | --- |
| Missing response | `missing_response` | Exclude from baseline and event performance; do not impute |
| Wrong response age | `ineligible_horizon` | Exclude from direct comparison |
| Fewer than 5 prior posts | `insufficient_baseline` | No ratio or breakout claim |
| 5–9 prior posts | `provisional_baseline` | Ratio displayed; no supported capture event |
| Baseline median 0 | `zero_baseline` | No ratio threshold decision |
| Fewer than 5 adopters | `insufficient_trend_breadth` | Early-candidate timing may be shown, but no capture claim |
| 5–7 adopters | `provisional_trend_breadth` | Capture evidence may be shown only as provisional |
| Episode not closed | `pending_validation` | No later-validation or final event label |
| Collection starts late | `left_censored` | No earliness claim |
| Label unresolved | `label_disputed` | Exclude until adjudicated |

Report completeness at creator and dataset levels:

\[
coverage=\frac{\text{fully evaluable creator-pattern pairs}}
{\text{all labeled creator-pattern pairs}}.
\]

If response missingness appears related to performance—for example, only viral
posts were saved—the creator-relative and consistency analyses are invalid,
not merely lower confidence.

## Reproducible processing order

1. Validate IDs, timestamps, response horizons, and cohort boundaries.
2. Freeze analysis constants and codebook version.
3. Resolve pattern labels and compute agreement on the independent subset.
4. Derive first adoption \(a_{c,t}\) for each creator–pattern pair.
5. Create 30-day episodes and mark left-censored or incomplete patterns.
6. Compute prior histories using only posts before each candidate.
7. Compute \(B\), \(R\), \(r\), \(q\), \(E\), \(A\), \(L\), \(V\),
   \(G\), and \(Z\).
8. Aggregate \(n\), \(k\), Wilson interval, diversity, and temporal span.
9. Apply the creator gate and deterministic sorting rule.
10. Export every intermediate field used in each displayed result.

Another person should be able to reproduce a row without inspecting application
code.

## Evaluation design

### 1. Freeze a development period

Use the earliest completed trend episodes to check data quality and choose
parameters. Record every choice and do not tune again on the holdout.

### 2. Use a global time cutoff

At cutoff \(T\):

- rank creators using only episodes that ended before \(T\);
- exclude any response or later-adoption data unavailable at \(T\);
- observe later completed episodes in a fixed holdout, recommended 60 days;
- define each creator's future relevance as the number of supported validated
  captures in that holdout.

Time-ordered evaluation prevents future interactions from leaking into a past
ranking, a known problem in offline sequential evaluation [EV-02]. With very
little data, perform a single honest cutoff rather than many overlapping folds
that reuse the same events.

### 3. Ranking metrics

Let \(g_i\) be the number of future supported captures, capped at 3, for the
creator at rank \(i\).

**Precision@K** uses binary relevance \(rel_i=\mathbb{1}(g_i\ge1)\):

\[
P@K=\frac{1}{K}\sum_{i=1}^{K}rel_i.
\]

Always report the numerator, for example `3/5`, not only `60%`.

**DCG@K** and **nDCG@K** use graded relevance:

\[
DCG@K=\sum_{i=1}^{K}\frac{2^{g_i}-1}{\log_2(i+1)},\qquad
nDCG@K=\frac{DCG@K}{IDCG@K}.
\]

If no creator is relevant, nDCG is undefined and the run should say so.
Cumulated-gain evaluation was introduced to reward graded relevance near the
top of a ranked list [EV-01].

For a small creator cohort, use \(K=5\) or the full list if fewer than five
creators clear the gate.

### 4. Baselines

The metric framework is useful only if it improves on simple alternatives.
Evaluate the same holdout for:

1. random ordering, repeated with all random seeds recorded;
2. follower count;
3. raw median seven-day likes;
4. posting volume;
5. the most recent single 1.5× breakout;
6. unadjusted capture rate \(k/n\).

The primary comparison is Precision@5. nDCG@5 is secondary. Do not declare a
winner from a tiny difference involving one creator.

### 5. Stability and falsification

Run the documented threshold grid from
[`04-early-adoption-metrics.md`](./04-early-adoption-metrics.md) and report:

\[
Jaccard@K=\frac{|TopK_{base}\cap TopK_{variant}|}
{|TopK_{base}\cup TopK_{variant}|}.
\]

Also remove each trend once and recalculate the ranking. Report the maximum
rank change. The framework is not useful if:

- it does not beat the single-breakout or posting-volume baseline in the
  holdout;
- top creators disappear under adjacent reasonable thresholds;
- manually coded pattern agreement is poor and cannot be resolved by a clearer
  codebook;
- most positive events depend on left-censored patterns or missing outcomes;
- the ranking merely reproduces follower count.

### 6. Human usefulness check

Give at least two target-like reviewers creator evidence cards in randomized
order without the model rank. Ask each to grade:

- 0: insufficient or not useful;
- 1: worth monitoring;
- 2: credible candidate for deeper review.

Report reviewer agreement, grade distributions, and whether the top-five
ranking concentrates grade-2 creators. This evaluates decision usefulness, not
the truth of causal influence.

## Confidence reporting

Each event card displays:

- `prior_posts = n_prior`;
- `candidate_response / baseline = y / B`;
- `adoption_rank / adopters = r / N` and \(q\);
- `later_adopters = L` and \(V\);
- missingness and censoring flags.

Each creator card displays:

- `validated_captures / eligible_adoptions = k / n`;
- Wilson 95% interval;
- distinct patterns;
- temporal span;
- missing pairs and dataset coverage.

Use three display states:

- **Insufficient:** a required gate fails.
- **Provisional:** an event uses 5–9 prior posts or 5–7 adopters, or a creator
  has only one supported event.
- **Supported within cohort:** event is among the first two adopters within the
  seven-day seed window and has at least 10 prior posts, 8 total adopters, and
  3 later adopters; creator also clears the repeat/diversity/time gate.

Avoid `high confidence`: a small manually selected cohort cannot justify it.

## Deferred data and evaluation work

- impression-normalized response and feed exposure;
- full reshare trees and structural virality;
- follower or interaction graphs;
- automated multimodal pattern detection;
- burst or point-process models;
- causal influence estimation;
- hierarchical creator models;
- platform-wide or cross-platform comparison;
- formal power analysis or significance claims before a target effect and
  sampling design are specified.

## Primary sources

- Jacob Cohen. “A Coefficient of Agreement for Nominal Scales.” 1960.
  *Educational and Psychological Measurement* 20(1), 37–46.
  [DOI](https://doi.org/10.1177/001316446002000104).
- Kalervo Järvelin and Jaana Kekäläinen. “Cumulated Gain-Based Evaluation of
  IR Techniques.” 2002. *ACM Transactions on Information Systems* 20(4),
  422–446. [DOI](https://doi.org/10.1145/582415.582418).
- Danil Gusak, Anna Volodkevich, Anton Klenitskiy, Alexey Vasilev, and Evgeny
  Frolov. “Time to Split: Exploring Data Splitting Strategies for Offline
  Evaluation of Sequential Recommenders.” 2025. *Proceedings of the Nineteenth
  ACM Conference on Recommender Systems*.
  [DOI](https://doi.org/10.1145/3705328.3748164).
- Alan Agresti and Brent A. Coull. “Approximate Is Better than ‘Exact’ for
  Interval Estimation of Binomial Proportions.” 1998. *The American
  Statistician* 52(2), 119–126.
  [DOI](https://doi.org/10.1080/00031305.1998.10480550).
