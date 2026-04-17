import { defHttp } from '/@/utils/http/axios';

enum Api {
  listPage = '/main-app/YjaqxxkRealtimeMonitoring/listPage',
  listSensingPage = '/main-app/YjaqxxkRealtimeMonitoring/listSensingPage',
}

/**
 * 分页查询（矿山、工贸、化学品）
 */
export const listPage = (params: any) => defHttp.get({ url: Api.listPage, params });

/**
 * 分页查询（地质灾害、水文、森林防火）
 * @param params.associatedDeviceId 1-传感器，2-视频监控
 */
export const listSensingPage = (params: any) => defHttp.get({ url: Api.listSensingPage, params });