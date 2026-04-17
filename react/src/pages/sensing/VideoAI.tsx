import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const aiAlerts = [
  { seq: 1, camera: "露天煤矿采掘区", alertType: "人员越界", confidence: "96.3%", time: "2026-03-26 14:22:15", status: "unhandled", thumbnail: "mine" },
  { seq: 2, camera: "某化工厂门口摄像", alertType: "未佩戴安全帽", confidence: "98.1%", time: "2026-03-26 13:55:40", status: "handled", thumbnail: "factory" },
  { seq: 3, camera: "坪沟尾矿库坝体", alertType: "坝体裂缝异常", confidence: "88.7%", time: "2026-03-26 13:30:02", status: "processing", thumbnail: "dam" },
  { seq: 4, camera: "西河林区瞭望塔01", alertType: "烟雾/火情检测", confidence: "91.5%", time: "2026-03-26 12:18:33", status: "unhandled", thumbnail: "forest" },
  { seq: 5, camera: "南山滑坡体监测点", alertType: "坡面异常变形", confidence: "85.2%", time: "2026-03-26 11:47:20", status: "handled", thumbnail: "slope" },
];

const statItems = [
  { label: "今日AI识别次数", value: "2,847", icon: <Eye size={18} />, colorKey: "tech-cyan" },
  { label: "今日预警事件", value: "23", icon: <AlertTriangle size={18} />, colorKey: "tech-warning" },
  { label: "已处置", value: "18", icon: <CheckCircle size={18} />, colorKey: "tech-success" },
  { label: "待处置", value: "5", icon: <Clock size={18} />, colorKey: "tech-danger" },
];

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "camera", title: "摄像头", width: 160 },
  { key: "alertType", title: "识别类型", width: 130 },
  {
    key: "thumbnail",
    title: "识别截图",
    width: 100,
    render: (val) => (
      <div
        className="w-16 h-10 rounded flex items-center justify-center text-xs"
        style={{
          background: `var(--tech-input-bg)`,
          border: `1px solid var(--tech-border)`,
          color: `var(--tech-text-dim)`,
        }}
      >
        截图
      </div>
    ),
  },
  { key: "confidence", title: "置信度", width: 90 },
  { key: "time", title: "识别时间", width: 160 },
  {
    key: "status",
    title: "处理状态",
    width: 100,
    render: (val) => {
      const map: Record<string, { label: string; color: string }> = {
        unhandled: { label: "待处置", color: "var(--tech-danger)" },
        processing: { label: "处置中", color: "var(--tech-warning)" },
        handled: { label: "已处置", color: "var(--tech-success)" },
      };
      const s = map[String(val)] || map.handled;
      return <span style={{ color: s.color }}>{s.label}</span>;
    },
  },
  {
    key: "action",
    title: "操作",
    width: 120,
    render: () => (
      <div className="flex gap-2">
        <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>查看</button>
        <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>处置</button>
        <button className="text-xs" style={{ color: `var(--tech-danger)` }}>忽略</button>
      </div>
    ),
  },
];

const filterFields = [
  { key: "alertType", label: "识别类型", type: "select" as const, options: [
    { label: "人员越界", value: "border" },
    { label: "安全帽检测", value: "helmet" },
    { label: "烟雾检测", value: "smoke" },
    { label: "坝体异常", value: "dam" },
  ] },
  { key: "status", label: "处理状态", type: "select" as const, options: [
    { label: "待处置", value: "unhandled" },
    { label: "处置中", value: "processing" },
    { label: "已处置", value: "handled" },
  ] },
  { key: "startTime", label: "开始时间", type: "date" as const },
];

const aiModels = [
  { name: "人员行为识别模型", version: "v2.3.1", accuracy: "96.8%", status: "running", calls: "12,450" },
  { name: "安全防护用品检测", version: "v1.8.5", accuracy: "98.2%", status: "running", calls: "8,730" },
  { name: "烟雾火情检测模型", version: "v3.0.2", accuracy: "94.1%", status: "running", calls: "5,210" },
  { name: "坝体结构异常检测", version: "v1.5.0", accuracy: "89.3%", status: "updating", calls: "3,890" },
  { name: "坡体变形识别模型", version: "v2.1.3", accuracy: "91.6%", status: "running", calls: "2,640" },
];

export default function VideoAI() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  return (
    <div data-cmp="VideoAI" className="flex flex-col gap-3 p-4">
      {/* Stat cards */}
      <div className="flex gap-3">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 flex items-center gap-3 rounded p-3"
            style={{
              background: `var(--tech-card)`,
              border: `1px solid var(--tech-border)`,
            }}
          >
            <div
              className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: `var(--tech-cyan-dim)`,
                border: `1px solid var(--tech-border)`,
                color: idx === 0 ? `var(--tech-cyan)` : idx === 1 ? `var(--tech-warning)` : idx === 2 ? `var(--tech-success)` : `var(--tech-danger)`,
              }}
            >
              {item.icon}
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: `var(--tech-text)` }}>{item.value}</div>
              <div className="text-xs" style={{ color: `var(--tech-text-dim)` }}>{item.label}</div>
            </div>
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

      <TechCard title="AI识别预警事件列表">
        <TechTable columns={columns} data={aiAlerts} total={aiAlerts.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>

      {/* AI Models */}
      <TechCard title="AI模型运行状态">
        <div className="flex flex-col gap-2">
          {aiModels.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center px-3 py-2 rounded"
              style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
            >
              <span className="flex-1 text-xs" style={{ color: `var(--tech-text)` }}>{m.name}</span>
              <span className="text-xs w-20 text-center" style={{ color: `var(--tech-text-dim)` }}>{m.version}</span>
              <span className="text-xs w-20 text-center" style={{ color: `var(--tech-cyan)` }}>{m.accuracy}</span>
              <span className="text-xs w-24 text-center" style={{ color: `var(--tech-text-dim)` }}>调用: {m.calls}</span>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  color: m.status === "running" ? `var(--tech-success)` : `var(--tech-warning)`,
                  background: m.status === "running" ? `rgba(82,196,26,0.1)` : `rgba(250,173,20,0.1)`,
                }}
              >
                {m.status === "running" ? "运行中" : "更新中"}
              </span>
            </div>
          ))}
        </div>
      </TechCard>
    </div>
  );
}
