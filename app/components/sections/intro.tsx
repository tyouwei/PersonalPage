import Link from "next/link";
import RippleCharText from "../effects/ripple-char-text";

const PORTFOLIO_TEXT = [
  "I’m a Software Engineer focused on Mobile Native Infrastructure at Shopee, where I work on foundations and internal librariesthat help product teams ship faster and more reliably.",
  "I enjoy keeping up with software trends and turning useful ideas into practical systems.",
  "A big part of my work is building internal tooling and automation that improves developer experience, reduces repetitive work, and increases delivery confidence.",
  "My interests include platform engineering, build and release workflows, observability, performance, and creating tools that scale with growing teams.",
].join(" ");

const PORTFOLIO_NOTE = [
  "Side-note: I admittedly finally only started on this portfolio recently just to play around with the pretext library recently developed by Cheng Lou.", 
  "Huge shoutout to him for revolutionizing the way we build text-based interfaces!",
  "Try clicking and dragging around the page to see the ripple effect!"
].join(" ");

export default function Intro() {
  return (
    <section
      id="intro"
      className="flex min-h-dvh w-full snap-start flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <RippleCharText
          text="Hi, I’m Tham You Wei, a Software Engineer"
          className="text-sm font-semibold tracking-wide text-zinc-600"
        />
        <RippleCharText
          text="I build reliable mobile infrastructure and practical developer tools."
          className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
        />

        <div className="w-full">
          <RippleCharText
            text={PORTFOLIO_TEXT}
            className="text-sm leading-relaxed text-zinc-700"
          />
          <RippleCharText
            text={PORTFOLIO_NOTE}
            className="text-sm leading-relaxed text-zinc-700"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="#career"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            View Career
          </a>
          <Link
            href="mailto:you@example.com"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Contact
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
