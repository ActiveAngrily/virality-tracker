# Creator Consistency

## What consistency means here

Creator consistency is repeated, independently observed early capture across
distinct patterns and time. It is not repeated posting of one format, high
average views, follower size, or one viral-looking post.

The product should show one early success as an event card, not convert it into
a creator-level “Trend scout” label.

## Evidence unit

The aggregation unit is one creator–pattern pair. For creator \(c\) and pattern
\(t\), [`04-early-adoption-metrics.md`](./04-early-adoption-metrics.md) defines:

- \(Z_{c,t}=1\) for a supported validated early-capture event;
- \(Z_{c,t}=0\) for a fully observed eligible adoption that fails one or more
  capture conditions;
- missing when baseline, trend, or outcome evidence is insufficient.

Repeated posts using the same pattern do not increase either the numerator or
denominator.

## Creator-level metrics

### 1. Eligible adoption count

\[
n_c=|\{t:Z_{c,t}\text{ is observed}\}|.
\]

This is the number of distinct pattern adoptions for which timing, later
adoption, and creator-relative performance can all be evaluated. Missing cases
are reported separately as \(m_c\), not silently removed from the display.

### 2. Validated capture count

\[
k_c=\sum_{t:Z_{c,t}\text{ observed}} Z_{c,t}.
\]

### 3. Observed capture rate

\[
\hat p_c=\frac{k_c}{n_c}\qquad(n_c>0).
\]

The rate prevents a prolific creator from winning only by having more labeled
posts. It can still be extreme at tiny \(n\), so it is not the ranking score by
itself.

### 4. Wilson 95% interval and lower bound

For \(z=1.96\), \(\hat p=k/n\):

\[
center=\frac{\hat p+z^2/(2n)}{1+z^2/n},
\]

\[
half=\frac{z}{1+z^2/n}
\sqrt{\frac{\hat p(1-\hat p)}{n}+\frac{z^2}{4n^2}},
\]

\[
W^-_c=\max(0,center-half),\qquad
W^+_c=\min(1,center+half).
\]

The ranking score is \(W^-_c\), the lower endpoint, only after the eligibility
gate below. Score intervals have better small-sample coverage than the familiar
Wald interval [ST-02]. The interval does not account for non-random sampling,
correlated formats, missing posts, or coder error.

### 5. Pattern diversity

\[
D_c=|\{t:Z_{c,t}=1\}|.
\]

Because each \(t\) is a distinct versioned pattern, \(D_c=k_c\) in the minimum
schema. If patterns have families, also report:

\[
F_c=|\{family(t):Z_{c,t}=1\}|.
\]

The MVP gate uses \(D_c\); \(F_c\) is descriptive until the codebook contains
enough families.

### 6. Temporal span

For \(k_c\ge2\):

\[
S_c=\max_{t:Z=1}a_{c,t}-\min_{t:Z=1}a_{c,t}
\]

in days. Calendar-month counts are not used because events on January 31 and
February 1 are not meaningfully separated.

## Ranking rule

A creator enters the ranked list only when all are true:

\[
n_c\ge3,\quad k_c\ge2,\quad D_c\ge2,\quad S_c\ge30\text{ days}.
\]

Rank eligible creators lexicographically by:

1. Wilson lower bound \(W^-_c\), descending;
2. validated capture count \(k_c\), descending;
3. median earliness \(\operatorname{median}(E_{c,t}:Z_{c,t}=1)\), descending;
4. creator ID, ascending, as a deterministic final tie-break.

There is no opaque weighted sum. Each component remains inspectable, and
changing the response scale cannot directly overpower timing or repeatability.

Creators below the gate appear in an unranked watchlist with evidence counts.
This is the primary protection against a one-off viral post dominating:

- one post can produce at most one \(Z\);
- two distinct patterns are required;
- successful events must be at least 30 days apart;
- the rate is uncertainty-adjusted;
- raw views and follower counts are not ranking inputs.

## Interpretation labels

Labels summarize evidence; they do not replace the metrics.

| Label | Exact rule | Interpretation |
| --- | --- | --- |
| Insufficient history | \(n_c=0\) or more than half of attempted adoptions are missing | No creator-level claim |
| One observed signal | \(k_c=1\) | Promising event; not repeat evidence |
| Emerging Trend scout | \(n_c\ge3\), \(k_c\ge2\), \(D_c\ge2\), \(S_c\ge30\) | Repeated evidence, still small-sample |
| Consistent Trend scout | \(n_c\ge5\), \(k_c\ge3\), \(D_c\ge3\), \(S_c\ge60\) | Strongest MVP label; still cohort-relative |
| Reliable performer | at least two \(P=1\) events but no \(A=1\) events among eligible adoptions | Repeat performance without early timing |

If a creator satisfies more than one positive row, use the most specific label:
`Consistent` over `Emerging` over `One observed signal`. `Insufficient history`
overrides every positive label; `Reliable performer` is mutually exclusive
because it requires no early event.

The numeric thresholds are proposed MVP rules. They should be recalibrated
only on development data and then frozen before holdout evaluation.

## Example creator calculation

Suppose a creator has five fully observed distinct pattern adoptions and three
supported validated captures:

\[
n=5,\qquad k=3,\qquad \hat p=0.60.
\]

The Wilson 95% interval is approximately:

\[
[W^-,W^+]=[0.231,0.882].
\]

The wide interval is the correct signal: three successes in five opportunities
remain uncertain. If the captures cover three patterns and span 75 days, the
creator meets the `Consistent Trend scout` rule, but the product must still
show `3/5`, the interval, diversity, span, and missing count.

For contrast, a creator with one success in one opportunity has a nominal rate
of 100% but stays off the ranking because \(n<3\), \(k<2\), and there is no
temporal repeat evidence.

## Opportunity denominator and its limitation

The denominator is **patterns the creator actually adopted and that are fully
evaluable**, not every pattern seen anywhere in the cohort. This measures how
often observed trend adoption becomes a validated early capture. It does not
measure how often the creator notices all available trends.

Counting every cohort trend as an opportunity would punish niche creators for
irrelevant formats and require a new `creator_pattern_eligible` judgment. That
may be useful later, but it is not necessary for the first prototype. The MVP
must therefore display \(n_c\) and avoid language such as “captures 60% of all
trends.”

## Missingness rules

- Do not treat missing \(Z\) as zero.
- Report \(m_c\), the number of labeled adoptions excluded for missing or
  insufficient evidence.
- If \(m_c/(m_c+n_c)>0.5\), do not assign a positive creator label.
- If fixed-horizon response is missing selectively for low-performing posts,
  suspend the performance and creator scores; the missingness is outcome-
  dependent.
- A creator who enters observation after a trend begins receives neither a
  success nor a failure for that trend.

## Robustness checks

Before presenting a ranking:

1. Recalculate it after removing each pattern once. Report the maximum rank
   change and top-five Jaccard overlap.
2. Recalculate it at 1.25× and 2× breakout thresholds.
3. Recalculate it with five and ten prior-post minimums.
4. Show the raw-rate ranking beside the Wilson-lower-bound ranking internally.
5. Compare with rankings by followers, raw seven-day likes, posting volume,
   and most recent single breakout.

If one removed pattern or a nearby threshold reverses the top of the list,
present the result as exploratory rather than stable.

## Evidence versus product choice

### Research evidence

- Early timing and later success are different properties [EA-01, VP-01].
- Follower count, retweets, and mentions are not interchangeable influence
  measures [IM-01].
- Large cascades are rare and their size does not establish peer-driven
  virality [VP-01, DF-02].
- Wilson/score intervals have better small-sample behavior than Wald intervals
  for proportions [ST-02].

### Proposed product choices

- creator–pattern as the aggregation unit;
- a two-event, two-pattern, 30-day ranking gate;
- Wilson lower-bound ordering;
- the `Emerging` and `Consistent` label thresholds;
- excluding unadopted patterns from the denominator.

## Primary sources

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

Full records for EA-01, VP-01, DF-02, and IM-01 are in
[`02-source-library.md`](./02-source-library.md).
