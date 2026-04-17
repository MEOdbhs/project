import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/SfDangerWorkmanship/listPage',
  list = '/main-app/SfDangerWorkmanship/list',
  saveOrUpdate = '/main-app/SfDangerWorkmanship/saveOrUpdate',
  deleteItem = '/main-app/SfDangerWorkmanship/deleteFlagById',
  getViewById = '/main-app/SfDangerWorkmanship/getViewById',
  exportExcel = '/main-app/SfDangerWorkmanship/export',
  getTypicalByDanger = '/main-app/SfDangerChemicalMapping/getTypicalByDanger',
}
/**
 * 列表(分页)
 * @param params
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

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
 * 根据危险化工工艺获取典型工艺装置
 * @param params
 */
export const getTypicalByDanger = (params) => defHttp.get({ url: Api.getTypicalByDanger, params });
