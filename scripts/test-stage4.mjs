import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
import { bindAdoptionTimeline, nextTimelineIndex, timelineEventView, timelineLanes } from "../src/timeline.mjs";

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
    "unavailable_source_link",
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

test("timeline event labels use only creator evidence and cover limited states", () => {
  const view = timelineEventView({
    creator_id: "C1",
    first_adoption_at_utc: "2026-09-10T00:00:00Z",
    first_adoption_precision: "day",
    adoption_rank: 1,
    adoption_percentile: null,
    early_adopter: false,
    later_adopter_count: 0,
  }, { creator_name: "Ada Example", creator_handle: "@ada" });
  assert.equal(view.label, "Ada Example, @ada; first observed sep 10, 2026; adoption rank 1; later adopter; 0 later adopters");
  assert.equal(view.observedLine, "sep 10, 2026 · approximate day precision");
  assert.equal(view.rankLine, "rank 1 · percentile unavailable");
  assert.equal(nextTimelineIndex("ArrowRight", 0, 1), 0);
  assert.equal(nextTimelineIndex("ArrowLeft", 0, 0), null);
  assert.deepEqual(timelineLanes([10, 10, 11, 20], 7.5), [0, 1, 2, 0]);
});

test("timeline selection keeps dot, summary, and list state matched", () => {
  class ClassList {
    values = new Set();
    toggle(name, enabled) { enabled ? this.values.add(name) : this.values.delete(name); }
    has(name) { return this.values.has(name); }
  }
  const node = (kind, index) => ({
    kind,
    index,
    dataset: kind === "dot" ? { creator: `Creator ${index}`, details: `rank ${index + 1}` } : {},
    classList: new ClassList(),
    attributes: {},
    hidden: true,
    selectedLabel: kind === "item" ? { hidden: true } : null,
    closest(selector) {
      if (selector === "[data-timeline-dot]" && kind === "dot") return this;
      if (selector === "[data-timeline-item]" && kind === "item") return this;
      return null;
    },
    querySelector(selector) { return selector === "[data-selected-label]" ? this.selectedLabel : null; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus(options) { this.focusedWith = options || true; },
    scrollIntoView(options) { this.scrolledWith = options; },
  });
  const dots = [node("dot", 0), node("dot", 1)];
  const items = [node("item", 0), node("item", 1)];
  const summaryName = { textContent: "no event selected" };
  const summaryDetails = { textContent: "choose a dot" };
  const listeners = new Map();
  const section = {
    querySelectorAll: (selector) => selector === "[data-timeline-dot]" ? dots : items,
    querySelector: (selector) => selector === "[data-timeline-summary-name]" ? summaryName : summaryDetails,
    addEventListener: (type, listener) => listeners.set(type, listener),
    contains: (target) => [...dots, ...items].includes(target),
  };
  const fire = (type, values) => {
    let prevented = false;
    listeners.get(type)({ preventDefault: () => { prevented = true; }, relatedTarget: null, ...values });
    return prevented;
  };

  bindAdoptionTimeline(section);
  fire("click", { target: dots[1] });
  assert.deepEqual(dots.map((dot) => dot.attributes["aria-pressed"]), ["false", "true"]);
  assert.deepEqual(items.map((item) => item.classList.has("is-selected")), [false, true]);
  assert.deepEqual(items.map((item) => item.selectedLabel.hidden), [true, false]);
  assert.equal(summaryName.textContent, "Creator 1");
  assert.equal(summaryDetails.textContent, "rank 2");
  assert.deepEqual(items[1].focusedWith, { preventScroll: true });
  assert.deepEqual(items[1].scrolledWith, { block: "nearest" });

  fire("focusin", { target: items[0] });
  assert.equal(dots[0].classList.has("is-corresponding"), true);
  assert.equal(items[0].classList.has("is-corresponding"), true);
  assert.equal(fire("keydown", { target: dots[0], key: "ArrowRight" }), true);
  assert.equal(dots[1].focusedWith, true);
  assert.equal(fire("keydown", { target: items[0], key: "End" }), true);
  assert.equal(items[1].focusedWith, true);

  assert.equal(fire("keydown", { target: items[1], key: "Escape" }), true);
  assert.deepEqual(dots.map((dot) => dot.attributes["aria-pressed"]), ["false", "false"]);
  assert.equal(summaryName.textContent, "no event selected");
  assert.equal(summaryDetails.textContent, "choose a dot");
});

test("timeline markup and CSS expose native, hover, focus, narrow, and reduced-motion states", async () => {
  const [main, styles] = await Promise.all([
    readFile(new URL("../src/main.mjs", import.meta.url), "utf8"),
    readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  ]);
  assert.match(main, /<button[\s\S]*?data-timeline-dot/);
  assert.match(main, /aria-label="\$\{escapeHtml\(view\.label\)\}"/);
  assert.match(main, /no observed creator events are available/);
  assert.match(styles, /\.timeline-dot:hover \.timeline-tooltip/);
  assert.match(styles, /\.timeline-dot:focus-visible \.timeline-tooltip/);
  assert.match(styles, /@media \(max-width: 560px\)[\s\S]*?\.timeline-tooltip \{ display: none; \}/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.timeline-dot, \.timeline-tooltip \{ transition: none; \}/);
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
