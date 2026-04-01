import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
  Easing,
} from "remotion";
import { colors, fonts } from "../tokens";
import { OceanBackground } from "../components/OceanBackground";

const PARTICLE_COUNT = 18;

export const OceanHome: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ── Global fade-out (frame 250 → 270) ──
  const fadeOut = interpolate(frame, [250, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // ── Header fade-in at frame 10 ──
  const titleOpacity = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Stats fade-in at frame 20 ──
  const statsOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Bottle bob – sin, period 90 frames, ±6 px ──
  const bottleBobY = Math.sin((frame / 90) * Math.PI * 2) * 6;

  // ── Button animations: fade + slide-up, start frame 40, stagger 8f ──
  const btnAnim = [0, 1, 2].map((i) => {
    const start = 40 + i * 8;
    const progress = interpolate(frame, [start, start + 22], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
    return {
      opacity: progress,
      y: interpolate(progress, [0, 1], [20, 0]),
    };
  });

  return (
    <AbsoluteFill>
      <OceanBackground />

      {/* ── Bioluminescent particles ── */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
          const px = random(`px-${i}`) * width;
          const speed = 0.22 + random(`ps-${i}`) * 0.45;
          const phase = random(`pp-${i}`) * 400;
          const size = 2 + random(`pz-${i}`) * 3.5;

          const zoneTop = 0.58 * height;
          const zoneH = height - zoneTop + 30;
          const traveled = ((frame + phase) * speed) % zoneH;
          const py = height + 15 - traveled;

          const proximityFade = interpolate(py, [zoneTop, zoneTop + 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pulse = 0.45 + Math.sin((frame * 0.12 + i * 1.3) * Math.PI) * 0.25;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: px - size / 2,
                top: py - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                background: "radial-gradient(circle, #ffffff 0%, #4db8b0 55%, transparent 100%)",
                opacity: pulse * proximityFade,
                boxShadow: `0 0 ${size * 3}px ${size * 1.5}px rgba(77,184,176,0.35)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* ── App name + stats ── */}
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
            opacity: titleOpacity,
            fontFamily: fonts.display,
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: "0.22em",
            color: colors.foamWhite,
            textAlign: "center",
          }}
        >
          DriftBottle
        </div>

        <div
          style={{
            opacity: statsOpacity,
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div style={{ fontFamily: fonts.ui, fontSize: 13, color: colors.mutedTeal, letterSpacing: "0.04em" }}>
            12,847 bottles drifting
          </div>
          <div style={{ fontFamily: fonts.ui, fontSize: 13, color: colors.mutedTeal, letterSpacing: "0.04em" }}>
            Across 43 countries
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Glass bottle, centered, bobbing ── */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontSize: 84,
            transform: `translateY(${bottleBobY}px)`,
            filter: "drop-shadow(0 6px 20px rgba(77,184,176,0.28)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
            lineHeight: 1,
          }}
        >
          🍾
        </div>
      </AbsoluteFill>

      {/* ── Pill buttons ── */}
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
          <div
            style={{
              opacity: btnAnim[0].opacity,
              transform: `translateY(${btnAnim[0].y}px)`,
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
              letterSpacing: "0.01em",
            }}
          >
            🍾 Throw a Bottle
          </div>

          <div
            style={{
              opacity: btnAnim[1].opacity,
              transform: `translateY(${btnAnim[1].y}px)`,
              background: "transparent",
              border: `1.5px solid ${colors.mutedTeal}`,
              borderRadius: 50,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.ui,
              fontSize: 16,
              fontWeight: 400,
              color: colors.mutedTeal,
              letterSpacing: "0.01em",
            }}
          >
            🎣 Catch a Bottle
          </div>

          <div
            style={{
              opacity: btnAnim[2].opacity,
              transform: `translateY(${btnAnim[2].y}px)`,
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
              letterSpacing: "0.01em",
            }}
          >
            📜 My Bottles
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Fade-to-black overlay ── */}
      {fadeOut > 0 && (
        <AbsoluteFill style={{ background: "#000000", opacity: fadeOut }} />
      )}
    </AbsoluteFill>
  );
};
