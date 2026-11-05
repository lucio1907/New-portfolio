import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  type Experience,
  type Project,
  mailtoHref,
  otherProjects,
  periodStart,
  projectById,
  projectTags,
  slugify,
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

describe("the owner's title", () => {
  const read = (path: string) => readFileSync(new URL(`../../../../${path}`, import.meta.url), "utf8");

  // The course's official name, which has to match its certificate.
  const COURSE = { es: "Desarrollo Web Full Stack", en: "Full Stack Web Development" };

  test('the copy says "software developer", never "full stack", except in the course\'s name', () => {
    for (const path of ["messages/es.json", "messages/en.json", "src/json/experiencies.json", "src/json/projects.json", "src/json/techStack.json"]) {
      const copy = read(path).replaceAll(COURSE.es, "").replaceAll(COURSE.en, "");
      assert.doesNotMatch(copy, /full[\s-]?stack/i, path);
    }
  });

  test("the Coderhouse course keeps its official name", () => {
    for (const locale of ["es", "en"] as const) {
      const { studies } = JSON.parse(read(`messages/${locale}.json`)).sheet;
      const course = studies.find((study: { place: string }) => study.place === "Coderhouse");
      assert.equal(course.title, COURSE[locale]);
    }
  });

  test("the trajectory's title opens with it", () => {
    assert.equal(JSON.parse(read("messages/es.json")).trajectory.first, "Desarrollador de software.");
    assert.equal(JSON.parse(read("messages/en.json")).trajectory.first, "Software developer.");
  });
});

describe("sortByOldest", () => {
  test("sorts oldest first, ending on the current role, without mutating the input", () => {
    const items = [experience(1, "2026-04"), experience(2, "2023-01"), experience(3, "2023-12")];
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
