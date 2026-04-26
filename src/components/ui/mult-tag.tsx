import * as React from "react";
import { cn } from "@/lib/utils";

export interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

const Tag = React.forwardRef<HTMLButtonElement, TagProps>(
  ({ label, active = false, className, ...props }, ref) => {
    const base =
      "inline-flex items-center px-[14px] py-[5px] rounded-pill " +
      "text-[11px] font-medium uppercase tracking-[0.08em] " +
      "border transition-all duration-base ease-expo cursor-pointer " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
      "focus-visible:ring-offset-[var(--color-bg-base)]";

    const state = active
      ? "bg-accent border-accent text-white"
      : "bg-bg-surface border-border-warm text-text-secondary hover:bg-bg-elevated hover:border-border-strong";

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        className={cn(base, state, className)}
        {...props}
      >
        {label}
      </button>
    );
  },
);

Tag.displayName = "Tag";

export default Tag;
export { Tag };
