import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const AetherIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title: scale up from 0 with bounce, starting at frame 15
  const titleScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 8 },
  });

  // Subtitle: fade in over 25 frames starting at frame 45
  const subtitleOpacity = interpolate(frame, [45, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle subtitle slide-up alongside the fade
  const subtitleTranslateY = interpolate(frame, [45, 70], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #08080f 0%, #12122a 40%, #1a0a2e 70%, #0a0a14 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          color: "#e8e8f8",
          fontSize: 128,
          fontFamily: "sans-serif",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textShadow: "0 0 60px rgba(140, 100, 255, 0.5)",
        }}
      >
        Aether
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleTranslateY}px)`,
          color: "#9898c0",
          fontSize: 28,
          fontFamily: "sans-serif",
          fontWeight: 300,
          letterSpacing: "0.3em",
          marginTop: 28,
          textTransform: "uppercase",
        }}
      >
        Innovation in Motion
      </div>
    </AbsoluteFill>
  );
};
