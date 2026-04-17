import { submitWorkflow, SubmitWorkflowParams, auditWorkflow as auditWorkflowApi } from '/@/api/common/activityApi';
import { useUserStore } from '/@/store/modules/user';
import { router } from '/@/router';
import { message } from 'ant-design-vue';

/**
 * 发起流程工具函数
 * @param workflowKey 流程编码（外部传入）
 * @param businessTableName 业务表名
 * @param businessId 业务ID（表单ID）
 * @returns Promise
 */
export async function startWorkflow(workflowKey: string, businessTableName: string, businessId: string) {
  try {
    const userStore = useUserStore();
    const userInfo = userStore.getUserInfo;

    // 获取当前路由信息
    const currentRoute = router.currentRoute.value;
    const routeName = currentRoute.meta?.title as string || '';
    const businessUrl = currentRoute.path;

    // 构建请求参数
    const params: SubmitWorkflowParams = {
      businessName: routeName,
      name: routeName,
      businessUrl: businessUrl,
      businessTableName: businessTableName,
      businessId: businessId,
      key: workflowKey,
      businessTableField: 'examStatus', // 预留
      userId: String(userInfo.id || userInfo.userId || ''),
      userName: userInfo.username || userInfo.realname || '',
    };

    // 调用发起流程接口
    const result = await submitWorkflow(params);
    message.success('流程发起成功');
    return result;
  } catch (error) {
    console.error('发起流程失败:', error);
    message.error('流程发起失败，请稍后重试');
    throw error;
  }
}


export async function auditWorkflow(workflowKey: string, businessTableName: string, businessId: string,type,comment) {
  return new Promise( async (resolve, reject) => {


    try {
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;

      // 获取当前路由信息
      const currentRoute = router.currentRoute.value;
      const routeName = currentRoute.meta?.title as string || '';
      const businessUrl = currentRoute.path;

      // 构建请求参数
      const params: SubmitWorkflowParams = {
        type: type,
        comment: comment,
        businessName: routeName,
        name: routeName,
        businessUrl: businessUrl,
        businessTableName: businessTableName,
        businessId: businessId,
        key: workflowKey,
        businessTableField: 'examStatus', // 预留
        userId: String(userInfo.id || userInfo.userId || ''),
        userName: userInfo.username || userInfo.realname || '',
      };

      // 调用审核流程接口
      const result = await auditWorkflowApi(params);
      resolve(result);
      message.success('审批成功');
      return result;
    } catch (error) {
      console.error('审批失败:', error);
      message.error('审批失败，请稍后重试');
      reject(error);
      throw error;
    }
  });
}

