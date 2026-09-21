# Stage 3 — Build and Verify the Analysis Engine

> Status: complete
>
> Updated: 2026-09-21
>
> Depends on: Stage 2 frozen dataset
>
> Blocks: Stage 4 interface
>
> Authoritative product plan:
> [`viral-format-radar-product-design.md`](./viral-format-radar-product-design.md)

## 1. Objective

Implement the deterministic product logic that converts the frozen X dataset
into Radar and Pattern Detail results. The analysis must run without a
UI and expose every numerator, denominator, threshold, and evidence limitation
needed by Stage 4.

## 2. Inputs

Stage 3 receives:

- Frozen `data/demo-data.json` from Stage 2.
- Frozen schema, codebook, thresholds, and dates from Stage 1.
- No API, browser, database, or user input.

The analysis must never modify the source dataset.

## 3. Implementation boundary

Build one small analysis module and one deterministic fixture. Split files only
when the existing project structure makes that simpler.

The module is responsible for:

- Dataset validation.
- Creator baseline calculation.
- Creator-relative view lift.
- Repost-plus-quote amplification and amplification rate.
- First adoption and adoption order.
- Later-adopter evidence.
- Pattern-level performance.
- Lifecycle classification.
- Evidence-quality classification.
- Repeat-use and creator repeat evidence.
- Plain data outputs for both product screens.

It is not responsible for:

- Rendering or formatting UI.
- Reading X.
- Mutating labels or source facts.
- Choosing creators or representative posts by hidden judgment.
- Predicting future performance.

## 4. Dataset validation

Fail clearly before calculating results when the frozen dataset contains:

- A schema or threshold version the implementation does not support.
- Duplicate creator IDs, post IDs, or canonical URLs.
- A post belonging to an unknown creator.
- More than 50 included posts for one creator.
- A timestamp outside the permitted observation rules.
- A negative engagement count.
- An unknown format family, format pattern, or hook pattern.
- A performance-eligible post younger than the frozen minimum age.
- A baseline-eligible post without a usable public view count.
- A non-null exclusion reason on an included final post.

Missing optional engagement values remain null and do not fail validation.

## 5. Creator-relative performance

For each candidate post:

1. Select the creator's eligible posts strictly earlier than the candidate.
2. Sort them newest first.
3. Keep the frozen maximum baseline-history count.
4. Calculate the median public view count.
5. Classify baseline quality from the number of prior posts.
6. Calculate view lift only when the baseline is positive and the candidate
   has a usable view count.
7. Mark a supported breakout only when the baseline is Supported and view lift
   meets the frozen threshold.

Return the source view count, baseline, prior count, baseline quality, view
lift, eligibility, and reason for any unavailable value. Do not return
a bare ratio without its evidence.

For spread evidence, calculate `amplifications = reposts + quotes` only when
both public counts are available. Calculate `amplification_rate =
amplifications / views` only when amplifications are available and views are
positive. Likes and replies remain supporting fields and do not enter a hidden
combined score.

## 6. Pattern adoption

Run the same adoption algorithm separately for concrete format patterns and
hook patterns.

For each pattern:

1. Find each creator's earliest observed use.
2. Sort first uses by the frozen timestamp rules.
3. Assign tied timestamps the same adoption rank.
4. Calculate adoption percentile when at least two creators adopted.
5. Classify early adopters using the frozen minimum adopter count and
   percentile boundary.
6. Count distinct later adopters inside the frozen episode window.
7. Never claim that an earlier creator caused later adoption.

Approximate X dates must use the tie behavior frozen in Stage 1. The
analysis must not manufacture fine-grained ordering from low-precision dates.

## 7. Validated early capture

A creator-pattern event is validated only when all frozen conditions pass:

- The pattern has the minimum distinct adopters.
- The creator is early within the observed cohort.
- The creator's first-adoption post is a supported breakout.
- The event has the minimum distinct later adopters.

Return every condition independently. Do not create a blended virality score.

## 8. Pattern performance and repeat evidence

For each pattern:

- Calculate median view lift from classifiable first-adoption posts only.
- Return amplification counts and rates when their public inputs are complete.
- Return the view-lift sample size.
- Withhold the displayed median when the sample is below the frozen minimum.
- Count repeat uses after each creator's first use.
- Count supported breakouts and validated early-capture events.

For each creator:

- Count distinct validated format patterns.
- Return the supporting pattern IDs.
- Do not produce a global creator score, rank, or qualitative creator class.

## 9. Lifecycle and evidence quality

Assign one lifecycle state in the exact frozen precedence order:

1. Validated.
2. Emerging.
3. Fading.
4. Insufficient Evidence.

Assign evidence quality independently:

1. Supported when at least one first-adoption post has a Supported baseline.
2. Provisional when none are Supported but at least one is Provisional.
3. Limited when none have a classifiable baseline.

A pattern may be Emerging with Limited evidence. Missing performance must not
be converted into poor performance or a lifecycle state.

## 10. Analysis output

Return serializable data shaped for, but not coupled to, the UI:

```text
analysis_context
summary
patterns[]
  identity
  lifecycle
  evidence_quality
  adoption_metrics
  performance_metrics
  validated_events
  creator_evidence
  representative_post_candidates
  limitations
creators[]
validation_summary
```

Every displayed metric must retain enough source identifiers for Stage 5 to
trace it back to creators and posts.

## 11. Deterministic fixture

Add one small hand-checkable fixture covering:

- A Supported baseline and a view lift exactly at the breakout boundary.
- A zero baseline that remains unclassifiable.
- A missing view count that remains missing.
- A missing quote or repost count that prevents amplification-rate calculation.
- A post younger than the minimum age.
- Tied adoption timestamps.
- A pattern that becomes Validated after enough later adopters.
- A recent two-adopter pattern that remains Emerging.
- An old inactive pattern that becomes Fading.
- A one-adopter pattern that remains Insufficient Evidence.
- A single successful post that creates no creator repeat evidence.

Use the smallest runnable test mechanism already available in the project. Do
not add a testing framework solely for this fixture.

## 12. Verification

- Run dataset validation against the frozen dataset.
- Run the deterministic fixture.
- Hand-calculate at least one creator baseline and one pattern lifecycle result.
- Compare the hand calculation with module output.
- Confirm median sample sizes and all denominators are returned.
- Confirm null values survive without becoming zero or `NaN`.
- Confirm stable output across repeated runs.
- Confirm no browser, network, UI, or mutable global state is required.

## 13. Deliverable

A reliable analysis module that accepts the frozen dataset and returns complete
Radar results plus one passing deterministic fixture.

## 14. Exit criteria

Stage 3 is complete only when:

- Frozen dataset validation passes.
- Every analysis rule in the product specification is implemented once.
- The deterministic fixture passes.
- At least one baseline and lifecycle result has been hand-verified.
- Outputs contain source IDs and limitation reasons.
- No analysis logic is duplicated in UI code.
- The progress tracker marks Stage 3 complete and Stage 4 ready.

## 15. Explicitly deferred

Do not build interface components, visual styling, browser collection,
production APIs, caches, workers, background jobs, or generalized analytics
infrastructure in Stage 3.
