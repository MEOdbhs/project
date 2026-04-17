import { defHttp } from '/@/utils/http/axios';
enum Api {          
  listPage = '/main-app/emergencyMaterialStorage/listPage',
  saveOrUpdate = '/main-app/emergencyMaterialStorage/saveOrUpdate',
  deleteById = '/main-app/emergencyMaterialStorage/delete',
  getById = '/main-app/emergencyMaterialStorage/getById'
}
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });
/**
 * 保存或更新
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });
/**
 * 删除
 * @param params
 */
export const deleteById = (params) => defHttp.get({ url: Api.deleteById, params });
/**
 * 获取详情
 * @param params
 */
export const getById = (params) => defHttp.get({ url: Api.getById, params });
