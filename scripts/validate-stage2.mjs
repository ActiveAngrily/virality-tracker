import { readFile } from "node:fs/promises";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const fail = (message) => {
  throw new Error(message);
};
const isCount = (value) => value === null || (Number.isInteger(value) && value >= 0);

const [baseRaw, expansionRaw, baseData, expansionData, baseCreators, expansionCreators, review, suggestions] =
  await Promise.all([
    load("data/x-posts.raw.json"),
    load("data/x-posts.expansion.raw.json"),
    load("data/demo-data.json"),
    load("data/demo-data.expansion.json"),
    load("data/x-creators.json"),
    load("data/x-creators.expansion.json"),
    load("tmp/jev-label-review-all.json"),
    load("tmp/jev-label-suggestions-all.json"),
  ]);

const validate = (name, raw, data, creators) => {
  const formatById = Object.fromEntries(data.codebook.format_patterns.map((p) => [p.id, p]));
  const hookById = Object.fromEntries(data.codebook.hook_patterns.map((p) => [p.id, p]));
  const creatorById = Object.fromEntries(creators.creators.map((c) => [c.creator_id, c]));
  const rawById = Object.fromEntries(raw.posts.map((p) => [p.post_id, p]));
  const ids = new Set();
  const urls = new Set();
  const perCreator = {};

  if (data.metadata.artifact_status !== "stage_2_labeled_complete") fail(`${name}: wrong artifact status`);
  if (data.posts.length !== raw.posts.length) fail(`${name}: post count mismatch`);
  if (JSON.stringify(data.creators) !== JSON.stringify(creators.creators)) fail(`${name}: creator array mismatch`);
  for (const post of data.posts) {
    const source = rawById[post.post_id];
    if (!source) fail(`${name}: unknown post ${post.post_id}`);
    if (ids.has(post.post_id) || urls.has(post.post_url)) fail(`${name}: duplicate post ${post.post_id}`);
    ids.add(post.post_id);
    urls.add(post.post_url);
    const creator = creatorById[post.creator_id];
    if (!creator || post.creator_handle !== creator.creator_handle) fail(`${name}: creator mismatch ${post.post_id}`);
    if (post.posted_at_utc !== source.posted_at_utc || post.post_url !== source.post_url) fail(`${name}: source fact changed ${post.post_id}`);
    if (!post.posted_at_utc) fail(`${name}: missing timestamp ${post.post_id}`);
    if (!data.schema.enums.post_type.includes(post.post_type)) fail(`${name}: invalid post type ${post.post_id}`);
    if (!formatById[post.format_pattern_id] || !hookById[post.hook_pattern_id]) fail(`${name}: invalid label ${post.post_id}`);
    if (post.format_pattern_name !== formatById[post.format_pattern_id].name) fail(`${name}: format name mismatch ${post.post_id}`);
    if (post.format_family_id !== formatById[post.format_pattern_id].family_id) fail(`${name}: format family mismatch ${post.post_id}`);
    if (post.hook_pattern_name !== hookById[post.hook_pattern_id].name) fail(`${name}: hook name mismatch ${post.post_id}`);
    for (const key of ["views_at_collection", "likes_at_collection", "replies_at_collection", "reposts_at_collection", "quotes_at_collection"]) {
      if (!isCount(post[key])) fail(`${name}: invalid count ${post.post_id}.${key}`);
    }
    if (post.baseline_eligible && (post.views_at_collection === null || post.post_age_hours_at_collection < 168)) {
      fail(`${name}: invalid baseline eligibility ${post.post_id}`);
    }
    perCreator[post.creator_id] = (perCreator[post.creator_id] || 0) + 1;
  }
  if (Math.max(...Object.values(perCreator)) > 50) fail(`${name}: creator exceeds 50 posts`);
  return { posts: data.posts.length, creators: data.creators.length, max_posts_per_creator: Math.max(...Object.values(perCreator)) };
};

if (suggestions.length !== 2056) fail(`suggestion count ${suggestions.length}`);
if (review.status !== "complete" || review.records.length !== 2056) fail("review artifact incomplete");
if (new Set(review.records.map((r) => r.post_id)).size !== 2056) fail("review IDs are not unique");

const base = validate("base", baseRaw, baseData, baseCreators);
const expansion = validate("expansion", expansionRaw, expansionData, expansionCreators);
const correctedFormats = review.records.filter((r) => r.format_status === "corrected").length;
const correctedHooks = review.records.filter((r) => r.hook_status === "corrected").length;
const missingEvidence = review.records.filter((r) => r.review_method === "missing_visible_text").length;

console.log(JSON.stringify({
  stage: "stage_2",
  status: "validated",
  reviewed: review.records.length,
  corrected_formats: correctedFormats,
  corrected_hooks: correctedHooks,
  missing_visible_text: missingEvidence,
  base,
  expansion,
  stage_3_started: false,
}, null, 2));
