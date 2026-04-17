import { useState } from "react";
import TechFilter from "../../components/TechFilter";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechCard from "../../components/TechCard";
import { RefreshCw, List, LayoutList, Settings } from "lucide-react";

const filterFields = [
  {
    key: "mineType",
    label: "矿山类型",
    type: "select" as const,
    options: [
      { label: "露天煤矿", value: "openCast" },
      { label: "地下煤矿", value: "underground" },
      { label: "尾矿库", value: "tailings" },
    ],
  },
  { key: "companyName", label: "企业名称", type: "input" as const, placeholder: "请输入企业名称" },
  {
    key: "warnSource",
    label: "预警来源",
    type: "select" as const,
    options: [
      { label: "传感器", value: "sensor" },
      { label: "视频AI", value: "videoAI" },
      { label: "人工上报", value: "manual" },
    ],
  },
];

const warningData = [
  {
    seq: 1,
    mineType: "露天煤矿",
    companyName: "公司名称公司名称",
    deviceType: "预警监控设...",
    deviceName: "设备名称设备名称",
    deviceNo: "NO99",
    warnInfo: "异常异常异常异常",
    warnLevel: "red",
    warnTime: "2026-03-26 14:17:03",
    progress: "已解除",
    isClosed: "是",
  },
  {
    seq: 2,
    mineType: "尾矿库",
    companyName: "某矿业有限公司",
    deviceType: "液位传感器",
    deviceName: "坝体液位监测A",
    deviceNo: "LV002",
    warnInfo: "液位超过警戒值",
    warnLevel: "orange",
    warnTime: "2026-03-26 13:45:22",
    progress: "处置中",
    isClosed: "否",
  },
  {
    seq: 3,
    mineType: "地下煤矿",
    companyName: "华煤矿业集团",
    deviceType: "瓦斯传感器",
    deviceName: "02巷道瓦斯监测",
    deviceNo: "GS003",
    warnInfo: "瓦斯浓度超标",
    warnLevel: "red",
    warnTime: "2026-03-26 12:30:10",
    progress: "已处置",
    isClosed: "是",
  },
  {
    seq: 4,
    mineType: "露天煤矿",
    companyName: "西部煤炭有限公司",
    deviceType: "位移传感器",
    deviceName: "北坡位移监测B",
    deviceNo: "DS004",
    warnInfo: "坡体位移超阈值",
    warnLevel: "yellow",
    warnTime: "2026-03-26 11:20:45",
    progress: "待处置",
    isClosed: "否",
  },
];

const columns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "mineType", title: "矿山类型", width: 100 },
  { key: "companyName", title: "企业名称", width: 140 },
  { key: "deviceType", title: "设备类型", width: 120 },
  { key: "deviceName", title: "设备名称", width: 140 },
  { key: "deviceNo", title: "设备编号", width: 80 },
  { key: "warnInfo", title: "预警信息", width: 140 },
  {
    key: "warnLevel",
    title: "预警等级",
    width: 90,
    render: (val) => {
      const map: Record<string, { label: string; bg: string; color: string }> = {
        red: { label: "红色预警", bg: "var(--tech-danger)", color: "var(--tech-text)" },
        orange: { label: "橙色预警", bg: "#fa8c16", color: "var(--tech-text)" },
        yellow: { label: "黄色预警", bg: "var(--tech-warning)", color: "var(--tech-text)" },
        blue: { label: "蓝色预警", bg: "var(--tech-active)", color: "var(--tech-text)" },
      };
      const s = map[String(val)] || map.blue;
      return (
        <span
          className="px-2 py-0.5 rounded text-xs badge-pulse"
          style={{ background: s.bg, color: s.color }}
        >
          {s.label}
        </span>
      );
    },
  },
  { key: "warnTime", title: "预警时间", width: 160 },
  { key: "progress", title: "处置进度", width: 90 },
  { key: "isClosed", title: "是否闭签", width: 80 },
  {
    key: "action",
    title: "操作",
    width: 100,
    render: () => (
      <div className="flex items-center gap-2">
        <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>
          查看
        </button>
        <button className="text-xs" style={{ color: `var(--tech-cyan)` }}>
          处置
        </button>
      </div>
    ),
  },
];

export default function OnlineWarning() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  return (
    <div data-cmp="OnlineWarning" className="flex flex-col gap-3 p-4">
      <TechFilter
        fields={filterFields}
        values={filterValues}
        onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
        onSearch={() => console.log("search", filterValues)}
        onReset={() => setFilterValues({})}
      />

      <TechCard
        title="在线监测预警"
        extra={
          <div className="flex items-center gap-2">
            <button style={{ color: `var(--tech-text-dim)` }}><RefreshCw size={14} /></button>
            <button style={{ color: `var(--tech-text-dim)` }}><List size={14} /></button>
            <button style={{ color: `var(--tech-text-dim)` }}><Settings size={14} /></button>
          </div>
        }
      >
        <TechTable
          columns={columns}
          data={warningData}
          total={1}
          page={page}
          pageSize={10}
          onPageChange={setPage}
        />
      </TechCard>
    </div>
  );
}
