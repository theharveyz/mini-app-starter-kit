import Auth from './services/auth';
import WX from './services/wx';
import Broadcast from './utils/broadcast';
import { getRedirectUrl } from './utils/util';
import { AUTH_TOKEN } from './constants/app';

// 约束：不建议在客户端缓存有一定过期时间的值，比如：login时的code。
const authService = new Auth();
const wxService = new WX();

new class Main {
  globalData = {
    userInfo:null,
    erp:null
  };
  // 绑定广播对象
  broadcast = new Broadcast();

  constructor() {
    App(this);
  }

  // app启动
  onLaunch() {
    // 订阅鉴权失败事件
    this.broadcast.subscribe('request:error', (requestError) => {
      let errMsg = '请求超时,请检查网络是否正常';
      if (requestError) {
        // XXX: 注意下，当后端需要进行更细的权限验证时，返回403时，可能要单独进行处理，而不是跳转到登录页面
      }
      wxService.showModal({
        title: '请求错误信息',
        showCancel: false,
        confirmColor: '#f00000',
        content: errMsg,
        duration: 0
      });
    });
    // 订阅全局异常处理
    this.broadcast.subscribe('global:error', (err) => {
      wxService.showModal({
        title: '异常信息',
        showCancel: false,
        confirmColor: '#f00000',
        content: err.errMsg || err.message, //微信自带errMsg属性
        duration: 0
      });
    });
    // 获取微信用户信息
    wxService.getUserInfo().then(res => {
      this.globalData.userInfo = res.userInfo;
      return res.code;
    }).then(code => {
      // return authService.token(code);
      return "测试";
    }).then(res => {
      if (res) {
        this.globalData.erp = res.erp;
        // 写入localstorage
        wx.setStorageSync(AUTH_TOKEN, res.token);
      }
    });
  }

  onError(err) {
    console.log(err);
  }

  // 只能通过属性方式去绑定
  currentPage() {
    const page = getCurrentPages().pop();
    if (page) {
      return page.__route__;
    }
    return null;
  }

  getPageNum() {
    return getCurrentPages().length;
  }
}
