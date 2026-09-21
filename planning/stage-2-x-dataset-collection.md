# Stage 2 — Collect and Prepare the X Dataset

> Status: complete
>
> Depends on: Stage 1 frozen product and data contract
>
> Blocks: Stage 3 analysis engine
>
> Updated: 2026-09-21
>
> Parent specification: [`viral-format-radar-product-design.md`](./viral-format-radar-product-design.md)
>
> Progress tracker: [`implementation-progress.md`](./implementation-progress.md)

## 1. Objective

Create the fixed real-world dataset for the Viral Format Radar proof of
concept by using Codex browser control to collect up to 50 recent X posts from
each of 30 B2B technology and startup creators.

The maximum raw dataset is 1,500 posts. The browser workflow is a one-time
research operation. It is not part of the shipped application and does not
need production scraping infrastructure.

The finished application will read one frozen local JSON dataset.

Current checkpoint: all 30 frozen roster records were attempted. The base
collection contains 1,074 unique posts across 27 complete creators; 3 creators
are blocked with reasons recorded in `data/x-creators.json`. All 1,074 base
posts are labeled and frozen in `data/demo-data.json`; the separate expansion
contains 982 labeled posts in `data/demo-data.expansion.json`.

The user later authorized a separate 30-creator expansion. It is stored in
`data/x-creators.expansion.json` and `data/x-posts.expansion.raw.json` so the
base roster and raw snapshot remain unchanged. The expansion contains 982
unique posts across 30 complete creators.

Collection summary: 30 targeted; 27 complete; 0 partial; 3 blocked; 1,074
posts; 0–50 posts per creator (median 50); 744 performance-eligible; 330
adoption-only due to age; 0 excluded; 0 missing view counts; 0 duplicate
records removed. Collection timestamps run from `2026-09-20T19:57:06Z` to
`2026-09-20T20:24:56Z`.

## 2. Frozen inputs from Stage 1

- Platform: X.
- Cohort: exactly 30 individual creators.
- Collection limit: up to 50 recent posts per creator.
- Collection method: Codex browser control through the rendered X UI.
- Observation window: inclusive `2026-06-23T12:00:00Z` through
  `2026-09-21T12:00:00Z`.
- Analysis-as-of: `2026-09-21T12:00:00Z`; planned collection snapshot:
  `2026-09-21T12:00:00Z`.
- Schema, codebook, and threshold versions: `vfr-x-schema-1.0`,
  `vfr-x-codebook-1.0`, and `vfr-x-thresholds-1.0`.
- Sampling rule: collect the creator's contiguous recent original posts within
  that window, stopping at 50; never select only successful posts.
- Primary performance metric: public views at the fixed collection snapshot.
- Spread evidence: public repost and quote counts plus amplification rate when
  views are available.
- Supporting context: public likes and replies.
- Performance eligibility: the post must be at least 168 hours old when
  collected.
- Baseline: the creator's 20 most recent eligible prior posts, when available.
- Application input: frozen local JSON.
- Collection is not exposed in the application.

Posts younger than seven days may contribute to adoption recency but cannot
contribute to view lift. Posts outside the common 90-day window are not
used for pattern adoption, even if they are inspected while navigating.

## 3. What “up to 50” means

For every creator, collect all qualifying posts encountered in reverse
chronological order until the first of these conditions occurs:

1. 50 qualifying posts have been saved.
2. The next post is older than the common 90-day observation window.
3. X stops exposing more posts through the ordinary rendered UI.

A creator with fewer than 50 posts is valid. Record the actual count and the
reason collection stopped. Do not pad the dataset or search for isolated older
high-performing posts.

## 4. Creator cohort

### Inclusion criteria

Each creator should:

- Be an individual rather than a company page.
- Publish primarily in English.
- Regularly discuss B2B technology, startups, AI, developer tools, product,
  growth, or venture investing.
- Have a publicly reachable X profile and visible post activity.
- Have posted during the common 90-day window.
- Be relevant to the kind of launch and content work Sociall Capital performs.

### Cohort quality

The roster should include a reasonable mixture of founders, operators,
marketers, investors, and technical creators. Avoid filling the cohort with
thirty near-identical mega-creators. Creator size is contextual metadata, not
a selection quota or ranking input.

Freeze the roster before collecting post performance. If a creator is
inaccessible or has no usable activity, mark the creator `blocked` and replace
them before continuing. Once post collection has started successfully for a
creator, do not replace them because their posts perform poorly.

### Creator record

```text
creator_id
creator_name
creator_handle
profile_url
role_or_category
collection_status
posts_collected
collection_started_at_utc
collection_completed_at_utc
stop_reason
notes
```

Allowed collection states:

```text
pending
in_progress
complete
partial
blocked
```

## 5. Post inclusion and exclusion

### Include

- Original posts authored by the selected creator.
- Text, image, poll, native video, link, and article posts that appear in the
  creator's post activity.
- Posts with zero visible engagement when zero is explicitly established.
- Posts younger than seven days, but only for adoption and recency evidence.

### Exclude

- Replies and pure reposts.
- Job changes, profile updates, and other automated activity items.
- Sponsored content not authored by the creator.
- Duplicate appearances of the same post.
- Posts outside the common 90-day window.
- Any content that is not visible through the ordinary rendered interface.

When uncertain, preserve the raw record with `baseline_eligible = false` and
an `exclusion_reason`; do not silently discard it.

## 6. Data captured per post

### Required raw fields

```text
post_id
creator_id
post_url
posted_at_raw
posted_at_utc
posted_at_precision
collected_at_utc
post_age_hours_at_collection
full_visible_text
post_type
views_raw
views_at_collection
likes_raw
likes_at_collection
replies_raw
replies_at_collection
reposts_raw
reposts_at_collection
quotes_raw
quotes_at_collection
baseline_eligible
exclusion_reason
collection_notes
```

`posted_at_precision` must be one of:

```text
exact_time
hour
day
unknown
```

Do not invent precision. Preserve the displayed value in `posted_at_raw` and
set normalized fields to null when the date or count cannot be resolved
reliably.

### Labeled fields added after collection

```text
text_excerpt
format_family_id
format_pattern_id
format_pattern_name
hook_pattern_id
hook_pattern_name
topic
```

Use null for missing information. Use zero only when the rendered interface
explicitly establishes zero.

## 7. Files and checkpoints

Use three data files:

```text
data/x-creators.json
data/x-posts.raw.json
data/demo-data.json
```

- `x-creators.json` is the roster and resume checkpoint.
- `x-posts.raw.json` preserves browser-collected evidence before labels
  or derived metrics are added.
- `demo-data.json` is the validated, labeled, frozen application input.

Write progress after every completed creator. A failed or interrupted browser
session should lose at most one creator's unsaved work.

Deduplicate posts by canonical post URL. If a stable post identifier is visible
in the URL, store it as `post_id`; otherwise derive a deterministic ID from the
canonical URL during normalization.

## 8. Codex browser-control workflow

### Phase 0 — Prepare

1. Create and review the 30-creator roster.
2. Set one UTC collection date and derive the 90-day observation start.
3. Create the empty roster and raw-post files.
4. Confirm X is open in a visible browser session.
5. If sign-in is required, pause for the user to sign in manually.
6. Do not request, store, or type X credentials.

### Phase 1 — Two-creator pilot

Collect two creators before scaling the run.

For each pilot creator:

1. Open the creator's post activity feed.
2. Confirm the page belongs to the intended creator.
3. Read rendered post cards in reverse chronological order.
4. Expand “see more” when necessary to capture the visible post text.
5. Open a post permalink only when required to obtain a canonical URL,
   reliable timestamp, or exact visible engagement count.
6. Save each qualifying post immediately in working memory.
7. Scroll only after the current rendered cards have been recorded.
8. Stop at 50 posts, the 90-day boundary, or UI exhaustion.
9. Deduplicate and write the creator's records to the raw file.
10. Update the creator checkpoint.

After the pilot, verify that timestamps, URLs, view, like, reply, repost, and
quote counts, post types, and null handling are usable. Fix the collection
instructions or schema before
collecting the remaining 28 creators.

### Phase 2 — Main collection

Process the remaining creators in six batches, normally five creators per
batch. The first batch includes the two pilot creators and three additional
creators.

For every creator:

1. Set their status to `in_progress`.
2. Collect a contiguous reverse-chronological sequence of qualifying posts.
3. Keep raw UI labels alongside normalized values.
4. Record the same collection timestamp convention throughout the run.
5. Write and validate the records.
6. Set the creator to `complete`, `partial`, or `blocked` with a reason.

At the end of each five-creator batch:

- Confirm no creator exceeds 50 records.
- Confirm no duplicate URLs exist.
- Confirm all records belong to rostered creators.
- Record post and error counts.
- Resume from the next `pending` creator.

### Phase 3 — Normalize and freeze

1. Canonicalize URLs and IDs.
2. Normalize timestamps and integer counts without discarding raw values.
3. Calculate post age at collection.
4. Mark posts younger than 168 hours as performance-ineligible.
5. Mark replies, pure reposts, and automated activity as excluded.
6. Add text excerpts.
7. Apply the frozen format and hook codebook.
8. Write the final `demo-data.json` and stop modifying the snapshot.

Baseline, view-lift, amplification, adoption, lifecycle, and evidence
calculations belong to Stage 3 and must not be precomputed during collection.

## 9. Browser operating boundaries

The collection task may read and interact with content available through the
rendered X interface in the user's browser session.

Do not:

- Solve or outsource CAPTCHAs.
- Rotate proxies or identities.
- Install stealth browser plugins.
- Call private X endpoints directly.
- Circumvent rate limits or access controls.
- Collect private messages, contact information, replies by unrelated users,
  or non-product personal data.
- Continue automated navigation after X presents a restriction or
  verification challenge.

If a challenge appears, save completed progress and stop. Resume manually or
mark the affected creator partial. Since the sample is fixed and small, manual
entry is the fallback rather than more collection infrastructure.

## 10. Labeling workflow

Do not classify posts while deciding which ones to collect. Complete the
contiguous sample first so performance does not bias inclusion.

After raw collection:

1. Apply the format and hook codebook frozen in Stage 1.
2. Label one primary format and at most one primary hook per scored post.
3. Use `unclassified` when evidence is ambiguous.
4. Keep the Stage 1 positive and negative examples available to annotators.
5. Do not add or rename patterns after seeing performance values.

If the two-creator pilot shows that the frozen codebook cannot represent the
intended X content, stop before the main collection and formally reopen
Stage 1. Do not revise the codebook opportunistically during labeling.

The same codebook must be used across all 30 creators.

## 11. Validation and quality assurance

### Automated validation

The implementation should fail clearly on:

- Duplicate post IDs or canonical URLs.
- Unknown creator IDs.
- More than 50 included posts for one creator.
- Posts outside the observation window entering adoption analysis.
- Negative engagement counts.
- Parsed counts that conflict with their preserved raw values.
- Missing collection timestamps.
- Future publication timestamps.
- Unknown format or hook IDs in the final file.

### Manual source verification

Before freezing the dataset:

- Reopen a random 10% sample of collected source URLs.
- Reopen every representative post displayed in the product.
- Recheck every post classified as a supported breakout.
- Confirm creator identity, post text, publication timing, and engagement
  snapshot against the stored record.
- Record broken or unavailable links without substituting invented data.

### Collection summary

Produce a final summary containing:

```text
creators_targeted
creators_complete
creators_partial
creators_blocked
posts_collected
posts_per_creator_min
posts_per_creator_median
posts_per_creator_max
performance_eligible_posts
young_adoption_only_posts
excluded_posts
missing_view_counts
duplicate_records_removed
collection_started_at_utc
collection_completed_at_utc
```

## 12. Failure and resume rules

- Browser interruption: save the current creator if possible, then resume from
  the last canonical URL already stored.
- Creator feed unavailable: retry once through ordinary navigation, then mark
  `blocked`.
- Exact count unavailable: keep the raw label, store the normalized count as
  null, and exclude it from performance calculations.
- Date precision unavailable: preserve the raw date, mark precision, and avoid
  unsupported fine-grained adoption ordering.
- Duplicate post: retain the first complete record and discard the duplicate.
- Deleted post after collection: preserve the frozen record, mark the source
  unavailable, and do not fabricate a replacement.
- Verification challenge: stop browser automation; do not work around it.

## 13. Deliverable and exit criteria

The Stage 2 deliverable is one frozen local `data/demo-data.json` dataset,
supported by the retained roster and raw collection files.

Collection is complete when:

- The roster contains exactly 30 creators.
- Every creator is marked complete, partial, or blocked with a reason.
- Up to 50 contiguous recent qualifying posts have been attempted per creator.
- No creator has more than 50 included posts.
- Every retained record has a creator, canonical source URL, collection time,
  publication label, visible text, and explicit metric null handling.
- The common 90-day observation window is applied consistently.
- Performance eligibility is calculated from the seven-day minimum age.
- Raw evidence and normalized values remain distinguishable.
- Duplicate and schema validation passes.
- Manual source verification is complete.
- The final labeled dataset is frozen as `data/demo-data.json`.
- The shipped application performs no X collection itself.
- The progress tracker marks Stage 2 complete and Stage 3 ready.

## 14. Stage 2 execution order

1. Confirm Stage 1 is complete and read its frozen artifacts.
2. Inspect the repository and existing empty data files.
3. Run the two-creator browser-control pilot.
4. Validate the pilot before scaling.
5. Collect the remaining creators in resumable five-creator batches.
6. Normalize, label, verify, and freeze the dataset.
7. Mark Stage 2 complete; do not begin analysis in this stage.

Do not build a general scraper framework, scheduler, database, proxy layer,
authentication system, or user-facing import workflow.
