import { useState } from "react";
import TechCard from "../../components/TechCard";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechFilter from "../../components/TechFilter";
import { CheckCircle, Clock, AlertTriangle, Users, ArrowRight, FileText } from "lucide-react";

const closedLoopData = [
  { seq: 1, warnId: "W2026-0328-001", warnType: "地质灾害", level: "red", site: "太极山滑坡体", createTime: "2026-03-28 08:12", responder: "张工程师", disposeTime: "2026-03-28 09:05", closeTime: "2026-03-28 15:30", status: "closed", resolution: "已撤离受影响居民12户，设置警戒线" },
  { seq: 2, warnId: "W2026-0327-003", warnType: "矿山安全", level: "orange", site: "盐锅峡矿区3号井", createTime: "2026-03-27 14:33", responder: "王矿长", disposeTime: "2026-03-27 15:00", closeTime: "2026-03-27 18:45", status: "closed", resolution: "停产检修，更换瓦斯探头" },
  { seq: 3, warnId: "W2026-0329-005", warnType: "水文洪水", level: "yellow", site: "刘家峡河道", createTime: "2026-03-29 06:00", responder: "李监测员", disposeTime: "2026-03-29 06:30", closeTime: "—", status: "processing", resolution: "持续监测中，通知下游居民注意" },
  { seq: 4, warnId: "W2026-0329-008", warnType: "危化品泄漏", level: "red", site: "永靖化工厂区", createTime: "2026-03-29 10:22", responder: "刘厂长", disposeTime: "2026-03-29 10:40", closeTime: "—", status: "processing", resolution: "已启动应急预案，消防队到场处置" },
  { seq: 5, warnId: "W2026-0326-002", warnType: "森林火险", level: "yellow", site: "西河林区", createTime: "2026-03-26 13:15", responder: "赵监察员", disposeTime: "—", closeTime: "—", status: "pending", resolution: "—" },
];

const levelMap: Record<string, { label: string; color: string }> = {
  red: { label: "红色", color: "var(--tech-danger)" },
  orange: { label: "橙色", color: "#fa8c16" },
  yellow: { label: "黄色", color: "var(--tech-warning)" },
  blue: { label: "蓝色", color: "var(--tech-active)" },
};

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "待响应", color: "var(--tech-danger)" },
  processing: { label: "处置中", color: "var(--tech-warning)" },
  closed: { label: "已闭环", color: "var(--tech-success)" },
};

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "warnId", title: "预警编号", width: 150 },
  { key: "warnType", title: "预警类型", width: 100 },
  {
    key: "level",
    title: "预警等级",
    width: 90,
    render: (v) => {
      const s = levelMap[String(v)] || levelMap.blue;
      return (
        <span className="text-xs px-2 py-0.5 rounded" style={{ color: s.color, border: `1px solid ${s.color}`, background: `rgba(0,0,0,0.2)` }}>
          {s.label}
        </span>
      );
    },
  },
  { key: "site", title: "预警地点", width: 150 },
  { key: "createTime", title: "产生时间", width: 140 },
  { key: "responder", title: "负责人", width: 90 },
  { key: "disposeTime", title: "响应时间", width: 140 },
  { key: "closeTime", title: "闭环时间", width: 140 },
  {
    key: "status",
    title: "处置状态",
    width: 90,
    render: (v) => {
      const s = statusMap[String(v)] || statusMap.pending;
      return <span style={{ color: s.color }}>{s.label}</span>;
    },
  },
  { key: "resolution", title: "处置措施", width: 200 },
  {
    key: "action",
    title: "操作",
    width: 80,
    render: () => <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>详情</button>,
  },
];

const filterFields = [
  { key: "status", label: "处置状态", type: "select" as const, options: [
    { label: "待响应", value: "pending" }, { label: "处置中", value: "processing" }, { label: "已闭环", value: "closed" },
  ]},
  { key: "level", label: "预警等级", type: "select" as const, options: [
    { label: "红色", value: "red" }, { label: "橙色", value: "orange" },
    { label: "黄色", value: "yellow" }, { label: "蓝色", value: "blue" },
  ]},
  { key: "warnType", label: "预警类型", type: "input" as const, placeholder: "请输入预警类型" },
];

export default function WarningClosedLoop() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const pending = closedLoopData.filter((d) => d.status === "pending").length;
  const processing = closedLoopData.filter((d) => d.status === "processing").length;
  const closed = closedLoopData.filter((d) => d.status === "closed").length;

  return (
    <div data-cmp="WarningClosedLoop" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        {[
          { label: "待响应预警", value: pending, icon: <AlertTriangle size={16} />, color: "var(--tech-danger)" },
          { label: "处置中", value: processing, icon: <Clock size={16} />, color: "var(--tech-warning)" },
          { label: "已闭环", value: closed, icon: <CheckCircle size={16} />, color: "var(--tech-success)" },
          { label: "平均响应时长", value: "23分钟", icon: <Users size={16} />, color: "var(--tech-cyan)" },
        ].map((s, idx) => (
          <div key={idx} className="flex-1 rounded p-3 flex items-center gap-3" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
            <span style={{ color: s.color }}>{s.icon}</span>
            <div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: `var(--tech-text-dim)` }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Process flow */}
      <div className="rounded p-3 flex items-center justify-center gap-2" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
        <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>处置流程：</span>
        {[
          { step: "预警触发", icon: <AlertTriangle size={12} />, color: "var(--tech-danger)" },
          { step: "推送通知", icon: <Users size={12} />, color: "var(--tech-warning)" },
          { step: "接警确认", icon: <CheckCircle size={12} />, color: "var(--tech-active)" },
          { step: "应急响应", icon: <Clock size={12} />, color: "var(--tech-cyan)" },
          { step: "处置措施", icon: <FileText size={12} />, color: "var(--tech-cyan)" },
          { step: "闭环归档", icon: <CheckCircle size={12} />, color: "var(--tech-success)" },
        ].map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs" style={{ color: s.color }}>
              {s.icon}
              <span>{s.step}</span>
            </div>
            {idx < 5 && <ArrowRight size={12} style={{ color: `var(--tech-text-dim)` }} />}
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

      <TechCard title="预警闭环与处置流程记录">
        <TechTable columns={columns} data={closedLoopData} total={closedLoopData.length} page={page} pageSize={10} onPageChange={setPage} />
      </TechCard>
    </div>
  );
}
