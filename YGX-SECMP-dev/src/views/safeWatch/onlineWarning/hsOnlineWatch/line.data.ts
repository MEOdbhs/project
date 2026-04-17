// 设备属性接口（第三层）
export interface DeviceIndex {
  safeDeviceQuotaName: string; // 属性名称，例如：环境监测温度
  monitorValue: string | number; // 监测值，例如：56.5
  unit?: string; // 单位
  level?: string; // 级别
  warningColor?: 'red' | 'orange' | 'yellow' | 'blue'; // 警告颜色
}

// 设备信息接口（第二层）
export interface DeviceInfo {
  id: string;
  name?: string; // 设备名称（保持向后兼容）
  deviceSafeCheckName?: string; // 设备安全检查名称
  deviceSafeCheckNo?: string; // 设备安全检查编号
  deviceSafeCheckId?: string; // 设备安全检查ID
  code?: string;
  status: 0 | 1 | 2; // 设备状态：0在线，1离线，2预警
  statusText?: string; // 状态文本（保持向后兼容）
  time?: string; // 更新时间（保持向后兼容）
  monitorDate?: string; // 监测日期
  indexList: DeviceIndex[]; // 设备属性列表
}

// 罐区信息接口（第一层）
export interface CanAreaInfo {
  canId: string; // 罐区ID
  canName?: string; // 罐区名称（保持向后兼容）
  seriousOriginalName?: string; // 重大危险源原始名称
  canType?: string; // 罐区类型（保持向后兼容）
  hazardLevelText?: string; // 危险等级文本
  deviceList: DeviceInfo[]; // 设备列表
}

// 重大危险源选项接口
export interface HazardOption {
  id: string;
  hazardName: string;
}

// 统计数据接口
export interface CountStatistics {
  all: number;    // 全部
  normal: number; // 在线 (status: 0)
  offline: number; // 离线 (status: 1)  
  alarm: number; // 预警 (status: 2)
}

// 指标选项接口
export interface QuotaOption {
  id: string;
  quotaName: string;
  unit?: string; // 单位编码
}

// 图表数据点接口
export interface ChartDataPoint {
  monitorDate: string; // 监测时间
  monitorValue: number; // 监测值
}

// 趋势图表数据接口
export interface TrendChartData {
  records: ChartDataPoint[]; // 分页数据在records字段中
  total?: number; // 总数
  unit?: string; // 单位中文名称
}

// 保持向后兼容的旧接口
export interface CardData {
  id: string;
  name: string;
  code: string;
  time: string;
  status: 0 | 1 | 2;
  statusText: string;
  canId: string;
  sensors: SensorData[];
  indexList?: DeviceIndex[]; // 可选，保持兼容性
}

export interface SensorData {
  name: string;
  value: string | number;
  unit?: string;
  level?: string;
}

// 生成模拟卡片数据
export const generateMockData = (): CardData[] => {
  const data: CardData[] = [];
  
  // 1#罐区数据
  data.push({
    id: '1',
    name: '环境监测装置',
    code: '',
    time: '2025-08-26 17:02:35',
    status: 2,
    statusText: '预警',
    canId: '1#罐区 (42037002025)',
    sensors: [
      { name: '环境监测温度', value: '56.5℃', unit: '', level: '' },
      { name: '雷电预警等级HL', value: '0等级', unit: '', level: '' },
      { name: '环境监测大气电压', value: '200V', unit: '', level: '' },
      { name: '环境监测湿度', value: '40%', unit: '', level: '' },
      { name: '风速', value: '0.85m/s', unit: '', level: '' },
      { name: '风向', value: '90°', unit: '', level: '' },
    ]
  });
  
  data.push({
    id: '2',
    name: '可燃气体探头-001Q0003',
    code: '',
    time: '2025-08-26 17:02:35',
    status: 0,
    statusText: '在线',
    canId: '1#罐区 (42037002025)',
    sensors: [
      { name: '可燃气体', value: '0%', unit: '', level: '' },
    ]
  });
  
  data.push({
    id: '3',
    name: '3#汽油储罐',
    code: '',
    time: '2025-08-26 17:02:35',
    status: 0,
    statusText: '在线',
    canId: '1#罐区 (42037002025)',
    sensors: [
      { name: '温度', value: '26.5℃', unit: '', level: '' },
      { name: '液位', value: '2260mm', unit: '', level: '' },
    ]
  });
  
  // 2#罐区数据
  data.push({
    id: '4',
    name: '环境监测装置2',
    code: '',
    time: '2025-08-26 17:02:35',
    status: 0,
    statusText: '在线',
    canId: '2#罐区 (42038002025)',
    sensors: [
      { name: '环境监测温度', value: '26.5℃', unit: '', level: '' },
      { name: '雷电预警等级HL', value: '0等级', unit: '', level: '' },
      { name: '环境监测大气电压', value: '200V', unit: '', level: '' },
      { name: '环境监测湿度', value: '40%', unit: '', level: '' },
      { name: '风速', value: '0.85m/s', unit: '', level: '' },
      { name: '风向', value: '90°', unit: '', level: '' },
    ]
  });
  
  data.push({
    id: '5',
    name: '可燃气体探头-001Q0004',
    code: '',
    time: '2025-08-26 17:02:35',
    status: 1,
    statusText: '离线',
    canId: '2#罐区 (42038002025)',
    sensors: [
      { name: '可燃气体', value: '-', unit: '', level: '' },
    ]
  });
  
  data.push({
    id: '6',
    name: '4#汽油储罐',
    code: '',
    time: '2025-08-26 17:02:35',
    status: 0,
    statusText: '在线',
    canId: '2#罐区 (42038002025)',
    sensors: [
      { name: '温度', value: '26.5℃', unit: '', level: '' },
      { name: '液位', value: '2260mm', unit: '', level: '' },
    ]
  });
  
  // 3#罐区数据
  for (let i = 7; i <= 15; i++) {
    const statusOptions: Array<0 | 1 | 2> = [0, 1, 2];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const statusTextMap = { 0: '在线', 1: '离线', 2: '预警' };
    
    data.push({
      id: String(i),
      name: `监测设备${i}`,
      code: `CODE-${String(i).padStart(4, '0')}`,
      time: '2025-08-26 17:02:35',
      status,
      statusText: statusTextMap[status],
      canId: '3#罐区 (42039002025)',
      sensors: [
        { name: '温度', value: `${(20 + Math.random() * 15).toFixed(1)}℃`, unit: '', level: '' },
        { name: '压力', value: `${(100 + Math.random() * 50).toFixed(0)}kPa`, unit: '', level: '' },
        { name: '液位', value: `${(2000 + Math.random() * 500).toFixed(0)}mm`, unit: '', level: '' },
      ]
    });
  }
  
  return data;
};

// 生成符合新结构的模拟数据（三层结构）
export const generateMockCanAreaData = (): CanAreaInfo[] => {
  const canAreas: CanAreaInfo[] = [];
  
  // 1#罐区
  canAreas.push({
    canId: '42037002025',
    canName: '1#罐区 (42037002025)',
    canType: '二级危险源',
    deviceList: [
      {
        id: '1',
        name: '环境监测装置',
        code: 'ENV-001',
        status: 2,
        statusText: '预警',
        time: '2025-08-26 17:02:35',
        indexList: [
          { safeDeviceQuotaName: '环境监测温度', monitorValue: '56.5', unit: '℃', warningColor: 'red' },
          { safeDeviceQuotaName: '雷电预警等级HL', monitorValue: '0', unit: '等级', warningColor: 'blue' },
          { safeDeviceQuotaName: '环境监测大气电压', monitorValue: '200', unit: 'V', warningColor: 'yellow' },
          { safeDeviceQuotaName: '环境监测湿度', monitorValue: '40', unit: '%', warningColor: 'blue' },
          { safeDeviceQuotaName: '风速', monitorValue: '0.85', unit: 'm/s', warningColor: 'blue' },
          { safeDeviceQuotaName: '风向', monitorValue: '90', unit: '°', warningColor: 'blue' },
        ]
      },
      {
        id: '2',
        name: '可燃气体探头-001Q0003',
        code: '001Q0003',
        status: 0,
        statusText: '在线',
        time: '2025-08-26 17:02:35',
        indexList: [
          { safeDeviceQuotaName: '可燃气体', monitorValue: '0', unit: '%', warningColor: 'blue' },
        ]
      },
      {
        id: '3',
        name: '3#汽油储罐',
        code: 'TANK-003',
        status: 0,
        statusText: '在线',
        time: '2025-08-26 17:02:35',
        indexList: [
          { safeDeviceQuotaName: '温度', monitorValue: '26.5', unit: '℃', warningColor: 'blue' },
          { safeDeviceQuotaName: '液位', monitorValue: '2260', unit: 'mm', warningColor: 'blue' },
        ]
      }
    ]
  });
  
  // 2#罐区
  canAreas.push({
    canId: '42038002025',
    canName: '2#罐区 (42038002025)',
    canType: '二级危险源',
    deviceList: [
      {
        id: '4',
        name: '环境监测装置2',
        code: 'ENV-002',
        status: 0,
        statusText: '在线',
        time: '2025-08-26 17:02:35',
        indexList: [
          { safeDeviceQuotaName: '环境监测温度', monitorValue: '26.5', unit: '℃', warningColor: 'blue' },
          { safeDeviceQuotaName: '雷电预警等级HL', monitorValue: '0', unit: '等级', warningColor: 'blue' },
          { safeDeviceQuotaName: '环境监测大气电压', monitorValue: '200', unit: 'V', warningColor: 'blue' },
          { safeDeviceQuotaName: '环境监测湿度', monitorValue: '40', unit: '%', warningColor: 'blue' },
          { safeDeviceQuotaName: '风速', monitorValue: '0.85', unit: 'm/s', warningColor: 'blue' },
          { safeDeviceQuotaName: '风向', monitorValue: '90', unit: '°', warningColor: 'blue' },
        ]
      },
      {
        id: '5',
        name: '可燃气体探头-001Q0004',
        code: '001Q0004',
        status: 1,
        statusText: '离线',
        time: '2025-08-26 17:02:35',
        indexList: [
          { safeDeviceQuotaName: '可燃气体', monitorValue: '-', unit: '%', warningColor: 'blue' },
        ]
      },
      {
        id: '6',
        name: '4#汽油储罐',
        code: 'TANK-004',
        status: 0,
        statusText: '在线',
        time: '2025-08-26 17:02:35',
        indexList: [
          { safeDeviceQuotaName: '温度', monitorValue: '26.5', unit: '℃', warningColor: 'blue' },
          { safeDeviceQuotaName: '液位', monitorValue: '2260', unit: 'mm', warningColor: 'blue' },
        ]
      }
    ]
  });
  
  // 3#罐区
  const deviceList3: DeviceInfo[] = [];
  for (let i = 7; i <= 15; i++) {
    const statusOptions: Array<0 | 1 | 2> = [0, 1, 2];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const statusTextMap = { 0: '在线', 1: '离线', 2: '预警' };
    const colorOptions: Array<'red' | 'orange' | 'yellow' | 'blue'> = ['red', 'orange', 'yellow', 'blue'];
    
    deviceList3.push({
      id: String(i),
      name: `监测设备${i}`,
      code: `CODE-${String(i).padStart(4, '0')}`,
      status,
      statusText: statusTextMap[status],
      time: '2025-08-26 17:02:35',
      indexList: [
        { 
          safeDeviceQuotaName: '温度', 
          monitorValue: (20 + Math.random() * 15).toFixed(1), 
          unit: '℃',
          warningColor: colorOptions[Math.floor(Math.random() * colorOptions.length)]
        },
        { 
          safeDeviceQuotaName: '压力', 
          monitorValue: (100 + Math.random() * 50).toFixed(0), 
          unit: 'kPa',
          warningColor: colorOptions[Math.floor(Math.random() * colorOptions.length)]
        },
        { 
          safeDeviceQuotaName: '液位', 
          monitorValue: (2000 + Math.random() * 500).toFixed(0), 
          unit: 'mm',
          warningColor: colorOptions[Math.floor(Math.random() * colorOptions.length)]
        },
      ]
    });
  }
  
  canAreas.push({
    canId: '42039002025',
    canName: '3#罐区 (42039002025)',
    canType: '二级危险源',
    deviceList: deviceList3
  });
  
  return canAreas;
};

// 生成图表数据
export const generateChartData = (cardId: string) => {
  const now = new Date();
  const xData: string[] = [];
  const yData: number[] = [];
  
  // 生成过去7天的数据点（每小时一个点，共168个点）
  for (let i = 167; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hour = String(time.getHours()).padStart(2, '0');
    xData.push(`${month}-${day} ${hour}:00`);
    // 生成随机数据，如果是预警状态，则值偏大
    const baseValue = cardId === '1' ? 50 : 25;
    yData.push(baseValue + Math.random() * 10 - 5);
  }
  
  return { xData, yData };
};

