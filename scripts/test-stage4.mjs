import assert from "node:assert/strict";
import test from "node:test";

import {
  detailHash,
  filterAndSortPatterns,
  parseRoute,
  radarHash,
  representativePosts,
  selectStrongSignals,
  signalSentence,
  timelinePosition,
  unavailableReason,
} from "../src/ui-model.mjs";

const makePattern = ({
  id,
  name = id,
  lifecycle = "Emerging",
  type = "format",
  recent = 0,
  adopters = 2,
  lift = null,
  last = "2026-09-01T00:00:00Z",
  validated = 0,
}) => ({
  identity: { pattern_id: id, pattern_name: name, pattern_type: type },
  lifecycle,
  adoption_metrics: {
    recent_adopter_count: recent,
    distinct_adopter_count: adopters,
    last_observed_at_utc: last,
  },
  performance_metrics: { median_view_lift: lift },
  validated_events: Array.from({ length: validated }, () => ({})),
});

test("Radar URL state round-trips and rejects unsupported values", () => {
  const state = { lifecycle: "Validated", type: "hook", sort: "performance" };
  assert.deepEqual(parseRoute(radarHash(state)), { screen: "radar", state });
  assert.deepEqual(parseRoute(detailHash("HP-05", state)), { screen: "detail", patternId: "HP-05", state });
  assert.deepEqual(parseRoute("#/radar?lifecycle=nope&type=nope&sort=nope").state, {
    lifecycle: "all",
    type: "all",
    sort: "default",
  });
});

test("filters and all three deterministic sorts use Stage 3 fields", () => {
  const patterns = [
    makePattern({ id: "E-low", lifecycle: "Emerging", recent: 1, adopters: 3, lift: 1, last: "2026-09-10T00:00:00Z" }),
    makePattern({ id: "V-high", lifecycle: "Validated", type: "hook", recent: 5, adopters: 20, lift: 5, last: "2026-09-20T00:00:00Z", validated: 1 }),
    makePattern({ id: "E-high", lifecycle: "Emerging", recent: 2, adopters: 4, lift: 2, last: "2026-09-15T00:00:00Z" }),
    makePattern({ id: "F-none", lifecycle: "Fading", recent: 0, adopters: 8, lift: null, last: "2026-08-01T00:00:00Z" }),
  ];
  assert.deepEqual(filterAndSortPatterns(patterns, {}).map((item) => item.identity.pattern_id), ["E-high", "E-low", "V-high", "F-none"]);
  assert.deepEqual(filterAndSortPatterns(patterns, { sort: "recency" }).map((item) => item.identity.pattern_id), ["V-high", "E-high", "E-low", "F-none"]);
  assert.deepEqual(filterAndSortPatterns(patterns, { sort: "performance" }).map((item) => item.identity.pattern_id), ["V-high", "E-high", "E-low", "F-none"]);
  assert.deepEqual(filterAndSortPatterns(patterns, { lifecycle: "Validated", type: "hook" }).map((item) => item.identity.pattern_id), ["V-high"]);
});

test("strong signals use validated state, breakouts, then existing order", () => {
  const patterns = [
    makePattern({ id: "emerging", lifecycle: "Emerging", validated: 0 }),
    makePattern({ id: "validated-one", lifecycle: "Validated", validated: 1 }),
    makePattern({ id: "validated-two", lifecycle: "Validated", validated: 1 }),
  ];
  patterns[0].performance_metrics.supported_breakout_count = 99;
  patterns[1].performance_metrics.supported_breakout_count = 1;
  patterns[2].performance_metrics.supported_breakout_count = 2;
  assert.deepEqual(selectStrongSignals(patterns, 3).map((item) => item.identity.pattern_id), ["validated-two", "validated-one", "emerging"]);
});

test("representative posts use transparent flags and chronology, not a score", () => {
  const candidates = [
    { post_id: "plain", creator_id: "C1", validated_early_capture: false, supported_breakout: false },
    { post_id: "supported-late", creator_id: "C2", validated_early_capture: false, supported_breakout: true },
    { post_id: "validated", creator_id: "C3", validated_early_capture: true, supported_breakout: true },
    { post_id: "supported-early", creator_id: "C4", validated_early_capture: false, supported_breakout: true },
  ];
  const times = {
    plain: "2026-09-01T00:00:00Z",
    "supported-late": "2026-09-04T00:00:00Z",
    validated: "2026-09-05T00:00:00Z",
    "supported-early": "2026-09-03T00:00:00Z",
  };
  const pattern = {
    representative_post_candidates: candidates,
    creator_evidence: candidates.map((candidate) => ({
      creator_id: candidate.creator_id,
      first_adoption_post_id: candidate.post_id,
      adoption_order_at_utc: times[candidate.post_id],
    })),
  };
  const posts = new Map(candidates.map((candidate) => [candidate.post_id, { post_id: candidate.post_id }]));
  assert.deepEqual(representativePosts(pattern, posts).map((item) => item.post_id), ["validated", "supported-early", "supported-late"]);
});

test("edge reasons and signal copy remain explicit and non-causal", () => {
  for (const reason of [
    "missing_candidate_views",
    "post_too_young",
    "insufficient_baseline_history",
    "zero_baseline",
    "missing_reposts",
    "missing_quotes",
    "limited_view_lift_sample",
  ]) assert.doesNotMatch(unavailableReason(reason), /undefined|NaN|null/);

  for (const lifecycle of ["Validated", "Emerging", "Fading", "Insufficient Evidence"]) {
    const sentence = signalSentence(makePattern({ id: "Pattern", name: "Pattern", lifecycle, adopters: 4, recent: 2, validated: lifecycle === "Validated" ? 1 : 0 }));
    assert.match(sentence, /cohort|enough evidence/);
    assert.doesNotMatch(sentence, /originated|caused|predicted|drove/i);
  }
});

test("timeline coordinates preserve tied Stage 3 order times", () => {
  const event = { adoption_order_at_utc: "2026-09-10T00:00:00Z" };
  assert.equal(
    timelinePosition(event, "2026-09-01T00:00:00Z", "2026-09-21T00:00:00Z"),
    timelinePosition({ ...event }, "2026-09-01T00:00:00Z", "2026-09-21T00:00:00Z"),
  );
});

test("signal ties follow Stage 3 first-observed chronology without changing the input", () => {
  const patterns = [makePattern({ id: "later" }), makePattern({ id: "earlier" })];
  patterns.forEach((pattern) => { pattern.performance_metrics.supported_breakout_count = 1; });
  patterns[0].adoption_metrics.first_observed_at_utc = "2026-09-10T00:00:00Z";
  patterns[1].adoption_metrics.first_observed_at_utc = "2026-09-01T00:00:00Z";
  assert.deepEqual(selectStrongSignals(patterns).map((pattern) => pattern.identity.pattern_id), ["earlier", "later"]);
  assert.equal(patterns[0].identity.pattern_id, "later");
});

test("background degrades without canvas and skips drawing for reduced motion", async (t) => {
  const { drawDitherBackground } = await import("../src/dither.mjs");
  assert.doesNotThrow(() => drawDitherBackground(null));
  assert.doesNotThrow(() => drawDitherBackground({ getContext: () => null }));
  const motion = { matches: true, addEventListener() {} };
  const previous = { matchMedia: globalThis.matchMedia, window: globalThis.window, document: globalThis.document, requestAnimationFrame: globalThis.requestAnimationFrame };
  t.after(() => Object.assign(globalThis, previous));
  globalThis.matchMedia = () => motion;
  globalThis.document = { hidden: false, addEventListener() {} };
  let nextFrame;
  globalThis.requestAnimationFrame = (callback) => { nextFrame = callback; return 1; };
  globalThis.window = { innerWidth: 390, innerHeight: 844, addEventListener() {} };
  let pixels = 0;
  const canvas = { getContext: () => ({ clearRect() {}, fillRect() { pixels++; } }) };
  drawDitherBackground(canvas);
  assert.equal(pixels, 0);
  motion.matches = false;
  drawDitherBackground(canvas);
  assert.equal(canvas.width, 130);
  assert.equal(canvas.height, 282);
  assert.ok(pixels > 0 && pixels < canvas.width * canvas.height);
  const firstFramePixels = pixels;
  nextFrame(5000);
  assert.ok(pixels > firstFramePixels, "animation draws another frame");
  assert.notEqual(pixels - firstFramePixels, firstFramePixels, "the dither geometry changes over time");
});
