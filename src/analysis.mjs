const DAY_MS = 86_400_000;
const UNCLASSIFIED = new Set(["FP-UNCLASSIFIED", "HP-UNCLASSIFIED"]);
const COUNT_FIELDS = [
  "views_at_collection",
  "likes_at_collection",
  "replies_at_collection",
  "reposts_at_collection",
  "quotes_at_collection",
];
const SUPPORTED_VERSIONS = {
  schema: "vfr-x-schema-1.0",
  codebook: "vfr-x-codebook-1.0",
  thresholds: "vfr-x-thresholds-1.0",
};
const FROZEN_THRESHOLDS = {
  max_collected_posts_per_creator: 50,
  baseline_history_cap: 20,
  minimum_post_age_hours: 168,
  provisional_baseline_minimum: 5,
  supported_baseline_minimum: 10,
  view_breakout_threshold: 1.5,
  pattern_episode_days: 30,
  recent_window_days: 7,
  minimum_validated_adopters: 4,
  minimum_later_adopters: 2,
  early_adoption_percentile_max: 0.25,
  fading_age_minimum_days: 14,
  minimum_pattern_metric_sample: 2,
};

const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const timestamp = (value) => Date.parse(value);

const orderTime = (post) => {
  const date = new Date(post.posted_at_utc);
  if (post.posted_at_precision === "hour") date.setUTCMinutes(0, 0, 0);
  if (post.posted_at_precision === "day" || post.posted_at_precision === "unknown") {
    date.setUTCHours(0, 0, 0, 0);
  }
  return date.getTime();
};

const increment = (object, key) => {
  object[key] = (object[key] || 0) + 1;
};

const duplicates = (values) => {
  const seen = new Set();
  return values.filter((value) => (seen.has(value) ? true : !seen.add(value)));
};

export function validateDataset(dataset) {
  const errors = [];
  const metadata = dataset?.metadata || {};
  const codebook = dataset?.codebook || {};
  const thresholds = dataset?.thresholds || {};
  const creators = Array.isArray(dataset?.creators) ? dataset.creators : [];
  const posts = Array.isArray(dataset?.posts) ? dataset.posts : [];
  const add = (condition, message) => condition && errors.push(message);

  add(metadata.schema_version !== SUPPORTED_VERSIONS.schema, `unsupported schema version: ${metadata.schema_version}`);
  add(dataset?.schema?.version !== SUPPORTED_VERSIONS.schema, `schema object version mismatch: ${dataset?.schema?.version}`);
  add(metadata.codebook_version !== SUPPORTED_VERSIONS.codebook, `unsupported codebook version: ${metadata.codebook_version}`);
  add(codebook.version !== SUPPORTED_VERSIONS.codebook, `codebook object version mismatch: ${codebook.version}`);
  add(metadata.threshold_version !== SUPPORTED_VERSIONS.thresholds, `unsupported threshold version: ${metadata.threshold_version}`);
  add(thresholds.version !== SUPPORTED_VERSIONS.thresholds, `threshold object version mismatch: ${thresholds.version}`);
  for (const [key, value] of Object.entries(FROZEN_THRESHOLDS)) {
    add(thresholds[key] !== value, `frozen threshold mismatch: ${key}`);
  }
  const expectedCreatorCount = metadata.expected_creator_count ?? 30;
  add(creators.length !== expectedCreatorCount, `expected ${expectedCreatorCount} creators, received ${creators.length}`);

  const duplicateCreatorIds = [...new Set(duplicates(creators.map((creator) => creator.creator_id)))];
  for (const id of duplicateCreatorIds) errors.push(`duplicate creator_id: ${id}`);
  const creatorById = new Map(creators.map((creator) => [creator.creator_id, creator]));
  const formatFamilies = new Map((codebook.format_families || []).map((item) => [item.id, item]));
  const formats = new Map((codebook.format_patterns || []).map((item) => [item.id, item]));
  const hooks = new Map((codebook.hook_patterns || []).map((item) => [item.id, item]));
  const postTypes = new Set(dataset?.schema?.enums?.post_type || []);
  const precisions = new Set(dataset?.schema?.enums?.posted_at_precision || []);
  const postIds = new Set();
  const urls = new Set();
  const postsPerCreator = new Map();
  const observedFrom = timestamp(metadata.observed_from_utc);
  const observedTo = timestamp(metadata.observed_to_utc);
  const analysisAsOf = timestamp(metadata.analysis_as_of_utc);

  add(!Number.isFinite(observedFrom), "invalid observed_from_utc");
  add(!Number.isFinite(observedTo), "invalid observed_to_utc");
  add(!Number.isFinite(analysisAsOf), "invalid analysis_as_of_utc");
  add(observedFrom > observedTo, "observation window starts after it ends");
  add(observedTo > analysisAsOf, "observation window ends after analysis_as_of_utc");

  for (const post of posts) {
    const label = post.post_id || "<missing post_id>";
    add(typeof post.post_id !== "string" || !post.post_id, `${label}: invalid post_id`);
    add(postIds.has(post.post_id), `${label}: duplicate post_id`);
    postIds.add(post.post_id);
    add(typeof post.post_url !== "string" || !post.post_url, `${label}: invalid post_url`);
    add(urls.has(post.post_url), `${label}: duplicate canonical URL`);
    urls.add(post.post_url);

    const creator = creatorById.get(post.creator_id);
    add(!creator, `${label}: unknown creator_id ${post.creator_id}`);
    add(creator && post.creator_handle !== creator.creator_handle, `${label}: creator_handle does not match creator`);
    postsPerCreator.set(post.creator_id, (postsPerCreator.get(post.creator_id) || 0) + 1);

    const postedAt = timestamp(post.posted_at_utc);
    const collectedAt = timestamp(post.collected_at_utc);
    add(!Number.isFinite(postedAt) || !String(post.posted_at_utc).endsWith("Z"), `${label}: invalid posted_at_utc`);
    add(!Number.isFinite(collectedAt) || !String(post.collected_at_utc).endsWith("Z"), `${label}: invalid collected_at_utc`);
    add(Number.isFinite(postedAt) && (postedAt < observedFrom || postedAt > observedTo || postedAt > analysisAsOf), `${label}: timestamp outside observation rules`);
    add(Number.isFinite(postedAt) && Number.isFinite(collectedAt) && postedAt > collectedAt, `${label}: posted after collection`);
    add(Number.isFinite(collectedAt) && collectedAt > analysisAsOf, `${label}: collected after analysis_as_of_utc`);
    add(!precisions.has(post.posted_at_precision), `${label}: unknown posted_at_precision ${post.posted_at_precision}`);
    add(!postTypes.has(post.post_type), `${label}: unknown post_type ${post.post_type}`);

    for (const field of COUNT_FIELDS) {
      const value = post[field];
      add(value !== null && (!Number.isInteger(value) || value < 0), `${label}: ${field} must be a non-negative integer or null`);
    }
    add(post.exclusion_reason !== null, `${label}: included final post has an exclusion_reason`);
    add(typeof post.baseline_eligible !== "boolean", `${label}: baseline_eligible must be boolean`);
    if (post.baseline_eligible) {
      add(post.views_at_collection === null, `${label}: baseline-eligible post is missing views`);
      add(typeof post.post_age_hours_at_collection !== "number" || post.post_age_hours_at_collection < thresholds.minimum_post_age_hours, `${label}: performance-eligible post is too young or missing age`);
    }

    if (post.format_pattern_id === null) {
      add(post.format_pattern_name !== null || post.format_family_id !== null, `${label}: null format ID has non-null format fields`);
    } else {
      const format = formats.get(post.format_pattern_id);
      add(!format, `${label}: unknown format pattern ${post.format_pattern_id}`);
      add(format && post.format_pattern_name !== format.name, `${label}: format name mismatch`);
      add(format && post.format_family_id !== format.family_id, `${label}: format family mismatch`);
      add(post.format_family_id !== null && !formatFamilies.has(post.format_family_id), `${label}: unknown format family ${post.format_family_id}`);
    }
    if (post.hook_pattern_id === null) {
      add(post.hook_pattern_name !== null, `${label}: null hook ID has non-null name`);
    } else {
      const hook = hooks.get(post.hook_pattern_id);
      add(!hook, `${label}: unknown hook pattern ${post.hook_pattern_id}`);
      add(hook && post.hook_pattern_name !== hook.name, `${label}: hook name mismatch`);
    }
  }

  for (const [creatorId, count] of postsPerCreator) {
    add(count > thresholds.max_collected_posts_per_creator, `${creatorId}: ${count} posts exceeds the ${thresholds.max_collected_posts_per_creator}-post cap`);
  }

  if (errors.length) throw new Error(`Dataset validation failed:\n- ${errors.join("\n- ")}`);

  return {
    valid: true,
    schema_version: metadata.schema_version,
    codebook_version: metadata.codebook_version,
    threshold_version: metadata.threshold_version,
    creator_count: creators.length,
    post_count: posts.length,
    blocked_creator_count: creators.filter((creator) => creator.collection_status === "blocked").length,
    maximum_posts_per_creator: Math.max(0, ...postsPerCreator.values()),
    missing_counts: Object.fromEntries(COUNT_FIELDS.map((field) => [field, posts.filter((post) => post[field] === null).length])),
    unclassified_format_count: posts.filter((post) => post.format_pattern_id === "FP-UNCLASSIFIED").length,
    unclassified_hook_count: posts.filter((post) => post.hook_pattern_id === "HP-UNCLASSIFIED").length,
    unlabeled_format_count: posts.filter((post) => post.format_pattern_id === null).length,
    unlabeled_hook_count: posts.filter((post) => post.hook_pattern_id === null).length,
  };
}

const performanceReason = (post, priorCount, baseline, thresholds) => {
  if (post.views_at_collection === null) return "missing_candidate_views";
  if (!post.baseline_eligible) {
    if (post.post_age_hours_at_collection === null) return "missing_post_age";
    if (post.post_age_hours_at_collection < thresholds.minimum_post_age_hours) return "post_too_young";
    return "performance_ineligible";
  }
  if (priorCount < thresholds.provisional_baseline_minimum) return "insufficient_baseline_history";
  if (baseline === 0) return "zero_baseline";
  return null;
};

const calculatePostEvidence = (post, creatorPosts, thresholds) => {
  // ponytail: O(50²) per creator is bounded by the frozen cap; index only if that cap changes.
  const prior = creatorPosts
    .filter((candidate) => candidate.baseline_eligible && orderTime(candidate) < orderTime(post))
    .sort((a, b) => orderTime(b) - orderTime(a) || a.post_id.localeCompare(b.post_id))
    .slice(0, thresholds.baseline_history_cap);
  const baseline = median(prior.map((candidate) => candidate.views_at_collection));
  const priorCount = prior.length;
  const baselineQuality = baseline === 0 || priorCount < thresholds.provisional_baseline_minimum
    ? "Limited"
    : priorCount < thresholds.supported_baseline_minimum
      ? "Provisional"
      : "Supported";
  const viewLiftUnavailableReason = performanceReason(post, priorCount, baseline, thresholds);
  const viewLift = viewLiftUnavailableReason === null ? post.views_at_collection / baseline : null;
  const amplificationUnavailableReason = !post.baseline_eligible
    ? performanceReason(post, priorCount, baseline, thresholds)
    : post.reposts_at_collection === null
      ? "missing_reposts"
      : post.quotes_at_collection === null
        ? "missing_quotes"
        : null;
  const amplifications = amplificationUnavailableReason === null
    ? post.reposts_at_collection + post.quotes_at_collection
    : null;
  const amplificationRateUnavailableReason = amplifications === null
    ? amplificationUnavailableReason
    : post.views_at_collection === null
      ? "missing_candidate_views"
      : post.views_at_collection === 0
        ? "zero_candidate_views"
        : null;

  return {
    post_id: post.post_id,
    post_url: post.post_url,
    candidate_views: post.views_at_collection,
    collected_at_utc: post.collected_at_utc,
    post_age_hours_at_collection: post.post_age_hours_at_collection,
    performance_eligible: post.baseline_eligible,
    baseline,
    baseline_prior_count: priorCount,
    baseline_history_cap: thresholds.baseline_history_cap,
    baseline_source_post_ids: prior.map((candidate) => candidate.post_id),
    baseline_quality: baselineQuality,
    view_lift: viewLift,
    view_lift_numerator: viewLift === null ? null : post.views_at_collection,
    view_lift_denominator: viewLift === null ? null : baseline,
    view_lift_unavailable_reason: viewLiftUnavailableReason,
    supported_breakout: baselineQuality === "Supported" && viewLift !== null && viewLift >= thresholds.view_breakout_threshold,
    likes: post.likes_at_collection,
    replies: post.replies_at_collection,
    reposts: post.reposts_at_collection,
    quotes: post.quotes_at_collection,
    amplifications,
    amplification_unavailable_reason: amplificationUnavailableReason,
    amplification_rate: amplificationRateUnavailableReason === null ? amplifications / post.views_at_collection : null,
    amplification_rate_numerator: amplificationRateUnavailableReason === null ? amplifications : null,
    amplification_rate_denominator: amplificationRateUnavailableReason === null ? post.views_at_collection : null,
    amplification_rate_unavailable_reason: amplificationRateUnavailableReason,
  };
};

const patternLimitations = (events, performance, lifecycle, thresholds) => {
  const limitations = [{
    code: "observed_cohort_only",
    detail: "Adoption order is observational within the frozen cohort and does not establish causation.",
  }];
  if (!events.length) limitations.push({ code: "no_observed_adopters", detail: "No classified use was observed in the frozen cohort." });
  if (performance.view_lift_sample_size < thresholds.minimum_pattern_metric_sample) {
    limitations.push({ code: "limited_view_lift_sample", detail: `Median view lift is withheld because only ${performance.view_lift_sample_size} classifiable first-adoption post(s) are available.` });
  }
  if (performance.amplification_rate_sample_size < thresholds.minimum_pattern_metric_sample) {
    limitations.push({ code: "limited_amplification_sample", detail: `Median amplification rate is withheld because only ${performance.amplification_rate_sample_size} classifiable first-adoption post(s) are available.` });
  }
  if (events.some((event) => event.performance.view_lift_unavailable_reason === "post_too_young")) {
    limitations.push({ code: "young_first_adoption_post", detail: "At least one first-adoption post is too young for performance comparison." });
  }
  if (events.some((event) => event.performance.view_lift_unavailable_reason === "zero_baseline")) {
    limitations.push({ code: "zero_creator_baseline", detail: "At least one first-adoption post has a zero creator baseline, so its view lift is unavailable." });
  }
  if (lifecycle === "Insufficient Evidence" && events.length) {
    limitations.push({ code: "insufficient_lifecycle_evidence", detail: "Observed adoption does not meet the frozen lifecycle conditions." });
  }
  return limitations;
};

const analyzePattern = ({ definition, dimension, posts, postEvidence, thresholds, analysisAsOf }) => {
  const field = dimension === "format" ? "format_pattern_id" : "hook_pattern_id";
  const uses = posts.filter((post) => post[field] === definition.id);
  const byCreator = Map.groupBy(uses, (post) => post.creator_id);
  const events = [...byCreator.entries()].map(([creatorId, creatorUses]) => {
    const sorted = [...creatorUses].sort((a, b) => orderTime(a) - orderTime(b) || a.post_id.localeCompare(b.post_id));
    const first = sorted[0];
    const firstTime = orderTime(first);
    const repeats = sorted.filter((post) => orderTime(post) > firstTime);
    return {
      creator_id: creatorId,
      first,
      firstTime,
      repeats,
      performance: postEvidence.get(first.post_id),
    };
  }).sort((a, b) => a.firstTime - b.firstTime || a.creator_id.localeCompare(b.creator_id));

  const distinctAdopters = events.length;
  for (const event of events) {
    event.adoptionRank = 1 + events.filter((candidate) => candidate.firstTime < event.firstTime).length;
    event.adoptionPercentile = distinctAdopters < 2 ? null : (event.adoptionRank - 1) / (distinctAdopters - 1);
    event.early = distinctAdopters >= thresholds.minimum_validated_adopters
      && event.adoptionPercentile <= thresholds.early_adoption_percentile_max;
    const episodeEnd = Math.min(event.firstTime + thresholds.pattern_episode_days * DAY_MS, analysisAsOf);
    event.episodeEnd = episodeEnd;
    event.later = events.filter((candidate) => candidate.firstTime > event.firstTime && candidate.firstTime <= episodeEnd);
    event.validated = distinctAdopters >= thresholds.minimum_validated_adopters
      && event.early
      && event.performance.supported_breakout
      && event.later.length >= thresholds.minimum_later_adopters;
  }

  const viewLifts = events.filter((event) => event.performance.view_lift !== null);
  const amplificationRates = events.filter((event) => event.performance.amplification_rate !== null);
  const performance = {
    median_view_lift: viewLifts.length >= thresholds.minimum_pattern_metric_sample
      ? median(viewLifts.map((event) => event.performance.view_lift))
      : null,
    view_lift_sample_size: viewLifts.length,
    view_lift_source_post_ids: viewLifts.map((event) => event.first.post_id),
    median_amplification_rate: amplificationRates.length >= thresholds.minimum_pattern_metric_sample
      ? median(amplificationRates.map((event) => event.performance.amplification_rate))
      : null,
    amplification_rate_sample_size: amplificationRates.length,
    amplification_rate_source_post_ids: amplificationRates.map((event) => event.first.post_id),
    supported_breakout_count: events.filter((event) => event.performance.supported_breakout).length,
    supported_breakout_source_post_ids: events.filter((event) => event.performance.supported_breakout).map((event) => event.first.post_id),
  };
  const firstObserved = events[0]?.firstTime ?? null;
  const lastObservedPost = uses.toSorted((a, b) => orderTime(b) - orderTime(a) || a.post_id.localeCompare(b.post_id))[0];
  const recentStart = analysisAsOf - thresholds.recent_window_days * DAY_MS;
  const recentEvents = events.filter((event) => event.firstTime >= recentStart && event.firstTime <= analysisAsOf);
  const validatedEvents = events.filter((event) => event.validated);
  const patternAgeDays = firstObserved === null ? null : (analysisAsOf - firstObserved) / DAY_MS;
  const lifecycle = validatedEvents.length
    ? "Validated"
    : distinctAdopters >= 2 && recentEvents.length
      ? "Emerging"
      : distinctAdopters >= 2 && !recentEvents.length && patternAgeDays >= thresholds.fading_age_minimum_days
        ? "Fading"
        : "Insufficient Evidence";
  const evidenceQuality = events.some((event) => event.performance.baseline_quality === "Supported")
    ? "Supported"
    : events.some((event) => event.performance.baseline_quality === "Provisional")
      ? "Provisional"
      : "Limited";

  const creatorEvidence = events.map((event) => ({
    creator_id: event.creator_id,
    first_adoption_post_id: event.first.post_id,
    first_adoption_post_url: event.first.post_url,
    first_adoption_at_utc: event.first.posted_at_utc,
    first_adoption_precision: event.first.posted_at_precision,
    adoption_order_at_utc: new Date(event.firstTime).toISOString(),
    adoption_rank: event.adoptionRank,
    adoption_percentile: event.adoptionPercentile,
    adoption_percentile_denominator: distinctAdopters < 2 ? null : distinctAdopters - 1,
    early_adopter: event.early,
    episode_end_utc: new Date(event.episodeEnd).toISOString(),
    later_adopter_count: event.later.length,
    later_adopter_creator_ids: event.later.map((candidate) => candidate.creator_id),
    repeat_use_count: event.repeats.length,
    repeat_post_ids: event.repeats.map((post) => post.post_id),
    validation_conditions: {
      minimum_distinct_adopters: distinctAdopters >= thresholds.minimum_validated_adopters,
      early_within_observed_cohort: event.early,
      supported_breakout: event.performance.supported_breakout,
      minimum_later_adopters: event.later.length >= thresholds.minimum_later_adopters,
    },
    validated_early_capture: event.validated,
    performance: event.performance,
  }));

  return {
    identity: {
      pattern_type: dimension,
      pattern_id: definition.id,
      pattern_name: definition.name,
      format_family_id: definition.family_id || null,
    },
    lifecycle,
    evidence_quality: evidenceQuality,
    adoption_metrics: {
      distinct_adopter_count: distinctAdopters,
      adoption_percentile_denominator: distinctAdopters < 2 ? null : distinctAdopters - 1,
      early_adopter_count: events.filter((event) => event.early).length,
      recent_adopter_count: recentEvents.length,
      recent_adopter_creator_ids: recentEvents.map((event) => event.creator_id),
      first_observed_at_utc: firstObserved === null ? null : new Date(firstObserved).toISOString(),
      last_observed_at_utc: lastObservedPost?.posted_at_utc || null,
      pattern_age_days: patternAgeDays,
      repeat_use_count: events.reduce((sum, event) => sum + event.repeats.length, 0),
      repeat_creator_count: events.filter((event) => event.repeats.length).length,
    },
    performance_metrics: performance,
    validated_events: creatorEvidence.filter((event) => event.validated_early_capture),
    creator_evidence: creatorEvidence,
    representative_post_candidates: creatorEvidence.map((event) => ({
      post_id: event.first_adoption_post_id,
      post_url: event.first_adoption_post_url,
      creator_id: event.creator_id,
      validated_early_capture: event.validated_early_capture,
      supported_breakout: event.performance.supported_breakout,
      view_lift: event.performance.view_lift,
      candidate_views: event.performance.candidate_views,
    })),
    limitations: patternLimitations(events, performance, lifecycle, thresholds),
  };
};

export function analyzeDataset(dataset) {
  const validationSummary = validateDataset(dataset);
  const thresholds = dataset.thresholds;
  const creatorPosts = typeof Map.groupBy === "function"
    ? Map.groupBy(dataset.posts, (post) => post.creator_id)
    : dataset.posts.reduce((map, post) => {
        const list = map.get(post.creator_id);
        if (list) list.push(post);
        else map.set(post.creator_id, [post]);
        return map;
      }, new Map());
  const postEvidence = new Map();
  for (const post of dataset.posts) {
    postEvidence.set(post.post_id, calculatePostEvidence(post, creatorPosts.get(post.creator_id) || [], thresholds));
  }

  const definitions = [
    ...dataset.codebook.format_patterns
      .filter((definition) => !UNCLASSIFIED.has(definition.id))
      .map((definition) => ({ definition, dimension: "format" })),
    ...dataset.codebook.hook_patterns
      .filter((definition) => !UNCLASSIFIED.has(definition.id))
      .map((definition) => ({ definition, dimension: "hook" })),
  ];
  const patterns = definitions.map(({ definition, dimension }) => analyzePattern({
    definition,
    dimension,
    posts: dataset.posts,
    postEvidence,
    thresholds,
    analysisAsOf: timestamp(dataset.metadata.analysis_as_of_utc),
  }));
  const validatedFormatPatternsByCreator = new Map();
  for (const pattern of patterns.filter((item) => item.identity.pattern_type === "format")) {
    for (const event of pattern.validated_events) {
      const patternIds = validatedFormatPatternsByCreator.get(event.creator_id) || [];
      patternIds.push(pattern.identity.pattern_id);
      validatedFormatPatternsByCreator.set(event.creator_id, patternIds);
    }
  }
  const creators = dataset.creators.map((creator) => {
    const patternIds = validatedFormatPatternsByCreator.get(creator.creator_id) || [];
    const postCount = creatorPosts.get(creator.creator_id)?.length || 0;
    return {
      creator_id: creator.creator_id,
      creator_name: creator.creator_name,
      creator_handle: creator.creator_handle,
      profile_url: creator.profile_url,
      collection_status: creator.collection_status,
      analyzed_post_count: postCount,
      validated_format_count: patternIds.length,
      validated_format_pattern_ids: patternIds,
      limitations: creator.collection_status === "blocked"
        ? [{ code: "collection_blocked", detail: creator.notes || "Creator collection was blocked." }]
        : postCount === 0
          ? [{ code: "no_observed_posts", detail: "No retained posts were observed for this creator." }]
          : [],
    };
  });
  const lifecycleCounts = {};
  const evidenceQualityCounts = {};
  for (const pattern of patterns) {
    increment(lifecycleCounts, pattern.lifecycle);
    increment(evidenceQualityCounts, pattern.evidence_quality);
  }

  return {
    analysis_context: {
      product_name: dataset.metadata.product_name,
      source_artifact_name: dataset.metadata.artifact_name,
      cohort_id: dataset.metadata.cohort_id,
      analysis_as_of_utc: dataset.metadata.analysis_as_of_utc,
      observed_from_utc: dataset.metadata.observed_from_utc,
      observed_to_utc: dataset.metadata.observed_to_utc,
      response_type: dataset.metadata.response_type,
      thresholds: { ...thresholds },
      expansion_dataset_included: dataset.metadata.expansion_dataset_included === true,
    },
    summary: {
      analyzed_creator_count: dataset.creators.length,
      analyzed_post_count: dataset.posts.length,
      analyzed_pattern_count: patterns.length,
      lifecycle_counts: lifecycleCounts,
      evidence_quality_counts: evidenceQualityCounts,
      validated_early_capture_count: patterns.reduce((sum, pattern) => sum + pattern.validated_events.length, 0),
      unclassified_format_post_count: validationSummary.unclassified_format_count,
      unclassified_hook_post_count: validationSummary.unclassified_hook_count,
    },
    patterns,
    creators,
    validation_summary: validationSummary,
  };
}
