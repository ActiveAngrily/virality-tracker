import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { validateDataset } from "../src/analysis.mjs";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const [base, expansion, expanded, baseRaw, expansionRaw] = await Promise.all([
  load("data/demo-data.json"),
  load("data/demo-data.expansion.json"),
  load("data/demo-data.expanded.json"),
  load("data/x-posts.raw.json"),
  load("data/x-posts.expansion.raw.json"),
]);

const unique = (items, field) => new Set(items.map((item) => item[field])).size === items.length;
const disjoint = (left, right, field) => {
  const values = new Set(left.map((item) => item[field]));
  return right.every((item) => !values.has(item[field]));
};

assert.equal(base.creators.length, 30);
assert.equal(base.posts.length, 1074);
assert.equal(expansion.creators.length, 30);
assert.equal(expansion.posts.length, 982);
assert.ok(disjoint(base.creators, expansion.creators, "creator_id"));
assert.ok(disjoint(base.posts, expansion.posts, "post_id"));
assert.ok(disjoint(base.posts, expansion.posts, "post_url"));
assert.deepEqual(expanded.creators.slice(0, base.creators.length), base.creators);
assert.deepEqual(expanded.creators.slice(base.creators.length), expansion.creators);
assert.deepEqual(expanded.posts.slice(0, base.posts.length), base.posts);
assert.deepEqual(expanded.posts.slice(base.posts.length), expansion.posts);
assert.equal(expanded.metadata.expansion_dataset_included, true);
assert.equal(expanded.metadata.expected_creator_count, 60);
assert.equal(expanded.creators.length, 60);
assert.equal(expanded.posts.length, 2056);
assert.ok(unique(expanded.creators, "creator_id"));
assert.ok(unique(expanded.posts, "post_id"));
assert.ok(unique(expanded.posts, "post_url"));

const rawById = new Map([...baseRaw.posts, ...expansionRaw.posts].map((post) => [post.post_id, post]));
const sourceFields = [
  "creator_id",
  "creator_handle",
  "posted_at_utc",
  "posted_at_precision",
  "post_url",
  "views_at_collection",
  "likes_at_collection",
  "replies_at_collection",
  "reposts_at_collection",
  "quotes_at_collection",
  "collected_at_utc",
  "post_age_hours_at_collection",
  "baseline_eligible",
];
for (const post of expanded.posts) {
  const raw = rawById.get(post.post_id);
  assert.ok(raw, `raw source missing for ${post.post_id}`);
  for (const field of sourceFields) assert.deepEqual(post[field], raw[field], `${post.post_id}.${field}`);
  const url = new URL(post.post_url);
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "x.com");
  assert.equal(url.pathname.split("/").at(-1), post.post_id);
}

const validation = validateDataset(expanded);
assert.equal(validation.creator_count, 60);
assert.equal(validation.maximum_posts_per_creator, 50);
assert.equal(validation.blocked_creator_count, 3);
assert.equal(validation.missing_counts.quotes_at_collection, 2056);
assert.ok(expanded.creators.filter((creator) => creator.collection_status === "blocked").every((creator) => creator.notes));
assert.ok(expanded.posts.some((post) => !post.baseline_eligible));
assert.ok(expanded.posts.some((post) => post.format_pattern_id === "FP-UNCLASSIFIED"));
assert.ok(expanded.posts.some((post) => post.hook_pattern_id === "HP-UNCLASSIFIED"));

console.log(JSON.stringify({
  stage: "stage_5",
  status: "validated",
  base_preserved: { creators: base.creators.length, posts: base.posts.length },
  expansion_preserved: { creators: expansion.creators.length, posts: expansion.posts.length },
  expanded: validation,
}, null, 2));
