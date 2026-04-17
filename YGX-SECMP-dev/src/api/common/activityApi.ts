import { defHttp } from '/@/utils/http/axios';

/**
 * 发起流程接口参数
 */
export interface SubmitWorkflowParams {
  businessName: string;
  name: string;
  businessUrl: string;
  businessTableName: string;
  businessId: string;
  businessTableField: string;
  key: string;
  userId: string;
  userName: string; 
  type: string;
  comment: string;
}

enum Api {
  submitWorkflow = '/activity/share/submit',
  auditWorkflow= '/activity/share/completeTask'
}

/**
 * 发起流程
 * @param params
 */
export const submitWorkflow = (params: SubmitWorkflowParams) => {
  return defHttp.post({ url: Api.submitWorkflow, params });
};

export const auditWorkflow = (params: SubmitWorkflowParams) => {
  return defHttp.post({ url: Api.auditWorkflow, params });
};
