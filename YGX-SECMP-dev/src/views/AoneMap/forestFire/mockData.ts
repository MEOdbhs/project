import type { EmergencyResource, FirePoint, UAVPatrol } from './types';

// location 为 [经度, 纬度]（WGS-84），火点/资源取永靖县境内 OSM 参考位置，与县域底图一致
export const mockFirePoints: FirePoint[] = [
  {
    id: 'F2026041001',
    name: '青龙山林场火情',
    status: 'confirmed',
    level: 'II',
    location: [103.5856, 36.0037],
    area: 12.5,
    startTime: '2026-04-10 08:30',
    duration: '5.5h',
    description: '火势向东北方向蔓延，受风力影响较大。',
  },
  {
    id: 'F2026041002',
    name: '白虎岭疑似烟雾',
    status: 'suspected',
    level: 'IV',
    location: [103.0342, 35.8815],
    area: 0.5,
    startTime: '2026-04-10 13:15',
    duration: '0.5h',
    description: '卫星监测到热点，无人机正在前往核实。',
  },
  {
    id: 'F2026040905',
    name: '朱雀谷余火扑灭',
    status: 'extinguished',
    level: 'III',
    location: [103.27, 35.9604],
    area: 8.2,
    startTime: '2026-04-09 10:00',
    duration: '24h',
    description: '明火已扑灭，目前处于清理余火阶段。',
  },
];

export const mockResources: EmergencyResource[] = [
  {
    id: 'R001',
    name: '县森防大队一中队',
    type: 'team',
    status: 'busy',
    location: [103.3034, 35.9389],
    details: {
      count: 45,
      equipment: ['风力灭火机 x15', '水泵 x2', '运兵车 x3'],
    },
  },
  {
    id: 'R002',
    name: '东部物资储备库',
    type: 'supply',
    status: 'available',
    location: [103.4627, 36.0484],
    details: {
      items: [
        { name: '灭火弹', quantity: 200, unit: '枚' },
        { name: '防火服', quantity: 150, unit: '套' },
        { name: '饮用水', quantity: 500, unit: '箱' },
      ],
    },
  },
  {
    id: 'R003',
    name: '林火视频监控塔 #12',
    type: 'facility',
    status: 'available',
    location: [103.2836, 36.0735],
    details: {
      equipment: ['双光谱云台', '红外探测器'],
    },
  },
];

export const mockUAVPatrols: UAVPatrol[] = [
  { id: 'UAV01', route: '北线巡护', coverage: 45.2, hazardsFound: 2, date: '2026-04-10' },
  { id: 'UAV02', route: '南线巡护', coverage: 38.5, hazardsFound: 0, date: '2026-04-10' },
  { id: 'UAV03', route: '西线巡护', coverage: 52.1, hazardsFound: 1, date: '2026-04-09' },
];

export const fireTrend24h = [
  { time: '08:00', count: 2 },
  { time: '09:00', count: 5 },
  { time: '10:00', count: 8 },
  { time: '11:00', count: 12 },
  { time: '12:00', count: 10 },
  { time: '13:00', count: 15 },
  { time: '14:00', count: 18 },
];

export const resourcePieData = [
  { name: '救援队伍', value: 12, color: '#3b82f6' },
  { name: '应急物资', value: 45, color: '#10b981' },
  { name: '基础设施', value: 28, color: '#f59e0b' },
];

export const supplyProgress = [
  { name: '灭火弹', current: 85, total: 100 },
  { name: '防火服', current: 60, total: 100 },
  { name: '饮用水', current: 92, total: 100 },
  { name: '燃油', current: 45, total: 100 },
];
