# Launch Signal Map — Product Design Plan

> Status: historical rejected pivot. Do not implement this document. It is
> superseded by the X
> [`Viral Format Radar product specification`](./viral-format-radar-product-design.md).
>
> Updated: 2026-09-20

Project identity: this plan concerns **Sociall Capital, the Bengaluru growth
company**, not the venture-capital firm associated with Chamath Palihapitiya.
The project uses the `Sociall Capital` spelling throughout to keep that
distinction explicit.

## 1. Executive recommendation

Pivot **Creator Signal Map** into **Launch Signal Map**: a small decision tool
that helps a Sociall Capital launch strategist choose a launch-specific set of
creators, content patterns, and hooks, then check whether the launch is gaining
distribution quickly.

The product should answer one question:

> Which creator × format × hook combinations should we use for this X launch,
> and what historical evidence supports each recommendation?

The MVP should produce exactly:

- one structured launch brief;
- three recommended content patterns;
- five creator × pattern × hook recommendations;
- evidence from comparable historical posts; and
- one lightweight launch-day monitor using early view and repost velocity.

This is a **human decision aid**, not an autonomous virality predictor. It
should make a recommendation easy to understand, challenge, and copy into a
launch plan.

## 2. What changes in the pivot

| Creator Signal Map | Launch Signal Map |
| --- | --- |
| Starts with a fixed creator cohort | Starts with a specific product launch |
| Asks who captures trends early | Asks who should carry which launch message |
| Produces creator classifications | Produces an actionable five-creator roster |
| Uses seven-day likes as the primary outcome | Uses historical reach and spread, then early launch velocity |
| Treats format adoption as the main signal | Treats creator–audience–product fit as the entry requirement |
| Ends at insight | Ends at a launch plan and monitoring decision |

The earlier work is not discarded. Creator-relative baselines, repeatability,
fixed observation horizons, evidence quality, and careful claim language remain
useful. Early trend adoption becomes supporting context rather than the product's
main ranking objective.

The existing
[`creator-signal-map.md`](./creator-signal-map.md) remains the historical record
of the earlier direction. This plan supersedes it for the pivot; it does not
rewrite the old decision log.

## 3. Why this product fits Sociall Capital

Sociall Capital's public materials describe a workflow that combines product
research, viral-example research, hook development, creator recruitment, and
launch measurement:

- The [homepage](https://www.sociallcapital.com/) describes the company as
  distribution infrastructure for product launches across X and LinkedIn.
- The [Head of Growth role](https://www.sociallcapital.com/careers/head-of-growth)
  describes understanding a product, finding relevant successful examples,
  adapting hooks, and recruiting creators to amplify a launch.
- The [Thinker-Writer role](https://www.sociallcapital.com/careers/thinker-writer)
  describes examining click-through, retention, comments, bookmarks, and
  repost velocity while developing launch ideas.
- The [selected work](https://www.sociallcapital.com/work) is organized around
  individual launches and campaigns, confirming that the launch is the useful
  unit of work.

Those public performance and network claims are self-reported. This plan uses
them to understand the company's workflow, not as independently verified
results.

### Product implication

The strongest work sample is not another social analytics dashboard. It is a
small version of the decision Sociall Capital appears to make before and during
every launch:

```text
Understand the product
  → choose proven story patterns
  → match each pattern to credible creators
  → adapt hooks using verified product facts
  → monitor whether distribution is accelerating
```

## 4. Research synthesis

### 4.1 Existing research to retain

The existing research folder establishes several useful constraints:

- A creator should be compared with their own historical norm, not only with
  larger accounts.
- One successful post is weak evidence; repeated performance is more useful.
- Metrics compared across posts need a consistent observation horizon.
- Popularity, reach, influence, and virality are different constructs.
- A small observed sample cannot establish platform-wide origin or causal
  influence.

The most relevant internal sources are:

- [`03-metric-taxonomy.md`](../research/03-metric-taxonomy.md)
- [`05-creator-consistency.md`](../research/05-creator-consistency.md)
- [`06-data-and-evaluation-requirements.md`](../research/06-data-and-evaluation-requirements.md)
- [`09-mvp-metric-recommendation.md`](../research/09-mvp-metric-recommendation.md)

### 4.2 New research implications for the pivot

**Creator–product–audience fit must be a gate, not a decorative score.** An
experimental influencer-marketing study found that congruence among the
influencer, product, and consumer affected product attitudes and behavioral
intentions. Its Instagram fashion setting does not transfer directly to B2B X,
but it directionally supports evaluating fit before reach. See
[Belanche et al. (2021)](https://doi.org/10.1016/j.jbusres.2021.03.067).

**Early sharing behavior is useful for monitoring, but not a promise of final
reach.** Cascade research finds that temporal and structural observations can
help estimate continued growth, while also emphasizing uncertainty. See
[Cheng et al. (2014)](https://arxiv.org/abs/1403.4608) and
[Zhao et al. (2015)](https://arxiv.org/abs/1506.02594). The MVP should therefore
show early velocity against a creator's own baseline instead of claiming a
precise final view count.

**A large view count does not prove peer-to-peer virality.** Diffusion can be
driven by a large broadcast, a multigenerational cascade, or a mixture of both.
See
[Goel et al. (2016)](https://doi.org/10.1287/mnsc.2015.2158). The interface
should use “reach,” “spread,” and “velocity” unless it has actual cascade data.

**Owned and public analytics must be separated.** X's
[Post and Video Activity dashboards](https://business.x.com/en/help/campaign-measurement-and-analytics/tweet-activity-dashboard)
include impressions, link clicks, reposts, engagement, and video retention for
the account owner. Public historical posts do not expose all of those signals.
The MVP may display private metrics only when they are explicitly supplied; it
must not invent or estimate them from likes.

LinkedIn also offers rich post analytics, but those analytics are visible to
the content owner. Its
[official help page](https://www.linkedin.com/help/linkedin/answer/a1466099)
lists discovery, profile, social, link, video, and audience data. That makes
LinkedIn viable later, but adding a second platform now would double collection
and comparison rules without strengthening the first demo.

### 4.3 Research-backed product stance

- Use **historical evidence**, not a black-box virality score.
- Compare creators with their own relevant history.
- Treat product and audience fit as mandatory.
- Show repeatability and data coverage beside every recommendation.
- Use early velocity as a monitoring signal, not a forecast guarantee.
- Keep every source post and observation time auditable.

## 5. Product options considered

| Option | Strength | Main weakness | Decision |
| --- | --- | --- | --- |
| Keep the trend-scout dashboard | Reuses the most existing research | Indirectly answers the launch team's actual decision | Do not pursue as the main product |
| Build a searchable creator directory | Familiar and easy to browse | Becomes a generic database and does not express product judgment | Exclude from the MVP |
| Build only a hook generator | Demonstrates writing taste | Suggestions lack creator fit and performance evidence | Include hook suggestions inside recommendations, not as a standalone tool |
| Build a full live launch command center | Operationally valuable | Requires integrations, reliable private analytics, and alerting | Reduce to one snapshot-based monitor |
| Build a launch recommendation workspace | Directly supports creator, format, and hook selection | Requires disciplined evidence rules | **Chosen** |

The chosen product is a launch recommendation workspace with a thin monitoring
view. It is not a directory plus analytics plus campaign management suite.

## 6. Product brief

### Product name

**Launch Signal Map**

### Primary user

A Sociall Capital launch strategist or Head of Growth preparing an X product
launch.

### Secondary user

A thinker-writer who needs to adapt proven patterns into creator-specific
hooks. The MVP is optimized for the primary user; it does not add a separate
writer workflow.

### Job to be done

> When I receive a founder's launch brief, help me choose five credible
> creators and give each one a proven content direction, so I can defend the
> plan with evidence and move into drafting quickly.

### Trigger

The product, audience, proof points, desired action, and launch date are known,
but the creator roster and content plan are not.

### Current pain

The strategist must search past posts, remember which creators fit the buyer,
separate one-off hits from repeatable performance, adapt examples without
copying them, and keep the reasoning legible to the rest of the launch team.

### Product promise

Turn a structured launch brief and a small tagged evidence library into a
defensible launch plan: three patterns, five creators, and one tailored hook
direction for each creator.

### Platform

X only for the MVP. Sociall Capital works across X and LinkedIn, but one
platform keeps content norms, metrics, and evidence comparable.

### Product posture

- Recommendation, not guarantee.
- Evidence, not mystique.
- Human review, not automatic publishing.
- One launch at a time, not portfolio management.

## 7. The smallest convincing MVP

The product has three stages and no more:

```text
1. Brief                   2. Plan                         3. Monitor
Product + audience    →    3 patterns + 5 creator    →    1h / 6h / 24h
goal + proof points        combinations + evidence        velocity snapshots
```

### Stage 1 — Launch brief

The brief asks for only the information required to make the recommendation:

| Field | Why it is needed |
| --- | --- |
| Product and one-sentence promise | Defines what is being launched |
| Target audience | Gates creator fit |
| Primary launch objective | Distinguishes reach from click-oriented plans |
| Desired audience action | Keeps hooks tied to a real outcome |
| Verified proof points | Supplies factual material for hooks |
| Claims or themes to avoid | Prevents unsafe or off-brand recommendations |
| Launch date | Anchors the monitoring view |

The demo should open with one complete brief already loaded. Editing the brief
is useful, but broad free-form research across every possible product category
is not part of the MVP.

Primary action: **Build launch plan**.

### Stage 2 — Launch plan

The plan page contains two tightly connected sections.

#### A. Three pattern cards

Each card shows:

- the reusable story format;
- the recommended hook type;
- why the combination fits this product and audience;
- two or three source posts from at least two creators;
- the historical reach/spread evidence; and
- one risk or condition, such as “requires a defensible benchmark.”

The cards describe the pattern, not just a topic. “AI agents” is a topic;
“show the agent completing a task while a specific result opens the post” is a
pattern.

#### B. Five creator × pattern × hook cards

Each recommendation shows, in this order:

1. creator and intended launch role;
2. recommended story format and asset type;
3. one tailored hook direction;
4. a one-sentence reason the creator fits the audience;
5. two or three comparable source posts;
6. repeatability, creator-relative reach, and repost evidence;
7. evidence state: `Supported` or `Provisional`; and
8. one visible risk or missing input.

The hook is editable and copyable. It must use only proof points supplied in
the launch brief. The product may adapt a structure, but it must not copy a
source post's wording or invent a product claim.

A single **Copy launch plan** action exports the brief, three patterns, five
creator assignments, hooks, and evidence links as readable text. The MVP does
not need PDF generation, collaboration, or approval workflows.

### Stage 3 — Launch monitor

The monitor shows the launch posts at three checkpoints:

- 1 hour;
- 6 hours; and
- 24 hours.

For each post it shows:

- views and view velocity;
- reposts and repost velocity;
- repost rate;
- replies as context;
- link click-through rate when supplied by the account owner; and
- video retention when the post is a video and owner analytics are supplied.

Every available metric is compared with the creator's historical median at the
same checkpoint and for a comparable asset type. The monitor uses plain states:

- **Ahead of baseline**
- **Within baseline range**
- **Behind baseline**
- **Insufficient comparison data**

It does not predict final views. It answers the narrower operational question:

> Which launch posts are spreading faster or slower than this creator's usual
> comparable post at the same age?

## 8. Recommendation model

### 8.1 Unit of recommendation

The product recommends a **combination**, not a creator in isolation:

```text
creator + audience role + story format + asset type + hook type
```

A creator may be generally strong and still be a weak choice for this product,
audience, or format.

### 8.2 Launch-specific candidate pool

The demo should use approximately 12 prequalified X creators selected for the
brief's domain. This is a launch-specific subset of a hypothetical larger
network, not a claim to model Sociall Capital's full creator roster.

All candidates are assumed to have already cleared operational checks such as
availability, commercial terms, conflicts, and willingness to participate.
Contracting and creator outreach are outside the product.

### 8.3 Hard gates

A creator can be recommended only when:

- their normal audience materially overlaps the brief's target audience;
- they have a stable, active X account with original content;
- the evidence library contains enough ordinary history for a baseline;
- at least one historical post is comparable to the proposed story format;
- required product claims are credible in their voice; and
- no manual exclusion or conflict flag is present.

Follower count is context, not a substitute for fit.

### 8.4 Evidence lenses

Keep the lenses separate instead of blending them into a single virality score.

| Lens | Question | Display |
| --- | --- | --- |
| Audience fit | Does this creator reliably reach the people named in the brief? | Strong / partial / mismatch with supporting tags |
| Pattern proof | Has this format worked for this creator before? | Comparable posts and creator-relative view lift |
| Hook proof | Has a similar opening device worked before? | Closest historical example or “new combination” |
| Repeatability | Was performance repeated rather than a one-off? | Number above baseline / number comparable |
| Reach context | What distribution range has the creator historically achieved? | Historical range, never a promised forecast |
| Spread quality | Did viewers repost or click, when those denominators exist? | Repost rate and optional CTR |
| Trend readiness | Has the creator previously used relevant patterns early? | Optional supporting chip only |

### 8.5 Evidence states

**Supported recommendation**

- clear audience fit;
- at least ten comparable baseline posts at a consistent historical horizon;
- at least two posts using the relevant or closely related format;
- at least one comparable post materially above the creator's normal reach;
- no unresolved label or metric issue.

**Provisional recommendation**

- clear audience fit, but only five to nine baseline posts; or
- only one directly comparable pattern example; or
- a required metric is unavailable while the remaining evidence is positive.

**Do not recommend**

- audience mismatch;
- fewer than five baseline posts;
- no comparable content evidence;
- unsupported product claims; or
- unresolved data provenance.

The product should prefer supported recommendations. If fewer than five exist,
it should show fewer than five and explain why, rather than padding the roster.

### 8.6 Ordering and roster composition

Within the supported group, order combinations by:

1. audience fit;
2. repeat performance with the proposed pattern;
3. creator-relative historical reach;
4. repost evidence; and
5. broader historical reach as the final tiebreak.

The final roster should cover the three selected patterns and label each
creator's role, such as technical validator, operator-educator, founder
storyteller, niche audience specialist, or broad tech amplifier. These roles
explain the portfolio; they are not permanent creator classifications.

## 9. Content codebook for the MVP

Manual labeling is the right choice for this work sample. It is small,
auditable, and better able to represent taste than keyword matching. Automated
clustering, embeddings, and machine-learned format discovery are unnecessary.

| Labeling approach | Benefit | Problem for this MVP | Outcome |
| --- | --- | --- | --- |
| Manual closed codebook | Auditable and expresses human taste | Requires careful review | **Chosen** |
| AI-assisted labeling | Faster on a larger library | Adds inconsistency and review work before the codebook is stable | Defer |
| Embedding or cluster discovery | May surface unknown groupings | Often blends topic, wording, and format and is hard to explain | Exclude |
| Keyword or hashtag rules | Cheap retrieval aid | Misses visual and narrative structure | Use only to find candidates, not to label patterns |

Each post receives:

- one primary `story format`;
- one primary `hook type`;
- one `asset type`;
- audience and topic tags; and
- `unclassified` when the evidence does not fit cleanly.

### 9.1 Story formats

| Story format | Definition | Not this |
| --- | --- | --- |
| Product demonstration | Shows the product completing a concrete job or producing a visible before/after result | A generic announcement with no product action |
| Proof stack | Builds credibility through benchmarks, customers, usage, funding, or several concrete facts | One unsupported superlative |
| Founder journey | Uses a problem, setback, decision, and outcome to explain why the product exists | A biography unrelated to the launch |
| Category reframe | Explains why the old way is broken and presents a new way to understand the category | A provocative sentence with no argument |
| Customer transformation | Follows one user or team from pain to measurable outcome | A loose testimonial without a result |
| Challenge or stunt | Creates a public test, constraint, giveaway, or high-stakes demonstration | Engagement bait disconnected from product value |

The selected work provides useful public examples of several of these
structures: proof-heavy announcements, founder journeys, category claims, and
the Wispr Flow challenge. These examples inform the codebook; they are not
proof that one format will work for every product.

### 9.2 Hook types

| Hook type | Opening device | Required guardrail |
| --- | --- | --- |
| Specific result | Leads with a concrete number or outcome | Number must be verified in the brief |
| Bold category claim | States a sharp “first,” “fastest,” or category-defining claim | Claim must be defensible |
| Contrarian problem | Challenges the accepted way of doing the job | Body must support the disagreement |
| Personal reveal | Opens a founder or operator story with an unresolved tension | Must be a true, approved story |
| High-stakes challenge | Introduces a public test, wager, or difficult constraint | Stakes must connect to product proof |

Use one primary hook label even when a post has secondary qualities. A short
label note records borderline cases.

### 9.3 Asset types

Asset type remains separate from story format:

- single text post;
- thread;
- image or carousel; and
- video.

This prevents “video” and “founder story” from competing as if they described
the same property.

## 10. Metrics and evidence policy

### 10.1 Historical planning evidence

Historical evidence should emphasize the outcomes relevant to a launch:

1. **Creator-relative view lift** at a consistent fixed horizon.
2. **Repost rate** and creator-relative repost performance.
3. **Repeatability** across comparable posts.
4. **Link CTR or video retention** only when owner-supplied analytics exist.
5. Likes and replies as supporting context, not the primary recommendation
   target.

The exact formulas and thresholds belong in the technical specification. The
product requirement is simpler: every comparison must use the same metric,
post age, and asset class wherever possible.

Do not present current lifetime counts as seven-day counts. If a consistent
horizon is unavailable, label the recommendation `Provisional` or use clearly
marked demo data. Never silently repair missing view, CTR, or retention data
with likes.

### 10.2 Launch-day evidence

The monitor should compare like with like:

- 1-hour launch views versus the creator's historical 1-hour view median;
- 6-hour repost velocity versus the historical 6-hour median;
- 24-hour spread versus the historical 24-hour median; and
- the same asset type wherever sufficient examples exist.

The visual should show actual counts, the baseline, and the ratio or difference.
It should not collapse view velocity, repost rate, CTR, and retention into one
number.

### 10.3 Data provenance shown in the interface

Every evidence item needs:

- source-post link;
- post timestamp;
- metric observation timestamp;
- post age at observation;
- whether the metric is public or owner supplied;
- comparable-post count; and
- any missing-data or label warning.

### 10.4 Early-trend evidence retained from the old product

If existing analysis shows that a creator repeatedly used a relevant format
early within an observed cohort, show an `Early pattern use` chip in the
evidence drawer. It must include the comparison cohort and supporting post.

It does not automatically improve the recommendation order. Product fit and
proven performance for the proposed combination remain more important.

## 11. Information architecture and interaction design

### Navigation

Use a three-step header:

```text
Brief  →  Plan  →  Monitor
```

No global creator directory, settings area, notifications center, or admin
console is needed.

### Plan-page hierarchy

```text
Launch name · audience · objective · date

[ Pattern 1 ]  [ Pattern 2 ]  [ Pattern 3 ]

Recommended roster
[ Creator 1 × pattern × hook ]
[ Creator 2 × pattern × hook ]
[ Creator 3 × pattern × hook ]
[ Creator 4 × pattern × hook ]
[ Creator 5 × pattern × hook ]

[ Copy launch plan ]
```

Recommendation cards are summaries. Evidence opens inline or in a side panel
so the user never loses the roster context.

### Key interactions

- Edit the launch brief.
- Build or refresh the plan.
- Open source evidence.
- Edit and copy a suggested hook.
- Exclude a creator and reveal the next eligible recommendation.
- Copy the full plan.
- Switch the monitor between 1h, 6h, and 24h snapshots.

There is no drag-and-drop campaign builder. Excluding a creator is the only
roster-management interaction required for the MVP.

### Empty and incomplete states

| State | Product response |
| --- | --- |
| Brief missing a target audience | Block plan creation and explain why audience fit cannot be assessed |
| Fewer than five supported matches | Show the supported matches plus clearly labeled provisional options; never hide the shortage |
| No comparable posts for a pattern | Remove the pattern from recommendations |
| Metrics captured at different ages | Mark comparison unavailable rather than calculate it |
| Monitoring checkpoint not reached | Show the next expected snapshot time |
| Owner-only metric absent | Hide it or mark it unavailable; do not show zero |

### Visual direction

- Editorial and evidence-led, closer to a launch memo than a trading terminal.
- Neutral dark ink and warm off-white foundation with one bright signal color.
- Large recommendation headlines, compact evidence rows, and restrained
  sparklines only in the monitor.
- No map visualization, opaque score dials, confetti, or dense dashboard grid.
- Creator photos support recognition but never dominate the evidence.

### Accessibility

- All status states include text and do not rely on color alone.
- Source links and controls have descriptive labels.
- Cards and evidence panels are keyboard reachable.
- Charts expose the same values in text.
- Contrast meets WCAG AA.

## 12. Demo dataset and scenario

### Recommended demo scenario

Use one realistic but fictional AI developer-tool launch. A fictional brief
avoids implying access to a client strategy while still matching Sociall
Capital's public technology-launch focus.

Example:

- Product: an AI debugging agent.
- Audience: engineering leaders and hands-on developers at software startups.
- Objective: qualified reach and waitlist visits.
- Desired action: watch the demonstration, then join the waitlist.
- Proof points: only explicitly supplied and verifiable product facts.

### Dataset size

Keep the demo intentionally small:

- approximately 12 launch-relevant creators;
- at least 10 ordinary baseline posts per supported creator;
- at least two directly comparable examples for a supported
  creator–pattern recommendation;
- three recommended patterns; and
- five final creator combinations.

The product should include ordinary posts, not only viral-looking examples.
This size is enough to demonstrate matching, repeatability, evidence quality,
and monitoring without pretending to model a 500-creator network.

### Data realism rule

Use real public posts and links where collection supports a fair comparison.
If fixed-horizon snapshots or private analytics are not available, use clearly
marked synthetic demo metrics rather than mislabeling current public counts.
The interface must visibly distinguish `Public`, `Owner supplied`, and
`Demo data`.

## 13. Example end-to-end output

For the fictional AI debugging launch, the plan might select:

1. **Product demonstration + specific-result hook** for a technical creator
   who has repeatedly earned above-baseline reach on workflow videos.
2. **Proof stack + bold-category hook** for an AI commentator whose benchmark
   posts are repeatedly reposted by builders.
3. **Founder journey + personal-reveal hook** for an operator whose audience
   responds to detailed company-building stories.
4. A second demonstration adapted for a niche developer educator.
5. A category reframe adapted for a broader technology amplifier.

Each card would explain the evidence and show the actual proposed hook. This
section describes the shape of a result; it does not preselect real creators or
invent performance data.

## 14. Product success criteria

The MVP succeeds when it proves decision usefulness, not when it appears
feature-complete.

### User test

Give the product to at least two people who understand technology launches but
did not build it. Ask them to:

1. explain why each of the five creators was recommended;
2. identify the weakest recommendation;
3. choose the strongest pattern for the brief;
4. copy a creator-specific hook into a launch memo; and
5. identify which monitored post needs attention.

### Acceptance criteria

- A new reviewer can understand the brief, three patterns, and five-person
  roster without a spoken walkthrough.
- Every creator recommendation has traceable evidence or is visibly
  provisional.
- At least four of five recommendations are judged plausible by both target-like
  reviewers.
- Reviewers can distinguish audience fit, repeatability, reach, and spread.
- No hook contains a claim absent from the brief.
- The monitor correctly communicates which prepared examples are ahead of,
  within, or behind their own baseline.
- The product never claims guaranteed reach, causal influence, or
  platform-wide virality.

### Product-quality bar

The work sample should feel polished in four places:

- clarity of the brief;
- quality and specificity of the three patterns;
- evidence density and writing quality of the five recommendations; and
- legibility of the early-velocity monitor.

Everything else is secondary.

## 15. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Recommendations merely favor large creators | Gate on audience fit and show creator-relative evidence before reach context |
| Manual labels encode personal taste inconsistently | Use the closed codebook, preserve label notes, and have a second person review a subset |
| Historical metrics are not comparable | Require observation timestamps and fixed horizons; mark gaps provisional |
| Hook suggestions invent attractive claims | Generate or write only from approved brief facts and show the linked proof point |
| Five creators look individually good but form a repetitive roster | Display each launch role and cover all three selected patterns |
| Early monitoring overstates certainty | Compare with personal baselines and avoid final-reach forecasts |
| Demo data is mistaken for Sociall Capital data | Label provenance prominently and state that the roster is illustrative |

## 16. Explicit non-goals

The MVP will not include:

- LinkedIn analysis;
- a 500-creator searchable directory;
- live X or LinkedIn APIs;
- large-scale scraping;
- automatic creator outreach or contracting;
- budgets, rates, or payment management;
- collaborative approvals;
- full post or thread generation;
- automatic publishing;
- real-time alerts;
- machine-learning ranking, embeddings, or clustering;
- causal influence claims;
- predicted or guaranteed final reach;
- a single blended virality score; or
- a standalone trend-scout leaderboard.

Add any of these only after the core plan is useful in reviewer testing.

## 17. Decisions recommended by this plan

These are complete recommendations, but they remain proposed until the project
owner approves the pivoted design.

| ID | Recommendation | Status |
| --- | --- | --- |
| P-001 | Rename the product Launch Signal Map | Proposed |
| P-002 | Make a launch strategist the primary user | Proposed |
| P-003 | Make creator × format × hook the recommendation unit | Proposed |
| P-004 | Support one X launch at a time | Proposed |
| P-005 | Produce three patterns and five creator combinations | Proposed |
| P-006 | Use a launch-specific pool of about 12 prequalified creators | Proposed |
| P-007 | Use audience fit as a hard gate and keep evidence lenses separate | Proposed |
| P-008 | Use a manual closed format/hook codebook | Proposed |
| P-009 | Replace seven-day likes with historical fixed-horizon reach and spread evidence | Proposed |
| P-010 | Add a snapshot-based 1h/6h/24h monitor | Proposed |
| P-011 | Keep early trend adoption only as optional supporting evidence | Proposed |
| P-012 | Use no blended score, ML discovery, or final-reach prediction | Proposed |

## 18. What the technical specification should decide later

The next planning document should translate this product design into:

- exact data files and validation rules;
- precise baseline and evidence-state formulas;
- the rule-based matching and tiebreak sequence;
- whether the demo uses real, owner-supplied, or synthetic snapshots;
- application architecture and storage;
- component and route structure;
- test cases; and
- deployment and build milestones.

Those choices should not broaden the product beyond the three-stage experience
defined here.
