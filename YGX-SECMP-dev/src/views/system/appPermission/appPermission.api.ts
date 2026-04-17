import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  // 应用授权部分
  list = '/system/BaseApplication/list',
  saveOrUpdate = '/system/BaseApplication/saveOrUpdate',
  deleteApp = '/system/BaseApplication/',
  getViewById = '/system/BaseApplication/getViewById',
  // 接口清单部分
  listInterface = '/system/BaseApplicationInterfaceConfig/listPage',
  listInterfaceNoPage = '/system/BaseApplicationInterfaceConfig/list',
  saveOrUpdateInterface = '/system/BaseApplicationInterfaceConfig/saveOrUpdate',
  deleteInterface = '/system/BaseApplicationInterfaceConfig/',
  getViewByIdInterface = '/system/BaseApplicationInterfaceConfig/getViewById',
}
/**
 * 应用列表
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 删除App
 */
export const deleteApp = (id, handleSuccess) => {
  defHttp.delete({ url: Api.deleteApp + id }).then(() => {
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
 * 接口列表
 * @param params
 */
export const listInterface = (params) => defHttp.get({ url: Api.listInterface, params });
/**
 * 接口列表
 * @param params
 */
export const listInterfaceNoPage = (params) => defHttp.get({ url: Api.listInterfaceNoPage, params });
/**
 * 保存或更新
 * @param params
 */
export const saveOrUpdateInterface = (params) => {
  return defHttp.post({ url: Api.saveOrUpdateInterface, params });
};
/**
 * 删除
 */
export const deleteInterface = (id, handleSuccess) => {
  defHttp.delete({ url: Api.deleteInterface + id }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
/**
 * 详情、编辑查询
 * @param params
 */
export const getViewByIdInterface = (params) => defHttp.get({ url: Api.getViewByIdInterface, params });
