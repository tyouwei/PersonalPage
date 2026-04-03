"use client";

import {
  layoutWithLines,
  prepareWithSegments,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import { useCallback, useEffect, useRef, useState } from "react";

export function usePretextLines(
  paragraphs: readonly string[],
  font: string,
  lineHeightPx: number,
) {
  const [columnEl, setColumnEl] = useState<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState<string[][] | null>(null);
  const rafRef = useRef<number | null>(null);

  const ref = useCallback((node: HTMLDivElement | null) => {
    setColumnEl(node);
  }, []);

  useEffect(() => {
    if (!columnEl) return;

    const el = columnEl;
    const prepared: PreparedTextWithSegments[] = paragraphs.map((text) =>
      prepareWithSegments(text, font),
    );

    function relayout() {
      const widthPx = el.clientWidth;
      if (widthPx < 1) return;

      const linesByParagraph = prepared.map((p) =>
        layoutWithLines(p, widthPx, lineHeightPx).lines.map((l) => l.text),
      );
      setRendered(linesByParagraph);
    }

    function scheduleRelayout() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        relayout();
      });
    }

    relayout();
    const ro = new ResizeObserver(scheduleRelayout);
    ro.observe(el);

    return () => {
      ro.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [columnEl, paragraphs, font, lineHeightPx]);

  return { ref, rendered };
}

