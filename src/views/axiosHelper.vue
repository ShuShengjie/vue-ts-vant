import GlobalAxios from '../axios/http';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export default class AxiosHelper {

  public static get Axios(): AxiosInstance {
    return GlobalAxios.inst;
  }

  public static Get<T>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<T> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.get(url, requestConfig)
        .then((response) => {
          fulfill(<any> response);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  public static GetRes<T>(url: string): Promise<T> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.get(url)
        .then((response) => {
          fulfill(response.data ? response.data.res : (<any> response).res);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  public static Post<T>(url: string, data?: any): Promise<T> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.post(url, data)
        .then((response) => {
          fulfill(<any> response);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  public static PostData<T>(url: string, data?: any, requestConfig?: any): Promise<T> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.post(url, data)
        .then((response) => {
          fulfill(<any> response);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  public static PostRes<T>(url: string, data?: any, requestConfig?: any): Promise<T> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.post(url, data)
        .then((response) => {
          fulfill(response.data ? response.data.res : (<any> response).res);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  public static Put<T>(url: string, data?: any): Promise<T> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.put(url, data)
        .then((response) => {
          fulfill(response.data);
        }).catch((error) => {
          reject(error);
        });
    });
  }

  public static PutRes<T>(url: string, data?: any): Promise<any> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.put(url, data)
        .then((response) => {
          fulfill(response.data ? response.data.res : (<any> response).res);
        }).catch((error) => {
          reject(error);
        });
    });
  }


  public static Delete<T>(url: string): Promise<any> {
    return new Promise((fulfill, reject) => {
      AxiosHelper.Axios.delete(url)
        .then((response) => {
          fulfill(response);
        }).catch((error) => {
          reject(error);
        });
    });
  }

}
