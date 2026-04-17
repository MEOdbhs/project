import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/YjjksbCalibrationPlan/listPage',
  saveOrUpdate = '/main-app/YjjksbCalibrationPlan/saveOrUpdate',
  deleteItem = '/main-app/YjjksbCalibrationPlan/deleteFlagById',
  getViewById = '/main-app/YjjksbCalibrationPlan/getViewByEquipmentId',
  updateStatus = '/main-app/YjjksbCalibrationPlan/updateStateById',
  getPeopleList = '/sys/user/listAll',
}

/**
 * 列表（分页）
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });
/**
 * 状态
 */
export const updateStatus = (params) => defHttp.get({ url: Api.updateStatus, params });

/**
 * 人员列表
 */
export const getPeopleList = (params) => defHttp.get({ url: Api.getPeopleList, params });


/**
 * 删除
 */
export const deleteItem = (params, handleSuccess) => {
  defHttp.post({ url: Api.deleteItem, params }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};

/**
 * 保存或更新
 */
export const saveOrUpdate = (params) => {
  return defHttp.post({ url: Api.saveOrUpdate, params });
};

/**
 * 详情查询
 */
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });