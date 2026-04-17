import { defHttp } from '/@/utils/http/axios'
import { buildListPageBody, buildRemoveMineBody } from './enterprise.transform'

enum Api {
  listPage = '/main-app/api/v1/mine/listPage',
  getDetail = '/main-app/api/v1/mine/queryMineDetail',
  // 基本信息 — 独立接口
  saveBaseInfo = '/main-app/api/v1/mine/v1/check/mines',
  // 上级企业信息 — 独立接口
  saveParentCompany = '/main-app/api/v1/mine/v1/check/parent',
  // 其余所有 Tab — 通用接口，通过 mineDetailProperty 区分
  saveDetailProperty = '/main-app/api/v1/mine/savaOrUpdateDetail',
  deleteDetail = '/main-app/api/v1/mine/deleteDetail',
  addEnterprise = '/main-app/api/v1/riskCompanyInfo/addCompanyInfo',
  deleteById = '/main-app/api/v1/mine/removeMine',
  areaTree = '/main-app/api/v1/area/city/all',
  reportSubmit = '/main-app/api/v1/mine/reportSubmit',
  superviseList = '/main-app/api/v1/mine/supervise',
}

export const listPage = (params) => defHttp.post({ url: Api.listPage, params: buildListPageBody({ queryParams: params }) })
export const getDetail = (params) => defHttp.get({ url: Api.getDetail, params })
export const queryMineDetail = (params) => defHttp.get({ url: Api.getDetail, params })
export const saveBaseInfo = (params) => defHttp.post({ url: Api.saveBaseInfo, params })
export const saveParentCompany = (parentCompanyDTO) =>
  defHttp.post({ url: Api.saveParentCompany, params: parentCompanyDTO })
/** 通用保存：params 中包含 mineDetailProperty、mineDetail 字段 */
export const saveDetailProperty = (params) => defHttp.post({ url: Api.saveDetailProperty, params })
/** 删除子表明细：id 为明细行 id，mineDetailProperty 与保存时一致 */
export const deleteMineDetail = (params: { deleteId: string; mineDetailProperty: string }) =>
  defHttp.post({ url: Api.deleteDetail, params })
export const addEnterprise = (params) => defHttp.post({ url: Api.addEnterprise, params })
export const deleteById = (id: string) => defHttp.post({ url: Api.deleteById, params: buildRemoveMineBody({ id }) })
export const getAreaTree = () => defHttp.get({ url: Api.areaTree })
export const getSuperviseList = (areaId: string | number) => defHttp.get({ url: Api.superviseList, params: { areaId } })
export const reportSubmit = (id: string) =>
  defHttp.post({ url: Api.reportSubmit, params: { id } })
