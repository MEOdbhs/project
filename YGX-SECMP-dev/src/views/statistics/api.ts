import { defHttp } from '/@/utils/http/axios';
// import { message } from 'ant-design-vue';

enum Api {
    realTimeWeather = '/main-app/SnAPicture/realTimeWeather',
    warningLevelStatistics = '/main-app/SnAPicture/warningLevelStatistics',
    warnEventsList = '/main-app/SnAPicture/warnEventsList',
    areaDisposalProgress = '/main-app/SnAPicture/areaDisposalProgress',
    entAccessStatistics = '/main-app/SnAPicture/entAccessStatistics',
    monitorDeviceStatistics = '/main-app/SnAPicture/monitorDeviceStatistics',
    enterpriseList = '/main-app/SfEntBaseInfo/list',
    listPage = '/main-app/SnMonitorWarning/listPage',
    exportExcel = '/main-app/SnMonitorWarning/export',
    deviceTree = '/main-app/SnDeviceMonitor/snDeviceTreeList',
    // monitorLine = '/main-app/SnDeviceMonitor/surfaceShiftList',
    monitorLine = '/main-app/SnDeviceMonitor/getOnlineRawData',
    monitorLineQjjsd = '/main-app/SnDeviceMonitor/inclinationAccelerationList',
}

export const listPage = (params) => defHttp.get({ url: Api.listPage, params });
export const getExportUrl = Api.exportExcel;
/**
 * 实时天气
 * @param params
 */
export const realTimeWeather = (params) => defHttp.get({ url: Api.realTimeWeather, params });
/*
*
 * 预警等级占比
 * @param params
 */
export const warningLevelStatistics = (params) => defHttp.get({ url: Api.warningLevelStatistics, params });

/*
 * 预警等级占比
 * @param params
 */
export const warnEventsList = (params) => defHttp.get({ url: Api.warnEventsList, params });

/*
 * 预警等级占比
 * @param params
 */
export const areaDisposalProgress = (params) => defHttp.get({ url: Api.areaDisposalProgress, params });

/*
 * 预警等级占比
 * @param params
 */
export const entAccessStatistics = (params) => defHttp.get({ url: Api.entAccessStatistics, params });

/*
 * 企业列表
 * @param params
 */
export const enterpriseListData = (params) => defHttp.get({ url: Api.enterpriseList, params });

export const deviceTreeData = (params) => defHttp.get({ url: Api.deviceTree, params });

export const monitorLineData = (params) => defHttp.get({ url: Api.monitorLine, params });

export const monitorLineQjjsdData = (params) => defHttp.get({ url: Api.monitorLineQjjsd, params });

/**
 * 监测设备状态统计
 * @param params
 */
export const monitorDeviceStatistics = (params) => defHttp.get({ url: Api.monitorDeviceStatistics, params });