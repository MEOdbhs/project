import { defHttp } from '/@/utils/http/axios'

enum Api {
    statisticsZoneAndEnRelation = '/main-app/StStatisticsEnterprise/statisticsZoneAndEnRelation',
    statisticsEnRegister = '/main-app/StStatisticsEnterprise/statisticsEnRegister',
    statisticsHazardManage = '/main-app/StStatisticsEnterprise/statisticsHazardManage',
    statisticsDangerWorkmanship = '/main-app/StStatisticsEnterprise/statisticsDangerWorkmanship',
    statisticsDangerChemicals = '/main-app/StStatisticsEnterprise/statisticsDangerChemicals',
}

// 区域企业接入情况
export const statisticsZoneAndEnRelation = (params) => defHttp.get({ url: Api.statisticsZoneAndEnRelation, params })
// 企业接入统计
export const statisticsEnRegister = (params) => defHttp.get({ url: Api.statisticsEnRegister, params })
// 危险源设施统计
export const statisticsHazardManage = (params) => defHttp.get({ url: Api.statisticsHazardManage, params })
// 重点化学工艺统计
export const statisticsDangerWorkmanship = (params) => defHttp.get({ url: Api.statisticsDangerWorkmanship, params })
// 危险化学品统计
export const statisticsDangerChemicals = (params) => defHttp.get({ url: Api.statisticsDangerChemicals, params })