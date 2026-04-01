import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";

// ── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  deepOceanNavy: "#0a1628",
  midOcean: "#0d2240",
  surfaceBlue: "#1a3a5c",
  foamWhite: "#e8f4f8",
  warmSand: "#f5e6c8",
  coral: "#e8826a",
  gold: "#d4a843",
  mutedTeal: "#4db8b0",
} as const;

// ── Fonts ────────────────────────────────────────────────────────────────────

const { fontFamily: cormorantFamily } = loadCormorant("normal", {
  weights: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: dmSansFamily } = loadDMSans("normal", {
  weights: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const fonts = {
  /** Cormorant Garamond — display / headings */
  display: cormorantFamily,
  /** DM Sans — UI / body text */
  ui: dmSansFamily,
} as const;
