import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SfDeviceHealthArchive/listPage',
  saveOrUpdate = '/main-app/SfDeviceHealthArchive/saveOrUpdate',
  deleteItem = '/main-app/SfDeviceHealthArchive/deleteFlagById',
  getViewById = '/main-app/SfDeviceHealthArchive/getViewById',
  exportExcel = '/main-app/SfDeviceHealthArchive/export',
  updateStatusById = '/main-app/SfDeviceHealthArchive/updateStatusDescById',
}

export const getExportUrl = Api.exportExcel;
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

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
 * 更新设备状态
 * @param params
 */
export const updateStatusById = (params) => {
  return defHttp.post({ url: Api.updateStatusById, params });
};

/**
 * 根据组织编码查询用户列表
 * @param params
 */
export const listPageUserByOrgCode = (params) => {
  return defHttp.get({ url: '/sys/user/queryUserByOrgCode', params });
};