import { useState } from "react";
import React from "react";
import TechCard from "../../components/TechCard";
import { Bell, Plus, Edit, Trash2, Phone, MessageSquare, Mail } from "lucide-react";

const contactGroups = [
  {
    id: 1,
    name: "地质灾害应急组",
    members: [
      { name: "王主任", phone: "138****8001", role: "组长", channels: ["sms", "phone"] },
      { name: "张工程师", phone: "139****8002", role: "成员", channels: ["sms"] },
      { name: "李监测员", phone: "137****8003", role: "成员", channels: ["sms", "app"] },
    ],
  },
  {
    id: 2,
    name: "矿山安全应急组",
    members: [
      { name: "赵矿长", phone: "150****5001", role: "组长", channels: ["sms", "phone"] },
      { name: "孙安全员", phone: "151****5002", role: "成员", channels: ["sms"] },
    ],
  },
  {
    id: 3,
    name: "危化品应急组",
    members: [
      { name: "刘厂长", phone: "180****6001", role: "组长", channels: ["sms", "phone", "email"] },
      { name: "陈安监", phone: "181****6002", role: "成员", channels: ["sms", "email"] },
    ],
  },
];

const notifyRules = [
  { id: 1, scenario: "地质灾害红色预警", groups: ["地质灾害应急组"], channels: "短信+电话", delay: "立即", times: "连续3次", status: true },
  { id: 2, scenario: "地质灾害橙色预警", groups: ["地质灾害应急组"], channels: "短信", delay: "立即", times: "1次", status: true },
  { id: 3, scenario: "矿山瓦斯超标", groups: ["矿山安全应急组"], channels: "短信+电话", delay: "立即", times: "连续3次", status: true },
  { id: 4, scenario: "危化品泄漏告警", groups: ["危化品应急组"], channels: "短信+电话+邮件", delay: "立即", times: "连续5次", status: true },
  { id: 5, scenario: "水文黄色预警", groups: ["地质灾害应急组"], channels: "短信", delay: "10分钟", times: "1次", status: false },
];

const channelIcon: Record<string, React.ReactElement> = {
  sms: <MessageSquare size={12} />,
  phone: <Phone size={12} />,
  email: <Mail size={12} />,
  app: <Bell size={12} />,
};

const channelColor: Record<string, string> = {
  sms: "var(--tech-cyan)",
  phone: "var(--tech-warning)",
  email: "var(--tech-active)",
  app: "var(--tech-success)",
};

export default function WarningReceive() {
  const [rules, setRules] = useState(notifyRules);

  const toggleRule = (id: number) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, status: !r.status } : r));
    console.log(`toggle rule ${id}`);
  };

  return (
    <div data-cmp="WarningReceive" className="flex flex-col gap-3 p-4">
      <div className="flex gap-3">
        <div className="flex-1 rounded p-3" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
          <div className="text-2xl font-bold" style={{ color: `var(--tech-cyan)` }}>12</div>
          <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>通知接收人总数</div>
        </div>
        <div className="flex-1 rounded p-3" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
          <div className="text-2xl font-bold" style={{ color: `var(--tech-success)` }}>3</div>
          <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>通知组数量</div>
        </div>
        <div className="flex-1 rounded p-3" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
          <div className="text-2xl font-bold" style={{ color: `var(--tech-warning)` }}>5</div>
          <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>通知规则数</div>
        </div>
        <div className="flex-1 rounded p-3" style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}>
          <div className="text-2xl font-bold" style={{ color: `var(--tech-active)` }}>4</div>
          <div className="text-xs mt-1" style={{ color: `var(--tech-text-dim)` }}>已启用规则</div>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Contact groups */}
        <div className="flex flex-col gap-3" style={{ width: 380, flexShrink: 0 }}>
          <TechCard
            title="通知联系人组"
            extra={
              <button
                className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
              >
                <Plus size={11} />新建组
              </button>
            }
          >
            <div className="flex flex-col gap-3">
              {contactGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded p-3"
                  style={{ background: `rgba(0,30,70,0.4)`, border: `1px solid var(--tech-border)` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: `var(--tech-cyan)` }}>{group.name}</span>
                    <div className="flex gap-2">
                      <button title="编辑"><Edit size={13} style={{ color: `var(--tech-text-dim)` }} /></button>
                      <button title="删除"><Trash2 size={13} style={{ color: `var(--tech-danger)` }} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {group.members.map((m, midx) => (
                      <div key={midx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{
                              background: m.role === "组长" ? `rgba(22,119,255,0.2)` : `rgba(0,0,0,0.2)`,
                              color: m.role === "组长" ? `var(--tech-active)` : `var(--tech-text-dim)`,
                              border: `1px solid ${m.role === "组长" ? "var(--tech-active)" : "var(--tech-border)"}`,
                            }}
                          >
                            {m.role}
                          </span>
                          <span style={{ color: `var(--tech-text)` }}>{m.name}</span>
                          <span style={{ color: `var(--tech-text-dim)` }}>{m.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {m.channels.map((c) => (
                            <span key={c} style={{ color: channelColor[c] || "var(--tech-text)" }} title={c}>
                              {channelIcon[c]}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TechCard>
        </div>

        {/* Notify rules */}
        <div className="flex-1">
          <TechCard
            title="预警通知规则配置"
            extra={
              <button
                className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                style={{ background: `var(--tech-active)`, color: `var(--tech-text)` }}
              >
                <Plus size={11} />添加规则
              </button>
            }
          >
            <div className="flex flex-col gap-0">
              <div
                className="flex items-center text-xs px-3 py-2 rounded"
                style={{ background: `rgba(0,0,0,0.3)`, color: `var(--tech-text-dim)` }}
              >
                <span style={{ width: 200 }}>触发场景</span>
                <span style={{ width: 140 }}>通知组</span>
                <span style={{ width: 130 }}>通知方式</span>
                <span style={{ width: 80 }}>延迟</span>
                <span style={{ width: 90 }}>重复次数</span>
                <span style={{ width: 70 }}>状态</span>
                <span style={{ flex: 1 }}>操作</span>
              </div>
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center text-xs px-3 py-2.5"
                  style={{ borderBottom: `1px solid var(--tech-border)` }}
                >
                  <span style={{ width: 200, color: `var(--tech-text)` }}>{rule.scenario}</span>
                  <span style={{ width: 140, color: `var(--tech-text-dim)` }}>{rule.groups.join(", ")}</span>
                  <span style={{ width: 130, color: `var(--tech-cyan)` }}>{rule.channels}</span>
                  <span style={{ width: 80, color: `var(--tech-text)` }}>{rule.delay}</span>
                  <span style={{ width: 90, color: `var(--tech-text)` }}>{rule.times}</span>
                  <span style={{ width: 70 }}>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="relative inline-flex items-center rounded-full transition-all"
                      style={{
                        width: 36,
                        height: 20,
                        background: rule.status ? `var(--tech-active)` : `rgba(255,255,255,0.2)`,
                      }}
                    >
                      <span
                        className="absolute rounded-full transition-all"
                        style={{
                          width: 14,
                          height: 14,
                          background: `var(--tech-text)`,
                          left: rule.status ? 19 : 3,
                        }}
                      />
                    </button>
                  </span>
                  <div style={{ flex: 1 }} className="flex gap-2">
                    <button style={{ color: `var(--tech-cyan)` }}>编辑</button>
                    <button style={{ color: `var(--tech-danger)` }}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          </TechCard>
        </div>
      </div>
    </div>
  );
}
