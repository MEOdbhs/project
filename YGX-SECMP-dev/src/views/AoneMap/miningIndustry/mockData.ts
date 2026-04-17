export const countyData = {
  totalMines: 156,
  unprocessedRisks: 124,
  processedRisks: 358,
  unrectifiedHazards: 42,
  rectifiedHazards: 173,
};

export const statusOptions = ['全部', '正在生产', '建设', '停产停建'];

/** 实时预警（含井下/作业面瓦斯监测示意） */
export interface MiningLiveAlert {
  level: string;
  type: string;
  location: string;
  time: string;
  status: string;
  /** 甲烷体积分数等 */
  gasCh4: string;
  /** 瓦斯安全状态 */
  gasSafety: '正常' | '关注' | '预警';
}

export const liveAlerts: MiningLiveAlert[] = [
  { level: '红', type: '滑坡', location: '刘家峡镇黄河沿岸', time: '10分钟前', status: '待处理', gasCh4: '0.42%', gasSafety: '正常' },
  { level: '橙', type: '滑坡', location: '盐锅峡镇库区边坡', time: '25分钟前', status: '处理中', gasCh4: '0.38%', gasSafety: '正常' },
  { level: '橙', type: '瓦斯', location: '盐锅峡镇某石灰岩矿井下', time: '32分钟前', status: '处理中', gasCh4: '1.05%', gasSafety: '预警' },
  { level: '橙', type: '滑坡', location: '太极镇黄土台塬', time: '1小时前', status: '处理中', gasCh4: '0.35%', gasSafety: '正常' },
  { level: '黄', type: '地裂缝', location: '三塬镇农田区域', time: '3小时前', status: '已核实', gasCh4: '0.31%', gasSafety: '正常' },
  { level: '黄', type: '瓦斯', location: '西河镇砖瓦粘土矿作业面', time: '45分钟前', status: '已派检', gasCh4: '0.72%', gasSafety: '关注' },
  { level: '黄', type: '瓦斯', location: '陈井镇石灰岩矿回风巷', time: '2小时前', status: '监测中', gasCh4: '0.58%', gasSafety: '关注' },
];

/** 乡镇标点：WGS-84 参考 OSM Nominatim；summary 为矿山监管示意数据 */
export interface MiningTownshipPoint {
  name: string;
  lat: number;
  lng: number;
  mineCount: number;
  risk: 'red' | 'orange' | 'yellow' | 'blue';
  summary: {
    mainMinerals: string;
    producingCount: number;
    monitoringOnline: number;
    slopeStatus: string;
    dustAvg: string;
    groundwaterM: string;
    lastInspect: string;
    permitValid: string;
  };
}

export const townshipData: MiningTownshipPoint[] = [
  {
    name: '刘家峡镇',
    lat: 35.93894,
    lng: 103.30337,
    mineCount: 28,
    risk: 'red',
    summary: {
      mainMinerals: '建筑用灰岩、砖瓦粘土',
      producingCount: 9,
      monitoringOnline: 22,
      slopeStatus: '2 处边坡需加密监测',
      dustAvg: '8.6 mg/m³',
      groundwaterM: '埋深 18.2～32m',
      lastInspect: '2026-04-08',
      permitValid: '12 宗在有效期内',
    },
  },
  {
    name: '盐锅峡镇',
    lat: 36.07348,
    lng: 103.28362,
    mineCount: 24,
    risk: 'orange',
    summary: {
      mainMinerals: '水泥用灰岩、建筑石料',
      producingCount: 7,
      monitoringOnline: 19,
      slopeStatus: '库岸滑坡隐患点 1 处',
      dustAvg: '11.2 mg/m³',
      groundwaterM: '库区周边水位波动',
      lastInspect: '2026-04-09',
      permitValid: '9 宗在有效期内',
    },
  },
  {
    name: '西河镇',
    lat: 36.1636,
    lng: 103.20886,
    mineCount: 19,
    risk: 'blue',
    summary: {
      mainMinerals: '砖瓦用粘土、砂砾石',
      producingCount: 5,
      monitoringOnline: 14,
      slopeStatus: '整体稳定',
      dustAvg: '6.1 mg/m³',
      groundwaterM: '监测井 3 口正常',
      lastInspect: '2026-04-06',
      permitValid: '8 宗在有效期内',
    },
  },
  {
    name: '太极镇',
    lat: 35.9604,
    lng: 103.26999,
    mineCount: 16,
    risk: 'blue',
    summary: {
      mainMinerals: '黄土地区取土场、砂石料',
      producingCount: 4,
      monitoringOnline: 12,
      slopeStatus: '台塬边缘 1 处沉降观测',
      dustAvg: '7.4 mg/m³',
      groundwaterM: '稳定',
      lastInspect: '2026-04-07',
      permitValid: '7 宗在有效期内',
    },
  },
  {
    name: '三塬镇',
    lat: 35.89076,
    lng: 103.20037,
    mineCount: 14,
    risk: 'blue',
    summary: {
      mainMinerals: '砖瓦粘土、少量石灰岩',
      producingCount: 4,
      monitoringOnline: 10,
      slopeStatus: '稳定',
      dustAvg: '5.8 mg/m³',
      groundwaterM: '12.5～20m',
      lastInspect: '2026-04-05',
      permitValid: '6 宗在有效期内',
    },
  },
  {
    name: '王台镇',
    lat: 35.88155,
    lng: 103.03425,
    mineCount: 12,
    risk: 'blue',
    summary: {
      mainMinerals: '建筑用砂、卵石',
      producingCount: 3,
      monitoringOnline: 9,
      slopeStatus: '沟道两侧注意山洪携砂',
      dustAvg: '6.9 mg/m³',
      groundwaterM: '河谷阶地含水层',
      lastInspect: '2026-04-07',
      permitValid: '5 宗在有效期内',
    },
  },
  {
    name: '陈井镇',
    lat: 36.04838,
    lng: 103.46266,
    mineCount: 10,
    risk: 'blue',
    summary: {
      mainMinerals: '石灰岩、碎石土',
      producingCount: 3,
      monitoringOnline: 8,
      slopeStatus: '稳定',
      dustAvg: '7.1 mg/m³',
      groundwaterM: '东部略高',
      lastInspect: '2026-04-06',
      permitValid: '5 宗在有效期内',
    },
  },
  {
    name: '岘塬镇',
    lat: 35.91197,
    lng: 103.26986,
    mineCount: 8,
    risk: 'blue',
    summary: {
      mainMinerals: '黄土塬区砖瓦粘土',
      producingCount: 2,
      monitoringOnline: 6,
      slopeStatus: '塬边冲沟发育需巡查',
      dustAvg: '5.2 mg/m³',
      groundwaterM: '稳定',
      lastInspect: '2026-04-04',
      permitValid: '4 宗在有效期内',
    },
  },
];

export const riskPieData = [
  { name: '红色风险', value: 12, color: '#ef4444' },
  { name: '橙色风险', value: 25, color: '#f97316' },
  { name: '黄色风险', value: 48, color: '#eab308' },
  { name: '蓝色风险', value: 86, color: '#3b82f6' },
];

export const rankingData = [
  { name: '刘家峡镇', count: 28 },
  { name: '盐锅峡镇', count: 24 },
  { name: '西河镇', count: 19 },
  { name: '太极镇', count: 16 },
  { name: '三塬镇', count: 14 },
];

export const governanceData = [
  { label: '基本得到治理', value: 72, total: 156, color: '#10b981' },
  { label: '尚未完全治理', value: 54, total: 156, color: '#f59e0b' },
  { label: '没有得到治理', value: 30, total: 156, color: '#ef4444' },
];

export const trendData = [
  { name: '1月', risks: 40, hazards: 24, factors: 24 },
  { name: '2月', risks: 30, hazards: 13, factors: 22 },
  { name: '3月', risks: 20, hazards: 98, factors: 22 },
  { name: '4月', risks: 27, hazards: 39, factors: 20 },
  { name: '5月', risks: 18, hazards: 48, factors: 21 },
  { name: '6月', risks: 23, hazards: 38, factors: 25 },
  { name: '7月', risks: 34, hazards: 43, factors: 21 },
];
