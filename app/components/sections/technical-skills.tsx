import RippleCharText from "../effects/ripple-char-text";
import SectionFooterWithRipple from "../effects/section-footer-with-ripple";

const SKILL_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: ["TypeScript", "Swift", "Objective-C", "Python", "Kotlin", "Java"],
  },
  {
    title: "Mobile & Frontend",
    items: ["React Native", "React", "Node.js"],
  },
  {
    title: "Infrastructure & DevOps",
    items: ["CocoaPods", "Gradle", "Docker", "Git", "Cloudflare", "AWS"],
  },
];

export default function TechnicalSkills() {
  return (
    <section
      id="skills"
      className="flex min-h-dvh w-full snap-start flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <RippleCharText
          text="Technical skills"
          className="text-sm font-semibold tracking-wide text-zinc-600"
        />
        <div className="flex flex-col gap-3">
          <RippleCharText
            text="Stacks and tools I use day to day."
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
          />
          <RippleCharText
            text="My go to tools and technologies."
            className="text-sm leading-relaxed text-zinc-700"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title}>
              <RippleCharText
                text={group.title}
                className="text-sm font-semibold uppercase tracking-wide text-zinc-500"
              />
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <RippleCharText
                      text={item}
                      className="inline-block rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm text-zinc-800"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <SectionFooterWithRipple>
          <a
            href="#career"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            View Career
          </a>
          <a
            href="#intro"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Back to Intro
          </a>
        </SectionFooterWithRipple>
      </div>
    </section>
  );
}
