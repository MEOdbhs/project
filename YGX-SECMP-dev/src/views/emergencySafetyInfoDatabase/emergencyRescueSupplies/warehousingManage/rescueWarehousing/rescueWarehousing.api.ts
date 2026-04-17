import { defHttp } from '/@/utils/http/axios'
import { message } from 'ant-design-vue'

enum Api {
    saveOrUpdate = '/main-app/YjaqxxkMaterialWarehousing/saveOrUpdate',
    getViewById = '/main-app/YjaqxxkMaterialWarehousing/getViewById',
    deleteFlagById = '/main-app/YjaqxxkMaterialWarehousing/deleteFlagById',
    listPage = '/main-app/YjaqxxkMaterialWarehousing/listPage',
    emergencyMaterialCategoryList = '/main-app/emergencyMaterialCategory/listPage',
    supplierInfo = '/main-app/supplierInfo/list',
    emergencyMaterialStorage = '/main-app/emergencyMaterialStorage/list',
    contractInfoList = '/main-app/contractInfo/list',
}

export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveOrUpdate, params })
export const getViewById = (params) => defHttp.get({ url: Api.getViewById, params })
export const emergencyMaterialCategoryList = (params) => defHttp.get({ url: Api.emergencyMaterialCategoryList, params })
export const contractInfoList = (params) => defHttp.get({ url: Api.contractInfoList, params })
export const supplierInfo = (params) => defHttp.get({ url: Api.supplierInfo, params })
export const emergencyMaterialStorage = (params) => defHttp.get({ url: Api.emergencyMaterialStorage, params })
export const deleteFlagById = (id, handleSuccess) => {
    defHttp.post({ url: Api.deleteFlagById, params: { id } }).then(() => {
        message.success('删除成功')
        handleSuccess()
    })
}
export const listPage = (params) => defHttp.get({ url: Api.listPage, params })
