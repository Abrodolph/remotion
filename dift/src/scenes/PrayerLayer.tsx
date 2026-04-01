import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
  Easing,
} from "remotion";
import { fonts } from "../tokens";

// ── Design tokens for this scene ─────────────────────────────────────────────

const GOLD = "#d4a843";
const GOLD_RGB = "212,168,67";
const LAVENDER = "#c4b5e8";
const DEEP_INDIGO = "#12082e";

// ── World map data (equirectangular 320×160 space) ───────────────────────────
// Simplified continent outlines — decorative, not geographic-precise

const CONTINENT_PATHS = [
  // North America
  "M 12,5 L 45,3 L 70,8 L 95,18 L 100,32 L 90,48 L 75,62 L 55,68 L 30,60 L 12,45 L 8,25 Z",
  // Central America
  "M 65,65 L 95,65 L 100,78 L 80,82 L 60,76 Z",
  // South America
  "M 60,82 L 95,80 L 110,95 L 108,120 L 95,138 L 75,142 L 58,128 L 50,108 L 52,90 Z",
  // Europe
  "M 148,5 L 174,3 L 182,12 L 178,28 L 165,36 L 150,34 L 144,22 Z",
  // Africa
  "M 148,42 L 188,40 L 200,54 L 202,88 L 192,118 L 172,130 L 152,130 L 142,114 L 138,88 L 140,60 Z",
  // Middle East / Arabia
  "M 188,40 L 216,38 L 222,52 L 206,60 L 190,56 Z",
  // Asia (main)
  "M 182,5 L 255,2 L 292,12 L 310,28 L 305,50 L 280,65 L 255,72 L 228,70 L 205,58 L 194,44 L 184,28 L 180,14 Z",
  // SE Asia
  "M 265,72 L 296,71 L 305,80 L 298,88 L 268,85 Z",
  // Japan
  "M 296,30 L 308,26 L 312,36 L 303,44 L 294,40 Z",
  // Australia
  "M 260,103 L 302,100 L 314,112 L 308,132 L 288,136 L 264,128 L 254,116 Z",
] as const;

// 12 city dots — (x, y) in 320×160 map space, label for accessibility
const CITIES = [
  { x: 94,  y: 44,  label: "New York"     },
  { x: 160, y: 34,  label: "London"       },
  { x: 165, y: 38,  label: "Paris"        },
  { x: 187, y: 53,  label: "Cairo"        },
  { x: 225, y: 63,  label: "Mumbai"       },
  { x: 163, y: 74,  label: "Lagos"        },
  { x: 193, y: 81,  label: "Nairobi"      },
  { x: 209, y: 58,  label: "Dubai"        },
  { x: 284, y: 48,  label: "Tokyo"        },
  { x: 118, y: 101, label: "São Paulo"    },
  { x: 294, y: 110, label: "Sydney"       },
  { x: 72,  y: 63,  label: "Mexico City"  },
] as const;

const ORBS = [
  { emoji: "🙏", label: "Hold this Prayer" },
  { emoji: "🕊️", label: "Send Peace"       },
  { emoji: "✨", label: "Reflect"           },
] as const;

const PARTICLE_COUNT = 30;

// ── Scene ─────────────────────────────────────────────────────────────────────

export const PrayerLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // ── Scene fade-in ──
  const sceneIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title: "A Prayer was received" — local 10 (comp 1090) ──
  const titleOp = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const titleY = interpolate(titleOp, [0, 1], [10, 0]);

  // ── Subtext — local 50 (comp 1130) ──
  const subtextOp = interpolate(frame, [50, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── World map + dots — local 80 (comp 1160) ──
  const mapOp = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // City dot springs — each staggered 8f from local 80
  const dotScales = CITIES.map((_, i) =>
    spring({
      frame: Math.max(0, frame - (80 + i * 8)),
      fps,
      config: { damping: 15, stiffness: 190 },
    })
  );

  // ── Action orbs — local 140 (comp 1220), stagger 8f ──
  const orbSprings = ORBS.map((_, i) =>
    spring({
      frame: Math.max(0, frame - (140 + i * 8)),
      fps,
      config: { damping: 200 },
    })
  );

  // ── Fade to black — local 180 (comp 1260) ──
  const fadeOut = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ opacity: sceneIn }}>
      {/* ── Deep indigo-to-black background ── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${DEEP_INDIGO} 0%, #050510 100%)`,
        }}
      />

      {/* ── Soft central radial glow (behind title) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 300,
            height: 220,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(${GOLD_RGB},0.07) 0%, transparent 70%)`,
          }}
        />
      </AbsoluteFill>

      {/* ── Gold particle system (30 particles rising slowly) ── */}
      <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
          const px     = random(`pray-px-${i}`) * width;
          const speed  = 0.14 + random(`pray-ps-${i}`) * 0.22;
          const phase  = random(`pray-pp-${i}`) * 600;
          const size   = 2 + random(`pray-pz-${i}`) * 1.5;
          const base   = 0.3 + random(`pray-po-${i}`) * 0.3;

          const traveled = ((frame + phase) * speed) % (height + 20);
          const py = height + 10 - traveled;

          const twinkle = 0.65 + Math.sin((frame * 0.12 + i * 1.7) * Math.PI) * 0.35;

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
                background: GOLD,
                opacity: base * twinkle,
                boxShadow: `0 0 ${size * 2.5}px ${size * 1.2}px rgba(${GOLD_RGB},0.18)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* ── Title ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 148,
        }}
      >
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            fontFamily: fonts.display,
            fontSize: 26,
            fontStyle: "italic",
            fontWeight: 300,
            color: GOLD,
            textAlign: "center",
            letterSpacing: "0.04em",
            textShadow: `0 0 24px rgba(${GOLD_RGB},0.5), 0 2px 8px rgba(0,0,0,0.4)`,
          }}
        >
          A Prayer was received
        </div>
      </AbsoluteFill>

      {/* ── Subtext ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 200,
        }}
      >
        <div
          style={{
            opacity: subtextOp,
            fontFamily: fonts.ui,
            fontSize: 14,
            fontWeight: 300,
            color: LAVENDER,
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        >
          Your words reached 12 souls across the world
        </div>
      </AbsoluteFill>

      {/* ── World map + city dots ── */}
      {mapOp > 0 && (
        <div
          style={{
            position: "absolute",
            top: 256,
            left: (width - 320) / 2,
            width: 320,
            height: 160,
            opacity: mapOp,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 320 160"
            width={320}
            height={160}
            xmlns="http://www.w3.org/2000/svg"
            overflow="visible"
          >
            {/* Equator guide line */}
            <line
              x1={0} y1={80} x2={320} y2={80}
              stroke={`rgba(${GOLD_RGB},0.06)`}
              strokeWidth={0.5}
              strokeDasharray="4 6"
            />
            {/* Tropics */}
            <line x1={0} y1={56} x2={320} y2={56} stroke={`rgba(${GOLD_RGB},0.04)`} strokeWidth={0.5} strokeDasharray="3 8" />
            <line x1={0} y1={104} x2={320} y2={104} stroke={`rgba(${GOLD_RGB},0.04)`} strokeWidth={0.5} strokeDasharray="3 8" />

            {/* Continent silhouettes */}
            {CONTINENT_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={`rgba(${GOLD_RGB},0.12)`}
                stroke={`rgba(${GOLD_RGB},0.08)`}
                strokeWidth={0.5}
              />
            ))}

            {/* City dots */}
            {CITIES.map((city, i) => {
              const scale = dotScales[i];
              if (scale <= 0) return null;

              // Continuous pulse ring (phase offset per city)
              const pulseCycle = ((frame - (80 + i * 8) + i * 13) % 48) / 48;
              const pulseR = (6 + pulseCycle * 11) * scale;
              const pulseOp = Math.max(0, 0.45 * (1 - pulseCycle)) * scale;

              return (
                <g key={city.label}>
                  {/* Pulse ring */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={pulseR}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={0.8}
                    opacity={pulseOp}
                  />
                  {/* Core dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={2.8 * scale}
                    fill={GOLD}
                    opacity={0.9 * scale}
                  />
                  {/* Inner highlight */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={1.2 * scale}
                    fill="white"
                    opacity={0.5 * scale}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* ── Action orbs (glassmorphism) ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "stretch",
          paddingBottom: 72,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ORBS.map((orb, i) => {
            const s = orbSprings[i];
            const orbOp = Math.min(s * 6, 1);
            const orbY = interpolate(s, [0, 1], [28, 0]);

            return (
              <div
                key={orb.label}
                style={{
                  height: 60,
                  borderRadius: 16,
                  // Glass base — works even without backdrop-filter
                  background: `rgba(${GOLD_RGB},0.07)`,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: `1px solid rgba(${GOLD_RGB},0.28)`,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 20,
                  paddingRight: 20,
                  gap: 14,
                  opacity: orbOp,
                  transform: `translateY(${orbY}px)`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(${GOLD_RGB},0.15)`,
                }}
              >
                <span style={{ fontSize: 24, lineHeight: 1 }}>{orb.emoji}</span>
                <span
                  style={{
                    fontFamily: fonts.ui,
                    fontSize: 15,
                    fontWeight: 300,
                    color: `rgba(255,255,255,0.82)`,
                    letterSpacing: "0.02em",
                  }}
                >
                  {orb.label}
                </span>
                {/* Subtle right arrow */}
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 14,
                    color: `rgba(${GOLD_RGB},0.5)`,
                  }}
                >
                  ›
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ── Fade to black ── */}
      {fadeOut > 0 && (
        <AbsoluteFill
          style={{ background: "#000000", opacity: fadeOut, pointerEvents: "none" }}
        />
      )}
    </AbsoluteFill>
  );
};
