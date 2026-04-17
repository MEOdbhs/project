import { useState } from "react";
import React from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Package, Wrench, RotateCcw, Trash2 } from "lucide-react";

const lifecycleData = [
  { seq: 1, devNo: "JC-GZ-0001", devName: "太极山位移传感器01", stage: "运行", installDate: "2023-05-12", warrantyEnd: "2025-05-12", lifeYear: 5, age: "2.8年", health: 85, maintenance: 8, nextMaintenance: "2026-04-12" },
  { seq: 2, devNo: "JC-GZ-0002", devName: "南山雨量计", stage: "运行", installDate: "2023-06-20", warrantyEnd: "2025-06-20", lifeYear: 5, age: "2.7年", health: 78, maintenance: 6, nextMaintenance: "2026-04-20" },
  { seq: 3, devNo: "WW-SZ-0001", devName: "刘家峡水位计01", stage: "运行", installDate: "2022-11-05", warrantyEnd: "2024-11-05", lifeYear: 6, age: "3.4年", health: 72, maintenance: 12, nextMaintenance: "2026-04-05" },
  { seq: 4, devNo: "SL-WD-0001", devName: "西河林区温度传感器", stage: "维修", installDate: "2023-08-15", warrantyEnd: "2025-08-15", lifeYear: 5, age: "2.6年", health: 35, maintenance: 4, nextMaintenance: "—" },
  { seq: 5, devNo: "KS-WS-0001", devName: "盐锅峡矿区瓦斯探头01", stage: "运行", installDate: "2023-03-22", warrantyEnd: "2025-03-22", lifeYear: 4, age: "3.0年", health: 60, maintenance: 9, nextMaintenance: "2026-04-22" },
  { seq: 6, devNo: "OLD-GZ-0001", devName: "废弃位移传感器(旧)", stage: "报废", installDate: "2019-01-01", warrantyEnd: "2021-01-01", lifeYear: 5, age: "7.2年", health: 0, maintenance: 22, nextMaintenance: "—" },
];

const stageColorMap: Record<string, string> = {
  运行: "var(--tech-success)",
  维修: "var(--tech-warning)",
  报废: "var(--tech-danger)",
  入库: "var(--tech-cyan)",
};

const stageIconMap: Record<string, React.ReactElement> = {
  运行: <Package size={12} />,
  维修: <Wrench size={12} />,
  报废: <Trash2 size={12} />,
  入库: <RotateCcw size={12} />,
};

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "devNo", title: "设备编号", width: 120 },
  { key: "devName", title: "设备名称", width: 180 },
  {
    key: "stage",
    title: "生命周期阶段",
    width: 110,
    render: (v) => (
      <div className="flex items-center gap-1.5">
        <span style={{ color: stageColorMap[String(v)] || "var(--tech-text)" }}>{stageIconMap[String(v)]}</span>
        <span style={{ color: stageColorMap[String(v)] || "var(--tech-text)" }}>{String(v)}</span>
      </div>
    ),
  },
  { key: "installDate", title: "安装日期", width: 110 },
  { key: "warrantyEnd", title: "保修截止", width: 110 },
  { key: "age", title: "已用年限", width: 90 },
  {
    key: "health",
    title: "健康度",
    width: 110,
    render: (v) => {
      const n = Number(v);
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `var(--tech-input-bg)` }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${n}%`,
                background: n >= 70 ? `var(--tech-success)` : n >= 40 ? `var(--tech-warning)` : `var(--tech-danger)`,
              }}
            />
          </div>
          <span className="text-xs" style={{ color: n >= 70 ? `var(--tech-success)` : n >= 40 ? `var(--tech-warning)` : `var(--tech-danger)` }}>
            {n}%
          </span>
        </div>
      );
    },
  },
  { key: "maintenance", title: "累计维护次数", width: 100 },
  { key: "nextMaintenance", title: "下次维护", width: 110 },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>查看</button>
        <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>变更</button>
      </div>
    ),
  },
];

const filterFields = [
  { key: "stage", label: "生命周期阶段", type: "select" as const, options: [
    { label: "入库", value: "入库" }, { label: "运行", value: "运行" },
    { label: "维修", value: "维修" }, { label: "报废", value: "报废" },
  ]},
  { key: "devNo", label: "设备编号", type: "input" as const, placeholder: "请输入设备编号" },
];

export default function DeviceLifecycle() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const stages = ["运行", "维修", "报废", "入库"];
  return (
    <div data-cmp="DeviceLifecycle" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        {stages.map((s) => {
          const count = lifecycleData.filter((d) => d.stage === s).length;
          return (
            <div
              key={s}
              className="flex-1 rounded p-3 flex flex-col gap-1"
              style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
            >
              <span className="text-2xl font-bold" style={{ color: stageColorMap[s] }}>{count}</span>
              <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>{s}阶段</span>
            </div>
          );
        })}
      </div>

      <TechFilter
        fields={filterFields}
        values={filterValues}
        onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
        onSearch={() => console.log("search")}
        onReset={() => setFilterValues({})}
      />

      <TechCard title="设备生命周期管理">
        <TechTable columns={columns} data={lifecycleData} total={lifecycleData.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
