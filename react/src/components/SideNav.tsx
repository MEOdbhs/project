import {
  Activity,
  Video,
  Bell,
  Eye,
  BarChart2,
  Search,
  Cpu,
  Wrench,
  Sliders,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    key: "realtime-monitor",
    label: "实时监测",
    icon: <Activity size={15} />,
    children: [
      { key: "geology-realtime", label: "地质灾害实时数据" },
      { key: "hydro-realtime", label: "水文实时数据" },
      { key: "forest-realtime", label: "森林防火实时数据" },
      { key: "industry-realtime", label: "工贸实时数据" },
      { key: "chemical-realtime", label: "危险化学品实时数据" },
      { key: "mine-realtime", label: "矿山实时数据" },
    ],
  },
  {
    key: "video-monitor",
    label: "视频监控",
    icon: <Video size={15} />,
  },
  {
    key: "monitor-warning",
    label: "监测预警",
    icon: <Bell size={15} />,
    children: [
      { key: "online-warning", label: "在线监测预警" },
      { key: "warning-rule", label: "预警规则设置" },
      { key: "warning-receive", label: "预警接收设置" },
      { key: "warning-closed-loop", label: "预警闭环与处置流程" },
      { key: "geology-warning-rule", label: "地质灾害监测预警规则" },
      { key: "hydro-warning-rule", label: "水文监测预警规则" },
      { key: "forest-warning-rule", label: "森林火险监测预警规则" },
      { key: "industry-warning-rule", label: "工贸企业安全监测预警规则" },
      { key: "chemical-warning-rule", label: "危险化学品安全监测预警规则" },
      { key: "mine-warning-rule", label: "矿山安全监测预警规则" },
    ],
  },
  {
    key: "video-ai",
    label: "视频AI识别预警",
    icon: <Eye size={15} />,
  },
  {
    key: "dynamic-risk",
    label: "动态风险评价",
    icon: <BarChart2 size={15} />,
    children: [
      { key: "earthquake-assess", label: "地震实时评估" },
      { key: "slope-risk", label: "边坡风险评价" },
      { key: "enterprise-risk", label: "企业安全生产风险评价" },
    ],
  },
  {
    key: "data-patrol",
    label: "数据智能巡查",
    icon: <Search size={15} />,
  },
  {
    key: "device-mgmt",
    label: "监测监控设备管理",
    icon: <Cpu size={15} />,
    children: [
      { key: "device-lifecycle", label: "设备生命周期台账管理" },
      { key: "device-list", label: "设备管理" },
      { key: "device-realtime", label: "设备状态实时监控" },
    ],
  },
  {
    key: "maintenance",
    label: "预防性维护预计校准管理",
    icon: <Wrench size={15} />,
    children: [
      { key: "maintenance-calibration", label: "维护校准管理" },
      { key: "calibration-plan", label: "校准计划" },
      { key: "calibration-record", label: "校准记录" },
      { key: "stats-optimize", label: "统计分析与资产优化" },
    ],
  },
  {
    key: "threshold-mgmt",
    label: "预警阈值管理",
    icon: <Sliders size={15} />,
  },
  {
    key: "algorithm-mgmt",
    label: "算法模型管理",
    icon: <GitBranch size={15} />,
    children: [
      { key: "algo-repo", label: "标准化算法模型仓库" },
      { key: "algo-deploy", label: "算法部署与任务调度" },
      { key: "algo-monitor", label: "算法性能监控与评估" },
      { key: "model-loop", label: "模型迭代闭环" },
    ],
  },
];

interface SideNavProps {
  activeKey?: string;
  onSelect?: (key: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SideNav({
  activeKey = "online-warning",
  onSelect = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
}: SideNavProps) {
  const findParentKey = (target: string): string => {
    for (const item of menuData) {
      if (item.children?.some((c) => c.key === target)) return item.key;
    }
    return "";
  };

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const parent = findParentKey(activeKey);
    return parent ? [parent] : [];
  });

  const toggleOpen = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div
      data-cmp="SideNav"
      className="flex flex-col flex-shrink-0 tech-scrollbar overflow-y-auto"
      style={{
        width: collapsed ? 48 : 164,
        minHeight: "100%",
        background: `var(--tech-sidebar)`,
        borderRight: `1px solid var(--tech-border)`,
        transition: "width 0.2s ease",
      }}
    >
      <div className="flex flex-col py-2 flex-1">
        {menuData.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openKeys.includes(item.key);
          const isParentActive =
            item.key === activeKey ||
            item.children?.some((c) => c.key === activeKey);

          return (
            <div key={item.key}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleOpen(item.key);
                  } else {
                    onSelect(item.key);
                  }
                }}
                className="w-full flex items-center px-3 py-2 text-xs transition-all"
                style={{
                  color: isParentActive ? `var(--tech-cyan)` : `var(--tech-text)`,
                  background: isParentActive && !hasChildren
                    ? `var(--tech-cyan-dim)`
                    : "transparent",
                  borderLeft: isParentActive
                    ? `2px solid var(--tech-cyan)`
                    : "2px solid transparent",
                  gap: collapsed ? 0 : 6,
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left leading-tight">{item.label}</span>
                    {hasChildren && (
                      <span className="flex-shrink-0">
                        {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      </span>
                    )}
                  </>
                )}
              </button>

              {hasChildren && isOpen && !collapsed && (
                <div
                  className="ml-3"
                  style={{ borderLeft: `1px solid var(--tech-border)` }}
                >
                  {item.children!.map((child) => (
                    <button
                      key={child.key}
                      onClick={() => onSelect(child.key)}
                      className="w-full flex items-center px-3 py-1.5 text-xs transition-all"
                      style={{
                        color:
                          activeKey === child.key
                            ? `var(--tech-cyan)`
                            : `var(--tech-text-dim)`,
                        background:
                          activeKey === child.key
                            ? `var(--tech-cyan-dim)`
                            : "transparent",
                        borderLeft:
                          activeKey === child.key
                            ? `2px solid var(--tech-cyan)`
                            : "2px solid transparent",
                      }}
                    >
                      <span className="truncate">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-2 px-3 py-3 text-xs border-t"
        style={{
          color: `var(--tech-text-dim)`,
          borderColor: `var(--tech-border)`,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Menu size={14} />
        {!collapsed && <span>收起菜单</span>}
      </button>
    </div>
  );
}
