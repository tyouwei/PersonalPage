"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRippleContext } from "./ripple-context";

const TEXT_POSITION_EPSILON = 0.1;
const TEXT_SCALE_EPSILON = 0.003;
const TEXT_SCALE_REST_HEIGHT_EPSILON = 0.18;
const TEXT_SCALE_REST_SPEED_EPSILON = 2.4;
const TEXT_RIPPLE_HEIGHT_FOR_MAX_SCALE = 5;
const RIPPLE_SCALE_AMPLITUDE = 0.36;

type Token = {
  text: string;
  isWord: boolean;
};

type WordState = {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  renderedX: number;
  renderedY: number;
  renderedScale: number;
};

function splitWordTokens(text: string): Token[] {
  const raw = text.split(/(\s+)/);
  return raw
    .filter((piece) => piece.length > 0)
    .map((piece) => ({ text: piece, isWord: !/^\s+$/.test(piece) }));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function inverseLerp(min: number, max: number, value: number) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function nearestScrollableAncestors(start: HTMLElement | null): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const out: HTMLElement[] = [];
  let node: HTMLElement | null = start?.parentElement ?? null;
  while (node) {
    const style = getComputedStyle(node);
    const oy = style.overflowY;
    const ox = style.overflowX;
    const scrollableY =
      (oy === "auto" || oy === "scroll" || oy === "overlay") && node.scrollHeight > node.clientHeight;
    const scrollableX =
      (ox === "auto" || ox === "scroll" || ox === "overlay") && node.scrollWidth > node.clientWidth;
    if (scrollableY || scrollableX) {
      if (!seen.has(node)) {
        seen.add(node);
        out.push(node);
      }
    }
    node = node.parentElement;
  }
  return out;
}

type Props = {
  text: string;
  className?: string;
};

/**
 * Per-word ripple motion: target transform from wave math, then smoothed with
 * exponential interpolation so words ease back after ripples end (no snap).
 */
export default function RippleCharText({ text, className = "" }: Props) {
  const { gradientAt, surfaceHeightAt, physics, rippleEffectEnabled } = useRippleContext();
  const tokens = useMemo(() => splitWordTokens(text), [text]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statesRef = useRef<WordState[]>([]);
  const tokenToWordRef = useRef<number[]>([]);
  tokenToWordRef.current = [];
  let wordCount = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].isWord) {
      tokenToWordRef.current[i] = wordCount;
      wordCount += 1;
    } else {
      tokenToWordRef.current[i] = -1;
    }
  }

  useEffect(() => {
    wordRefs.current.length = wordCount;
    statesRef.current = Array.from({ length: wordCount }, () => ({
      originX: 0,
      originY: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      renderedX: Number.NaN,
      renderedY: Number.NaN,
      renderedScale: Number.NaN,
    }));
  }, [wordCount]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      for (const el of wordRefs.current) {
        if (el) el.style.transform = "";
      }
      return;
    }

    if (!rippleEffectEnabled) {
      for (const el of wordRefs.current) {
        if (el) el.style.transform = "";
      }
      return;
    }

    const measureOrigins = () => {
      const words = wordRefs.current;
      const states = statesRef.current;
      for (let i = 0; i < words.length; i++) {
        const el = words[i];
        const state = states[i];
        if (!el || !state) continue;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        state.originX = centerX;
        state.originY = centerY;
        state.x = centerX;
        state.y = centerY;
        state.vx = 0;
        state.vy = 0;
        state.renderedX = Number.NaN;
        state.renderedY = Number.NaN;
        state.renderedScale = Number.NaN;
      }
    };
    measureOrigins();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measureOrigins())
        : null;
    if (ro) {
      for (const el of wordRefs.current) {
        if (el) ro.observe(el);
      }
    }
    window.addEventListener("resize", measureOrigins);

    const scrollRoots = new Set<HTMLElement>();
    for (const el of wordRefs.current) {
      if (!el) continue;
      for (const root of nearestScrollableAncestors(el)) {
        scrollRoots.add(root);
      }
    }
    for (const root of scrollRoots) {
      root.addEventListener("scroll", measureOrigins, { passive: true });
    }

    const rafRef = { id: 0 as number };
    const lastTimeRef = { value: 0 };
    const tick = () => {
      const words = wordRefs.current;
      const states = statesRef.current;
      const now = performance.now();
      const dt = lastTimeRef.value === 0 ? 1 / 60 : Math.min(1 / 20, (now - lastTimeRef.value) / 1000);
      lastTimeRef.value = now;

      for (let i = 0; i < words.length; i++) {
        const el = words[i];
        const state = states[i];
        if (!state) continue;
        if (!el) continue;

        const gradient = gradientAt(state.x, state.y);
        const rippleFx = -gradient.x * physics.rippleForce;
        const rippleFy = -gradient.y * physics.rippleForce;
        const springFx = (state.originX - state.x) * physics.springStrength;
        const springFy = (state.originY - state.y) * physics.springStrength;
        const dampingFx = -state.vx * physics.motionDamping;
        const dampingFy = -state.vy * physics.motionDamping;

        state.vx += (rippleFx + springFx + dampingFx) * dt;
        state.vy += (rippleFy + springFy + dampingFy) * dt;
        state.x += state.vx * dt;
        state.y += state.vy * dt;

        const height = surfaceHeightAt(state.x, state.y);
        const speed = Math.hypot(state.vx, state.vy);

        let scale = 1;
        if (
          Math.abs(height) > TEXT_SCALE_REST_HEIGHT_EPSILON &&
          speed > TEXT_SCALE_REST_SPEED_EPSILON
        ) {
          const normalizedHeight = clamp(
            inverseLerp(
              -TEXT_RIPPLE_HEIGHT_FOR_MAX_SCALE,
              TEXT_RIPPLE_HEIGHT_FOR_MAX_SCALE,
              height,
            ) *
              2 -
              1,
            -1,
            1,
          );
          scale = 1 + normalizedHeight * RIPPLE_SCALE_AMPLITUDE;
          if (Math.abs(scale - 1) <= TEXT_SCALE_EPSILON) scale = 1;
        }

        if (
          !Number.isFinite(state.renderedX) ||
          Math.abs(state.x - state.renderedX) > TEXT_POSITION_EPSILON ||
          Math.abs(state.y - state.renderedY) > TEXT_POSITION_EPSILON ||
          Math.abs(scale - state.renderedScale) > TEXT_SCALE_EPSILON
        ) {
          const dx = state.x - state.originX;
          const dy = state.y - state.originY;
          el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          state.renderedX = state.x;
          state.renderedY = state.y;
          state.renderedScale = scale;
        }
      }

      rafRef.id = requestAnimationFrame(tick);
    };

    rafRef.id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.id);
      window.removeEventListener("resize", measureOrigins);
      for (const root of scrollRoots) {
        root.removeEventListener("scroll", measureOrigins);
      }
      if (ro) ro.disconnect();
    };
  }, [wordCount, gradientAt, surfaceHeightAt, physics, rippleEffectEnabled]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <p
        aria-hidden
        className={`ripple-char-text select-none ${className}`.trim()}
      >
        {tokens.map((token, tokenIndex) => {
          if (!token.isWord) {
            return <span key={tokenIndex}>{token.text}</span>;
          }
          const wordIndex = tokenToWordRef.current[tokenIndex];
          return (
            <span
              key={tokenIndex}
              ref={(el) => {
                if (wordIndex >= 0) wordRefs.current[wordIndex] = el;
              }}
              className="inline-block origin-center will-change-transform"
            >
              {token.text}
            </span>
          );
        })}
      </p>
    </>
  );
}
