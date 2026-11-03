import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  type Experience,
  type Project,
  mailtoHref,
  projectTags,
  slugify,
  sortByNewest,
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

describe("projectTags", () => {
  test("splits, trims and drops empty tags", () => {
    assert.deepEqual(projectTags(project), ["NextJS", "TailwindCSS", "Typescript"]);
  });
});
