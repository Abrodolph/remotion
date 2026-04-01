import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const WAVE_LAYERS = [
  { fill: "#0b1f38", amplitude: 20, frequency: 0.009, speed: 0.018, yBase: 0.58, opacity: 1 },
  { fill: "#0d2444", amplitude: 15, frequency: 0.014, speed: 0.032, yBase: 0.63, opacity: 0.92 },
  { fill: "#102a50", amplitude: 10, frequency: 0.02,  speed: 0.05,  yBase: 0.67, opacity: 0.88 },
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
  const step = 5;
  const pts: string[] = [`M 0 ${baseY + Math.sin(phase) * amplitude}`];
  for (let x = step; x <= w + step; x += step) {
    pts.push(`L ${x} ${baseY + Math.sin(x * frequency + phase) * amplitude}`);
  }
  pts.push(`L ${w} ${h}`, `L 0 ${h}`, "Z");
  return pts.join(" ");
}

type Props = { speedMultiplier?: number };

/** Shared animated ocean gradient + 3 parallax wave layers. */
export const OceanBackground: React.FC<Props> = ({ speedMultiplier = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, #0a1628 0%, #050d1a 100%)" }}
      />
      <AbsoluteFill>
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
                frame * layer.speed * speedMultiplier
              )}
              fill={layer.fill}
              opacity={layer.opacity}
            />
          ))}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
