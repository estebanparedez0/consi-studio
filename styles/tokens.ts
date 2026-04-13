export const brandTokens = {
  colors: {
    background: "#f8f1eb",
    foreground: "#2d2321",
    surface: "#fffaf6",
    surfaceStrong: "#f0e2d8",
    line: "#ddc7b8",
    accent: "#7b5245",
    accentSoft: "#ead4c8",
    muted: "#7b6a65"
  },
  fonts: {
    sans: "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
    display: "Georgia, \"Times New Roman\", serif"
  },
  spacing: {
    pageX: "1.25rem",
    pageY: "1.5rem",
    section: "4rem"
  },
  radius: {
    card: "1.5rem",
    pill: "999px"
  }
} as const;

export function tokensToCssVariables() {
  return {
    "--color-background": brandTokens.colors.background,
    "--color-foreground": brandTokens.colors.foreground,
    "--color-surface": brandTokens.colors.surface,
    "--color-surface-strong": brandTokens.colors.surfaceStrong,
    "--color-line": brandTokens.colors.line,
    "--color-accent": brandTokens.colors.accent,
    "--color-accent-soft": brandTokens.colors.accentSoft,
    "--color-muted": brandTokens.colors.muted,
    "--font-sans": brandTokens.fonts.sans,
    "--font-display": brandTokens.fonts.display
  } as React.CSSProperties;
}
