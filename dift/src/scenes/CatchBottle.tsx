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

// ── Layout constants ─────────────────────────────────────────────────────────

// Center y of "Catch a Bottle" button (3 buttons, 80px from bottom, 52px tall, 12px gap)
// Bottom→up: My Bottles center=738, Catch center=674, Throw center=610
const CATCH_BTN_CY = 674;

const BOTTLE_CX = 195; // horizontal center
const BOTTLE_FINAL_Y = 350; // center y when fully risen

const PARCHMENT_TOP = BOTTLE_FINAL_Y + 37; // just below bottle emoji bottom
const PARCHMENT_H_MAX = 196;
const PARCHMENT_X = 44; // left/right margin

const MESSAGE =
  "I forgave someone today that I never thought I could. I hope whoever finds this is also carrying something heavy.";

// ── Scene ────────────────────────────────────────────────────────────────────

export const CatchBottle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // ── Global fade-in (covers cut from previous scene) ──────────────────────
  const sceneOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── MOMENT A (0–90): Home screen waiting state ───────────────────────────

  // Home UI fades out as Moment B begins
  const homeOpacity = interpolate(frame, [62, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Bottle bob on home screen
  const homeBobY = Math.sin((frame / 90) * Math.PI * 2) * 6;

  // Tap ripple expanding from Catch button center (frame 10–38)
  const tapT = interpolate(frame, [10, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tapR = tapT * 54;
  const tapOpacity = interpolate(tapT, [0, 0.14, 1], [0, 0.6, 0]);

  // Catch button glow builds from frame 8, pulses while visible
  const catchGlow = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const catchPulse = 0.62 + Math.sin(frame * 0.23) * 0.28;

  // ── MOMENT B (90–240): Discovery animation ───────────────────────────────

  // Dim overlay slides in at frame 82
  const overlayOpacity = interpolate(frame, [82, 102], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottle rises from below (spring, gentle wobble) ──
  const bottleRiseSpring = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 18, stiffness: 82, mass: 1.2 },
  });
  const bottleRiseY = interpolate(bottleRiseSpring, [0, 1], [height + 60, BOTTLE_FINAL_Y]);
  // ±5° rotation wobble
  const bottleWobble = Math.sin(frame * 0.28) * 5;
  const bottleEnterOpacity = interpolate(frame, [90, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Teal glow pulses
  const bottleGlow = 0.42 + Math.sin(frame * 0.19) * 0.3;

  // Scale pop when cork fires (frame 150)
  const bottlePopScale = interpolate(
    frame,
    [150, 157, 168],
    [1, 1.22, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Cork flies upward (frame 150–166) ──
  const corkT = interpolate(frame, [150, 166], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  // Cork starts at bottle neck, arcs up and off-screen
  const corkY = interpolate(corkT, [0, 1], [BOTTLE_FINAL_Y - 40, -52]);
  const corkX = BOTTLE_CX + Math.sin(corkT * Math.PI * 2.4) * 24;
  const corkOpacity = interpolate(
    frame,
    [150, 154, 161, 170],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Golden light burst (frame 150–170) ──
  const burstT = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstSize = burstT * 268;
  const burstOpacity = interpolate(burstT, [0, 0.12, 1], [0, 1, 0]);

  // ── Parchment unfurls (spring from frame 160) ──
  const parchSpring = spring({
    frame: Math.max(0, frame - 160),
    fps,
    config: { damping: 13, stiffness: 108 }, // slight bounce for unfurl feel
  });
  const parchHeight = interpolate(parchSpring, [0, 1], [0, PARCHMENT_H_MAX]);
  const parchVisible = frame >= 160;

  // ── Message text fades in (frame 180) ──
  const msgOpacity = interpolate(frame, [180, 198], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Bottom stat bar slides up (spring from frame 200) ──
  const barSpring = spring({
    frame: Math.max(0, frame - 200),
    fps,
    config: { damping: 200 },
  });
  const barTranslateY = interpolate(barSpring, [0, 1], [88, 0]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Ocean backdrop — more active waves for energetic feel */}
      <OceanBackground speedMultiplier={1.75} />

      {/* ═══════════════════════════════════════════════════════════════════
          MOMENT A: Home screen overlay (fades out at frame 62–88)
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: homeOpacity }}>
        {/* App name */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 64,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: "0.22em",
              color: colors.foamWhite,
            }}
          >
            DriftBottle
          </div>
        </AbsoluteFill>

        {/* Bobbing bottle */}
        <AbsoluteFill
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              fontSize: 84,
              transform: `translateY(${homeBobY}px)`,
              filter:
                "drop-shadow(0 6px 20px rgba(77,184,176,0.28)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
              lineHeight: 1,
            }}
          >
            🍾
          </div>
        </AbsoluteFill>

        {/* Bottom buttons */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "stretch",
            paddingBottom: 80,
            paddingLeft: 28,
            paddingRight: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Throw a Bottle */}
            <div
              style={{
                background: colors.coral,
                borderRadius: 50,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.ui,
                fontSize: 16,
                fontWeight: 500,
                color: "#ffffff",
              }}
            >
              🍾 Throw a Bottle
            </div>

            {/* Catch a Bottle — highlighted with glow */}
            <div
              style={{
                background: `rgba(77,184,176,${0.16 * catchGlow})`,
                border: `1.5px solid ${colors.mutedTeal}`,
                borderRadius: 50,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.ui,
                fontSize: 16,
                fontWeight: 500,
                color: colors.mutedTeal,
                boxShadow: catchGlow > 0
                  ? `0 0 ${24 * catchGlow}px ${10 * catchGlow}px rgba(77,184,176,${0.4 * catchGlow * catchPulse}), inset 0 0 ${8 * catchGlow}px rgba(77,184,176,${0.12 * catchGlow})`
                  : "none",
              }}
            >
              🎣 Catch a Bottle
            </div>

            {/* My Bottles */}
            <div
              style={{
                background: "transparent",
                borderRadius: 50,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.ui,
                fontSize: 16,
                fontWeight: 400,
                color: colors.foamWhite,
              }}
            >
              📜 My Bottles
            </div>
          </div>
        </AbsoluteFill>

        {/* Tap ripple SVG at Catch button center */}
        {tapT > 0 && (
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              width={width}
              height={height}
              style={{ position: "absolute", inset: 0 }}
            >
              <circle
                cx={width / 2}
                cy={CATCH_BTN_CY}
                r={tapR}
                fill="none"
                stroke={colors.mutedTeal}
                strokeWidth={2}
                opacity={tapOpacity}
              />
              <circle
                cx={width / 2}
                cy={CATCH_BTN_CY}
                r={tapR * 0.52}
                fill="none"
                stroke={colors.mutedTeal}
                strokeWidth={1.5}
                opacity={tapOpacity * 0.45}
              />
            </svg>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          MOMENT B: Discovery animation layers (build on top of ocean)
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Atmospheric dim overlay */}
      {overlayOpacity > 0 && (
        <AbsoluteFill
          style={{ background: `rgba(0,0,0,${overlayOpacity})`, pointerEvents: "none" }}
        />
      )}

      {/* Golden light burst — centered on bottle */}
      {burstOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: BOTTLE_CX - burstSize / 2,
            top: BOTTLE_FINAL_Y - burstSize / 2,
            width: burstSize,
            height: burstSize,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,218,60,0.95) 0%, rgba(212,168,67,0.55) 38%, transparent 68%)",
            opacity: burstOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Parchment — rendered before bottle so bottle sits above it */}
      {parchVisible && (
        <div
          style={{
            position: "absolute",
            top: PARCHMENT_TOP,
            left: PARCHMENT_X,
            right: PARCHMENT_X,
            height: parchHeight,
            overflow: "hidden",
            borderRadius: "0 0 12px 12px",
            background: "linear-gradient(180deg, #fdf3e3 0%, #f7e8cf 100%)",
            boxShadow:
              "0 10px 36px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          {/* Message text */}
          <div style={{ opacity: msgOpacity, padding: "16px 18px 12px" }}>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 14,
                fontStyle: "italic",
                color: "#2b1e0e",
                lineHeight: 1.76,
                letterSpacing: "0.01em",
              }}
            >
              {MESSAGE}
            </div>
            <div
              style={{
                marginTop: 11,
                fontFamily: fonts.ui,
                fontSize: 11,
                color: "#7a6040",
                letterSpacing: "0.05em",
              }}
            >
              — adrift in the Atlantic · found just now
            </div>
          </div>
        </div>
      )}

      {/* Bottle rising from ocean with glow + wobble */}
      {frame >= 88 && (
        <div
          style={{
            position: "absolute",
            left: BOTTLE_CX - 42,
            top: bottleRiseY - 42,
            fontSize: 84,
            lineHeight: 1,
            opacity: bottleEnterOpacity,
            transform: `rotate(${bottleWobble}deg) scale(${bottlePopScale})`,
            transformOrigin: "center center",
            filter: [
              `drop-shadow(0 0 ${13 + bottleGlow * 11}px rgba(77,184,176,${0.36 + bottleGlow * 0.3}))`,
              "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
            ].join(" "),
            pointerEvents: "none",
          }}
        >
          🍾
        </div>
      )}

      {/* Cork shooting upward */}
      {corkOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: corkX - 5,
            top: corkY - 9,
            width: 10,
            height: 18,
            borderRadius: "3px 3px 2px 2px",
            background: "linear-gradient(160deg, #c49040 0%, #7e5418 100%)",
            opacity: corkOpacity,
            boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Bottom stat bar */}
      {frame >= 200 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: `translateY(${barTranslateY}px)`,
          }}
        >
          <div
            style={{
              background: "rgba(6,15,34,0.95)",
              borderTop: `1px solid rgba(77,184,176,0.24)`,
              paddingTop: 14,
              paddingBottom: 24,
              paddingLeft: 24,
              paddingRight: 24,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div
              style={{
                fontFamily: fonts.ui,
                fontSize: 11,
                fontWeight: 500,
                color: colors.mutedTeal,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Bottle discovered
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 19,
                fontWeight: 400,
                color: colors.foamWhite,
                letterSpacing: "0.02em",
              }}
            >
              Travelled 8,200 km · 12 days drifting
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
