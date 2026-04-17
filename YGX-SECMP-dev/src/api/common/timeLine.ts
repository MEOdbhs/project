import { defHttp } from '/@/utils/http/axios';
enum Api {
  getTimeLineImg = '/activity/share/flowChart',
  getTimeLineData = '/activity/share/history'
}


// export const getTimeLineImg = (params) => {
//     return defHttp.get({ url: Api.getTimeLineImg,responseType: 'blob',params:params });
//   };



export const getTimeLineImg = (parameter) => {
  return defHttp.get(
    {
      url: Api.getTimeLineImg,
      params: parameter,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};

export const getTimeLineData = (params) => {
  return defHttp.get({ url: Api.getTimeLineData, params });
};