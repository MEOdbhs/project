import { defHttp } from '/@/utils/http/axios';

// // 在线率统计图表数据
// export const getOnlineRateData = (params?: any) => {
//   // 示例：返回模拟数据，实际需替换为真实接口
//   return defHttp.get({ url: '/main-app/statistics/onlineRate', params });
// };

// // 设备可靠性列表
// export const getReliabilityList = (params: any) => {
//   return defHttp.get({ url: '/main-app/statistics/reliability', params });
// };

// // 维修成本分析数据
// export const getCostData = (params?: any) => {
//   return defHttp.get({ url: '/main-app/statistics/costAnalysis', params });
// };
// 模拟：设备在线率统计（折线图）
export const getOnlineRateData = () => {
  return Promise.resolve({
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    series: [
      { name: '矿山设备', data: [92.0, 91.0, 92.5, 91.0, 92.0, 93.0, 92.0] },
      { name: '水文监测', data: [94.5, 93.0, 95.0, 94.0, 96.0, 97.0, 96.0] },
      { name: '森林防火', data: [88.0, 84.0, 86.0, 88.0, 90.0, 91.0, 92.0] },
      { name: '危化品监测', data: [90.0, 87.0, 89.0, 90.0, 91.0, 92.0, 93.0] },
    ],
  });
};

// 平均无故障时间（柱状图）- 模拟数据
export const getMtbfData = () => {
  return Promise.resolve([
    { category: '矿山设备', mtbf: 125 },
    { category: '水文监测', mtbf: 180 },
    { category: '森林防火', mtbf: 95 },
    { category: '危化品监测', mtbf: 145 },
  ]);
};

// 设备可靠性分析列表（分页）- 模拟数据（与之前相同）
export const getReliabilityList = (params: any) => {
  const mockData = [
    { brand: '品牌A', category: '矿山', deviceType: '表面位移', deviceName: 'GNSS231', deviceCount: 30, failureRate: 78.2 },
    { brand: '品牌B', category: '地质灾害', deviceType: '内部位移', deviceName: 'XXX', deviceCount: 40, failureRate: 65.5 },
    { brand: '品牌C', category: '水文', deviceType: '渗压', deviceName: 'XXX', deviceCount: 50, failureRate: 52.3 },
    { brand: '品牌D', category: '工贸', deviceType: '雨量', deviceName: 'XXX', deviceCount: 50, failureRate: 48.7 },
    { brand: '品牌E', category: '危险化学品', deviceType: '表面位移', deviceName: 'XXX', deviceCount: 50, failureRate: 32.1 },
    { brand: '品牌F', category: '森林防火', deviceType: '内部位移', deviceName: 'XXX', deviceCount: 50, failureRate: 25.6 },
    { brand: '品牌G', category: '矿山', deviceType: '渗压', deviceName: 'XXX', deviceCount: 50, failureRate: 18.9 },
  ];

  let filtered = [...mockData];
  if (params.category) filtered = filtered.filter(item => item.category === params.category);
  if (params.deviceType) filtered = filtered.filter(item => item.deviceType === params.deviceType);
  if (params.deviceName) filtered = filtered.filter(item => item.deviceName.includes(params.deviceName));

  const start = (params.pageNo - 1) * params.pageSize;
  const end = start + params.pageSize;
  return Promise.resolve({
    records: filtered.slice(start, end),
    total: filtered.length,
  });
};

// 维修成本分析（柱状图）- 模拟数据
export const getCostData = () => {
  return Promise.resolve({
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    costs: [8.5, 8.0, 7.8, 7.5, 7.2, 6.8, 6.5, 6.3, 6.0, 5.8, 5.5, 5.2],
  });
};