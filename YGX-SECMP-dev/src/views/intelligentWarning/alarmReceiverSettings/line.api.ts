import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/ZngzyjAlarmReceive/listPage',
  getConfigList = '/main-app/ZngzyjAlarmReceiveStaff/listPage',
  getReceiverList = '/main-app/ZngzyjAlarmReceiveDetail/list',
  saveOrUpdate = '/main-app/ZngzyjAlarmReceive/allSaveOrUpdate',
  deleteItem = '/main-app/ZngzyjAlarmReceive/deleteSubById',
  getViewById = '/main-app/ZngzyjAlarmReceive/getSubViewById',
  getThemeListApi = '/gateway/main-app/api/v1/area/city/list',
  getLevelOptionsApi = '/sys/dict/getDictItems',
  ReceiversaveOrUpdate = '/main-app/ZngzyjAlarmReceiveDetail/saveOrUpdate',
  saveOrUpdates = '/main-app/ZngzyjAlarmReceiveStaff/saveOrUpdate', 
  getViewByIds = '/main-app/ZngzyjAlarmReceiveStaff/getViewById', 
  
}

/**
 * 分页列表
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 分页列表
 */
export const getConfigList = (params) => defHttp.get({ url: Api.getConfigList, params });

/**
 * 分页列表
 */
export const getReceiverList = (params) => defHttp.get({ url: Api.getReceiverList, params });
/**
 * 区县
 */
export const getThemeListApi = (params) => defHttp.get({ url: Api.getThemeListApi, params });
/**
 * 区县
 */
export const getLevelOptionsApi = (params) => defHttp.get({ url: Api.getLevelOptionsApi, params });

/**
 * 保存或更新
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });

/**
 * 保存或更新
 */
export const saveOrUpdates = (params) => defHttp.post({ url: Api.saveOrUpdates, params });
/**
 * 保存或更新
 */
export const ReceiversaveOrUpdate = (params) => defHttp.post({ url: Api.ReceiversaveOrUpdate, params });

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
 * 详情查询
 */
export const getViewByIds = (params) => defHttp.get({ url: Api.getViewByIds, params });
/**
 * 详情查询
 */
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });