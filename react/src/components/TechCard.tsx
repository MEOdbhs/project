import type { ReactNode } from "react";

interface TechCardProps {
  title?: string;
  children?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export default function TechCard({
  title = "",
  children,
  extra,
  className = "",
}: TechCardProps) {
  return (
    <div
      data-cmp="TechCard"
      className={`rounded ${className}`}
      style={{
        background: `var(--tech-card)`,
        border: `1px solid var(--tech-border)`,
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: `var(--tech-border)` }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-1 h-4 rounded-full inline-block"
              style={{ background: `var(--tech-cyan)` }}
            />
            <span className="text-sm font-medium" style={{ color: `var(--tech-text)` }}>
              {title}
            </span>
          </div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
