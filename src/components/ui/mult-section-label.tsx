import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const SectionLabel = React.forwardRef<HTMLSpanElement, SectionLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "mb-3 text-[11px] font-normal uppercase tracking-[0.12em] text-text-muted inline-flex items-center gap-[10px]",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 20,
            height: 1,
            background: "var(--color-accent-mid)",
            flexShrink: 0,
          }}
        />
        <span>{children}</span>
      </span>
    );
  },
);

SectionLabel.displayName = "SectionLabel";

export default SectionLabel;
export { SectionLabel };
