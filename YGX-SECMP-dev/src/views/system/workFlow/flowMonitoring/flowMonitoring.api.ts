import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  // 分页查询
  listPage = '/activity/flow/monitor/listProcess',
  // 唤醒一个挂起的流程实例
  run = '/activity/flow/monitor/run/',
  // 挂起一个流程实例
  suspend = '/activity/flow/monitor/suspend/',
  // 流程图进度追踪
  // traceProcess = '/activity/flow/monitor/traceProcess/',
  traceProcess = '/activity/share/flowChart?businessId=',
}
/**
 * 分页查询
 * @param params
 */
export const listPage = (params) => defHttp.post({ url: Api.listPage, params }, { joinParamsToUrl: true });
/**
 * 唤醒一个挂起的流程实例
 * @param id
 */
export const run = (id, handleSuccess) =>
  defHttp.get({ url: Api.run + id }).then(() => {
    message.success('激活成功');
    handleSuccess();
  });
/**
 * 挂起一个流程实例
 * @param id
 */
export const suspend = (id, handleSuccess) =>
  defHttp.get({ url: Api.suspend + id }).then(() => {
    message.success('挂起成功');
    handleSuccess();
  });
/**
 * 流程图进度追踪
 * @param params
 */
export const traceProcess = (businessId) =>
  defHttp.get({ url: Api.traceProcess + businessId, responseType: 'blob' }, { isReturnNativeResponse: true });
