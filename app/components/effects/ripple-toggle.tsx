"use client";

import { useRippleContext } from "./ripple-context";

export default function RippleToggle() {
  const { rippleEffectEnabled, setRippleEffectEnabled } = useRippleContext();

  return (
    <div
      className="flex items-center gap-2"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      <span className="text-xs font-medium text-zinc-600">Ripple</span>
      <button
        type="button"
        role="switch"
        aria-checked={rippleEffectEnabled}
        aria-label="Toggle ripple effect on text"
        onClick={() => setRippleEffectEnabled(!rippleEffectEnabled)}
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          rippleEffectEnabled
            ? "justify-end bg-zinc-900"
            : "justify-start bg-zinc-200"
        }`}
      >
        <span className="pointer-events-none block h-6 w-6 rounded-full bg-white shadow-sm ring-1 ring-zinc-900/5" />
      </button>
    </div>
  );
}
