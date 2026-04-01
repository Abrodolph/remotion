import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Series,
} from "remotion";

// ─── Colors ────────────────────────────────────────────────────────────────────
const C = {
  // Dark (hook/channel/analytics/cta scenes)
  dark: "#06101f",
  darkCard: "#0c1a30",
  darkBorder: "#1a3353",
  darkText: "#e2e8f0",
  darkSub: "#94a3b8",
  // App light theme
  appBg: "#f1f5f9",
  appCard: "#ffffff",
  appBorder: "#e2e8f0",
  appText: "#0f172a",
  appSub: "#475569",
  appMuted: "#94a3b8",
  appSidebar: "#0f172a",
  appSidebarTxt: "#94a3b8",
  // Brand & sentiment
  blue: "#2563eb",
  blueBg: "#dbeafe",
  green: "#16a34a",
  greenBg: "#dcfce7",
  red: "#dc2626",
  redBg: "#fee2e2",
  purple: "#7c3aed",
  purpleBg: "#ede9fe",
  amber: "#d97706",
  amberBg: "#fef3c7",
  teal: "#0891b2",
  tealBg: "#cffafe",
};

// ─── Animation helpers ────────────────────────────────────────────────────────
const fi = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const fo = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Opacity for a scene: fade in over first 20 frames, fade out over last 20 frames.
const sceneFade = (f: number, dur: number) => Math.min(fi(f, 0, 20), fo(f, dur - 20, dur));

// ─── Presscut logo ────────────────────────────────────────────────────────────
const PressecutLogo: React.FC<{ size?: number; light?: boolean }> = ({
  size = 32,
  light = false,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.26),
        background: C.blue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* Scissors icon — a nod to press clipping */}
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 18 18"
        fill="none"
      >
        <circle cx="5.5" cy="5.5" r="2.8" stroke="white" strokeWidth="1.7" />
        <circle cx="5.5" cy="12.5" r="2.8" stroke="white" strokeWidth="1.7" />
        <line
          x1="8"
          y1="4.4"
          x2="16"
          y2="8"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="13.6"
          x2="16"
          y2="10"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <span
      style={{
        color: light ? "#ffffff" : C.appText,
        fontSize: Math.round(size * 0.7),
        fontFamily: "sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      }}
    >
      presscut
    </span>
  </div>
);

// ─── Sentiment badge ──────────────────────────────────────────────────────────
const SentimentBadge: React.FC<{
  sentiment: "positive" | "neutral" | "negative";
}> = ({ sentiment }) => {
  const map = {
    positive: { label: "Positive", bg: C.greenBg, color: C.green },
    neutral: { label: "Neutral", bg: C.purpleBg, color: C.purple },
    negative: { label: "Negative", bg: C.redBg, color: C.red },
  };
  const s = map[sentiment];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontFamily: "sans-serif",
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 99,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
};

// ─── Channel tag ──────────────────────────────────────────────────────────────
const ChannelTag: React.FC<{ type: string }> = ({ type }) => {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    web:    { label: "WEB",    color: C.blue,   bg: C.blueBg   },
    social: { label: "SOC",   color: C.purple, bg: C.purpleBg },
    print:  { label: "PRINT", color: C.amber,  bg: C.amberBg  },
    tv:     { label: "TV",    color: C.red,    bg: C.redBg    },
    radio:  { label: "RADIO", color: C.teal,   bg: C.tealBg   },
  };
  const c = map[type] ?? map.web;
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: "monospace",
        fontWeight: 700,
        color: c.color,
        background: c.bg,
        padding: "2px 7px",
        borderRadius: 4,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {c.label}
    </span>
  );
};

// ─── Mention row (staggered entrance) ────────────────────────────────────────
type Mention = {
  source: string;
  type: string;
  text: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  reach: string;
};

const MentionRow: React.FC<{ mention: Mention; delay: number }> = ({
  mention,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const opacity = interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(p, [0, 1], [-28, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 16px",
        borderBottom: `1px solid ${C.appBorder}`,
      }}
    >
      <ChannelTag type={mention.type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: C.appText,
            marginBottom: 2,
          }}
        >
          {mention.source}
        </div>
        <div
          style={{
            fontSize: 11,
            fontFamily: "sans-serif",
            color: C.appSub,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {mention.text}
        </div>
      </div>
      <SentimentBadge sentiment={mention.sentiment} />
      <div
        style={{
          fontSize: 11,
          fontFamily: "sans-serif",
          color: C.appMuted,
          textAlign: "right",
          flexShrink: 0,
          lineHeight: 1.5,
        }}
      >
        <div>{mention.reach}</div>
        <div>{mention.time}</div>
      </div>
    </div>
  );
};

// Stat card
const StatCard: React.FC<{
  label: string;
  value: string;
  delta: string;
  accent: string;
  delay: number;
}> = ({ label, value, delta, accent, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 160 } });
  const opacity = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(p, [0, 1], [18, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        flex: 1,
        background: C.appCard,
        border: `1px solid ${C.appBorder}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 10,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontFamily: "sans-serif",
          color: C.appMuted,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontFamily: "sans-serif",
          fontWeight: 800,
          color: C.appText,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, fontFamily: "sans-serif", color: accent, fontWeight: 600 }}>
        {delta}
      </div>
    </div>
  );
};

// ─── Scene 1: Hook ────────────────────────────────────────────────────────────
const S1_DUR = 180;
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneFade(frame, S1_DUR);

  const logoP = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const logoScale = interpolate(logoP, [0, 1], [0.6, 1]);
  const logoOpacity = fi(frame, 0, 18);

  const h1Opacity = fi(frame, 22, 50);
  const h1Y = interpolate(h1Opacity, [0, 1], [40, 0]);

  const h2Opacity = fi(frame, 55, 85);
  const h2Y = interpolate(h2Opacity, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 40%, #0d2047 0%, ${C.dark} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          marginBottom: 48,
        }}
      >
        <PressecutLogo size={44} light />
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: h1Opacity,
          transform: `translateY(${h1Y}px)`,
          color: "#ffffff",
          fontSize: 62,
          fontFamily: "sans-serif",
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.12,
          letterSpacing: "-0.025em",
          maxWidth: 900,
        }}
      >
        Know the moment
        <br />
        your brand is mentioned.
      </div>

      {/* Subhead */}
      <div
        style={{
          opacity: h2Opacity,
          transform: `translateY(${h2Y}px)`,
          color: C.darkSub,
          fontSize: 22,
          fontFamily: "sans-serif",
          fontWeight: 400,
          marginTop: 22,
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        Every channel. Every source. In real time.
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Dashboard ───────────────────────────────────────────────────────
const S2_DUR = 420;
const MENTIONS_DATA: Mention[] = [
  {
    source: "jutarnji.hr",
    type: "web",
    text: '"Adriatica reports record Q3 results, surpassing analyst expectations by 18%"',
    time: "2h ago",
    sentiment: "positive",
    reach: "245K reach",
  },
  {
    source: "Instagram · @adriatica_hr",
    type: "social",
    text: "Our new product launch has arrived — and the feedback is incredible 🎉",
    time: "3h ago",
    sentiment: "positive",
    reach: "18.2K likes",
  },
  {
    source: "Večernji list",
    type: "print",
    text: '"Industry leaders gather at annual summit — Adriatica takes centre stage"',
    time: "5h ago",
    sentiment: "neutral",
    reach: "180K readers",
  },
  {
    source: "HRT1 · Evening News",
    type: "tv",
    text: "Adriatica CEO outlines ambitious expansion plans for the coming year",
    time: "6h ago",
    sentiment: "positive",
    reach: "420K viewers",
  },
];

const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneFade(frame, S2_DUR);

  const appP = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const appScale = interpolate(appP, [0, 1], [0.97, 1]);

  // Real-time alert toast appears at frame 230
  const toastDelay = 230;
  const toastP = spring({
    frame: frame - toastDelay,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const toastOpacity = frame >= toastDelay
    ? interpolate(toastP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" })
    : 0;
  const toastY = interpolate(toastP, [0, 1], [-60, 0]);

  const SIDEBAR_W = 196;
  const NAV_H = 54;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${appScale})`,
        background: C.appBg,
        fontFamily: "sans-serif",
      }}
    >
      {/* ── Top nav ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: NAV_H,
          background: C.appCard,
          borderBottom: `1px solid ${C.appBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          zIndex: 20,
        }}
      >
        <PressecutLogo size={26} />
        <div style={{ flex: 1 }} />
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: C.appBg,
            border: `1px solid ${C.appBorder}`,
            borderRadius: 7,
            padding: "5px 12px",
            width: 210,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke={C.appMuted} strokeWidth="1.5" />
            <line
              x1="8.7"
              y1="8.7"
              x2="12"
              y2="12"
              stroke={C.appMuted}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span style={{ fontSize: 12, color: C.appMuted }}>Search mentions…</span>
        </div>
        {/* Bell */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 7,
              background: C.appBg,
              border: `1px solid ${C.appBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1.5A4.5 4.5 0 0 1 12 6v2.5l1.5 2h-12L3 8.5V6A4.5 4.5 0 0 1 7.5 1.5z"
                stroke={C.appSub}
                strokeWidth="1.4"
              />
              <path
                d="M6 12.5a1.5 1.5 0 0 0 3 0"
                stroke={C.appSub}
                strokeWidth="1.4"
              />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: C.red,
              color: "white",
              fontSize: 9,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </div>
        </div>
        {/* Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: C.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          MK
        </div>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: NAV_H,
          left: 0,
          width: SIDEBAR_W,
          bottom: 0,
          background: C.appSidebar,
          padding: "18px 0",
        }}
      >
        {[
          { icon: "⊞", label: "Dashboard", active: true },
          { icon: "◉", label: "Mentions",  active: false },
          { icon: "⎋", label: "Social",    active: false },
          { icon: "▦", label: "TV & Radio", active: false },
          { icon: "↗", label: "Analytics", active: false },
          { icon: "⊟", label: "Reports",   active: false },
          { icon: "⚑", label: "Alerts",    active: false },
        ].map(({ icon, label, active }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "9px 18px",
              background: active ? "rgba(37,99,235,0.14)" : "transparent",
              borderRight: active
                ? `3px solid ${C.blue}`
                : "3px solid transparent",
            }}
          >
            <span
              style={{
                fontSize: 15,
                color: active ? "#60a5fa" : C.appSidebarTxt,
              }}
            >
              {icon}
            </span>
            <span
              style={{
                fontSize: 13,
                color: active ? "#ffffff" : C.appSidebarTxt,
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: NAV_H,
          left: SIDEBAR_W,
          right: 0,
          bottom: 0,
          padding: "20px 24px",
          overflow: "hidden",
        }}
      >
        {/* Page header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: C.appText,
                marginBottom: 2,
              }}
            >
              Good morning, Marko
            </div>
            <div style={{ fontSize: 12, color: C.appMuted }}>
              Monday, January 20 · Your media overview for the last 7 days
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.appMuted,
              background: C.appCard,
              border: `1px solid ${C.appBorder}`,
              padding: "7px 12px",
              borderRadius: 7,
            }}
          >
            Last 7 days ▾
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <StatCard
            label="Total Mentions"
            value="1,247"
            delta="↑ 18% vs last week"
            accent={C.blue}
            delay={10}
          />
          <StatCard
            label="Total Reach"
            value="4.2M"
            delta="↑ 31% vs last week"
            accent={C.green}
            delay={28}
          />
          <StatCard
            label="Positive Sentiment"
            value="73%"
            delta="↑ 5 pts vs last week"
            accent={C.green}
            delay={46}
          />
        </div>

        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{ fontSize: 14, fontWeight: 700, color: C.appText }}
            >
              Recent Mentions
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.green,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: C.green,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>
          <span
            style={{ fontSize: 12, color: C.blue, fontWeight: 600 }}
          >
            View all →
          </span>
        </div>

        {/* Mentions list card */}
        <div
          style={{
            background: C.appCard,
            borderRadius: 10,
            border: `1px solid ${C.appBorder}`,
            overflow: "hidden",
          }}
        >
          {MENTIONS_DATA.map((m, i) => (
            <MentionRow key={m.source} mention={m} delay={65 + i * 28} />
          ))}
        </div>
      </div>

      {/* ── Real-time alert toast ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: NAV_H + 12,
          right: 20,
          opacity: toastOpacity,
          transform: `translateY(${toastY}px)`,
          background: "#0c1a30",
          border: `1px solid ${C.blue}`,
          borderRadius: 10,
          padding: "13px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          width: 300,
          zIndex: 50,
          boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            marginTop: 3,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.blue,
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 4,
            }}
          >
            New mention · tportal.hr
          </div>
          <div style={{ fontSize: 11, color: C.darkSub }}>
            "Adriatica pokreće novu poslovnu…"
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.blue,
              fontWeight: 600,
              marginTop: 6,
            }}
          >
            Web · Just now
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Channels ────────────────────────────────────────────────────────
const S3_DUR = 270;
const CHANNELS = [
  {
    name: "Online Media",
    stat: "2,000+",
    detail: "portals & news sites",
    color: C.blue,
    bg: C.blueBg,
    icon: "🌐",
  },
  {
    name: "Print",
    stat: "120+",
    detail: "newspapers & magazines",
    color: C.amber,
    bg: C.amberBg,
    icon: "📰",
  },
  {
    name: "Social Media",
    stat: "5 platforms",
    detail: "FB · IG · TikTok · X · Reddit",
    color: C.purple,
    bg: C.purpleBg,
    icon: "📱",
  },
  {
    name: "Television",
    stat: "All national",
    detail: "HRT · RTL · Nova TV",
    color: C.red,
    bg: C.redBg,
    icon: "📺",
  },
  {
    name: "Radio",
    stat: "40+ stations",
    detail: "All major broadcasters",
    color: C.teal,
    bg: C.tealBg,
    icon: "📻",
  },
];

const ChannelsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneFade(frame, S3_DUR);

  const titleOpacity = fi(frame, 5, 30);
  const titleY = interpolate(titleOpacity, [0, 1], [24, 0]);

  const volP = spring({ frame: frame - 35, fps, config: { damping: 20 } });
  const volOpacity = interpolate(volP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 35%, #0d2047 0%, ${C.dark} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: C.blue,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Media Coverage
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          color: "#ffffff",
          fontSize: 44,
          fontFamily: "sans-serif",
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: "-0.02em",
          marginBottom: 14,
        }}
      >
        Every media channel. One platform.
      </div>

      {/* Volume stat */}
      <div
        style={{
          opacity: volOpacity,
          color: C.darkSub,
          fontSize: 16,
          fontFamily: "sans-serif",
          marginBottom: 44,
          textAlign: "center",
        }}
      >
        Processing{" "}
        <span style={{ color: "#ffffff", fontWeight: 700 }}>2,000,000+</span>{" "}
        posts and clippings every day
      </div>

      {/* Channel cards */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {CHANNELS.map((ch, i) => {
          const p = spring({
            frame: frame - (50 + i * 22),
            fps,
            config: { damping: 18, stiffness: 150 },
          });
          const cardOpacity = interpolate(p, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const cardY = interpolate(p, [0, 1], [30, 0]);

          return (
            <div
              key={ch.name}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                background: C.darkCard,
                border: `1px solid ${C.darkBorder}`,
                borderTop: `3px solid ${ch.color}`,
                borderRadius: 12,
                padding: "20px 18px",
                width: 190,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 28 }}>{ch.icon}</div>
              <div
                style={{
                  fontSize: 14,
                  fontFamily: "sans-serif",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {ch.name}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontFamily: "sans-serif",
                  fontWeight: 800,
                  color: ch.color,
                  lineHeight: 1,
                }}
              >
                {ch.stat}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "sans-serif",
                  color: C.darkSub,
                }}
              >
                {ch.detail}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Analytics ───────────────────────────────────────────────────────
const S4_DUR = 270;
const SENTIMENT = [
  { label: "Positive", pct: 73, color: C.green },
  { label: "Neutral",  pct: 18, color: C.purple },
  { label: "Negative", pct: 9,  color: C.red },
];
const DAILY_MENTIONS = [65, 82, 71, 95, 118, 48, 42];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MAX_MENTIONS = Math.max(...DAILY_MENTIONS);
const BAR_CHART_H = 120;

const AnalyticsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneFade(frame, S4_DUR);

  const titleOpacity = fi(frame, 5, 30);
  const titleY = interpolate(titleOpacity, [0, 1], [24, 0]);

  // Sentiment bars animate in
  const sentP = spring({ frame: frame - 40, fps, config: { damping: 20 } });

  // Coverage bars animate in
  const barP = spring({ frame: frame - 70, fps, config: { damping: 22, stiffness: 140 } });

  // AI insight card
  const insightOpacity = fi(frame, 150, 175);
  const insightY = interpolate(insightOpacity, [0, 1], [16, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 35%, #0d2047 0%, ${C.dark} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: C.blue,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          AI Analytics
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          color: "#ffffff",
          fontSize: 44,
          fontFamily: "sans-serif",
          fontWeight: 800,
          textAlign: "center",
          letterSpacing: "-0.02em",
          marginBottom: 44,
        }}
      >
        Understand your media coverage.
      </div>

      {/* Two-column charts */}
      <div
        style={{
          display: "flex",
          gap: 40,
          width: "100%",
          maxWidth: 960,
          alignItems: "flex-start",
        }}
      >
        {/* Left: Sentiment breakdown */}
        <div
          style={{
            flex: 1,
            background: C.darkCard,
            border: `1px solid ${C.darkBorder}`,
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: C.darkText,
              marginBottom: 20,
            }}
          >
            Sentiment breakdown
          </div>
          {SENTIMENT.map(({ label, pct, color }) => {
            const barW = interpolate(sentP, [0, 1], [0, pct], {
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={label}
                style={{ marginBottom: 14 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "sans-serif",
                      color: C.darkSub,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "sans-serif",
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: C.darkBorder,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${barW}%`,
                      background: color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Coverage over time */}
        <div
          style={{
            flex: 1,
            background: C.darkCard,
            border: `1px solid ${C.darkBorder}`,
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: C.darkText,
              marginBottom: 20,
            }}
          >
            Coverage volume · last 7 days
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: BAR_CHART_H,
            }}
          >
            {DAILY_MENTIONS.map((v, i) => {
              const barH = interpolate(
                barP,
                [0, 1],
                [0, (v / MAX_MENTIONS) * BAR_CHART_H],
                { extrapolateRight: "clamp" }
              );
              const isMax = v === MAX_MENTIONS;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: barH,
                      background: isMax ? C.blue : "#1a3353",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      color: C.darkSub,
                    }}
                  >
                    {DAYS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insight card */}
      <div
        style={{
          opacity: insightOpacity,
          transform: `translateY(${insightY}px)`,
          marginTop: 24,
          background: "rgba(37,99,235,0.12)",
          border: `1px solid rgba(37,99,235,0.35)`,
          borderRadius: 10,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 960,
          width: "100%",
        }}
      >
        <span style={{ fontSize: 18 }}>✦</span>
        <span
          style={{
            fontSize: 13,
            fontFamily: "sans-serif",
            color: "#93c5fd",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#ffffff" }}>AI Insight:</strong> Positive
          coverage increased{" "}
          <strong style={{ color: C.green }}>23%</strong> this week, driven by
          Thursday's product launch coverage on 14 portals.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA ─────────────────────────────────────────────────────────────
const S5_DUR = 270;
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fi(frame, 0, 20); // no fade-out; ends the video

  const logoP = spring({ frame: frame - 5, fps, config: { damping: 16, stiffness: 140 } });
  const logoScale = interpolate(logoP, [0, 1], [0.7, 1]);
  const logoOpacity = fi(frame, 5, 25);

  const h1Opacity = fi(frame, 28, 55);
  const h1Y = interpolate(h1Opacity, [0, 1], [30, 0]);

  const subOpacity = fi(frame, 55, 80);

  const btnP = spring({ frame: frame - 90, fps, config: { damping: 18, stiffness: 150 } });
  const btnScale = interpolate(btnP, [0, 1], [0.85, 1]);
  const btnOpacity = interpolate(btnP, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(ellipse at 50% 40%, #0d2047 0%, ${C.dark} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          marginBottom: 44,
        }}
      >
        <PressecutLogo size={48} light />
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: h1Opacity,
          transform: `translateY(${h1Y}px)`,
          color: "#ffffff",
          fontSize: 52,
          fontFamily: "sans-serif",
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.12,
          letterSpacing: "-0.025em",
        }}
      >
        Monitor everything.
        <br />
        Miss nothing.
      </div>

      {/* Subline */}
      <div
        style={{
          opacity: subOpacity,
          color: C.darkSub,
          fontSize: 18,
          fontFamily: "sans-serif",
          marginTop: 18,
          textAlign: "center",
        }}
      >
        presscut.hr
      </div>

      {/* CTA button */}
      <div
        style={{
          opacity: btnOpacity,
          transform: `scale(${btnScale})`,
          marginTop: 40,
          background: C.blue,
          color: "#ffffff",
          fontSize: 17,
          fontFamily: "sans-serif",
          fontWeight: 700,
          padding: "16px 36px",
          borderRadius: 10,
          letterSpacing: "-0.01em",
        }}
      >
        Book a Free Demo →
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
export const PressecutDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  const premount = fps; // premount 1 second before each scene

  return (
    <AbsoluteFill style={{ background: C.dark }}>
      <Series>
        <Series.Sequence durationInFrames={S1_DUR} premountFor={premount}>
          <HookScene />
        </Series.Sequence>

        <Series.Sequence offset={-20} durationInFrames={S2_DUR} premountFor={premount}>
          <DashboardScene />
        </Series.Sequence>

        <Series.Sequence offset={-20} durationInFrames={S3_DUR} premountFor={premount}>
          <ChannelsScene />
        </Series.Sequence>

        <Series.Sequence offset={-20} durationInFrames={S4_DUR} premountFor={premount}>
          <AnalyticsScene />
        </Series.Sequence>

        <Series.Sequence offset={-20} durationInFrames={S5_DUR} premountFor={premount}>
          <CTAScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
