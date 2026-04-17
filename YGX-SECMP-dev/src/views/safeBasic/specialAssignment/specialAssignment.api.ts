import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/main-app/SfSpecialWork/listPage',
  save = '/main-app/SfSpecialWork/saveOrUpdate',
  deleteOne = '/main-app/SfSpecialWork/deleteFlagById',
  importExcel = '/sys/tableWhiteList/importExcel',
  exportXls = '/main-app/SfSpecialWork/export',
  detail = '/main-app/SfSpecialWork/getViewById',
  userList = '/sys/user/queryUserByOrgCode',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 人员列表
 * @param params
 */
export const userList = (params) => defHttp.get({ url: Api.userList, params });
/**
 * 删除单个
 * @param params
 * @param handleSuccess
 */
export const deleteOne = (params, handleSuccess?) => {
  return defHttp.post({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) handleSuccess();
  });
};
/**
 * 保存或者更新
 * @param params
 * @param isUpdate 是否是更新数据
 */
export const saveOrUpdate = (params, isUpdate) => {
  return defHttp.post({ url: Api.save, params });
};

/**
 * 详情、编辑查询
 * @param params
 */
export const getViewById = (params) => defHttp.get({ url: Api.detail, params });
