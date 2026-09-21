const LIFECYCLE_ORDER = new Map([
  ["Emerging", 0],
  ["Validated", 1],
  ["Fading", 2],
  ["Insufficient Evidence", 3],
]);

const VALID_LIFECYCLES = new Set(["all", ...LIFECYCLE_ORDER.keys()]);
const VALID_TYPES = new Set(["all", "format", "hook"]);
const VALID_SORTS = new Set(["default", "recency", "performance"]);

export const DEFAULT_RADAR_STATE = Object.freeze({ lifecycle: "all", type: "all", sort: "default" });

export const normalizeRadarState = (state = {}) => ({
  lifecycle: VALID_LIFECYCLES.has(state.lifecycle) ? state.lifecycle : DEFAULT_RADAR_STATE.lifecycle,
  type: VALID_TYPES.has(state.type) ? state.type : DEFAULT_RADAR_STATE.type,
  sort: VALID_SORTS.has(state.sort) ? state.sort : DEFAULT_RADAR_STATE.sort,
});

export const parseRoute = (hash = "") => {
  const fragment = hash.replace(/^#\/?/, "");
  const [path = "radar", query = ""] = fragment.split("?");
  const state = normalizeRadarState(Object.fromEntries(new URLSearchParams(query)));
  const match = path.match(/^pattern\/([^/]+)$/);
  return match
    ? { screen: "detail", patternId: decodeURIComponent(match[1]), state }
    : { screen: "radar", state };
};

const stateQuery = (state) => new URLSearchParams(normalizeRadarState(state)).toString();

export const radarHash = (state) => `#/radar?${stateQuery(state)}`;
export const detailHash = (patternId, state) => `#/pattern/${encodeURIComponent(patternId)}?${stateQuery(state)}`;

const compareNullableDescending = (left, right) => {
  if (left === null && right === null) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return right - left;
};

export const compareDefault = (left, right) =>
  (LIFECYCLE_ORDER.get(left.lifecycle) ?? 99) - (LIFECYCLE_ORDER.get(right.lifecycle) ?? 99)
  || right.adoption_metrics.recent_adopter_count - left.adoption_metrics.recent_adopter_count
  || right.adoption_metrics.distinct_adopter_count - left.adoption_metrics.distinct_adopter_count
  || compareNullableDescending(left.performance_metrics.median_view_lift, right.performance_metrics.median_view_lift)
  || left.identity.pattern_name.localeCompare(right.identity.pattern_name);

export const filterAndSortPatterns = (patterns, rawState) => {
  const state = normalizeRadarState(rawState);
  const filtered = patterns.filter((pattern) =>
    (state.lifecycle === "all" || pattern.lifecycle === state.lifecycle)
    && (state.type === "all" || pattern.identity.pattern_type === state.type));
  const compare = state.sort === "recency"
    ? (left, right) => compareNullableDescending(
      Date.parse(left.adoption_metrics.last_observed_at_utc),
      Date.parse(right.adoption_metrics.last_observed_at_utc),
    ) || compareDefault(left, right)
    : state.sort === "performance"
      ? (left, right) => compareNullableDescending(
        left.performance_metrics.median_view_lift,
        right.performance_metrics.median_view_lift,
      ) || compareDefault(left, right)
      : compareDefault;
  return filtered.toSorted(compare);
};

export const selectStrongSignals = (patterns, limit = 4) => patterns
  .map((pattern, index) => ({ pattern, index }))
  .toSorted((left, right) =>
    Number(right.pattern.lifecycle === "Validated") - Number(left.pattern.lifecycle === "Validated")
    || right.pattern.performance_metrics.supported_breakout_count - left.pattern.performance_metrics.supported_breakout_count
    || (Date.parse(left.pattern.adoption_metrics.first_observed_at_utc) - Date.parse(right.pattern.adoption_metrics.first_observed_at_utc) || 0)
    || left.index - right.index)
  .slice(0, limit)
  .map(({ pattern }) => pattern);

export const unavailableReason = (reason) => ({
  missing_candidate_views: "view count is missing",
  missing_post_age: "post date is missing",
  post_too_young: "post is less than 7 days old",
  performance_ineligible: "post is too new for a fair comparison",
  insufficient_baseline_history: "fewer than 5 earlier posts",
  zero_baseline: "earlier posts have zero recorded views",
  missing_reposts: "repost count is missing",
  missing_quotes: "quote count is missing",
  zero_candidate_views: "view count is zero",
  limited_view_lift_sample: "not enough qualifying posts",
  limited_amplification_sample: "not enough complete repost-and-quote data",
  unavailable_source_link: "no valid X source URL",
}[reason] || "reason wasn’t supplied by stage 3");

export const lifecycleReason = (pattern) => {
  const adopters = pattern.adoption_metrics.distinct_adopter_count;
  const recent = pattern.adoption_metrics.recent_adopter_count;
  const validated = pattern.validated_events.length;
  if (pattern.lifecycle === "Validated") {
    return `${validated} early example${validated === 1 ? "" : "s"} met every validation check and ${validated === 1 ? "was" : "were"} followed by later adoption.`;
  }
  if (pattern.lifecycle === "Emerging") {
    return `${recent} of ${adopters} creators picked it up in the last seven days. it’s still early.`;
  }
  if (pattern.lifecycle === "Fading") {
    return `${adopters} creators used it, but no one new picked it up in the last seven days.`;
  }
  return adopters < 2
    ? `only ${adopters} creator${adopters === 1 ? "" : "s"} used it in this cohort.`
    : "the pattern is still too young to judge fairly.";
};

export const signalSentence = (pattern) => {
  const adopters = pattern.adoption_metrics.distinct_adopter_count;
  const recent = pattern.adoption_metrics.recent_adopter_count;
  const validated = pattern.validated_events.length;
  if (pattern.lifecycle === "Validated") {
    return `${validated} early example${validated === 1 ? "" : "s"} in this cohort met the validation checks and ${validated === 1 ? "was" : "were"} followed by later adoption.`;
  }
  if (pattern.lifecycle === "Emerging") {
    return `${recent} of ${adopters} creators in this cohort picked it up recently, though it’s still early.`;
  }
  if (pattern.lifecycle === "Fading") {
    return "the pattern was observed in this cohort, but no one new picked it up in the last seven days.";
  }
  return "there isn’t enough evidence yet to assess this pattern in the observed cohort.";
};

export const representativePosts = (pattern, postsById) => {
  const eventByPostId = new Map(pattern.creator_evidence.map((event) => [event.first_adoption_post_id, event]));
  // Transparent ordering: validated events, then supported breakouts, then Stage 3 adoption time, then post ID.
  return pattern.representative_post_candidates
    .map((candidate) => ({ ...candidate, event: eventByPostId.get(candidate.post_id), post: postsById.get(candidate.post_id) }))
    .filter(({ event, post }) => event && post)
    .toSorted((left, right) =>
      Number(right.validated_early_capture) - Number(left.validated_early_capture)
      || Number(right.supported_breakout) - Number(left.supported_breakout)
      || Date.parse(left.event.adoption_order_at_utc) - Date.parse(right.event.adoption_order_at_utc)
      || left.post_id.localeCompare(right.post_id))
    .slice(0, 3);
};

export const timelinePosition = (event, observedFrom, observedTo) => {
  const start = Date.parse(observedFrom);
  const span = Date.parse(observedTo) - start;
  if (!Number.isFinite(span) || span <= 0) return 0;
  return Math.min(100, Math.max(0, ((Date.parse(event.adoption_order_at_utc) - start) / span) * 100));
};
