import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/YjaqxxkInventoryPlan/listPage',
  deleteItem = '/main-app/YjaqxxkInventoryPlan/deleteFlagById',
  getViewById = '/main-app/YjaqxxkInventoryPlan/getViewById',
  exportExcel = '/main-app/SfDeviceSafeCheck/export',
  saveOrUpdate = '/main-app/YjaqxxkInventoryPlan/saveOrUpdate',
  storageList = '/main-app/emergencyMaterialStorage/list',
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
  defHttp.post({ url: Api.deleteItem, params: { id } }).then(() => {
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
 * 区域&仓库列表
 * @param params
 */
export const getStorageList = (params?) => defHttp.get({ url: Api.storageList, params });

