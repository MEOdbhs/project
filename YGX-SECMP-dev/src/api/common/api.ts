import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const baseUploadUrl = globSetting.apiUrl;

enum Api {
  positionList = '/sys/position/list',
  orguserList = '/sys/user/queryUserByOrgCode',
  userList = '/sys/user/list',

  roleList = '/sys/role/list',
  queryDepartTreeSync = '/sys/sysDepart/queryDepartTreeSync',
  queryTreeList = '/sys/sysDepart/queryTreeList',
  loadTreeData = '/sys/category/loadTreeData',
  loadDictItem = '/sys/category/loadDictItem/',
  getDictItems = '/sys/dict/getDictItems/',
  getTableList = '/sys/user/queryUserComponentData',
  getCategoryData = '/sys/category/loadAllData',
  refreshDragCache = '/drag/page/refreshCache',
  getHkToekn = '/main-app/hik/sso/token/generate',
}




/**
 * 获取海康融合平台专用token
 */
export const getHkToekn = (params) => {
  return defHttp.get({ url: Api.getHkToekn, params  }, { joinTime: false });
};
/**

/**
 * 上传父路径
 */
export const uploadUrl = `${baseUploadUrl}/gateway/main-app/CsFiles/uploadFileAndSaveRec`;

/**
 * 职务列表
 * @param params
 */
export const getPositionList = (params) => {
  return defHttp.get({ url: Api.positionList, params });
};

/**
 * 用户列表
 * @param params
 */
export const getUserList = (params) => {
  return defHttp.get({ url: Api.userList, params });
};

export const getOrgUserList = (params) => {
  return defHttp.get({ url: Api.orguserList, params });
};

/**
 * 角色列表
 * @param params
 */
export const getRoleList = (params) => {
  return defHttp.get({ url: Api.roleList, params });
};

/**
 * 异步获取部门树列表
 */
export const queryDepartTreeSync = (params?) => {
  return defHttp.get({ url: Api.queryDepartTreeSync, params });
};
/**
 * 获取部门树列表
 */
export const queryTreeList = (params?) => {
  return defHttp.get({ url: Api.queryTreeList, params });
};

/**
 * 分类字典树控件 加载节点
 */
export const loadTreeData = (params?) => {
  return defHttp.get({ url: Api.loadTreeData, params });
};

/**
 * 根据字典code加载字典text
 */
export const loadDictItem = (params?) => {
  return defHttp.get({ url: Api.loadDictItem, params });
};

/**
 * 根据字典code加载字典text
 */
export const getDictItems = (dictCode) => {
  return defHttp.get({ url: Api.getDictItems + dictCode }, { joinTime: false });
};
/**
 * 部门用户modal选择列表加载list
 */
export const getTableList = (params) => {
  return defHttp.get({ url: Api.getTableList, params });
};
/**
 * 加载全部分类字典数据
 */
export const loadCategoryData = (params) => {
  return defHttp.get({ url: Api.getCategoryData, params });
};
/**
 * 文件上传
 */
export const uploadFile = (params, success) => {
  return defHttp.uploadFile({ url: uploadUrl }, params, { success });
};
/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export const downloadFile = (url, fileName?, parameter?) => {
  return getFileblob(url, parameter).then((data) => {
    if (!data || data.size === 0) {
      message.warning('文件下载失败');
      return;
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data]), fileName);
    } else {
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  });
};

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export const getFileblob = (url, parameter) => {
  return defHttp.get(
    {
      url: url,
      params: parameter,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};

/**
 * 【用于评论功能】自定义文件上传-方法
 */
export const uploadMyFile = (url, data) => {
  return defHttp.uploadMyFile(url, data);
};
/**
 * 刷新仪表盘缓存
 * @param params
 */
export const refreshDragCache = () => defHttp.get({ url: Api.refreshDragCache }, { isTransformResponse: false });



/**
 * 上传文件到文件服务器
 * @param file
 */
export const uploadFileToServer = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  // 使用 axios 原生实例，避免 cloneDeep 导致 FormData 丢失
  // 直接调用 getAxios() 获取原始 axios 实例
  const axiosInstance = defHttp.getAxios();
  return axiosInstance.post(Api.uploadFile, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => {
    return res.data?.result || res.data;
  });
};

/**
 * 删除文件
 * @param id
 */
export const deleteFileFromServer = (id) => {
  return defHttp.get({ url: Api.deleteFile, params: { filePath: id } });
};

/**
 * 下载文件
 * @param filePath 文件路径（fileAddr）
 * @param fileName 文件名
 */
export const downloadFileFromServer = (filePath, fileName) => {
  return defHttp.get(
    {
      url: '/system/common/file/downloadFile',
      params: { filePath },
      responseType: 'blob',
    },
    { isTransformResponse: false }
  ).then((data) => {
    if (!data || data.size === 0) {
      message.warning('文件下载失败');
      return;
    }

    // 创建下载链接
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE浏览器
      window.navigator.msSaveBlob(new Blob([data]), fileName);
    } else {
      // 现代浏览器
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    message.success('下载成功');
  }).catch((error) => {
    console.error('下载失败:', error);
    message.error('下载失败，请稍后重试');
  });
};


/**
 * 上传文件
 * @param formData
 */
export const uploadFiles = (formData) => {
  return uploadFileToServer(formData);
};

/**
 * 删除文件
 * @param id
 */
export const deleteFiles = (id) => {
  return deleteFileFromServer(id);
};

/**
 * 下载文件
 * @param filePath 文件路径
 * @param fileName 文件名
 */
export const downloadFiles = (filePath, fileName) => {
  return downloadFileFromServer(filePath, fileName);
};

/**
 * 根据业务ID查询文件列表
 * @param bizId 业务ID
 */
export const getFileListByBizId = (bizId) => {
  if (!bizId) {
    return Promise.resolve([]);
  }
  return defHttp.get({
    url: '/main-app/CsFiles/list',
    params: { bizId }
  }).then(res => {
    return res || [];
  });
};

/**
 * 根据文件ID删除文件
 * @param id 文件ID
 */
export const deleteFileById = (id) => {
  return defHttp.delete({ url: `/main-app/CsFiles/${id}` });
};
