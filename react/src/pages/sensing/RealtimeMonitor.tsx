import { useState } from "react";
import TechFilter from "../../components/TechFilter";
import TechTable, { ColumnDef } from "../../components/TechTable";
import TechCard from "../../components/TechCard";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";

type RealtimeTab = "geology" | "hydro" | "forest" | "industry" | "chemical" | "mine";

const tabs: { key: RealtimeTab; label: string }[] = [
  { key: "geology", label: "地质灾害" },
  { key: "hydro", label: "水文" },
  { key: "industry", label: "工贸" },
  { key: "chemical", label: "危险化学品" },
  { key: "forest", label: "森林防火" },
  { key: "mine", label: "矿山" },
];

const statCards: Record<RealtimeTab, { label: string; value: string; unit: string; trend: "up" | "down" | "flat"; status: "normal" | "warn" | "danger" }[]> = {
  geology: [
    { label: "监测点总数", value: "128", unit: "个", trend: "flat", status: "normal" },
    { label: "在线监测点", value: "121", unit: "个", trend: "up", status: "normal" },
    { label: "今日预警次数", value: "3", unit: "次", trend: "up", status: "warn" },
    { label: "异常点位", value: "7", unit: "个", trend: "down", status: "danger" },
  ],
  hydro: [
    { label: "水文站总数", value: "56", unit: "个", trend: "flat", status: "normal" },
    { label: "在线水文站", value: "54", unit: "个", trend: "up", status: "normal" },
    { label: "平均水位", value: "3.24", unit: "m", trend: "up", status: "warn" },
    { label: "超警戒站", value: "2", unit: "个", trend: "down", status: "danger" },
  ],
  forest: [
    { label: "监测站总数", value: "89", unit: "个", trend: "flat", status: "normal" },
    { label: "高火险区域", value: "12", unit: "处", trend: "up", status: "warn" },
    { label: "今日火情", value: "0", unit: "起", trend: "flat", status: "normal" },
    { label: "平均温度", value: "28.6", unit: "°C", trend: "up", status: "warn" },
  ],
  industry: [
    { label: "监测企业", value: "234", unit: "家", trend: "flat", status: "normal" },
    { label: "在线监测", value: "218", unit: "家", trend: "up", status: "normal" },
    { label: "今日预警", value: "5", unit: "条", trend: "up", status: "warn" },
    { label: "重大隐患", value: "3", unit: "处", trend: "down", status: "danger" },
  ],
  chemical: [
    { label: "企业总数", value: "67", unit: "家", trend: "flat", status: "normal" },
    { label: "在线监测", value: "65", unit: "家", trend: "up", status: "normal" },
    { label: "气体超标", value: "1", unit: "处", trend: "down", status: "danger" },
    { label: "今日预警", value: "2", unit: "条", trend: "up", status: "warn" },
  ],
  mine: [
    { label: "矿山总数", value: "43", unit: "个", trend: "flat", status: "normal" },
    { label: "在线监测", value: "43", unit: "个", trend: "flat", status: "normal" },
    { label: "今日预警", value: "1", unit: "条", trend: "flat", status: "warn" },
    { label: "异常设备", value: "2", unit: "台", trend: "down", status: "danger" },
  ],
};

const tableColumns: ColumnDef[] = [
  { key: "seq", title: "序号", width: 60 },
  { key: "stationName", title: "监测点名称", width: 160 },
  { key: "stationType", title: "监测类型", width: 120 },
  { key: "value", title: "监测值", width: 100 },
  { key: "unit", title: "单位", width: 80 },
  { key: "threshold", title: "阈值", width: 100 },
  {
    key: "status",
    title: "状态",
    width: 100,
    render: (val) => {
      const statusMap: Record<string, { label: string; color: string; bg: string }> = {
        normal: { label: "正常", color: "var(--tech-success)", bg: "rgba(82,196,26,0.15)" },
        warn: { label: "预警", color: "var(--tech-warning)", bg: "rgba(250,173,20,0.15)" },
        danger: { label: "危险", color: "var(--tech-danger)", bg: "rgba(255,77,79,0.15)" },
      };
      const s = statusMap[String(val)] || statusMap.normal;
      return (
        <span
          className="px-2 py-0.5 rounded text-xs"
          style={{ color: s.color, background: s.bg }}
        >
          {s.label}
        </span>
      );
    },
  },
  { key: "updateTime", title: "更新时间", width: 160 },
  {
    key: "trend",
    title: "趋势",
    width: 80,
    render: (val) =>
      val === "up" ? (
        <TrendingUp size={14} style={{ color: "var(--tech-danger)" }} />
      ) : val === "down" ? (
        <TrendingDown size={14} style={{ color: "var(--tech-success)" }} />
      ) : (
        <Minus size={14} style={{ color: "var(--tech-text-dim)" }} />
      ),
  },
];

const generateTableData = (tab: RealtimeTab) => {
  const prefixes: Record<RealtimeTab, string> = {
    geology: "地质监测点",
    hydro: "水文站",
    forest: "森林监测站",
    industry: "工贸企业监测点",
    chemical: "危化品监测点",
    mine: "矿山监测点",
  };
  const typeMap: Record<RealtimeTab, string[]> = {
    geology: ["位移监测", "沉降监测", "裂缝监测", "土壤含水率"],
    hydro: ["水位", "流量", "降雨量", "水质"],
    forest: ["温度", "湿度", "风速", "烟雾"],
    industry: ["粉尘浓度", "噪声", "温度", "有毒气体"],
    chemical: ["可燃气体", "有毒气体", "压力", "温度"],
    mine: ["瓦斯浓度", "粉尘", "风速", "温度"],
  };
  const statuses = ["normal", "normal", "normal", "warn", "danger", "normal", "normal", "warn"];
  const trends = ["flat", "up", "down", "up", "flat", "down", "up", "flat"];
  const types = typeMap[tab];
  return Array.from({ length: 8 }, (_, i) => ({
    seq: i + 1,
    stationName: `${prefixes[tab]}-${String(i + 1).padStart(3, "0")}`,
    stationType: types[i % types.length],
    value: (Math.random() * 50 + 10).toFixed(2),
    unit: i % 4 === 0 ? "mm" : i % 4 === 1 ? "m/s" : i % 4 === 2 ? "°C" : "%",
    threshold: (Math.random() * 60 + 30).toFixed(2),
    status: statuses[i % statuses.length],
    updateTime: `2026-03-26 ${String(14 - i).padStart(2, "0")}:${String(17 - i).padStart(2, "0")}:03`,
    trend: trends[i % trends.length],
  }));
};

const filterFields = [
  { key: "stationType", label: "监测类型", type: "select" as const, options: [{ label: "位移监测", value: "displacement" }, { label: "水位监测", value: "water" }] },
  { key: "status", label: "状态", type: "select" as const, options: [{ label: "正常", value: "normal" }, { label: "预警", value: "warn" }, { label: "危险", value: "danger" }] },
  { key: "stationName", label: "监测点名称", type: "input" as const, placeholder: "请输入监测点名称" },
];

interface RealtimeMonitorProps {
  defaultTab?: RealtimeTab;
}

export default function RealtimeMonitor({ defaultTab = "mine" }: RealtimeMonitorProps) {
  const [activeTab, setActiveTab] = useState<RealtimeTab>(defaultTab);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const cards = statCards[activeTab];
  const tableData = generateTableData(activeTab);

  return (
    <div data-cmp="RealtimeMonitor" className="flex flex-col gap-3 p-4">
      {/* Tab Bar */}
      <div
        className="flex items-center gap-1 px-1 py-1 rounded"
        style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-1.5 rounded text-xs transition-all"
            style={{
              background: activeTab === tab.key ? `var(--tech-active)` : "transparent",
              color: activeTab === tab.key ? `var(--tech-text)` : `var(--tech-text-dim)`,
              border: activeTab === tab.key ? `1px solid var(--tech-active)` : "1px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          className="flex items-center gap-1 text-xs px-2 py-1 rounded"
          style={{ color: `var(--tech-cyan)`, background: `var(--tech-cyan-dim)` }}
        >
          <RefreshCw size={11} />
          刷新
        </button>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex-1 rounded p-3 flex flex-col gap-1"
            style={{
              background: `var(--tech-card)`,
              border: `1px solid var(--tech-border)`,
            }}
          >
            <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>
              {card.label}
            </span>
            <div className="flex items-end gap-1">
              <span
                className="text-2xl font-bold"
                style={{
                  color:
                    card.status === "danger"
                      ? `var(--tech-danger)`
                      : card.status === "warn"
                      ? `var(--tech-warning)`
                      : `var(--tech-cyan)`,
                }}
              >
                {card.value}
              </span>
              <span className="text-xs mb-1" style={{ color: `var(--tech-text-dim)` }}>
                {card.unit}
              </span>
              <span className="ml-auto">
                {card.trend === "up" ? (
                  <TrendingUp size={14} style={{ color: "var(--tech-danger)" }} />
                ) : card.trend === "down" ? (
                  <TrendingDown size={14} style={{ color: "var(--tech-success)" }} />
                ) : (
                  <Minus size={14} style={{ color: "var(--tech-text-dim)" }} />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <TechFilter
        fields={filterFields}
        values={filterValues}
        onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
        onSearch={() => console.log("search", filterValues)}
        onReset={() => setFilterValues({})}
      />

      {/* Table */}
      <TechCard
        title={`${tabs.find((t) => t.key === activeTab)?.label}实时监测数据`}
        extra={
          <div className="flex items-center gap-2">
            <RefreshCw size={13} style={{ color: `var(--tech-cyan)` }} />
            <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>
              自动刷新中
            </span>
          </div>
        }
      >
        <TechTable
          columns={tableColumns}
          data={tableData}
          total={tableData.length}
          page={page}
          pageSize={10}
          onPageChange={setPage}
        />
      </TechCard>
    </div>
  );
}
