import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SfDeviceVideoCheck/listPage',
  saveOrUpdate = '/main-app/SfDeviceVideoCheck/saveOrUpdate',
  deleteItem = '/main-app/SfDeviceVideoCheck/deleteFlagById',
  getViewById = '/main-app/SfDeviceVideoCheck/getViewById',
  exportExcel = '/main-app/SfDeviceVideoCheck/export',
  hsListPage = '/main-app/SfHazardManage/list',

}

export const getExportUrl = Api.exportExcel;
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

export const hsListPage = (params) => defHttp.get({ url: Api.hsListPage, params });




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
