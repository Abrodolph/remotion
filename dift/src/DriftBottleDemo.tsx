import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { OceanHome } from "./scenes/OceanHome";
import { ThrowBottle } from "./scenes/ThrowBottle";
import { CatchBottle } from "./scenes/CatchBottle";
import { BottleReading } from "./scenes/BottleReading";
import { PrayerLayer } from "./scenes/PrayerLayer";
import { MyBottles } from "./scenes/MyBottles";
import { OceanAmbient } from "./components/OceanAmbient";
import { SceneFade } from "./components/SceneFade";

export const DriftBottleDemo: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050d1a", overflow: "hidden" }}>
      {/* ── Persistent Ambient Layer ── */}
      <OceanAmbient intensity={0.52} />

      {/* ── Vignette Overlay ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, rgba(0,0,0,0) 25%, rgba(0,0,0,0.65) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Scene 1: Ocean Home Screen (0–270) ── */}
      <Sequence from={0} durationInFrames={270}>
        <SceneFade>
          <OceanHome />
        </SceneFade>
      </Sequence>

      {/* ── Scene 2: Throw Bottle Flow (270–570) ── */}
      <Sequence from={270} durationInFrames={300}>
        <SceneFade>
          <ThrowBottle />
        </SceneFade>
      </Sequence>

      {/* ── Scene 3: Catch Bottle (570–810) ── */}
      <Sequence from={570} durationInFrames={240}>
        <SceneFade>
          <CatchBottle />
        </SceneFade>
      </Sequence>

      {/* ── Scene 4: Bottle Reading (810–1080) ── */}
      <Sequence from={810} durationInFrames={270}>
        <SceneFade>
          <BottleReading />
        </SceneFade>
      </Sequence>

      {/* ── Scene 5: Prayer / Faith Layer (1080–1290) ── */}
      <Sequence from={1080} durationInFrames={210}>
        <SceneFade>
          <PrayerLayer />
        </SceneFade>
      </Sequence>

      {/* ── Scene 6: My Bottles Screen (1290–1500) ── */}
      <Sequence from={1290} durationInFrames={210}>
        <SceneFade>
          <MyBottles />
        </SceneFade>
      </Sequence>
    </AbsoluteFill>
  );
};
