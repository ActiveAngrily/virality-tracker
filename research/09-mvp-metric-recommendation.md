# Creator Signal Map — MVP Metric Recommendation

## Decision

Build a retrospective, cohort-relative analyzer with five visible metrics and
no blended “virality score.” The product should identify creators who:

1. adopt a manually coded format early within the observed creator cohort;
2. receive unusually strong response relative to their own recent history;
3. are followed by later independent adoption in the cohort; and
4. repeat that combination across distinct patterns and time.

The framework does not claim platform-wide origin, structural virality, or
causal influence. Research supports separating those constructs, while the
specific thresholds below are proposed product choices to test.

## Research basis

- Rahmtin Rotabi and Jon Kleinberg. “The Status Gradient of Trends in Social
  Media.” 2016. *Proceedings of the Tenth International AAAI Conference on Web
  and Social Media*, 319–328.
  [DOI](https://doi.org/10.1609/icwsm.v10i1.14725).
- Leihan Zhang, Jichang Zhao, and Ke Xu. “Who Creates Trends in Online Social
  Media: The Crowd or Opinion Leaders?” 2016. *Journal of Computer-Mediated
  Communication* 21(1), 1–16.
  [DOI](https://doi.org/10.1111/jcc4.12145).
- Justin Cheng, Lada Adamic, P. Alex Dow, Jon Kleinberg, and Jure Leskovec.
  “Can Cascades Be Predicted?” 2014. *Proceedings of the 23rd International
  Conference on World Wide Web*, 925–936.
  [DOI](https://doi.org/10.1145/2566486.2567997).
- Sharad Goel, Ashton Anderson, Jake Hofman, and Duncan J. Watts. “The
  Structural Virality of Online Diffusion.” 2016. *Management Science* 62(1),
  180–196. [DOI](https://doi.org/10.1287/mnsc.2015.2158).
- Meeyoung Cha, Hamed Haddadi, Fabricio Benevenuto, and Krishna Gummadi.
  “Measuring User Influence in Twitter: The Million Follower Fallacy.” 2010.
  *Proceedings of the International AAAI Conference on Web and Social Media*
  4(1), 10–17. [DOI](https://doi.org/10.1609/icwsm.v4i1.14033).
- Alan Agresti and Brent A. Coull. “Approximate Is Better than ‘Exact’ for
  Interval Estimation of Binomial Proportions.” 1998. *The American
  Statistician* 52(2), 119–126.
  [DOI](https://doi.org/10.1080/00031305.1998.10480550).

Full primary-source records and limitations are in
[`02-source-library.md`](./02-source-library.md); the additional evaluation and
annotation sources are listed in
[`03-metric-taxonomy.md`](./03-metric-taxonomy.md).

The remainder of this document is the required final decision format.

## 1. Recommended MVP metric stack

### Metric 1 — Creator-relative post traction

For the creator's first adoption post \(p\), compare one fixed-horizon response
\(y_p\) with the median of up to 20 most recent eligible prior posts:

\[
B_p=\operatorname{median}(y_j:j\in H_{c,p}),\qquad R_p=y_p/B_p.
\]

Default response: likes measured 168±12 hours after posting. This is traction,
not virality. Do not mix likes, reposts, replies, and views.

- fewer than 5 prior posts: not classifiable;
- 5–9: ratio may be shown as provisional;
- 10–20: supported baseline;
- breakout threshold: \(R_p\ge1.5\), provided \(B_p>0\).

The 20-post cap and median are retained for recency, robustness, and manual
feasibility. The 1.5× threshold is a product heuristic, not a research-derived
constant, so 1.25× and 2× must be reported as sensitivity variants.

### Metric 2 — Observed-cohort earliness

For each pattern \(t\), use each creator's first observed adoption in the
30-day episode beginning at the cohort's first observed use. Compute tie-aware
rank \(r_{c,t}\) among \(N_t\) distinct adopters and normalized position:

\[
q_{c,t}=\frac{r_{c,t}-1}{N_t-1},\qquad E_{c,t}=1-q_{c,t}.
\]

The continuous \(q\) is displayed after the episode. The binary early-candidate
gate is independent of final breadth:

\[
A_{c,t}=\mathbb{1}(r_{c,t}\le2\ \land\ a_{c,t}-s_t\le7\text{ days}).
\]

The quota of two is 25% of the eight-adopter supported-breadth target. Exact
timestamp ties at rank 2 receive the same status. Always say “early within the
observed cohort.”

### Metric 3 — Later adoption validation

Count distinct other creators whose first adoption follows the candidate
within the fixed episode:

\[
L_{c,t}=|\{d\ne c:a_{c,t}<a_{d,t}\le e_t\}|,
\qquad V_{c,t}=L_{c,t}/(N_t-1).
\]

Later validation requires \(N_t\ge8\) and \(L_{c,t}\ge3\). At \(5\le N_t<8\)
with three later adopters, the result is provisional. Report both the count and
share. This shows later spread in the sample; it does not establish that the
early creator caused it.

### Metric 4 — Validated early-capture event

Define:

\[
Z_{c,t}=\mathbb{1}(r_{c,t}\le2\ \land\ a_{c,t}-s_t\le7\text{ days})
\times\mathbb{1}(R_p\ge1.5)
\times\mathbb{1}(N_t\ge8\ \land\ L_{c,t}\ge3),
\]

subject to a supported post baseline (at least 10 prior posts), a completed
episode, and no censoring. Keep all three components visible so a zero is
explainable.

### Metric 5 — Confidence-adjusted creator consistency

Across distinct fully evaluable pattern adoptions:

\[
n_c=\text{eligible pattern adoptions},\quad
k_c=\sum_t Z_{c,t},\quad
\hat p_c=k_c/n_c.
\]

Calculate the 95% Wilson interval for \(\hat p_c\) and use its lower endpoint
\(W^-_c\) as the primary ordering value. A creator is not ranked until:

\[
n_c\ge3,\quad k_c\ge2,\quad
\text{distinct successful patterns}\ge2,\quad
\text{success span}\ge30\text{ days}.
\]

Sort by \(W^-_c\), then \(k_c\), then median \(E\), all descending; use
`creator_id` ascending as the deterministic final tie-break. This makes
repeatability and uncertainty primary and prevents one unusually successful
post from dominating.

Interpretation labels:

- **One observed signal:** \(k=1\); watchlist only.
- **Emerging Trend scout:** \(n\ge3,k\ge2\), at least 2 patterns, span at least
  30 days.
- **Consistent Trend scout:** \(n\ge5,k\ge3\), at least 3 patterns, span at
  least 60 days.
- **Reliable performer:** at least two creator-relative breakouts, but none
  occurs in the early cohort phase.

## 2. Formula glossary

| Symbol | Exact definition |
| --- | --- |
| \(y_p\) | The single frozen response count for post \(p\), default seven-day likes |
| \(H_{c,p}\) | Up to 20 most recent eligible posts by creator \(c\), strictly before \(p\) |
| \(n_{prior,p}\) | \(|H_{c,p}|\) |
| \(B_p\) | Ordinary sample median \(y\) over \(H_{c,p}\); average the two middle values when \(n\) is even |
| \(R_p\) | \(y_p/B_p\), defined only when \(B_p>0\) |
| \(s_t\) | First observed cohort use of pattern \(t\) |
| \(e_t\) | \(s_t+30\) days |
| \(a_{c,t}\) | Creator \(c\)'s first observed use of \(t\) in \([s_t,e_t]\) |
| \(N_t\) | Distinct creators with a defined \(a_{c,t}\) |
| \(r_{c,t}\) | Midrank of \(a_{c,t}\): \(1+\sum_{d\ne c}I(a_d<a_c)+\tfrac12\sum_{d\ne c}I(a_d=a_c)\) |
| \(q_{c,t}\) | Normalized adoption position \((r_{c,t}-1)/(N_t-1)\) |
| \(E_{c,t}\) | Earliness display score \(1-q_{c,t}\) |
| \(A_{c,t}\) | Early candidate: midrank at most 2 and adoption no more than 7 days after \(s_t\) |
| \(L_{c,t}\) | Distinct later adopters before \(e_t\) |
| \(V_{c,t}\) | Later-adopter share \(L_{c,t}/(N_t-1)\) |
| \(Z_{c,t}\) | 1 only when supported earliness, breakout, and later-validation gates all pass |
| \(n_c\) | Distinct fully evaluable pattern adoptions by creator \(c\) |
| \(k_c\) | \(\sum_t Z_{c,t}\) |
| \(\hat p_c\) | Observed capture rate \(k_c/n_c\) |
| \(D_c\) | Distinct patterns with \(Z=1\) |
| \(S_c\) | Days from first to last \(Z=1\) event |

For \(z=1.96\), the Wilson interval is:

\[
center=\frac{\hat p+z^2/(2n)}{1+z^2/n},
\]

\[
half=\frac{z}{1+z^2/n}
\sqrt{\frac{\hat p(1-\hat p)}{n}+\frac{z^2}{4n^2}},
\]

\[
[W^-,W^+]=[\max(0,center-half),\min(1,center+half)].
\]

Agresti and Coull report substantially better small-sample coverage for score-
based intervals than for the simple Wald interval [primary
source](https://doi.org/10.1080/00031305.1998.10480550). The interval does not
correct cohort selection or missing data.

## 3. Minimum dataset schema

The minimum implementation uses three CSV files.

### Creator fields

`creator_id`, `cohort_id`, `observed_from_utc`, `observed_to_utc`.

Follower count is optional and descriptive; if stored, also store its
observation timestamp.

### Post fields

`post_id`, `creator_id`, `posted_at_utc`, `post_url`,
`primary_response_type`, `primary_response_value`,
`response_observed_at_utc`, `response_horizon_hours`, `baseline_eligible`,
`exclusion_reason`.

Normal posting history is required. A dataset containing only selected
high-performing posts cannot produce a creator baseline.

### Pattern-label fields

`post_id`, `pattern_id`, `pattern_name`, `pattern_type`, `pattern_family`,
`codebook_version`, `coder_id`, `coded_at_utc`, `adjudication_status`,
`label_notes`.

At least `format` and `hook` must be distinguishable; format is primary and
topic is contextual. One row per post–pattern pair permits multiple labels.

### Run metadata

Store platform, cohort roster, collection interval, response type/horizon,
episode length, thresholds, codebook version, analysis timestamp, and a metric
specification version. Exact eligibility and missing-state rules are in
[`06-data-and-evaluation-requirements.md`](./06-data-and-evaluation-requirements.md).

## 4. Example creator calculation

### One event

Ten eligible prior seven-day-like counts are:

`80, 90, 100, 110, 120, 130, 140, 150, 160, 170`.

The median baseline is 125. The adoption post has 200 likes:

\[
R=200/125=1.60,
\]

so it clears the supported 1.5× breakout rule.

Eight creators adopt the pattern during the episode. This creator is second,
three days after the first observed use:

\[
q=(2-1)/(8-1)=0.143,\qquad E=0.857,\qquad A=1.
\]

Six creators adopt later:

\[
L=6,\qquad V=6/7=0.857.
\]

All gates pass, so \(Z=1\). This is one supported event, not a creator-level
Trend scout classification.

### Repeated creator record

Across five distinct fully evaluable pattern adoptions, suppose the creator has
three supported events across three patterns spanning 75 days:

\[
n=5,\quad k=3,\quad \hat p=0.60,
\]

with Wilson 95% interval approximately:

\[
[0.231,0.882].
\]

The creator clears the `Consistent Trend scout` rule. The displayed record is
still `3/5, 95% Wilson CI 0.231–0.882, 3 patterns, 75 days`, not a claim of a
precisely known 60% talent.

## 5. Confidence rules

### Event evidence

| State | Exact condition |
| --- | --- |
| Insufficient | fewer than 5 prior posts, zero median, fewer than 5 adopters, missing fixed-horizon response, incomplete episode, disputed label, or left-censoring |
| Provisional | 5–9 prior posts or 5–7 adopters, with otherwise positive timing, response, and later-validation evidence |
| Supported within cohort | at least 10 prior posts, rank at most 2 within 7 days, at least 8 adopters, \(R\ge1.5\), and at least 3 later adopters |

### Creator evidence

- Show \(k/n\), Wilson interval, pattern count, temporal span, missing count,
  and data coverage.
- One event is always unranked.
- Positive creator labels require the repeat/diversity/time gates in section 1.
- If more than half of labeled adoptions lack evaluable evidence, assign
  `Insufficient history` regardless of observed successes.
- Never show `high confidence`; `Supported within cohort` is the strongest MVP
  wording.

### Manual-label confidence

Double-code at least 20% of labeled posts or 50 posts, whichever is larger
within the available dataset; double-code all when the dataset has fewer than
50. Report raw agreement and Cohen's kappa for nominal presence/absence labels
[Cohen, 1960, *Educational and Psychological Measurement*,
DOI](https://doi.org/10.1177/001316446002000104). Preserve and adjudicate
disagreements before scoring.

### Missing data

Do not convert missing values to zero and do not impute response. Return named
states: `missing_response`, `ineligible_horizon`, `insufficient_baseline`,
`zero_baseline`, `insufficient_trend_breadth`, `pending_validation`,
`left_censored`, or `label_disputed`. Selective collection of successful posts
invalidates the analysis.

### Ranking evaluation

Use one global time cutoff \(T\). Rank creators only from episodes completed
before \(T\), then count supported validated captures in the next 60 days after
their episodes close. A creator is relevant when they record at least one such
future capture.

Primary metric:

\[
Precision@5=\frac{\text{relevant creators in the top five}}{5},
\]

or use the full ranked list as the denominator when fewer than five creators
clear the gate. Always report the count, such as `3/5`.

Secondary metric: nDCG@5 with future capture count capped at 3 as graded
relevance, using the formula in
[`06-data-and-evaluation-requirements.md`](./06-data-and-evaluation-requirements.md).
Compare with random order, follower count, raw median seven-day likes, posting
volume, and the latest single breakout. Also report top-five Jaccard overlap
under threshold variants and leave-one-pattern-out runs. A time-ordered split
avoids future evidence leaking into a past ranking [Gusak et al., 2025,
RecSys, DOI](https://doi.org/10.1145/3705328.3748164); nDCG provides a graded
top-weighted ranking measure [Järvelin and Kekäläinen, 2002, *ACM TOIS*,
DOI](https://doi.org/10.1145/582415.582418).

## 6. Known limitations

- “Early” means early among the fixed observed creators, not first on X.
- Manually chosen creators and patterns create selection bias.
- First observed use may still be left-censored or mislabeled.
- Likes measure response, not impressions, conversion, influence, or virality.
- A creator-relative ratio reduces audience-size bias but does not remove feed
  exposure, paid promotion, topic, or timing effects.
- The median of 10–20 posts remains uncertain and may lag a rapidly changing
  creator baseline.
- The 1.5×, first-two/7-day, 30-day, eight-total-adopter, and
  three-later-adopter cutoffs are prototype conventions requiring sensitivity
  checks.
- Pattern adoptions are correlated, so the Wilson interval is an approximate
  evidence summary rather than a complete sampling model.
- Later adoption is validation of broader uptake, not proof of causation.
- A creator who adopts few patterns can have a selective denominator; always
  show \(n\).
- Platform and cohort changes can make rankings non-stationary.

These limits follow the research distinction between adoption timing and
outcome [Rotabi and Kleinberg, 2016,
ICWSM](https://doi.org/10.1609/icwsm.v10i1.14725), between popularity and
structural virality [Goel et al., 2016, *Management
Science*](https://doi.org/10.1287/mnsc.2015.2158), and between follower,
retweet, and mention measures [Cha et al., 2010,
ICWSM](https://doi.org/10.1609/icwsm.v4i1.14033).

## 7. Deferred future metrics

Defer until the corresponding data and evaluation scale exist:

- burst or change-point detection for automatic emergence;
- Hawkes or other temporal point-process models;
- network centrality and graph early-adopter scores;
- structural virality and cascade depth;
- causal influence or exposure-adjusted diffusion;
- automated visual/audio/hook embeddings and clustering;
- impression-normalized engagement and audience-quality metrics;
- hierarchical or empirical-Bayes shrinkage across creators;
- cross-platform propagation;
- live APIs, continuous scraping, and real-time alerts;
- a learned weighted ranking model.

Kleinberg's burst model is appropriate for dense event streams, not assumed for
this sparse table [2002, KDD,
DOI](https://doi.org/10.1145/775047.775061). Network and cascade methods require
edges or parent links that the MVP does not have [Sziklai and Lengyel, 2023,
*Social Network Analysis and Mining*,
DOI](https://doi.org/10.1007/s13278-022-01012-5).

## 8. Why this framework answers the product question

The question is not “who had the biggest post?” It is “which creators are
capturing trends at their early stages?” The recommended stack tests that
sentence directly:

- \(A\), with \(q\) as context, establishes that the creator used the pattern
  in the small initial seed group within a named comparison cohort;
- \(R\) checks whether the creator's first use produced unusual traction for
  that creator, without rewarding raw audience size alone;
- \(L\) checks whether broader adoption happened later;
- \(Z\) requires timing, response, and later validation to agree;
- \(k/n\), the Wilson lower bound, pattern diversity, and temporal span require
  the behavior to repeat before a creator enters the ranking.

The result distinguishes an unusually successful post, early adoption, repeated
early adoption, and later-validated early adoption with formulas that another
person can reproduce from the listed fields. It is small enough for manual
collection and honest about what the sample cannot prove.
