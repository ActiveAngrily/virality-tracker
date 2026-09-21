# Creator Signal Map — Research Index

## Product question

> Which creators are capturing trends at their early stages?

For this prototype, the answer must distinguish:

1. one unusually successful post;
2. early use of a format or hook;
3. repeated early use across distinct patterns and time;
4. early use that is later validated by broader adoption.

The research supports a small retrospective analyzer, not a platform-wide
virality or causal-influence system.

## Research files

| File | Purpose |
| --- | --- |
| [`01-research-landscape.md`](./01-research-landscape.md) | Research areas, construct boundaries, data needs, and small-dataset limits |
| [`02-source-library.md`](./02-source-library.md) | Primary papers and official dataset/repository records |
| [`03-metric-taxonomy.md`](./03-metric-taxonomy.md) | Post, creator, adoption, emergence, format, consistency, validation, confidence, and evaluation metrics |
| [`04-early-adoption-metrics.md`](./04-early-adoption-metrics.md) | Exact event-level timing, traction, validation, and missing-data rules |
| [`05-creator-consistency.md`](./05-creator-consistency.md) | Repeat aggregation, Wilson interval, ranking gate, and one-off protection |
| [`06-data-and-evaluation-requirements.md`](./06-data-and-evaluation-requirements.md) | Minimum schema, collection protocol, quality checks, holdout evaluation, and reproducibility order |
| [`09-mvp-metric-recommendation.md`](./09-mvp-metric-recommendation.md) | Final five-metric MVP decision, formula glossary, example, confidence, limits, and deferred methods |
| [`10-open-questions.md`](./10-open-questions.md) | Pre-collection decisions, pilot checks, product-language questions, and defaults |

The main planning document was read for context and not modified.

## Final synthesis

### What the research establishes

- Early adoption is a relative timing claim tied to a trend lifecycle and
  comparison population, not a synonym for later popularity [EA-01, EA-02].
- Participants and communities can change across stages of a trend [EA-06].
- A large response count does not establish peer-to-peer or structural
  virality [DF-02].
- Followers, retweets, mentions, views, likes, and other interactions measure
  different constructs and must not be silently interchanged [IM-01].
- Later outcomes can validate an earlier signal, but predicting or observing a
  later outcome does not make the original adoption early [VP-01, VP-02].
- Network, burst, cascade, and point-process methods require denser event,
  exposure, graph, or parent-link data than the manual prototype has [BT-02,
  DF-07, TP-01].
- Small binomial rates should show a score interval and evidence counts rather
  than a bare percentage [ST-02].
- Ranking evaluation must preserve time order so future trend evidence cannot
  leak into a past creator ranking [EV-02].

### Proposed product choices

The recommended MVP implements five visible metrics:

1. **Creator-relative post traction:** candidate seven-day response divided by
   the median of up to 20 eligible prior posts.
2. **Observed-cohort earliness:** tie-aware normalized adoption rank, with an
   event gate requiring the first two adopters to appear within seven days of
   first observed use.
3. **Later adoption validation:** distinct creators adopting after the
   candidate within that episode.
4. **Validated early-capture event:** early timing + at least 1.5× creator
   baseline + at least eight total cohort adopters, including at least three
   later adopters.
5. **Confidence-adjusted creator consistency:** repeated event rate with a
   Wilson interval, diversity, and temporal-span gates.

These values are proposed conventions, not literature-derived constants:

- response measured at 168±12 hours;
- early-event gate at the first two observed adopters within seven days (the
  first 25% of the eight-adopter supported-breadth target);
- at least 5 adopters for a provisional capture and 8 for supported later
  validation;
- 5–9 prior posts provisional and at least 10 supported;
- at least 3 later adopters;
- at least 2 supported events across 2 patterns and 30 days before ranking.

### Assessment of the proposed baseline

| Proposal | Final assessment |
| --- | --- |
| Up to 20 recent eligible prior posts | Keep as a bounded recency/effort choice; not a proven optimum. |
| At least 5 prior posts for a strong claim | Reject. Five is enough to calculate a median, not support a strong claim. Use 5–9 as provisional and 10–20 as supported. |
| Median creator baseline | Keep for robustness and explainability; return not classifiable when the median is zero. |
| 1.5× validated breakout | Keep only as a visible heuristic; test 1.25× and 2×. It measures creator-relative traction, not virality. |
| Show post count and confidence | Keep, but show component evidence and a Wilson interval rather than only a confidence word. |

### Why the recommendation is credible for a small dataset

- It uses manually coded formats and hooks rather than pretending to automate
  discovery.
- It requires only timestamped posts, one consistently measured response, a
  fixed creator cohort, and pattern labels.
- It uses deterministic formulas and explicit missing states.
- It keeps event timing, post traction, later spread, and creator repetition
  separate and inspectable.
- It prevents one post from entering the creator ranking.
- It evaluates the ranking on later completed trend episodes against simple
  baselines.
- It defers machine learning, graph models, live APIs, scraping, and causal
  claims.

## Reproducibility check

The recommendation is reproducible from the documentation alone if the data
contain:

- creator and post IDs;
- UTC post timestamps;
- complete cohort observation boundaries;
- one response type, value, observation timestamp, and post-age horizon;
- versioned pattern IDs and types;
- label provenance and adjudication status;
- exclusion and censoring flags.

Given those fields, another person can reproduce the creator baseline, response
ratio, adoption midrank, seven-day seed gate, normalized earliness,
later-adopter count, capture event, Wilson interval, eligibility gate,
deterministic sort, and holdout evaluation. No undocumented weight or learned
parameter is required.

## Key source map

| Question | Primary sources |
| --- | --- |
| What is early adoption? | [EA-01](./02-source-library.md#ea-01--the-status-gradient-of-trends-in-social-media), [EA-02](./02-source-library.md#ea-02--who-creates-trends-in-online-social-media-the-crowd-or-opinion-leaders), [EA-04](./02-source-library.md#ea-04--finding-early-adopters-of-innovation-in-social-networks) |
| How does a trend change over time? | [EA-06](./02-source-library.md#ea-06--who-is-behind-a-trend-temporal-analysis-of-interactions-among-trend-participants-on-twitter), [BT-02](./02-source-library.md#bt-02--bursty-and-hierarchical-structure-in-streams), [BT-03](./02-source-library.md#bt-03--early-discovery-of-emerging-entities-in-microblogs) |
| Why is raw response not virality? | [DF-02](./02-source-library.md#df-02--the-structural-virality-of-online-diffusion), [VP-03](./02-source-library.md#vp-03--measuring-and-detecting-virality-in-twitter) |
| Why separate reach and influence? | [IM-01](./02-source-library.md#im-01--measuring-user-influence-in-twitter-the-million-follower-fallacy), [DF-01](./02-source-library.md#df-01--the-role-of-social-networks-in-information-diffusion) |
| What can later performance establish? | [VP-01](./02-source-library.md#vp-01--can-cascades-be-predicted), [VP-02](./02-source-library.md#vp-02--seismic-a-self-exciting-point-process-model-for-predicting-tweet-popularity), [VP-04](./02-source-library.md#vp-04--trendlearner-early-prediction-of-popularity-trends-of-user-generated-content) |
| What methods are deferred? | [DF-07](./02-source-library.md#df-07--inferring-networks-of-diffusion-and-influence), [TP-01](./02-source-library.md#tp-01--tideh-time-dependent-hawkes-process-for-predicting-retweet-dynamics), [BT-02](./02-source-library.md#bt-02--bursty-and-hierarchical-structure-in-streams) |

## Additional methods sources

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

## Final status

Metric research and MVP synthesis are complete. The remaining questions are
data-collection choices and pilot calibration, listed in
[`10-open-questions.md`](./10-open-questions.md). No change was made to the
planning document.
