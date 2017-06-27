import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE } from '../constants/http';
import { AUTH_TOKEN } from '../constants/app';
import promisify from '../utils/promisify';
import PromiseSigleton from '../utils/promise-singleton';


const httpRequest = (method) => (takeLoginToken = false) => (api) => (target, props, descriptor) => {
  const func = descriptor.value;
  descriptor.value = (...args) => {
    const options = func.apply(this, args) || {};
    options.header = options.header || {};
    const host = target.hasOwnProperty('_wx_request_host') ? target._wx_request_host : '';
    const extra = {};
    if (method) {
      Object.assign(extra, { method });
    }
    if (api) {
      Object.assign(extra, { url: api });
    }
    if (takeLoginToken) {
      // 这里直接使用同步方式获取
      const token = wx.getStorageSync(AUTH_TOKEN);
      if (token) {
        Object.assign(options.header, { 'X-Token': token });
      }
    }
    Object.assign(options.header, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    Object.assign(extra, options);
    extra.url = host + extra.url;
    let requestData = null;
    return promisify(wx.request)(extra).then(data => {
      if ( 100 <= data.statusCode && data.statusCode < 400) {
        try { data.data = JSON.parse(data.data); } catch (e) {};
        return data.data;
      }
      // 关键！自定义失败请求的对象
      requestData = data;
      throw new Error('request error');
    }).catch(err => {
      const app = getApp();
      // 发布请求错误事件
      // 注意区分：服务器返回错误 和 请求失败
      if (requestData) {
        app.broadcast.publish('request:error', requestData);
      } else {
        app.broadcast.publish('global:error', err);
      }
      // 终止Promise链，不会再执行下面的then
      // 使用单例，避免可能存在的内存泄露问题
      return PromiseSigleton.getInstance();
    });
  }
};

export const httpHost = (host, ...params) => (target) => {
  Object.assign(target.prototype, {
    _wx_request_host: host
  });
  return target;
};

export const httpGet = httpRequest(HTTP_GET);
export const httpPost = httpRequest(HTTP_POST);
export const httpPut = httpRequest(HTTP_PUT);
export const httpDelete = httpRequest(HTTP_DELETE);
