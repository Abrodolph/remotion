import { Sequence } from "remotion";
import { OceanHome } from "./scenes/OceanHome";
import { ThrowBottle } from "./scenes/ThrowBottle";
import { CatchBottle } from "./scenes/CatchBottle";
import { BottleReading } from "./scenes/BottleReading";
import { PrayerLayer } from "./scenes/PrayerLayer";
import { MyBottles } from "./scenes/MyBottles";

export const MyComposition = () => {
  return (
    <>
      {/* Scene 1: Ocean Home Screen (0–270) */}
      <Sequence durationInFrames={270} premountFor={30}>
        <OceanHome />
      </Sequence>

      {/* Scene 2: Throw Bottle Flow (270–570) */}
      <Sequence from={270} durationInFrames={300} premountFor={30}>
        <ThrowBottle />
      </Sequence>

      {/* Scene 3: Catch Bottle (570–810) */}
      <Sequence from={570} durationInFrames={240} premountFor={30}>
        <CatchBottle />
      </Sequence>

      {/* Scene 4: Bottle Reading (810–1080) */}
      <Sequence from={810} durationInFrames={270} premountFor={30}>
        <BottleReading />
      </Sequence>

      {/* Scene 5: Prayer / Faith Layer (1080–1290) */}
      <Sequence from={1080} durationInFrames={210} premountFor={30}>
        <PrayerLayer />
      </Sequence>

      {/* Scene 6: My Bottles Screen (1290–1500) */}
      <Sequence from={1290} durationInFrames={210} premountFor={30}>
        <MyBottles />
      </Sequence>
    </>
  );
};
