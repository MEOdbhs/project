import type {
  EnterpriseStats,
  HazardAlert,
  HazardMapPoint,
  HazardSource,
  TankData,
  TransportVehicle,
} from './types';

export const ENTERPRISE_STATS: EnterpriseStats = {
  production: 45,
  storage: 128,
  business: 86,
  use: 210,
  transport: 34,
  waste: 12,
};

export const HAZARD_SOURCES: HazardSource = {
  level1: 8,
  level2: 15,
  level3: 42,
  level4: 78,
};

export const MOCK_ALERTS: HazardAlert[] = [
  {
    id: '1',
    type: '超温告警',
    enterprise: '赛科石化有限公司',
    region: '临港化工园区',
    level: 'RED',
    time: '10分钟前',
    status: '待处理',
  },
  {
    id: '2',
    type: '超压告警',
    enterprise: '华谊精细化工',
    region: '金山工业区',
    level: 'ORANGE',
    time: '25分钟前',
    status: '处理中',
  },
  {
    id: '3',
    type: '液位异常',
    enterprise: '中石化储运分公司',
    region: '大榭镇',
    level: 'YELLOW',
    time: '1小时前',
    status: '已闭环',
  },
  {
    id: '4',
    type: '偏离路线',
    enterprise: '顺丰危险品运输',
    region: 'G15高速',
    level: 'BLUE',
    time: '2小时前',
    status: '处理中',
  },
];

export const TANK_MONITORING: TankData[] = [
  { id: 'T001', name: '1号原油罐', type: '浮顶罐', media: '原油', level: 12.5, maxLevel: 15, temp: 32.4, pressure: 0.05 },
  { id: 'T002', name: '2号苯罐', type: '固定顶罐', media: '纯苯', level: 8.2, maxLevel: 10, temp: 28.1, pressure: 0.12 },
  { id: 'T003', name: '3号液化气罐', type: '球罐', media: 'LPG', level: 4.5, maxLevel: 6, temp: 15.2, pressure: 1.25 },
];

/** 临夏州牌号甘N，线路示意永靖县及周边 */
export const TRANSPORT_VEHICLES: TransportVehicle[] = [
  {
    id: 'V001',
    plate: '甘N·D38291',
    enterprise: '永靖县恒通危化运输有限公司',
    status: '在途',
    driver: '马建军',
    route: '刘家峡化工园-G213-西固',
  },
  {
    id: 'V002',
    plate: '甘N·A91628',
    enterprise: '临夏永靖联合物流',
    status: '违规',
    driver: '陕国强',
    route: '盐锅峡镇-永靖县城',
  },
  {
    id: 'V003',
    plate: '甘N·F23057',
    enterprise: '黄河危化品配送中心',
    status: '停靠',
    driver: '孔德胜',
    route: '太极镇-岘塬镇',
  },
  {
    id: 'V004',
    plate: '甘N·K88106',
    enterprise: '永靖县华泰危货运输',
    status: '在途',
    driver: '魏志华',
    route: '三塬-王台-沿黄通道',
  },
  {
    id: 'V005',
    plate: '甘N·M10566',
    enterprise: '县应急物资承运车队',
    status: '在途',
    driver: '罗晓明',
    route: '陈井镇-川城-新寺',
  },
];

export const enterprisePieSeries = () => [
  { name: '生产', value: ENTERPRISE_STATS.production, color: '#38bdf8' },
  { name: '储存', value: ENTERPRISE_STATS.storage, color: '#22d3ee' },
  { name: '经营', value: ENTERPRISE_STATS.business, color: '#818cf8' },
  { name: '使用', value: ENTERPRISE_STATS.use, color: '#fbbf24' },
  { name: '运输', value: ENTERPRISE_STATS.transport, color: '#f87171' },
];

export const hazardBarSeries = () => [
  { name: '一级', value: HAZARD_SOURCES.level1, color: '#ef4444' },
  { name: '二级', value: HAZARD_SOURCES.level2, color: '#f97316' },
  { name: '三级', value: HAZARD_SOURCES.level3, color: '#eab308' },
  { name: '四级', value: HAZARD_SOURCES.level4, color: '#3b82f6' },
];

/** 危化品监管地图标点（示意企业名与位置） */
export const HAZARD_MAP_POINTS: HazardMapPoint[] = [
  {
    id: 'hm-01',
    name: '恒兴化工生产装置区',
    lat: 35.9412,
    lng: 103.2998,
    kind: 'production',
    enterprise: '永靖县恒兴化工有限公司',
    region: '刘家峡镇化工片区',
    summary: '重点监管危险工艺 2 套，DCS/SIS 联锁在线',
    townDrill: '刘家峡镇',
  },
  {
    id: 'hm-02',
    name: '盐锅峡仓储集中区',
    lat: 36.0745,
    lng: 103.2812,
    kind: 'storage',
    enterprise: '永靖县盐化仓储服务中心',
    region: '盐锅峡镇',
    summary: '甲类库 3 座、乙类库 2 座，可燃气体检测 46 点',
    townDrill: '盐锅峡镇',
  },
  {
    id: 'hm-03',
    name: '县级一级重大危险源罐区',
    lat: 35.9368,
    lng: 103.3075,
    kind: 'majorHazard',
    enterprise: '永靖县危化仓储有限公司',
    region: '刘家峡镇',
    summary: '一级重大危险源 · 液氨储罐组 · 在线监测正常',
  },
  {
    id: 'hm-04',
    name: '太极镇经营门市部',
    lat: 35.9615,
    lng: 103.2715,
    kind: 'storage',
    enterprise: '太极镇危化经营店（带储存）',
    region: '太极镇',
    summary: '经营许可证有效期内，库存台账日清',
    townDrill: '太极镇',
  },
  {
    id: 'hm-05',
    name: '甘N危货运输（在途）',
    lat: 35.952,
    lng: 103.292,
    kind: 'vehicle',
    enterprise: '永靖县恒通危化运输有限公司',
    region: 'G213 刘家峡段',
    summary: '车牌甘N·D38291 · 押运员在线 · 按规定路线行驶',
  },
];

export const transportViolationWeek = [
  { name: '周一', value: 12 },
  { name: '周二', value: 18 },
  { name: '周三', value: 15 },
  { name: '周四', value: 25 },
  { name: '周五', value: 20 },
  { name: '周六', value: 10 },
  { name: '周日', value: 8 },
];
