"use client";

import type { ReactNode } from "react";
import RippleToggle from "./ripple-toggle";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function SectionFooterWithRipple({ children, className = "" }: Props) {
  return (
    <div
      className={`flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-3 ${className}`.trim()}
    >
      <div className="flex min-w-0 flex-1 flex-wrap gap-3">{children}</div>
      <div className="ml-auto shrink-0">
        <RippleToggle />
      </div>
    </div>
  );
}
