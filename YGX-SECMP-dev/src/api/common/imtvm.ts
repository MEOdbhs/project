import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams, UploadFileCallBack } from '/#/axios';

// imtvmx业务相关公告接口，如线路、车辆等
enum Api {
  // 文件上传
  uploadFile = '/imtvm/SysFiles/uploadFile',
  // 文件下载
  downloadFile = '/imtvm/SysFiles/downloadFile',
}
/**
 * 文件上传
 * @param params
 */
export function uploadFile(params: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: Api.uploadFile,
    },
    params,
    { isReturnResponse: true }
  );
}
/**
 * downloadFile
 * @param params
 */
export const getDownloadFileUrl = Api.downloadFile;