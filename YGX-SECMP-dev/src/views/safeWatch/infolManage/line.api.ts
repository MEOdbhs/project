import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SnIndicatorInformation/listPage',
  list = '/main-app/SfDangerWorkmanship/list',
  saveOrUpdate = '/main-app/SnIndicatorInformation/saveOrUpdate',
  deleteItem = '/main-app/SnIndicatorInformation/deleteFlagById',
  getViewById = '/main-app/SnIndicatorInformation/getViewById',
  exportExcel = '/main-app/SnIndicatorInformation/export',
  getTypicalByDanger = '/main-app/SfDangerChemicalMapping/getTypicalByDanger',
  hazardManageList = '/main-app/SfHazardManage/list',
  quotaList = '/main-app/SfDeviceSafeCheck/quotaList',
  deviceList = '/main-app/SfDeviceSafeCheck/listPage', //设备列表
}
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 列表(不分页)
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 导出
 * @param params
 */
export const getExportUrl = Api.exportExcel;

/**
 * 删除
 */
export const deleteOne = (params, handleSuccess?) => {
  return defHttp.post({ url: Api.deleteItem, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) handleSuccess();
  });
};
/**
 * 保存或更新
 * @param params
 */
export const saveOrUpdate = (params) => {
  return defHttp.post({ url: Api.saveOrUpdate, params });
};

/**
 * 详情、编辑查询
 * @param params
 */
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });

/**
 * 根据危险化工工艺获取典型工艺装置
 * @param params
 */
export const getTypicalByDanger = (params) => defHttp.get({ url: Api.getTypicalByDanger, params });

/**
 * 获取重大危险源列表
 * @param params
 */
export const getHazardManageList = (params?) => defHttp.get({ url: Api.hazardManageList, params });
/**
 * 获取重大危险源列表
 * @param params
 */
export const getQuotaList = (params) => defHttp.get({ url: Api.quotaList, params });
/**
 * 获取重大危险源列表
 * @param params
 */
export const getDeviceList = (params) => defHttp.get({ url: Api.deviceList, params });
