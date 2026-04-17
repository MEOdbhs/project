import { defHttp } from '/@/utils/http/axios';
enum Api {          
  listPage = '/main-app/emergencyMaterialCategory/listPage',
  saveOrUpdate = '/main-app/emergencyMaterialCategory/saveOrUpdate',
  deleteById = '/main-app/emergencyMaterialCategory/delete',
  getById = '/main-app/emergencyMaterialCategory/getById',
  getStorageLocation = '/main-app/emergencyMaterialCategory/getStorageLocation',
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

/**
 * 获取仓库存储位置
 * @param params
 */
export const getStorageLocation = (params) => defHttp.get({ url: Api.getStorageLocation, params });