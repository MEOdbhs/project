export interface HydrologyStation {
  id: string;
  name: string;
  river: string;
  lat: number;
  lng: number;
  waterLevel: number;
  flow: number;
  warningLevel: number;
  status: 'normal' | 'warning' | 'danger';
  trend: number[];
}

export interface WaterQualityRow {
  station: string;
  ph: number;
  dissolvedOxygen: number;
  turbidity: number;
  conductivity: number;
  status: 'good' | 'fair' | 'poor';
}

export interface HydrologyWarning {
  id: string;
  station: string;
  type: 'level' | 'flow' | 'quality';
  level: 'info' | 'warning' | 'danger';
  message: string;
  time: string;
}

// 站点经纬度参考 OSM Nominatim 等公开地理数据（WGS-84）
export const hydrologyStations: HydrologyStation[] = [
  {
    id: 'S001',
    name: '刘家峡水库入口站',
    river: '黄河',
    lat: 35.83116,
    lng: 103.19708,
    waterLevel: 1728.5,
    flow: 850,
    warningLevel: 1730,
    status: 'normal',
    trend: [
      1727, 1727.2, 1727.5, 1727.8, 1728, 1728.2, 1728.4, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5,
      1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5, 1728.5,
    ],
  },
  {
    id: 'S002',
    name: '盐锅峡入库站',
    river: '黄河',
    lat: 35.99517,
    lng: 103.1944,
    waterLevel: 1618.2,
    flow: 920,
    warningLevel: 1620,
    status: 'normal',
    trend: [
      1617, 1617.2, 1617.5, 1617.8, 1618, 1618, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2,
      1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2, 1618.2,
    ],
  },
  {
    id: 'S003',
    name: '湟水河入黄站',
    river: '湟水河',
    lat: 35.855,
    lng: 103.098,
    waterLevel: 1785.6,
    flow: 45,
    warningLevel: 1787,
    status: 'warning',
    trend: [
      1783, 1783.5, 1784, 1784.5, 1785, 1785.2, 1785.4, 1785.5, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6,
      1785.6, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6, 1785.6,
    ],
  },
  {
    id: 'S004',
    name: '洮河入黄口站',
    river: '洮河',
    lat: 35.9213,
    lng: 103.36777,
    waterLevel: 1656.8,
    flow: 128,
    warningLevel: 1658,
    status: 'normal',
    trend: [
      1655, 1655.2, 1655.5, 1655.8, 1656, 1656.2, 1656.4, 1656.6, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8,
      1656.8, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8, 1656.8,
    ],
  },
  {
    id: 'S005',
    name: '太极岛监测站',
    river: '黄河',
    lat: 35.962,
    lng: 103.275,
    waterLevel: 1720.3,
    flow: 1050,
    warningLevel: 1722,
    status: 'normal',
    trend: [
      1719, 1719.3, 1719.5, 1719.8, 1720, 1720.1, 1720.2, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3,
      1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3, 1720.3,
    ],
  },
  {
    id: 'S006',
    name: '盐锅峡出库站',
    river: '黄河',
    lat: 36.06106,
    lng: 103.27686,
    waterLevel: 1598.5,
    flow: 1150,
    warningLevel: 1600,
    status: 'danger',
    trend: [
      1596, 1596.2, 1596.5, 1596.8, 1597, 1597.5, 1597.8, 1598, 1598.2, 1598.4, 1598.5, 1598.5, 1598.5, 1598.5,
      1598.5, 1598.5, 1598.5, 1598.5, 1598.5, 1598.5, 1598.5, 1598.5, 1598.5, 1598.5,
    ],
  },
];

export const waterQualityRows: WaterQualityRow[] = [
  { station: '刘家峡水库入口站', ph: 8.1, dissolvedOxygen: 7.8, turbidity: 5, conductivity: 520, status: 'good' },
  { station: '盐锅峡入库站', ph: 8.3, dissolvedOxygen: 7.5, turbidity: 8, conductivity: 580, status: 'good' },
  { station: '湟水河入黄站', ph: 7.9, dissolvedOxygen: 6.8, turbidity: 25, conductivity: 680, status: 'fair' },
  { station: '太极岛监测站', ph: 8.0, dissolvedOxygen: 8.2, turbidity: 4, conductivity: 510, status: 'good' },
];

export const hydrologyWarnings: HydrologyWarning[] = [
  {
    id: 'W001',
    station: '盐锅峡出库站',
    type: 'level',
    level: 'danger',
    message: '盐锅峡出库站水位接近警戒线，注意防范',
    time: '10:32',
  },
  {
    id: 'W002',
    station: '湟水河入黄站',
    type: 'flow',
    level: 'warning',
    message: '湟水河入黄站流量上涨，需关注水质变化',
    time: '09:45',
  },
  {
    id: 'W003',
    station: '刘家峡水库入口站',
    type: 'quality',
    level: 'info',
    message: '刘家峡水库入口水质优良，可放心使用',
    time: '08:20',
  },
];

export function stationStatusLabel(status: HydrologyStation['status']) {
  if (status === 'normal') return '正常';
  if (status === 'warning') return '预警';
  return '告警';
}

export function waterQualityStatusLabel(status: WaterQualityRow['status']) {
  if (status === 'good') return '优';
  if (status === 'fair') return '良';
  return '差';
}
