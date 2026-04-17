import { defHttp } from '/@/utils/http/axios'
import { message } from 'ant-design-vue'

enum Api {
    saveOrUpdate = '/main-app/YjaqxxkMaterialOutbound/saveOrUpdate',
    getViewById = '/main-app/YjaqxxkMaterialOutbound/getViewById',
    deleteFlagById = '/main-app/YjaqxxkMaterialOutbound/deleteFlagById',
    listPage = '/main-app/YjaqxxkMaterialOutbound/listPage',
    getMaterialById = '/main-app/emergencyMaterialCategory/getById',
}

export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params })
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params })
export const getMaterialById = (params) => defHttp.get({ url: Api.getMaterialById, params })

export const deleteFlagById = (id, handleSuccess) => {
    defHttp.post({ url: Api.deleteFlagById, params: { id } }).then(() => {
        message.success('删除成功')
        handleSuccess()
    })
}
export const listPage = (params) => defHttp.get({ url: Api.listPage, params })
