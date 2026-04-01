import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { colors, fonts } from "../tokens";

// ── Constants ────────────────────────────────────────────────────────────────

const MESSAGE =
  "I forgave someone today that I never thought I could. I hope whoever finds this is also carrying something heavy.";
const WORDS = MESSAGE.split(" ");
const REACTIONS = ["🙏", "✨", "🕊️", "💙"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Fade-in opacity from `startF`, over 14 frames, eased out. */
function fadeAt(frame: number, startF: number, dur = 14): number {
  return interpolate(frame, [startF, startF + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
}

/** Translate-up companion for fadeAt — element slides up 8px as it fades in. */
function slideAt(frame: number, startF: number): number {
  return interpolate(fadeAt(frame, startF), [0, 1], [8, 0]);
}

// ── Scene ─────────────────────────────────────────────────────────────────────

export const BottleReading: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Card entrance (frames 4–16) ──────────────────────────────────────────
  const cardEntrance = fadeAt(frame, 4, 12);
  const cardEntranceScale = interpolate(cardEntrance, [0, 1], [0.92, 1]);

  // ── Content reveals — staggered 8f apart, starting local frame 10 ────────
  //    comp 820 = local 10 (810 offset in Composition.tsx)
  const flagOp   = fadeAt(frame, 10);
  const statsOp  = fadeAt(frame, 18);
  const hrProg   = fadeAt(frame, 26); // also drives scaleX
  const msgWrap  = fadeAt(frame, 34);

  // ── Word-by-word message reveal (local 34 → 114) ─────────────────────────
  const wordCount = Math.round(
    interpolate(frame, [34, 114], [0, WORDS.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayText = WORDS.slice(0, wordCount).join(" ");

  // ── Reaction buttons — spring scale pop, stagger 8f (local 150+) ─────────
  //    comp 960 = local 150
  const reactionScales = REACTIONS.map((_, i) =>
    spring({
      frame: Math.max(0, frame - (150 + i * 8)),
      fps,
      config: { damping: 12, stiffness: 200 },
    })
  );

  // ── Action buttons slide up (local 190+) ─────────────────────────────────
  //    comp 1000 = local 190
  const actionSpring = spring({
    frame: Math.max(0, frame - 190),
    fps,
    config: { damping: 200 },
  });
  const actionY   = interpolate(actionSpring, [0, 1], [28, 0]);
  const actionOp  = interpolate(actionSpring, [0, 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Card exit — rotateY + fade (local 250–270) ────────────────────────────
  //    comp 1060 = local 250
  const flipT = interpolate(frame, [250, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const flipRotY  = flipT * 90;
  const flipOp    = interpolate(flipT, [0, 0.5, 1], [1, 1, 0]);

  const cardTransform = [
    `scale(${cardEntranceScale})`,
    "rotate(-1.5deg)",
    `rotateY(${flipRotY}deg)`,
  ].join(" ");

  const cardOpacity = cardEntrance * flipOp;

  return (
    <AbsoluteFill>
      {/* ── Sandy background ── */}
      <AbsoluteFill
        style={{ background: "linear-gradient(160deg, #f5e6c8 0%, #ede0c4 100%)" }}
      />

      {/* ── Paper noise texture (inline SVG, no data-URI encoding needed) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0 }}
        >
          <filter id="paper-noise-scene4">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#paper-noise-scene4)"
            opacity="0.055"
          />
        </svg>
      </AbsoluteFill>

      {/* ── Parchment card ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "900px",
        }}
      >
        <div
          style={{
            width: 326,
            background: "linear-gradient(155deg, #fef8ec 0%, #f7e8cc 100%)",
            borderRadius: 12,
            padding: "26px 24px",
            boxShadow: [
              "0 22px 64px rgba(0,0,0,0.15)",
              "0 4px 18px rgba(0,0,0,0.09)",
              "inset 0 0 0 1px rgba(0,0,0,0.05)",
            ].join(", "),
            transform: cardTransform,
            opacity: cardOpacity,
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
          }}
        >
          {/* ── 1. Flag + country ── */}
          <div
            style={{
              opacity: flagOp,
              transform: `translateY(${slideAt(frame, 10)}px)`,
              marginBottom: 10,
              fontFamily: fonts.ui,
              fontSize: 12,
              letterSpacing: "0.03em",
            }}
          >
            <span>🇧🇷{" "}</span>
            <span style={{ color: "#8a9ab2" }}>From </span>
            <span style={{ color: "#2a3a52", fontWeight: 500 }}>Brazil</span>
          </div>

          {/* ── 2. Journey stats row ── */}
          <div
            style={{
              opacity: statsOp,
              transform: `translateY(${slideAt(frame, 18)}px)`,
              marginBottom: 18,
              fontFamily: fonts.ui,
              fontSize: 11,
              color: "#6a7a92",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
            }}
          >
            ✈️{" "}
            <span style={{ color: colors.coral, fontWeight: 500 }}>9,200 km</span>
            {"   ·   "}
            🌊{" "}
            <span style={{ color: colors.coral, fontWeight: 500 }}>14 days</span>
            {"   ·   "}
            💬{" "}
            <span style={{ color: colors.coral, fontWeight: 500 }}>Confession</span>
          </div>

          {/* ── 3. Decorative horizontal rule ── */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(10,22,40,0.13) 20%, rgba(10,22,40,0.13) 80%, transparent 100%)",
              marginBottom: 18,
              opacity: hrProg,
              transform: `scaleX(${hrProg})`,
              transformOrigin: "left center",
            }}
          />

          {/* ── 4. Message text — word-by-word reveal ── */}
          <div
            style={{
              opacity: msgWrap,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 18,
                color: colors.deepOceanNavy,
                lineHeight: 1.72,
                letterSpacing: "0.01em",
                // Reserve full message height to prevent layout shift
                minHeight: 148,
              }}
            >
              {displayText}
            </div>
          </div>

          {/* ── 5. Reaction buttons ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginBottom: 16,
            }}
          >
            {REACTIONS.map((emoji, i) => {
              const scale = reactionScales[i];
              // Fast initial fade, natural spring scale
              const opacity = Math.min(scale * 6, 1);
              return (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(10,22,40,0.07)",
                    border: "1px solid rgba(10,22,40,0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    transform: `scale(${scale})`,
                    opacity,
                    transformOrigin: "center center",
                  }}
                >
                  {emoji}
                </div>
              );
            })}
          </div>

          {/* ── 6. Action buttons ── */}
          <div
            style={{
              display: "flex",
              gap: 10,
              opacity: actionOp,
              transform: `translateY(${actionY}px)`,
            }}
          >
            {/* Reply Privately */}
            <div
              style={{
                flex: 1,
                height: 46,
                borderRadius: 50,
                background: colors.coral,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.ui,
                fontSize: 13,
                fontWeight: 500,
                color: "#ffffff",
                letterSpacing: "0.01em",
              }}
            >
              Reply Privately
            </div>

            {/* Re-throw */}
            <div
              style={{
                flex: 1,
                height: 46,
                borderRadius: 50,
                background: colors.deepOceanNavy,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.ui,
                fontSize: 13,
                fontWeight: 400,
                color: colors.foamWhite,
                letterSpacing: "0.01em",
              }}
            >
              Re-throw 🌊
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
