import { defHttp } from '/@/utils/http/axios'

enum Api {
   // 基本信息 — 列表查询
  listPage = '/main-app/IndTradeChemSteel/listPage',
  // 基本信息 — 查询
  getDetail = '/main-app/IndTradeChemSteel/getViewById',
  // 粉尘涉爆专项信息 — 保存
  saveParentCompany = '/main-app/IndTradeChemDust/saveOrUpdate',
  // 粉尘涉爆专项信息— 查询
  getDetailCompany = '/main-app/IndTradeChemDust/getViewBySteelId',
  // 工厂目录 — 保存
  saveIndTradeChemDir = '/main-app/IndTradeChemDir/saveOrUpdate',
  // 工厂目录- 查询
  getIndTradeChemDir = '/main-app/IndTradeChemDir/getViewByIndTradeId',
  // 工厂基本信息 — 保存
  saveIndTradeChemFac = '/main-app/IndTradeChemFac/saveOrUpdate',
  // 工厂基本信息- 查询
  getIndTradeChemFac = '/main-app/IndTradeChemFac/getViewByIndTradeId',
  // 其余所有 Tab — 通用接口，通过 mineDetailProperty 区分
  saveDetailProperty = '/main-app/IndTradeChemInfo/saveDetailProperty',
  addEnterprise = '/main-app/IndTradeChemSteel/saveOrUpdate',
  deleteById = '/main-app/IndTradeChemSteel/deleteSubById',
}

export const listPage = (params) => defHttp.get({ url: Api.listPage, params })
export const getDetail = (params) => defHttp.get({ url: Api.getDetail, params })
export const getDetailCompany = (params) => defHttp.get({ url: Api.getDetailCompany, params })
export const getIndTradeChemDir = (params) => defHttp.get({ url: Api.getIndTradeChemDir, params })
export const saveIndTradeChemDir = (params) => defHttp.post({ url: Api.saveIndTradeChemDir, params })
export const saveIndTradeChemFac = (params) => defHttp.post({ url: Api.saveIndTradeChemFac, params })
export const getIndTradeChemFac = (params) => defHttp.get({ url: Api.getIndTradeChemFac, params })
export const saveParentCompany = (params) => defHttp.post({ url: Api.saveParentCompany, params })
/** 通用保存：params 中包含 mineDetailProperty 字段 */
export const saveDetailProperty = (params) => defHttp.post({ url: Api.saveDetailProperty, params })
export const addEnterprise = (params) => defHttp.post({ url: Api.addEnterprise, params })
export const deleteById = (id) => defHttp.post({ url: Api.deleteById, params: { id } })
