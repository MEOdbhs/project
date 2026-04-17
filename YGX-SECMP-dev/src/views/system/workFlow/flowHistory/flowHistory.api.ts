import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 分页查询
  listPage = '/activity/flow/monitor/listHistoryProcess',
  // 分页查询(历史)
  // listPageHistory = '/activity/flow/monitor/history',
  listPageHistory = '/activity/share/history/',
  // 分页查询(变量)
  listPageLet = '/activity/flow/monitor/variables',
}
/**
 * 分页查询
 * @param params
 */
export const listPage = (params) => defHttp.post({ url: Api.listPage, params }, { joinParamsToUrl: true });
/**
 * 分页查询
 * @param params
 */
export const listPageHistory = (businessId) => defHttp.post({ url: Api.listPageHistory + businessId });
/**
 * 分页查询
 * @param params
 */
export const listPageLet = (params) => defHttp.post({ url: Api.listPageLet, params });
