import RippleCharText from "../effects/ripple-char-text";
import SectionFooterWithRipple from "../effects/section-footer-with-ripple";

const PORTFOLIO_TEXT = [
  "I’m a Software Engineer focused on Mobile Native Infrastructure at Shopee, where I work on foundations and internal libraries to help product teams in Shopee ship faster and more reliably.",
  "I enjoy keeping up with software trends and turning useful ideas into practical systems.",
  "A big part of my work involves building internal tooling and automation that improves developer experience and increases delivery confidence.",
  "Specifically, I architect libraries and endpoints that bridge low-level native OS capabilities with React Native, ensuring high-level frameworks remain performant and deeply integrated.",
  "I also develop native iOS features built for massive scale and optimal performance, whilst adhering to industry-standard release cycle practices such as greyscale releasing and A/B testing.",
  "Outside of work, I experiment with agentic AI architecture, focusing on how tool-calling and autonomous frameworks can extend LLM capabilities.",
  "Whether it's mobile infra or AI agents, I’m driven by the challenge of turning complex ideas into practical, reliable systems!"
].join(" ");

const PORTFOLIO_NOTE = [
  "Side-note: I admittedly finally only started on this portfolio recently just to play around with the pretext library recently developed by Cheng Lou.", 
  "Huge shoutout to him for revolutionizing the way we build text-based interfaces!",
].join(" ");

const RIPPLE_HINT = "Try toggling on the ripple effect by clicking the button below! You can click or mouse drag around the page to see it in action!";

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
          <br />
          <RippleCharText
            text={PORTFOLIO_NOTE}
            className="text-sm leading-relaxed text-zinc-700"
          />
          <br />
          <RippleCharText
            text={RIPPLE_HINT}
            className="text-sm font-semibold leading-relaxed text-zinc-700"
          />
        </div>

        <SectionFooterWithRipple className="pt-2">
          <a
            href="#skills"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Technical skills
          </a>
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
        </SectionFooterWithRipple>
      </div>
    </section>
  );
}
