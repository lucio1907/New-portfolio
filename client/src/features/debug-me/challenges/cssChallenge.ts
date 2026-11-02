export type Declarations = Readonly<Record<string, string>>;

export type CssCheck = {
  /** Stable id; also the i18n key of the check label. */
  id: "display" | "position" | "gap" | "columns";
  passes: (declarations: Declarations) => boolean;
};

export const CSS_STARTER = `.projects {
  position: absolute;
  display: block;
}
`;

export const MAX_CSS_LENGTH = 1500;

/**
 * Parses the declarations of a single CSS rule. Comments are ignored, property
 * names are case-insensitive and the last declaration of a property wins.
 */
export const parseDeclarations = (css: string): Declarations => {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const open = withoutComments.indexOf("{");
  const close = withoutComments.lastIndexOf("}");
  const body =
    open !== -1 && close > open
      ? withoutComments.slice(open + 1, close)
      : withoutComments;

  const declarations: Record<string, string> = {};
  for (const chunk of body.split(";")) {
    const colon = chunk.indexOf(":");
    if (colon === -1) continue;
    const property = chunk.slice(0, colon).trim().toLowerCase();
    const value = chunk.slice(colon + 1).trim().replace(/\s+/g, " ");
    if (property && value) declarations[property] = value;
  }
  return declarations;
};

const value = (declarations: Declarations, property: string) =>
  (declarations[property] ?? "").toLowerCase();

export const CSS_CHECKS: CssCheck[] = [
  { id: "display", passes: (d) => value(d, "display") === "grid" },
  {
    id: "position",
    passes: (d) => ["", "static", "relative"].includes(value(d, "position")),
  },
  {
    id: "gap",
    passes: (d) =>
      value(d, "gap") !== "" ||
      (value(d, "row-gap") !== "" && value(d, "column-gap") !== ""),
  },
  {
    id: "columns",
    passes: (d) => value(d, "grid-template-columns") !== "",
  },
];

export const failingChecks = (declarations: Declarations): CssCheck["id"][] =>
  CSS_CHECKS.filter((check) => !check.passes(declarations)).map((check) => check.id);

// Only layout properties reach the preview, and only as inline style values.
const PREVIEW_PROPERTIES = [
  "display",
  "position",
  "gap",
  "row-gap",
  "column-gap",
  "grid-template-columns",
  "grid-auto-rows",
  "grid-auto-flow",
  "justify-items",
  "align-items",
  "place-items",
  "flex-direction",
  "flex-wrap",
  "justify-content",
  "align-content",
] as const;

const UNSAFE_VALUE = /url\(|expression\(|[<>{}\\]|@/i;

const toCamelCase = (property: string) =>
  property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** Converts visitor declarations into a safe inline style for the preview. */
export const toPreviewStyle = (
  declarations: Declarations,
): Record<string, string> => {
  const style: Record<string, string> = {};
  for (const property of PREVIEW_PROPERTIES) {
    const raw = declarations[property];
    if (raw && raw.length <= 120 && !UNSAFE_VALUE.test(raw)) {
      style[toCamelCase(property)] = raw;
    }
  }
  return style;
};
