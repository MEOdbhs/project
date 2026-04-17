import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Plus, Edit, Trash2, Copy } from "lucide-react";

const ruleData = [
  { seq: 1, ruleName: "瓦斯浓度超标预警规则", ruleType: "矿山", indicator: "瓦斯浓度", operator: "≥", threshold: "1.5%", level: "red", status: "enabled", updater: "管理员", updateTime: "2026-03-20 10:00" },
  { seq: 2, ruleName: "坡体位移超速预警规则", ruleType: "地质灾害", indicator: "位移速率", operator: "≥", threshold: "5mm/d", level: "orange", status: "enabled", updater: "张工", updateTime: "2026-03-18 14:30" },
  { seq: 3, ruleName: "水库水位超警戒预警", ruleType: "水文", indicator: "水位高程", operator: "≥", threshold: "1735m", level: "yellow", status: "enabled", updater: "李工", updateTime: "2026-03-15 09:15" },
  { seq: 4, ruleName: "林区温度异常预警规则", ruleType: "森林防火", indicator: "空气温度", operator: "≥", threshold: "35°C", level: "orange", status: "disabled", updater: "王工", updateTime: "2026-03-10 16:20" },
  { seq: 5, ruleName: "危化品泄漏预警规则", ruleType: "危化品", indicator: "可燃气浓度", operator: "≥", threshold: "25%LEL", level: "red", status: "enabled", updater: "管理员", updateTime: "2026-03-08 11:00" },
  { seq: 6, ruleName: "粉尘浓度超标工贸预警", ruleType: "工贸", indicator: "粉尘浓度", operator: "≥", threshold: "8mg/m³", level: "yellow", status: "enabled", updater: "赵工", updateTime: "2026-03-05 08:45" },
];

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "ruleName", title: "规则名称", width: 180 },
  { key: "ruleType", title: "规则类型", width: 100 },
  { key: "indicator", title: "监测指标", width: 100 },
  { key: "operator", title: "运算符", width: 80 },
  { key: "threshold", title: "阈值", width: 100 },
  {
    key: "level",
    title: "预警等级",
    width: 90,
    render: (val) => {
      const map: Record<string, { label: string; color: string }> = {
        red: { label: "红色", color: "var(--tech-danger)" },
        orange: { label: "橙色", color: "#fa8c16" },
        yellow: { label: "黄色", color: "var(--tech-warning)" },
        blue: { label: "蓝色", color: "var(--tech-active)" },
      };
      const s = map[String(val)] || map.blue;
      return <span style={{ color: s.color }}>{s.label}</span>;
    },
  },
  {
    key: "status",
    title: "启用状态",
    width: 90,
    render: (val) => (
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: val === "enabled" ? `var(--tech-success)` : `var(--tech-text-dim)` }}
        />
        <span style={{ color: val === "enabled" ? `var(--tech-success)` : `var(--tech-text-dim)` }}>
          {val === "enabled" ? "已启用" : "已禁用"}
        </span>
      </div>
    ),
  },
  { key: "updater", title: "更新人", width: 80 },
  { key: "updateTime", title: "更新时间", width: 140 },
  {
    key: "action",
    title: "操作",
    width: 120,
    render: () => (
      <div className="flex items-center gap-2">
        <button title="编辑"><Edit size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="复制"><Copy size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="删除"><Trash2 size={13} style={{ color: `var(--tech-danger)` }} /></button>
      </div>
    ),
  },
];

const filterFields = [
  { key: "ruleType", label: "规则类型", type: "select" as const, options: [
    { label: "矿山", value: "mine" }, { label: "地质灾害", value: "geology" },
    { label: "水文", value: "hydro" }, { label: "森林防火", value: "forest" },
  ] },
  { key: "level", label: "预警等级", type: "select" as const, options: [
    { label: "红色", value: "red" }, { label: "橙色", value: "orange" },
    { label: "黄色", value: "yellow" },
  ] },
  { key: "status", label: "启用状态", type: "select" as const, options: [
    { label: "已启用", value: "enabled" }, { label: "已禁用", value: "disabled" },
  ] },
];

export default function WarningRule() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  return (
    <div data-cmp="WarningRule" className="flex flex-col gap-3 p-4">
      <TechFilter
        fields={filterFields}
        values={filterValues}
        onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
        onSearch={() => console.log("search")}
        onReset={() => setFilterValues({})}
      />
      <TechCard
        title="预警规则设置"
        extra={
          <button
            className="flex items-center gap-1 text-xs px-3 py-1 rounded"
            style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
          >
            <Plus size={12} />
            新增规则
          </button>
        }
      >
        <TechTable columns={columns} data={ruleData} total={ruleData.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
