import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SfSafeNotice/listPage',
  list = '/main-app/SfSafeNotice/list',
  saveOrUpdate = '/main-app/SfSafeNotice/saveOrUpdate',
  deleteItem = '/main-app/SfSafeNotice/deleteFlagById',
  getViewById = '/main-app/SfSafeNotice/getViewById',
  exportExcel = '/main-app/SfSafeNotice/export',
  release = '/main-app/SfSafeNotice/release',
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
export const deleteItem = (id, handleSuccess) => {
  defHttp.post({ url: Api.deleteItem , params: { id } }).then(() => {
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
 * 根据组织编码查询用户列表
 * @param params
 */
export const listPageUserByOrgCode = (params) => {
  return defHttp.get({ url: '/sys/user/queryUserByOrgCode', params });
};