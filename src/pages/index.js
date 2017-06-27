import Auth from '../services/auth';

const authService = new Auth;

//获取应用实例
new class PageIndex {
  data = {
    headerData: {
      title: 'mini-app-starter-kit',
      desc: '微信小程序DEMO版'
    },
    "grids": [
      {
        "name": "测试",
        "iconPath": "../assets/images/ump_logo.png",
        pagePath: "chart-demos/demo"
      },{},{},
      {},{},{},
      {},{}
    ]
  };

  constructor() {
    Page(this);
  }

  onLoad() {
  }

  logout() {
    authService.logout().then(res => {
      return wx.redirectTo({
        url: '/pages/index'
      });
    });
  }
}
