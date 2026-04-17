import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';

enum Api {
    viewList = '/main-app/MhWorkbenchConfig/getViewList',
    ruleList = '/main-app/MhWorkbenchConfig/getRuleList',
    saveWorkConfig = '/main-app/MhWorkbenchConfig/saveWorkConfig',
    /**
     * 数据概览
     */
    dataOverview = '/main-app/WorkBenchController/getDataOverview',
    /**
     * 通知公告
     */
    notice = '/main-app/WorkBenchController/getNotice',
    /**
     * 企业风险趋势
     */
    enterpriseWarning = '/main-app/WorkBenchController/getEnterpriseWarning',
    /**
     * 重大危险源（企业部门）
     */
    hazardCountByAverage = '/main-app/WorkBenchController/getHazardCountByAverage',
    /**
     * 重大危险源（监管部门）
     */
    hazardCountByManage = '/main-app/WorkBenchController/getHazardCountByManage',
    /**
     * 设备接入和运行情况
     */
    equipmentAccess = '/main-app/WorkBenchController/getEquipmentAccess',

    /**
     * 风险等级分布
     */
    riskLevel = '/main-app/WorkBenchController/getRiskLevel',
    /**
     * 隐患处置情况分布
     */
    hiddenDanger = '/main-app/WorkBenchController/getHiddenDanger',
    /**
     * 安全承诺公告
     */
    safeNotice = '/main-app/WorkBenchController/getSafeNotice',
    viewById = '/main-app/SfSafeNotice/getViewById',

    /**
     * 预警类型排名
     */
    warningStyle = '/main-app/WorkBenchController/getWarningStyle',
}

/**
 * 列表(分页)
 * @param params
 */
export const getViewList = (params) => defHttp.get({ url: Api.viewList, params });

/**
 * 规则列表
 * @param params
 */
export const getRuleList = (params) => defHttp.get({ url: Api.ruleList, params });
 
/**
 * 保存或更新
 * @param params
 */
export const saveOrUpdate = (params) => defHttp.post({ url: Api.saveWorkConfig, params });

/**
 * 数据概览
 * @param params
 */
export const getDataOverview = (params) => defHttp.get({ url: Api.dataOverview, params });

/**
 * 通知公告
 * @param params
 */
export const getNotice = (params) => defHttp.get({ url: Api.notice, params });

/**
 * 企业风险趋势
 * @param params
 */
export const getEnterpriseWarning = (params) => defHttp.get({ url: Api.enterpriseWarning, params });
 /**
  * 重大危险源（企业部门）
  * @param params
  */
export const getHazardCountByAverage = (params) => defHttp.get({ url: Api.hazardCountByAverage, params });
/**
 * 重大危险源（监管部门）
 * @param params
 */
export const getHazardCountByManage = (params) => defHttp.get({ url: Api.hazardCountByManage, params });

/**
 * 设备接入和运行情况
 * @param params
 */
export const getEquipmentAccess = (params) => defHttp.get({ url: Api.equipmentAccess, params });
 
/**
 * 风险等级分布
 * @param params
 */
export const getRiskLevel = (params) => defHttp.get({ url: Api.riskLevel, params });
 /**
  * 隐患处置情况分布
  * @param params
  */
export const getHiddenDanger = (params) => defHttp.get({ url: Api.hiddenDanger, params });

/**
 * 安全承诺公告
 * @param params
 */
export const getSafeNotice = (params) => defHttp.get({ url: Api.safeNotice, params });
 
/**
 * 预警类型排名
 * @param params
 */
export const getWarningStyle = (params) => defHttp.get({ url: Api.warningStyle, params });
 
/**
 * 安全承诺公告详情
 * @param params
 */
export const getSafeNoticeViewById = (params) => defHttp.get({ url: Api.viewById, params });
 