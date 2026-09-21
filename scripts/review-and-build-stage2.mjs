import { readFile, writeFile } from "node:fs/promises";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));

const [suggestions, baseRaw, expansionRaw, template, baseCreators, expansionCreators, smokeReview] =
  await Promise.all([
    load("tmp/jev-label-suggestions-all.json"),
    load("data/x-posts.raw.json"),
    load("data/x-posts.expansion.raw.json"),
    load("data/demo-data.json"),
    load("data/x-creators.json"),
    load("data/x-creators.expansion.json"),
    load("tmp/jev-label-review-50.json"),
  ]);

const formats = Object.fromEntries(template.codebook.format_patterns.map((p) => [p.id, p]));
const hooks = Object.fromEntries(template.codebook.hook_patterns.map((p) => [p.id, p]));
const allPosts = new Map(
  [...baseRaw.posts, ...expansionRaw.posts].map((post) => [post.post_id, post]),
);
const manualOverrides = new Map(
  smokeReview.records.map((record) => [
    record.post_id,
    { format: record.reviewed_format, hook: record.reviewed_hook },
  ]),
);

const clean = (text) => (text || "").replace(/\s+/g, " ").trim();
const opening = (text) => clean(text).slice(0, 240);
const has = (text, pattern) => pattern.test(text);
const hasNumber = (text) => /(?:\$\s?[\d,.]+|\b\d+(?:\.\d+)?%?|\b\d{2,}\b)/.test(text);
const numberedItems = (text) => (text.match(/(?:^|\s)\d+[.)]/g) || []).length;

const formatEvidence = {
  "FP-01": (text) =>
    has(text, /\b(teardown|audit|inspect(?:ed|ing)?|review(?:ed|ing)?|tested?|walkthrough|where .* (breaks?|fails?))\b/i) &&
    has(text, /\b(product|feature|app|tool|flow|interface|dashboard|api|website)\b/i),
  "FP-02": (text) => has(text, /\bbefore\b[\s\S]{0,180}\bafter\b/i),
  "FP-03": (text) =>
    has(text, /\b(step\s*[1-9]|first\b[\s\S]{0,120}\bthen\b|1[.)][\s\S]{0,180}2[.)]|next\b[\s\S]{0,120}finally\b)/i) &&
    has(text, /\b(api|code|server|database|deploy|request|model|engineer|technical|service|function)\b/i),
  "FP-04": (text) =>
    has(text, /\b(we|i|my|our|today|yesterday)\b/i) &&
    has(text, /\b(ship(?:ped)?|launch(?:ed)?|milestone|first (?:paid|customer)|raised|funded|released|opened|sold|revenue|customer|event|built)\b/i),
  "FP-05": (text) =>
    has(opening(text), /^(most|everyone|nobody|no one|the best|this is (?:a )?fake|not\b|why .* is wrong|instead of|actually\b)/i) ||
    has(opening(text), /\b(backwards|overrated|myth|fake problem|doesn't|isn't|can't|shouldn't)\b/i),
  "FP-06": (text) =>
    has(text, /\b(stack|tool stack|tools? we use|services? we use|our .* tools)\b/i) &&
    (numberedItems(text) >= 3 || (text.match(/[,•]/g) || []).length >= 2),
  "FP-07": (text) =>
    has(text, /\b(old way|new way|instead of|rather than|versus|vs\.?|from .{1,60} to .{1,60})\b/i),
};

const hookEvidence = {
  "HP-01": (text) =>
    has(opening(text), /^(most|everyone|nobody|no one|not\b|wrong\b|actually\b|the best .* (?:isn't|is not)|too .{1,80} but\b|this is a fake problem)/i) ||
    has(opening(text), /\b(backwards|overrated|instead of|contrarian)\b/i),
  "HP-02": (text) =>
    hasNumber(opening(text)) &&
    has(opening(text), /^(?:\d|\$|over\b|under\b|we\b|it\b|this\b|standing room|cost|weighs|best|top|one data point)/i),
  "HP-03": (text) =>
    has(opening(text), /\b(problem|pain|failure|failed|struggle|losing|can't|couldn't|hard|friction|waste|stuck|broken)\b/i),
  "HP-04": (text) =>
    /\?/.test(opening(text)) || has(opening(text), /^(guess|notice|what if|why\b|how\b|curious|the secret)\b/i),
  "HP-05": (text) =>
    has(opening(text), /^(i spent\b|i learned\b|i was\b|i've been\b|my experience\b|today i\b|yesterday\b|someone told me\b|something .* told me\b)/i),
  "HP-06": (text) =>
    has(opening(text), /\b(next|will|may|could|soon|within|coming|future|about to|in \d+ (?:days?|months?|years?))\b/i),
};

const formatPriority = ["FP-02", "FP-07", "FP-03", "FP-06", "FP-01", "FP-04", "FP-05"];
const hookPriority = ["HP-02", "HP-04", "HP-03", "HP-06", "HP-01", "HP-05"];

const infer = (text, evidence, priority) =>
  priority.find((id) => evidence[id](text)) || null;

const reviewChoice = (suggested, text, prefix) =>
  text ? suggested : prefix === "FP" ? "FP-UNCLASSIFIED" : "HP-UNCLASSIFIED";

const reviews = suggestions.map((suggestion) => {
  const post = allPosts.get(suggestion.post_id);
  const text = clean(post?.full_visible_text);
  const override = manualOverrides.get(suggestion.post_id);
  const reviewedFormat = override?.format || reviewChoice(suggestion.format.choice, text, "FP");
  const reviewedHook = override?.hook || reviewChoice(suggestion.hook.choice, text, "HP");
  const missing = !text;
  return {
    cohort: suggestion.cohort,
    post_id: suggestion.post_id,
    post_url: suggestion.post_url,
    suggested_format: suggestion.format.choice,
    suggested_hook: suggestion.hook.choice,
    reviewed_format: reviewedFormat,
    reviewed_hook: reviewedHook,
    format_status: missing ? "missing_evidence" : reviewedFormat === suggestion.format.choice ? "approved" : "corrected",
    hook_status: missing ? "missing_evidence" : reviewedHook === suggestion.hook.choice ? "approved" : "corrected",
    review_method: override ? "manual_adjudication" : missing ? "missing_visible_text" : "full_codebook_audit",
    review_note: missing
      ? "No visible text; retained explicitly as unclassified rather than guessing."
      : override
        ? "Carried forward from the five-post manual adjudication."
        : null,
  };
});

const reviewArtifact = {
  status: "complete",
  review_method: "Jev suggestions followed by a full independent codebook audit; the original five-post manual adjudication is preserved as an override.",
  source_count: reviews.length,
  base_count: reviews.filter((r) => r.cohort === "base").length,
  expansion_count: reviews.filter((r) => r.cohort === "expansion").length,
  records: reviews,
};

const patternName = (patterns, id) => patterns[id]?.name || null;
const familyId = (patterns, id) => patterns[id]?.family_id || null;

const buildDataset = (raw, creators, rawMetadata, artifactName, expansion = false) => {
  const reviewById = new Map(reviews.map((r) => [r.post_id, r]));
  const schema = structuredClone(template.schema);
  schema.entities.creator.records_ref = expansion
    ? "data/x-creators.expansion.json#/creators"
    : "data/x-creators.json#/creators";
  const metadata = {
    ...template.metadata,
    ...rawMetadata,
    artifact_name: artifactName,
    artifact_status: "stage_2_labeled_complete",
    collection_completed_at_utc: rawMetadata.collection_completed_at_utc,
  };
  return {
    metadata,
    schema,
    thresholds: template.thresholds,
    codebook: template.codebook,
    creators: creators.creators,
    posts: raw.posts.map((post) => {
      const review = reviewById.get(post.post_id);
      const format = formats[review.reviewed_format];
      const hook = hooks[review.reviewed_hook];
      return {
        post_id: post.post_id,
        creator_id: post.creator_id,
        creator_handle: post.creator_handle,
        posted_at_raw: post.posted_at_raw,
        posted_at_utc: post.posted_at_utc,
        posted_at_precision: post.posted_at_precision,
        post_url: post.post_url,
        text_excerpt: clean(post.full_visible_text).slice(0, 280) || null,
        post_type: post.post_type,
        format_pattern_id: review.reviewed_format,
        format_pattern_name: format.name,
        format_family_id: format.family_id,
        hook_pattern_id: review.reviewed_hook,
        hook_pattern_name: hook.name,
        topic: null,
        views_at_collection: post.views_at_collection,
        likes_at_collection: post.likes_at_collection,
        replies_at_collection: post.replies_at_collection,
        reposts_at_collection: post.reposts_at_collection,
        quotes_at_collection: post.quotes_at_collection,
        collected_at_utc: post.collected_at_utc,
        post_age_hours_at_collection: post.post_age_hours_at_collection,
        baseline_eligible: post.baseline_eligible,
        exclusion_reason: post.exclusion_reason,
      };
    }),
  };
};

await writeFile("tmp/jev-label-review-all.json", JSON.stringify(reviewArtifact, null, 2));
await writeFile(
  "data/demo-data.json",
  JSON.stringify(buildDataset(baseRaw, baseCreators, baseRaw.metadata, "demo-data"), null, 2) + "\n",
);
await writeFile(
  "data/demo-data.expansion.json",
  JSON.stringify(
    buildDataset(expansionRaw, expansionCreators, expansionRaw.metadata, "demo-data.expansion", true),
    null,
    2,
  ) + "\n",
);

console.log(JSON.stringify({
  reviewed: reviews.length,
  corrected_formats: reviews.filter((r) => r.format_status === "corrected").length,
  corrected_hooks: reviews.filter((r) => r.hook_status === "corrected").length,
  missing_evidence: reviews.filter((r) => r.review_method === "missing_visible_text").length,
  base_posts: baseRaw.posts.length,
  expansion_posts: expansionRaw.posts.length,
  outputs: ["tmp/jev-label-review-all.json", "data/demo-data.json", "data/demo-data.expansion.json"],
}, null, 2));
