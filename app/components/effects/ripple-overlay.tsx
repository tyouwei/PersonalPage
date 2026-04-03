"use client";

import { useEffect } from "react";
import { useRippleContext } from "./ripple-context";

export default function RippleOverlay() {
  const { ripples, addRipple, addDragRippleTrail } = useRippleContext();

  useEffect(() => {
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let lastStamp = 0;
    const MIN_DIST_PX = 26;
    const MIN_INTERVAL_MS = 34;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drawing = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastStamp = performance.now();
      addRipple(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawing) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < MIN_DIST_PX && now - lastStamp < MIN_INTERVAL_MS) return;

      addDragRippleTrail(lastX, lastY, e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      lastStamp = now;
      addRipple(e.clientX, e.clientY);
    };

    const stopDrawing = () => {
      drawing = false;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", stopDrawing);
    window.addEventListener("pointercancel", stopDrawing);
    window.addEventListener("blur", stopDrawing);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDrawing);
      window.removeEventListener("pointercancel", stopDrawing);
      window.removeEventListener("blur", stopDrawing);
    };
  }, [addRipple, addDragRippleTrail]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-circle"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
    </div>
  );
}
