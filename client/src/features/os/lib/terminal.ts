import { type AppId, isAppId } from "./apps.ts";

/**
 * LucioOS terminal as a pure function: text in, lines (and at most one side
 * effect for the UI to perform) out. English on purpose: it is a terminal.
 */
export type TerminalLine = { kind: "output" | "error" | "success"; text: string };

export type TerminalEffect =
  | { type: "open"; app: AppId }
  | { type: "cv" }
  | { type: "stats" }
  | { type: "clear" };

export type TerminalResult = { lines: TerminalLine[]; effect?: TerminalEffect };

export type TerminalContext = {
  projects: readonly string[];
  about: readonly string[];
  email: string;
  phone: string;
  links: readonly string[];
};

const out = (text: string): TerminalLine => ({ kind: "output", text });
const error = (text: string): TerminalLine => ({ kind: "error", text });

const HELP = [
  "help              show this list",
  "whoami            who built this",
  "ls [projects]     list files or projects",
  "cat about.md      read the bio",
  "open <app|cv>     open about, experience, projects, stack, contact or the CV",
  "contact           how to reach Lucio",
  "stats             toggle live rendering stats",
  "clear             clear the screen",
  "echo <text>       print text",
];

export const runCommand = (input: string, context: TerminalContext): TerminalResult => {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [rawCommand, ...args] = trimmed.split(/\s+/);
  const command = rawCommand.toLowerCase();
  const argument = args.join(" ").toLowerCase();

  switch (command) {
    case "help":
      return { lines: HELP.map(out) };
    case "whoami":
      return { lines: [out("Lucio Gastellu, Full Stack Developer (AI-native) from Buenos Aires, Argentina.")] };
    case "ls":
      return argument === "projects"
        ? { lines: context.projects.map(out) }
        : { lines: [out("about.md  experience/  projects/  stack.json  contact.txt  cv.pdf")] };
    case "cat":
      return argument === "about.md"
        ? { lines: context.about.map(out) }
        : { lines: [error(`cat: ${args.join(" ") || "(nothing)"}: no such file. Try cat about.md`)] };
    case "open":
      if (argument === "cv") return { lines: [out("Opening cv.pdf…")], effect: { type: "cv" } };
      if (isAppId(argument)) return { lines: [out(`Opening ${argument}…`)], effect: { type: "open", app: argument } };
      return { lines: [error(`open: unknown app "${args.join(" ")}". Try about, experience, projects, stack, contact or cv`)] };
    case "contact":
      return {
        lines: [out(`email  ${context.email}`), out(`phone  ${context.phone}`), ...context.links.map((link) => out(`link   ${link}`))],
      };
    case "stats":
      return { lines: [out("Toggling rendering stats (also: press `).")], effect: { type: "stats" } };
    case "clear":
      return { lines: [], effect: { type: "clear" } };
    case "echo":
      return { lines: [out(args.join(" "))] };
    case "sudo":
      return argument === "hire lucio"
        ? { lines: [{ kind: "success", text: "Permission granted. Great choice. Opening contact…" }], effect: { type: "open", app: "contact" } }
        : { lines: [error("sudo: nice try. This incident will be reported.")] };
    default:
      return { lines: [error(`command not found: ${rawCommand}. Type help to see what is available.`)] };
  }
};
