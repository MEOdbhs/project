import { defHttp } from '/@/utils/http/axios'

enum Api {
    listPage = '/main-app/SfSafetyAlarmWeeklyReport/listPage',
    exportExcel = '/main-app/SfSafetyAlarmWeeklyReport/export',
}

export const listPage = (params) => defHttp.get({ url: Api.listPage, params })

export const getExportUrl = Api.exportExcel;