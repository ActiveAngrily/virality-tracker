# Creator Signal Map — Metric Taxonomy

## Purpose

This taxonomy separates measurements that answer different questions. It does
not use *virality*, *popularity*, *influence*, *traction*, and *early adoption*
as synonyms.

The evidence base is summarized in
[`01-research-landscape.md`](./01-research-landscape.md), and complete source
records are in [`02-source-library.md`](./02-source-library.md). Product choices
proposed for this prototype are labeled explicitly.

## Construct map

| Construct | Unit | Question answered | Minimum observable evidence | Not established by the metric |
| --- | --- | --- | --- | --- |
| Post performance | Post | How much response did this post receive? | One consistently measured response variable and observation horizon | Virality, influence, or novelty |
| Creator-relative performance | Post within creator | Did this post outperform this creator's recent norm? | Candidate post plus eligible prior posts | That the creator was early |
| Early adoption | Creator × pattern | How early did the creator first use the pattern within the observed cohort? | First-use timestamps for multiple creators | Causal influence or later success |
| Trend emergence | Pattern × time | Did use spread or accelerate across creators? | Repeated timestamped uses in a defined cohort | Who caused the increase |
| Format-level performance | Pattern | Did adoption breadth or creator-relative response differ for this format? | Multiple creators and posts with the same coded pattern | Platform-wide popularity |
| Creator consistency | Creator | Did the creator repeat validated early captures? | Multiple eligible pattern opportunities | Skill independent of the sampled cohort |
| Trend validation | Pattern after an early event | Did later independent adoption occur? | A future observation window | That the early creator caused later adoption |
| Ranking usefulness | Ranked creator list | Does the ordering surface creators who later repeat the behavior or whom reviewers judge useful? | Frozen ranking, later holdout, and/or blinded relevance judgments | General usefulness outside the evaluation setting |

Research on adoption timing treats position in a trend lifecycle as distinct
from later popularity [EA-01, EA-02]. Research on cascades shows that a large
count can arise from broadcast rather than peer-to-peer diffusion [DF-02].
Influence work likewise shows that followers, retweets, and mentions measure
different properties [IM-01]. These findings support the separation above;
they do not supply universal thresholds for this product.

## 1. Post-level performance metrics

Let \(y_p\) be one response count for post \(p\), measured at a fixed post age
\(H\). For the X prototype, the recommended default is **likes at seven days**
because it is usually visible and manually collectible. It is a response or
traction measure only. Reposts, replies, bookmarks, views, and likes must not be
summed or substituted silently.

| Candidate metric | Formula | Strength | Limitation in this prototype |
| --- | --- | --- | --- |
| Raw response | \(y_p\) | Direct and auditable | Dominated by audience size, exposure, and post age |
| Exposure-normalized rate | \(y_p / impressions_p\) | Uses an exposure denominator | Public impressions may be absent or inconsistent |
| Audience-normalized rate | \(y_p / followers_{c,p}\) | Reduces scale differences | Followers are not exposures; snapshot timing matters |
| Creator-relative ratio | \(R_p=y_p/B_p\) | Simple within-creator comparison | Unstable when \(B_p\) is zero or based on few posts |
| Log relative ratio | \(\log_2(y_p/B_p)\) | Symmetric fold-change interpretation | Still needs positive values and a reliable baseline |
| Historical percentile | Fraction of prior \(y\)'s below \(y_p\) | Distribution-free and robust to scale | Very coarse with five to twenty prior posts |
| Robust standardized score | \((y_p-\operatorname{median})/\operatorname{MAD}\) | Includes historical dispersion | Undefined when MAD is zero; noisy at small \(n\) |

**Research evidence:** popularity-prediction work models early response and
later outcomes, but does not make those outcomes measures of early adoption
[VP-01, VP-02, VP-04]. Structural-virality work requires diffusion trees, not
only a count [DF-02].

**Proposed product choice:** use the creator-relative ratio for the MVP and
display its raw numerator, baseline, metric type, observation horizon, and
history count. Do not label it a virality score.

## 2. Creator-relative performance

For candidate post \(p\) by creator \(c\), let \(H_{c,p}\) be the most recent
eligible posts by \(c\) strictly before \(p\), capped at 20. An eligible post
uses the same response type and fixed observation horizon.

\[
B_p=\operatorname{median}\{y_j:j\in H_{c,p}\},\qquad
R_p=\frac{y_p}{B_p}\quad\text{when }B_p>0.
\]

The median is resistant to a small number of unusually large prior posts, an
important property for skewed social response. It is not a full uncertainty
model and becomes coarse with very small samples.

### Proposed baseline evaluated

| Component | Assessment | MVP decision |
| --- | --- | --- |
| Up to 20 prior posts | A defensible recency/effort compromise, but not a literature-derived optimum. It can mix regimes if the creator changes audience, cadence, or format. | Keep; always use the most recent eligible posts and record the count. |
| At least 5 prior posts | Enough to compute a median, not enough for a strong claim. One observation can move the median materially and percentile resolution is poor. | At 5–9, show **provisional** only. Require at least 10 for a supported breakout event. |
| Median baseline | More robust than a mean to isolated high posts, but ignores dispersion and can be zero. | Keep for explainability. If the median is zero, return `not_classifiable`; do not add an undisclosed pseudocount. |
| 1.5× threshold | Clear and easy to audit, but no reviewed source establishes it as universal. It is sensitive to metric, platform, and creator scale. | Keep as a proposed heuristic; test 1.25×, 1.5×, and 2× in sensitivity analysis. |
| Show count and confidence | Necessary but a word alone can conceal why evidence is weak. | Show \(n_{prior}\), \(B_p\), \(y_p\), \(R_p\), and an evidence label. |

Alternatives include a historical percentile, a trimmed mean, a robust
dispersion score, or partial pooling across creators. The percentile has poor
resolution at \(n\le20\); trimming adds conventions while removing only a few
values; MAD frequently degenerates in low-count histories; and hierarchical
shrinkage adds modeling assumptions. They should be evaluated later, not added
to this prototype.

## 3. Early-adoption metrics

Let \(a_{c,t}\) be creator \(c\)'s first observed post using pattern \(t\) in a
predefined 30-day episode. Later posts by the same creator do not create new
adoption events.

### Candidate metrics

- **First-use timestamp:** auditable but incomparable across trends without a
  trend start or cohort.
- **Adoption order:** simple rank among creators, but rank 2 means something
  different with 5 adopters than with 50.
- **Adoption percentile:** normalizes rank by the number of observed adopters.
- **Lead time to emergence:** time between a creator's adoption and a defined
  population threshold; sensitive to the threshold and collection boundary.
- **Burst-state position:** places adoption before or during a detected burst;
  useful with dense streams but parameter-sensitive and data-hungry [BT-02].
- **Network early-adopter score:** uses graph structure or homophily, but needs
  a credible network and does not fit the manual dataset [EA-04].

**Proposed product choice:** show a tie-aware adoption percentile within the
fixed observed cohort. For the binary event gate, treat the first two observed
adopters within seven days as early candidates, then test later spread
separately. This avoids defining early status from the final adopter set. Call
it *observed-cohort earliness*, never platform-wide first adoption. Exact
formulas and gates are in
[`04-early-adoption-metrics.md`](./04-early-adoption-metrics.md).

## 4. Trend-emergence metrics

For pattern \(t\), define \(U_t(d)\) as the cumulative number of distinct
creators who have adopted by day \(d\) of the episode.

| Metric | Formula or rule | Use |
| --- | --- | --- |
| Adoption breadth | \(N_t=U_t(30)\) | Size of the observed adopter set |
| New-adopter velocity | \(U_t(d)-U_t(d-1)\) | Descriptive daily change |
| Early-to-late growth | \((U_t(30)+1)/(U_t(7)+1)\) | Descriptive spread after the first week; `+1` is explicit smoothing |
| Persistence | Number of weeks with at least one new adopter | Distinguishes one-day concentration from continued uptake |
| Burst score | Model-based state or change statistic | Dense-stream future method [BT-02, BT-04] |

**Proposed product choice:** show the cumulative adoption curve, \(N_t\), and
later-adopter count. Do not fit a burst or change-point model to the small
dataset.

## 5. Format-level metrics

The primary tracked pattern is a content format. Hooks may use the same
formulas as a secondary label; topics remain context.

For format \(t\):

- **Creator breadth:** \(N_t\), distinct adopting creators in 30 days.
- **Eligible-post coverage:** number and fraction of adoption posts with a
  usable seven-day response and creator baseline.
- **Median relative response:**
  \(M_t=\operatorname{median}\{\log_2 R_p\}\) over eligible first-adoption
  posts. This is descriptive and omitted when fewer than five posts qualify.
- **Breakout share:** fraction of eligible first-adoption posts with
  \(R_p\ge1.5\), accompanied by a Wilson interval rather than a bare rate.
- **Persistence:** number of calendar weeks containing a new adopter.

These measures describe breadth and associated response. They do not show that
the format caused performance.

## 6. Creator-consistency metrics

The unit is a distinct creator–pattern pair, not a post. Reposting the same
format many times cannot manufacture consistency.

Candidate metrics are:

- validated-capture count \(k_c\);
- eligible pattern-adoption count \(n_c\);
- capture rate \(\hat p_c=k_c/n_c\);
- Wilson 95% lower bound for \(\hat p_c\);
- distinct-pattern count \(D_c\);
- days between first and last validated capture \(S_c\).

**Proposed product choice:** do not rank a creator until \(n_c\ge3\),
\(k_c\ge2\), \(D_c\ge2\), and \(S_c\ge30\) days. Rank eligible creators by
the Wilson lower bound, then \(k_c\), then median earliness. This gate prevents
one successful post from winning the ranking. Full formulas are in
[`05-creator-consistency.md`](./05-creator-consistency.md).

## 7. Trend-validation metrics

Later validation must be measured after the candidate adoption; it cannot be
borrowed from the candidate post's own response.

For creator \(c\) and pattern \(t\):

- **Later-adopter count \(L_{c,t}\):** distinct other creators whose first use
  follows \(c\)'s use within the episode.
- **Later-adopter share \(V_{c,t}=L_{c,t}/(N_t-1)\):** normalizes the count by
  cohort breadth.
- **Persistence:** number of later weeks with new adopters.
- **External validation:** later appearance in a larger independent corpus;
  strongest in principle but not available for the MVP [BT-03].

**Proposed product choice:** require at least eight total cohort adopters and
three later adopters. These are auditable prototype thresholds, not a claim
that this amount of local adoption constitutes a platform trend.

## 8. Confidence and sample-size methods

Confidence has three separate components:

1. **Post baseline evidence:** \(n_{prior}\), the number of comparable earlier
   posts.
2. **Trend evidence:** \(N_t\) and \(L_{c,t}\), the observed cohort breadth and
   later adoption.
3. **Creator repeat evidence:** \(k_c/n_c\), diversity, temporal span, and a
   Wilson interval.

Wilson score intervals are preferred to Wald intervals for the binomial
capture rate because the Wald interval behaves poorly at small \(n\), whereas
score intervals have substantially better coverage in small samples [ST-02].
Intervals quantify sampling uncertainty under a binomial abstraction; they do
not correct selection bias, missing posts, correlated trends, or label error.

Bootstrap intervals for medians and ranking stability are reasonable with
larger datasets [ST-01], but resampling five to twenty correlated posts can
create false precision. The MVP should expose counts and run sensitivity checks
instead.

## 9. Evaluation metrics for an early-adopter ranking

Evaluation must freeze a ranking at time \(T\) and score behavior after \(T\).
A random split would leak future trend evidence into the past; globally
time-ordered evaluation is the appropriate direction for sequential data
[EV-02].

| Evaluation | Formula | Interpretation |
| --- | --- | --- |
| Precision@\(K\) | relevant creators in top \(K\) / \(K\) | How many surfaced creators repeat a validated capture in the holdout |
| Recall@\(K\) | relevant creators in top \(K\) / all relevant creators | Coverage, only when the creator universe is completely observed |
| nDCG@\(K\) | normalized discounted cumulative gain [EV-01] | Rewards placing creators with more future captures near the top |
| Top-\(K\) overlap | \(|A_K\cap B_K|/|A_K\cup B_K|\) | Sensitivity to thresholds or dropping one trend |
| Annotation agreement | raw agreement and Cohen's \(\kappa\) [AN-01] | Reliability of manual format/hook labels |

Compare the MVP ranking with random order, follower count, raw response,
posting volume, and the most recent single breakout. With a small dataset,
report the actual numerator/denominator and all creators, not only a percentage.

## Evidence and interpretation boundary

### Research evidence

- Adoption timing is relative to a population and trend lifecycle; it is not a
  later-success measure [EA-01, EA-02, EA-06].
- Large response does not establish structural virality [DF-02].
- Followers, retweets, and mentions are distinct influence proxies [IM-01].
- Score intervals outperform the simple Wald interval for small binomial
  samples [ST-02].
- Time-ordered evaluation avoids using future interactions in past rankings
  [EV-02].

### Product interpretation

The 30-day episode, first-two/7-day early gate, 1.5× breakout threshold,
minimum counts, and creator classification labels are proposed MVP conventions.
Research does not establish them as universal. They must remain visible and be
sensitivity-tested.

## Sources added for metric methods

- **[ST-01]** Bradley Efron. “Bootstrap Methods: Another Look at the
  Jackknife.” 1979. *The Annals of Statistics* 7(1), 1–26.
  [DOI](https://doi.org/10.1214/aos/1176344552).
- **[ST-02]** Alan Agresti and Brent A. Coull. “Approximate Is Better than
  ‘Exact’ for Interval Estimation of Binomial Proportions.” 1998. *The
  American Statistician* 52(2), 119–126.
  [DOI](https://doi.org/10.1080/00031305.1998.10480550).
- **[EV-01]** Kalervo Järvelin and Jaana Kekäläinen. “Cumulated Gain-Based
  Evaluation of IR Techniques.” 2002. *ACM Transactions on Information
  Systems* 20(4), 422–446.
  [DOI](https://doi.org/10.1145/582415.582418).
- **[EV-02]** Danil Gusak, Anna Volodkevich, Anton Klenitskiy, Alexey Vasilev,
  and Evgeny Frolov. “Time to Split: Exploring Data Splitting Strategies for
  Offline Evaluation of Sequential Recommenders.” 2025. *Proceedings of the
  Nineteenth ACM Conference on Recommender Systems*.
  [DOI](https://doi.org/10.1145/3705328.3748164).
- **[AN-01]** Jacob Cohen. “A Coefficient of Agreement for Nominal Scales.”
  1960. *Educational and Psychological Measurement* 20(1), 37–46.
  [DOI](https://doi.org/10.1177/001316446002000104).

All EA, VP, DF, IM, and BT identifiers resolve to full primary-source records in
[`02-source-library.md`](./02-source-library.md).
