import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Play, Pause, RefreshCw, FileText } from "lucide-react";

const patrolTasks = [
  { seq: 1, taskName: "地质灾害监测点数据完整性巡查", type: "completeness", frequency: "每小时", lastRun: "2026-03-26 14:00:00", nextRun: "2026-03-26 15:00:00", status: "running", issues: 2 },
  { seq: 2, taskName: "水文站数据异常值检测", type: "anomaly", frequency: "每30分钟", lastRun: "2026-03-26 13:30:00", nextRun: "2026-03-26 14:00:00", status: "running", issues: 0 },
  { seq: 3, taskName: "矿山传感器设备离线检测", type: "offline", frequency: "每10分钟", lastRun: "2026-03-26 13:50:00", nextRun: "2026-03-26 14:00:00", status: "running", issues: 5 },
  { seq: 4, taskName: "森林防火数据一致性校验", type: "consistency", frequency: "每天06:00", lastRun: "2026-03-26 06:00:00", nextRun: "2026-03-27 06:00:00", status: "paused", issues: 0 },
  { seq: 5, taskName: "危化品传感器数据质量巡查", type: "quality", frequency: "每2小时", lastRun: "2026-03-26 12:00:00", nextRun: "2026-03-26 14:00:00", status: "running", issues: 1 },
];

const issueRecords = [
  { seq: 1, task: "地质灾害监测点数据完整性巡查", device: "JC-GZ-0023", issue: "数据缺失超过30分钟", time: "2026-03-26 13:22:00", severity: "medium", handled: "否" },
  { seq: 2, task: "地质灾害监测点数据完整性巡查", device: "JC-GZ-0047", issue: "连续3次数据为空", time: "2026-03-26 13:45:00", severity: "high", handled: "否" },
  { seq: 3, task: "矿山传感器设备离线检测", device: "MT-SN-0102", issue: "设备离线超过1小时", time: "2026-03-26 12:50:00", severity: "high", handled: "是" },
  { seq: 4, task: "矿山传感器设备离线检测", device: "MT-SN-0234", issue: "设备通信中断", time: "2026-03-26 13:10:00", severity: "medium", handled: "否" },
  { seq: 5, task: "危化品传感器数据质量巡查", device: "CH-SN-0056", issue: "数据波动异常超出3σ", time: "2026-03-26 14:05:00", severity: "low", handled: "否" },
];

const taskColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "taskName", title: "任务名称", width: 240 },
  { key: "type", title: "巡查类型", width: 100, render: (v) => {
    const map: Record<string, string> = { completeness: "完整性", anomaly: "异常检测", offline: "离线检测", consistency: "一致性", quality: "质量校验" };
    return <span style={{ color: `var(--tech-cyan)` }}>{map[String(v)] || String(v)}</span>;
  }},
  { key: "frequency", title: "巡查频率", width: 100 },
  { key: "lastRun", title: "上次执行", width: 160 },
  { key: "nextRun", title: "下次执行", width: 160 },
  {
    key: "status",
    title: "状态",
    width: 90,
    render: (v) => (
      <span style={{ color: v === "running" ? `var(--tech-success)` : `var(--tech-text-dim)` }}>
        {v === "running" ? "运行中" : "已暂停"}
      </span>
    ),
  },
  { key: "issues", title: "发现问题", width: 80, render: (v) => (
    <span style={{ color: Number(v) > 0 ? `var(--tech-danger)` : `var(--tech-success)` }}>{Number(v) > 0 ? `${v}个问题` : "正常"}</span>
  )},
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <button title="暂停/启动"><Play size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="立即执行"><RefreshCw size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="报告"><FileText size={13} style={{ color: `var(--tech-cyan)` }} /></button>
      </div>
    ),
  },
];

const issueColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "task", title: "所属任务", width: 200 },
  { key: "device", title: "设备编号", width: 120 },
  { key: "issue", title: "问题描述", width: 180 },
  { key: "time", title: "发现时间", width: 160 },
  {
    key: "severity",
    title: "严重程度",
    width: 90,
    render: (v) => {
      const m: Record<string, { l: string; c: string }> = {
        high: { l: "严重", c: "var(--tech-danger)" },
        medium: { l: "一般", c: "var(--tech-warning)" },
        low: { l: "轻微", c: "var(--tech-success)" },
      };
      const s = m[String(v)] || m.low;
      return <span style={{ color: s.c }}>{s.l}</span>;
    },
  },
  { key: "handled", title: "是否处理", width: 80 },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>处理</button>
    ),
  },
];

const filterFields = [
  { key: "type", label: "巡查类型", type: "select" as const, options: [
    { label: "完整性", value: "completeness" }, { label: "异常检测", value: "anomaly" },
    { label: "离线检测", value: "offline" }, { label: "一致性", value: "consistency" },
  ]},
  { key: "status", label: "任务状态", type: "select" as const, options: [
    { label: "运行中", value: "running" }, { label: "已暂停", value: "paused" },
  ]},
];

export default function DataPatrol() {
  const [tab, setTab] = useState<"tasks" | "issues">("tasks");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const statsData = [
    { label: "巡查任务总数", value: "5", color: "var(--tech-cyan)" },
    { label: "运行中任务", value: "4", color: "var(--tech-success)" },
    { label: "今日发现问题", value: "8", color: "var(--tech-danger)" },
    { label: "已处理问题", value: "3", color: "var(--tech-warning)" },
  ];

  return (
    <div data-cmp="DataPatrol" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        {statsData.map((s, idx) => (
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

      <div className="flex gap-2">
        {(["tasks", "issues"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded text-xs transition-all"
            style={{
              background: tab === t ? `var(--tech-active)` : `var(--tech-card)`,
              color: tab === t ? `var(--tech-text)` : `var(--tech-text-dim)`,
              border: `1px solid var(--tech-border)`,
            }}
          >
            {t === "tasks" ? "巡查任务管理" : "问题记录"}
          </button>
        ))}
      </div>

      <TechFilter
        fields={filterFields}
        values={filterValues}
        onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
        onSearch={() => console.log("search")}
        onReset={() => setFilterValues({})}
      />

      <TechCard title={tab === "tasks" ? "数据智能巡查任务" : "发现问题记录"}>
        <TechTable
          columns={tab === "tasks" ? taskColumns : issueColumns}
          data={tab === "tasks" ? patrolTasks : issueRecords}
          total={tab === "tasks" ? patrolTasks.length : issueRecords.length}
          page={page}
          pageSize={10}
          onPageChange={setPage}
        />
      </TechCard>
    </div>
  );
}
