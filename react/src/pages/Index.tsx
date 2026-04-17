import { useState, Suspense, lazy } from "react";
import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";

// Lazy load all sensing pages
const RealtimeMonitor = lazy(() => import("./sensing/RealtimeMonitor"));
const VideoMonitor = lazy(() => import("./sensing/VideoMonitor"));
const OnlineWarning = lazy(() => import("./sensing/OnlineWarning"));
const WarningRule = lazy(() => import("./sensing/WarningRule"));
const WarningReceive = lazy(() => import("./sensing/WarningReceive"));
const WarningClosedLoop = lazy(() => import("./sensing/WarningClosedLoop"));
const VideoAI = lazy(() => import("./sensing/VideoAI"));
const DynamicRisk = lazy(() => import("./sensing/DynamicRisk"));
const DataPatrol = lazy(() => import("./sensing/DataPatrol"));
const DeviceList = lazy(() => import("./sensing/DeviceList"));
const DeviceRealtime = lazy(() => import("./sensing/DeviceRealtime"));
const DeviceLifecycle = lazy(() => import("./sensing/DeviceLifecycle"));
const MaintenanceCalibration = lazy(() => import("./sensing/MaintenanceCalibration"));
const ThresholdMgmt = lazy(() => import("./sensing/ThresholdMgmt"));
const AlgoModel = lazy(() => import("./sensing/AlgoModel"));

// Category warning rules
const CategoryWarningRuleRaw = lazy(() => import("./sensing/CategoryWarningRule"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-48">
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: `var(--tech-cyan) transparent transparent transparent` }}
      />
      <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>加载中...</span>
    </div>
  </div>
);

// Map of all page keys to "realtimeSubTab" configuration
const realtimeSubTabs: Record<string, string> = {
  "geology-realtime": "geology",
  "hydro-realtime": "hydro",
  "forest-realtime": "forest",
  "industry-realtime": "industry",
  "chemical-realtime": "chemical",
  "mine-realtime": "mine",
};

const dynamicRiskSubTabs: Record<string, string> = {
  "earthquake-assess": "earthquake",
  "slope-risk": "slope",
  "enterprise-risk": "enterprise",
};

const categoryWarningConfigs: Record<string, { category: string; description: string }> = {
  "geology-warning-rule": {
    category: "地质灾害",
    description: "基于地表位移、降雨量等监测指标设置多级预警阈值",
  },
  "hydro-warning-rule": {
    category: "水文洪水",
    description: "基于水位高程、流量变化等水文监测指标设置预警规则",
  },
  "forest-warning-rule": {
    category: "森林火险",
    description: "基于温度、湿度、风速及烟雾浓度等指标设置火险预警规则",
  },
  "industry-warning-rule": {
    category: "工贸企业安全",
    description: "基于粉尘浓度、设备振动、人员行为等指标设置预警规则",
  },
  "chemical-warning-rule": {
    category: "危险化学品安全",
    description: "基于有毒气体浓度、储罐液位、温压变化等指标设置预警规则",
  },
  "mine-warning-rule": {
    category: "矿山安全",
    description: "基于瓦斯浓度、顶板压力、涌水量等矿山指标设置预警规则",
  },
};

// Keys that map to algo page tabs
const algoTabKeys = new Set(["algo-repo", "algo-deploy", "algo-monitor", "model-loop"]);
// Keys that map to maintenance page
const maintenanceTabKeys = new Set(["maintenance-calibration", "calibration-plan", "calibration-record", "stats-optimize"]);

function PageBreadcrumb({ activeKey }: { activeKey: string }) {
  const labelMap: Record<string, string> = {
    "geology-realtime": "地质灾害实时数据",
    "hydro-realtime": "水文实时数据",
    "forest-realtime": "森林防火实时数据",
    "industry-realtime": "工贸实时数据",
    "chemical-realtime": "危险化学品实时数据",
    "mine-realtime": "矿山实时数据",
    "video-monitor": "视频监控",
    "online-warning": "在线监测预警",
    "warning-rule": "预警规则设置",
    "warning-receive": "预警接收设置",
    "warning-closed-loop": "预警闭环与处置流程",
    "geology-warning-rule": "地质灾害监测预警规则",
    "hydro-warning-rule": "水文监测预警规则",
    "forest-warning-rule": "森林火险监测预警规则",
    "industry-warning-rule": "工贸企业安全监测预警规则",
    "chemical-warning-rule": "危险化学品安全监测预警规则",
    "mine-warning-rule": "矿山安全监测预警规则",
    "video-ai": "视频AI识别预警",
    "earthquake-assess": "地震实时评估",
    "slope-risk": "边坡风险评价",
    "enterprise-risk": "企业安全生产风险评价",
    "data-patrol": "数据智能巡查",
    "device-lifecycle": "设备生命周期台账管理",
    "device-list": "设备管理",
    "device-realtime": "设备状态实时监控",
    "maintenance-calibration": "维护校准管理",
    "calibration-plan": "校准计划",
    "calibration-record": "校准记录",
    "stats-optimize": "统计分析与资产优化",
    "threshold-mgmt": "预警阈值管理",
    "algo-repo": "标准化算法模型仓库",
    "algo-deploy": "算法部署与任务调度",
    "algo-monitor": "算法性能监控与评估",
    "model-loop": "模型迭代闭环",
  };
  const label = labelMap[activeKey] || activeKey;
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 text-xs flex-shrink-0"
      style={{ borderBottom: `1px solid var(--tech-border)`, color: `var(--tech-text-dim)` }}
    >
      <span>智能感知预警</span>
      <span style={{ color: `var(--tech-border)` }}>›</span>
      <span style={{ color: `var(--tech-cyan)` }}>{label}</span>
    </div>
  );
}

function PageContent({ activeKey }: { activeKey: string }) {
  console.log(`[Index] rendering page: ${activeKey}`);

  if (activeKey in realtimeSubTabs) {
    return <RealtimeMonitor defaultTab={realtimeSubTabs[activeKey] as "geology" | "hydro" | "forest" | "industry" | "chemical" | "mine"} />;
  }
  if (activeKey === "video-monitor") return <VideoMonitor />;
  if (activeKey === "online-warning") return <OnlineWarning />;
  if (activeKey === "warning-rule") return <WarningRule />;
  if (activeKey === "warning-receive") return <WarningReceive />;
  if (activeKey === "warning-closed-loop") return <WarningClosedLoop />;
  if (activeKey in categoryWarningConfigs) {
    const cfg = categoryWarningConfigs[activeKey];
    return <CategoryWarningRuleRaw category={cfg.category} description={cfg.description} />;
  }
  if (activeKey === "video-ai") return <VideoAI />;
  if (activeKey in dynamicRiskSubTabs) {
    return <DynamicRisk defaultTab={dynamicRiskSubTabs[activeKey] as "earthquake" | "slope" | "enterprise"} />;
  }
  if (activeKey === "data-patrol") return <DataPatrol />;
  if (activeKey === "device-lifecycle") return <DeviceLifecycle />;
  if (activeKey === "device-list") return <DeviceList />;
  if (activeKey === "device-realtime") return <DeviceRealtime />;
  if (maintenanceTabKeys.has(activeKey)) return <MaintenanceCalibration />;
  if (activeKey === "threshold-mgmt") return <ThresholdMgmt />;
  if (algoTabKeys.has(activeKey)) return <AlgoModel />;

  // Default fallback
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-64 gap-3">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: `var(--tech-cyan-dim)`, border: `1px solid var(--tech-border)` }}
      >
        <span className="text-2xl" style={{ color: `var(--tech-cyan)` }}>⚡</span>
      </div>
      <div className="text-sm" style={{ color: `var(--tech-text-dim)` }}>功能模块开发中，敬请期待</div>
    </div>
  );
}

const Index = () => {
  const [activeKey, setActiveKey] = useState("online-warning");
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState("smart-sensing");

  const handleSelect = (key: string) => {
    console.log(`[Index] menu select: ${key}`);
    setActiveKey(key);
  };

  return (
    <div
      data-cmp="Index"
      className="flex flex-col"
      style={{
        width: 1440,
        minHeight: "100vh",
        margin: "0 auto",
        background: `var(--tech-bg)`,
        color: `var(--tech-text)`,
        fontFamily: `var(--fontSans), sans-serif`,
      }}
    >
      <TopNav activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <SideNav
          activeKey={activeKey}
          onSelect={handleSelect}
          collapsed={sideCollapsed}
          onToggleCollapse={() => setSideCollapsed((v) => !v)}
        />
        <div
          className="flex flex-col flex-1 overflow-hidden tech-scrollbar"
          style={{ minWidth: 0, background: `var(--tech-bg)` }}
        >
          <PageBreadcrumb activeKey={activeKey} />
          <div className="flex-1 overflow-y-auto tech-scrollbar">
            <Suspense fallback={<LoadingFallback />}>
              <PageContent activeKey={activeKey} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
