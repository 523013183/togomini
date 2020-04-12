var util = require('../../utils/util.js')
Page({
  data: {
    height: '',
    hiddenFlag: true,
    titleTitle: "全部活动",
    avatarSrc: null,
    activityList: [],
    remainArr: [],
    tabIndex: 0,
    isReshow: false, //返回再次加载数据
  },
  changeFlag(e) {
    this.setData({
      hiddenFlag: !this.data.hiddenFlag
    })
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
        type: type
      },
      success: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 200)
        console.log("获取活动列表数据 res：", res);
        var listArr = res.data.list;
        var arr = listArr.reverse();
        self.setData({
          activityList: arr,
        })
      }
    });
  },
  onLoad: function (options) {
    var self = this;
    wx.createSelectorQuery().selectAll('.section_title').boundingClientRect(function (rect) {
      console.log(rect[0].height)
      self.setData({
        height: wx.getSystemInfoSync().windowHeight - rect[0].height
      })
    }).exec();
    let level_name = wx.getStorageSync('level_name')
    self.setData({
      level_name: level_name
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
    if (!keyword) {
      return;
    }
    getApp().request({
      url: getApp().api.activityList,
      method: "post",
      data: {
        keyword: keyword
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
  },
  addactive() {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (wx.getStorageSync('msg') != '名片不存在') {
        if (wx.getStorageSync('level_name') == '普通用户') {
          wx.showToast({
            title: '请先认证设计师(联系客服)',
            icon: 'none'
          })
        } else {
          wx.navigateTo({
            url: '/pages1/sponsorActivity/sponsorActivity',
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '完善名片才能操作，是否前往完善',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: "/pages/index/index?imgSrc=" + wx.getStorageSync('USER_INFO').avatar_url +
                  '&nickname=' + wx.getStorageSync('USER_INFO').nickname + '&mobile=' + wx.getStorageSync('USER_INFO').binding,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else {
      util.checkLogin();
    }
  }
})