import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { analyzeDataset } from "../src/analysis.mjs";
import { filterAndSortPatterns, representativePosts } from "../src/ui-model.mjs";

const dataset = JSON.parse(await readFile(new URL("../data/demo-data.expanded.json", import.meta.url), "utf8"));
const analysis = analyzeDataset(dataset);
const postById = new Map(dataset.posts.map((post) => [post.post_id, post]));
const creatorById = new Map(dataset.creators.map((creator) => [creator.creator_id, creator]));
const DAY_MS = 86_400_000;

const median = (values) => {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

test("expanded snapshot is deterministic and uses all 60 creators", () => {
  assert.deepEqual(analyzeDataset(dataset), analysis);
  assert.equal(analysis.analysis_context.source_artifact_name, "demo-data.expanded");
  assert.equal(analysis.analysis_context.expansion_dataset_included, true);
  assert.equal(analysis.summary.analyzed_creator_count, 60);
  assert.equal(analysis.summary.analyzed_post_count, 2056);
  assert.equal(analysis.validation_summary.maximum_posts_per_creator, 50);
});

test("every displayed pattern value traces to expanded source records", () => {
  const asOf = Date.parse(dataset.metadata.analysis_as_of_utc);
  const recentStart = asOf - dataset.thresholds.recent_window_days * DAY_MS;
  for (const pattern of analysis.patterns) {
    const events = pattern.creator_evidence;
    assert.equal(pattern.adoption_metrics.distinct_adopter_count, events.length);
    assert.equal(pattern.adoption_metrics.recent_adopter_count, events.filter((event) => {
      const time = Date.parse(event.adoption_order_at_utc);
      return time >= recentStart && time <= asOf;
    }).length);
    assert.equal(pattern.adoption_metrics.early_adopter_count, events.filter((event) => event.early_adopter).length);
    assert.equal(pattern.adoption_metrics.repeat_use_count, events.reduce((sum, event) => sum + event.repeat_use_count, 0));
    assert.equal(pattern.adoption_metrics.repeat_creator_count, events.filter((event) => event.repeat_use_count).length);

    for (const event of events) {
      const post = postById.get(event.first_adoption_post_id);
      assert.ok(post);
      assert.ok(creatorById.has(event.creator_id));
      assert.equal(post.creator_id, event.creator_id);
      assert.equal(post.post_url, event.first_adoption_post_url);
      assert.equal(post.views_at_collection, event.performance.candidate_views);
      assert.equal(post.reposts_at_collection, event.performance.reposts);
      assert.equal(post.quotes_at_collection, event.performance.quotes);
      assert.equal(post.collected_at_utc, event.performance.collected_at_utc);
      const baselinePosts = event.performance.baseline_source_post_ids.map((id) => postById.get(id));
      assert.ok(baselinePosts.every((source) => source?.creator_id === event.creator_id));
      assert.equal(event.performance.baseline, baselinePosts.length ? median(baselinePosts.map((source) => source.views_at_collection)) : null);
      if (event.performance.view_lift !== null) {
        assert.equal(event.performance.view_lift, post.views_at_collection / event.performance.baseline);
      }
      assert.equal(event.adoption_rank, 1 + events.filter((candidate) => Date.parse(candidate.adoption_order_at_utc) < Date.parse(event.adoption_order_at_utc)).length);
      assert.equal(event.adoption_percentile, events.length < 2 ? null : (event.adoption_rank - 1) / (events.length - 1));
      const later = events.filter((candidate) => Date.parse(candidate.adoption_order_at_utc) > Date.parse(event.adoption_order_at_utc)
        && Date.parse(candidate.adoption_order_at_utc) <= Date.parse(event.episode_end_utc));
      assert.deepEqual(event.later_adopter_creator_ids, later.map((candidate) => candidate.creator_id));
    }

    const lifts = events.map((event) => event.performance.view_lift).filter((value) => value !== null);
    assert.equal(pattern.performance_metrics.view_lift_sample_size, lifts.length);
    assert.equal(pattern.performance_metrics.median_view_lift, lifts.length >= dataset.thresholds.minimum_pattern_metric_sample ? median(lifts) : null);
    assert.equal(pattern.performance_metrics.supported_breakout_count, events.filter((event) => event.performance.supported_breakout).length);
    assert.equal(pattern.validated_events.length, events.filter((event) => event.validated_early_capture).length);
    for (const { event, post } of representativePosts(pattern, postById)) {
      assert.equal(post.post_id, event.first_adoption_post_id);
      assert.equal(post.post_url, event.first_adoption_post_url);
    }
  }
});

test("representative manual calculations and expanded-cohort states stay frozen", () => {
  const eventFor = (patternId, creatorId) => analysis.patterns
    .find((pattern) => pattern.identity.pattern_id === patternId)
    .creator_evidence.find((event) => event.creator_id === creatorId);
  const supported = eventFor("FP-01", "CR-027");
  const provisional = eventFor("FP-03", "EX-028");
  const limited = eventFor("FP-02", "EX-028");
  const nearThreshold = eventFor("FP-07", "EX-033");

  assert.deepEqual([supported.performance.baseline_prior_count, supported.performance.baseline, supported.performance.view_lift], [19, 55_572, 277_840 / 55_572]);
  assert.deepEqual([provisional.performance.baseline_quality, provisional.performance.baseline_prior_count, provisional.performance.baseline], ["Provisional", 9, 14_790]);
  assert.deepEqual([limited.performance.baseline_quality, limited.performance.baseline_prior_count, limited.performance.view_lift], ["Limited", 4, null]);
  assert.equal(nearThreshold.performance.view_lift, 37_335 / 25_187);
  assert.equal(nearThreshold.performance.supported_breakout, false);
  assert.deepEqual(analysis.summary.lifecycle_counts, { Emerging: 13 });
  assert.deepEqual(analysis.summary.evidence_quality_counts, { Supported: 13 });
  assert.equal(analysis.summary.validated_early_capture_count, 0);
  assert.ok(analysis.patterns.flatMap((pattern) => pattern.creator_evidence).filter((event) => event.performance.view_lift_unavailable_reason === "post_too_young")
    .every((event) => event.performance.amplifications === null && event.performance.amplification_rate === null));
  assert.equal(filterAndSortPatterns(analysis.patterns, { lifecycle: "Fading" }).length, 0);
});
