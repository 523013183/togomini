var app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    imgSrc: "",
    hidden: 1,
    nickname: "",
    mobile: "",
  },
  getPhoneNumber: function(e) {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      console.log(e)
      var self = this;
      //用户拒绝获取手机号
      if (!e.detail.iv) {
        wx.showToast({
          title: '请先获取手机号码',
          icon: "none"
        })
        return;
      } else {
        wx.showLoading({
          title: '正在跳转...',
        })
      }
      var accesstoken = getApp().core.getStorageSync(getApp().const.ACCESS_TOKEN);
      wx.login({
        success(res) {
          app.request({
            url: getApp().api.empower,
            method: 'POST',
            data: {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              code: res.code,
            },
            success: function(res) {
              wx.hideLoading()
              console.log("请求手机号码返回值", res)
              wx.setStorageSync('mobile', res.data.dataObj);
              // if (res.data == 1) { //我后台设置的返回值为1是正确
              //存入缓存即可
              if (res.data != 1) {
                wx.setStorageSync('mobile', res.data.dataObj);
              }
              var mobile = res.data.dataObj;
              if (res.data == 1) {
                mobile = wx.getStorageSync("mobile");
              }
              let pages = getCurrentPages();
              let curPage = pages[0]
              var img = '';
              if (curPage.options.imgSrc) {
                img = curPage.options.imgSrc
              } else {
                img = self.data.imgSrc
              }
              wx.navigateTo({
                url: "/pages1/modifyCard/modifyCard?img=" + wx.getStorageSync('user_info').avatarUrl + '&nickname=' + wx.getStorageSync('user_info').nickName + '&mobile=' + wx.getStorageSync('phone'),
              })
              // }
            }
          })
        }
      })
    } else {
      util.checkLogin();
    }
  },
  //点击跳转到创建卡片
  linkCreateCard: function() {
    console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊")
    let self = this;
    let pages = getCurrentPages();
    let curPage = pages[0]
    console.log(curPage)
    let img = curPage.options.imgSrc;
    wx.navigateTo({
      url: "/pages1/createCard/createCard?img=" + img + '&nickname=' + self.data.nickname + '&mobile=' + self.data.mobile,
    })
  },
  //点击联系客服
  connect_service() {
    wx.makePhoneCall({
      phoneNumber: "18206072787",
    })

  },
  onLoad: function(options) {
    if(!wx.getStorageSync("ACCESS_TOKEN")){
      util.checkLogin();
    }
    getApp().request({
      url: getApp().api.index1,
      method: "POST",
      params: {
        'card_id': '7'
      },
      success: function(res) {
        if (res.code == 0) {
          wx.reLaunch({
            url: '/pages1/homePage/homePage',
          })
        }
      }
    })
    this.setData({
      imgSrc: options.imgSrc,
      nickname: options.nickname,
      mobile: options.mobile,
    })
  },
})