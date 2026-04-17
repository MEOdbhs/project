import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/ZngzyjMonitorInfo/list',
  listPages = '/main-app/ZngzyjAlarmConfig/listPage', // 运维预警配置
  getCalibrationList = '/main-app/YjjksbCalibrationRecord/listPage', // 运维预警配置
  getConfigList = '/main-app/ZngzyjMonitorInfo/listAlarmPage',
  saveOrUpdate = '/main-app/ZngzyjMonitorInfo/saveOrUpdate',
  saveOrUpdates = '/main-app/ZngzyjAlarmConfig/allSaveOrUpdate',
  deleteItem = '/main-app/ZngzyjMonitorInfo/deleteFlagById',
  getViewById = '/main-app/ZngzyjMonitorInfo/getViewById',
  getViewByIds = '/main-app/ZngzyjAlarmConfig/getSubViewByMonitorCode',
  getMonitorMation = '/main-app/ZngzyjMonitorInfo/getMonitorMation',
  getTypeList = '/main-app/ZngzyjMonitorCategory/list',
}
/**
 * 列表(分页)
 * @param params
 */



export const listPage = (params) => {
  // 实际开发时替换为真实接口调用
  return defHttp.get({ url: Api.listPage, params });
};

export const getTypeList = (params) => {
  // 实际开发时替换为真实接口调用
  return defHttp.get({ url: Api.getTypeList, params });
};

export const getCalibrationList = (params) => {
  // 实际开发时替换为真实接口调用
  return defHttp.get({ url: Api.getCalibrationList, params });
};

export const getConfigList = (params) => {
  // 实际开发时替换为真实接口调用
  return defHttp.get({ url: Api.getConfigList, params });
};

export const listPages = (params) => {
  // 实际开发时替换为真实接口调用
  return defHttp.get({ url: Api.listPages, params });
  
};

// 其他接口（如需保留）
export const deleteItem = (params, handleSuccess) => {
  defHttp.post({ url: Api.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};

export const getViewById = (params) => {
  // 实际开发时替换为真实接口调用
  return defHttp.get({ url: Api.getViewById, params });
  
};

export const getViewByIds = (params) => {
  return defHttp.get({ url: Api.getViewByIds, params });
  
};

export const getMonitorMation = (params) => {
  return defHttp.post({ url: Api.getMonitorMation, params });
  
};
export const saveOrUpdate = (params) => {
  return defHttp.post({ url: Api.saveOrUpdate, params });
};
export const saveOrUpdates = (params) => {
  return defHttp.post({ url: Api.saveOrUpdates, params });
};