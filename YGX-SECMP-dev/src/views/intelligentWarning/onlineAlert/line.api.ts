import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/YjjksbOnlineMonitoring/listPage',
  dispose = '/main-app/YjjksbOnlineMonitoring/disposalById',      // 处置接口
  getTabList = '/sys/dict/getDictItems',   // 获取 Tab 列表
  getViewById = '/main-app/YjjksbOnlineMonitoring/getViewById',   // 详情接口
  // getTabList = '/main-app/dict/getTabList',   // 获取 Tab 列表
   downById = '/main-app/YjjksbOnlineMonitoring/downById', 
}

/**
 * 列表分页
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });
/**
 * 列表分页
 */
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });

/**
 * 获取 Tab 列表（动态页签）
 */
export const getTabList = (params) => defHttp.get({ url: Api.getTabList, params });

/**
 * 闭警
 */
export const downById = (params) => defHttp.post({ url: Api.downById, params });

/**
 * 处置提交
 */
export const disposeWarning = (params) => defHttp.post({ url: Api.dispose, params });