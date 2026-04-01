import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { DriftBottleDemo } from "./DriftBottleDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DriftBottleDemo"
        component={DriftBottleDemo}
        durationInFrames={1500}
        fps={30}
        width={390}
        height={844}
      />
      <Composition
        id="OriginalDemo"
        component={MyComposition}
        durationInFrames={1500}
        fps={30}
        width={390}
        height={844}
      />
    </>
  );
};
