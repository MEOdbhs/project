import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
  // 分页查询
  listPage = '/activity/flow/manage/getprocesslists',
  // 新增或修改
  saveOrUpdate = '/activity/model/manage/add',
  // 删除
  deleteModel = '/activity/flow/manage/remove/',
  // 将流程定义转为模型
  exchangeProcessToModel = '/activity/flow/manage/exchangeProcessToModel/',
  // 挂起一个流程定义
  suspendProcessDefinition = '/activity/flow/manage/suspendProcessDefinition',
  // 激活一个流程定义
  activateProcessDefinition = '/activity/flow/manage/activateProcessDefinition',
  // 查看工作流图片
  showresource = '/activity/flow/manage/showresource',
  // 上传一个工作流文件
  uploadworkflow = '/activity/flow/manage/uploadworkflow',
}
/**
 * 分页查询
 * @param params
 */
export const listPage = (params) => defHttp.post({ url: Api.listPage, params }, { joinParamsToUrl: true });
/**
 * 新增或修改
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params });
/**
 * 删除
 * @param id
 */
export const deleteModel = (id, handleSuccess) => {
  return defHttp.post({ url: Api.deleteModel + id }).then(() => {
    message.success('删除成功');
    handleSuccess();
  });
};
/**
 * 将流程定义转为模型
 * @param id
 */
export const exchangeProcessToModel = (id, handleSuccess) => {
  return defHttp.get({ url: Api.exchangeProcessToModel + id }, { isTransformResponse: false }).then(() => {
    message.success('转换成功');
    handleSuccess();
  });
};
/**
 * 挂起一个流程定义
 * @param params
 */
export const suspendProcessDefinition = (params) => defHttp.get({ url: Api.suspendProcessDefinition, params });
/**
 * 激活一个流程定义
 * @param params
 */
export const activateProcessDefinition = (params) => defHttp.get({ url: Api.activateProcessDefinition, params });
/**
 * 查看工作流图片
 * @param params
 */
export const showresource = (params) => defHttp.get({ url: Api.showresource, params, responseType: 'blob' }, { isTransformResponse: false });
/**
 * 上传一个工作流文件
 * @param uploadfile
 */
// export const uploadworkflow = (params) => {
//   return defHttp.post({ url: Api.uploadworkflow, params });
// };
export const uploadworkflow = (params) => {
  return defHttp.uploadFile({ url: Api.uploadworkflow }, params, { isReturnResponse: true });
};
