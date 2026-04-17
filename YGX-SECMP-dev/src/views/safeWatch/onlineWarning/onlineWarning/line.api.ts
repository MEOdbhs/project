import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SnMonitorWarning/listPage',
  list = '/main-app/SfDangerWorkmanship/list',
  saveOrUpdate = '/main-app/SnMonitorWarning/saveOrUpdate',
  getViewById = '/main-app/SnMonitorWarning/getViewById',
  exportExcel = '/main-app/SnMonitorWarning/export',
  getTypicalByDanger = '/main-app/SfDangerChemicalMapping/getTypicalByDanger',
  userList = '/sys/user/queryUserByOrgCode',
}
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });
/**
 * 人员列表
 * @param params
 */
export const userList = (params) => defHttp.get({ url: Api.userList, params });
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
