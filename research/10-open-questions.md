# Creator Signal Map — Open Questions

## Questions that must be fixed before data collection

These change the meaning of the result and cannot be chosen after inspecting
which creators win.

1. **Cohort:** Which X creators form the comparison network, and why are they
   comparable?
2. **Collection completeness:** Can all ordinary posts be collected for the
   analysis window plus 20 eligible prior posts per candidate event?
3. **Primary response:** Are seven-day likes consistently obtainable, or is
   another single response type more complete?
4. **Pattern codebook:** What observable features define each format and hook,
   and what near-matches count as negatives?
5. **Episode boundary:** Is a fixed 30-day episode sensible for the actual
   posting cadence, or must the entire analysis use a different preregistered
   length?
6. **Observation start:** Can the study establish that candidate pattern
   episodes are not already underway when collection starts?
7. **Holdout:** Is there enough calendar time to reserve later completed trend
   episodes for evaluation?

## Questions to answer with the pilot data

These are sensitivity or feasibility checks, not invitations to tune for a
preferred ranking.

1. How many creators have at least 10 comparable prior posts at the fixed
   response horizon?
2. How often is the creator median zero?
3. How many coded patterns reach 5 and 8 distinct adopters within 30 days?
4. How many supported validated-capture events remain after all gates?
5. Does using 1.25×, 1.5×, or 2× materially change the top five?
6. Do early quotas of 1, 2, or 3 creators and seed windows of 3, 7, or 14 days
   materially change event labels?
7. Does removing any one pattern reorder the ranking?
8. How much outcome and label data are missing, and is missingness associated
   with apparent success?
9. Do two coders agree well enough for the format/hook distinctions to be
   reproducible?
10. Does the ranking beat follower count, posting volume, raw response, and the
    latest single breakout in a later holdout?
11. Do target-like reviewers find the evidence cards useful without seeing the
    rank?

## Product-language questions

1. Should the UI use `Observed early adopter` instead of `Trend scout` until a
   creator clears the repeatability gate?
2. Is `Supported within this cohort` prominent enough to prevent a platform-
   wide interpretation?
3. Should provisional cases appear in a separate watchlist rather than the
   main ranking?
4. Does the intended Social Capital user care more about early format capture,
   reliable later performance, or both as separate views?
5. What action should follow from the ranking: monitor, contact, shortlist for
   a launch, or investigate the format?

## Method questions deliberately deferred

These require data the small prototype does not have.

- Can impressions or feed exposures support a real exposure-normalized rate?
- Are repost parent links available for cascade or structural-virality
  analysis?
- Can downstream adoptions be attributed rather than merely ordered?
- Is there enough event density for burst or point-process models?
- Can pattern labels be detected reliably from video, audio, or image content?
- Would partial pooling materially improve sparse creator estimates?
- Does the framework transfer to other platforms or creator cohorts?
- Can an independent, larger corpus validate that the observed cohort's trends
  were genuinely broader trends?

## Default decisions if no further input is available

- One fixed X cohort.
- Likes at 168±12 hours as the single response measure.
- Formats primary, hooks secondary, topics contextual.
- Thirty-day episodes.
- Median of up to 20 prior posts; 5–9 provisional, at least 10 supported.
- 1.5× breakout, first two adopters within 7 days, 8 adopters for supported
  trend breadth, and 3 later adopters.
- One-event creators remain unranked.
- One global time holdout with Precision@5 and nDCG@5.

These defaults are the minimal reproducible prototype described in
[`09-mvp-metric-recommendation.md`](./09-mvp-metric-recommendation.md), not
claims that the thresholds are universal.
