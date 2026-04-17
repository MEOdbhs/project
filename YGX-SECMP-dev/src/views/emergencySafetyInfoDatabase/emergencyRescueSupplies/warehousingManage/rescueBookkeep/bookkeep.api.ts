import { defHttp } from '/@/utils/http/axios'
import { message } from 'ant-design-vue'

enum Api {
    saveOrUpdate = '/main-app/YjaqxxkMaterialWarehousingAccounting/saveOrUpdate',
    getViewById = '/main-app/YjaqxxkMaterialWarehousingAccounting/getViewById',
    deleteFlagById = '/main-app/YjaqxxkMaterialWarehousingAccounting/deleteFlagById',
    listPage = '/main-app/YjaqxxkMaterialWarehousingAccounting/listPage',
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
