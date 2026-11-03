import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  type Experience,
  type Project,
  commitGroups,
  countAdditions,
  jobDuration,
  mailtoHref,
  projectSource,
  shortSha,
  slugify,
  sortByNewest,
  stackSource,
  TAB_IDS,
  tabFromHash,
} from "./pullRequest.ts";

const experience = (id: number, start: string, timelapse: string): Experience => ({
  id,
  start,
  company: `Company ${id}`,
  country: "Argentina",
  position: { es: `Puesto ${id}`, en: `Role ${id}` },
  workModality: "Full-time",
  timelapse: { es: timelapse, en: timelapse },
  highlights: { es: ["a"], en: ["a"] },
});

const project: Project = {
  id: 1,
  projectName: "Nadira Decants",
  description: { es: "Tienda de perfumes", en: "Perfume shop" },
  image: "/nadira.webp",
  techStack: "NextJS, TailwindCSS",
  codeLink: "https://example.com/code",
  livePreview: "https://example.com",
};

describe("shortSha", () => {
  test("is a deterministic 7-char hex string", () => {
    assert.match(shortSha("Toyota-2023-01"), /^[0-9a-f]{7}$/);
    assert.equal(shortSha("Toyota-2023-01"), shortSha("Toyota-2023-01"));
    assert.notEqual(shortSha("Toyota-2023-01"), shortSha("Nexus-2023-12"));
  });
});

describe("slugify", () => {
  test("lowercases, strips accents and joins words with dashes", () => {
    assert.equal(slugify("Control de gastos mensuales"), "control-de-gastos-mensuales");
    assert.equal(slugify("FitnessApp (API)"), "fitnessapp-api");
    assert.equal(slugify("Diseño Ágil"), "diseno-agil");
  });
});

describe("tabFromHash", () => {
  test("maps known hashes to their tab", () => {
    for (const id of TAB_IDS) assert.equal(tabFromHash(`#${id}`), id);
  });

  test("falls back to the conversation tab", () => {
    assert.equal(tabFromHash(""), "conversation");
    assert.equal(tabFromHash("#nope"), "conversation");
  });
});

describe("sortByNewest and commitGroups", () => {
  const items = [
    experience(1, "2023-01", "Ene 2023 - Abr 2023"),
    experience(2, "2026-04", "Abr 2026 - Presente"),
    experience(3, "2023-01", "Ene 2023 - Mar 2023"),
  ];

  test("sorts newest first without mutating the input", () => {
    const sorted = sortByNewest(items);
    assert.deepEqual(sorted.map((item) => item.id), [2, 1, 3]);
    assert.deepEqual(items.map((item) => item.id), [1, 2, 3]);
  });

  test("groups commits by start label, newest group first", () => {
    const groups = commitGroups(items, "es");
    assert.deepEqual(
      groups.map((group) => [group.label, group.items.map((item) => item.id)]),
      [
        ["Abr 2026", [2]],
        ["Ene 2023", [1, 3]],
      ],
    );
  });
});

describe("projectSource and countAdditions", () => {
  test("renders the project as markdown source lines", () => {
    assert.deepEqual(projectSource(project, "en"), [
      "# Nadira Decants",
      "",
      "Perfume shop",
      "",
      "**Stack:** NextJS, TailwindCSS",
      "",
      "[Live demo](https://example.com) · [Code](https://example.com/code)",
    ]);
  });

  test("omits the demo link when there is no live preview", () => {
    const lines = projectSource({ ...project, livePreview: "" }, "en");
    assert.equal(lines.at(-1), "[Code](https://example.com/code)");
  });

  test("counts added lines across files", () => {
    assert.equal(countAdditions([["a", "b"], [], ["c"]]), 3);
  });
});

describe("stackSource", () => {
  test("pretty-prints categories as JSON lines", () => {
    const lines = stackSource([
      { key: "languages", items: ["TypeScript", "Python"] },
      { key: "data", items: ["PostgreSQL"] },
    ]);
    assert.deepEqual(lines, [
      "{",
      '  "languages": [',
      '    "TypeScript",',
      '    "Python"',
      "  ],",
      '  "data": [',
      '    "PostgreSQL"',
      "  ]",
      "}",
    ]);
    assert.deepEqual(JSON.parse(lines.join("\n")), {
      languages: ["TypeScript", "Python"],
      data: ["PostgreSQL"],
    });
  });
});

describe("mailtoHref", () => {
  test("encodes subject and body", () => {
    assert.equal(
      mailtoHref("me@example.com", "Re: feat #1", "Hi Lucio & co\nBye"),
      "mailto:me@example.com?subject=Re%3A%20feat%20%231&body=Hi%20Lucio%20%26%20co%0ABye",
    );
  });
});

describe("jobDuration", () => {
  test("is a deterministic duration between 6s and 45s", () => {
    for (const seed of ["languages", "frontend", "backend", "data", "tools", "ai"]) {
      const seconds = jobDuration(seed);
      assert.equal(seconds, jobDuration(seed));
      assert.ok(seconds >= 6 && seconds <= 45, `${seed}: ${seconds}`);
    }
  });
});
