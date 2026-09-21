import { readFile, writeFile } from "node:fs/promises";
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));

const [base, expansion, demo] = await Promise.all([
  load("data/x-posts.raw.json"),
  load("data/x-posts.expansion.raw.json"),
  load("data/demo-data.json"),
]);

const criteriaFor = (patterns) =>
  Object.fromEntries(
    patterns.map((pattern) => [
      pattern.id,
      [
        pattern.name,
        pattern.definition,
        `Include: ${pattern.inclusion_rule}`,
        `Exclude: ${pattern.exclusion_rule}`,
        `Positive: ${pattern.positive_example}`,
        `Negative: ${pattern.negative_example}`,
      ].join(". "),
    ]),
  );

const formatCriteria = criteriaFor(demo.codebook.format_patterns);
const hookCriteria = criteriaFor(demo.codebook.hook_patterns);
const scale = process.argv.includes("--scale");
const all = process.argv.includes("--all");
const posts = all
  ? [
      ...base.posts
        .map((post) => ({ ...post, cohort: "base" })),
      ...expansion.posts
        .map((post) => ({ ...post, cohort: "expansion" })),
    ]
  : [
      ...base.posts
        .filter((post) => post.full_visible_text)
        .slice(0, scale ? 25 : 3)
        .map((post) => ({ ...post, cohort: "base" })),
      ...expansion.posts
        .filter((post) => post.full_visible_text)
        .slice(0, scale ? 25 : 2)
        .map((post) => ({ ...post, cohort: "expansion" })),
    ];

const expected = all ? 2056 : scale ? 50 : 5;
if (posts.length !== expected) {
  throw new Error(`expected ${expected} posts, got ${posts.length}`);
}

const client = new TypeSafeClient();
const suggest = async (post) => {
  if (!post.full_visible_text) {
    return {
      cohort: post.cohort,
      post_id: post.post_id,
      post_url: post.post_url,
      format: {
        type: "manual_missing_evidence",
        choice: "FP-UNCLASSIFIED",
        confidence: null,
        probabilities: null,
      },
      hook: {
        type: "manual_missing_evidence",
        choice: "HP-UNCLASSIFIED",
        confidence: null,
        probabilities: null,
      },
      skipped_reason: "missing_visible_text",
    };
  }

  const response = await client.systemOne({
    state: {
      post_text: post.full_visible_text,
      post_type: post.post_type,
    },
    questions: {
      format: choice(
        "Choose one frozen format pattern. Use FP-UNCLASSIFIED when unclear.",
        formatCriteria,
      ),
      hook: choice(
        "Choose one frozen hook pattern. Use HP-UNCLASSIFIED when unclear.",
        hookCriteria,
      ),
    },
  });

  return {
    cohort: post.cohort,
    post_id: post.post_id,
    post_url: post.post_url,
    format: response.answers.format,
    hook: response.answers.hook,
  };
};

const suggestions = new Array(posts.length);
let next = 0;
const worker = async () => {
  while (true) {
    const index = next++;
    if (index >= posts.length) return;
    const post = posts[index];
    suggestions[index] = await suggest(post);
    if (!all || index === 0 || (index + 1) % 25 === 0) {
      console.log(
        `${index + 1}/${posts.length}`,
        post.cohort,
        post.post_id,
        suggestions[index].format.choice,
        suggestions[index].hook.choice,
      );
    }
  }
};

await Promise.all(
  Array.from({ length: all ? 8 : 1 }, () => worker()),
);

const outputPath = scale
  ? "tmp/jev-label-suggestions-50.json"
  : all
    ? "tmp/jev-label-suggestions-all.json"
    : "tmp/jev-label-suggestions.json";
await writeFile(outputPath, JSON.stringify(suggestions, null, 2));

console.log(`Saved ${outputPath}`);
