export const disasterTrendData = [
  { name: '1月', 滑坡: 10, 泥石流: 5, 崩塌: 8 },
  { name: '2月', 滑坡: 15, 泥石流: 8, 崩塌: 12 },
  { name: '3月', 滑坡: 25, 泥石流: 15, 崩塌: 20 },
  { name: '4月', 滑坡: 45, 泥石流: 25, 崩塌: 30 },
  { name: '5月', 滑坡: 55, 泥石流: 35, 崩塌: 40 },
  { name: '6月', 滑坡: 40, 泥石流: 45, 崩塌: 35 },
  { name: '7月', 滑坡: 30, 泥石流: 30, 崩塌: 25 },
  { name: '8月', 滑坡: 20, 泥石流: 20, 崩塌: 15 },
  { name: '9月', 滑坡: 15, 泥石流: 15, 崩塌: 10 },
  { name: '10月', 滑坡: 12, 泥石流: 10, 崩塌: 8 },
  { name: '11月', 滑坡: 10, 泥石流: 8, 崩塌: 5 },
  { name: '12月', 滑坡: 8, 泥石流: 5, 崩塌: 3 },
];

export const disasterDistribution = [
  { name: '滑坡', value: 456, color: '#3b82f6' },
  { name: '泥石流', value: 238, color: '#f59e0b' },
  { name: '崩塌', value: 125, color: '#ef4444' },
  { name: '地面塌陷', value: 68, color: '#10b981' },
  { name: '地裂缝', value: 42, color: '#8b5cf6' },
];

export const distributionTotal = disasterDistribution.reduce((s, i) => s + i.value, 0);

export const areaRanking = [
  { name: '刘家峡镇', value: 28, color: '#ef4444' },
  { name: '盐锅峡镇', value: 24, color: '#f59e0b' },
  { name: '西河镇', value: 19, color: '#facc15' },
  { name: '太极镇', value: 16, color: '#22d3ee' },
  { name: '三塬镇', value: 14, color: '#3b82f6' },
  { name: '王台镇', value: 12, color: '#3b82f6' },
  { name: '陈井镇', value: 10, color: '#3b82f6' },
  { name: '岘塬镇', value: 8, color: '#3b82f6' },
];

export const realtimeAlerts = [
  { id: 1, type: '滑坡', level: '红色', location: '刘家峡镇黄河沿岸', time: '10分钟前', status: '待处理' },
  { id: 2, type: '滑坡', level: '橙色', location: '盐锅峡镇库区边坡', time: '25分钟前', status: '处理中' },
  { id: 3, type: '滑坡', level: '橙色', location: '太极镇黄土台塬', time: '1小时前', status: '处理中' },
];

export const mapMarkers = [
  { id: 1, x: '45%', y: '30%', type: '滑坡', level: '高' as const },
  { id: 2, x: '35%', y: '45%', type: '泥石流', level: '中' as const },
  { id: 3, x: '55%', y: '50%', type: '崩塌', level: '高' as const },
  { id: 4, x: '40%', y: '65%', type: '滑坡', level: '低' as const },
  { id: 5, x: '60%', y: '55%', type: '地面塌陷', level: '中' as const },
];

export const mapLegendItems = [
  { label: '滑坡', color: '#f43f5e' },
  { label: '地面塌陷', color: '#f59e0b' },
  { label: '崩塌', color: '#fb923c' },
  { label: '山洪', color: '#3b82f6' },
  { label: '泥石流', color: '#10b981' },
];

export const bottomNavItems = [
  { key: 'hazard', label: '隐患点' },
  { key: 'station', label: '监测站点' },
  { key: 'alert', label: '预警信息' },
  { key: 'threat', label: '威胁范围' },
  { key: 'resource', label: '应急资源' },
  { key: 'route', label: '路线规划' },
];
