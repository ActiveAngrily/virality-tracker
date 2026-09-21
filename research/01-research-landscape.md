# Research Landscape

## Scope

This is a Stage 1 map of research areas relevant to a Creator Signal Map. It
describes what the literature studies, the data and methods it commonly uses,
and where the evidence does or does not transfer to a small creator-post
dataset. It does not select metrics, thresholds, weights, formulas, or product
decisions.

Source IDs such as [EA-01] resolve to the primary-source records in
[`02-source-library.md`](./02-source-library.md). The source links at the end
of this file are direct publication, DOI, or official dataset links.

## Working distinctions

The literature uses these terms inconsistently. These are reading
distinctions, not final project definitions.

| Term | What it usually means in the literature | What it does not establish by itself |
| --- | --- | --- |
| Early adoption | A person, account, or group uses an emerging pattern earlier than a defined comparison population. | That the pattern will become popular, influential, or valuable. |
| Early-adopter identification | Ranking or classifying people likely to adopt an innovation or participate early, often from prior behavior or network position. | That the person caused the diffusion or will repeat the behavior. |
| Trend emergence | A population-level increase, burst, or lifecycle in a topic, phrase, behavior, or format. | That one creator originated it, or that the trend is durable. |
| Influence | The ability to affect what others see, do, or adopt; studies may measure causal effects or observed propagation. | That follower count, reach, or one large post proves influence. |
| Virality | Rapid or unusually broad peer-to-peer propagation, sometimes defined by cascade speed or tree structure. | That a high view count came from peer diffusion rather than recommendation or broadcast exposure. |
| Popularity | The amount of observed attention or activity, such as views, followers, shares, or concurrent viewers. | That the content was early, causally influential, or repeatedly successful. |
| Traction | Evidence of response or growth relative to a baseline or time window. | A universal construct; studies operationalize it differently. |
| Consistency | Repeated performance or repeated early behavior across posts, periods, or patterns. | A single successful observation. |
| Trend validation | Later evidence that an early signal corresponded to broader adoption, persistence, or meaningful response. | A guarantee that the early signal was causal or will recur. |

The central separation for this project is **timing versus outcome**. Early
adoption asks when a creator first uses a pattern relative to others. Virality,
popularity, influence, traction, and consistency describe different possible
outcomes or longitudinal properties. A later successful post can help validate
an early signal, but it cannot retroactively make the adoption early.

## Research areas

### 1. Early trend adoption

- **Problem:** Identify who uses an emerging topic, phrase, behavior, or
  format early, usually relative to a trend lifecycle or peer population.
- **Why relevant:** This is the closest literature to the project’s core
  question. Status Gradient compares adoption timing with prior activity level
  across several communities [EA-01]; work on Weibo trends compares the early
  roles of ordinary users and opinion leaders [EA-02].
- **Usual data:** Timestamped posts or documents, author IDs, a detectable
  topic or pattern, and enough observations to estimate first or early use.
- **Methods:** Burst or lifecycle detection; earliest-use cohorts; relative
  adoption-time ranks; comparisons by prior activity, network position, or
  account history.
- **How it differs:** It is about relative timing, not final reach or cascade
  size. It can be studied even when the later outcome is unknown.
- **Small-dataset limit:** A small sample may not contain the true emergence
  point or the comparison population. First observed use may be left-censored,
  a data-collection artifact, or simply the earliest sampled post.

### 2. Early-adopter identification

- **Problem:** Predict or rank people likely to adopt an innovation or
  participate in future diffusion before broad adoption occurs.
- **Why relevant:** These studies make the early-adopter concept explicit.
  They use prior network behavior, homophily, or copied-follow patterns rather
  than treating later popularity as evidence of early adoption [EA-03]
  [EA-04] [EA-05].
- **Usual data:** Historical adoption events, social/follow graphs, timestamps,
  and sometimes profiles or prior content.
- **Methods:** Centrality and candidate-ranking comparisons; random walks;
  link-propagation inference; supervised or semi-supervised prediction.
- **How it differs:** The target is a person’s adoption timing or likelihood,
  not the popularity of the adopted item. Identification may be predictive,
  descriptive, or causal depending on the design.
- **Small-dataset limit:** Network features are unstable when only a small
  local graph is visible. Rankings can reproduce sampling bias and cannot
  distinguish early adoption from early exposure without exposure data.

### 3. Trend emergence

- **Problem:** Detect when a topic, entity, phrase, or behavior becomes
  measurably salient and characterize its rise, peak, persistence, and decay.
- **Why relevant:** A creator can only be “early” relative to an emergence
  process. Trend-lifecycle research also shows that successive trend stages
  can have different participants and communities [EA-06].
- **Usual data:** High-volume timestamped text, hashtags, entities, search
  queries, or interaction events over a long enough period to establish a
  baseline.
- **Methods:** Time-series change detection; burst detection; lifecycle
  curves; clustering and entity linking; dynamic topic or network analysis.
- **How it differs:** The unit is the population-level pattern. It does not
  require a single originator and does not imply that the trend is beneficial
  or durable.
- **Small-dataset limit:** Sparse counts make baseline and change-point
  estimates noisy. A small creator sample can show local uptake without
  supporting a claim about platform-wide emergence.

### 4. Information diffusion

- **Problem:** Explain how information moves through people, networks, and
  platforms, including the roles of exposure, social reinforcement, and weak
  or strong ties.
- **Why relevant:** Diffusion evidence helps distinguish an early adopter from
  an account that merely received broad distribution. Facebook experiments find
  exposure changes sharing behavior, while hashtag studies find topic-specific
  diffusion mechanics [DF-01] [DF-05].
- **Usual data:** Exposure or feed-order data, social graphs, timestamps,
  reshares, replies, mentions, and content or topic labels.
- **Methods:** Field experiments; observational exposure models; contagion and
  complex-contagion models; temporal network analysis.
- **How it differs:** Diffusion asks how adoption or attention moves between
  actors. It is broader than a post’s final count and narrower than general
  audience growth.
- **Small-dataset limit:** Without exposures and network edges, observed
  ordering cannot establish who influenced whom. Platform recommendation can
  be mistaken for social diffusion.

### 5. Information cascades

- **Problem:** Model the branching, depth, size, timing, and structure of
  reshare cascades.
- **Why relevant:** Cascade studies make a sharp distinction between a large
  broadcast and a deep or peer-driven cascade. Structural virality finds that
  many large diffusion events are dominated by broadcast-like structure
  [DF-02]; cascade-growth work shows that similar sizes can have different
  dynamics [DF-03] [DF-04].
- **Usual data:** Full or near-full cascade trees, parent-child reshare links,
  timestamps, user attributes, and exposure or protocol information.
- **Methods:** Branching-process models; tree statistics; structural virality;
  stage-wise prediction; protocol classification.
- **How it differs:** A cascade is a diffusion topology, not simply a high
  count. A creator-post sample usually observes posts but not the full parent
  tree.
- **Small-dataset limit:** Missing parent links make depth and structural
  measures unidentified. Large cascades are rare, so a small sample is also
  vulnerable to severe class imbalance and survivorship bias.

### 6. Virality and popularity prediction

- **Problem:** Predict future views, reshares, cascade size, or a later
  popularity class from early observations.
- **Why relevant:** These papers show what later success can and cannot tell us
  about an early signal. Can Cascades be Predicted? uses successive reshare
  stages [VP-01]; SEISMIC forecasts final retweets from early activity
  [VP-02]; TrendLearner models view trajectories [VP-04].
- **Usual data:** Early time series, content metadata, follower or network
  features, reshare events, and a later outcome label.
- **Methods:** Feature-based classifiers and regressors; trajectory
  clustering; point processes; graph neural networks; early-versus-late
  evaluation.
- **How it differs:** The target is an outcome after the post or cascade has
  started. Virality and popularity are not interchangeable, and neither is
  early adoption.
- **Small-dataset limit:** Outcome labels are highly skewed and sensitive to
  observation horizon. A small dataset cannot reliably estimate rare-event
  tails or separate content quality from distribution exposure.

### 7. Creator growth and trajectory

- **Problem:** Explain or predict account-level growth, follower accumulation,
  audience composition, or repeated performance over time.
- **Why relevant:** Growth research supplies longitudinal context and warns
  that early audience composition can differ from later audience composition
  [CG-02]. PopFactor links cross-platform behavior and effort to relative
  creator growth [CG-01].
- **Usual data:** Longitudinal creator profiles, posts, follower counts,
  impressions or viewers, interactions, and platform or cross-platform history.
- **Methods:** Cohort comparisons; growth curves; mixed-effects models;
  temporal interaction models; early-growth prediction.
- **How it differs:** The unit is the creator trajectory, not whether a creator
  adopted a trend early. Growth can be an outcome or validation context.
- **Small-dataset limit:** Cross-sectional snapshots cannot establish growth.
  A few creators create unstable trajectories, while platform changes and
  survivorship distort comparisons.

### 8. Influence measurement

- **Problem:** Measure whether and how much an account affects the behavior or
  attention of other users.
- **Why relevant:** Influence is often conflated with reach or followers.
  The Million Follower Fallacy shows that follower count, retweets, and
  mentions capture different properties [IM-01].
- **Usual data:** Follow graphs, mentions, retweets, replies, exposures,
  downstream adoption, and sometimes randomized or quasi-experimental data.
- **Methods:** Centrality and ranking; diffusion attribution; causal
  experiments; topic-sensitive influence scores.
- **How it differs:** Influence is about effect or propagation, not merely
  early timing, popularity, or audience size. Observed correlation is weaker
  than causal influence.
- **Small-dataset limit:** Causal influence is generally not identifiable from
  a manually collected post list. Confounding by topic, recommendation, and
  audience size is substantial.

### 9. Burst detection

- **Problem:** Detect unusually intense or changing activity in a stream and
  identify its levels, duration, or hierarchy.
- **Why relevant:** Bursts provide one way to locate an emergence window before
  assigning creator-level timing. Kleinberg’s model formalizes nested burst
  states [BT-02]; later work applies burst detection to entities and events
  [BT-03] [BT-04].
- **Usual data:** Timestamped tokens, entities, posts, links, or event
  clusters, with a sufficiently long background stream.
- **Methods:** Infinite-state automata; change-point models; online clustering;
  time-sensitive entity scoring.
- **How it differs:** Burstiness is a property of a stream, not proof that a
  creator caused the burst or that the burst will persist.
- **Small-dataset limit:** A short or sparse sample makes the baseline and
  intensity states sensitive to parameterization. External news can create a
  burst unrelated to creator innovation.

### 10. Meme tracking

- **Problem:** Track how a phrase, story, link, or other recognizable unit
  appears and propagates across sources over time.
- **Why relevant:** MemeTracker shows how temporal traces can connect source
  activity and later copies [BT-01]. It is useful for studying propagation,
  but its text-unit assumptions do not directly cover video format or hook
  transformations.
- **Usual data:** Large collections of articles or posts, short distinctive
  phrases, links, timestamps, and source IDs.
- **Methods:** Phrase extraction and clustering; source-transition graphs;
  temporal lag analysis; diffusion-network inference.
- **How it differs:** Meme tracking follows a recognizable information unit.
  A format or hook may mutate across audio, visual, editing, and caption
  features without preserving a phrase.
- **Small-dataset limit:** Phrase clusters are brittle with few observations,
  and source coverage determines apparent origin. The approach can miss
  multimodal or semantically transformed reuse.

### 11. Content format and hook analysis

- **Problem:** Describe or compare recurring content structures, openings,
  editing patterns, audio, visual motifs, captions, or narrative devices, and
  relate them to response or adoption timing.
- **Why relevant:** This is the most direct bridge from topic-level research to
  creator-format research, but it is underrepresented in the core sources
  above. TrendLearner demonstrates the value of content and trajectory
  features for video prediction [VP-04], while most early-adoption sources
  study text, hashtags, or network behavior.
- **Usual data:** Video or image files, transcripts, audio, captions,
  thumbnails, metadata, post times, creator IDs, and human or machine-coded
  format labels.
- **Methods:** Manual codebooks; multimodal embeddings; sequence or
  time-aligned feature extraction; clustering; content analysis; controlled
  or quasi-experimental comparisons.
- **How it differs:** Format/hook is a content construct, whereas topic
  emergence and diffusion are population or network constructs. A format can
  be adopted early without being a new topic, and a topic can spread across
  many formats.
- **Small-dataset limit:** Manual labels have coder uncertainty; automated
  features can be opaque; small samples make rare formats look decisive. The
  evidence may describe association rather than causal lift.

### 12. Temporal point processes

- **Problem:** Model event intensity over time, including self-excitation,
  decay, seasonality, and the effect of observed network or content features.
- **Why relevant:** SEISMIC uses a self-exciting process to predict retweets
  from early activity [VP-02]. TiDeH extends Hawkes-style modeling with
  time-dependent effects and network structure [TP-01].
- **Usual data:** Event timestamps, event types, user or network attributes,
  and sometimes content covariates.
- **Methods:** Hawkes and self-exciting processes; time-varying kernels;
  likelihood estimation; point-process forecasting.
- **How it differs:** The method models event timing and intensity. It can
  describe an unfolding response but does not by itself define early adoption,
  content meaning, or causal influence.
- **Small-dataset limit:** Parameter estimates are fragile with few events and
  incomplete observation. The model needs a defensible event process; a sparse
  post table is not automatically enough.

### 13. Social network analysis

- **Problem:** Represent relationships and interaction structure, then study
  position, communities, homophily, paths, and diffusion through the network.
- **Why relevant:** Early-adopter work uses network history and homophily
  [EA-04]; influence and diffusion work uses graphs to distinguish structural
  position from observed response [IM-01] [IM-02].
- **Usual data:** Follow, friendship, reply, mention, reshare, or inferred
  diffusion edges, plus timestamps and node attributes.
- **Methods:** Centrality; community detection; temporal networks; random
  walks; PageRank-like ranking; network inference.
- **How it differs:** SNA supplies relational context. It is not itself a
  metric for early adoption or content quality.
- **Small-dataset limit:** Missing edges and platform sampling change the
  graph. An induced subgraph can make centrality incomparable across creators
  and cannot support claims about the full platform.

### 14. Ranking and recommendation

- **Problem:** Order users, items, or candidates for attention, prediction,
  exploration, or intervention under a chosen objective.
- **Why relevant:** Early-adopter studies rank candidate adopters [EA-04]
  [EA-05], while TwitterRank ranks topic-sensitive influential users [IM-02].
  These are useful methodological precedents but optimize different targets.
- **Usual data:** Candidate-item interactions, graph structure, labels or
  outcomes, exposure logs, and time splits.
- **Methods:** Centrality; PageRank; random walks; learning-to-rank;
  collaborative filtering; supervised ranking.
- **How it differs:** A ranking system requires a target, comparison set, and
  evaluation protocol. A descriptive research map should not silently turn a
  literature ranking into a product score.
- **Small-dataset limit:** Rankings overfit quickly, especially with few
  positive outcomes. Without exposure logs, offline ranking metrics can reward
  popularity and selection bias.

### 15. Engagement and audience quality

- **Problem:** Characterize the quantity, speed, depth, relevance, and
  composition of audience response rather than treating all interactions as
  equivalent.
- **Why relevant:** Creator and influence studies show that followers,
  retweets, mentions, viewers, and financial interactions capture different
  dimensions [IM-01] [CG-01]. Audience dilution research shows that audience
  composition can change as an account grows [CG-02].
- **Usual data:** Impressions or views, likes, comments, shares, saves,
  follower history, repeat audience behavior, audience profiles, and
  exposure denominators.
- **Methods:** Cohort analysis; engagement-rate normalization; retention and
  repeat-response analysis; audience composition; causal experiments where
  available.
- **How it differs:** Engagement is observed response; audience quality is a
  construct about relevance, authenticity, or durable value that needs an
  explicit definition. Neither is the same as early adoption or virality.
- **Small-dataset limit:** Without impressions or audience histories, rates
  and quality claims are underidentified. Public counts are vulnerable to
  bots, hidden audiences, platform changes, and denominator mismatch.

## What is most useful for early-versus-successful separation?

The literature suggests a layered reading rather than one combined score:

1. **Direct early-signal evidence:** early adoption, early-adopter
   identification, trend emergence, burst detection, and—when the data support
   it—format or hook analysis.
2. **Mechanism and context:** information diffusion, cascades, temporal point
   processes, meme tracking, and social-network analysis. These explain how an
   early signal might travel, but usually require data that a small creator
   sample does not contain.
3. **Later outcome or validation evidence:** virality, popularity prediction,
   creator growth, influence, ranking, and audience quality. These can help
   test whether an early signal mattered, but they are not substitutes for
   adoption timing.

This ordering is an evidence map, not a proposed product architecture. In
particular, one viral post does not establish consistency, high views do not
establish virality, and a later trend peak does not establish who adopted it
first.

## Cross-cutting limitations for a small creator dataset

- **Observation boundary:** the first observed post may not be the first real
  adoption; platform-wide trend onset may be outside the sample.
- **Denominator and exposure:** counts lack meaning without knowing audience
  size, exposure, recommendation, and the relevant comparison population.
- **Rare outcomes:** viral or highly popular outcomes are heavy-tailed, so a
  small sample cannot estimate their distribution reliably.
- **Missing topology:** post lists usually lack full reshare parentage,
  exposure, and network edges, limiting cascade and influence claims.
- **Construct validity:** topic, format, hook, trend, and adoption may be
  coded differently by researchers or by platform.
- **Platform drift:** interface, ranking, audience norms, and APIs change;
  old Twitter, Facebook, YouTube, Weibo, and Twitch findings need transfer
  checks.
- **Selection and survivorship:** public or successful accounts are easier to
  observe, while deleted posts, private accounts, and failed creators vanish
  from the record.
- **Association versus cause:** observational alignment with a trend or
  outcome does not show that a creator caused the trend or that a format caused
  the response.

## Stage 2 questions raised by this landscape

1. What is the comparison population for “early”: all observed creators,
   creators active in the same topic, or a time-varying platform population?
2. How will the project detect an emerging pattern when it does not have a
   complete platform-wide stream?
3. Which content unit is being tracked: topic, phrase, visual format, audio,
   narrative hook, editing pattern, or a combination?
4. Which observations are adoption evidence, and which are only later outcome
   evidence?
5. What longitudinal evidence is needed before using “consistent” or
   “repeatable” language?
6. Which exposure, audience-size, and recommendation variables are available
   well enough to normalize observed response?
7. Which claims require a network or cascade dataset that the current sample
   cannot provide?
8. How will uncertainty, missing posts, deleted content, and annotation
   disagreements be recorded?
9. What external or internal validation set can test whether an early signal
   generalizes beyond the observed creators?
10. Which research findings are descriptive context only and should not be
    converted into a ranking or recommendation rule?

## Direct source links used in this landscape

[EA-01]: https://doi.org/10.1609/icwsm.v10i1.14725
[EA-02]: https://doi.org/10.1111/jcc4.12145
[EA-03]: https://doi.org/10.1016/j.ins.2017.09.034
[EA-04]: https://link.springer.com/article/10.1007/s13278-022-01012-5
[EA-05]: https://arxiv.org/abs/1512.02341
[EA-06]: https://doi.org/10.1609/icwsm.v17i1.22203
[VP-01]: https://doi.org/10.1145/2566486.2567997
[VP-02]: https://doi.org/10.1145/2783258.2783401
[VP-04]: https://doi.org/10.1016/j.ins.2016.02.025
[DF-01]: https://doi.org/10.1145/2187836.2187907
[DF-02]: https://doi.org/10.1287/mnsc.2015.2158
[DF-03]: https://doi.org/10.1609/icwsm.v7i1.14431
[DF-04]: https://doi.org/10.1609/icwsm.v12i1.15023
[DF-05]: https://doi.org/10.1145/1963405.1963503
[IM-01]: https://doi.org/10.1609/icwsm.v4i1.14033
[BT-01]: https://doi.org/10.1145/1557019.1557077
[BT-02]: https://doi.org/10.1145/775047.775061
[BT-03]: https://doi.org/10.24963/ijcai.2019/678
[BT-04]: https://doi.org/10.1145/3332185
[CG-01]: https://doi.org/10.1609/icwsm.v15i1.18073
[CG-02]: https://doi.org/10.1609/icwsm.v10i1.14804
[TP-01]: https://doi.org/10.1609/icwsm.v10i1.14717
[IM-02]: https://www.wsdm-conference.org/2010/proceedings/docs/p261.pdf
[VP-03]: https://doi.org/10.1145/3543873.3587373
[VP-05]: https://doi.org/10.1145/2647868.2655037
[VP-06]: https://doi.org/10.1609/icwsm.v9i1.14609
[VP-07]: https://arxiv.org/abs/0811.0405
