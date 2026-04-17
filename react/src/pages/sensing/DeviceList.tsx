import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Plus, Edit, Trash2, Activity } from "lucide-react";

const devices = [
  { seq: 1, devNo: "JC-GZ-0001", devName: "太极山位移传感器01", devType: "位移传感器", category: "地质灾害", location: "太极山北坡", manufacturer: "海拓仪器", installDate: "2023-05-12", status: "online", signalStrength: 92 },
  { seq: 2, devNo: "JC-GZ-0002", devName: "南山滑坡体雨量计", devType: "雨量计", category: "地质灾害", location: "南山滑坡体", manufacturer: "福克斯", installDate: "2023-06-20", status: "online", signalStrength: 87 },
  { seq: 3, devNo: "WW-SZ-0001", devName: "刘家峡水位计01", devType: "水位计", category: "水文", location: "刘家峡水库", manufacturer: "华仪仪器", installDate: "2022-11-05", status: "online", signalStrength: 95 },
  { seq: 4, devNo: "SL-WD-0001", devName: "西河林区温度传感器", devType: "温湿度传感器", category: "森林防火", location: "西河林区", manufacturer: "海拓仪器", installDate: "2023-08-15", status: "offline", signalStrength: 0 },
  { seq: 5, devNo: "KS-WS-0001", devName: "盐锅峡矿区瓦斯探头01", devType: "瓦斯传感器", category: "矿山", location: "02巷道进风口", manufacturer: "安科瑞", installDate: "2023-03-22", status: "online", signalStrength: 78 },
  { seq: 6, devNo: "HX-QT-0001", devName: "永靖化工氨气检测仪", devType: "有毒气体传感器", category: "危化品", location: "仓储区域", manufacturer: "科思仪器", installDate: "2023-09-01", status: "warning", signalStrength: 55 },
  { seq: 7, devNo: "GD-FB-0001", devName: "工业园区粉尘检测仪", devType: "粉尘传感器", category: "工贸", location: "生产车间A", manufacturer: "环科仪器", installDate: "2024-01-10", status: "online", signalStrength: 90 },
];

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "devNo", title: "设备编号", width: 120 },
  { key: "devName", title: "设备名称", width: 180 },
  { key: "devType", title: "设备类型", width: 120 },
  { key: "category", title: "所属类别", width: 100 },
  { key: "location", title: "安装位置", width: 140 },
  { key: "manufacturer", title: "厂商", width: 100 },
  { key: "installDate", title: "安装日期", width: 110 },
  {
    key: "status",
    title: "设备状态",
    width: 90,
    render: (v) => {
      const m: Record<string, { l: string; c: string }> = {
        online: { l: "在线", c: "var(--tech-success)" },
        offline: { l: "离线", c: "var(--tech-danger)" },
        warning: { l: "告警", c: "var(--tech-warning)" },
      };
      const s = m[String(v)] || m.online;
      return (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.c }} />
          <span style={{ color: s.c }}>{s.l}</span>
        </div>
      );
    },
  },
  {
    key: "signalStrength",
    title: "信号强度",
    width: 100,
    render: (v) => {
      const n = Number(v);
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `var(--tech-input-bg)` }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${n}%`,
                background: n >= 80 ? `var(--tech-success)` : n >= 50 ? `var(--tech-warning)` : `var(--tech-danger)`,
              }}
            />
          </div>
          <span className="text-xs w-8" style={{ color: `var(--tech-text-dim)` }}>{n}%</span>
        </div>
      );
    },
  },
  {
    key: "action",
    title: "操作",
    width: 120,
    render: () => (
      <div className="flex gap-2">
        <button title="查看实时数据"><Activity size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="编辑"><Edit size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="删除"><Trash2 size={13} style={{ color: `var(--tech-danger)` }} /></button>
      </div>
    ),
  },
];

const filterFields = [
  { key: "category", label: "所属类别", type: "select" as const, options: [
    { label: "地质灾害", value: "geology" }, { label: "水文", value: "hydro" },
    { label: "森林防火", value: "forest" }, { label: "矿山", value: "mine" },
    { label: "危化品", value: "chemical" }, { label: "工贸", value: "industry" },
  ]},
  { key: "status", label: "设备状态", type: "select" as const, options: [
    { label: "在线", value: "online" }, { label: "离线", value: "offline" }, { label: "告警", value: "warning" },
  ]},
  { key: "devNo", label: "设备编号", type: "input" as const, placeholder: "请输入设备编号" },
];

export default function DeviceList() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  return (
    <div data-cmp="DeviceList" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        {[
          { label: "设备总数", value: devices.length, color: "var(--tech-cyan)" },
          { label: "在线设备", value: devices.filter((d) => d.status === "online").length, color: "var(--tech-success)" },
          { label: "离线设备", value: devices.filter((d) => d.status === "offline").length, color: "var(--tech-danger)" },
          { label: "告警设备", value: devices.filter((d) => d.status === "warning").length, color: "var(--tech-warning)" },
        ].map((s, idx) => (
          <div
            key={idx}
            className="flex-1 rounded p-3 flex flex-col gap-1"
            style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
          >
            <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>{s.label}</span>
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
        title="监测监控设备列表"
        extra={
          <button
            className="flex items-center gap-1 text-xs px-3 py-1 rounded"
            style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
          >
            <Plus size={12} />
            新增设备
          </button>
        }
      >
        <TechTable columns={columns} data={devices} total={devices.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
