import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SfHazardManage/listPage',
  saveOrUpdate = '/main-app/SfHazardManage/saveOrUpdate',
  deleteItem = '/main-app/SfHazardManage/deleteFlagById',
  getViewById = '/main-app/SfHazardManage/getViewById',
  exportExcel = '/main-app/SfHazardManage/export',
  dangerWorkmanshipList = '/main-app/SfDangerWorkmanship/list',
}

export const getExportUrl = Api.exportExcel;
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 删除
 */
export const deleteItem = (id, handleSuccess) => {
  defHttp.post({ url: Api.deleteItem ,params: {id}  }).then(() => {
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
 * 获取危险工艺列表
 * @param params
 */
export const getDangerWorkmanshipList = (params?) => defHttp.get({ url: Api.dangerWorkmanshipList, params });
