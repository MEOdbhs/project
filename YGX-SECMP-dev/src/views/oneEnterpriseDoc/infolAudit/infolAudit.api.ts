import { defHttp } from '/@/utils/http/axios'

enum Api {
  auditList = '/main-app/api/v1/mine/auditList',
  reportSubmit = '/main-app/api/v1/mine/reportSubmit',
  audit = '/main-app/api/v1/mine/audit',
}

export function auditList(params: Record<string, any>) {
  return defHttp.get({ url: Api.auditList, params })
}

export function reportSubmit(id: string) {
  return defHttp.post({ url: Api.reportSubmit, params: { id } })
}

export interface AuditMinePayload {
  checkId: string
  pass: boolean
  checkComment?: string
}

export function auditMine(payload: AuditMinePayload) {
  return defHttp.post({ url: Api.audit, params: payload })
}

