import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Plus, Play, Pause, Upload, RefreshCw, BarChart2, GitBranch } from "lucide-react";

type AlgoTab = "repo" | "deploy" | "monitor" | "loop";

const algoTabList = [
  { key: "repo" as AlgoTab, label: "算法模型仓库" },
  { key: "deploy" as AlgoTab, label: "算法部署管理" },
  { key: "monitor" as AlgoTab, label: "算法运行监控" },
  { key: "loop" as AlgoTab, label: "模型迭代闭环" },
];

const repoData = [
  { seq: 1, name: "地质灾害位移预测模型", version: "v3.2.1", type: "时序预测", framework: "TensorFlow", size: "128MB", accuracy: "92.3%", trainDate: "2026-02-15", author: "算法团队", status: "latest" },
  { seq: 2, name: "瓦斯浓度趋势预测", version: "v2.5.0", type: "回归预测", framework: "PyTorch", size: "64MB", accuracy: "94.7%", trainDate: "2026-01-20", author: "矿山研究院", status: "latest" },
  { seq: 3, name: "水文洪峰预测模型", version: "v1.8.3", type: "LSTM预测", framework: "Keras", size: "96MB", accuracy: "88.5%", trainDate: "2025-11-10", author: "水文所", status: "deprecated" },
  { seq: 4, name: "人员行为识别模型", version: "v4.1.0", type: "目标检测", framework: "YOLO", size: "256MB", accuracy: "96.8%", trainDate: "2026-03-01", author: "算法团队", status: "latest" },
  { seq: 5, name: "大气扩散预测模型", version: "v2.0.1", type: "物理-数据融合", framework: "Scikit", size: "32MB", accuracy: "85.2%", trainDate: "2025-10-05", author: "环境科学院", status: "testing" },
];

const deployData = [
  { seq: 1, modelName: "地质灾害位移预测模型", version: "v3.2.1", env: "生产环境", deployDate: "2026-03-05", server: "APP-SRV-01", cpu: "12%", mem: "42%", status: "running" },
  { seq: 2, modelName: "瓦斯浓度趋势预测", version: "v2.5.0", env: "生产环境", deployDate: "2026-02-10", server: "APP-SRV-02", cpu: "8%", mem: "38%", status: "running" },
  { seq: 3, modelName: "人员行为识别模型", version: "v4.1.0", env: "GPU服务器", deployDate: "2026-03-10", server: "GPU-SRV-01", cpu: "45%", mem: "68%", status: "running" },
  { seq: 4, modelName: "大气扩散预测模型", version: "v2.0.1", env: "测试环境", deployDate: "2026-03-20", server: "TEST-SRV-01", cpu: "5%", mem: "22%", status: "testing" },
];

const monitorData = [
  { seq: 1, model: "地质灾害位移预测模型", todayCalls: 2450, avgLatency: "120ms", p99Latency: "350ms", accuracy: "91.8%", drift: "0.5%", status: "normal" },
  { seq: 2, model: "瓦斯浓度趋势预测", todayCalls: 8730, avgLatency: "45ms", p99Latency: "120ms", accuracy: "94.2%", drift: "0.3%", status: "normal" },
  { seq: 3, model: "人员行为识别模型", todayCalls: 12450, avgLatency: "280ms", p99Latency: "650ms", accuracy: "94.5%", drift: "2.3%", status: "warning" },
  { seq: 4, model: "大气扩散预测模型", todayCalls: 320, avgLatency: "890ms", p99Latency: "2100ms", accuracy: "83.1%", drift: "4.7%", status: "warning" },
];

const loopData = [
  { seq: 1, model: "地质灾害位移预测模型", task: "增量训练", newSamples: "2,340", trigger: "定时触发", startTime: "2026-03-25 02:00", duration: "3.5h", oldAcc: "92.3%", newAcc: "92.8%", result: "approved" },
  { seq: 2, model: "人员行为识别模型", task: "错误样本修正", newSamples: "180", trigger: "漂移触发", startTime: "2026-03-26 00:30", duration: "1.2h", oldAcc: "94.5%", newAcc: "95.1%", result: "pending" },
  { seq: 3, model: "大气扩散预测模型", task: "全量重训练", newSamples: "15,000", trigger: "漂移触发", startTime: "2026-03-24 22:00", duration: "8.0h", oldAcc: "83.1%", newAcc: "86.2%", result: "testing" },
];

const repoColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "name", title: "模型名称", width: 200 },
  { key: "version", title: "版本", width: 80 },
  { key: "type", title: "算法类型", width: 120 },
  { key: "framework", title: "框架", width: 90 },
  { key: "size", title: "模型大小", width: 90 },
  { key: "accuracy", title: "准确率", width: 80, render: (v) => <span style={{ color: `var(--tech-cyan)` }}>{String(v)}</span> },
  { key: "trainDate", title: "训练日期", width: 110 },
  { key: "author", title: "来源", width: 100 },
  {
    key: "status",
    title: "状态",
    width: 80,
    render: (v) => {
      const m: Record<string, { l: string; c: string }> = {
        latest: { l: "最新", c: "var(--tech-success)" },
        deprecated: { l: "废弃", c: "var(--tech-danger)" },
        testing: { l: "测试中", c: "var(--tech-warning)" },
      };
      const s = m[String(v)] || m.latest;
      return <span style={{ color: s.c }}>{s.l}</span>;
    },
  },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <button title="部署"><Upload size={12} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="对比"><GitBranch size={12} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="报告"><BarChart2 size={12} style={{ color: `var(--tech-cyan)` }} /></button>
      </div>
    ),
  },
];

const deployColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "modelName", title: "模型名称", width: 200 },
  { key: "version", title: "版本", width: 80 },
  { key: "env", title: "部署环境", width: 100 },
  { key: "deployDate", title: "部署时间", width: 110 },
  { key: "server", title: "服务器", width: 110 },
  { key: "cpu", title: "CPU占用", width: 90, render: (v) => <span style={{ color: `var(--tech-cyan)` }}>{String(v)}</span> },
  { key: "mem", title: "内存占用", width: 90, render: (v) => <span style={{ color: `var(--tech-cyan)` }}>{String(v)}</span> },
  {
    key: "status",
    title: "状态",
    width: 80,
    render: (v) => (
      <span style={{ color: v === "running" ? `var(--tech-success)` : `var(--tech-warning)` }}>
        {v === "running" ? "运行中" : "测试中"}
      </span>
    ),
  },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <button title="暂停"><Pause size={12} style={{ color: `var(--tech-warning)` }} /></button>
        <button title="重启"><RefreshCw size={12} style={{ color: `var(--tech-cyan)` }} /></button>
      </div>
    ),
  },
];

const monitorColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "model", title: "模型名称", width: 200 },
  { key: "todayCalls", title: "今日调用量", width: 100 },
  { key: "avgLatency", title: "平均延迟", width: 90 },
  { key: "p99Latency", title: "P99延迟", width: 90 },
  { key: "accuracy", title: "在线准确率", width: 100, render: (v) => <span style={{ color: `var(--tech-cyan)` }}>{String(v)}</span> },
  { key: "drift", title: "漂移程度", width: 90, render: (v) => {
    const n = parseFloat(String(v));
    return <span style={{ color: n > 2 ? `var(--tech-warning)` : `var(--tech-success)` }}>{String(v)}</span>;
  }},
  {
    key: "status",
    title: "运行状态",
    width: 90,
    render: (v) => (
      <span style={{ color: v === "normal" ? `var(--tech-success)` : `var(--tech-warning)` }}>
        {v === "normal" ? "正常" : "注意"}
      </span>
    ),
  },
];

const loopColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "model", title: "模型名称", width: 180 },
  { key: "task", title: "迭代任务", width: 100 },
  { key: "newSamples", title: "新增样本", width: 90 },
  { key: "trigger", title: "触发方式", width: 90 },
  { key: "startTime", title: "开始时间", width: 140 },
  { key: "duration", title: "用时", width: 80 },
  { key: "oldAcc", title: "迭代前准确率", width: 110 },
  { key: "newAcc", title: "迭代后准确率", width: 110, render: (v) => <span style={{ color: `var(--tech-cyan)` }}>{String(v)}</span> },
  {
    key: "result",
    title: "审核结果",
    width: 90,
    render: (v) => {
      const m: Record<string, { l: string; c: string }> = {
        approved: { l: "已上线", c: "var(--tech-success)" },
        pending: { l: "待审核", c: "var(--tech-warning)" },
        testing: { l: "测试中", c: "var(--tech-cyan)" },
      };
      const s = m[String(v)] || m.pending;
      return <span style={{ color: s.c }}>{s.l}</span>;
    },
  },
  {
    key: "action",
    title: "操作",
    width: 80,
    render: () => <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>查看</button>,
  },
];

const filterFields = [
  { key: "type", label: "算法类型", type: "select" as const, options: [
    { label: "时序预测", value: "ts" }, { label: "目标检测", value: "det" },
    { label: "回归预测", value: "reg" },
  ]},
  { key: "status", label: "状态", type: "select" as const, options: [
    { label: "最新", value: "latest" }, { label: "测试中", value: "testing" }, { label: "废弃", value: "deprecated" },
  ]},
];

export default function AlgoModel() {
  const [tab, setTab] = useState<AlgoTab>("repo");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const getTableConfig = () => {
    if (tab === "repo") return { columns: repoColumns, data: repoData };
    if (tab === "deploy") return { columns: deployColumns, data: deployData };
    if (tab === "monitor") return { columns: monitorColumns, data: monitorData };
    return { columns: loopColumns, data: loopData };
  };

  const { columns, data } = getTableConfig();

  return (
    <div data-cmp="AlgoModel" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        {[
          { label: "模型总数", value: repoData.length, color: "var(--tech-cyan)" },
          { label: "已部署模型", value: deployData.length, color: "var(--tech-success)" },
          { label: "待审核迭代", value: loopData.filter((d) => d.result === "pending").length, color: "var(--tech-warning)" },
          { label: "运行异常", value: monitorData.filter((d) => d.status === "warning").length, color: "var(--tech-danger)" },
        ].map((s, idx) => (
          <div key={idx} className="flex-1 rounded p-3" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 px-1 py-1 rounded" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
        {algoTabList.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1); }}
            className="px-4 py-1.5 rounded text-xs transition-all"
            style={{
              background: tab === t.key ? `var(--tech-active)` : "transparent",
              color: tab === t.key ? `var(--tech-text)` : `var(--tech-text-dim)`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "repo" && (
        <TechFilter
          fields={filterFields}
          values={filterValues}
          onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
          onSearch={() => console.log("search")}
          onReset={() => setFilterValues({})}
        />
      )}

      <TechCard
        title={algoTabList.find((t) => t.key === tab)?.label || ""}
        extra={
          tab === "repo" ? (
            <button className="flex items-center gap-1 text-xs px-3 py-1 rounded" style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}>
              <Plus size={12} />上传模型
            </button>
          ) : undefined
        }
      >
        <TechTable columns={columns} data={data} total={data.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
