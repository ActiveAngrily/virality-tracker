# Creator Signal Map — Collaborative Planning

> Historical research and decision record. Do not implement this document. It
> is superseded by the X
> [`Viral Format Radar product specification`](./viral-format-radar-product-design.md).

## 1. Working idea

Creator Signal Map is a product concept for helping Social Capital understand which creators are:

- Using emerging content formats
- Early to those formats
- Gaining traction quickly
- Repeatedly validating trends before the wider creator network

The intended product question is:

> Who should we involve in the next launch, and why?

This is a starting point, not a final specification.

## 2. Decisions to make together

### Product users

- Who is the first user?
- What decision are they making?
- What do they do today?
- What would make this product useful enough to adopt?

### Product scope

- What must the first demo prove?
- What is explicitly out of scope?
- Is the primary experience a map, a ranking, a workflow, or something else?

### Data

- X is the MVP platform; which later platforms should be considered?
- Where does the initial dataset come from?
- What additional fields are needed to verify the fixed response horizon?
- How are formats or hooks identified?
- What counts as sufficient evidence?

### Metrics

- What does early adoption mean?
- What does engagement velocity mean?
- What does repeat performance mean?
- Should the product use one combined score?
- How should uncertainty and small datasets be represented?

### Creator groups

- Current MVP labels:
  - No trend signal
  - Promising experimenter
  - Emerging Trend scout
  - Consistent Trend scout
  - Reliable performer
- The original Fast amplifier and Late adopter labels are not active MVP
  classifications unless we decide to reintroduce them.
- How should each group be defined?
- Are the groups mutually exclusive?
- Should users be able to change the definitions?

### Experience

- What should the user see first?
- What does a creator detail view need to prove?
- What should the user be able to do after finding a creator?
- What visual language fits Social Capital?

### Technology

- What is the simplest suitable application architecture?
- Should the first version be local-first?
- Where should data be stored?
- What needs to be replaceable when real data sources arrive?

### Methodology

- Which product-design process should we use?
- What artifacts should we create before implementation?
- How will we validate the concept?
- What is the definition of done for the first version?

## 3. Agreed context

This project is a job-application work sample for Social Capital. The purpose is to demonstrate the ability to think through and build a useful virality-tracking or creator-intelligence product for a Social Capital employee.

The first intended audience is therefore:

> A Social Capital employee who could use or evaluate a tool for understanding creator and content virality.

This does not yet define:

- The employee's exact role
- Their recurring workflow
- The specific decision the tracker should support
- The final product action after a creator is identified
- The exact creator roster and collection window
- The collection method and interface

### Agreed product focus

The project will be a **small Creator Traction Analyzer**.

Its central question is:

> Which creators are capturing trends at their early stages?

The first version should demonstrate a narrow loop:

```text
Load a small set of creator posts
  → analyze creator behavior over time
  → identify creators who appear early to emerging trends
  → show the evidence clearly
```

The product will not initially attempt to be a complete launch-monitoring system, real-time social listening platform, or all-platform virality tracker.

Still-open decisions include the final format and hook codebook, the exact creator roster and collection window, the collection method, and the interface.

### Agreed trend model for the MVP

The MVP will interpret trends using multiple layers:

1. **Content format** is the primary trend signal.
2. **Hook or narrative style** is the secondary signal.
3. **Topic or cultural conversation** provides context.
4. **Format + hook + topic combinations** may become a later, more detailed layer.

This keeps the first version focused while preserving a path toward richer trend analysis.

### Agreed meaning of early trend capture

For the MVP, a creator should count as capturing a trend early only when both conditions are present:

1. They use a format or hook before it is widely adopted by the comparison creator network.
2. The post receives enough traction to provide early evidence that the format or hook is working.

This means the product should not reward early usage alone. It should look for **early adoption plus early validation**. The exact meaning of “slightly viral,” the comparison baseline, and the minimum traction threshold remain open decisions.

For the first version, “slightly viral” will be evaluated primarily against the creator’s own historical performance. The product should ask whether the early post performed meaningfully better than what that creator usually achieves, rather than ranking creators by raw reach alone.

The initial baseline rule is:

- Compare the candidate post with the creator’s eligible prior history, using up to the 20 most recent prior posts.
- Use the median seven-day like count of those posts as the creator’s normal baseline.
- Require at least five prior posts for a provisional ratio and at least ten for a supported validation claim.
- Treat seven-day likes at least 1.5× above the baseline as initial early validation.
- Show the number of posts used and a confidence label beside the result.

The response must be measured at a fixed seven-day horizon, with an allowed
observation tolerance of ±12 hours. The 1.5× threshold is an MVP heuristic,
not a research-derived constant.

The dataset should include normal creator posting history rather than only selected high-performing posts. These are MVP defaults and may be tuned after testing with data.

### Current agreed product definition

The MVP is a small **Creator Traction / Trend Adoption Analyzer**, not a full launch-monitoring platform.

Its core question is:

> Which creators are capturing trends at their early stages?

The product must distinguish three levels of analysis:

- **Post level:** Did this post outperform the creator’s normal baseline?
- **Format level:** Did this creator use the format earlier than others?
- **Creator level:** Does the creator repeatedly identify and validate emerging formats?

One successful post should not automatically make someone a Trend scout. The product should aggregate repeated early-adoption events across different formats and time periods.

Working creator-level interpretation:

- One early success: Promising experimenter
- Two early successes: Emerging Trend scout
- Several early successes across formats and time: Consistent Trend scout
- Strong performance with late adoption: Reliable performer

The MVP can use a small manually collected X dataset. Required data is limited to creator, post, date, format or hook label, and performance data. Live APIs, machine learning, large-scale scraping, and automated format discovery are outside the MVP.

Research areas to inform later decisions:

- Early trend adoption
- Information diffusion and cascades
- Virality and popularity prediction
- Creator growth analytics
- Burst and emerging-topic detection

Those remain planning questions.

## 4. Decision log

| ID | Topic | Decision | Rationale | Status | Date |
|---|---|---|---|---|---|
| D-001 | Product concept | Creator Signal Map will be developed as a Social Capital job-application work sample focused on virality tracking and creator intelligence. | The product must demonstrate useful product thinking and execution, not only present a visual dashboard. | Agreed |  |
| D-002 | Initial audience | A Social Capital employee is the first intended user or evaluator. | The demo should be relevant to how Social Capital might identify and understand creator or format virality. | Agreed |  |
| D-003 | Product focus | Build a thin end-to-end prototype combining a small data-collection pipeline with a usable virality-analysis experience. | This demonstrates both the technical pipeline capability and the product judgment needed to turn collected data into a useful tool. | Agreed |  |
| D-004 | Scope refinement | Narrow the MVP to analyzing creators and identifying which ones are building traction over time. | A smaller, evidence-led product is more achievable and more useful than attempting a full launch monitor, real-time tracker, and creator intelligence platform at once. | Agreed |  |
| D-005 | Core product question | Which creators are capturing trends at their early stages? | This is a sharper and more distinctive question than ranking creators by raw virality or general traction. | Agreed |  |
| D-006 | Trend model | Use content format as the primary trend signal, hook or narrative style as a secondary signal, and topic as context. | This balances a manageable MVP with enough detail to explain why a trend is spreading. | Agreed |  |
| D-007 | Early capture definition | A creator captures a trend early when they adopt a format or hook before wider adoption and their post provides early traction evidence. | Timing without validation may be noise; validation without early timing is ordinary performance. | Agreed |  |
| D-008 | Validation benchmark | Evaluate early traction primarily against the creator’s own historical performance. | This reduces audience-size bias and identifies meaningful improvements for each creator. | Agreed |  |
| D-009 | MVP validation rule | Compare a candidate post with the creator’s previous five posts, use the median as baseline, require at least three previous posts, and flag initial validation at 1.5× baseline performance. | This created an initial simple rule for “slightly viral,” but was later found too sensitive to small samples. | Superseded |  |
| D-010 | Initial platform | Start the MVP with X only. | A single-platform comparison network keeps the prototype smaller and makes early-adoption comparisons more consistent. LinkedIn remains a later expansion. | Agreed |  |
| D-011 | Revised MVP validation rule | Compare a candidate post with up to the creator’s 20 most recent eligible prior posts, use the median seven-day like count as baseline, show 5–9 prior posts as provisional, require at least 10 for supported validation, and flag initial validation at 1.5× baseline performance. | This reduces sample pollution while keeping the MVP rule explainable. The dataset must include normal posting history, not only viral examples. | Agreed |  |
| D-012 | Creator-level evidence | Do not classify a creator from one successful post; aggregate repeated early-adoption events across formats and time periods. | Repeated behavior is stronger evidence of trend capture than a single breakout. | Agreed |  |
| D-013 | MVP data scope | Use a small manually collected X dataset with creator, post, date, format or hook label, and performance data. | This is sufficient to test the product question without live APIs, machine learning, large-scale scraping, or automated format discovery. | Agreed |  |
| D-014 | MVP dataset structure | Use one row per X post in a single manually collected CSV. Include post, creator, timing, content labels, post type, and public performance fields. | This is the smallest dataset structure that supports creator baselines, format adoption order, and evidence-backed analysis. | Agreed |  |
| D-015 | MVP performance metrics | Use view lift as the primary performance metric, with public engagement and spread rate as supporting metrics. | This was the initial metric proposal, later superseded by the fixed-horizon research recommendation. | Superseded |  |
| D-016 | Early adoption rule | Rank creators by the date they first use each format. A creator is early when they fall within the first 25% of distinct adopters, and the format has at least four distinct creators. | This creates a simple, comparable adoption-order rule while avoiding claims based on formats used by only one or two creators. | Agreed |  |
| D-017 | Emerging validated trend rule | A format qualifies as an emerging validated trend when at least four distinct creators use it, an early creator’s post reaches the 1.5× validation threshold, and at least two other creators adopt it afterward. | This requires early discovery, successful proof, and later spread instead of treating isolated usage as a trend. | Agreed |  |
| D-018 | Creator-level classification | Classify creators by distinct validated formats: 0 means no trend signal, 1 means Promising experimenter, 2 means Emerging Trend scout, and 3+ means Consistent Trend scout. Repeated posts using the same format count as one validated format. | Requiring distinct formats rewards repeatable trend recognition rather than repeated success with one format. Reliable performer remains a separate later-performance category. | Agreed |  |
| D-019 | Reliable performer classification | A creator is a Reliable performer when they have at least two supported creator-relative breakouts across distinct formats and none of their eligible format adoptions were early. | This separates repeatable performance from early trend recognition. The label does not imply platform-wide reliability. | Agreed |  |
| D-020 | Primary response metric | Use likes measured at a fixed seven-day horizon as the primary response metric. Keep views, public engagement, and spread as supporting context. | A fixed response horizon makes posts comparable by age and follows the research recommendation to keep one response type consistent rather than blending incompatible metrics. | Agreed |  |
| D-021 | Initial cohort domain | Use a fixed cohort of B2B technology and startup creators on X. Include founders, product builders, AI and technology creators, tech commentators, venture and business creators, and operators who publish original insights. Exclude news-only, brand, entertainment, political, meme, and primarily reposting accounts. | This is relevant to Social Capital’s product-launch context while providing a focused, active, and manually labelable creator domain. | Agreed |  |
| D-022 | Creator-selection rules | Use a fixed, criteria-based cohort of roughly 20–30 public individual creators; require domain fit, original posting activity, enough history for the baseline, and consistent manual labeling; record inclusion reasons and freeze the roster before scoring. | This is the research-aligned way to make “early” comparable without selecting creators because they already look successful. | Agreed |  |
| D-023 | Observation window and collection protocol | Analyze fixed 30-day format episodes using a frozen creator cohort. Use earlier posts for creator baselines, require a seven-day response period after the final included post, and use retrospective data only when a fixed-horizon engagement snapshot is available. Exclude left-censored formats and incomplete episodes. | This is the smallest defensible protocol for comparing early adoption, later spread, and seven-day traction without mixing posts of different ages. | Agreed |  |

## 5. Assumptions log

Record assumptions separately from decisions. An assumption is not a requirement until we agree to keep it.

| ID | Assumption | How to validate | Owner | Status |
|---|---|---|---|---|
| A-001 |  |  |  | Open |

## 6. Alternatives considered

| Topic | Option | Benefits | Costs or risks | Outcome |
|---|---|---|---|---|
|  |  |  |  |  |

## 7. Product brief — to complete together

### Problem

### Target user

### User job

### Current alternatives

### Desired outcome

### Product promise

### Core workflow

### MVP boundary

### Success criteria

## 8. Data and metric specification — to complete together

### Input data

The MVP input is one manually collected CSV with one row per X post.

Required fields:

```text
post_id
creator_id
creator_handle
posted_at
observed_at
response_horizon_hours
post_url
text
post_type
format_label
hook_label
view_count
like_count
reply_count
repost_count
quote_count
```

The dataset should contain normal creator posting history, not only posts that already appear viral. `post_type` must distinguish original posts, replies, quote posts, and reposts. The initial baseline calculation will use original posts.

For performance analysis, `observed_at` is the timestamp at which the fixed-
horizon response was recorded, `response_horizon_hours` should be between 156
and 180, and `like_count` means likes measured at that response horizon.

### Agreed creator-selection rules

Use a fixed, criteria-based cohort of approximately 20–30 public individual X
creators within the B2B technology and startup domain. Each creator should:

- Publish original content or original commentary regularly.
- Have at least 10 eligible prior posts for a supported baseline, with 20 or
  more total posts preferred.
- Have content that can be consistently labeled using the format and hook
  codebook.
- Have a stable, auditable public account URL.
- Have a recorded inclusion reason before scoring begins.

Exclude accounts that are primarily news-only, brand, entertainment, political,
meme, or repost-only accounts. Include a mix of creator sizes for context, but
do not use follower count as a ranking input. Freeze the roster and record
`cohort_id`, `observed_from_utc`, and `observed_to_utc` before calculating
results.

### Observation window and collection protocol

Use a fixed 30-day episode for each format, beginning at its first observed use
in the frozen cohort. Earlier eligible posts remain available for creator
baseline calculations but do not extend the format episode.

The dataset is retrospective, but a post is eligible for primary performance
analysis only when its seven-day engagement snapshot is available. The final
included post must have a complete seven-day response period. Current lifetime
likes must not be substituted for seven-day likes.

Mark a format as unavailable for early-capture scoring when its first observed
use may predate the collection boundary (left-censoring) or when its 30-day
episode is incomplete. Record the collection boundaries and protocol version
with the analysis run.

### Data schema

### Format or hook grouping

### Post performance metrics

Primary metric:

```text
like_lift = candidate_7_day_likes / median(eligible_prior_7_day_like_counts)
```

Supporting metrics:

```text
view_count = public X view count at collection time
public_engagement = likes + replies + reposts + quotes at the same response observation
public_engagement_rate = public_engagement / view_count
spread_rate = (reposts + quotes) / view_count
```

The fixed response horizon is seven days, with an allowed observation tolerance of ±12 hours. The initial 1.5× breakout threshold applies to `like_lift` and remains an MVP heuristic, not a research conclusion. It should be configurable and revisited after testing against the dataset.

### Adoption calculation

For each format:

```text
format_first_seen_at = earliest use of the format
creator_format_first_seen_at = earliest use by each creator
adoption_rank = creator’s order of first use
adoption_percentile = adoption_rank / distinct_creator_count
```

A creator qualifies as an early adopter when:

```text
distinct_creator_count >= 4
and adoption_percentile <= 0.25
```

The product should show the creator’s adoption date, rank, percentile, and the number of creators in the comparison network.

### Emerging validated trend qualification

A format qualifies as an emerging validated trend when all conditions are true:

```text
distinct_creator_count >= 4
early creator is within the first 25% of adopters
early creator’s post has like_lift >= 1.5
at least two other creators adopt the format afterward
```

The MVP is therefore retrospective: later adoption provides evidence that the early creator’s successful post was an early signal rather than an isolated performance spike.

### Engagement velocity calculation

### Repeat performance calculation

### Combined signal calculation

### Creator-level classification

Classification is based on the number of distinct formats for which the creator has a validated early-adoption event:

```text
0 validated formats → No trend signal
1 validated format  → Promising experimenter
2 validated formats → Emerging Trend scout
3+ validated formats → Consistent Trend scout
```

Multiple successful posts using the same format count as one validated format. The creator detail view should show the validated formats and supporting posts behind the classification.

Reliable performer is a separate classification:

```text
at least 2 supported creator-relative breakouts
across distinct formats
and no early-adoption events among eligible adoptions
```

One strong post is a watchlist event, not a creator-level Reliable performer label.

### Confidence and limitations

### Research-backed refinements awaiting a separate decision

The research folder proposes stricter study-protocol options that are not yet
locked into the product decisions above:

- First two adopters within seven days of first observed use
- Eight total adopters and three later adopters for supported trend validation
- Wilson interval and temporal-span gates for creator ranking
- A later time-ordered holdout evaluation

These should be reviewed one at a time before implementation. The current MVP
decisions remain the simpler four-creator, first-25%-adoption, and two-later-
adopter rules recorded above.

## 9. UX planning — to complete together

### Primary user journey

### Information architecture

### Key screens

### Key interactions

### Empty, loading, and error states

### Accessibility requirements

### Visual direction

## 10. Technical planning — to complete together

### Application architecture

### Frontend stack

### Backend or storage

### Data processing

### Testing approach

### Deployment

### Security and privacy

## 11. Build plan — to complete after product decisions

### Milestones

### Prioritized backlog

### Acceptance criteria

### Definition of done

### Future roadmap

## 12. Builder handoff

This section will eventually contain the final instructions for Sol or Astra. It should only be written after the product brief, data model, UX, technical decisions, methodology, and acceptance criteria have been agreed.

## 13. Planning notes

Use this section for unresolved questions, research notes, sketches, and discussion outcomes that do not yet belong in the decision log.

Research alignment note: the research recommendation now supplies the fixed
seven-day like response, provisional versus supported baseline sizes, and the
need for explicit cohort boundaries. Further research refinements remain open
until separately approved.
