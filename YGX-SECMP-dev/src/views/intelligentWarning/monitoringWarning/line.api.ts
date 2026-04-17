import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  listPage = '/main-app/ZngzyjMonitorInfo/listAlarmPage',
  saveOrUpdate = '/main-app/ZngzyjAlarmConfig/allSaveOrUpdate',
  deleteItem = '/main-app/ruleConfig/delete',
  getViewById = '/main-app/ZngzyjAlarmConfig/getSubViewByMonitorCode',
  getTabList = '/sys/dict/getDictItems',          // 获取 Tab 列表字典
  getDeviceTypeList = '/main-app/dict/deviceTypeList', // 获取设备类型字典
  simulationTest = '/main-app/YjjksbOnlineMonitoring/testSimulate', // 仿真测试接口
  applySimulation = '/main-app/ruleConfig/applySimulation', // 运用至配置中
}

/**
 * 列表分页
 */
export const listPage = (params) => defHttp.get({ url: Api.listPage, params });

/**
 * 保存或更新
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });

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
 * 详情
 */
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params });

/**
 * 获取 Tab 列表（动态页签）
 */
export const getTabList = (params) => defHttp.get({ url: Api.getTabList , params });

/**
 * 获取设备类型列表（用于弹窗下拉）
 */
export const getDeviceTypeList = () => defHttp.get({ url: Api.getDeviceTypeList });

/**
 * 仿真测试
 */
export const simulationTest = (params) => defHttp.post({ url: Api.simulationTest, params });

/**
 * 运用至配置中（预留）
 */
export const applySimulation = (params) => defHttp.post({ url: Api.applySimulation, params });