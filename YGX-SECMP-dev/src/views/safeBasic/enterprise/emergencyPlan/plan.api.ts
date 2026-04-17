import { defHttp } from '/@/utils/http/axios'
import { message } from 'ant-design-vue'

enum Api {
    saveOrUpdatePlan = '/main-app/SfEmergencyPlan/saveOrUpdate',
    saveOrUpdateDrill = '/main-app/SfEmergencyPlanDrill/saveOrUpdate',
    listPagePlan = '/main-app/SfEmergencyPlan/listPage',
    listPlan = '/main-app/SfEmergencyPlan/list',
    listPageDrill = '/main-app/SfEmergencyPlanDrill/listPage',
    getViewByIdPlan = '/main-app/SfEmergencyPlan/getViewById',
    getViewByIdrill = '/main-app/SfEmergencyPlanDrill/getViewById',
    deletePlan = '/main-app/SfEmergencyPlan/deleteFlagById',
    deleteDrill = '/main-app/SfEmergencyPlanDrill/deleteFlagById',
    exportPlan = '/main-app/SfEmergencyPlan/export',
    exportDrill = '/main-app/SfEmergencyPlanDrill/export',
}

export const getExportUrlPlan = Api.exportPlan;
export const getExportUrlDrill = Api.exportDrill;
/**
 * 保存或更新
 * @param params
 */
export const saveOrUpdatePlan = (params) => {
    return defHttp.post({ url: Api.saveOrUpdatePlan, params })
}
export const saveOrUpdateDrill = (params) => {
    return defHttp.post({ url: Api.saveOrUpdateDrill, params })
}

export const listPagePlan = (params) => defHttp.get({ url: Api.listPagePlan, params })
export const listPlan = (params) => defHttp.get({ url: Api.listPlan, params })
export const listPageDrill = (params) => defHttp.get({ url: Api.listPageDrill, params })
export const getViewByIdPlan = (params) => defHttp.get({ url: Api.getViewByIdPlan, params })
export const getViewByIdrill = (params) => defHttp.get({ url: Api.getViewByIdrill, params })

export const deletePlan = (id, handleSuccess) => {
    defHttp.post({ url: Api.deletePlan, params: { id } }).then(() => {
        message.success('删除成功')
        handleSuccess()
    })
}

export const deleteDrill = (id, handleSuccess) => {
    defHttp.post({ url: Api.deleteDrill, params: { id } }).then(() => {
        message.success('删除成功')
        handleSuccess()
    })
}
