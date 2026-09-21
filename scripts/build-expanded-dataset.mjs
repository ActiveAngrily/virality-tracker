import { readFile, writeFile } from "node:fs/promises";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const [base, expansion] = await Promise.all([
  load("data/demo-data.json"),
  load("data/demo-data.expansion.json"),
]);

const overlap = (left, right, field) => {
  const values = new Set(left.map((item) => item[field]));
  return right.filter((item) => values.has(item[field])).map((item) => item[field]);
};

for (const [label, left, right, field] of [
  ["creator IDs", base.creators, expansion.creators, "creator_id"],
  ["post IDs", base.posts, expansion.posts, "post_id"],
  ["canonical URLs", base.posts, expansion.posts, "post_url"],
]) {
  const duplicates = overlap(left, right, field);
  if (duplicates.length) throw new Error(`${label} overlap: ${duplicates.join(", ")}`);
}

for (const field of ["thresholds", "codebook"]) {
  if (JSON.stringify(base[field]) !== JSON.stringify(expansion[field])) {
    throw new Error(`${field} differ between base and expansion datasets`);
  }
}

const dataset = {
  ...base,
  metadata: {
    ...base.metadata,
    artifact_name: "demo-data.expanded",
    artifact_status: "stage_5_expanded_snapshot_frozen",
    cohort_id: "x-b2b-tech-creators-expanded-2026-09",
    cohort_description: "Expanded snapshot of 60 public individual creators covering B2B technology, startups, product, growth, marketing, venture, and developer tools.",
    expected_creator_count: 60,
    collection_completed_at_utc: expansion.metadata.collection_completed_at_utc,
    expansion_dataset_included: true,
    base_artifact_name: base.metadata.artifact_name,
    expansion_artifact_name: expansion.metadata.artifact_name,
  },
  schema: {
    ...base.schema,
    entities: {
      ...base.schema.entities,
      creator: {
        ...base.schema.entities.creator,
        schema_ref: "data/x-creators.json#/schema",
        records_ref: "#/creators",
      },
    },
  },
  creators: [...base.creators, ...expansion.creators],
  posts: [...base.posts, ...expansion.posts],
};

await writeFile("data/demo-data.expanded.json", `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`wrote ${dataset.metadata.artifact_name}: ${dataset.creators.length} creators, ${dataset.posts.length} posts`);
