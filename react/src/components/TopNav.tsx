import { Bell, Monitor, Settings, ChevronDown, Database, Radio } from "lucide-react";
import { useState } from "react";

interface TopNavProps {
  activeModule?: string;
  onModuleChange?: (mod: string) => void;
}

const navItems = [
  { key: "safety-map", label: "应急安全一张图", icon: <Monitor size={14} /> },
  { key: "info-base", label: "应急安全信息库", icon: <Database size={14} /> },
  { key: "event-mgmt", label: "应急事件管理", icon: <Radio size={14} /> },
  { key: "message", label: "消息中心", icon: <Bell size={14} /> },
  { key: "smart-sensing", label: "智能感知预警", icon: <Radio size={14} />, active: true },
  { key: "command", label: "应急指挥调度", icon: <Monitor size={14} /> },
  { key: "review", label: "智能回溯复盘", icon: <Database size={14} /> },
  { key: "culture", label: "应急文化宣传", icon: <Radio size={14} /> },
  { key: "sys-mgmt", label: "系统管理", icon: <Settings size={14} /> },
];

export default function TopNav({
  activeModule = "smart-sensing",
  onModuleChange = () => {},
}: TopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      data-cmp="TopNav"
      className="w-full flex items-center justify-between px-4 h-12 flex-shrink-0"
      style={{
        background: `var(--tech-nav)`,
        borderBottom: `1px solid var(--tech-border)`,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 flex-shrink-0 mr-4"
        style={{ minWidth: 200 }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: `var(--tech-cyan-dim)`, border: `1px solid var(--tech-cyan)` }}
        >
          <Radio size={14} style={{ color: `var(--tech-cyan)` }} />
        </div>
        <span
          className="text-sm font-semibold whitespace-nowrap"
          style={{ color: `var(--tech-cyan)` }}
        >
          永靖县智基应急综合管理平台
        </span>
      </div>

      {/* Nav Items */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onModuleChange(item.key)}
            className="flex items-center gap-1 px-3 py-1 rounded text-xs whitespace-nowrap transition-all"
            style={{
              color: activeModule === item.key ? `var(--tech-cyan)` : `var(--tech-text-dim)`,
              background:
                activeModule === item.key
                  ? `var(--tech-cyan-dim)`
                  : "transparent",
              border:
                activeModule === item.key
                  ? `1px solid var(--tech-border)`
                  : "1px solid transparent",
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <button
          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{
            color: `var(--tech-text-dim)`,
            background: `var(--tech-input-bg)`,
            border: `1px solid var(--tech-border)`,
          }}
        >
          <span>P尾矿库</span>
          <ChevronDown size={12} />
        </button>
        <div className="flex items-center gap-2">
          <button
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: `var(--tech-input-bg)`, border: `1px solid var(--tech-border)` }}
          >
            <Monitor size={14} style={{ color: `var(--tech-text-dim)` }} />
          </button>
          <button
            className="w-7 h-7 rounded flex items-center justify-center relative"
            style={{ background: `var(--tech-input-bg)`, border: `1px solid var(--tech-border)` }}
          >
            <Bell size={14} style={{ color: `var(--tech-text-dim)` }} />
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center"
              style={{ background: `var(--tech-danger)`, color: `var(--tech-text)` }}
            >
              3
            </span>
          </button>
        </div>
        <div
          className="flex items-center gap-2 px-2 py-1 rounded"
          style={{ background: `var(--tech-input-bg)`, border: `1px solid var(--tech-border)` }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
          >
            管
          </div>
          <span className="text-xs" style={{ color: `var(--tech-text)` }}>
            管理员
          </span>
        </div>
      </div>
    </div>
  );
}
