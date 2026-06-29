import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";

export const Root = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={30 * 30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
