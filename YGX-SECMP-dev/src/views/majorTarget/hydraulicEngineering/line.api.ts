import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

// 基础信息 API（原有）
enum BaseApi {
  listPage = '/main-app/ZdfhmbWaterprojInfo/list',
  saveOrUpdate = '/main-app/ZdfhmbWaterprojInfo/allSaveOrUpdate',
  deleteItem = '/main-app/ZdfhmbWaterprojInfo/deleteSubById',
  getViewById = '/main-app/ZdfhmbWaterprojInfo/getAllViewById',
}
export const listBasePage = (params) => defHttp.get({ url: BaseApi.listPage, params });
export const deleteBase = (params, handleSuccess) => {
  defHttp.post({ url: BaseApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateBase = (params) => defHttp.post({ url: BaseApi.saveOrUpdate, params });
export const getBaseViewById = (params) => defHttp.get({ url: BaseApi.getViewById, params });

// 风险隐患信息 API
enum RiskApi {
  listPage = '/main-app/ZdfhmbWaterbodyDisaster/list',
  saveOrUpdate = '/main-app/ZdfhmbWaterbodyDisaster/saveOrUpdate',
  deleteItem = '/main-app/ZdfhmbWaterbodyDisaster/deleteFlagById',
  getViewById = '/main-app/ZdfhmbWaterbodyDisaster/getViewById',
}
export const listRiskPage = (params) => defHttp.get({ url: RiskApi.listPage, params });
export const deleteRisk = (params, handleSuccess) => {
  defHttp.post({ url: RiskApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateRisk = (params) => defHttp.post({ url: RiskApi.saveOrUpdate, params });
export const getRiskViewById = (params) => defHttp.get({ url: RiskApi.getViewById, params });

// 监测预警设施 API
enum MonitorApi {
  listPage = '/main-app/ZdfhmbGuardMonitor/list',
  saveOrUpdate = '/main-app/ZdfhmbGuardMonitor/saveOrUpdate',
  deleteItem = '/main-app/ZdfhmbGuardMonitor/deleteFlagById',
  getViewById = '/main-app/ZdfhmbGuardMonitor/getViewById',
}
export const listMonitorPage = (params) => defHttp.get({ url: MonitorApi.listPage, params });
export const deleteMonitor = (params, handleSuccess) => {
  defHttp.post({ url: MonitorApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateMonitor = (params) => defHttp.post({ url: MonitorApi.saveOrUpdate, params });
export const getMonitorViewById = (params) => defHttp.get({ url: MonitorApi.getViewById, params });

// 工程防护及应急加固设施 API
enum EngineeringApi {
  listPage = '/main-app/ZdfhmbGuardProtect/list',
  saveOrUpdate = '/main-app/ZdfhmbGuardProtect/saveOrUpdate',
  deleteItem = '/main-app/ZdfhmbGuardProtect/deleteFlagById',
  getViewById = '/main-app/ZdfhmbGuardProtect/getViewById',
}
export const listEngineeringPage = (params) => defHttp.get({ url: EngineeringApi.listPage, params });
export const deleteEngineering = (params, handleSuccess) => {
  defHttp.post({ url: EngineeringApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateEngineering = (params) => defHttp.post({ url: EngineeringApi.saveOrUpdate, params });
export const getEngineeringViewById = (params) => defHttp.get({ url: EngineeringApi.getViewById, params });

// 管理制度 API
enum ManagementApi {
  listPage = '/main-app/ZdfhmbGuardRule/list',
  saveOrUpdate = '/main-app/ZdfhmbGuardRule/saveOrUpdate',
  deleteItem = '/main-app/ZdfhmbGuardRule/deleteFlagById',
  getViewById = '/main-app/ZdfhmbGuardRule/getViewById',
}
export const listManagementPage = (params) => defHttp.get({ url: ManagementApi.listPage, params });
export const deleteManagement = (params, handleSuccess) => {
  defHttp.post({ url: ManagementApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateManagement = (params) => defHttp.post({ url: ManagementApi.saveOrUpdate, params });
export const getManagementViewById = (params) => defHttp.get({ url: ManagementApi.getViewById, params });

// 工程管控范围 API
enum ScopeApi {
  listPage = '/main-app/ZdfhmbGuardScope/list',
  saveOrUpdate = '/main-app/ZdfhmbGuardScope/saveOrUpdate',
  deleteItem = '/main-app/ZdfhmbGuardScope/deleteFlagById',
  getViewById = '/main-app/ZdfhmbGuardScope/getViewById',
}
export const listScopePage = (params) => defHttp.get({ url: ScopeApi.listPage, params });
export const deleteScope = (params, handleSuccess) => {
  defHttp.post({ url: ScopeApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateScope = (params) => defHttp.post({ url: ScopeApi.saveOrUpdate, params });
export const getScopeViewById = (params) => defHttp.get({ url: ScopeApi.getViewById, params });

// 警示标识设置情况 API
enum SignApi {
  listPage = '/main-app/ZdfhmbGuardSign/list',
  saveOrUpdate = '/main-app/ZdfhmbGuardSign/saveOrUpdate',
  deleteItem = '/main-app/ZdfhmbGuardSign/deleteFlagById',
  getViewById = '/main-app/ZdfhmbGuardSign/getViewById',
}
export const listSignPage = (params) => defHttp.get({ url: SignApi.listPage, params });
export const deleteSign = (params, handleSuccess) => {
  defHttp.post({ url: SignApi.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
export const saveOrUpdateSign = (params) => defHttp.post({ url: SignApi.saveOrUpdate, params });
export const getSignViewById = (params) => defHttp.get({ url: SignApi.getViewById, params });