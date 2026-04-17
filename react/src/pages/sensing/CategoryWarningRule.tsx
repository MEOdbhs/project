import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import { Plus, Edit, Trash2, ToggleLeft } from "lucide-react";

interface RuleItem {
  seq: number;
  indicator: string;
  unit: string;
  site: string;
  blueThreshold: string;
  yellowThreshold: string;
  orangeThreshold: string;
  redThreshold: string;
  enabled: boolean;
  updateTime: string;
  [key: string]: unknown;
}

interface CategoryWarningRuleProps {
  category?: string;
  description?: string;
  rules?: RuleItem[];
}

const defaultRules: RuleItem[] = [
  { seq: 1, indicator: "累计位移", unit: "mm", site: "全部站点", blueThreshold: "≥2", yellowThreshold: "≥5", orangeThreshold: "≥10", redThreshold: "≥20", enabled: true, updateTime: "2026-02-10" },
  { seq: 2, indicator: "位移速率", unit: "mm/d", site: "全部站点", blueThreshold: "≥1", yellowThreshold: "≥3", orangeThreshold: "≥8", redThreshold: "≥15", enabled: true, updateTime: "2026-02-10" },
  { seq: 3, indicator: "1小时降雨量", unit: "mm/h", site: "全部站点", blueThreshold: "≥5", yellowThreshold: "≥10", orangeThreshold: "≥20", redThreshold: "≥30", enabled: true, updateTime: "2026-01-15" },
];

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "indicator", title: "监测指标", width: 140 },
  { key: "unit", title: "单位", width: 80 },
  { key: "site", title: "适用站点", width: 120 },
  {
    key: "blueThreshold",
    title: "蓝色预警阈值",
    width: 110,
    render: (v) => <span style={{ color: "var(--tech-active)" }}>{String(v)}</span>,
  },
  {
    key: "yellowThreshold",
    title: "黄色预警阈值",
    width: 110,
    render: (v) => <span style={{ color: "var(--tech-warning)" }}>{String(v)}</span>,
  },
  {
    key: "orangeThreshold",
    title: "橙色预警阈值",
    width: 110,
    render: (v) => <span style={{ color: "#fa8c16" }}>{String(v)}</span>,
  },
  {
    key: "redThreshold",
    title: "红色预警阈值",
    width: 110,
    render: (v) => <span style={{ color: "var(--tech-danger)" }}>{String(v)}</span>,
  },
  { key: "updateTime", title: "更新时间", width: 110 },
  {
    key: "enabled",
    title: "状态",
    width: 80,
    render: (v) => (
      <span style={{ color: v ? "var(--tech-success)" : "var(--tech-text-dim)" }}>
        {v ? "启用" : "禁用"}
      </span>
    ),
  },
  {
    key: "action",
    title: "操作",
    width: 110,
    render: () => (
      <div className="flex gap-2">
        <button title="编辑"><Edit size={12} style={{ color: "var(--tech-cyan)" }} /></button>
        <button title="启停"><ToggleLeft size={12} style={{ color: "var(--tech-warning)" }} /></button>
        <button title="删除"><Trash2 size={12} style={{ color: "var(--tech-danger)" }} /></button>
      </div>
    ),
  },
];

export default function CategoryWarningRule({
  category = "地质灾害",
  description = "基于地表位移、降雨量等监测指标设置多级预警阈值",
  rules = defaultRules,
}: CategoryWarningRuleProps) {
  const [page, setPage] = useState(1);
  const enabled = rules.filter((r) => r.enabled).length;

  return (
    <div data-cmp="CategoryWarningRule" className="flex flex-col gap-3 p-4">
      <div
        className="flex items-center justify-between rounded px-4 py-3"
        style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
      >
        <div>
          <div className="text-sm font-semibold" style={{ color: `var(--tech-cyan)` }}>{category}预警规则配置</div>
          <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>{description}</div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div style={{ color: `var(--tech-text-dim)` }}>规则总数：<span style={{ color: `var(--tech-text)` }}>{rules.length}</span></div>
          <div style={{ color: `var(--tech-text-dim)` }}>已启用：<span style={{ color: `var(--tech-success)` }}>{enabled}</span></div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {[
            { level: "蓝色", color: "var(--tech-active)", desc: "IV级（关注）" },
            { level: "黄色", color: "var(--tech-warning)", desc: "III级（注意）" },
            { level: "橙色", color: "#fa8c16", desc: "II级（警示）" },
            { level: "红色", color: "var(--tech-danger)", desc: "I级（紧急）" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1 text-xs" style={{ color: `var(--tech-text-dim)` }}>
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <span style={{ color: item.color }}>{item.level}</span>
              <span>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <TechCard
        title={`${category}预警规则列表`}
        extra={
          <button
            className="flex items-center gap-1 text-xs px-3 py-1 rounded"
            style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
          >
            <Plus size={12} />新增规则
          </button>
        }
      >
        <TechTable columns={columns} data={rules} total={rules.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
