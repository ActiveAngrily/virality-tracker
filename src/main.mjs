import dataset from "../data/demo-data.json";
import { analyzeDataset } from "./analysis.mjs";
import {
  detailHash,
  filterAndSortPatterns,
  lifecycleReason,
  normalizeRadarState,
  parseRoute,
  radarHash,
  representativePosts,
  selectStrongSignals,
  signalSentence,
  timelinePosition,
  unavailableReason,
} from "./ui-model.mjs";
import "./styles.css";
import { drawDitherBackground } from "./dither.mjs";

const analysis = analyzeDataset(dataset);
const app = document.querySelector("#app");

const creatorsById = new Map(analysis.creators.map((creator) => [creator.creator_id, creator]));
const postsById = new Map(dataset.posts.map((post) => [post.post_id, post]));
const definitionsById = new Map([
  ...dataset.codebook.format_patterns,
  ...dataset.codebook.hook_patterns,
].map((definition) => [definition.id, definition]));
const familiesById = new Map(dataset.codebook.format_families.map((family) => [family.id, family]));
let hasRendered = false;

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const numberFormatter = new Intl.NumberFormat("en");

const lowerText = (value) => String(value ?? "").toLocaleLowerCase("en");
const formatDate = (value) => value ? dateFormatter.format(new Date(value)).toLocaleLowerCase("en") : "unavailable";
const formatNumber = (value) => value === null || value === undefined ? "unavailable" : numberFormatter.format(value);
const formatRatio = (value) => value === null ? "unavailable" : `${value.toFixed(2)}×`;
const formatRate = (value) => value === null ? "unavailable" : `${(value * 100).toFixed(2)}%`;
const formatPercentile = (value) => value === null ? "unavailable" : `${Math.round(value * 100)}th percentile`;
const formatAge = (hours) => hours === null ? "unavailable" : `${numberFormatter.format(Math.round(hours))} hours (${(hours / 24).toFixed(1)} days)`;
const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`;
const lifecycleLabels = {
  Validated: "validated",
  Emerging: "emerging",
  Fading: "fading",
  "Insufficient Evidence": "not enough evidence",
};
const evidenceLabels = { Supported: "supported evidence", Provisional: "provisional evidence", Limited: "limited evidence" };
const comparisonLabels = { Supported: "supported baseline", Provisional: "provisional baseline", Limited: "limited baseline" };

const badge = (label, kind = "neutral") => `<span class="badge badge--${escapeHtml(kind)}">${escapeHtml(label)}</span>`;

const metric = (label, value, note = "") => `
  <div class="metric">
    <dt>${escapeHtml(label)}</dt>
    <dd>${value}</dd>
    ${note ? `<span>${escapeHtml(note)}</span>` : ""}
  </div>`;

const unavailable = (reason) => `<span class="unavailable">unavailable — ${escapeHtml(unavailableReason(reason))}</span>`;

const externalSource = (url, creatorName) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.hostname !== "x.com") throw new Error("invalid source");
    return `<a href="${escapeHtml(parsed.href)}" target="_blank" rel="noreferrer">open ${escapeHtml(creatorName)}’s source post on X <span aria-hidden="true">↗</span></a>`;
  } catch {
    return unavailable("unavailable_source_link");
  }
};

const shell = (content) => `<div class="content-canvas">${content}</div>`;

const contextPanel = () => {
  const metadata = dataset.metadata;
  return `
    <section id="methods" class="context-panel" aria-labelledby="context-heading">
      <div class="section-heading section-heading--compact">
        <p class="eyebrow">snapshot</p>
        <h2 id="context-heading">fixed research context</h2>
      </div>
      <dl class="context-grid">
        <div><dt>platform</dt><dd>${escapeHtml(metadata.platform)}</dd></div>
        <div><dt>cohort</dt><dd>${analysis.summary.analyzed_creator_count} public creators across b2b tech, startups, product, growth, venture, and developer tools.</dd></div>
        <div><dt>observation window</dt><dd>${formatDate(metadata.observed_from_utc)}–${formatDate(metadata.observed_to_utc)}</dd></div>
        <div><dt>analysis date</dt><dd>${formatDate(metadata.analysis_as_of_utc)}</dd></div>
        <div><dt>collection date</dt><dd>${formatDate(metadata.collection_completed_at_utc)}</dd></div>
        <div><dt>view metric</dt><dd>public views captured at collection for posts at least ${Math.round(dataset.thresholds.minimum_post_age_hours / 24)} days old.</dd></div>
        <div><dt>codebook version</dt><dd>${escapeHtml(metadata.codebook_version)}</dd></div>
        <div><dt>threshold version</dt><dd>${escapeHtml(metadata.threshold_version)}</dd></div>
      </dl>
      <p class="context-limitation"><strong>scope:</strong> this is one selected cohort and one fixed snapshot. it doesn’t show who originated a pattern, what caused it, or what will happen next.</p>
    </section>`;
};

const patternMetric = (label, value, sample, formatter, reason) => metric(
  label,
  value === null ? unavailable(reason) : `<span class="tabular">${formatter(value)}</span>`,
  `based on ${plural(sample, "qualifying post")}`,
);

// Teaching copy comes from the frozen codebook, not new pattern analysis.
const patternExplanation = (pattern) => {
  const definition = definitionsById.get(pattern.identity.pattern_id);
  return `<div class="pattern-explanation">
    <p>${escapeHtml(lowerText(definition?.definition || "description unavailable in the frozen codebook."))}</p>
    ${definition?.positive_example ? `<div class="pattern-example"><span>illustration · not an observed post</span><p>“${escapeHtml(definition.positive_example)}”</p></div>` : ""}
  </div>`;
};

const patternTypeLabel = (type) => type === "format" ? "format · how the post is structured" : "hook · how the post opens";

const renderSignalCard = (pattern, state) => {
  const family = familiesById.get(pattern.identity.format_family_id);
  const metrics = pattern.performance_metrics;
  const adoption = pattern.adoption_metrics;
  const lifecycleClass = pattern.lifecycle.toLowerCase().replaceAll(" ", "-");
  return `
    <article class="signal-card">
      <header>
        <div>
          <p class="pattern-kicker">${patternTypeLabel(pattern.identity.pattern_type)}</p>
          <h3><a href="${detailHash(pattern.identity.pattern_id, state)}">${escapeHtml(lowerText(pattern.identity.pattern_name))}</a></h3>
        </div>
        ${badge(lifecycleLabels[pattern.lifecycle] || lowerText(pattern.lifecycle), lifecycleClass)}
      </header>
      ${patternExplanation(pattern)}
      <p class="signal-reason">${escapeHtml(lifecycleReason(pattern))}</p>
      <dl class="signal-card__facts">
        ${metric("creators who used it", `<span class="tabular">${adoption.distinct_adopter_count} / ${analysis.summary.analyzed_creator_count}</span>`)}
        ${patternMetric("median view lift", metrics.median_view_lift, metrics.view_lift_sample_size, formatRatio, "limited_view_lift_sample")}
      </dl>
      <a class="action-link" href="${detailHash(pattern.identity.pattern_id, state)}">open evidence <span aria-hidden="true">→</span></a>
    </article>`;
};

const renderPatternCard = (pattern, state) => {
  const definition = definitionsById.get(pattern.identity.pattern_id);
  const family = familiesById.get(pattern.identity.format_family_id);
  const metrics = pattern.performance_metrics;
  const adoption = pattern.adoption_metrics;
  const lifecycleClass = pattern.lifecycle.toLowerCase().replaceAll(" ", "-");
  return `
    <article class="pattern-card pattern-card--${lifecycleClass}">
      <header class="pattern-card__header">
        <div>
          <p class="pattern-kicker">${patternTypeLabel(pattern.identity.pattern_type)}</p>
          <h3><a href="${detailHash(pattern.identity.pattern_id, state)}">${escapeHtml(lowerText(pattern.identity.pattern_name))}</a></h3>
        </div>
        <div class="badge-row">
          ${badge(lifecycleLabels[pattern.lifecycle] || lowerText(pattern.lifecycle), lifecycleClass)}
          ${badge(evidenceLabels[pattern.evidence_quality] || `${lowerText(pattern.evidence_quality)} evidence`, `evidence-${pattern.evidence_quality.toLowerCase()}`)}
        </div>
      </header>
      ${patternExplanation(pattern)}
      ${family ? `<p class="pattern-kicker">format family: ${escapeHtml(lowerText(family.name))}</p>` : ""}
      <dl class="metric-grid metric-grid--card">
        ${metric("creators who used it", `<span class="tabular">${adoption.distinct_adopter_count} / ${analysis.summary.analyzed_creator_count}</span>`)}
        ${metric("first used in the last 7 days", `<span class="tabular">${adoption.recent_adopter_count}</span>`)}
        ${patternMetric("median view lift", metrics.median_view_lift, metrics.view_lift_sample_size, formatRatio, "limited_view_lift_sample")}
        ${patternMetric("amplification rate", metrics.median_amplification_rate, metrics.amplification_rate_sample_size, formatRate, "limited_amplification_sample")}
        ${metric("supported breakouts", `<span class="tabular">${metrics.supported_breakout_count}</span>`)}
        ${metric("validated captures", `<span class="tabular">${pattern.validated_events.length}</span>`)}
        ${metric("last observed", `<span class="tabular">${formatDate(adoption.last_observed_at_utc)}</span>`)}
      </dl>
      <p class="pattern-reason"><strong>${escapeHtml(lifecycleLabels[pattern.lifecycle] || lowerText(pattern.lifecycle))}:</strong> ${escapeHtml(lifecycleReason(pattern))}</p>
      <a class="action-link" href="${detailHash(pattern.identity.pattern_id, state)}">open evidence <span aria-hidden="true">→</span></a>
    </article>`;
};

const renderRadar = (rawState) => {
  const state = normalizeRadarState(rawState);
  const patterns = filterAndSortPatterns(analysis.patterns, state);
  const counts = analysis.summary.lifecycle_counts;
  const strongPatterns = selectStrongSignals(analysis.patterns, 3);
  document.title = "radar · viral format radar";
  return shell(`
    <main id="main-content" class="page-shell radar-page">
      <section class="page-heading">
        <div class="hero-meta"><span>field notes / ${analysis.summary.analyzed_creator_count} creators</span><span>${formatDate(dataset.metadata.analysis_as_of_utc)}</span></div>
        <h1 tabindex="-1">virality tracker<br><em>a closer look at what spreads</em></h1>
        <p>how do creators structure their posts, and how do they get readers interested? explore recurring patterns across ${analysis.summary.analyzed_creator_count} public X creators.</p>
        <a class="hero-action" href="#reading-guide-heading">how to read the radar <span aria-hidden="true">↘</span></a>
      </section>
      <section class="reading-guide" aria-labelledby="reading-guide-heading">
        <div class="section-heading">
          <p class="eyebrow">start here</p>
          <h2 id="reading-guide-heading">two ways to read a post</h2>
          <p>a pattern is a recurring approach, not a topic. one post can have both a format and a hook.</p>
        </div>
        <div class="concept-grid">
          <article><span class="pattern-kicker">01 / the structure</span><h3>format</h3><p>how the whole post is put together: a walkthrough, a comparison, a list, or a story.</p><p class="concept-example">“before-and-after workflow demo” shows the same task before and after a change.</p></article>
          <article><span class="pattern-kicker">02 / the opening</span><h3>hook</h3><p>how the post starts: a problem, a surprising claim, a result, or a personal lesson.</p><p class="concept-example">“pain / problem” starts with something that isn’t working, before introducing a solution.</p></article>
        </div>
        <p class="guide-note">for example, a post could open with a frustrating task <strong>(hook)</strong>, then demonstrate a better workflow <strong>(format)</strong>. these are two labels for the same post, not two separate posts.</p>
      </section>
      <section class="snapshot-strip" aria-labelledby="snapshot-heading">
        <h2 id="snapshot-heading" class="visually-hidden">snapshot</h2>
        <dl class="summary-grid">
          ${metric("validated patterns", `<span class="tabular">${counts.Validated ?? 0}</span>`, "early performance and later adoption met the checks")}
          ${metric("emerging patterns", `<span class="tabular">${counts.Emerging ?? 0}</span>`, "recent first uses; still early")}
          ${metric("fading patterns", `<span class="tabular">${counts.Fading ?? 0}</span>`, "older patterns with no recent new adopters")}
          ${metric("tracked creators", `<span class="tabular">${analysis.summary.analyzed_creator_count}</span>`)}
        </dl>
      </section>
      <section id="strong-signals" aria-labelledby="strong-signals-heading">
        <div class="section-heading">
          <p class="eyebrow">what we found</p>
          <h2 id="strong-signals-heading">signals worth inspecting</h2>
          <p>start with these three patterns, then browse the full list below. each card explains the idea before showing the evidence.</p>
          <details class="metric-guide"><summary>how to read the evidence</summary>
            <dl>
              <div><dt>creators who used it</dt><dd>different creators observed using this pattern, out of ${analysis.summary.analyzed_creator_count}. repeat posts don’t add new creators.</dd></div>
              <div><dt>median view lift</dt><dd>views compared with the same creator’s earlier posts. 2× means twice their usual views; 0.5× means half. the median is the middle comparison, not a forecast.</dd></div>
              <div><dt>supported breakout</dt><dd>a qualifying first-use post with at least ${dataset.thresholds.view_breakout_threshold}× the creator’s baseline and at least ${dataset.thresholds.supported_baseline_minimum} earlier posts for comparison.</dd></div>
              <div><dt>validated capture</dt><dd>an early use that met the breakout and later-adoption checks. this doesn’t show who originated or caused a pattern.</dd></div>
              <div><dt>amplification rate</dt><dd>reposts plus quotes divided by views. it’s unavailable when either count is missing.</dd></div>
              <div><dt>evidence quality</dt><dd>supported means at least one creator has a baseline from ${dataset.thresholds.supported_baseline_minimum} or more earlier posts; provisional means at least ${dataset.thresholds.provisional_baseline_minimum}; limited means less usable history.</dd></div>
            </dl>
            <p>featured patterns appear in this order: validated patterns, number of supported breakouts, then first observed use. there’s no combined score.</p>
          </details>
        </div>
        <div class="signal-list">${strongPatterns.map((pattern) => renderSignalCard(pattern, state)).join("")}</div>
      </section>
      <section aria-labelledby="patterns-heading">
        <div class="results-heading">
          <div class="section-heading">
            <p class="eyebrow">evidence index</p>
            <h2 id="patterns-heading">explore every pattern</h2>
            <p>read the explanation and illustration, then compare the evidence. open a pattern to see the actual source posts and who used it.</p>
          </div>
          <p class="result-count" aria-live="polite">${plural(patterns.length, "pattern")}</p>
        </div>
        <form class="filters" aria-label="filter and sort patterns">
          <div>
            <label for="lifecycle-filter">lifecycle</label>
            <select id="lifecycle-filter" name="lifecycle">
              ${[["all", "all lifecycle states"], ["Validated", "validated"], ["Emerging", "emerging"], ["Fading", "fading"], ["Insufficient Evidence", "not enough evidence"]].map(([value, label]) => `<option value="${escapeHtml(value)}" ${state.lifecycle === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>
          <div>
            <label for="type-filter">pattern type</label>
            <select id="type-filter" name="type">
              ${[["all", "all pattern types"], ["format", "formats — post structure"], ["hook", "hooks — post opening"]].map(([value, label]) => `<option value="${value}" ${state.type === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>
          <div>
            <label for="sort-select">sort</label>
            <select id="sort-select" name="sort">
              ${[["default", "default order"], ["recency", "most recent"], ["performance", "highest view lift"]].map(([value, label]) => `<option value="${value}" ${state.sort === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>
        </form>
        ${patterns.length
          ? `<div class="pattern-list">${patterns.map((pattern) => renderPatternCard(pattern, state)).join("")}</div>`
          : `<div class="empty-state" role="status"><h3>no patterns match</h3><p>try another lifecycle or pattern type.</p></div>`}
      </section>
      ${contextPanel()}
    </main>`, state);
};

const adoptionTimeline = (pattern) => {
  const recentIds = new Set(pattern.adoption_metrics.recent_adopter_creator_ids);
  const events = pattern.creator_evidence;
  return `
    <section id="spread" aria-labelledby="timeline-heading">
      <div class="section-heading">
        <p class="eyebrow">adoption</p>
        <h2 id="timeline-heading">adoption timeline</h2>
        <p>each dot marks the first observed use by a creator in this cohort. the complete event list follows the visual.</p>
      </div>
      <div class="timeline-visual" aria-hidden="true">
        <span class="timeline-track"></span>
        ${events.map((event) => `<span class="timeline-dot ${event.early_adopter ? "timeline-dot--early" : ""} ${recentIds.has(event.creator_id) ? "timeline-dot--recent" : ""}" style="--position:${timelinePosition(event, analysis.analysis_context.observed_from_utc, analysis.analysis_context.observed_to_utc).toFixed(3)}%"></span>`).join("")}
      </div>
      <div class="timeline-key" aria-hidden="true"><span><i></i>observed use</span><span><i class="early"></i>early adopter</span><span><i class="recent"></i>recent activity</span></div>
      <ol class="timeline-list">
        ${events.map((event) => {
          const creator = creatorsById.get(event.creator_id);
          const precision = event.first_adoption_precision === "exact_time" ? "exact timestamp" : `approximate ${event.first_adoption_precision} precision`;
          return `<li>
            <div><strong>${escapeHtml(creator?.creator_name || event.creator_id)}</strong> <span>${escapeHtml(creator?.creator_handle || "")}</span></div>
            <p><span class="tabular">${formatDate(event.first_adoption_at_utc)}</span> · ${escapeHtml(precision)} · rank ${event.adoption_rank} · ${event.adoption_percentile === null ? "percentile unavailable" : formatPercentile(event.adoption_percentile)}</p>
            <p>${event.adoption_order_at_utc === events[0].adoption_order_at_utc ? "first observed use · " : ""}${event.early_adopter ? "early adopter" : "later adopter"}${recentIds.has(event.creator_id) ? " · recent activity" : ""} · ${plural(event.later_adopter_count, "later adopter")}</p>
          </li>`;
        }).join("")}
      </ol>
    </section>`;
};

const viewLiftValue = (performance) => performance.view_lift === null
  ? unavailable(performance.view_lift_unavailable_reason)
  : `<span class="tabular">${formatRatio(performance.view_lift)}</span> <span class="formula">(${formatNumber(performance.view_lift_numerator)} views vs. ${formatNumber(performance.view_lift_denominator)} typical; ${plural(performance.baseline_prior_count, "earlier post")})</span>`;

const creatorEvidenceCard = (event, patternId) => {
  const creator = creatorsById.get(event.creator_id);
  const performance = event.performance;
  const sourceName = creator?.creator_name || event.creator_id;
  return `
    <article class="evidence-card">
      <header>
        <div>
          <h3>${escapeHtml(sourceName)}</h3>
          <p>${escapeHtml(creator?.creator_handle || "handle unavailable")}</p>
        </div>
        <div class="badge-row">
          ${badge(event.early_adopter ? "early adopter" : "later adopter", event.early_adopter ? "early" : "neutral")}
          ${badge(comparisonLabels[performance.baseline_quality] || `${lowerText(performance.baseline_quality)} baseline`, `evidence-${performance.baseline_quality.toLowerCase()}`)}
        </div>
      </header>
      <dl class="evidence-grid">
        ${metric("first use", `<span class="tabular">${formatDate(event.first_adoption_at_utc)}</span>`, event.first_adoption_precision === "exact_time" ? "exact timestamp" : `approximate ${event.first_adoption_precision} precision`)}
        ${metric("adoption position", `<span class="tabular">rank ${event.adoption_rank} · ${event.adoption_percentile === null ? unavailable("insufficient_adopters") : formatPercentile(event.adoption_percentile)}</span>`)}
        ${metric("views", performance.candidate_views === null ? unavailable("missing_candidate_views") : `<span class="tabular">${formatNumber(performance.candidate_views)}</span>`)}
        ${metric("likes", performance.likes === null ? `<span class="unavailable">unavailable — source count is missing</span>` : `<span class="tabular">${formatNumber(performance.likes)}</span>`)}
        ${metric("replies", performance.replies === null ? `<span class="unavailable">unavailable — source count is missing</span>` : `<span class="tabular">${formatNumber(performance.replies)}</span>`)}
        ${metric("reposts", performance.reposts === null ? unavailable("missing_reposts") : `<span class="tabular">${formatNumber(performance.reposts)}</span>`)}
        ${metric("quotes", performance.quotes === null ? unavailable("missing_quotes") : `<span class="tabular">${formatNumber(performance.quotes)}</span>`)}
        ${metric("collection date", `<span class="tabular">${formatDate(performance.collected_at_utc)}</span>`)}
        ${metric("post age", `<span class="tabular">${formatAge(performance.post_age_hours_at_collection)}</span>`)}
        ${metric("creator baseline", performance.baseline === null ? unavailable(performance.view_lift_unavailable_reason) : `<span class="tabular">${formatNumber(performance.baseline)} views</span>`, `${plural(performance.baseline_prior_count, "prior post")} · ${lowerText(performance.baseline_quality)}`)}
        ${metric("view lift", viewLiftValue(performance), performance.supported_breakout ? "supported breakout" : "not a supported breakout")}
        ${metric("amplification count", performance.amplifications === null ? unavailable(performance.amplification_unavailable_reason) : `<span class="tabular">${formatNumber(performance.amplifications)}</span>`)}
        ${metric("amplification rate", performance.amplification_rate === null ? unavailable(performance.amplification_rate_unavailable_reason) : `<span class="tabular">${formatRate(performance.amplification_rate)}</span>`)}
        ${metric("later adopters", `<span class="tabular">${event.later_adopter_count}</span>`)}
        ${metric("repeat uses", `<span class="tabular">${event.repeat_use_count}</span>`)}
        ${creator?.validated_format_pattern_ids ? metric("other validated formats", `<span class="tabular">${creator.validated_format_pattern_ids.filter((id) => id !== patternId).length}</span>`) : ""}
      </dl>
      <div class="source-action">${externalSource(event.first_adoption_post_url, sourceName)}</div>
    </article>`;
};

const representativePostCard = ({ event, post }) => {
  const creator = creatorsById.get(event.creator_id);
  const performance = event.performance;
  const sourceName = creator?.creator_name || event.creator_id;
  return `
    <article class="post-card">
      <header>
        <div><h3>${escapeHtml(sourceName)}</h3><p>${escapeHtml(creator?.creator_handle || "")} · <span class="tabular">${formatDate(post.posted_at_utc)}</span></p></div>
        ${event.validated_early_capture ? badge("validated capture", "validated") : event.performance.supported_breakout ? badge("supported breakout", "early") : badge("observed use")}
      </header>
      <blockquote>${escapeHtml(post.text_excerpt || "text excerpt unavailable — source text is missing.")}</blockquote>
      <p class="labels"><strong>format:</strong> ${escapeHtml(lowerText(post.format_pattern_name || "unclassified"))} · <strong>hook:</strong> ${escapeHtml(lowerText(post.hook_pattern_name || "unclassified"))}</p>
      <dl class="post-metrics">
        ${metric("views", performance.candidate_views === null ? unavailable("missing_candidate_views") : `<span class="tabular">${formatNumber(performance.candidate_views)}</span>`)}
        ${metric("likes", performance.likes === null ? `<span class="unavailable">unavailable — source count is missing</span>` : `<span class="tabular">${formatNumber(performance.likes)}</span>`)}
        ${metric("replies", performance.replies === null ? `<span class="unavailable">unavailable — source count is missing</span>` : `<span class="tabular">${formatNumber(performance.replies)}</span>`)}
        ${metric("reposts", performance.reposts === null ? unavailable("missing_reposts") : `<span class="tabular">${formatNumber(performance.reposts)}</span>`)}
        ${metric("quotes", performance.quotes === null ? unavailable("missing_quotes") : `<span class="tabular">${formatNumber(performance.quotes)}</span>`)}
        ${metric("creator baseline", performance.baseline === null ? unavailable(performance.view_lift_unavailable_reason) : `<span class="tabular">${formatNumber(performance.baseline)}</span>`, `${plural(performance.baseline_prior_count, "earlier post")}`)}
        ${metric("view lift", viewLiftValue(performance))}
        ${metric("amplification rate", performance.amplification_rate === null ? unavailable(performance.amplification_rate_unavailable_reason) : `<span class="tabular">${formatRate(performance.amplification_rate)}</span>`)}
      </dl>
      <div class="source-action">${externalSource(post.post_url, sourceName)}</div>
    </article>`;
};

const limitations = (pattern) => {
  const metrics = pattern.performance_metrics;
  const hasApproximateTime = pattern.creator_evidence.some((event) => event.first_adoption_precision !== "exact_time");
  return `
    <section id="limits" class="limitations" aria-labelledby="limitations-heading">
      <div class="section-heading">
        <p class="eyebrow">keep in mind</p>
        <h2 id="limitations-heading">limits of the data</h2>
      </div>
      <ul>
        <li><strong>one selected cohort:</strong> here’s what we saw among ${analysis.summary.analyzed_creator_count} public creators. it doesn’t describe all of X.</li>
        <li><strong>performance sample:</strong> median view lift uses ${plural(metrics.view_lift_sample_size, "qualifying first post")}. fewer than ${dataset.thresholds.minimum_pattern_metric_sample} qualifying posts means the median is unavailable. keep the small sample in mind.</li>
        <li><strong>baseline limits:</strong> each post is compared with up to ${dataset.thresholds.baseline_history_cap} earlier posts from the same creator. a provisional baseline has less history; missing or zero baselines can’t support a view-lift comparison.</li>
        <li><strong>missing counts:</strong> repost or quote counts weren’t available for some posts. amplification is unavailable if either count is missing; missing values never become zero.</li>
        <li><strong>young posts:</strong> posts younger than ${Math.round(dataset.thresholds.minimum_post_age_hours / 24)} days at collection aren’t old enough to compare fairly.</li>
        <li><strong>timestamp precision:</strong> ${hasApproximateTime ? "some dates are approximate, so the order within those dates isn’t known." : "first-use posts in this pattern have exact timestamps."} tied timestamps share their adoption position.</li>
        <li><strong>observation window:</strong> first observed means first seen between ${formatDate(dataset.metadata.observed_from_utc)} and ${formatDate(dataset.metadata.observed_to_utc)}. activity outside that window isn’t included.</li>
        <li><strong>earlier uses may be missing:</strong> the pattern could predate this window. this left-censoring risk means the first creator here may not be the first to use it.</li>
        <li><strong>unclassified labels:</strong> posts without a classified format or hook remain unclassified. they don’t establish adoption for that label.</li>
        <li><strong>no causal claims:</strong> later adoption doesn’t show that an earlier creator caused it. these observations aren’t predictions or guarantees.</li>
      </ul>
    </section>`;
};

const renderDetail = (patternId, rawState) => {
  const state = normalizeRadarState(rawState);
  const pattern = analysis.patterns.find((item) => item.identity.pattern_id === patternId);
  if (!pattern) {
    document.title = "pattern unavailable · viral format radar";
    return shell(`<main id="main-content" class="page-shell"><a class="back-link" href="${radarHash(state)}">← back to radar</a><section class="empty-state"><h1 tabindex="-1">pattern unavailable</h1><p>we couldn’t find that pattern in this snapshot.</p></section></main>`, state);
  }
  const definition = definitionsById.get(pattern.identity.pattern_id);
  const family = familiesById.get(pattern.identity.format_family_id);
  const adoption = pattern.adoption_metrics;
  const metrics = pattern.performance_metrics;
  const representatives = representativePosts(pattern, postsById);
  const firstEvent = pattern.creator_evidence[0];
  document.title = `${lowerText(pattern.identity.pattern_name)} · viral format radar`;
  return shell(`
    <main id="main-content" class="page-shell research-page">
      <a class="back-link" href="${radarHash(state)}">← back to radar</a>
      <section class="detail-heading">
        <p class="eyebrow">research note · ${escapeHtml(pattern.identity.pattern_type)}${family ? ` · ${escapeHtml(lowerText(family.name))}` : ""}</p>
        <h1 tabindex="-1">${escapeHtml(lowerText(pattern.identity.pattern_name))}</h1>
        <p class="pattern-kicker">${patternTypeLabel(pattern.identity.pattern_type)}</p>
        ${patternExplanation(pattern)}
        <div class="badge-row">
          ${badge(lifecycleLabels[pattern.lifecycle] || pattern.lifecycle, pattern.lifecycle.toLowerCase().replaceAll(" ", "-"))}
          ${badge(evidenceLabels[pattern.evidence_quality] || pattern.evidence_quality, `evidence-${pattern.evidence_quality.toLowerCase()}`)}
        </div>
        <dl class="detail-dates">
          <div><dt>first observed</dt><dd class="tabular">${formatDate(adoption.first_observed_at_utc)}</dd></div>
          <div><dt>last observed</dt><dd class="tabular">${formatDate(adoption.last_observed_at_utc)}</dd></div>
          <div><dt>analysis date</dt><dd class="tabular">${formatDate(analysis.analysis_context.analysis_as_of_utc)}</dd></div>
        </dl>
      </section>
      <nav class="paper-nav" aria-label="on this page">
        <span>on this page</span>
        <a href="#findings">evidence</a>
        <a href="#spread">timeline</a>
        <a href="#creator-results">creators</a>
        <a href="#examples">source posts</a>
        <a href="#limits">limits of the data</a>
        <a href="#methods">context</a>
      </nav>
      <section class="signal-panel" aria-labelledby="signal-heading">
        <p class="eyebrow">signal</p>
        <h2 id="signal-heading">why this stands out</h2>
        <p>${escapeHtml(signalSentence(pattern))}</p>
      </section>
      <section id="findings" aria-labelledby="evidence-summary-heading">
        <div class="section-heading">
          <p class="eyebrow">evidence</p>
          <h2 id="evidence-summary-heading">evidence summary</h2>
        </div>
        <dl class="metric-grid metric-grid--summary">
          ${metric("creators who used it", `<span class="tabular">${adoption.distinct_adopter_count} / ${analysis.summary.analyzed_creator_count}</span>`)}
          ${metric("first used in the last 7 days", `<span class="tabular">${adoption.recent_adopter_count}</span>`)}
          ${metric("early adopters", `<span class="tabular">${adoption.early_adopter_count}</span>`)}
          ${metric("later adopters after first use", `<span class="tabular">${firstEvent?.later_adopter_count ?? 0}</span>`)}
          ${patternMetric("median view lift", metrics.median_view_lift, metrics.view_lift_sample_size, formatRatio, "limited_view_lift_sample")}
          ${patternMetric("median amplification rate", metrics.median_amplification_rate, metrics.amplification_rate_sample_size, formatRate, "limited_amplification_sample")}
          ${metric("supported breakouts", `<span class="tabular">${metrics.supported_breakout_count}</span>`)}
          ${metric("validated captures", `<span class="tabular">${pattern.validated_events.length}</span>`)}
          ${metric("repeat uses", `<span class="tabular">${adoption.repeat_use_count}</span>`)}
          ${metric("repeat creators", `<span class="tabular">${adoption.repeat_creator_count}</span>`)}
        </dl>
      </section>
      ${adoptionTimeline(pattern)}
      <section id="creator-results" aria-labelledby="creator-evidence-heading">
        <div class="section-heading">
          <p class="eyebrow">adoption order</p>
          <h2 id="creator-evidence-heading">creator evidence</h2>
          <p>creators appear in first-use order within this cohort. this isn’t a creator ranking.</p>
        </div>
        <div class="evidence-list">${pattern.creator_evidence.map((event) => creatorEvidenceCard(event, patternId)).join("")}</div>
      </section>
      <section id="examples" aria-labelledby="representative-posts-heading">
        <div class="section-heading">
          <p class="eyebrow">source posts</p>
          <h2 id="representative-posts-heading">source posts</h2>
          <p>examples appear in a fixed order: validated captures, supported breakouts, then first-use order.</p>
        </div>
        <div class="post-list">${representatives.map(representativePostCard).join("")}</div>
      </section>
      ${limitations(pattern)}
      ${contextPanel()}
    </main>`, state);
};

const bindRadarControls = () => {
  const form = document.querySelector(".filters");
  if (!form) return;
  form.addEventListener("change", () => {
    const values = Object.fromEntries(new FormData(form));
    location.hash = radarHash(values);
  });
};

const render = () => {
  const activeControl = document.activeElement?.matches(".filters select") ? document.activeElement.id : null;
  const route = parseRoute(location.hash);
  app.innerHTML = route.screen === "detail"
    ? renderDetail(route.patternId, route.state)
    : renderRadar(route.state);
  bindRadarControls();
  if (hasRendered) {
    if (!activeControl) window.scrollTo(0, 0);
    (document.getElementById(activeControl) || document.querySelector("h1"))?.focus({ preventScroll: true });
  }
  hasRendered = true;
};

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.hash.startsWith("#/")) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  target.scrollIntoView();
});
window.addEventListener("hashchange", render);
render();
drawDitherBackground(document.querySelector("#dither-background"));
