import Intro from "./components/sections/intro";
import TechnicalSkills from "./components/sections/technical-skills";
import Career from "./components/sections/career";
import PetProjects from "./components/sections/pet-projects";
import Contact from "./components/sections/contact";
import { RippleProvider } from "./components/effects/ripple-context";

export default function Home() {
  return (
    <RippleProvider>
      <div
        id="spa-scroll"
        className="relative isolate h-dvh snap-y snap-mandatory overflow-y-auto bg-background text-foreground"
      >
        <div className="relative z-10">
          <Intro />
          <TechnicalSkills />
          <Career />
          <PetProjects />
          <Contact />
        </div>
      </div>
    </RippleProvider>
  );
}
