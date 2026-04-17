export type RiskLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'BLUE';

export interface HazardAlert {
  id: string;
  type: string;
  enterprise: string;
  region: string;
  level: RiskLevel;
  time: string;
  status: '待处理' | '处理中' | '已闭环';
}

export interface EnterpriseStats {
  production: number;
  storage: number;
  business: number;
  use: number;
  transport: number;
  waste: number;
}

export interface HazardSource {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
}

export interface TankData {
  id: string;
  name: string;
  type: string;
  media: string;
  level: number;
  temp: number;
  pressure: number;
  maxLevel: number;
}

export interface TransportVehicle {
  id: string;
  plate: string;
  enterprise: string;
  status: '在途' | '停靠' | '违规';
  driver: string;
  route: string;
}

export type DrillLevel = 'COUNTY' | 'TOWN' | 'ENTERPRISE';

/** 危化地图标点：WGS-84，乡镇坐标与项目内其它页一致 */
export type HazardMapPointKind = 'production' | 'storage' | 'majorHazard' | 'vehicle';

export interface HazardMapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: HazardMapPointKind;
  enterprise: string;
  region: string;
  summary: string;
  /** 存在时下钻为乡镇视角 */
  townDrill?: string;
}

export interface DetailPayload {
  name?: string;
  enterprise?: string;
  region?: string;
  type?: string;
  scale?: string;
  level?: string;
}
