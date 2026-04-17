import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/sys/param/list',
  // list = '/system/ChemicalsDangerous/list',
  saveOrUpdate = '/sys/param/addAndEdit',
  deleteItem = '/sys/param/delete',
  // getViewById = '/system/ChemicalsDangerous/getViewById',
  // exportExcel = '/system/ChemicalsDangerous/export',
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
// export const list = (params) => defHttp.get({ url: Api.list, params });

// /**
//  * 导出
//  * @param params
//  */
// export const getExportUrl = Api.exportExcel;

/**
 * 删除
 */
export const deleteItem = (id, handleSuccess) => {
  defHttp.get({ url: Api.deleteItem + '?id=' + id }).then(() => {
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
// export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });
