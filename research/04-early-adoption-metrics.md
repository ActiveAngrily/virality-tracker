# Early-Adoption Metrics

## Decision this file supports

The product asks whether a creator uses a format or hook early **within a
defined observed creator cohort**, and whether that use is followed by both
creator-relative response and broader adoption. It does not claim platform-
wide origin or causal influence.

## Evidence from prior work

Research distinguishes adopters by their position in a trend lifecycle
[EA-01], compares early participants with later breadth [EA-02], and shows that
participants and communities can vary across lifecycle stages [EA-06]. Burst
models can locate changing activity states in dense streams [BT-02], while
network early-adopter methods use homophily or graph position [EA-04].

These are research findings, not direct product formulas. The manual prototype
lacks a platform-wide stream, exposure logs, and a complete social graph, so it
cannot reproduce burst, network, or influence methods credibly.

## Proposed observation protocol

Each result is tied to four recorded boundaries:

1. **Comparison cohort:** the fixed set of X creators collected for the run.
2. **Pattern:** a versioned, manually coded content format; hook is allowed as
   a secondary pattern type.
3. **Episode:** the 30 days beginning with the pattern's first observed use in
   the cohort.
4. **Post outcome:** one response type measured seven days after posting.

If data collection begins after the apparent first use, the episode is
left-censored. Such a pattern may be described but cannot support an early-
adopter rank.

The 30-day and seven-day windows are proposed product choices. They are short
enough for a prototype and must be changed only between evaluation runs, never
per pattern after seeing outcomes.

## Units and notation

- \(c\): creator.
- \(p\): post.
- \(t\): manually coded pattern.
- \(s_t\): first observed use of \(t\) in the fixed cohort.
- \(e_t=s_t+30\text{ days}\): episode end.
- \(a_{c,t}\): timestamp of creator \(c\)'s first observed post using \(t\)
  within \([s_t,e_t]\).
- \(N_t\): number of distinct creators with a defined \(a_{c,t}\).
- \(y_p\): the chosen seven-day response for post \(p\).

Only a creator's first observed use of a pattern is an adoption event. Later
posts using the same pattern may be shown as persistence, but do not improve
the creator's adoption rank or repeat count.

## Metric 1: creator-relative post traction

For the adoption post \(p\), take the creator's most recent eligible prior
posts, strictly before \(p\), capped at 20:

\[
H_{c,p}=\operatorname{last20}\{j:creator_j=c,\ posted_j<posted_p,\ j\ is\ eligible\}.
\]

\[
n_{prior,p}=|H_{c,p}|,\qquad
B_p=\operatorname{median}\{y_j:j\in H_{c,p}\}.
\]

When \(B_p>0\):

\[
R_p=\frac{y_p}{B_p}.
\]

The post is a supported creator-relative breakout when:

\[
P_p=\mathbb{1}(n_{prior,p}\ge10\ \land\ B_p>0\ \land\ R_p\ge1.5).
\]

With 5–9 prior posts, calculate the same ratio but label the result
`provisional`; it cannot create a supported capture event. With fewer than five
prior posts or \(B_p=0\), return `not_classifiable` for breakout status.

### Why retain the median and 1.5× rule?

- The median prevents one unusually large prior post from moving the baseline
  as much as a mean would.
- A 20-post cap keeps the baseline recent and the collection burden bounded.
- The 1.5× threshold is legible enough to test in a prototype.

None of these values is established by the early-adopter literature. Five
posts are enough to calculate a median, not to make a strong performance
claim. The recommended minimum for a supported event is therefore 10, with
5–9 retained only to avoid discarding potentially useful exploratory cases.

### Alternatives considered

| Alternative | Benefit | Reason not selected for the MVP |
| --- | --- | --- |
| Mean of prior posts | Familiar and efficient under light-tailed noise | Sensitive to the exact unusually successful posts the baseline must withstand |
| Trimmed mean | Compromise between mean and median | At \(n\le20\), trim conventions have large discrete effects |
| Historical percentile | No ratio or distribution assumption | Only 6 possible ranks with 5 prior posts and 21 with 20 |
| Median/MAD score | Accounts for normal variability | Often undefined with tied low counts; noisy with small \(n\) |
| Follower-normalized response | Tries to adjust creator scale | Followers are not exposures and snapshots drift |
| Hierarchical shrinkage | Can stabilize sparse creators | Adds a model, priors, and validation burden beyond the prototype |

## Metric 2: observed-cohort earliness

Order creators by \(a_{c,t}\). Use a midrank for exact timestamp ties:

\[
r_{c,t}=1+\sum_{d\ne c}\mathbb{1}(a_{d,t}<a_{c,t})
+\frac12\sum_{d\ne c}\mathbb{1}(a_{d,t}=a_{c,t}).
\]

For \(N_t>1\), define normalized adoption position:

\[
q_{c,t}=\frac{r_{c,t}-1}{N_t-1}.
\]

The earliest observed creator has \(q=0\), the latest has \(q=1\). Define an
equivalent display score:

\[
E_{c,t}=1-q_{c,t}.
\]

The percentile is descriptive after the episode closes. It must not define
early status from the same final adopter set later used as validation. Instead,
set a supported-breadth target \(M=8\), an early quota
\(h=\lceil0.25M\rceil=2\), and a seed window of seven days. Let:

\[
\Delta_{c,t}=a_{c,t}-s_t.
\]

Define an early candidate independently of later breadth:

\[
A_{c,t}=\mathbb{1}(r_{c,t}\le2\ \land\ \Delta_{c,t}\le7\text{ days}).
\]

Thus the MVP asks whether the creator was in the small seed group, then asks
separately whether the pattern later broadened. Exact timestamp ties at the
rank-2 boundary receive the same status; the product displays the tie and may
therefore show more than two early candidates. The 25% value explains the
quota relative to the eight-adopter support target; it is not recalculated
from the final \(N_t\).

## Metric 3: later adoption validation

Count distinct other creators who first adopt after the candidate and before
the fixed episode closes:

\[
L_{c,t}=\sum_{d\ne c}\mathbb{1}(a_{c,t}<a_{d,t}\le e_t).
\]

When \(N_t>1\), report later-adopter share:

\[
V_{c,t}=\frac{L_{c,t}}{N_t-1}.
\]

Provisional later evidence is present when:

\[
G^{prov}_{c,t}=\mathbb{1}(N_t\ge5\ \land\ L_{c,t}\ge3).
\]

Supported later validation is present when:

\[
G_{c,t}=\mathbb{1}(N_t\ge8\ \land\ L_{c,t}\ge3).
\]

The count is validation that the pattern later appeared more broadly in the
sample. It is not evidence that creator \(c\) caused those adoptions. At least
eight total cohort adopters and three later creators are proposed MVP gates,
not universal definitions of a trend.

## Metric 4: validated early-capture event

For the creator's first adoption post \(p(c,t)\):

\[
Z_{c,t}=A_{c,t}\times P_{p(c,t)}\times G_{c,t}.
\]

Thus a supported validated capture requires all three:

1. one of the first two observed positions within seven days;
2. at least 1.5× the creator's supported historical baseline;
3. at least eight total adopters and three later distinct adopters.

Keep the components visible. \(Z=0\) must not be interpreted as the same cause
in every case: the creator may be late, the post may not outperform, the trend
may fail to spread, or the data may be incomplete.

## State model

| State | Rule | Allowed claim |
| --- | --- | --- |
| Insufficient | \(n_{prior}<5\), \(B=0\), \(N_t<5\), left-censored episode, or missing fixed-horizon response | No breakout or early-capture claim |
| Provisional signal | \(A=1\), \(R\ge1.5\), \(G^{prov}=1\), but \(5\le n_{prior}<10\) or \(5\le N_t<8\) | “Possible early capture in this sample” |
| Early but unvalidated | \(A=1\), but performance or later-spread gate fails | “Early observed use”; no capture claim |
| Supported validated capture | \(A=P=G=1\) and \(n_{prior}\ge10\) | “Validated early capture within the observed cohort” |
| Late breakout | \(P=1\), \(A=0\) | “Strong creator-relative performance after early phase” |

## Worked event example

A creator has ten eligible prior posts with seven-day likes:

`80, 90, 100, 110, 120, 130, 140, 150, 160, 170`

The median is \((120+130)/2=125\). The adoption post receives 200 seven-day
likes:

\[
R=200/125=1.60,
\]

so \(P=1\).

Eight creators adopt the format in the 30-day episode. The creator is second,
three days after first observed use and with no timestamp tie:

\[
q=(2-1)/(8-1)=0.143,\qquad E=0.857,\qquad \Delta=3\text{ days},
\]

so \(A=1\). Six other creators adopt later, giving:

\[
L=6,\qquad V=6/7=0.857,\qquad G=1.
\]

Therefore \(Z=1\): this is one supported validated early-capture event. It is
not yet evidence of creator consistency.

## Missing and ambiguous cases

- **Same timestamp:** use midranks; never break ties by row order. All creators
  tied at the rank-2 boundary receive the same early-candidate status.
- **Multiple matching posts:** use the first observed adoption post only.
- **Pattern existed before collection:** mark `left_censored=true`; do not rank
  earliness.
- **Deleted or private post:** retain its metadata if lawfully recorded, mark
  response missing, and do not impute.
- **Response observed at the wrong age:** do not compare it with seven-day
  values. A tolerance such as 168±12 hours must be fixed in the data protocol.
- **Median baseline zero:** report the values and `not_classifiable`; do not
  convert one like into an infinite breakout or add a hidden constant.
- **Pattern label disagreement:** adjudicate before scoring and preserve both
  original labels.
- **Creator joins the cohort late:** exclude trends whose episodes began before
  the creator's observation start from that creator's consistency denominator.

## Sensitivity checks

Recompute event labels with all of the following, without selecting whichever
version looks best:

- breakout thresholds 1.25×, 1.5×, and 2×;
- prior-history minimums 5 and 10;
- early quotas of 1, 2, and 3 creators and seed windows of 3, 7, and 14 days;
- later-adopter minimums 2, 3, and 5;
- episode lengths 21 and 30 days if the collection period permits.

Report how many event labels change and the top-five creator overlap. A ranking
that changes completely under adjacent reasonable settings is not ready for a
strong product claim.

## Evidence versus product choice

### Supported by research

- Early adoption is relative to a trend lifecycle and comparison population
  [EA-01, EA-02].
- Trend stages and participant structure can change over time [EA-06].
- High volume does not by itself establish peer-to-peer virality [DF-02].
- Dense-stream burst methods require more temporal evidence than a small manual
  table supplies [BT-02].

### Proposed for this MVP

- 30-day episodes;
- first-adoption-only events;
- the first-two/7-day early-candidate gate;
- at least 5 adopters for provisional later evidence and 8 for supported later
  validation;
- median of up to 20 prior posts;
- 10 prior posts for a supported 1.5× breakout;
- three later adopters for validation.

## Primary sources

- Rahmtin Rotabi and Jon Kleinberg. “The Status Gradient of Trends in Social
  Media.” 2016. *Proceedings of the Tenth International AAAI Conference on Web
  and Social Media*, 319–328.
  [DOI](https://doi.org/10.1609/icwsm.v10i1.14725).
- Leihan Zhang, Jichang Zhao, and Ke Xu. “Who Creates Trends in Online Social
  Media: The Crowd or Opinion Leaders?” 2016. *Journal of Computer-Mediated
  Communication* 21(1), 1–16.
  [DOI](https://doi.org/10.1111/jcc4.12145).
- John Ziegler and Michael Gertz. “Who Is behind a Trend? Temporal Analysis of
  Interactions among Trend Participants on Twitter.” 2023. *Proceedings of the
  International AAAI Conference on Web and Social Media* 17(1), 960–969.
  [DOI](https://doi.org/10.1609/icwsm.v17i1.22203).
- Jon Kleinberg. “Bursty and Hierarchical Structure in Streams.” 2002.
  *Proceedings of the Eighth ACM SIGKDD International Conference on Knowledge
  Discovery and Data Mining*, 91–101.
  [DOI](https://doi.org/10.1145/775047.775061).
- Sharad Goel, Ashton Anderson, Jake Hofman, and Duncan J. Watts. “The
  Structural Virality of Online Diffusion.” 2016. *Management Science* 62(1),
  180–196. [DOI](https://doi.org/10.1287/mnsc.2015.2158).
