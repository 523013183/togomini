Page({
  data: {
    hiddenFlag: true,
    titleTitle: "全部活动",
    avatarSrc: null,
    activityList: [],
    remainArr: [],
    tabIndex: 0,
    isReshow: false,//返回再次加载数据
  },
  changeFlag(e) {
    this.setData({
      hiddenFlag: !this.data.hiddenFlag
    })
    // console.log(this)
  },
  change_type(e) {
    var index = e.currentTarget.dataset.index;
    this.getactivityList(index)
    this.setData({
      titleTitle: e.currentTarget.dataset.name,
      tabIndex: index
    })
  },
  //获取活动列表
  getactivityList: function (type) {
    wx.showLoading({
      title: '',
    })
    var self = this;
    getApp().request({
      url: getApp().api.activityList,
      method: "post",
      data: {
        user_id: self.data.user_id
      },
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 200)
        console.log("获取活动列表数据 res：", res);
        var timestamp = Date.parse(new Date());
        let list = res.data.list;
        let arr = [];
        for (let i in list) {
          let timestamp1 = new Date(list[i].end_time.replace(/-/g, '/')).getTime()
          if (timestamp1 > timestamp) {
            arr.push(list[i])
          }
        }
        self.setData({
          activityList: arr,
        })
      }
    });
  },
  onLoad: function (options) {
    console.log(options)
    var self = this;
    wx.createSelectorQuery().selectAll('.section_title').boundingClientRect(function (rect) {
      self.setData({
        height: wx.getSystemInfoSync().windowHeight - rect[0].height
      })
    }).exec();
    self.setData({
      user_id:options.user
    })
    self.getactivityList(0);
    var USER_INFO = getApp().core.getStorageSync(getApp().const.USER_INFO);
  },
  onShow: function () {
    var that = this;
    if (that.data.isReshow) {
      that.getactivityList(that.data.tabIndex);
    }
    that.data.isReshow = true;
  },
  linkActiviteDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/activityDetail/activityDetail?id=" + id
    })
  },
  //获取关键字
  getKeyword: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  //搜索商品
  getList: function () {
    var that = this;
    var keyword = that.data.keyword;
    if (!keyword) { return; }
    getApp().request({
      url: getApp().api.activityList,
      method: "post",
      data: {
        keyword: keyword,
        user_id: that.data.user_id
      },
      success: function (res) {
        console.log("获取活动列表数据 res：", res);
        var listArr = res.data.list;
        var arr = listArr.reverse();
        that.setData({
          activityList: arr,
        })
      }
    });
  }
})