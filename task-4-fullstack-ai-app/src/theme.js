// Deliberate palette for a "developer productivity" subject: a near-black
// charcoal surface, a signal-colored status system (todo / in-progress /
// done / blocked), and a violet brand accent. Numeric and technical labels
// use a monospace stack; reading copy uses the system sans stack.
export const theme = {
  bg: "#121317",
  surface: "#1B1D24",
  surfaceRaised: "#22252E",
  border: "#2A2D38",
  borderSoft: "#23252F",
  textPrimary: "#EDEDF2",
  textSecondary: "#8F93A6",
  textMuted: "#5C6072",
  green: "#3ECF8E",
  greenSoft: "rgba(62,207,142,0.12)",
  amber: "#F0A860",
  amberSoft: "rgba(240,168,96,0.12)",
  violet: "#8B7FF5",
  violetSoft: "rgba(139,127,245,0.14)",
  red: "#F0616B",
  redSoft: "rgba(240,97,107,0.12)",
};

export const STATUS_META = {
  todo: { label: "To do", color: theme.textSecondary, dot: theme.textMuted },
  "in-progress": { label: "In progress", color: theme.amber, dot: theme.amber },
  done: { label: "Done", color: theme.green, dot: theme.green },
};

export const PRIORITY_META = {
  high: { label: "High", color: theme.red },
  medium: { label: "Medium", color: theme.amber },
  low: { label: "Low", color: theme.textSecondary },
};
