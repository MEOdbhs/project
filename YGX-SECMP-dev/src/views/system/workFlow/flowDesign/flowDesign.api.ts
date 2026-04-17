import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  // 分页查询
  listPage = '/activity/model/manage/modelLists',
  // 新增或修改
  saveOrUpdate = '/activity/model/manage/add',
  // 详情、编辑查询
  getViewById = '',
  // 删除
  deleteModel = '/activity/model/manage/remove/',
  // 发布
  deployModel = '/activity/model/manage/deploy/',
  // 导出
  exportModel = '/activity/model/manage/export/',
}
/**
 * 分页查询
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });
/**
 * 新增或修改
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params }, { joinParamsToUrl: true });
/**
 * 详情、编辑查询
 * @param params
 */
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });
/**
 * 删除
 * @param id
 */
export const deleteModel = (id, handleSuccess) => {
  return defHttp.post({ url: Api.deleteModel + id }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
/**
 * 发布
 * @param id
 */
export const deployModel = (id, handleSuccess) => {
  return defHttp.post({ url: Api.deployModel + id }).then(() => {
    message.success('发布成功');
    handleSuccess();
  });
};
/**
 * 导出
 * @param id
 */
export const exportModel = (id) => defHttp.post({ url: Api.exportModel + id, responseType: 'blob' }, { isReturnNativeResponse: true });
