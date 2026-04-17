import type {
  AlarmFeedItem,
  AlarmSceneItem,
  MonitorActivitySlot,
  MonitorTypeItem,
  RiskRankingItem,
  SceneStatItem,
  TrendPoint,
} from './types';

export const monitorTypeData: MonitorTypeItem[] = [
  { name: '高清摄像头', value: 456, color: '#00f2ff' },
  { name: '热成像摄像头', value: 238, color: '#ff9d00' },
  { name: '全景摄像头', value: 125, color: '#00ff9d' },
];

/** 活动时段（06:00–22:00）高清 / 热成像高频采样频次曲线，单位：次/分钟 */
export const monitorActivityCurveData: MonitorActivitySlot[] = [
  { slot: '06:00', hdRate: 18, thermalRate: 12 },
  { slot: '07:00', hdRate: 24, thermalRate: 14 },
  { slot: '08:00', hdRate: 32, thermalRate: 16 },
  { slot: '09:00', hdRate: 38, thermalRate: 18 },
  { slot: '10:00', hdRate: 42, thermalRate: 19 },
  { slot: '11:00', hdRate: 40, thermalRate: 20 },
  { slot: '12:00', hdRate: 36, thermalRate: 22 },
  { slot: '13:00', hdRate: 34, thermalRate: 21 },
  { slot: '14:00', hdRate: 39, thermalRate: 20 },
  { slot: '15:00', hdRate: 44, thermalRate: 21 },
  { slot: '16:00', hdRate: 46, thermalRate: 23 },
  { slot: '17:00', hdRate: 48, thermalRate: 26 },
  { slot: '18:00', hdRate: 45, thermalRate: 30 },
  { slot: '19:00', hdRate: 41, thermalRate: 34 },
  { slot: '20:00', hdRate: 36, thermalRate: 38 },
  { slot: '21:00', hdRate: 30, thermalRate: 40 },
  { slot: '22:00', hdRate: 22, thermalRate: 36 },
];

/** AI 研判告警：按视频智能识别类型（今日累计，示意；条目前序按起数降序） */
export const alarmSceneData: AlarmSceneItem[] = [
  { name: '占道违停', value: 22, color: '#22d3ee' },
  { name: '异常聚集', value: 14, color: '#ef4444' },
  { name: '夜间异常', value: 11, color: '#6366f1' },
  { name: '烟火侦测', value: 9, color: '#f97316' },
  { name: '越界闯入', value: 6, color: '#a855f7' },
];

export const riskRankingData: RiskRankingItem[] = [
  { name: '刘家峡镇', score: 92, level: '高' },
  { name: '盐锅峡镇', score: 85, level: '高' },
  { name: '西河镇', score: 64, level: '中' },
  { name: '太极镇', score: 45, level: '低' },
  { name: '三塬镇', score: 38, level: '低' },
];

export const alarmTrendData: TrendPoint[] = [
  { time: '00:00', value: 12 },
  { time: '04:00', value: 8 },
  { time: '08:00', value: 25 },
  { time: '12:00', value: 45 },
  { time: '16:00', value: 38 },
  { time: '20:00', value: 20 },
  { time: '23:59', value: 15 },
];

export const sceneStatsData: SceneStatItem[] = [
  { name: '危房监测', count: 131, status: '正常', color: 'blue' },
  { name: '火灾监测', count: 42, status: '告警', color: 'red' },
  { name: '水域监管', count: 86, status: '正常', color: 'green' },
  { name: '人流监测', count: 12, status: '拥挤', color: 'orange' },
];

export const alarmFeedData: AlarmFeedItem[] = [
  { id: 1, type: '火灾', location: '刘家峡镇黄河沿岸', time: '10分钟前', level: '红色' },
  { id: 2, type: '危房', location: '盐锅峡镇库区边坡', time: '25分钟前', level: '橙色' },
  { id: 3, type: '溺水', location: '太极镇黄土台塬', time: '1小时前', level: '黄色' },
];

/** 公共安全地图标点：乡镇中心为 WGS-84，点位在镇域内微偏移；名称多为广场 / 活动室等 */
export interface PublicSafetyMapPoint {
  id: string;
  township: string;
  placeName: string;
  lat: number;
  lng: number;
  level: 'red' | 'orange' | 'blue' | 'green';
  summary: {
    cameras: number;
    crowdLevel: string;
    aiStatus: string;
    lastPatrol: string;
    dutyOrg: string;
  };
}

export const publicSafetyMapPoints: PublicSafetyMapPoint[] = [
  {
    id: 'ps-01',
    township: '刘家峡镇',
    placeName: '黄河文化广场',
    lat: 35.9412,
    lng: 103.301,
    level: 'orange',
    summary: {
      cameras: 14,
      crowdLevel: '中等',
      aiStatus: '人员流动正常，无异常聚集',
      lastPatrol: '2026-04-14 09:20',
      dutyOrg: '刘家峡派出所 / 综治中心',
    },
  },
  {
    id: 'ps-02',
    township: '刘家峡镇',
    placeName: '城北社区活动室',
    lat: 35.9371,
    lng: 103.308,
    level: 'blue',
    summary: {
      cameras: 6,
      crowdLevel: '低',
      aiStatus: '室内活动预约开放，秩序正常',
      lastPatrol: '2026-04-14 08:45',
      dutyOrg: '社区网格员',
    },
  },
  {
    id: 'ps-03',
    township: '刘家峡镇',
    placeName: '古城综治广场',
    lat: 35.9365,
    lng: 103.298,
    level: 'green',
    summary: {
      cameras: 8,
      crowdLevel: '低',
      aiStatus: '烟火未检出，广播设备在线',
      lastPatrol: '2026-04-13 17:10',
      dutyOrg: '县综治视联网',
    },
  },
  {
    id: 'ps-04',
    township: '盐锅峡镇',
    placeName: '盐锅峡镇文化广场',
    lat: 36.0755,
    lng: 103.281,
    level: 'red',
    summary: {
      cameras: 11,
      crowdLevel: '较高',
      aiStatus: '广场北侧临时摊位聚集，已通知现场劝导',
      lastPatrol: '2026-04-14 10:02',
      dutyOrg: '盐锅峡派出所',
    },
  },
  {
    id: 'ps-05',
    township: '盐锅峡镇',
    placeName: '矿区老年活动室',
    lat: 36.0718,
    lng: 103.287,
    level: 'blue',
    summary: {
      cameras: 4,
      crowdLevel: '低',
      aiStatus: '门禁与烟感在线，无告警',
      lastPatrol: '2026-04-14 07:30',
      dutyOrg: '矿区社区',
    },
  },
  {
    id: 'ps-06',
    township: '西河镇',
    placeName: '西河镇人民广场',
    lat: 36.166,
    lng: 103.206,
    level: 'orange',
    summary: {
      cameras: 9,
      crowdLevel: '中等',
      aiStatus: '节庆布置期间加强巡查提示已下发',
      lastPatrol: '2026-04-14 09:55',
      dutyOrg: '西河镇政府值班室',
    },
  },
  {
    id: 'ps-07',
    township: '西河镇',
    placeName: '西河村党群活动室',
    lat: 36.161,
    lng: 103.212,
    level: 'green',
    summary: {
      cameras: 3,
      crowdLevel: '低',
      aiStatus: '会议时段静音监测正常',
      lastPatrol: '2026-04-13 16:40',
      dutyOrg: '西河村两委',
    },
  },
  {
    id: 'ps-08',
    township: '太极镇',
    placeName: '太极广场',
    lat: 35.9625,
    lng: 103.267,
    level: 'blue',
    summary: {
      cameras: 7,
      crowdLevel: '低',
      aiStatus: '滨河步道人流平稳',
      lastPatrol: '2026-04-14 08:10',
      dutyOrg: '太极镇综治办',
    },
  },
  {
    id: 'ps-09',
    township: '太极镇',
    placeName: '台塬社区活动室',
    lat: 35.958,
    lng: 103.274,
    level: 'green',
    summary: {
      cameras: 5,
      crowdLevel: '低',
      aiStatus: '文体活动备案齐全',
      lastPatrol: '2026-04-13 19:00',
      dutyOrg: '台塬社区',
    },
  },
  {
    id: 'ps-10',
    township: '三塬镇',
    placeName: '三塬镇文体广场',
    lat: 35.893,
    lng: 103.198,
    level: 'blue',
    summary: {
      cameras: 6,
      crowdLevel: '低',
      aiStatus: '夜间照明与一键报警桩自检正常',
      lastPatrol: '2026-04-14 06:50',
      dutyOrg: '三塬镇派出所',
    },
  },
  {
    id: 'ps-11',
    township: '三塬镇',
    placeName: '农田管护站活动室',
    lat: 35.8885,
    lng: 103.204,
    level: 'green',
    summary: {
      cameras: 2,
      crowdLevel: '极低',
      aiStatus: '周界视频轮巡无闯入',
      lastPatrol: '2026-04-12 15:20',
      dutyOrg: '三塬镇农服中心',
    },
  },
  {
    id: 'ps-12',
    township: '王台镇',
    placeName: '王台镇滨河广场',
    lat: 35.8838,
    lng: 103.032,
    level: 'orange',
    summary: {
      cameras: 8,
      crowdLevel: '中等',
      aiStatus: '河岸风大时段已切换热成像辅助',
      lastPatrol: '2026-04-14 09:15',
      dutyOrg: '王台镇应急所',
    },
  },
  {
    id: 'ps-13',
    township: '王台镇',
    placeName: '王台村文化活动室',
    lat: 35.8795,
    lng: 103.038,
    level: 'green',
    summary: {
      cameras: 3,
      crowdLevel: '低',
      aiStatus: '图书室与活动室分路供电正常',
      lastPatrol: '2026-04-13 18:30',
      dutyOrg: '王台村委会',
    },
  },
  {
    id: 'ps-14',
    township: '陈井镇',
    placeName: '陈井镇综治广场',
    lat: 36.0505,
    lng: 103.46,
    level: 'blue',
    summary: {
      cameras: 7,
      crowdLevel: '低',
      aiStatus: '广播联动测试完成',
      lastPatrol: '2026-04-14 07:00',
      dutyOrg: '陈井镇综治中心',
    },
  },
  {
    id: 'ps-15',
    township: '陈井镇',
    placeName: '陈井社区老年活动室',
    lat: 36.0462,
    lng: 103.466,
    level: 'green',
    summary: {
      cameras: 4,
      crowdLevel: '低',
      aiStatus: '跌倒监测雷达待机',
      lastPatrol: '2026-04-13 14:10',
      dutyOrg: '陈井社区',
    },
  },
  {
    id: 'ps-16',
    township: '岘塬镇',
    placeName: '岘塬镇塬边广场',
    lat: 35.9142,
    lng: 103.267,
    level: 'blue',
    summary: {
      cameras: 5,
      crowdLevel: '低',
      aiStatus: '塬边大风预警已推送现场',
      lastPatrol: '2026-04-14 08:30',
      dutyOrg: '岘塬镇派出所',
    },
  },
  {
    id: 'ps-17',
    township: '岘塬镇',
    placeName: '岘塬村党群活动室',
    lat: 35.9095,
    lng: 103.273,
    level: 'green',
    summary: {
      cameras: 3,
      crowdLevel: '低',
      aiStatus: '党员活动日秩序正常',
      lastPatrol: '2026-04-13 17:50',
      dutyOrg: '岘塬村党支部',
    },
  },
  {
    id: 'ps-18',
    township: '太极镇',
    placeName: '太极镇应急避难广场',
    lat: 35.9642,
    lng: 103.2725,
    level: 'red',
    summary: {
      cameras: 12,
      crowdLevel: '高',
      aiStatus: '演练日人流密集，已增派无人机巡航',
      lastPatrol: '2026-04-14 10:18',
      dutyOrg: '县应急局 / 太极镇',
    },
  },
];
