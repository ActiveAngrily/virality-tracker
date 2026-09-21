import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { analyzeDataset } from "../src/analysis.mjs";

const base = JSON.parse(await readFile(new URL("../data/demo-data.json", import.meta.url), "utf8"));
const formatById = new Map(base.codebook.format_patterns.map((pattern) => [pattern.id, pattern]));
const hookById = new Map(base.codebook.hook_patterns.map((pattern) => [pattern.id, pattern]));
const collectedAt = "2026-09-20T20:00:00Z";

const makeFixture = () => {
  const creators = base.creators.map((creator, index) => ({
    ...creator,
    creator_id: `T-${String(index + 1).padStart(2, "0")}`,
    creator_name: `Test Creator ${index + 1}`,
    creator_handle: `@test${index + 1}`,
    profile_url: `https://x.com/test${index + 1}`,
    collection_status: index === 29 ? "blocked" : "complete",
    posts_collected: 0,
    stop_reason: index === 29 ? "blocked" : "fixture",
    notes: index === 29 ? "Blocked fixture creator." : "Synthetic Stage 3 fixture.",
  }));
  const creatorsById = new Map(creators.map((creator) => [creator.creator_id, creator]));
  const posts = [];
  let sequence = 0;

  const addPost = ({
    creatorId,
    postedAt,
    precision = "exact_time",
    formatId = "FP-UNCLASSIFIED",
    hookId = "HP-UNCLASSIFIED",
    views = 100,
    reposts = 2,
    quotes = 1,
    baselineEligible = true,
  }) => {
    sequence += 1;
    const format = formatById.get(formatId);
    const hook = hookById.get(hookId);
    const postId = `fixture-${String(sequence).padStart(3, "0")}`;
    posts.push({
      post_id: postId,
      creator_id: creatorId,
      creator_handle: creatorsById.get(creatorId).creator_handle,
      posted_at_raw: postedAt,
      posted_at_utc: postedAt,
      posted_at_precision: precision,
      post_url: `https://x.com/${creatorId}/status/${postId}`,
      text_excerpt: "Synthetic deterministic Stage 3 fixture.",
      post_type: "text",
      format_pattern_id: formatId,
      format_pattern_name: format.name,
      format_family_id: format.family_id,
      hook_pattern_id: hookId,
      hook_pattern_name: hook.name,
      topic: null,
      views_at_collection: views,
      likes_at_collection: 5,
      replies_at_collection: 1,
      reposts_at_collection: reposts,
      quotes_at_collection: quotes,
      collected_at_utc: collectedAt,
      post_age_hours_at_collection: (Date.parse(collectedAt) - Date.parse(postedAt)) / 3_600_000,
      baseline_eligible: baselineEligible,
      exclusion_reason: null,
    });
    return postId;
  };

  const addHistory = (creatorId, viewCount, startDay = 1, count = 10) => {
    for (let day = startDay; day < startDay + count; day += 1) {
      addPost({ creatorId, postedAt: `2026-07-${String(day).padStart(2, "0")}T12:00:00Z`, views: viewCount });
    }
  };

  addHistory("T-01", 100);
  const boundaryPostId = addPost({ creatorId: "T-01", postedAt: "2026-08-01T12:00:00Z", formatId: "FP-01", views: 150 });
  addHistory("T-02", 100, 1, 5);
  addPost({ creatorId: "T-02", postedAt: "2026-08-02T08:00:00Z", precision: "day", formatId: "FP-01" });
  addPost({ creatorId: "T-03", postedAt: "2026-08-02T18:00:00Z", precision: "day", formatId: "FP-01", quotes: null });
  addHistory("T-04", 0, 11);
  const zeroBaselinePostId = addPost({ creatorId: "T-04", postedAt: "2026-08-03T12:00:00Z", formatId: "FP-01" });
  const repeatPostId = addPost({ creatorId: "T-01", postedAt: "2026-08-05T12:00:00Z", formatId: "FP-01" });
  addPost({ creatorId: "T-11", postedAt: "2026-09-10T12:00:00Z", formatId: "FP-01" });

  addPost({ creatorId: "T-05", postedAt: "2026-09-18T12:00:00Z", formatId: "FP-02", baselineEligible: false });
  addPost({ creatorId: "T-06", postedAt: "2026-09-19T12:00:00Z", formatId: "FP-02", baselineEligible: false });

  const missingViewPostId = addPost({ creatorId: "T-07", postedAt: "2026-07-20T12:00:00Z", formatId: "FP-03", views: null, reposts: null, baselineEligible: false });
  addPost({ creatorId: "T-08", postedAt: "2026-07-21T12:00:00Z", formatId: "FP-03" });

  addHistory("T-09", 100);
  const singleSuccessPostId = addPost({ creatorId: "T-09", postedAt: "2026-07-30T12:00:00Z", formatId: "FP-04", views: 150 });
  addPost({ creatorId: "T-10", postedAt: "2026-08-10T12:00:00Z" });

  return {
    ...base,
    metadata: { ...base.metadata, artifact_name: "stage-3-deterministic-fixture", cohort_id: "stage-3-fixture" },
    creators,
    posts,
    ids: { boundaryPostId, zeroBaselinePostId, repeatPostId, missingViewPostId, singleSuccessPostId },
  };
};

const pattern = (analysis, id) => analysis.patterns.find((item) => item.identity.pattern_id === id);
const event = (patternResult, creatorId) => patternResult.creator_evidence.find((item) => item.creator_id === creatorId);

const assertFinite = (value) => {
  if (typeof value === "number") assert.ok(Number.isFinite(value), `non-finite number: ${value}`);
  if (Array.isArray(value)) value.forEach(assertFinite);
  else if (value && typeof value === "object") Object.values(value).forEach(assertFinite);
};

test("canonical base cohort validates and stays separate from expansion", () => {
  const first = analyzeDataset(base);
  const second = analyzeDataset(base);
  assert.deepEqual(first, second);
  assert.equal(first.analysis_context.source_artifact_name, "demo-data");
  assert.equal(first.analysis_context.expansion_dataset_included, false);
  assert.equal(first.validation_summary.creator_count, 30);
  assert.equal(first.validation_summary.post_count, 1074);
  assert.equal(first.validation_summary.maximum_posts_per_creator, 50);
  assert.equal(first.validation_summary.blocked_creator_count, 3);
  assert.equal(first.validation_summary.missing_counts.quotes_at_collection, 1074);
  const handCheckedPattern = pattern(first, "FP-06");
  const handCheckedEvent = event(handCheckedPattern, "CR-016");
  assert.equal(handCheckedEvent.performance.baseline_prior_count, 13);
  assert.equal(handCheckedEvent.performance.baseline, 13_177);
  assert.equal(handCheckedEvent.performance.view_lift, 35_714 / 13_177);
  assert.equal(handCheckedPattern.adoption_metrics.distinct_adopter_count, 5);
  assert.equal(handCheckedPattern.validated_events.length, 1);
  assert.equal(handCheckedPattern.lifecycle, "Validated");
  assertFinite(first);
});

test("frozen Stage 3 rules cover boundary, missing, tie, lifecycle, and repeat evidence", () => {
  const fixture = makeFixture();
  const ids = fixture.ids;
  delete fixture.ids;
  const analysis = analyzeDataset(fixture);
  const validated = pattern(analysis, "FP-01");
  const boundary = event(validated, "T-01");
  const tiedA = event(validated, "T-02");
  const tiedB = event(validated, "T-03");
  const zero = event(validated, "T-04");

  assert.equal(boundary.first_adoption_post_id, ids.boundaryPostId);
  assert.equal(boundary.performance.baseline, 100);
  assert.equal(boundary.performance.baseline_prior_count, 10);
  assert.equal(boundary.performance.baseline_quality, "Supported");
  assert.equal(boundary.performance.view_lift, 1.5);
  assert.equal(boundary.performance.supported_breakout, true);
  assert.equal(boundary.performance.amplifications, 3);
  assert.equal(boundary.performance.amplification_rate, 0.02);
  assert.equal(boundary.later_adopter_count, 3);
  assert.equal(boundary.repeat_use_count, 1);
  assert.deepEqual(boundary.repeat_post_ids, [ids.repeatPostId]);
  assert.equal(tiedA.adoption_rank, tiedB.adoption_rank);
  assert.equal(tiedA.early_adopter, true);
  assert.equal(tiedB.early_adopter, true);
  assert.equal(tiedA.performance.baseline_quality, "Provisional");
  assert.equal(tiedA.performance.view_lift, 1);
  assert.equal(tiedB.performance.amplifications, null);
  assert.equal(tiedB.performance.amplification_rate, null);
  assert.equal(zero.first_adoption_post_id, ids.zeroBaselinePostId);
  assert.equal(zero.performance.baseline, 0);
  assert.equal(zero.performance.view_lift, null);
  assert.equal(zero.performance.view_lift_unavailable_reason, "zero_baseline");
  assert.equal(validated.lifecycle, "Validated");
  assert.equal(validated.validated_events.length, 1);
  assert.equal(validated.performance_metrics.view_lift_sample_size, 2);
  assert.equal(validated.performance_metrics.median_view_lift, 1.25);

  const emerging = pattern(analysis, "FP-02");
  assert.equal(emerging.lifecycle, "Emerging");
  assert.equal(emerging.evidence_quality, "Limited");
  assert.equal(emerging.adoption_metrics.distinct_adopter_count, 2);
  assert.equal(event(emerging, "T-05").performance.view_lift, null);
  assert.equal(event(emerging, "T-05").performance.view_lift_unavailable_reason, "post_too_young");
  assert.equal(event(emerging, "T-05").performance.amplifications, null);
  assert.equal(event(emerging, "T-05").performance.amplification_unavailable_reason, "post_too_young");

  const fading = pattern(analysis, "FP-03");
  assert.equal(fading.lifecycle, "Fading");
  assert.equal(event(fading, "T-07").first_adoption_post_id, ids.missingViewPostId);
  assert.equal(event(fading, "T-07").performance.candidate_views, null);
  assert.equal(event(fading, "T-07").performance.view_lift_unavailable_reason, "missing_candidate_views");
  assert.equal(event(fading, "T-07").performance.amplification_unavailable_reason, "missing_candidate_views");

  const insufficient = pattern(analysis, "FP-04");
  assert.equal(insufficient.lifecycle, "Insufficient Evidence");
  assert.equal(event(insufficient, "T-09").first_adoption_post_id, ids.singleSuccessPostId);
  assert.equal(event(insufficient, "T-09").performance.supported_breakout, true);
  assert.equal(event(insufficient, "T-09").repeat_use_count, 0);
  assert.equal(analysis.creators.find((creator) => creator.creator_id === "T-09").validated_format_count, 0);
  assert.equal(analysis.creators.find((creator) => creator.creator_id === "T-30").limitations[0].code, "collection_blocked");
  assert.equal(analysis.summary.unclassified_format_post_count, 36);
  assertFinite(analysis);
});

test("dataset validation rejects the 50-post cap", () => {
  const fixture = makeFixture();
  delete fixture.ids;
  const source = fixture.posts.find((post) => post.creator_id === "T-10");
  for (let index = 0; index < 50; index += 1) {
    fixture.posts.push({
      ...source,
      post_id: `cap-${index}`,
      post_url: `https://x.com/T-10/status/cap-${index}`,
      posted_at_utc: `2026-08-${String(11 + (index % 10)).padStart(2, "0")}T${String(index % 24).padStart(2, "0")}:00:00Z`,
    });
  }
  assert.throws(() => analyzeDataset(fixture), /51 posts exceeds the 50-post cap/);
});
