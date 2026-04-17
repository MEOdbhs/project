import { defHttp } from '/@/utils/http/axios';

enum Api {
  listPage = '/main-app/SnHazardMonitorEquipment/listOuter',
  countOuter = '/main-app/SnHazardMonitorEquipment/countOuter',
  chartData = '/main-app/HsOnlineWatch/chartData',
  hazardManageList = '/main-app/SfHazardManage/list',
  quotaList = '/main-app/SfDeviceSafeCheck/quotaList',
  queryTrendChart = '/main-app/SnHazardMonitorEquipment/queryTrendChart',
}

/**
 * 列表(分页)
 * @param params
 */
export const getHazardMonitorEquipmentList = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 获取图表数据
 * @param params
 */
export const getChartData = (params) => defHttp.get({ url: Api.chartData, params });

/**
 * 获取设备状态统计数量
 * @param params
 */
export const getCountOuter = (params) => defHttp.get({ url: Api.countOuter, params });

/**
 * 获取重大危险源管理列表
 * @param params
 */
export const getHazardManageList = (params) => defHttp.get({ url: Api.hazardManageList, params });

/**
 * 获取设备安全检查指标列表
 * @param params
 */
export const getQuotaList = (params) => defHttp.get({ url: Api.quotaList, params });

/**
 * 获取趋势图表数据
 * @param params
 */
export const getQueryTrendChart = (params) => defHttp.get({ url: Api.queryTrendChart, params });

