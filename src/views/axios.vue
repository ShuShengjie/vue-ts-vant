import { MKAxios } from '@mokai/axios/dist';
import qs from 'qs';
import Axios, { AxiosRequestConfig } from 'axios';
import Store from '../../stores/index';
import Config from '@/config';
import routerInstance from '../../router/index';

const GlobalAxios = new MKAxios();
GlobalAxios.Initialize({
  usesbp: true,
  config: {
    baseURL: Config.RequestUrl,
    timeout: 10000,
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': - 1,
    },
  },
});
let abnormalCount403: number = 0;
const requestMap = new Map(); // 请求字典，防止重复提交
const CancelToken = Axios.CancelToken;
GlobalAxios.inst.interceptors.request.use((config: AxiosRequestConfig) => {
  // 可以添加header信息等
  // 例如config.headers.common["Authorization"]="Bearer "+window.abp.auth.getToken();

  const authToken = Store.getters.GetToken;

  // 防止重复提交
  const keyString = qs.stringify(Object.assign({}, { url: config.url, method: config.method }, config.data));
  if (requestMap.get(keyString) && Config.isDevelopment) {
    // 取消当前请求：
    config.cancelToken = new CancelToken((cancel) => {
      cancel(`请稍后点击!`);
      // ${'url: ' + config.url}
    });
  }
  requestMap.set(keyString, true);

  Object.assign(config, { _keyString: keyString });

  if (authToken !== '' && authToken) {
    config.headers.Authorization = `Bearer ` + authToken;
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 返回响应拦截器
GlobalAxios.inst.interceptors.response.use((res) => {

  // 重置requestMap
  const config: any = res.config;

  requestMap.set(config._keyString, false);

  if (res.status === 200) {
    return res.data;
  } else {
    console.log(`request failed error： ${res}`);
  }
}, (err) => {
  if (err && err.response) {
    switch (err.response.status) {
    case 400: err.message = '请求错误(400)'; break;
    case 401:
      err.message = '没有权限(401)';
      routerInstance.replace('/login');
      break;
    case 403:
      abnormalCount403 ++;
      console.log(abnormalCount403, 'abnormalCount403');
      err.message = '拒绝访问(403)';
      break;
    case 404: err.message = '请求出错(404)'; break;
    case 408: err.message = '请求超时(408)'; break;
    case 500: err.message = '服务器错误(500)'; break;
    case 501: err.message = '服务未实现(501)'; break;
    case 502: err.message = '网络错误(502)'; break;
    case 503: err.message = '服务不可用(503)'; break;
    case 504: err.message = '网络超时(504)'; break;
    case 505: err.message = 'HTTP版本不受支持(505)'; break;
    default: err.message = `连接出错(${err.response.status})!`;
    }
  }

  return Promise.reject(err.response.data.res ? err.response.data.res : err);
});

export default GlobalAxios;
