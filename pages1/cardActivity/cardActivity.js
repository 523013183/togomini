var util = require("../../utils/util.js");
Page({
  data: {
    activityArr: [],
    addTime: null,
    active: 1
  },
  onLoad: function (options) {
    var self = this;
    if (options.user_id) {
      self.getCardMsg(options.user_id);
    } else {
      self.setData({
        userid: options.userid
      })
      self.getCardMsg2(options.userid);
    }
    self.setData({
      avatarimg: wx.getStorageSync('avatar'),
      username: wx.getStorageSync('user_name'),
      browseoups: wx.getStorageSync('browseoups'),
      browsepage: wx.getStorageSync('browsepage'),
      browsecar: wx.getStorageSync('browsecar')
    })
  },
  //获取名片动态数据
  getCardMsg: function (id) {
    wx.showLoading({
      title: '',
      icon: 'none'
    })
    var self = this;
    getApp().request({
      url: getApp().api.cardActivity,
      method: "post",
      data: {
        card_id: id
      },
      success: function (res) {
        wx.hideLoading();
        for (let i in res.data) {
          if (res.data[i].type == '120') {
            res.data.splice(i, 1);
          }
          if (res.data[i].type == '105' && res.data[i].mobile == '') {
            res.data.splice(i, 1);
          }
        }
        self.setData({
          activityArr: res.data,
        })
      }
    })
  },
  getCardMsg2: function (id) {
    wx.showLoading({
      title: '',
      icon: 'none'
    })
    var self = this;
    getApp().request({
      url: getApp().api.cardActivity,
      method: "post",
      data: {
        sub_user_id: id
      },
      success: function (res) {
        wx.hideLoading();
        if (res.code == 0) {
          self.setData({
            activityArr: res.data,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      }
    })
  },
  //动态页面中打电话取消置顶
  cancleSettop: function (e) {

    var phone = e.currentTarget.dataset.phone;
    if (!phone) {
      phone = that.data.globalData.contact
    }
    wx.makePhoneCall({
      phoneNumber: phone,
    })
    return;
    var self = this;
    getApp().request({
      url: getApp().api.cancleSettop,
      method: "post",
      data: {
        card_id: 7,
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        getApp().core.showModal({
          title: "提示",
          content: res.msg,
          showCancel: !1,
        })
        self.getCardMsg();
      }
    })
  },
  //  跳转套餐
  linkgroup(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    if (type == 2) {
      wx.navigateTo({
        url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + "&type=1"
      })
    } else {
      wx.navigateTo({
        url: "/pages1/groupDetail/groupDetail?id=" + id,
      })
    }
  },
  // 跳转作品
  linkzp(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/productDetail/productDetail?id=" + id + "&type=1"
    })
  },
  // 跳转活动
  linkactive(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/activityDetail/activityDetail?id=" + id
    })
  },
  // 设计师详情
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid;
    var a = '/pages1/postCard/postCard?id=' + id + "&user_id=" + userid; //点击分享消息是打开的页面
    wx.navigateTo({
      url: a,
    })
  },
  active(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      active: index
    })
  }
})