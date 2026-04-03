import Intro from "./components/sections/intro";
import Career from "./components/sections/career";
import RippleOverlay from "./components/effects/ripple-overlay";
import { RippleProvider } from "./components/effects/ripple-context";

export default function Home() {
  return (
    <RippleProvider>
      <div
        id="spa-scroll"
        className="relative isolate h-dvh snap-y snap-mandatory overflow-y-auto bg-background text-foreground"
      >
        <RippleOverlay />
        <div className="relative z-10">
          <Intro />
          <Career />
        </div>
      </div>
    </RippleProvider>
  );
}
