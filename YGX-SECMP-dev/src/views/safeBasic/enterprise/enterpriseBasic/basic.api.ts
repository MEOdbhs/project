import { defHttp } from '/@/utils/http/axios';

enum Api {
  saveOrUpdate = '/main-app/SfEntBaseInfo/saveOrUpdate',
  getViewByOrgCode = '/main-app/SfEntBaseInfo/getViewByOrgCode',
  loadFileList = '/main-app/CsFiles/list',
  downloadFile = '/gateway/system/common/file/downloadFile',
}

/**
 * 保存或更新
 * @param params
 */
export const saveOrUpdate = (params) => {
  return defHttp.post({ url: Api.saveOrUpdate, params });
};

/**
 * 详情、编辑查询
 * @param params
 */
export const getViewByOrgCode = (params) => defHttp.get({ url: Api.getViewByOrgCode, params });

/**
 * 加载文件列表
 * @param params
 */
export const loadFileList = (params) => defHttp.get({ url: Api.loadFileList, params });

/**
 * 下载图片文件
 * @param filePath 文件路径
 * @returns Promise<string> 返回 blob URL
 */
export const downloadImageFile = async (filePath: string) => {
  const response = await defHttp.getAxios().get(Api.downloadFile, {
    params: { filePath },
    responseType: 'blob',
  });

  // 将 blob 转换为 URL
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  return blobUrl;
};