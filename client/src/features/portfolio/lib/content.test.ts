import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  type Experience,
  type Project,
  mailtoHref,
  otherProjects,
  periodStart,
  projectById,
  projectTags,
  slugify,
  sortByNewest,
  sortByOldest,
} from "./content.ts";

const experience = (id: number, start: string): Experience => ({
  id,
  start,
  company: `Company ${id}`,
  country: "Argentina",
  position: { es: `Puesto ${id}`, en: `Role ${id}` },
  workModality: "Full-time",
  timelapse: { es: start, en: start },
  highlights: { es: ["a"], en: ["a"] },
});

const project: Project = {
  id: 1,
  projectName: "Nadira Decants",
  description: { es: "Tienda", en: "Shop" },
  image: "/x.webp",
  techStack: "NextJS, TailwindCSS , ,Typescript",
  codeLink: "https://example.com/code",
  livePreview: "",
};

describe("sortByNewest", () => {
  test("sorts newest first without mutating the input", () => {
    const items = [experience(1, "2023-01"), experience(2, "2026-04"), experience(3, "2023-12")];
    assert.deepEqual(sortByNewest(items).map((item) => item.id), [2, 3, 1]);
    assert.deepEqual(items.map((item) => item.id), [1, 2, 3]);
  });
});

describe("sortByOldest", () => {
  test("tells the story in order, without mutating the input", () => {
    const items = [experience(1, "2026-04"), experience(2, "2023-01"), experience(3, "2025-11")];
    assert.deepEqual(sortByOldest(items).map((item) => item.id), [2, 3, 1]);
    assert.deepEqual(items.map((item) => item.id), [1, 2, 3]);
  });
});

describe("periodStart", () => {
  test("keeps the month and year where a period begins", () => {
    assert.equal(periodStart("Dic 2023 - Jul 2024"), "Dic 2023");
    assert.equal(periodStart("Apr 2026 - Present"), "Apr 2026");
  });

  test("a period with no end stays whole", () => {
    assert.equal(periodStart("2025"), "2025");
  });
});

describe("slugify", () => {
  test("lowercases, strips accents and joins words with dashes", () => {
    assert.equal(slugify("Control de gastos mensuales"), "control-de-gastos-mensuales");
    assert.equal(slugify("FitnessApp (API)"), "fitnessapp-api");
    assert.equal(slugify("Diseño Ágil"), "diseno-agil");
  });
});

describe("mailtoHref", () => {
  test("encodes subject and body", () => {
    assert.equal(
      mailtoHref("me@example.com", "Hola & chau", "Línea 1\nLínea 2"),
      "mailto:me@example.com?subject=Hola%20%26%20chau&body=L%C3%ADnea%201%0AL%C3%ADnea%202",
    );
  });
});

describe("featured projects", () => {
  const list = [1, 5, 2, 6, 4].map((id) => ({ ...project, id }));

  test("projectById finds a launch, and fails loudly if it is gone", () => {
    assert.equal(projectById(list, 5).id, 5);
    assert.throws(() => projectById(list, 99), /99/);
  });

  test("otherProjects leaves out the launches and keeps the order", () => {
    assert.deepEqual(otherProjects(list, [5, 6]).map((item) => item.id), [1, 2, 4]);
  });
});

describe("projectTags", () => {
  test("splits, trims and drops empty tags", () => {
    assert.deepEqual(projectTags(project), ["NextJS", "TailwindCSS", "Typescript"]);
  });
});
