import RippleCharText from "../effects/ripple-char-text";

const CAREER_ITEMS = [
  {
    title: "Software Engineer - Mobile Native Infra",
    company: "Shopee",
    period: "2026 - Present",
    details:
      "Building reliable foundational SDKs that improve developer experience. I help bridge the limitations between React Native and native OS APIs, thereby increasing delivery success.",
  },
  {
    title: "Software Engineer - Fullstack",
    company: "Nika",
    period: "2024 - 2025",
    details:
      "Helped with the development and integration of Nika Gaia into their notebook platform, an AI powered feature that helps to generate code and workflows for geospatial data analysis.",
  },
  {
    title: "Software Engineer - Fullstack",
    company: "NUS Synteraction Lab",
    period: "2024 - 2024",
    details:
      "Helped with the development of the TOM Project (The Other Me) which is a Augmented Reality project that allows users to interact with their surroundings and query a general AI assistant in real time.",
  },
];

export default function Career() {
  return (
    <section
      id="career"
      className="flex min-h-dvh w-full snap-start flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <RippleCharText
          text="Career"
          className="text-sm font-semibold tracking-wide text-zinc-600"
        />
        <RippleCharText
          text="Experience and impact over the years."
          className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {CAREER_ITEMS.map((item) => (
            <article
              key={`${item.company}-${item.period}`}
              className="rounded-2xl border border-zinc-300 bg-white/70 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {item.period}
              </p>
              <RippleCharText
                text={item.title}
                className="mt-2 text-base font-semibold text-zinc-900"
              />
              <RippleCharText
                text={item.company}
                className="text-sm text-zinc-600"
              />
              <RippleCharText
                text={item.details}
                className="mt-3 text-sm leading-relaxed text-zinc-700"
              />
            </article>
          ))}
        </div>

        <div>
          <a
            href="#intro"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Back To Intro
          </a>
        </div>
      </div>
    </section>
  );
}
