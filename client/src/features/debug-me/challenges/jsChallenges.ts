export type ChallengeTest = {
  /** Stable id; also the i18n key of the test title. */
  id: string;
  /** Async function body that receives `fn` (the visitor's function) and `assert`. */
  body: string;
};

export type JsChallenge = {
  bugId: "stack" | "experience";
  /** Name of the function the visitor must fix. */
  entry: string;
  starter: string;
  tests: ChallengeTest[];
};

export const MAX_CODE_LENGTH = 4000;

export const STACK_CHALLENGE: JsChallenge = {
  bugId: "stack",
  entry: "loadStack",
  starter: `// loadStack retries a flaky request up to \`retries\` times.
// The loader has been spinning since Friday. Make the tests pass.
async function loadStack(fetchStack, retries) {
  for (let attempt = 1; attempt < retries; attempt++) {
    try {
      return fetchStack();
    } catch (error) {
      console.log(\`attempt \${attempt} failed\`);
    }
  }
  throw new Error("ETIMEDOUT: coffee not found");
}
`,
  tests: [
    {
      id: "firstTry",
      body: `
const stack = ["React", "Node.js"];
const result = await fn(async () => stack, 3);
assert.equal(result, stack);`,
    },
    {
      id: "retries",
      body: `
let calls = 0;
const flaky = async () => {
  calls += 1;
  if (calls < 2) throw new Error("ETIMEDOUT");
  return ["FastAPI"];
};
const result = await fn(flaky, 2);
assert.equal(result, ["FastAPI"], "result");
assert.equal(calls, 2, "calls");`,
    },
    {
      id: "givesUp",
      body: `
let calls = 0;
const broken = async () => {
  calls += 1;
  throw new Error("ETIMEDOUT");
};
let threw = false;
try {
  await fn(broken, 3);
} catch {
  threw = true;
}
assert.ok(threw, "expected loadStack to throw after the last retry");
assert.equal(calls, 3, "calls");`,
    },
  ],
};

export const EXPERIENCE_CHALLENGE: JsChallenge = {
  bugId: "experience",
  entry: "sortTimeline",
  starter: `// Sort experiences newest first. \`start\` looks like "2023-12".
// The timeline is shuffled and the tests are red. Fix the function.
function sortTimeline(items) {
  return items.sort((a, b) => a.start - b.start);
}
`,
  tests: [
    {
      id: "newestFirst",
      body: `
const items = [
  { company: "Toyota", start: "2023-01" },
  { company: "Freelance", start: "2026-04" },
  { company: "Nexus Digital", start: "2023-12" },
];
const sorted = fn(items);
assert.equal(sorted.map((item) => item.company), ["Freelance", "Nexus Digital", "Toyota"]);`,
    },
    {
      id: "sameYear",
      body: `
const sorted = fn([
  { company: "January", start: "2025-01" },
  { company: "November", start: "2025-11" },
]);
assert.equal(sorted.map((item) => item.company), ["November", "January"]);`,
    },
    {
      id: "noMutation",
      body: `
const items = [
  { company: "Toyota", start: "2023-01" },
  { company: "Freelance", start: "2026-04" },
];
fn(items);
assert.equal(items.map((item) => item.company), ["Toyota", "Freelance"], "original array");`,
    },
  ],
};
