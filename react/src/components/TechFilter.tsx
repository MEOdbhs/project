import { Search, RotateCcw, ChevronDown } from "lucide-react";

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "input" | "date";
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface TechFilterProps {
  fields?: FilterField[];
  values?: Record<string, string>;
  onChange?: (key: string, value: string) => void;
  onSearch?: () => void;
  onReset?: () => void;
}

export default function TechFilter({
  fields = [],
  values = {},
  onChange = () => {},
  onSearch = () => {},
  onReset = () => {},
}: TechFilterProps) {
  return (
    <div
      data-cmp="TechFilter"
      className="flex items-center flex-wrap gap-3 px-4 py-3 rounded mb-3"
      style={{
        background: `rgba(0,20,50,0.5)`,
        border: `1px solid var(--tech-border)`,
      }}
    >
      {fields.map((field) => (
        <div key={field.key} className="flex items-center gap-2">
          <span className="text-xs flex-shrink-0" style={{ color: `var(--tech-text-dim)` }}>
            {field.label}：
          </span>
          {field.type === "select" ? (
            <div className="relative">
              <select
                value={values[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="appearance-none text-xs px-3 py-1.5 pr-7 rounded outline-none"
                style={{
                  background: `var(--tech-input-bg)`,
                  border: `1px solid var(--tech-border)`,
                  color: values[field.key] ? `var(--tech-text)` : `var(--tech-text-dim)`,
                  minWidth: 140,
                }}
              >
                <option value="">{field.placeholder || `请选择${field.label}`}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={11}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: `var(--tech-text-dim)` }}
              />
            </div>
          ) : (
            <input
              type={field.type === "date" ? "date" : "text"}
              value={values[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder || `请输入${field.label}`}
              className="text-xs px-3 py-1.5 rounded outline-none"
              style={{
                background: `var(--tech-input-bg)`,
                border: `1px solid var(--tech-border)`,
                color: `var(--tech-text)`,
                minWidth: 160,
              }}
            />
          )}
        </div>
      ))}

      <button
        onClick={onSearch}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium transition-all"
        style={{
          background: `var(--tech-active)`,
          color: `var(--tech-text)`,
          border: `1px solid var(--tech-active)`,
        }}
      >
        <Search size={12} />
        查询
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs transition-all"
        style={{
          background: `var(--tech-input-bg)`,
          color: `var(--tech-text-dim)`,
          border: `1px solid var(--tech-border)`,
        }}
      >
        <RotateCcw size={12} />
        重置
      </button>
    </div>
  );
}
