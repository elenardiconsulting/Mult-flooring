import * as React from "react";
import { cn } from "@/lib/utils";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Layout = ({ children, className, ...props }: LayoutProps) => {
  return (
    <div
      className={cn("min-h-screen bg-bg-base overflow-x-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Layout;
