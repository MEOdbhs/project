import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Plus, Edit, History } from "lucide-react";

const thresholds = [
  { seq: 1, devType: "位移传感器", indicator: "累计位移", unit: "mm", blue: "≥2.0", yellow: "≥5.0", orange: "≥10.0", red: "≥20.0", basis: "《地质灾害监测规程》GB/T 12763", updater: "管理员", updateTime: "2026-02-10" },
  { seq: 2, devType: "位移传感器", indicator: "位移速率", unit: "mm/d", blue: "≥1.0", yellow: "≥3.0", orange: "≥8.0", red: "≥15.0", basis: "《地质灾害监测规程》GB/T 12763", updater: "张工", updateTime: "2026-02-10" },
  { seq: 3, devType: "雨量计", indicator: "1小时降雨量", unit: "mm/h", blue: "≥5.0", yellow: "≥10.0", orange: "≥20.0", red: "≥30.0", basis: "气象局标准", updater: "李工", updateTime: "2026-01-15" },
  { seq: 4, devType: "瓦斯传感器", indicator: "瓦斯浓度", unit: "%CH4", blue: "≥0.5", yellow: "≥0.75", orange: "≥1.0", red: "≥1.5", basis: "《煤矿安全规程》", updater: "管理员", updateTime: "2026-01-20" },
  { seq: 5, devType: "水位计", indicator: "水位高程", unit: "m", blue: "≥1728", yellow: "≥1731", orange: "≥1733", red: "≥1735", basis: "水库调度规程", updater: "王工", updateTime: "2026-02-01" },
  { seq: 6, devType: "有毒气体传感器", indicator: "氨气浓度", unit: "ppm", blue: "≥15", yellow: "≥25", orange: "≥30", red: "≥50", basis: "《危险化学品安全管理条例》", updater: "赵工", updateTime: "2026-02-05" },
  { seq: 7, devType: "粉尘传感器", indicator: "粉尘浓度", unit: "mg/m³", blue: "≥4.0", yellow: "≥8.0", orange: "≥12.0", red: "≥20.0", basis: "《工作场所有害因素》GBZ 2", updater: "孙工", updateTime: "2026-01-25" },
];

const levelCell = (val: string, color: string) => (
  <span
    className="text-xs px-1.5 py-0.5 rounded"
    style={{ color, background: `rgba(0,0,0,0.2)`, border: `1px solid ${color}`, opacity: 0.9 }}
  >
    {val}
  </span>
);

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "devType", title: "设备类型", width: 130 },
  { key: "indicator", title: "监测指标", width: 120 },
  { key: "unit", title: "单位", width: 70 },
  { key: "blue", title: "蓝色预警", width: 90, render: (v) => levelCell(String(v), "var(--tech-active)") },
  { key: "yellow", title: "黄色预警", width: 90, render: (v) => levelCell(String(v), "var(--tech-warning)") },
  { key: "orange", title: "橙色预警", width: 90, render: (v) => levelCell(String(v), "#fa8c16") },
  { key: "red", title: "红色预警", width: 90, render: (v) => levelCell(String(v), "var(--tech-danger)") },
  { key: "basis", title: "依据标准", width: 200 },
  { key: "updater", title: "更新人", width: 80 },
  { key: "updateTime", title: "更新时间", width: 100 },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <button title="编辑"><Edit size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="历史"><History size={13} style={{ color: `var(--tech-cyan)` }} /></button>
      </div>
    ),
  },
];

const filterFields = [
  { key: "devType", label: "设备类型", type: "select" as const, options: [
    { label: "位移传感器", value: "displacement" }, { label: "雨量计", value: "rain" },
    { label: "瓦斯传感器", value: "gas" }, { label: "水位计", value: "water" },
  ]},
  { key: "indicator", label: "监测指标", type: "input" as const, placeholder: "请输入监测指标" },
];

export default function ThresholdMgmt() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  return (
    <div data-cmp="ThresholdMgmt" className="flex flex-col gap-3 p-4">
      {/* Level legend */}
      <div
        className="flex items-center gap-4 px-4 py-2 rounded"
        style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
      >
        <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>预警等级说明：</span>
        {[
          { level: "蓝色预警", color: "var(--tech-active)", desc: "IV级（关注）" },
          { level: "黄色预警", color: "var(--tech-warning)", desc: "III级（注意）" },
          { level: "橙色预警", color: "#fa8c16", desc: "II级（警示）" },
          { level: "红色预警", color: "var(--tech-danger)", desc: "I级（紧急）" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
            <span className="text-xs" style={{ color: `var(--tech-text)` }}>{item.level}</span>
            <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>({item.desc})</span>
          </div>
        ))}
      </div>

      <TechFilter
        fields={filterFields}
        values={filterValues}
        onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
        onSearch={() => console.log("search")}
        onReset={() => setFilterValues({})}
      />

      <TechCard
        title="预警阈值管理"
        extra={
          <button
            className="flex items-center gap-1 text-xs px-3 py-1 rounded"
            style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
          >
            <Plus size={12} />
            新增阈值配置
          </button>
        }
      >
        <TechTable columns={columns} data={thresholds} total={thresholds.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
