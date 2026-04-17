import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app//CsRewardPunish/listPage',
  saveOrUpdate = '/main-app/CsRewardPunish/saveOrUpdate',
  deleteItem = '/main-app/CsRewardPunish/',
  getViewById = '/main-app/CsRewardPunish/getViewById',
  staffListPage = '/main-app/SysStaff/listPage',
  exportExcel = '/main-app/CsRewardPunish/export',
  configList = '/main-app/CsRewardPunishConfig/list',

}

export const getExportUrl = Api.exportExcel;
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 人员列表(分页)
 * @param params
 */
export const staffListPage = (params) => defHttp.get({ url: Api.staffListPage, params });

/**
 * 删除
 */
export const deleteItem = (id, handleSuccess) => {
  defHttp.delete({ url: Api.deleteItem + id }).then(() => {
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
 * 获取奖惩配置列表
 * @param params
 */
export const getConfigList = (params) => defHttp.get({ url: Api.configList, params });
