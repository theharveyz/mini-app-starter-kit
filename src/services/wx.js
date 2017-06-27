import promisify from '../utils/promisify';

/**
 * 小程序服务的接口Promise方式封装
 */
export default class WX {
  globalData = {
    userInfo:null,
  }

  login(...params) {
    return promisify(wx.login)(...params);
  }

  getUserInfoP(...params) {
    return promisify(wx.getUserInfo)(...params);
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    const that = this;
    //调用登录接口
    return that.getLoginCode().then(code => {
      return that.getUserInfoP().then(res => {
        return {
          userInfo: res,
          code: code
        };
      });
    });
  }

  /**
   * 获取登录所需code内容
   */
  getLoginCode() {
    const that = this;
    return that.login().then(info => {
      if (info.code) {
        return info.code;
      }
      throw new Error('获取登录CODE失败');
    });
  }

  // ui方面的封装
  showModal(...params) {
    return promisify(wx.showModal)(...params);
  }

  showToast(params, hideDurationSeconds = 3) {
    return promisify(wx.showToast)(params).then((res) => {
      if (hideDurationSeconds) {
        setTimeout(() => {
          wx.hideToast();
        }, hideDurationSeconds * 1000);
      }
      return res;
    });
  }
}
