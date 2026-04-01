import "./index.css";
import { Composition } from "remotion";
import { PressecutDemo } from "./PressecutDemo";

// Scene durations (matching PressecutDemo.tsx)
// S1: 180, S2: 420, S3: 270, S4: 270, S5: 270
// 4 crossfades of -20 frames each = 4 * 20 = 80 frames saved
// Total: 180 + 420 + 270 + 270 + 270 - 80 = 1330 frames ≈ 44s
const TOTAL_FRAMES = 1330;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PressecutDemo"
        component={PressecutDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
