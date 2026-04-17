import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { message } from 'ant-design-vue';

// base模块相关公共接口，如线路、站点等，以及除框架外的一些其他公共接口
enum Api {
  // 文件下载
  downloadFileUrl = '/system/common/file/downloadFile',
  icssUploadFile = '/main-app/CsFiles/uploadFile',
  icssDeleteFileByFilePath = '/main-app/CsFiles/deleteFile',
  icssDeleteFileByFileId = '/main-app/CsFiles/',
}

/**
 * downloadFileUrl
 * @param params
 */
export const getDownloadFileUrl = Api.downloadFileUrl;

/**
 * icss文件上传
 * @param params
 */
export function icssUploadFile(params: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: Api.icssUploadFile,
    },
    params,
    { isReturnResponse: true }
  );
}
/**
 * icss删除
 */
export const icssDeleteFileByFilePath = (params, handleSuccess) => {
  defHttp.get({ url: Api.icssDeleteFileByFilePath, params }).then(() => {
    handleSuccess();
  });
};

/**
 * icss删除
 */
export const icssDeleteFileByFileId = (id, handleSuccess) => {
  defHttp.delete({ url: Api.icssDeleteFileByFileId + id }).then(() => {
    handleSuccess();
  });
};
