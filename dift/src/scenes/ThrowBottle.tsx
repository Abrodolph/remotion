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
import { OceanBackground } from "../components/OceanBackground";

// ── Constants ────────────────────────────────────────────────────────────────

const MESSAGE =
  "I forgave someone today that I never thought I could. I hope whoever finds this is also carrying something heavy.";

const CATEGORIES = ["Confession", "Advice", "Dream", "Philosophy", "Prayer"];

// Bottle arc: start (center, button row) → impact on wave surface
const BOTTLE_START = { x: 195, y: 510 };
const BOTTLE_END = { x: 295, y: 560 };
const ARC_HEIGHT = 255;

// ── Scene ────────────────────────────────────────────────────────────────────

export const ThrowBottle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // ── Sub-moment A (local 0–120): Sheet slides up ──────────────────────────

  // Entrance spring: sheet slides from off-screen bottom to y=180
  const entranceSpring = spring({ frame, fps, config: { damping: 200 } });
  const entranceY = interpolate(entranceSpring, [0, 1], [height, 180]);

  // Exit spring: triggered at local frame 240, sheet slides back down
  const exitSpring = spring({
    frame: Math.max(0, frame - 240),
    fps,
    config: { damping: 200 },
  });
  const exitOffset = interpolate(exitSpring, [0, 1], [0, height - 180]);

  const sheetTop = entranceY + exitOffset;

  // Typewriter reveal: frame 20 → 112
  const charCount = Math.round(
    interpolate(frame, [20, 112], [0, MESSAGE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  // Blinking cursor (30-frame period) while typing
  const cursorOn = charCount < MESSAGE.length && charCount > 0;
  const cursorOpacity = cursorOn
    ? Math.floor(frame / 15) % 2 === 0
      ? 1
      : 0
    : 0;

  // ── Sub-moment B (local 120–210): Category chips ─────────────────────────

  const chipAnim = CATEGORIES.map((_, i) => {
    const start = 120 + i * 7;
    const p = interpolate(frame, [start, start + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
    return { opacity: p, x: interpolate(p, [0, 1], [55, 0]) };
  });

  // "Confession" selection pop at frame 148 (slight anticipation)
  const confessionSelected = frame >= 148;
  const confessionScale = interpolate(
    frame,
    [148, 155, 168],
    [1, 1.14, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Throw button fades in at frame 195
  const buttonOpacity = interpolate(frame, [195, 212], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Sub-moment C (local 210–300): Throw action ───────────────────────────

  // Button pulse at frame 220: scale 1 → 1.05 → 1
  const btnScale = interpolate(
    frame,
    [220, 228, 242],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottle arc: frame 234 → 284 (50 frames)
  const arcT = interpolate(frame, [234, 284], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const bottleX = BOTTLE_START.x + (BOTTLE_END.x - BOTTLE_START.x) * arcT;
  const bottleY =
    BOTTLE_START.y +
    (BOTTLE_END.y - BOTTLE_START.y) * arcT -
    ARC_HEIGHT * Math.sin(arcT * Math.PI);
  const bottleRotation = arcT * 360;
  const bottleFontSize = interpolate(arcT, [0, 1], [50, 30]);

  const bottleOpacity =
    frame < 284
      ? interpolate(frame, [234, 240], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [284, 290], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const bottleVisible = frame >= 234 && frame <= 292;

  // Splash ripple: starts at impact frame 284
  const rippleP = interpolate(frame, [284, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleR1 = rippleP * 52;
  const rippleR2 = rippleP * 32;
  const rippleOpacity = interpolate(rippleP, [0, 0.15, 1], [0, 0.85, 0]);

  // "Your bottle is drifting..." — fade in at frame 270
  const driftingOpacity = interpolate(frame, [270, 286], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* ── Ocean backdrop ── */}
      <OceanBackground />

      {/* ── Dark modal overlay ── */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.6)" }} />

      {/* ── Sheet modal ── */}
      <div
        style={{
          position: "absolute",
          top: sheetTop,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(245,230,200,0.97)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          display: "flex",
          flexDirection: "column",
          padding: "26px 24px 0",
          gap: 16,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            fontWeight: 600,
            color: colors.deepOceanNavy,
            letterSpacing: "0.01em",
          }}
        >
          Write your bottle
        </div>

        {/* Typewriter text area */}
        <div
          style={{
            fontFamily: fonts.ui,
            fontSize: 15,
            color: "#2a3a4a",
            lineHeight: 1.7,
            minHeight: 148,
          }}
        >
          {MESSAGE.substring(0, charCount)}
          {cursorOn && (
            <span
              style={{
                display: "inline-block",
                width: 1.5,
                height: "1em",
                background: colors.deepOceanNavy,
                marginLeft: 2,
                verticalAlign: "text-bottom",
                opacity: cursorOpacity,
              }}
            />
          )}
        </div>

        {/* Category chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflow: "hidden",
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const isSelected = confessionSelected && cat === "Confession";
            return (
              <div
                key={cat}
                style={{
                  opacity: chipAnim[i].opacity,
                  transform: `translateX(${chipAnim[i].x}px) scale(${isSelected ? confessionScale : 1})`,
                  background: isSelected ? colors.coral : "transparent",
                  border: isSelected
                    ? "none"
                    : "1px solid rgba(10,22,40,0.22)",
                  borderRadius: 50,
                  padding: "6px 13px",
                  fontFamily: fonts.ui,
                  fontSize: 13,
                  fontWeight: isSelected ? 500 : 400,
                  color: isSelected ? "#ffffff" : colors.deepOceanNavy,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {cat}
              </div>
            );
          })}
        </div>

        {/* Throw Bottle button */}
        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${btnScale})`,
            transformOrigin: "center",
            background: colors.coral,
            borderRadius: 50,
            height: 52,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.ui,
            fontSize: 16,
            fontWeight: 500,
            color: "#ffffff",
            letterSpacing: "0.01em",
          }}
        >
          Throw Bottle 🍾
        </div>
      </div>

      {/* ── Bottle in flight ── */}
      {bottleVisible && (
        <div
          style={{
            position: "absolute",
            left: bottleX - bottleFontSize / 2,
            top: bottleY - bottleFontSize / 2,
            fontSize: bottleFontSize,
            lineHeight: 1,
            opacity: bottleOpacity,
            transform: `rotate(${bottleRotation}deg)`,
            pointerEvents: "none",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          }}
        >
          🍾
        </div>
      )}

      {/* ── Splash ripple SVG ── */}
      {rippleP > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            style={{ position: "absolute", inset: 0 }}
          >
            <ellipse
              cx={BOTTLE_END.x}
              cy={BOTTLE_END.y}
              rx={rippleR1}
              ry={rippleR1 * 0.38}
              fill="none"
              stroke={colors.foamWhite}
              strokeWidth={2}
              opacity={rippleOpacity}
            />
            <ellipse
              cx={BOTTLE_END.x}
              cy={BOTTLE_END.y}
              rx={rippleR2}
              ry={rippleR2 * 0.38}
              fill="none"
              stroke={colors.foamWhite}
              strokeWidth={1.5}
              opacity={rippleOpacity * 0.55}
            />
          </svg>
        </AbsoluteFill>
      )}

      {/* ── "Your bottle is drifting..." ── */}
      {driftingOpacity > 0 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              opacity: driftingOpacity,
              fontFamily: fonts.display,
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: 300,
              color: colors.foamWhite,
              textAlign: "center",
              letterSpacing: "0.04em",
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            Your bottle is drifting...
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
