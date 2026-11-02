export type TerminalLine =
  | { kind: "input"; text: string }
  | { kind: "text"; text: string }
  | {
      kind: "output" | "error" | "success";
      /** i18n key under `debug.terminal.out`. */
      key: string;
      values?: Record<string, string>;
    };

export type TerminalState = Readonly<{ env: Readonly<Record<string, string>> }>;

export type CommandResult = {
  state: TerminalState;
  lines: TerminalLine[];
  /** Clears previous output (the `clear` command). */
  clear?: boolean;
  /** True when the deploy succeeded and the bug should be marked fixed. */
  deployed?: boolean;
};

export const MAX_COMMAND_LENGTH = 200;
export const initialTerminalState: TerminalState = { env: {} };

const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILES = "about.md  stack.json  timeline.ts  projects.css  deploy.sh";

const unquote = (value: string) => value.trim().replace(/^(['"])(.*)\1$/, "$2");

const expand = (text: string, env: TerminalState["env"]) =>
  text.replace(/\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?/g, (_, name: string) => env[name] ?? "");

const out = (
  key: string,
  values?: Record<string, string>,
  kind: "output" | "error" | "success" = "output",
): TerminalLine => ({ kind, key, values });

/** Interprets one command typed in the Contact terminal. Pure: no side effects. */
export const runCommand = (rawInput: string, state: TerminalState): CommandResult => {
  const input = rawInput.trim().slice(0, MAX_COMMAND_LENGTH);
  if (!input) return { state, lines: [] };

  const echoed: TerminalLine = { kind: "input", text: input };
  const [command, ...rest] = input.split(/\s+/);
  const args = rest.join(" ");
  const done = (lines: TerminalLine[], extra: Partial<CommandResult> = {}) => ({
    state,
    lines: [echoed, ...lines],
    ...extra,
  });

  switch (command) {
    case "help":
      return done([out("help")]);
    case "ls":
      return done([{ kind: "text", text: FILES }]);
    case "whoami":
      return done([out("whoami")]);
    case "clear":
      return { state, lines: [], clear: true };
    case "hire":
      return done([out("hire", undefined, "success")]);
    case "sudo":
      return done([out("sudo", undefined, "error")]);
    case "rm":
      return done([out("rm", undefined, "error")]);
    case "echo":
      return done([{ kind: "text", text: expand(unquote(args), state.env) }]);
    case "export": {
      const equals = args.indexOf("=");
      const name = equals === -1 ? args.trim() : args.slice(0, equals).trim();
      const value = equals === -1 ? "" : unquote(args.slice(equals + 1));
      if (!ENV_NAME.test(name) || equals === -1) {
        return done([out("exportUsage", undefined, "error")]);
      }
      if (name === "CONTACT_EMAIL" && !EMAIL.test(value)) {
        return done([out("invalidEmail", { value }, "error")]);
      }
      return {
        state: { env: { ...state.env, [name]: value } },
        lines: [echoed, out("exported", { name })],
      };
    }
    case "npm": {
      if (args !== "run deploy") {
        return done([out("npmUsage", undefined, "error")]);
      }
      if (!EMAIL.test(state.env.CONTACT_EMAIL ?? "")) {
        return done([out("missingEnv", undefined, "error")]);
      }
      return done([out("building"), out("deploySuccess", undefined, "success")], {
        deployed: true,
      });
    }
    default:
      return done([out("notFound", { command }, "error")]);
  }
};
