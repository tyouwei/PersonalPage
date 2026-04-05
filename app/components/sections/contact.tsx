import RippleCharText from "../effects/ripple-char-text";
import SectionFooterWithRipple from "../effects/section-footer-with-ripple";

const CONTACT_EMAIL = "thamyouwei@gmail.com";
const GITHUB_HREF = "https://github.com/tyouwei";
const LINKEDIN_HREF = "https://www.linkedin.com/in/tyw8";

export default function Contact() {
  const mailto = `mailto:${CONTACT_EMAIL}`;

  return (
    <section
      id="contact"
      className="flex min-h-dvh w-full snap-start flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <RippleCharText
          text="Contact"
          className="text-sm font-semibold tracking-wide text-zinc-600"
        />
        <div className="flex flex-col gap-3">
          <RippleCharText
            text="Let’s talk."
            className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
          />
          <RippleCharText
            text="You may find me on the usual professional links below, or you can reach out to me via email."
            className="text-base font-normal leading-relaxed text-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-300 bg-white/70 p-6 sm:p-8">
          <div>
            <RippleCharText
              text="Email"
              className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            />
            <a
              href={mailto}
              className="mt-2 inline-flex text-lg font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-900"
            >
              <RippleCharText
                text={CONTACT_EMAIL}
                className="text-lg font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-900"
              />
            </a>
          </div>

          <div>
            <RippleCharText
              text="Elsewhere"
              className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={GITHUB_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                GitHub
              </a>
              <a
                href={LINKEDIN_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                LinkedIn
              </a>
              <a
                href={mailto}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Open in mail app
              </a>
            </div>
          </div>
        </div>

        <SectionFooterWithRipple>
          <a
            href="#intro"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Back to Intro
          </a>
          <a
            href="#pet-projects"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Pet projects
          </a>
        </SectionFooterWithRipple>
      </div>
    </section>
  );
}
