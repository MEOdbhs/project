import { defHttp } from '/@/utils/http/axios'
import { message } from 'ant-design-vue'

enum Api {
    saveOrUpdate = '/main-app/SfOnDuty/saveOrUpdate',
    getViewById = '/main-app/SfOnDuty/getViewById',
    deleteFlagById = '/main-app/SfOnDuty/deleteFlagById',
    listPage = '/main-app/SfOnDuty/listPage',
    exportExcel = '/main-app/SfOnDuty/export',
    listPageUserByOrgCode = '/sys/user/queryUserByOrgCode',
}

export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params })
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params })
export const deleteFlagById = (id, handleSuccess) => {
    defHttp.post({ url: Api.deleteFlagById, params: { id } }).then(() => {
        message.success('删除成功')
        handleSuccess()
    })
}
export const listPage = (params) => defHttp.get({ url: Api.listPage, params })
export const listPageUserByOrgCode = (params) => defHttp.get({ url: Api.listPageUserByOrgCode, params })
export const getExportUrl = Api.exportExcel;