export type RiskLevel = 'red' | 'orange' | 'yellow' | 'blue';

export type EnterpriseType = '金属冶炼' | '粉尘涉爆' | '深井铸造' | '涉氨制冷';

export interface Enterprise {
  id: string;
  name: string;
  type: EnterpriseType;
  townshipId: string;
  riskLevel: RiskLevel;
  /** WGS-84，与县域底图一致 */
  lat: number;
  lng: number;
  realTimeData: {
    /** 车间 / 设备温度 ℃（涉氨可为冷库温度） */
    temperature?: number;
    /** 相对湿度 % */
    humidity?: number;
    /** 管道 / 容器压力 MPa */
    pressure?: number;
    /** 粉尘或氨浓度 mg/m³ */
    concentration?: number;
    status: 'normal' | 'warning' | 'alarm';
  };
  alarms: {
    unhandled: number;
    handled: number;
    total: number;
  };
  dustInfo?: {
    type: '金属粉尘' | '木粉尘' | '其他';
    workerCount: number;
    scale: '规上' | '规下';
    removalSystem: '集中式' | '单体式' | '其他';
    process: '金属制品加工' | '农副产品加工' | '木制品' | '其他';
  };
}

export interface Township {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  stats: {
    enterpriseCount: number;
    processStats: { name: string; value: number }[];
  };
}

export interface CountyStats {
  totalEnterprises: number;
  typeDistribution: { name: string; value: number }[];
  riskStats: {
    unhandled: number;
    handled: number;
    total: number;
    byLevel: Record<RiskLevel, { unhandled: number; handled: number; total: number }>;
  };
}

export type MapLevel = 'county' | 'township' | 'enterprise';
