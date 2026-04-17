export type RiskLevel = 'red' | 'orange' | 'yellow' | 'blue';

export interface MonitorTypeItem {
  name: string;
  value: number;
  color: string;
}

export interface AlarmSceneItem {
  name: string;
  value: number;
  color: string;
}

export interface RiskRankingItem {
  name: string;
  score: number;
  level: '高' | '中' | '低';
}

export interface TrendPoint {
  time: string;
  value: number;
}

/** 活动时段内高清 / 热成像监测频次（示意：次/分钟） */
export interface MonitorActivitySlot {
  slot: string;
  hdRate: number;
  thermalRate: number;
}

export interface SceneStatItem {
  name: string;
  count: number;
  status: string;
  color: 'blue' | 'red' | 'green' | 'orange';
}

export interface AlarmFeedItem {
  id: number;
  type: string;
  location: string;
  time: string;
  level: '红色' | '橙色' | '黄色';
}
