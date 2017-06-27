import wxCharts from '../../utils/wxcharts';

//获取应用实例
new class DemoIndex {
  data = {
    headerData: {
      title: 'Charts DEMO',
      desc: 'Charts DEMO'
    },
  };

  constructor() {
    Page(this);
  }

  onLoad() {
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
    }

    new wxCharts({
        canvasId: 'pieCanvas',
        type: 'line',
        series: [{
            name: 'cat1',
            data: 50,
        }, {
            name: 'cat2',
            data: 30,
        }, {
            name: 'cat3',
            data: 1,
        }, {
            name: 'cat4',
            data: 1,
        }, {
            name: 'cat5',
            data: 46,
        }],
        width: 360,
        height: 400,
        dataLabel: true
    });
  }
}
