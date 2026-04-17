import { defHttp } from '/@/utils/http/axios';
enum Api {          
  listPage = '/main-app/donationInfo/listPage',
  saveOrUpdate = '/main-app/donationInfo/saveOrUpdate',
  deleteById = '/main-app/donationInfo/delete',
  getById = '/main-app/donationInfo/getById'
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