import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SfDeviceSafeCheck/listPage',
  deleteItem = '/main-app/SfDeviceSafeCheck/deleteFlagById',
  getViewById = '/main-app/SfDeviceSafeCheck/getViewById',
  exportExcel = '/main-app/SfDeviceSafeCheck/export',
  saveOrUpdate = '/main-app/SfDeviceSafeCheck/saveOrUpdate',
  quotaList = '/main-app/SfDeviceSafeCheck/quotaList',
  deleteQuota = '/main-app/SfDeviceSafeCheck/quota/deleteFlagQuotaById',
  hazardManageList = '/main-app/SfHazardManage/list',
}
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 导出
 * @param params
 */
export const getExportUrl = Api.exportExcel;

/**
 * 删除
 */
export const deleteItem = (id, handleSuccess) => {
  defHttp.post({ url: Api.deleteItem ,params: {id}  }).then(() => {
    message.success('删除成功');
    handleSuccess();
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
 * 查询指标列表
 * @param params
 */
export const getQuotaList = (params) => defHttp.get({ url: Api.quotaList, params });

/**
 * 删除指标
 * @param quotaId
 */
export const deleteQuota = (quotaId) => {
  return defHttp.post({ url: Api.deleteQuota , params: {id: quotaId} });
};

/**
 * 获取重大危险源列表
 * @param params
 */
export const getHazardManageList = (params?) => defHttp.get({ url: Api.hazardManageList, params });

/**
 * 获取设备类型树形数据
 */
export const getDeviceTypeTree = () => defHttp.get({ url: '/main-app/SfDeviceSafeCheck/findGroupDeviceType' });
