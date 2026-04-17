import { useState } from "react";
import TechCard from "../../components/TechCard";
import { Activity, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const deviceGroups = [
  { category: "地质灾害", count: 28, online: 25, items: [
    { id: "JC-GZ-0001", name: "太极山位移传感器01", value: "2.3mm", unit: "位移", status: "normal" },
    { id: "JC-GZ-0002", name: "南山雨量计", value: "12.5mm/h", unit: "雨量", status: "warning" },
    { id: "JC-GZ-0003", name: "刘家峡水位计", value: "1732.4m", unit: "水位", status: "normal" },
    { id: "JC-GZ-0004", name: "西北坡倾斜仪", value: "0.8°", unit: "倾斜", status: "normal" },
  ]},
  { category: "矿山", count: 42, online: 38, items: [
    { id: "KS-WS-0001", name: "02巷瓦斯探头01", value: "0.3%", unit: "瓦斯", status: "normal" },
    { id: "KS-WS-0002", name: "主通风口风速计", value: "4.2m/s", unit: "风速", status: "normal" },
    { id: "KS-WS-0003", name: "采煤工作面温度", value: "28.5°C", unit: "温度", status: "warning" },
  ]},
  { category: "危化品", count: 15, online: 14, items: [
    { id: "HX-QT-0001", name: "氨气检测仪01", value: "8ppm", unit: "浓度", status: "normal" },
    { id: "HX-QT-0002", name: "可燃气体检测01", value: "15%LEL", unit: "浓度", status: "warning" },
  ]},
];

const chartData = [
  { time: "13:00", v: 2.1 }, { time: "13:10", v: 2.2 }, { time: "13:20", v: 2.0 },
  { time: "13:30", v: 2.3 }, { time: "13:40", v: 2.5 }, { time: "13:50", v: 2.3 },
  { time: "14:00", v: 2.3 }, { time: "14:10", v: 2.4 }, { time: "14:20", v: 2.8 },
  { time: "14:30", v: 3.0 }, { time: "14:40", v: 2.9 }, { time: "14:50", v: 2.7 },
];

export default function DeviceRealtime() {
  const [selectedDevice, setSelectedDevice] = useState("JC-GZ-0001");

  return (
    <div data-cmp="DeviceRealtime" className="flex gap-3 p-4">
      {/* Left device list */}
      <div style={{ width: 280 }} className="flex flex-col gap-3">
        {deviceGroups.map((group) => (
          <TechCard
            key={group.category}
            title={group.category}
            extra={
              <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>
                {group.online}/{group.count}在线
              </span>
            }
          >
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDevice(item.id)}
                  className="flex items-center gap-2 px-2 py-2 rounded text-left w-full transition-all"
                  style={{
                    background: selectedDevice === item.id ? `rgba(22,119,255,0.15)` : `rgba(0,30,70,0.3)`,
                    border: `1px solid ${selectedDevice === item.id ? `var(--tech-active)` : `var(--tech-border)`}`,
                  }}
                >
                  <div style={{ color: item.status === "warning" ? `var(--tech-warning)` : item.status === "offline" ? `var(--tech-danger)` : `var(--tech-success)` }}>
                    {item.status === "offline" ? <WifiOff size={12} /> : item.status === "warning" ? <AlertTriangle size={12} /> : <Wifi size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate" style={{ color: `var(--tech-text)` }}>{item.name}</div>
                    <div className="text-xs" style={{ color: `var(--tech-text-dim)` }}>{item.id}</div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: `var(--tech-cyan)` }}>{item.value}</div>
                </button>
              ))}
            </div>
          </TechCard>
        ))}
      </div>

      {/* Right realtime detail */}
      <div className="flex-1 flex flex-col gap-3">
        <TechCard title={`实时数据详情 — ${selectedDevice}`}>
          <div className="flex gap-4 mb-4">
            {[
              { label: "当前数值", value: "2.3mm", color: "var(--tech-cyan)" },
              { label: "今日最大值", value: "3.0mm", color: "var(--tech-warning)" },
              { label: "今日最小值", value: "1.8mm", color: "var(--tech-success)" },
              { label: "告警阈值", value: "5.0mm", color: "var(--tech-danger)" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex-1 rounded p-3 flex flex-col gap-1"
                style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
              >
                <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}</span>
                <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs mb-2" style={{ color: `var(--tech-text-dim)` }}>近2小时数据趋势（位移/mm）</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,120,255,0.1)" />
              <XAxis dataKey="time" tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--tech-text-dim)", fontSize: 11 }} domain={[0, 6]} />
              <Tooltip
                contentStyle={{ background: "var(--tech-card)", border: "1px solid var(--tech-border)", borderRadius: 4, color: "var(--tech-text)" }}
              />
              <Line type="monotone" dataKey="v" stroke="var(--tech-cyan)" strokeWidth={2} dot={false} name="位移(mm)" />
            </LineChart>
          </ResponsiveContainer>
        </TechCard>

        <TechCard title="历史告警记录">
          <div className="flex flex-col gap-2">
            {[
              { time: "2026-03-26 10:32", val: "4.8mm", level: "warning", desc: "位移值接近预警阈值" },
              { time: "2026-03-25 22:15", val: "5.2mm", level: "danger", desc: "位移值超过预警阈值，已触发橙色预警" },
              { time: "2026-03-25 16:40", val: "4.1mm", level: "warning", desc: "位移速率超过3mm/d" },
            ].map((r, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded text-xs"
                style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
              >
                <Activity size={13} style={{ color: r.level === "danger" ? `var(--tech-danger)` : `var(--tech-warning)` }} />
                <span style={{ color: `var(--tech-text-dim)` }}>{r.time}</span>
                <span className="font-bold" style={{ color: r.level === "danger" ? `var(--tech-danger)` : `var(--tech-warning)` }}>{r.val}</span>
                <span style={{ color: `var(--tech-text)` }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </TechCard>
      </div>
    </div>
  );
}
