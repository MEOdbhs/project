import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { Plus, Edit, FileText, CheckSquare } from "lucide-react";

type TabKey = "maintenance" | "plan" | "record" | "optimize";

const tabList = [
  { key: "maintenance" as TabKey, label: "预防性维护" },
  { key: "plan" as TabKey, label: "校准计划" },
  { key: "record" as TabKey, label: "校准记录" },
  { key: "optimize" as TabKey, label: "统计优化" },
];

const maintenanceData = [
  { seq: 1, devNo: "JC-GZ-0001", devName: "太极山位移传感器01", planDate: "2026-04-12", type: "定期检测", content: "外观检查、数据校核、紧固件检查", executor: "张工", status: "pending", priority: "normal" },
  { seq: 2, devNo: "WW-SZ-0001", devName: "刘家峡水位计01", planDate: "2026-04-05", type: "预防性更换", content: "更换电池、密封圈检查", executor: "李工", status: "pending", priority: "urgent" },
  { seq: 3, devNo: "KS-WS-0001", devName: "矿区瓦斯探头01", planDate: "2026-03-30", type: "定期标定", content: "瓦斯传感器标定校准", executor: "王工", status: "completed", priority: "normal" },
  { seq: 4, devNo: "SL-WD-0001", devName: "林区温度传感器", planDate: "2026-03-28", type: "故障维修", content: "信号中断排查维修", executor: "赵工", status: "in_progress", priority: "urgent" },
  { seq: 5, devNo: "HX-QT-0001", devName: "氨气检测仪01", planDate: "2026-04-20", type: "定期检测", content: "检测精度验证、探头清洁", executor: "孙工", status: "pending", priority: "normal" },
];

const calibrationPlanData = [
  { seq: 1, devNo: "KS-WS-0001", devName: "矿区瓦斯探头01", standard: "标准气体法", cycle: "3个月", nextDate: "2026-06-22", lab: "甘肃省计量院", status: "scheduled" },
  { seq: 2, devNo: "WW-SZ-0001", devName: "刘家峡水位计01", standard: "标准液位比对法", cycle: "6个月", nextDate: "2026-05-05", lab: "现场自校", status: "scheduled" },
  { seq: 3, devNo: "JC-GZ-0001", devName: "太极山位移传感器01", standard: "基准板比对", cycle: "6个月", nextDate: "2026-07-12", lab: "现场自校", status: "scheduled" },
  { seq: 4, devNo: "HX-QT-0001", devName: "氨气检测仪01", standard: "标准气体法", cycle: "3个月", nextDate: "2026-04-01", lab: "第三方机构", status: "overdue" },
];

const calibrationRecordData = [
  { seq: 1, devNo: "KS-WS-0001", devName: "矿区瓦斯探头01", calibDate: "2026-03-22", calibBy: "王工", before: "1.3%", after: "1.0%", result: "pass", certNo: "CAL-2026-0322-001" },
  { seq: 2, devNo: "WW-SZ-0001", devName: "刘家峡水位计01", calibDate: "2026-02-05", calibBy: "李工", before: "1732.6m", after: "1732.4m", result: "pass", certNo: "CAL-2026-0205-003" },
  { seq: 3, devNo: "HX-QT-0001", devName: "氨气检测仪01", calibDate: "2025-12-01", calibBy: "第三方", before: "28ppm", after: "—", result: "fail", certNo: "—" },
];

const maintenanceColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "devNo", title: "设备编号", width: 120 },
  { key: "devName", title: "设备名称", width: 160 },
  { key: "planDate", title: "计划日期", width: 110 },
  { key: "type", title: "维护类型", width: 110 },
  { key: "content", title: "维护内容", width: 200 },
  { key: "executor", title: "执行人", width: 80 },
  {
    key: "priority",
    title: "优先级",
    width: 80,
    render: (v) => (
      <span style={{ color: v === "urgent" ? `var(--tech-danger)` : `var(--tech-text-dim)` }}>
        {v === "urgent" ? "紧急" : "普通"}
      </span>
    ),
  },
  {
    key: "status",
    title: "状态",
    width: 90,
    render: (v) => {
      const m: Record<string, { l: string; c: string }> = {
        pending: { l: "待执行", c: "var(--tech-text-dim)" },
        in_progress: { l: "执行中", c: "var(--tech-warning)" },
        completed: { l: "已完成", c: "var(--tech-success)" },
      };
      const s = m[String(v)] || m.pending;
      return <span style={{ color: s.c }}>{s.l}</span>;
    },
  },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <button title="编辑"><Edit size={13} style={{ color: `var(--tech-cyan)` }} /></button>
        <button title="完成"><CheckSquare size={13} style={{ color: `var(--tech-success)` }} /></button>
        <button title="报告"><FileText size={13} style={{ color: `var(--tech-cyan)` }} /></button>
      </div>
    ),
  },
];

const planColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "devNo", title: "设备编号", width: 120 },
  { key: "devName", title: "设备名称", width: 160 },
  { key: "standard", title: "校准方法", width: 140 },
  { key: "cycle", title: "校准周期", width: 90 },
  { key: "nextDate", title: "下次校准日期", width: 120 },
  { key: "lab", title: "校准机构", width: 120 },
  {
    key: "status",
    title: "状态",
    width: 90,
    render: (v) => (
      <span style={{ color: v === "overdue" ? `var(--tech-danger)` : `var(--tech-success)` }}>
        {v === "overdue" ? "已逾期" : "已安排"}
      </span>
    ),
  },
  {
    key: "action",
    title: "操作",
    width: 80,
    render: () => (
      <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>调整</button>
    ),
  },
];

const recordColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "devNo", title: "设备编号", width: 120 },
  { key: "devName", title: "设备名称", width: 160 },
  { key: "calibDate", title: "校准日期", width: 110 },
  { key: "calibBy", title: "校准人", width: 90 },
  { key: "before", title: "校准前读数", width: 110 },
  { key: "after", title: "校准后读数", width: 110 },
  {
    key: "result",
    title: "校准结果",
    width: 90,
    render: (v) => (
      <span style={{ color: v === "pass" ? `var(--tech-success)` : `var(--tech-danger)` }}>
        {v === "pass" ? "合格" : "不合格"}
      </span>
    ),
  },
  { key: "certNo", title: "证书编号", width: 160 },
  {
    key: "action",
    title: "操作",
    width: 80,
    render: () => <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>查看</button>,
  },
];

const filterFields = [
  { key: "devNo", label: "设备编号", type: "input" as const, placeholder: "请输入设备编号" },
  { key: "status", label: "状态", type: "select" as const, options: [
    { label: "待执行", value: "pending" }, { label: "执行中", value: "in_progress" }, { label: "已完成", value: "completed" },
  ]},
];

export default function MaintenanceCalibration() {
  const [tab, setTab] = useState<TabKey>("maintenance");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const statsItems = [
    { label: "本月待维护", value: 3, color: "var(--tech-cyan)" },
    { label: "逾期未校准", value: 1, color: "var(--tech-danger)" },
    { label: "本月已完成", value: 4, color: "var(--tech-success)" },
    { label: "计划执行率", value: "92%", color: "var(--tech-warning)" },
  ];

  const getTableData = () => {
    if (tab === "maintenance") return maintenanceData;
    if (tab === "plan") return calibrationPlanData;
    if (tab === "record") return calibrationRecordData;
    return [];
  };

  const getColumns = () => {
    if (tab === "maintenance") return maintenanceColumns;
    if (tab === "plan") return planColumns;
    if (tab === "record") return recordColumns;
    return maintenanceColumns;
  };

  return (
    <div data-cmp="MaintenanceCalibration" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        {statsItems.map((s, idx) => (
          <div
            key={idx}
            className="flex-1 rounded p-3"
            style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
          >
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-1 px-1 py-1 rounded"
        style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
      >
        {tabList.map((t) => (
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

      {tab !== "optimize" && (
        <>
          <TechFilter
            fields={filterFields}
            values={filterValues}
            onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
            onSearch={() => console.log("search")}
            onReset={() => setFilterValues({})}
          />
          <TechCard
            title={tabList.find((t) => t.key === tab)?.label || ""}
            extra={
              <button
                className="flex items-center gap-1 text-xs px-3 py-1 rounded"
                style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
              >
                <Plus size={12} />新增
              </button>
            }
          >
            <TechTable columns={getColumns()} data={getTableData()} total={getTableData().length} page={page} pageSize={10} onPageChange={setPage} />
          </TechCard>
        </>
      )}

      {tab === "optimize" && (
        <TechCard title="统计与优化建议">
          <div className="flex flex-col gap-3">
            <div
              className="rounded p-3"
              style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: `var(--tech-cyan)` }}>维护计划执行统计（近6个月）</p>
              <div className="flex gap-4">
                {["1月", "2月", "3月", "4月", "5月", "6月"].map((m, idx) => {
                  const vals = [90, 88, 92, 85, 94, 91];
                  return (
                    <div key={m} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-xs" style={{ color: `var(--tech-cyan)` }}>{vals[idx]}%</span>
                      <div className="w-full" style={{ height: 60, background: `var(--tech-input-bg)`, borderRadius: 3, position: "relative" }}>
                        <div
                          style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            height: `${vals[idx]}%`,
                            background: `var(--tech-active)`,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium" style={{ color: `var(--tech-text)` }}>AI优化建议</p>
              {[
                "氨气检测仪01已逾期校准，建议立即安排校准，避免监测数据失准导致误判",
                "刘家峡水位计保修截止日期将至，建议提前评估是否续保或更换",
                "林区温度传感器频繁离线，建议检查供电设施及信号中继设备",
                "瓦斯探头01当前校准周期为3个月，建议结合使用强度评估是否缩短至2个月",
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 px-3 py-2 rounded text-xs"
                  style={{ background: `rgba(22,119,255,0.05)`, border: `1px solid rgba(22,119,255,0.2)` }}
                >
                  <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: `var(--tech-cyan)` }}>AI</span>
                  <span style={{ color: `var(--tech-text)` }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </TechCard>
      )}
    </div>
  );
}
