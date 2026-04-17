import type { CountyStats, Enterprise, Township } from './types';

/** 乡镇驻地经纬度参考 OSM Nominatim（WGS-84），永靖县内示意 */
export const TOWNSHIPS: Township[] = [
  {
    id: 't1',
    name: '刘家峡镇',
    lat: 35.93894,
    lng: 103.30337,
    riskLevel: 'red',
    stats: {
      enterpriseCount: 12,
      processStats: [
        { name: '熔炼', value: 5 },
        { name: '抛光', value: 8 },
        { name: '喷涂', value: 3 },
      ],
    },
  },
  {
    id: 't2',
    name: '盐锅峡镇',
    lat: 36.07348,
    lng: 103.28362,
    riskLevel: 'orange',
    stats: {
      enterpriseCount: 8,
      processStats: [
        { name: '打磨', value: 12 },
        { name: '制冷', value: 4 },
      ],
    },
  },
  {
    id: 't3',
    name: '太极镇',
    lat: 35.9604,
    lng: 103.26999,
    riskLevel: 'yellow',
    stats: {
      enterpriseCount: 15,
      processStats: [
        { name: '铸造', value: 6 },
        { name: '除尘', value: 10 },
      ],
    },
  },
  {
    id: 't4',
    name: '陈井镇',
    lat: 36.04838,
    lng: 103.46266,
    riskLevel: 'blue',
    stats: {
      enterpriseCount: 6,
      processStats: [{ name: '仓储', value: 4 }],
    },
  },
];

export const ENTERPRISES: Enterprise[] = [
  {
    id: 'e1',
    name: '鑫诚金属制品有限公司',
    type: '金属冶炼',
    townshipId: 't1',
    riskLevel: 'red',
    lat: 35.9402,
    lng: 103.3055,
    realTimeData: {
      temperature: 1248,
      humidity: 38,
      pressure: 0.085,
      status: 'alarm',
    },
    alarms: { unhandled: 5, handled: 12, total: 17 },
  },
  {
    id: 'e2',
    name: '华艺木业加工厂',
    type: '粉尘涉爆',
    townshipId: 't1',
    riskLevel: 'orange',
    lat: 35.9365,
    lng: 103.3012,
    realTimeData: {
      temperature: 27.2,
      humidity: 52,
      pressure: 0.101,
      concentration: 15.5,
      status: 'warning',
    },
    alarms: { unhandled: 2, handled: 8, total: 10 },
    dustInfo: {
      type: '木粉尘',
      workerCount: 35,
      scale: '规上',
      removalSystem: '集中式',
      process: '木制品',
    },
  },
  {
    id: 'e3',
    name: '鼎力深井铸造有限公司',
    type: '深井铸造',
    townshipId: 't2',
    riskLevel: 'orange',
    lat: 36.0745,
    lng: 103.285,
    realTimeData: {
      temperature: 165,
      humidity: 28,
      pressure: 2.38,
      status: 'normal',
    },
    alarms: { unhandled: 3, handled: 5, total: 8 },
  },
  {
    id: 'e4',
    name: '雪源制冷设备有限公司',
    type: '涉氨制冷',
    townshipId: 't3',
    riskLevel: 'yellow',
    lat: 35.9618,
    lng: 103.268,
    realTimeData: {
      temperature: -22,
      humidity: 62,
      pressure: 0.42,
      concentration: 0.18,
      status: 'normal',
    },
    alarms: { unhandled: 1, handled: 15, total: 16 },
  },
  {
    id: 'e5',
    name: '精工金属粉末厂',
    type: '粉尘涉爆',
    townshipId: 't3',
    riskLevel: 'red',
    lat: 35.9575,
    lng: 103.2635,
    realTimeData: {
      temperature: 32.6,
      humidity: 46,
      pressure: 0.098,
      concentration: 25.0,
      status: 'alarm',
    },
    alarms: { unhandled: 8, handled: 20, total: 28 },
    dustInfo: {
      type: '金属粉尘',
      workerCount: 15,
      scale: '规下',
      removalSystem: '单体式',
      process: '金属制品加工',
    },
  },
];

export function townshipNameById(id: string): string {
  return TOWNSHIPS.find((t) => t.id === id)?.name ?? '';
}

export const COUNTY_STATS: CountyStats = {
  totalEnterprises: 41,
  typeDistribution: [
    { name: '金属冶炼', value: 8 },
    { name: '粉尘涉爆', value: 15 },
    { name: '深井铸造', value: 10 },
    { name: '涉氨制冷', value: 8 },
  ],
  riskStats: {
    unhandled: 19,
    handled: 60,
    total: 79,
    byLevel: {
      red: { unhandled: 10, handled: 15, total: 25 },
      orange: { unhandled: 5, handled: 20, total: 25 },
      yellow: { unhandled: 3, handled: 15, total: 18 },
      blue: { unhandled: 1, handled: 10, total: 11 },
    },
  },
};

export const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const DUST_TYPE_DATA = [
  { name: '金属粉尘', value: 8 },
  { name: '木粉尘', value: 12 },
  { name: '其他', value: 5 },
];

export const WORKER_COUNT_DATA = [
  { name: '30人以上', value: 4 },
  { name: '10-29人', value: 15 },
  { name: '1-9人', value: 22 },
];
