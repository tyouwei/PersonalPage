import RippleCharText from "../effects/ripple-char-text";
import SectionFooterWithRipple from "../effects/section-footer-with-ripple";

const PET_PROJECTS = [
  {
    title: "RideRinger",
    description:
      "A native mobile app that allows users to set alarms and notifications when they reach their intended destinations on long Bus/MRT rides",
  },
  {
    title: "Stock Prediction",
    description:
      "I used A2C to train a model to predict the stock price of a given stock. This project was a fun way to learn about reinforcement learning and stock market prediction.",
  },
  {
    title: "Generating 3D objects on Mapbox",
    description:
      "A project for me to learn agentic applications on geospatial solutions. I created an agentic AI workflow to generate 3D objects on a map.",
  },
];

export default function PetProjects() {
  return (
    <section
      id="pet-projects"
      className="flex min-h-dvh w-full snap-start flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <RippleCharText
          text="My Pet Projects"
          className="text-sm font-semibold tracking-wide text-zinc-600"
        />
        <div className="flex flex-col gap-3">
          <RippleCharText
            text="Side builds, experiments, and things I ship for fun."
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
          />
          <RippleCharText
            text="Some personal projects I build for fun and learning."
            className="text-base font-normal leading-relaxed text-zinc-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PET_PROJECTS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-zinc-300 bg-white/70 p-5"
            >
              <RippleCharText
                text={item.title}
                className="text-base font-semibold text-zinc-900"
              />
              <RippleCharText
                text={item.description}
                className="mt-3 text-sm leading-relaxed text-zinc-700"
              />
            </article>
          ))}
        </div>

        <SectionFooterWithRipple>
          <a
            href="#contact"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Contact me
          </a>
          <a
            href="#career"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Back to Career
          </a>
        </SectionFooterWithRipple>
      </div>
    </section>
  );
}
