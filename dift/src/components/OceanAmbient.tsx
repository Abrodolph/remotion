import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { colors } from "../tokens";

const WAVE_LAYERS = [
  { fill: "#0b1f38", amplitude: 15, frequency: 0.008, speed: 0.015, yBase: 0.62 },
  { fill: "#0d2444", amplitude: 12, frequency: 0.012, speed: 0.028, yBase: 0.68 },
  { fill: "#102a50", amplitude: 8,  frequency: 0.018, speed: 0.045, yBase: 0.72 },
] as const;

function buildWavePath(
  w: number,
  h: number,
  yBase: number,
  amplitude: number,
  frequency: number,
  phase: number
): string {
  const baseY = yBase * h;
  const step = 8;
  const pts: string[] = [`M 0 ${baseY + Math.sin(phase) * amplitude}`];
  for (let x = step; x <= w + step; x += step) {
    pts.push(`L ${x} ${baseY + Math.sin(x * frequency + phase) * amplitude}`);
  }
  pts.push(`L ${w} ${h}`, `L 0 ${h}`, "Z");
  return pts.join(" ");
}

type Props = {
  intensity?: number;
};

export const OceanAmbient: React.FC<Props> = ({ intensity = 0.4 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ── Stable Bioluminescent Particles ──
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: intensity }}>
      {/* Waves */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {WAVE_LAYERS.map((layer, i) => (
          <path
            key={i}
            d={buildWavePath(
              width,
              height,
              layer.yBase,
              layer.amplitude,
              layer.frequency,
              frame * layer.speed
            )}
            fill={layer.fill}
            opacity={0.8 - i * 0.15}
          />
        ))}
      </svg>

      {/* Bioluminescent Dots */}
      {particles.map((p, i) => {
        const drift = (frame * p.speed + p.delay) % 100;
        const opacity = interpolate(
          Math.sin(frame * 0.05 + p.delay),
          [-1, 1],
          [0, p.opacity]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(p.x + drift * 0.1) % 100}%`,
              top: `${(p.y - drift * 0.2 + 100) % 100}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: colors.mutedTeal,
              boxShadow: `0 0 8px ${colors.mutedTeal}`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
