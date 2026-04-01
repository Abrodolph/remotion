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

// ── Card data ─────────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: "#321",
    category: "Confession",
    age: "5 days ago",
    status: "Opened in 🇪🇸 Spain · 6,400 km",
    accent: colors.coral,
    opacity: 1,
  },
  {
    id: "#298",
    category: "Dream",
    age: "14 days ago",
    status: "Still drifting... 🌊",
    accent: colors.mutedTeal,
    opacity: 0.78,
  },
  {
    id: "#271",
    category: "Prayer",
    age: "22 days ago",
    status: "Reached 12 people 🙏",
    accent: colors.gold,
    opacity: 1,
  },
] as const;

const CARD_H = 86;         // normal card height
const CARD_H_EXP = 212;   // expanded height for card 1 (includes map thumbnail)
const CARDS_TOP = 162;     // y offset where card list begins

// ── Scene ─────────────────────────────────────────────────────────────────────

export const MyBottles: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // ── Scene fade-in ──
  const sceneIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Header at local 10 (comp 1300) ──
  const headerOp = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Tabs at local 20 (comp 1310) ──
  const tabsOp = interpolate(frame, [20, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Cards slide in (local 40 / 52 / 64) — stagger 12f, damping:200 ──
  const cardSprings = [0, 1, 2].map((i) =>
    spring({
      frame: Math.max(0, frame - (40 + i * 12)),
      fps,
      config: { damping: 200 },
    })
  );

  // ── Card 1 expand at local 150 (comp 1440) ──
  const expandSpring = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 200 },
  });
  const card1Height = interpolate(expandSpring, [0, 1], [CARD_H, CARD_H_EXP]);

  // Glow pulse on card 1
  const glowIn = interpolate(frame, [150, 163], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowPulse = frame >= 150 ? 0.52 + Math.sin((frame - 150) * 0.21) * 0.3 : 0;

  // Tap ripple on card 1
  const tapT = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tapR = tapT * 44;
  const tapOp = interpolate(tapT, [0, 0.12, 1], [0, 0.38, 0]);

  // ── Toast at local 180 (comp 1470) ──
  const toastSpring = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: { damping: 200 },
  });
  const toastY = interpolate(toastSpring, [0, 1], [-52, 52]);
  const toastFadeOp = interpolate(toastSpring, [0, 0.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Outro at local 185–200 (comp 1475–1490) ──
  const myBottlesOp = interpolate(frame, [185, 200], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const overlayAlpha = interpolate(frame, [0, 185, 200], [0.52, 0.52, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const memoriesOp = interpolate(
    frame,
    [190, 196, 205, 210],
    [0, 0.72, 0.72, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const wordmarkOp = interpolate(frame, [195, 205], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  const slideX = (s: number) => interpolate(s, [0, 1], [64, 0]);
  const slideOp = (s: number) => Math.min(s * 4, 1);

  return (
    <AbsoluteFill style={{ opacity: sceneIn, overflow: "hidden" }}>
      {/* ── Ocean backdrop ── */}
      <OceanBackground />

      {/* ── Warm journalistic overlay ── */}
      <AbsoluteFill
        style={{ background: `rgba(6,12,26,${overlayAlpha})` }}
      />

      {/* ══════════════════════════════════════════
          MY BOTTLES UI (fades out at local 190)
          ══════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: myBottlesOp }}>

        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 24,
            right: 24,
            opacity: headerOp,
            transform: `translateY(${interpolate(headerOp, [0, 1], [8, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 24,
              fontWeight: 400,
              color: colors.foamWhite,
              letterSpacing: "0.02em",
            }}
          >
            My Bottles
          </div>
          <div
            style={{
              fontFamily: fonts.ui,
              fontSize: 13,
              color: colors.mutedTeal,
              marginTop: 4,
              letterSpacing: "0.03em",
            }}
          >
            Your ocean journal
          </div>
        </div>

        {/* Tab row */}
        <div
          style={{
            position: "absolute",
            top: 126,
            left: 24,
            right: 24,
            display: "flex",
            gap: 24,
            opacity: tabsOp,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontFamily: fonts.ui,
              fontSize: 13,
              fontWeight: 500,
              color: colors.foamWhite,
              paddingBottom: 10,
              borderBottom: `2px solid ${colors.coral}`,
              marginBottom: -1,
            }}
          >
            Sent
          </div>
          {(["Received", "Saved"] as const).map((label) => (
            <div
              key={label}
              style={{
                fontFamily: fonts.ui,
                fontSize: 13,
                color: colors.mutedTeal,
                opacity: 0.65,
                paddingBottom: 10,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* ── Card list ── */}
        <div
          style={{
            position: "absolute",
            top: CARDS_TOP,
            left: 24,
            right: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* ── Card 1 (expandable) ── */}
          <div
            style={{
              height: card1Height,
              overflow: "hidden",
              borderRadius: 12,
              background: "rgba(10,22,40,0.82)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              transform: `translateX(${slideX(cardSprings[0])}px)`,
              opacity: slideOp(cardSprings[0]),
              boxShadow:
                glowIn > 0
                  ? `0 0 ${22 * glowPulse * glowIn}px ${8 * glowIn}px rgba(232,130,106,${0.36 * glowIn}), 0 4px 20px rgba(0,0,0,0.3)`
                  : "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Coral accent strip */}
            <div
              style={{ width: 3, background: colors.coral, flexShrink: 0 }}
            />

            {/* Card body */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Normal content — fixed height */}
              <div
                style={{
                  height: CARD_H,
                  flexShrink: 0,
                  padding: "13px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.ui,
                    fontSize: 15,
                    fontWeight: 500,
                    color: colors.foamWhite,
                    letterSpacing: "0.01em",
                  }}
                >
                  🍾 Bottle {CARDS[0].id}
                </div>
                <div
                  style={{
                    fontFamily: fonts.ui,
                    fontSize: 12,
                    color: colors.mutedTeal,
                  }}
                >
                  {CARDS[0].category} · Thrown {CARDS[0].age}
                </div>
                <div
                  style={{
                    fontFamily: fonts.ui,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.56)",
                  }}
                >
                  {CARDS[0].status}
                </div>
              </div>

              {/* Map thumbnail — revealed by overflow hidden + card height spring */}
              <div
                style={{
                  margin: "0 14px 14px",
                  opacity: expandSpring,
                  height: 112,
                }}
              >
                {/* Mini-map SVG */}
                <div style={{ position: "relative", height: 90 }}>
                  <svg
                    viewBox="0 0 308 90"
                    width="100%"
                    height={90}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ borderRadius: 8, display: "block" }}
                  >
                    <defs>
                      <linearGradient
                        id="mmBg"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#091d38" />
                        <stop offset="100%" stopColor="#132c52" />
                      </linearGradient>
                    </defs>
                    <rect width={308} height={90} fill="url(#mmBg)" rx={8} />

                    {/* Grid */}
                    {[0.25, 0.5, 0.75].map((f) => (
                      <g key={f}>
                        <line
                          x1={0} y1={f * 90}
                          x2={308} y2={f * 90}
                          stroke="rgba(255,255,255,0.04)"
                          strokeWidth={0.5}
                        />
                        <line
                          x1={f * 308} y1={0}
                          x2={f * 308} y2={90}
                          stroke="rgba(255,255,255,0.04)"
                          strokeWidth={0.5}
                        />
                      </g>
                    ))}

                    {/* South America blob */}
                    <path
                      d="M 24,48 L 52,45 L 62,58 L 56,76 L 42,80 L 26,70 L 20,58 Z"
                      fill="rgba(255,255,255,0.09)"
                    />
                    {/* Europe blob */}
                    <path
                      d="M 188,14 L 210,12 L 218,22 L 213,34 L 196,36 L 184,28 Z"
                      fill="rgba(255,255,255,0.09)"
                    />
                    {/* Africa blob */}
                    <path
                      d="M 190,36 L 222,34 L 230,48 L 228,70 L 210,76 L 192,72 L 184,56 L 184,44 Z"
                      fill="rgba(255,255,255,0.06)"
                    />

                    {/* Route: Brazil → Spain (dotted arc) */}
                    <path
                      d="M 42,64 C 90,36 150,18 204,24"
                      stroke={colors.coral}
                      strokeWidth={1.5}
                      fill="none"
                      strokeDasharray="4 3"
                      opacity={0.85}
                    />

                    {/* Origin (Brazil) */}
                    <circle cx={42} cy={64} r={3.5} fill={colors.coral} />
                    <circle
                      cx={42}
                      cy={64}
                      r={7}
                      fill="none"
                      stroke={colors.coral}
                      strokeWidth={1}
                      opacity={0.35}
                    />

                    {/* Destination (Spain) */}
                    <circle cx={204} cy={24} r={3.5} fill={colors.coral} />
                    <circle
                      cx={204}
                      cy={24}
                      r={7}
                      fill="none"
                      stroke={colors.coral}
                      strokeWidth={1}
                      opacity={0.35}
                    />
                  </svg>

                  {/* Flag labels — HTML overlay */}
                  <div
                    style={{
                      position: "absolute",
                      left: 20,
                      top: 70,
                      fontFamily: fonts.ui,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.48)",
                    }}
                  >
                    🇧🇷 Origin
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      right: 72,
                      top: 10,
                      fontFamily: fonts.ui,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.48)",
                    }}
                  >
                    🇪🇸 Spain
                  </div>
                </div>

                {/* Stats row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.ui,
                      fontSize: 11,
                      color: colors.mutedTeal,
                      letterSpacing: "0.04em",
                    }}
                  >
                    6,400 km travelled
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.ui,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    5 days at sea
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 2 (teal, drifting) ── */}
          <div
            style={{
              borderRadius: 12,
              background: "rgba(10,22,40,0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              overflow: "hidden",
              transform: `translateX(${slideX(cardSprings[1])}px)`,
              opacity: slideOp(cardSprings[1]) * CARDS[1].opacity,
            }}
          >
            <div
              style={{ width: 3, background: colors.mutedTeal, flexShrink: 0 }}
            />
            <div
              style={{
                flex: 1,
                padding: "13px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: CARD_H,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.ui,
                  fontSize: 15,
                  fontWeight: 400,
                  color: "rgba(232,244,248,0.78)",
                }}
              >
                🍾 Bottle {CARDS[1].id}
              </div>
              <div
                style={{
                  fontFamily: fonts.ui,
                  fontSize: 12,
                  color: colors.mutedTeal,
                }}
              >
                {CARDS[1].category} · Thrown {CARDS[1].age}
              </div>
              <div
                style={{
                  fontFamily: fonts.ui,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                {CARDS[1].status}
              </div>
            </div>
          </div>

          {/* ── Card 3 (gold, prayer) ── */}
          <div
            style={{
              borderRadius: 12,
              background: "rgba(10,22,40,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              overflow: "hidden",
              transform: `translateX(${slideX(cardSprings[2])}px)`,
              opacity: slideOp(cardSprings[2]),
            }}
          >
            <div
              style={{ width: 3, background: colors.gold, flexShrink: 0 }}
            />
            <div
              style={{
                flex: 1,
                padding: "13px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: CARD_H,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.ui,
                  fontSize: 15,
                  fontWeight: 400,
                  color: colors.foamWhite,
                }}
              >
                🍾 Bottle {CARDS[2].id}
              </div>
              <div
                style={{
                  fontFamily: fonts.ui,
                  fontSize: 12,
                  color: colors.mutedTeal,
                }}
              >
                {CARDS[2].category} · Thrown {CARDS[2].age}
              </div>
              <div
                style={{
                  fontFamily: fonts.ui,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.58)",
                }}
              >
                {CARDS[2].status}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Tap ripple on Card 1 ── */}
      {tapOp > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            style={{ position: "absolute", inset: 0 }}
          >
            <circle
              cx={width / 2}
              cy={CARDS_TOP + CARD_H / 2}
              r={tapR}
              fill="none"
              stroke={colors.coral}
              strokeWidth={1.5}
              opacity={tapOp}
            />
            <circle
              cx={width / 2}
              cy={CARDS_TOP + CARD_H / 2}
              r={tapR * 0.55}
              fill="none"
              stroke={colors.coral}
              strokeWidth={1}
              opacity={tapOp * 0.4}
            />
          </svg>
        </AbsoluteFill>
      )}

      {/* ── Toast notification ── */}
      {toastFadeOp > 0 && (
        <div
          style={{
            position: "absolute",
            top: toastY,
            left: 24,
            right: 24,
            opacity: toastFadeOp * myBottlesOp,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: colors.coral,
              borderRadius: 50,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 18,
              paddingRight: 18,
              fontFamily: fonts.ui,
              fontSize: 13,
              fontWeight: 500,
              color: "#ffffff",
              letterSpacing: "0.01em",
              boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
              gap: 6,
            }}
          >
            🍾 Someone opened your bottle in Japan!
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          OUTRO: memories + wordmark over ocean
          ══════════════════════════════════════════ */}

      {/* Memory orbs — brief appearance as screen clears */}
      {memoriesOp > 0 && (
        <AbsoluteFill style={{ opacity: memoriesOp, pointerEvents: "none" }}>
          {(
            [
              { emoji: "🍾", x: 80,  y: 408, hint: "Thrown"  },
              { emoji: "📜", x: 195, y: 360, hint: "Read"    },
              { emoji: "🙏", x: 310, y: 418, hint: "Prayed"  },
            ] as const
          ).map((m) => (
            <div
              key={m.hint}
              style={{
                position: "absolute",
                left: m.x - 27,
                top: m.y - 27,
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid rgba(232,244,248,0.18)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                boxShadow: "0 0 18px rgba(77,184,176,0.22)",
              }}
            >
              {m.emoji}
            </div>
          ))}
        </AbsoluteFill>
      )}

      {/* DriftBottle wordmark — final frame */}
      {wordmarkOp > 0 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              opacity: wordmarkOp,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 34,
                fontWeight: 300,
                letterSpacing: "0.28em",
                color: colors.foamWhite,
                textShadow: `0 0 36px rgba(77,184,176,0.38), 0 2px 10px rgba(0,0,0,0.55)`,
              }}
            >
              DriftBottle
            </div>
            <div
              style={{
                fontFamily: fonts.ui,
                fontSize: 12,
                letterSpacing: "0.2em",
                color: colors.mutedTeal,
                opacity: 0.7,
                textTransform: "uppercase",
              }}
            >
              Every message finds its shore
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
