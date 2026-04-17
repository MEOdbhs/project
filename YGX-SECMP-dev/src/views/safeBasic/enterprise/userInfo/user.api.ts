import { defHttp } from '/@/utils/http/axios'

enum Api {
    listPage = '/sys/user/listAll',
    allRolesListNoByTenant = '/sys/role/queryallNoByTenant',
    save = '/sys/user/add',
    edit = '/sys/user/edit',
    deleteUser = '/sys/user/delete',
}

export const listPage = (params) => defHttp.get({ url: Api.listPage, params })

export const getAllRolesListNoByTenant = (params) => defHttp.get({ url: Api.allRolesListNoByTenant, params })

export const save = (params) => defHttp.post({ url: Api.save, params })

export const edit = (params) => defHttp.post({ url: Api.edit, params })

export const deleteUser = (params, handleSuccess) => {
    return defHttp.delete({ url: Api.deleteUser, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess()
    })
}