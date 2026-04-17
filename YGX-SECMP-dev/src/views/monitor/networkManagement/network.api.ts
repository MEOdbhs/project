import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/sys/log/list',
/**
 * 巡检计划
 */
  inspectionPlanListPage = '/main-app/PmDeviceVideoNetwork/inspectionPlanListPage',
  inspectionPlanList = '/main-app/PmDeviceVideoNetwork/inspectionPlanList',
  inspectionPlanGetViewById = '/main-app/PmDeviceVideoNetwork/inspectionPlanGetViewById',
  inspectionSaveOrUpdate = '/main-app/PmDeviceVideoNetwork/inspectionPlan/saveOrUpdate',
  inspectionDeleteById = '/main-app/PmDeviceVideoNetwork/inspectionPlan/deleteFlagById',
  inspectionPlanUpdateStatus = '/main-app/PmDeviceVideoNetwork/inspectionPlanUpdateStatus',

  /**
   * 巡检报表
   */
  listDeviceReport = '/main-app/PmDeviceVideoNetwork/alarmRule/listDeviceReport',

  /**
   * 告警信息
   */
  listAlarmInfo = '/main-app/PmDeviceVideoNetwork/alarmRuleList',
  saveOrUpdateBatch = '/main-app/PmDeviceVideoNetwork/alarmRule/saveOrUpdateBatch',

}

/**
 * 查询日志列表
 * @param params
 */
export const getLogList = (params) => {
  return defHttp.get({ url: Api.list, params });
};

/**
 * 巡检计划列表
 * @param params
 */
export const getInspectionPlanListPage = (params) => {
  return defHttp.get({ url: Api.inspectionPlanListPage, params });
};

/**
 * 巡检计划列表
 * @param params
 */
export const getInspectionPlanList = (params) => {
  return defHttp.get({ url: Api.inspectionPlanList, params });
};

/**
 * 巡检计划详情
 * @param params
 */
export const getInspectionPlanGetViewById = (params) => {
  return defHttp.get({ url: Api.inspectionPlanGetViewById, params });
};

/**
 * 巡检计划保存或更新
 * @param params
 */
export const getInspectionPlanSaveOrUpdate = (params) => {
  return defHttp.post({ url: Api.inspectionSaveOrUpdate, params });
};

/**
 * 巡检计划删除
 * @param params
 */
export const getInspectionPlanDeleteById = (params) => {
  return defHttp.post({ url: Api.inspectionDeleteById, params });
};

/**
 * 巡检计划启用或停用
 * @param params
 */
export const getInspectionPlanUpdateStatus = (params) => {
  return defHttp.post({ url: Api.inspectionPlanUpdateStatus, params });
};

/**
 * 巡检报表列表
 * @param params
 */
export const getListDeviceReport = (params) => {
  return defHttp.get({ url: Api.listDeviceReport, params });
};


/**
 * 告警信息列表
 * @param params
 */
export const getListAlarmInfo = (params) => {
  return defHttp.get({ url: Api.listAlarmInfo, params });
};
 
/**
 * 告警信息-保存或更新
 * @param params
 */
export const alarmRuleSaveOrUpdateBatch = (params) => {
  return defHttp.post({ url: Api.saveOrUpdateBatch, params });
};

/**
 * 根据组织编码查询用户列表
 * @param params
 */
export const listPageUserByOrgCode = (params) => {
  return defHttp.get({ url: '/sys/user/queryUserByOrgCode', params });
};