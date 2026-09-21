# Source Library

## How to read this library

This library prioritizes primary papers, official proceedings pages, DOI
records, author-hosted papers, and official dataset or repository pages. Each
entry separates the source’s reported evidence from its possible relevance to
the Creator Signal Map. “Product relevance” is a research-use note, not a
product requirement. Reported numeric cutoffs remain paper-specific and are
not recommendations.

Access notes are explicit where a paper, dataset, or full text could not be
verified from the accessible source page. Some dataset records correspond to a
paper listed elsewhere; they are kept separately because a dataset’s access
and reuse constraints matter.

The type field records publication status and research orientation. The paper
set is empirical unless marked methodological/empirical; arXiv-only records are
marked preprint. No industry report is used as a substitute for primary
research in the required minimum categories.

## Early trend adoption and early adopters

### EA-01 — [The Status Gradient of Trends in Social Media](https://doi.org/10.1609/icwsm.v10i1.14725)

- **Authors / year / venue / type:** Rahmtin Rotabi, Jon Kleinberg; 2016;
  Proceedings of the International AAAI Conference on Web and Social Media
  10(1), 319–328; peer-reviewed conference paper.
- **Research question:** Do users with different activity or status levels
  adopt newly emerging trends at different times?
- **Dataset:** Amazon reviews, Reddit communities, RateBeer and BeerAdvocate,
  DBLP titles, and arXiv titles; the paper reports large author-document
  collections across these domains.
- **Method:** Detect bursts in terms or concepts and compare adoption timing
  with prior user activity as a proxy for status.
- **Main finding:** Adoption timing exhibits a status gradient: users with
  different activity levels enter emerging trends at systematically different
  points.
- **Limitations / access:** The status proxy is domain-specific; burst and
  activity definitions are model choices; most data are text or community
  activity rather than creator video. High activity is not identical to
  expertise or influence.
- **Product relevance:** Strong conceptual precedent for separating early
  adoption from later popularity; useful for comparison-population and
  observation-window questions. It does not supply a creator-format metric.

### EA-02 — [Who creates Trends in Online Social Media: The Crowd or Opinion Leaders?](https://doi.org/10.1111/jcc4.12145)

- **Authors / year / venue / type:** Leihan Zhang, Jichang Zhao, Ke Xu; 2016;
  Journal of Computer-Mediated Communication 21(1), 1–16; peer-reviewed
  journal article.
- **Research question:** How do ordinary users and opinion leaders differ in
  the early creation and spread of Weibo slang trends?
- **Dataset:** Weibo posts sampled in 2013, including about 92 popular
  Internet-slang words and roughly 700,000 tweets per day; fields include
  timestamps, content, retweet status, and author follower information.
- **Method:** Compare early and later diffusion peaks, retweet steps, follower
  counts, and geographic spread.
- **Main finding:** Early crowd participation is associated with broader
  coverage in the studied trends, while early opinion-leader participation can
  produce smaller-scale coverage; the relative roles vary by trend.
- **Limitations / access:** One platform, language, period, and selected slang
  terms; observational design; results do not establish a universal crowd or
  leader mechanism.
- **Product relevance:** Direct precedent for asking who appears early in a
  trend and how early participation differs from later reach. It warns against
  assuming that early status and eventual breadth are the same property.

### EA-03 — [Forecasting participants of information diffusion on social networks with its applications](https://doi.org/10.1016/j.ins.2017.09.034)

- **Authors / year / venue / type:** Cheng-Te Li, Yu-Jen Lin, Mi-Yen Yeh;
  2018; Information Sciences 422, 432–446; peer-reviewed journal article.
- **Research question:** Can future participants in a diffusion process be
  forecast from early adopters and network information?
- **Dataset:** Twitter hashtag diffusion data; exact collection and sampling
  details should be checked in the full article before reuse.
- **Method:** Adoption-based participation ranking and random-walk-style
  prediction of multi-hop participants, without relying primarily on content or
  profile features.
- **Main finding:** The proposed ranking improves reported precision and recall
  over comparison methods and is evaluated for participant forecasting,
  influence maximization, and popularity prediction.
- **Limitations / access:** Hashtag and Twitter setting; network and adoption
  history are required; the task predicts participation, not creator format
  adoption or causal influence.
- **Product relevance:** Useful distinction between identifying likely early
  participants and predicting the later size of a trend. It highlights the
  data burden of network-based early-adopter work.

### EA-04 — [Finding early adopters of innovation in social networks](https://doi.org/10.1007/s13278-022-01012-5)

- **Authors / year / venue / type:** Balázs R. Sziklai, Balázs Lengyel; 2023
  (online 2022); Social Network Analysis and Mining 13, Article 4;
  peer-reviewed journal article.
- **Research question:** Can early adopters be found from network structure
  and assortative mixing rather than from simple centrality alone?
- **Dataset:** Registration or adoption events from the iWiW and Pokec social
  networks, with known adoption timing.
- **Method:** Compare a Top Candidate ranking that incorporates assortative
  mixing and homophily with seven centrality measures.
- **Main finding:** The Top Candidate method reports better identification of
  innovators or early adopters than the compared centralities in the studied
  networks.
- **Limitations / access:** Registration or innovation adoption is not creator
  content adoption; only two networks; network visibility and homophily are
  central assumptions; causal influence is unresolved.
- **Product relevance:** Strong precedent for treating “early adopter” as a
  relative, network-dependent construct rather than a synonym for popularity.

### EA-05 — [Predicting Popularity of Twitter Accounts through the Discovery of Link-Propagating Early Adopters](https://arxiv.org/abs/1512.02341)

- **Authors / year / venue / type:** Daichi Imamori, Keishi Tajima; 2015;
  arXiv preprint.
- **Research question:** Can early adopters of a new account be inferred from
  link propagation in a Twitter follow graph to predict later account
  popularity?
- **Dataset:** A Twitter follow-graph snapshot and account histories; exact
  collection details are in the preprint.
- **Method:** Infer copied or propagated follow links, identify early adopters,
  and rank new accounts by the resulting signal.
- **Main finding:** The reported ranking improves prediction of later follower
  counts, particularly for accounts with few followers at the start.
- **Limitations / access:** Preprint; Twitter follow-network setting; follower
  growth is the outcome, not content or format adoption; link propagation is
  not proof of causal influence.
- **Product relevance:** Useful example of a prospective early signal whose
  validation outcome is later growth. It should not be transferred to a
  post-level creator sample without network data.

### EA-06 — [Who Is behind a Trend? Temporal Analysis of Interactions among Trend Participants on Twitter](https://doi.org/10.1609/icwsm.v17i1.22203)

- **Authors / year / venue / type:** John Ziegler, Michael Gertz; 2023;
  Proceedings of the International AAAI Conference on Web and Social Media
  17(1), 960–969; peer-reviewed conference paper.
- **Research question:** How do actors and communities participating in trends
  change across a trend’s temporal stages?
- **Dataset:** Twitter interactions around the EURO2020 soccer event.
- **Method:** Fit trend lifecycles and perform actor-network analysis at
  different stages.
- **Main finding:** Successive trends overlap in participants; dominant users
  and communities can remain similar across related trends, while community
  structure is not temporally stable.
- **Limitations / access:** One event and platform; participant overlap does
  not prove that an actor caused a trend or adopted a format first.
- **Product relevance:** Supports treating trend participation as stageful and
  dynamic rather than as a fixed creator attribute.

## Virality and popularity prediction

### VP-01 — [Can Cascades be Predicted?](https://doi.org/10.1145/2566486.2567997)

- **Authors / year / venue / type:** Justin Cheng, Lada Adamic, P. Alex Dow,
  Jon Kleinberg, Jure Leskovec; 2014; WWW ’14, 925–936; peer-reviewed
  conference paper.
- **Research question:** How early and how accurately can the eventual size of
  a Facebook photo-reshare cascade be predicted?
- **Dataset:** Facebook photo-reshare cascades with temporal and structural
  cascade observations.
- **Method:** Stage-wise prediction using temporal and structural cascade
  features; compare cascade breadth and depth as evidence accumulates.
- **Main finding:** Early breadth is informative; prediction improves as more
  reshares are observed. Large cascades are rare and difficult to predict from
  the earliest stage.
- **Limitations / access:** Facebook photo reshares and a cascade-size target;
  the task is later outcome prediction, not early creator adoption. Severe
  imbalance and missing exposures constrain transfer.
- **Product relevance:** Clear warning that a successful outcome becomes easier
  to predict after evidence accumulates; this is not evidence that the initial
  signal was an early trend adoption.

### VP-02 — [SEISMIC: A Self-Exciting Point Process Model for Predicting Tweet Popularity](https://doi.org/10.1145/2783258.2783401)

- **Authors / year / venue / type:** Qingyuan Zhao, Murat A. Erdogdu, Hera Y.
  He, Anand Rajaraman, Jure Leskovec; 2015; KDD ’15; peer-reviewed conference
  paper and [official Stanford project page](https://snap.stanford.edu/seismic/).
- **Research question:** Can final retweet popularity be forecast from the
  early retweet process and follower information?
- **Dataset:** One month of complete Twitter data from October 7 to November
  7, 2011; the project page documents the released retweet data and index.
  The paper filters to English tweets with at least 50 retweets and reports
  166,076 such tweets.
- **Method:** Self-exciting point process using event times and follower
  counts.
- **Main finding:** The paper reports roughly 15% relative error after the
  first hour for its final-retweet prediction setting.
- **Limitations / access:** Old Twitter environment; filtered high-retweet
  sample; retweets and follower counts are not creator-format adoption or
  consistency. The reported error is paper-specific, not a product benchmark.
- **Product relevance:** Important temporal-model precedent and a reminder to
  keep early unfolding response separate from a later popularity label.

### VP-03 — [Measuring and Detecting Virality in Twitter](https://doi.org/10.1145/3543873.3587373)

- **Authors / year / venue / type:** Tugrulcan Elmas, Stephane Selim, Célia
  Houssiaux; 2023; Companion Proceedings of the ACM Web Conference 2023,
  314–317; peer-reviewed companion paper, with an [arXiv version](https://arxiv.org/abs/2303.06120)
  and [code/data identifiers](https://github.com/tugrulz/ViralTweets).
- **Research question:** How should virality be measured and detected when
  follower count and retweet count favor large accounts?
- **Dataset:** The paper’s Viral Tweets ground-truth topic and Twitter data;
  inspect the repository and paper for access and rehydration details.
- **Method:** Evaluate prior virality annotations, propose a retweet-to-follower
  ratio, and train a BERT-based detector.
- **Main finding:** The paper reports a study-specific ratio threshold of 2.16
  and a BERT F1 of 0.79 in its evaluation.
- **Limitations / access:** Platform- and topic-specific ground truth; dataset
  availability and deleted tweets affect reproducibility; the ratio favors
  smaller accounts by construction. The reported threshold must not become a
  Creator Signal Map threshold without new validation.
- **Product relevance:** Useful evidence that “viral” is a construct requiring
  an explicit denominator and label. It does not establish early adoption,
  durable growth, or audience quality.

### VP-04 — [TrendLearner: Early prediction of popularity trends of user generated content](https://doi.org/10.1016/j.ins.2016.02.025)

- **Authors / year / venue / type:** Flavio Figueiredo, Jussara M. Almeida,
  Marcos André Gonçalves, Fabrício Benevenuto; 2016; Information Sciences
  349–350, 172–187; peer-reviewed journal article.
- **Research question:** Can the future popularity trajectory of a YouTube
  video be classified early from partial time series and metadata?
- **Dataset:** A Top dataset of 27,212 YouTube videos and a Random Topics
  dataset of 24,482 videos; views, comments, favorites, referrers, upload
  dates, and categories are used. The paper references the [YouTube trace
  page](http://vod.dcc.ufmg.br/traces/youtime/).
- **Method:** Cluster popularity trajectories with K-spectral clustering and
  classify trajectories using Extremely Randomized Trees and early features.
- **Main finding:** The paper reports an improvement in F1 over prior methods
  and estimates remaining interest from partial histories.
- **Limitations / access:** YouTube-era data and trajectory labels; popularity
  evolution is not creator adoption or format novelty; platform distribution
  and current short-form behavior may differ.
- **Product relevance:** Useful for separating early trajectory evidence from
  final popularity, while showing that a trajectory label requires a long
  enough history and explicit horizon.

### VP-05 — [Twitter-driven YouTube views: Beyond individual influencers](https://doi.org/10.1145/2647868.2655037)

- **Authors / year / venue / type:** Honglin Yu, Lexing Xie, Scott Sanner;
  2014; ACM Multimedia 2014; peer-reviewed conference paper. The [ANU record](https://openresearch-repository.anu.edu.au/items/e7824195-9be6-45c2-8baa-0530930c3c81)
  provides the publication record.
- **Research question:** Can early YouTube-view jumps be predicted from
  cross-platform Twitter activity beyond the effect of individual influencers?
- **Dataset:** Hundreds of thousands of videos and millions of tweets, as
  described in the publication record and paper.
- **Method:** Cross-network features; classify videos by early growth or later
  jumps; combine individual influence with collective activity diversity.
- **Main finding:** The paper reports that a small early group can identify
  later view-jump candidates, with collective activity adding signal beyond a
  single influencer.
- **Limitations / access:** Cross-platform and older YouTube/Twitter data;
  views are the outcome, not virality topology or creator trend adoption. The
  full text may have access restrictions.
- **Product relevance:** Shows why platform context and collective response
  matter, but does not justify using views as a universal virality measure.

### VP-06 — [The Lifecycle of a YouTube Video: Phases, Content and Popularity](https://doi.org/10.1609/icwsm.v9i1.14609)

- **Authors / year / venue / type:** Honglin Yu, Lexing Xie, Scott Sanner;
  2015; Proceedings of the International AAAI Conference on Web and Social
  Media 9(1), 533–542; peer-reviewed conference paper.
- **Research question:** What phases do YouTube videos pass through, and can
  phase information improve popularity prediction?
- **Dataset:** A two-year history of more than 172,000 YouTube videos.
- **Method:** Represent lifecycles as phases and extend endogenous/exogenous
  shock modeling with power-law phase segmentation.
- **Main finding:** Videos can exhibit multiple stages; the paper reports that
  many top videos have three or more phases and that phase information reduces
  prediction error.
- **Limitations / access:** Video lifecycle and popularity, not creator early
  adoption; platform-era and category effects may not transfer to another
  platform or format.
- **Product relevance:** Useful precedent for distinguishing a post’s lifecycle
  from a creator’s repeated behavior.

### VP-07 — [Predicting the popularity of online content](https://arxiv.org/abs/0811.0405)

- **Authors / year / venue / type:** Gabor Szabo, Bernardo A. Huberman; 2008;
  arXiv preprint / empirical research report.
- **Research question:** How well can early access or vote activity predict
  later attention on online content?
- **Dataset:** YouTube and Digg activity histories.
- **Method:** Log-scale growth modeling of early views or votes and later
  attention.
- **Main finding:** Early activity contains predictive signal, with different
  observation horizons for Digg and YouTube; evergreen content is harder to
  predict.
- **Limitations / access:** Older portals and popularity proxies; the study
  does not identify peer-to-peer virality, influence, creator consistency, or
  content-format adoption.
- **Product relevance:** Historical baseline for early-outcome prediction and
  a reminder that “early” depends on the platform and horizon.

## Diffusion and cascades

### DF-01 — [The Role of Social Networks in Information Diffusion](https://doi.org/10.1145/2187836.2187907)

- **Authors / year / venue / type:** Eytan Bakshy, Itamar Rosenn, Cameron
  Marlow, Lada Adamic; 2012; WWW, 519–528; peer-reviewed conference paper.
- **Research question:** How do social-network exposure and tie strength affect
  the probability and speed of information diffusion?
- **Dataset:** A large Facebook field experiment using randomized ordering of
  social signals and observed sharing behavior.
- **Method:** Experimental exposure analysis and comparison of weak and strong
  ties.
- **Main finding:** Exposure to friends’ sharing signals increases sharing
  probability and changes timing; weak ties can be important for novel
  information because they provide more distinct exposure opportunities.
- **Limitations / access:** Platform-internal experimental setting; not a
  creator-format dataset; exposure and social sharing are not the same as
  trend origin or early adoption.
- **Product relevance:** Strong evidence for keeping exposure and distribution
  context separate from content and creator attributes.

### DF-02 — [The Structural Virality of Online Diffusion](https://doi.org/10.1287/mnsc.2015.2158)

- **Authors / year / venue / type:** Sharad Goel, Ashton Anderson, Jake Hofman,
  Duncan Watts; 2016; Management Science 62(1), 180–196; peer-reviewed
  journal article. [Author-hosted PDF](https://5harad.com/papers/twiral.pdf).
- **Research question:** How can diffusion structure distinguish broadcast-like
  spread from peer-to-peer cascades?
- **Dataset:** About one billion Twitter diffusion events spanning news,
  videos, images, petitions, and other content types.
- **Method:** Introduce structural virality based on diffusion-tree structure
  and compare it with size and structural diversity.
- **Main finding:** Many large events have low structural virality and are
  dominated by broadcast-like spread; large size alone does not imply a deep
  peer cascade.
- **Limitations / access:** Requires diffusion trees and attribution that a
  small creator-post dataset usually lacks; platform-specific diffusion
  mechanics; structural virality is not early adoption.
- **Product relevance:** Key conceptual source for not equating views or
  reshares with virality.

### DF-03 — [The Anatomy of Large Facebook Cascades](https://doi.org/10.1609/icwsm.v7i1.14431)

- **Authors / year / venue / type:** P. Alex Dow, Lada Adamic, Adrien Friggeri;
  2013; Proceedings of the International AAAI Conference on Web and Social
  Media 7(1), 145–154; peer-reviewed conference paper.
- **Research question:** What structural and demographic patterns distinguish
  large Facebook photo-reshare cascades?
- **Dataset:** Facebook photo-reshare cascades with cascade sizes, depths,
  participant attributes, and example trees.
- **Method:** Analyze cascade size and depth distributions and compare cascade
  structures and participant demographics.
- **Main finding:** A small fraction of photos account for substantial
  reshare activity, and cascades of comparable size can have different
  structural and demographic dynamics.
- **Limitations / access:** Facebook photos and large cascades; selected large
  events do not represent ordinary creator posts or prove causal mechanisms.
- **Product relevance:** Supports treating cascade shape and audience
  composition as distinct from total response.

### DF-04 — [Do Diffusion Protocols Govern Cascade Growth?](https://doi.org/10.1609/icwsm.v12i1.15023)

- **Authors / year / venue / type:** Justin Cheng, Jon Kleinberg, Jure
  Leskovec, David Liben-Nowell, Bogdan State, Karthik Subbian, Lada Adamic;
  2018; Proceedings of the International AAAI Conference on Web and Social
  Media 12, 32–41; peer-reviewed conference paper.
- **Research question:** Do different participation or diffusion protocols
  produce different cascade-growth dynamics?
- **Dataset:** The 98 largest Facebook cascades in the study.
- **Method:** Classify protocols such as copying, nomination, and volunteering;
  model their branching-process implications.
- **Main finding:** Participation effort and social cost affect propagation;
  transmission predictability varies by protocol.
- **Limitations / access:** Very large Facebook cascades and protocol labels;
  selection and platform specificity limit transfer to ordinary creator posts.
- **Product relevance:** Suggests that the mechanism behind a response matters;
  a count without protocol or exposure context is ambiguous.

### DF-05 — [Differences in the Mechanics of Information Diffusion Across Topics: Idioms, Political Hashtags, and Complex Contagion on Twitter](https://doi.org/10.1145/1963405.1963503)

- **Authors / year / venue / type:** Daniel M. Romero, Brendan Meeder, Jon
  Kleinberg; 2011; WWW ’11; peer-reviewed conference paper.
- **Research question:** Do diffusion mechanics differ across topics and does
  repeated exposure matter?
- **Dataset:** Twitter hashtag diffusion across idioms, political hashtags,
  and other topic categories.
- **Method:** Compare exposure, persistence, and initial-adopter network
  structure; test complex-contagion patterns.
- **Main finding:** Diffusion differs by topic, and repeated exposure is more
  important for some political-hashtag behavior than for simple information
  transmission.
- **Limitations / access:** Hashtag and text setting; exposure assumptions and
  network observation are platform-specific; no direct format or hook label.
- **Product relevance:** Warns against assuming one diffusion mechanism across
  topics or formats.

### DF-06 — [DeepCas: An End-to-end Predictor of Information Cascades](https://doi.org/10.1145/3038912.3052643)

- **Authors / year / venue / type:** Cheng Li, Jiaqi Ma, Xiaoxiao Guo, Qiaozhu
  Mei; 2017; WWW ’17; peer-reviewed conference paper, with an [arXiv
  version](https://arxiv.org/abs/1611.05373).
- **Research question:** Can cascade growth be predicted end-to-end from
  cascade graphs rather than from manually selected features?
- **Dataset:** Information-cascade graph datasets reported in the paper; exact
  per-platform sample details should be taken from the full paper before
  reuse.
- **Method:** Deep graph representation learning for cascade-size prediction.
- **Main finding:** The reported model improves over hand-crafted and prior
  learning baselines in the evaluated cascade-prediction tasks.
- **Limitations / access:** Data-hungry graph model; final-cascade target;
  requires graph structure not normally present in a small manual creator
  sample; generalization and rare-event performance need separate validation.
- **Product relevance:** Methodological context for what is possible with full
  cascades, not evidence for a small-data creator score.

### DF-07 — [Inferring Networks of Diffusion and Influence](https://snap.stanford.edu/netinf/)

- **Authors / year / venue / type:** Manuel Gomez-Rodriguez, Jure Leskovec,
  Andreas Krause; 2010; KDD; peer-reviewed conference paper and [official
  SNAP project page](https://snap.stanford.edu/netinf/).
- **Research question:** Can an underlying diffusion or influence network be
  inferred from observed cascades?
- **Dataset:** MemeTracker cascades from news and blog pages; the SNAP page
  documents downloadable example inputs and inferred networks.
- **Method:** Network inference from cascade activation times and source
  relationships.
- **Main finding:** The method reconstructs a plausible who-copies-from-whom
  network from cascade observations.
- **Limitations / access:** Inferred rather than ground-truth influence;
  textual hyperlink/phrase cascades; source coverage and model assumptions
  strongly affect the result.
- **Product relevance:** Explains why creator influence cannot be recovered
  from timestamps alone without an explicit diffusion model and network data.

## Creator and influencer growth

### CG-01 — [PopFactor: Modeling Popularity and Effort on Twitch](https://doi.org/10.1609/icwsm.v15i1.18073)

- **Authors / year / venue / type:** Robert Netzorg, Lauren Arnett, Augustin
  Chaintreau, Eugene Wu; 2021; Proceedings of the International AAAI
  Conference on Web and Social Media 15, 432–442; peer-reviewed conference
  paper. An earlier [arXiv preprint](https://arxiv.org/abs/1812.03379) exists.
- **Research question:** How do effort and cross-platform behavior relate to
  streamer popularity and relative growth?
- **Dataset:** A cohort of Twitch streamers who joined in 2016 and were
  observed for two years, using Twitch, Twitter, and YouTube behavior.
- **Method:** Temporal analysis of followers, concurrent viewers, and cheers;
  compare behavior and effort with relative growth.
- **Main finding:** The paper reports that behavior and effort improve
  prediction of relative growth above the median and that effort is associated
  with success in the studied cohort.
- **Limitations / access:** Twitch/live-streaming context; observational
  associations; platform-specific outcomes and data collection; not a format
  adoption study.
- **Product relevance:** Longitudinal creator-growth context and a reason to
  keep audience size, active viewers, and financial engagement distinct.

### CG-02 — [The Road to Popularity: The Dilution of Growing Audience on Twitter](https://doi.org/10.1609/icwsm.v10i1.14804)

- **Authors / year / venue / type:** Przemyslaw A. Grabowicz, Mahmoudreza
  Babaei, Juhi Kulshrestha, Ingmar Weber; 2016; Proceedings of the
  International AAAI Conference on Web and Social Media 10, 567–570;
  peer-reviewed conference paper. [ArXiv version](https://arxiv.org/abs/1603.04423).
- **Research question:** How does the composition and engagement of a Twitter
  audience change as an account grows?
- **Dataset:** About 1,000 sampled Twitter experts across follower bins,
  approximately 241 million follower users, one million tweets, and 23 million
  retweets, as reported by the paper.
- **Method:** Chronological follower cohorts and a shuffling control preserving
  user age.
- **Main finding:** Early followers are more elite, expert, or similar to the
  account; later growth dilutes audience composition and engagement patterns.
- **Limitations / access:** Expert sample and older Twitter snapshot;
  observational and cross-sectional components; platform and API access may
  not reproduce the data.
- **Product relevance:** Strong warning that follower growth and audience
  quality are longitudinal and non-stationary constructs.

### CG-03 — [A temporal analysis of user interactions in Facebook and Instagram](https://doi.org/10.1007/s13278-022-00928-2)

- **Authors / year / venue / type:** Luca Vassio, Michele Garetto, Emilio
  Leonardi, Carla Fabiana Chiasserini; 2022; Social Network Analysis and
  Mining 12, Article 96; peer-reviewed journal article.
- **Research question:** How do interaction arrival, decay, and early response
  differ for influential accounts on Facebook and Instagram?
- **Dataset:** More than 13 billion interactions and about four million posts
  from 651 Italian influencers over more than five years, 2016–2021.
- **Method:** Temporal interaction analysis and an analytical model for
  interaction arrival and decay, including early popularity prediction.
- **Main finding:** Interaction timing has strong decay and daily patterns; the
  paper reports that roughly half of interactions arrive within the first four
  hours on Facebook and two hours on Instagram in its sample.
- **Limitations / access:** Top Italian influencers, platform-specific
  interactions, and likely non-public data; likes and reactions do not equal
  audience quality or creator trend adoption.
- **Product relevance:** Useful evidence that response windows and creator
  trajectories need platform-specific interpretation.

### CG-04 — [How Influencers Grow: An Empirical Study and Future Research Agenda](https://doi.org/10.1177/10949968251360683)

- **Authors / year / venue / type:** Colin Campbell, Jeffrey M. Girard, Daniel
  McDuff, Sara Rosengren; first online 2025, journal issue 2026; Journal of
  Interactive Marketing 61(2); peer-reviewed journal article.
- **Research question:** Which forms of influencer labor and relationship
  activity are associated with follower growth?
- **Dataset:** 14,311,145 Instagram posts from 6,079 influencers across 57
  countries over more than two years; the data are proprietary or under NDA.
- **Method:** Multilevel mixed-effects growth modeling grounded in attention-
  and relationship-labor concepts.
- **Main finding:** The article reports associations between influencer labor
  behaviors and follower growth, with effects varying across contexts.
- **Limitations / access:** Proprietary data and follower-growth outcome;
  not a trend-adoption or causal-format study; access and replication are
  limited.
- **Product relevance:** Recent longitudinal context for creator growth, useful
  mainly as a reminder that “growth” is a separate outcome from early adoption.

## Bursts, trends, and memes

### BT-01 — [MemeTracker: A Large-Scale, Longitudinal Study of Global Social-Media Dynamics](https://doi.org/10.1145/1557019.1557077)

- **Authors / year / venue / type:** Jure Leskovec, Lars Backstrom, Jon
  Kleinberg; 2009; KDD ’09; peer-reviewed conference paper and [official
  project page](https://snap.stanford.edu/memetracker/about.html).
- **Research question:** How do short textual phrases and stories propagate
  across mainstream media and blogs over time?
- **Dataset:** About 1.6 million news and blog sites and 90 million articles
  over three months in the paper; the project page documents roughly one
  million sources and more than 17 million extracted phrases.
- **Method:** Extract short distinctive phrases, cluster textual variants, and
  model source-to-source temporal propagation.
- **Main finding:** The paper reports a typical lag between mainstream news and
  blogs and finds that only a small fraction of observed cases have blogs first
  and mainstream news later; it also describes a recurring “heartbeat” in
  propagation.
- **Limitations / access:** Text/news/blog setting; phrase continuity misses
  visual, audio, and semantic transformations; older media ecosystem.
- **Product relevance:** Useful precedent for trend/meme timelines and source
  coverage, not a direct method for creator video formats.

### BT-02 — [Bursty and Hierarchical Structure in Streams](https://doi.org/10.1145/775047.775061)

- **Authors / year / venue / type:** Jon Kleinberg; 2002; Proceedings of the
  Eighth ACM SIGKDD International Conference on Knowledge Discovery and Data
  Mining, 91–101; peer-reviewed conference paper. An
  [author-hosted PDF](https://www.cs.cornell.edu/info/people/kleinber/bhs.pdf)
  is available.
- **Research question:** How can bursts of activity be detected and organized
  into nested or hierarchical episodes?
- **Dataset:** Examples from email, news, and research-paper-title streams.
- **Method:** Infinite-state automaton with higher-intensity states,
  transition penalties, and dynamic programming.
- **Main finding:** The model detects bursts at multiple intensity levels and
  can represent nested burst structure.
- **Limitations / access:** Token or event intensity is not semantic trend
  validity or creator causation; results depend on stream construction and
  parameter choices.
- **Product relevance:** Foundational method for locating candidate emergence
  windows, subject to small-sample and baseline checks.

### BT-03 — [Early Discovery of Emerging Entities in Microblogs](https://doi.org/10.24963/ijcai.2019/678)

- **Authors / year / venue / type:** Satoshi Akasaki, Naoki Yoshinaga, Masashi
  Toyoda; 2019; IJCAI, 4882–4889; peer-reviewed conference paper.
- **Research question:** Can emerging entities be discovered before they are
  established by external reference sources?
- **Dataset:** A large Twitter archive and Wikipedia-linked entity evaluation;
  exact archive construction should be taken from the paper.
- **Method:** Time-sensitive distant supervision using early-stage contexts,
  compared with unseen-entity and burst-detection baselines.
- **Main finding:** The paper reports higher top-500 precision than the
  comparison approach and earlier discovery for many Wikipedia entities.
- **Limitations / access:** Entity emergence is not creator format or hook
  adoption; Wikipedia is an imperfect validation target; language and topic
  coverage matter.
- **Product relevance:** Shows how later external validation can evaluate an
  early signal without making the validation target identical to the signal.

### BT-04 — [Bursty Event Detection in Twitter Streams](https://doi.org/10.1145/3332185)

- **Authors / year / venue / type:** Carmela Comito, Agostino Forestiero,
  Clara Pizzuti; 2019; ACM Transactions on Knowledge Discovery from Data 13(4),
  Article 41; peer-reviewed journal article.
- **Research question:** Can bursty events be detected online from Twitter
  message streams?
- **Dataset:** Twitter streams addressing multiple issues; exact collection
  and sample sizes require the full article.
- **Method:** Online incremental clustering with textual and temporal cluster
  features, followed by bursty-event detection.
- **Main finding:** The proposed online clustering approach detects emerging
  topics/events in the evaluated streams.
- **Limitations / access:** Event/topic bursts are not creator adoption or
  proof of durable trend formation; collection and parameter choices affect
  results.
- **Product relevance:** Candidate method for temporal emergence research,
  with a clear need to separate external events from creator-led patterns.

### BT-05 — [Early detection method for emerging topics based on dynamic Bayesian networks in micro-blogging networks](https://doi.org/10.1016/j.eswa.2016.03.050)

- **Authors / year / venue / type:** Qi Dang, Feng Gao, Yadong Zhou; 2016;
  Expert Systems with Applications 57, 285–295; peer-reviewed journal article.
- **Research question:** Can emerging topics be detected early by combining
  keyword attractiveness with diffusion-network signals?
- **Dataset:** Sina Weibo data; exact collection details require the full
  article.
- **Method:** Dynamic Bayesian network using attractiveness, key-node
  diffusion topology, and keyword clustering.
- **Main finding:** The paper reports earlier detection than comparison methods
  in its Sina Weibo experiments.
- **Limitations / access:** Platform- and language-specific; topic detection
  is not creator format adoption; full-text and dataset access should be
  verified before reuse.
- **Product relevance:** Useful precedent for combining temporal activity and
  network context while keeping “topic emerging” distinct from “creator
  adopted early.”

## Influence, ranking, and audience-quality context

### IM-01 — [Measuring User Influence in Twitter: The Million Follower Fallacy](https://doi.org/10.1609/icwsm.v4i1.14033)

- **Authors / year / venue / type:** Meeyoung Cha, Hamed Haddadi, Fabricio
  Benevenuto, Krishna Gummadi; 2010; Proceedings of the International AAAI
  Conference on Web and Social Media 4(1), 10–17; peer-reviewed conference
  paper. [Stanford copy](https://snap.stanford.edu/class/cs224w-readings/cha10influence.pdf).
- **Research question:** Do follower count, retweets, and mentions measure the
  same kind of influence?
- **Dataset:** About two billion follow links among 54 million users and 1.7
  billion tweets, as reported by the paper.
- **Method:** Compare indegree, retweet, and mention measures across topics and
  time.
- **Main finding:** Follower count does not equal retweet or mention influence;
  the measures vary by topic and time.
- **Limitations / access:** Older Twitter data and observational measures;
  influence is not causally identified and does not imply early adoption.
- **Product relevance:** Essential terminology guardrail for reach, influence,
  and response.

### IM-02 — [TwitterRank: Finding Topic-sensitive Influential Twitterers](https://www.wsdm-conference.org/2010/proceedings/docs/p261.pdf)

- **Authors / year / venue / type:** Jiawei Weng, Ee-Peng Lim, Jing Jiang, Qi
  He; 2010; WSDM, 261–270; peer-reviewed conference paper.
- **Research question:** Can influence ranking account for both the follower
  network and topic similarity?
- **Dataset:** Twitter follower and topical activity data; exact sample details
  are in the paper.
- **Method:** Topic-sensitive PageRank using follower relationships and topic
  similarity or homophily.
- **Main finding:** Topic-sensitive ranking improves identification of
  influential users relative to non-topic-aware comparisons in the evaluation.
- **Limitations / access:** Ranking is not adoption timing or causal influence;
  old Twitter data and activity manipulation remain concerns.
- **Product relevance:** Shows why any future ranking target must be named
  explicitly; it is not a ready-made early-adopter rule.

## Temporal point-process context

### TP-01 — [TiDeH: Time-Dependent Hawkes Process for Predicting Retweet Dynamics](https://doi.org/10.1609/icwsm.v10i1.14717)

- **Authors / year / venue / type:** Ryota Kobayashi, Renaud Lambiotte; 2016;
  Proceedings of the International AAAI Conference on Web and Social Media
  10(1); peer-reviewed conference paper and [official code repository](https://github.com/NII-Kobayashi/TiDeH).
- **Research question:** How can retweet timing be modeled when intensity
  changes with time of day, network structure, and tweet aging?
- **Dataset:** Samples from the SEISMIC Twitter data; the paper trains on
  tweets with more than 2,000 retweets and the repository includes sample data
  and code.
- **Method:** Time-dependent Hawkes process with network structure and
  circadian or aging effects.
- **Main finding:** The time-dependent model improves retweet-dynamics
  prediction over simpler comparison processes in the reported experiments.
- **Limitations / access:** Retweet-heavy Twitter sample; high-popularity
  filtering; retweet dynamics are not format adoption or creator consistency.
- **Product relevance:** Useful temporal-method reference when event timestamps
  and enough volume exist; not appropriate as an assumed default for sparse
  data.

## Dataset and repository records

### DS-01 — [SNAP MemeTracker](https://snap.stanford.edu/memetracker/about.html)

- **Type / year:** Official Stanford SNAP dataset and project documentation;
  2009 paper-era corpus.
- **Contents:** News/blog sources, short phrase clusters, timestamps, and
  source-propagation information; the official page documents the corpus
  scale and downloadable data context.
- **Access / limitations:** Text-centric and historical; phrase tracking does
  not capture multimodal transformation; check current download instructions
  and licensing before reuse.
- **Research use:** Benchmark for meme tracking, temporal lags, and source
  propagation—not a creator-video dataset.

### DS-02 — [Higgs Twitter dataset](https://snap.stanford.edu/data/higgs-twitter.html)

- **Type / year:** Official Stanford SNAP social/diffusion dataset; collected
  around the Higgs boson discovery, July 1–7, 2012.
- **Contents:** An anonymized social graph, retweet, reply, and mention
  networks, plus timestamped activity; the page documents files and graph
  statistics.
- **Access / limitations:** One event and historical Twitter; anonymized IDs;
  not a creator-format or longitudinal growth sample.
- **Research use:** Network, interaction, and event-diffusion experiments.

### DS-03 — [SNAP SEISMIC data and project](https://snap.stanford.edu/seismic/)

- **Type / year:** Official Stanford SNAP research dataset and project page;
  2015 paper-era Twitter corpus.
- **Contents:** Retweet-event data and an index of tweets used by the SEISMIC
  popularity-prediction work; the page documents the one-month collection and
  released files.
- **Access / limitations:** Historical, English, retweet-filtered data; large
  event table but not full creator exposure or format information.
- **Research use:** Reproducibility reference for point-process and early
  retweet prediction.

### DS-04 — [SNAP NETINF project and sample files](https://snap.stanford.edu/netinf/)

- **Type / year:** Official Stanford SNAP project and dataset documentation;
  2010 paper-era release.
- **Contents:** MemeTracker cascade inputs and inferred diffusion networks,
  including example phrase-cluster and hyperlink-cascade files.
- **Access / limitations:** Inferred networks are model outputs, not verified
  ground truth; text and hyperlink propagation; inspect file formats before
  reuse.
- **Research use:** Network-inference and cascade-structure experiments.

### DS-05 — [SNAP LIM: Learning Information Models](https://snap.stanford.edu/lim/)

- **Type / year:** Official Stanford SNAP dataset/project page; 2010-era
  information-diffusion release.
- **Contents:** The page documents a corpus combining hundreds of millions of
  Twitter posts and news/blog articles, plus cascade and information-modeling
  files.
- **Access / limitations:** Historical cross-source corpus; topic and source
  coverage may not match current creator platforms; verify current download
  availability and license.
- **Research use:** Information-diffusion and implicit-network modeling.

### DS-06 — [SNAP Twitter 476M dataset](https://snap.stanford.edu/data/twitter7.html)

- **Type / year:** Official Stanford SNAP dataset page; historical Twitter
  collection.
- **Contents:** A large historical Twitter crawl and metadata description.
- **Access / limitations:** The official page states that the data are no
  longer available at Twitter’s request. Treat it as a documented reference,
  not an available dataset.
- **Research use:** Historical scale and provenance context only unless the
  data are lawfully available elsewhere.

### DS-07 — [ViralTweets code and dataset identifiers](https://github.com/tugrulz/ViralTweets)

- **Type / year:** Official research repository accompanying the 2023
  virality paper.
- **Contents:** Code, identifiers, and instructions associated with the
  Viral Tweets ground truth and virality experiments.
- **Access / limitations:** Tweet availability depends on rehydration,
  deletion, and platform access; repository instructions are authoritative for
  current reuse.
- **Research use:** Reproducibility support for virality labeling and
  classifier experiments, not a general creator benchmark.

### DS-08 — [TiDeH code and sample data](https://github.com/NII-Kobayashi/TiDeH)

- **Type / year:** Official GitHub repository accompanying the 2016 TiDeH
  paper.
- **Contents:** Research code and sample data for time-dependent Hawkes retweet
  modeling.
- **Access / limitations:** Sample data are not equivalent to the full source
  corpus; platform and high-retweet selection constraints remain.
- **Research use:** Method reproduction and point-process inspection.

## Coverage check

- **Early trend adoption / early adopters:** 6 entries (EA-01–EA-06).
- **Virality / popularity prediction:** 7 entries (VP-01–VP-07).
- **Diffusion / cascades:** 7 entries (DF-01–DF-07).
- **Creator / influencer growth:** 4 entries (CG-01–CG-04).
- **Burst / trend / meme tracking:** 5 entries (BT-01–BT-05).
- **Influence and ranking context:** 2 entries (IM-01–IM-02).
- **Temporal point-process context:** 1 additional entry (TP-01); SEISMIC is
  also relevant to this area.
- **Datasets / repositories:** 8 records (DS-01–DS-08).

Some records intentionally overlap in subject matter—for example, SEISMIC and
TiDeH use related Twitter retweet data—but they are not counted as evidence
that the same result generalizes to creator-format adoption.
