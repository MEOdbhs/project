import { useState } from "react";
import TechCard from "../../components/TechCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line } from "recharts";

type RiskTab = "earthquake" | "slope" | "enterprise";

const riskTabs = [
  { key: "earthquake" as RiskTab, label: "地震实时评估" },
  { key: "slope" as RiskTab, label: "边坡风险评价" },
  { key: "enterprise" as RiskTab, label: "企业安全生产风险评价" },
];

const earthquakeData = [
  { time: "00:00", magnitude: 0.2 }, { time: "02:00", magnitude: 0.5 },
  { time: "04:00", magnitude: 0.3 }, { time: "06:00", magnitude: 1.1 },
  { time: "08:00", magnitude: 0.8 }, { time: "10:00", magnitude: 0.4 },
  { time: "12:00", magnitude: 0.6 }, { time: "14:00", magnitude: 1.8 },
  { time: "16:00", magnitude: 0.9 }, { time: "18:00", magnitude: 0.3 },
  { time: "20:00", magnitude: 0.7 }, { time: "22:00", magnitude: 0.5 },
];

const slopeData = [
  { name: "太极山北坡", risk: 72, displacement: 3.2, rainfall: 45, stability: 65 },
  { name: "南山滑坡体", risk: 88, displacement: 7.8, rainfall: 62, stability: 42 },
  { name: "西河沟侧坡", risk: 45, displacement: 1.1, rainfall: 28, stability: 82 },
  { name: "刘家峡坝坡", risk: 38, displacement: 0.8, rainfall: 20, stability: 90 },
  { name: "尾矿库坝坡A", risk: 65, displacement: 4.5, rainfall: 38, stability: 70 },
];

const enterpriseData = [
  { name: "作业环境", value: 72 },
  { name: "设备设施", value: 85 },
  { name: "人员行为", value: 68 },
  { name: "管理制度", value: 90 },
  { name: "应急能力", value: 75 },
  { name: "隐患治理", value: 62 },
];

const topEnterprises = [
  { name: "永靖化工有限公司", score: 87, level: "low", type: "危化品" },
  { name: "盐锅峡矿业集团", score: 65, level: "medium", type: "矿山" },
  { name: "西部煤炭有限公司", score: 52, level: "high", type: "矿山" },
  { name: "永靖工业园区A企业", score: 78, level: "low", type: "工贸" },
  { name: "新寺化工原料厂", score: 44, level: "high", type: "危化品" },
];

const riskColor = (level: string) =>
  level === "high" ? "var(--tech-danger)" : level === "medium" ? "var(--tech-warning)" : "var(--tech-success)";
const riskLabel = (level: string) =>
  level === "high" ? "高风险" : level === "medium" ? "中风险" : "低风险";

interface DynamicRiskProps {
  defaultTab?: RiskTab;
}

export default function DynamicRisk({ defaultTab = "earthquake" }: DynamicRiskProps) {
  const [activeTab, setActiveTab] = useState<RiskTab>(defaultTab);

  return (
    <div data-cmp="DynamicRisk" className="flex flex-col gap-3 p-4">
      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-1 py-1 rounded"
        style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
      >
        {riskTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-1.5 rounded text-xs transition-all"
            style={{
              background: activeTab === tab.key ? `var(--tech-active)` : "transparent",
              color: activeTab === tab.key ? `var(--tech-text)` : `var(--tech-text-dim)`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Earthquake Tab */}
      {activeTab === "earthquake" && (
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-3">
            <TechCard title="今日地震活动趋势（震级/时间）">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={earthquakeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,120,255,0.1)" />
                  <XAxis dataKey="time" tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "var(--tech-card)", border: "1px solid var(--tech-border)", borderRadius: 4, color: "var(--tech-text)" }}
                  />
                  <Line type="monotone" dataKey="magnitude" stroke="var(--tech-cyan)" strokeWidth={2} dot={{ fill: "var(--tech-cyan)", r: 3 }} name="震级" />
                </LineChart>
              </ResponsiveContainer>
            </TechCard>

            <TechCard title="近期地震记录">
              <div className="flex flex-col gap-2">
                {[
                  { time: "2026-03-26 14:17", mag: "1.8", depth: "8km", loc: "永靖县北部山区", risk: "低" },
                  { time: "2026-03-25 09:32", mag: "2.1", depth: "12km", loc: "刘家峡水库附近", risk: "低" },
                  { time: "2026-03-24 22:14", mag: "1.3", depth: "5km", loc: "太极山南麓", risk: "低" },
                  { time: "2026-03-23 07:55", mag: "2.8", depth: "15km", loc: "永靖县东南方向", risk: "中" },
                ].map((eq, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
                  >
                    <span
                      className="text-sm font-bold w-10 text-center"
                      style={{ color: parseFloat(eq.mag) >= 2.5 ? `var(--tech-warning)` : `var(--tech-cyan)` }}
                    >
                      M{eq.mag}
                    </span>
                    <span className="flex-1 text-xs" style={{ color: `var(--tech-text)` }}>{eq.loc}</span>
                    <span className="text-xs w-14 text-center" style={{ color: `var(--tech-text-dim)` }}>{eq.depth}</span>
                    <span className="text-xs w-32 text-right" style={{ color: `var(--tech-text-dim)` }}>{eq.time}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded w-10 text-center"
                      style={{ color: eq.risk === "中" ? `var(--tech-warning)` : `var(--tech-success)`, background: eq.risk === "中" ? `rgba(250,173,20,0.1)` : `rgba(82,196,26,0.1)` }}
                    >
                      {eq.risk}险
                    </span>
                  </div>
                ))}
              </div>
            </TechCard>
          </div>
          <div style={{ width: 280 }}>
            <TechCard title="地震风险等级分布">
              <div className="flex flex-col gap-3">
                {[
                  { level: "低风险区", count: 85, color: "var(--tech-success)" },
                  { level: "中风险区", count: 12, color: "var(--tech-warning)" },
                  { level: "高风险区", count: 3, color: "var(--tech-danger)" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: `var(--tech-text)` }}>{item.level}</span>
                      <span style={{ color: item.color }}>{item.count}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: `var(--tech-input-bg)` }}>
                      <div className="h-full rounded-full" style={{ width: `${item.count}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t" style={{ borderColor: `var(--tech-border)` }}>
                  <p className="text-xs" style={{ color: `var(--tech-text-dim)` }}>当前地震风险综合评估</p>
                  <p className="text-lg font-bold mt-1" style={{ color: `var(--tech-success)` }}>低风险</p>
                  <p className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>永靖县区域地震风险处于低风险水平，近期无显著地震活动</p>
                </div>
              </div>
            </TechCard>
          </div>
        </div>
      )}

      {/* Slope Tab */}
      {activeTab === "slope" && (
        <div className="flex gap-3">
          <div className="flex-1">
            <TechCard title="边坡风险评分排行">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={slopeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,120,255,0.1)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "var(--tech-card)", border: "1px solid var(--tech-border)", borderRadius: 4, color: "var(--tech-text)" }}
                  />
                  <Bar dataKey="risk" name="风险评分" fill="var(--tech-active)" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TechCard>
          </div>
          <div className="flex-1">
            <TechCard title="边坡监测详情">
              <div className="flex flex-col gap-2">
                {slopeData.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
                  >
                    <span className="text-xs w-28 flex-shrink-0" style={{ color: `var(--tech-text)` }}>{s.name}</span>
                    <div
                      className="h-2 flex-1 rounded-full overflow-hidden"
                      style={{ background: `var(--tech-input-bg)` }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.risk}%`,
                          background: s.risk >= 80 ? `var(--tech-danger)` : s.risk >= 60 ? `var(--tech-warning)` : `var(--tech-success)`,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs w-10 text-right font-bold"
                      style={{ color: s.risk >= 80 ? `var(--tech-danger)` : s.risk >= 60 ? `var(--tech-warning)` : `var(--tech-success)` }}
                    >
                      {s.risk}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        color: s.risk >= 80 ? `var(--tech-danger)` : s.risk >= 60 ? `var(--tech-warning)` : `var(--tech-success)`,
                        background: s.risk >= 80 ? `rgba(255,77,79,0.1)` : s.risk >= 60 ? `rgba(250,173,20,0.1)` : `rgba(82,196,26,0.1)`,
                      }}
                    >
                      {s.risk >= 80 ? "高风险" : s.risk >= 60 ? "中风险" : "低风险"}
                    </span>
                  </div>
                ))}
              </div>
            </TechCard>
          </div>
        </div>
      )}

      {/* Enterprise Tab */}
      {activeTab === "enterprise" && (
        <div className="flex gap-3">
          <div style={{ width: 320 }}>
            <TechCard title="安全生产综合评分雷达图">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={enterpriseData}>
                  <PolarGrid stroke="rgba(0,120,255,0.2)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} />
                  <Radar dataKey="value" stroke="var(--tech-cyan)" fill="var(--tech-cyan)" fillOpacity={0.15} />
                  <Tooltip
                    contentStyle={{ background: "var(--tech-card)", border: "1px solid var(--tech-border)", borderRadius: 4, color: "var(--tech-text)" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </TechCard>
          </div>
          <div className="flex-1">
            <TechCard title="企业安全风险排行">
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-center gap-3 px-3 py-1.5 text-xs"
                  style={{ color: `var(--tech-cyan)` }}
                >
                  <span className="w-6 text-center">排名</span>
                  <span className="flex-1">企业名称</span>
                  <span className="w-16 text-center">行业类型</span>
                  <span className="w-16 text-center">安全评分</span>
                  <span className="w-16 text-center">风险等级</span>
                  <span className="w-16 text-center">操作</span>
                </div>
                {topEnterprises.map((ent, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2 rounded text-xs"
                    style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
                  >
                    <span
                      className="w-6 h-5 rounded text-xs flex items-center justify-center flex-shrink-0 font-bold"
                      style={{ background: idx < 3 ? `var(--tech-active)` : `var(--tech-input-bg)`, color: `var(--tech-text)` }}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1" style={{ color: `var(--tech-text)` }}>{ent.name}</span>
                    <span className="w-16 text-center" style={{ color: `var(--tech-text-dim)` }}>{ent.type}</span>
                    <span className="w-16 text-center font-bold" style={{ color: `var(--tech-cyan)` }}>{ent.score}</span>
                    <span
                      className="w-16 text-center px-2 py-0.5 rounded"
                      style={{ color: riskColor(ent.level), background: `rgba(0,0,0,0.2)` }}
                    >
                      {riskLabel(ent.level)}
                    </span>
                    <button className="w-16 text-center" style={{ color: `var(--tech-cyan)` }}>详情</button>
                  </div>
                ))}
              </div>
            </TechCard>
          </div>
        </div>
      )}
    </div>
  );
}
