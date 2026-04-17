import { defHttp } from '/@/utils/http/axios';

enum Api {
  
  list = '/sys/user/queryUserByOrgCode',
 
}

/**
 * 列表接口(查询用户，通过租户隔离)
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });



